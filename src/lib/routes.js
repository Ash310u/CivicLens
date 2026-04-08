export const ROUTES = {
  home: '/',
  features: '/features',
  howItWorks: '/how-it-works',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  heatmap: '/heatmap',
  campaigns: '/campaigns',
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  citizen: {
    home: '/citizen',
    // report: '/citizen/report',
    // reports: '/citizen/reports',
    reportDetails: (id = ':id') => `/citizen/reports/${id}`,
    disposal: '/citizen/disposal',
    bulkPickup: '/citizen/bulk-pickup',
    assistant: '/citizen/assistant',
    guide: '/citizen/guide',
    profile: '/citizen/profile',
  },
  authority: {
    home: '/authority',
    queue: '/authority/queue',
    assign: '/authority/assign',
    resolution: '/authority/resolution',
    analytics: '/authority/analytics',
    escalation: '/authority/escalation',
    workers: '/authority/workers',
  },
  admin: {
    home: '/admin',
    analytics: '/admin/analytics',
    monitor: '/admin/monitor',
    users: '/admin/users',
    moderation: '/admin/moderation',
    campaigns: '/admin/campaigns',
  },
  organization: {
    home: '/organization',
    compliance: '/organization/compliance',
    tracking: '/organization/tracking',
    participation: '/organization/participation',
  },
};

const rawBaseUrl = import.meta.env.BASE_URL || '/';
export const APP_BASENAME = rawBaseUrl === '/' ? '/' : rawBaseUrl.replace(/\/+$/, '');

export const ROLE_HOME_PATHS = {
  citizen: ROUTES.citizen.home,
  authority: ROUTES.authority.home,
  admin: ROUTES.admin.home,
  organization: ROUTES.organization.home,
};

export function getRoleHomePath(role) {
  return ROLE_HOME_PATHS[role] || ROUTES.citizen.home;
}
