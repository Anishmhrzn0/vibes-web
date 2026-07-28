export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',    
    login:    '/auth/login',         
    whoami:   '/auth/whoami',        
    update:   '/auth/update',
    updatePassword: '/auth/update',
    forgotPassword: "/auth/forgot-password",
    resetPassword: (token: string) => `/auth/reset-password/${token}`,      
  },
} as const;