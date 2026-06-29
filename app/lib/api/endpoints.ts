export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',    
    login:    '/auth/login',         
    whoami:   '/auth/whoami',        
    update:   '/auth/update',
    updatePassword: '/auth/update',      
  },
} as const;