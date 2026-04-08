import { createSlice } from '@reduxjs/toolkit';

const REPORTS_CACHE_TTL_MS = 60 * 1000;

const initialState = {
  items: [],
  lastFetchedAt: 0,
  hasFetched: false,
};

const reportsSlice = createSlice({
  name: 'reportsCache',
  initialState,
  reducers: {
    setReportsCache: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.lastFetchedAt = Date.now();
      state.hasFetched = true;
    },
    clearReportsCache: () => initialState,
  },
});

export const { setReportsCache, clearReportsCache } = reportsSlice.actions;

export const reportsCacheReducer = reportsSlice.reducer;

export const selectCachedReports = (state) => state.reportsCache.items;
export const selectReportsCacheMeta = (state) => ({
  hasFetched: state.reportsCache.hasFetched,
  lastFetchedAt: state.reportsCache.lastFetchedAt,
});

export const selectIsReportsCacheFresh = (state) => {
  if (!state.reportsCache.hasFetched) return false;
  return Date.now() - state.reportsCache.lastFetchedAt < REPORTS_CACHE_TTL_MS;
};
