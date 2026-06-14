export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ADMIN_LOGIN: '/auth/login',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    BY_ID: (id: string) => `/users/${id}`,
  },
  VENDORS: {
    BASE: '/vendors',
    PROFILE: '/vendors/profile',
    BY_ID: (id: string) => `/vendors/${id}`,
    ANALYTICS: '/vendors/analytics',
  },
  VENUES: {
    // Public endpoints (no auth required)
    PUBLIC_BASE:'/v1/venues',
    PUBLIC_BY_ID:(id:string) =>   `/v1/venues/${id}`,

    // Vendor endpoints (require VENDOR role)

    VENDOR_BASE: '/v1/vendor/venues',
    VENDOR_BY_ID: (id: string) => `/v1/vendor/venues/${id}`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
    BY_USER: (userId: string) => `/users/${userId}/bookings`,
    BY_VENUE: (venueId: string) => `/venues/${venueId}/bookings`,
    BY_VENDOR: '/vendor/bookings',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    VENDORS: '/admin/vendors',
    VENUES: '/admin/venues',
    BOOKINGS: '/admin/bookings',
    ANALYTICS: '/admin/analytics',
  },
} as const;
