import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { baseApi } from '@/store/api/baseApi';
import { useCreateUserMutation, useLoginMutation } from '@/store/api/usersApi';
import { clearToken as clearStoreToken, setToken as setStoreToken } from '@/store/store';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'civiclens-user';
const TOKEN_STORAGE_KEY = 'civiclens-token';

function readStoredJson(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null;

  let id = null;
  if (user.id !== undefined && user.id !== null) id = String(user.id);
  else if (user.userId !== undefined && user.userId !== null) id = String(user.userId);

  const address =
    user.address ??
    user.ward_id ??
    user.wardId ??
    user.ward ??
    null;

  return {
    ...user,
    id,
    role: user.role || 'citizen',
    // Normalize ward/address so all pages can rely on user.address,
    // while keeping ward_id as a backward-compatible alias.
    address,
    ward_id: address,
    city_id: user.city_id ?? user.cityId ?? user.city ?? null,
    org_id: user.org_id ?? user.orgId ?? null,
    impact_score: user.impact_score ?? user.impactScore ?? 0,
  };
}

/** Matches API shape: POST /api/users/login and POST /api/users/session (see API_USER_README.md). */
function parseAuthResponse(payload) {
  const root = payload?.data && typeof payload.data === 'object' ? payload.data : payload || {};

  const token =
    root.token ||
    root.jwt ||
    root.accessToken ||
    root.access_token ||
    null;

  let user =
    root.user ||
    root.currentUser ||
    root.profile ||
    (root.data && root.data.user) ||
    null;

  if (!user && root && (root.id || root.userId)) {
    user = root;
  }

  return { token, user: normalizeUser(user) };
}

function credentialsBody(email, password) {
  return {
    email: (email || '').trim().toLowerCase(),
    passwordHash: password,
  };
}

function buildCreateUserBody(data) {
  return {
    name: (data.name || '').trim(),
    email: (data.email || '').trim().toLowerCase(),
    passwordHash: data.password,
    role: data.role || 'citizen',
    city: (data.city || '').trim(),
    impactScore: 0,
  };
}

function getApiErrorMessage(error, fallbackMessage) {
  return (
    error?.data?.message ||
    error?.data?.error ||
    error?.error ||
    fallbackMessage
  );
}

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [createUser] = useCreateUserMutation();
  const [loginUser] = useLoginMutation();
  const [user, setUser] = useState(() => normalizeUser(readStoredJson(USER_STORAGE_KEY)));
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      dispatch(setStoreToken(token));
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      dispatch(clearStoreToken());
    }
  }, [dispatch, token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),

      async login(email, password) {
        try {
          const body = credentialsBody(email, password);
          const loginResult = await loginUser(body).unwrap();
          let { token: nextToken, user: nextUser } = parseAuthResponse(loginResult);

          if (!nextToken) {
            return { success: false, error: 'Invalid credentials' };
          }

          if (!nextUser) {
            try {
              dispatch(setStoreToken(nextToken));
              const session = await dispatch(
                baseApi.endpoints.getSession.initiate(undefined, { forceRefetch: true }),
              ).unwrap();
              const parsed = parseAuthResponse(session);
              nextUser =
                parsed.user ||
                normalizeUser(session?.user || session);
            } catch {
              nextUser = null;
            }
          }

          if (!nextUser) {
            return {
              success: false,
              error: 'Login succeeded but user profile could not be loaded.',
            };
          }

          setUser(nextUser);
          setToken(nextToken);
          return { success: true, user: nextUser };
        } catch (error) {
          return {
            success: false,
            error: getApiErrorMessage(error, 'Invalid credentials'),
          };
        }
      },

      async signup(data) {
        try {
          const createResult = await createUser(buildCreateUserBody(data)).unwrap();
          let { token: nextToken, user: nextUser } = parseAuthResponse(createResult);

          if (!nextUser) {
            nextUser = normalizeUser(createResult?.user || createResult);
          }

          if (!nextToken) {
            const loginResult = await loginUser(credentialsBody(data.email, data.password)).unwrap();
            const parsed = parseAuthResponse(loginResult);
            nextToken = parsed.token;
            nextUser = parsed.user || nextUser;
          }

          if (!nextUser || !nextToken) {
            return {
              success: false,
              error: 'Account was created, but automatic sign-in failed. Please log in manually.',
            };
          }

          setUser(nextUser);
          setToken(nextToken);
          return { success: true, user: nextUser };
        } catch (error) {
          return {
            success: false,
            error: getApiErrorMessage(error, 'Unable to create account right now.'),
          };
        }
      },

      logout() {
        setUser(null);
        setToken(null);
        dispatch(baseApi.util.resetApiState());
      },
    }),
    [createUser, dispatch, loginUser, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook export alongside provider is intentional for this module.
// eslint-disable-next-line react-refresh/only-export-components -- context + hook pattern
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
