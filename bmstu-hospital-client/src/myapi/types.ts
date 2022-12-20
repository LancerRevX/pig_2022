import {getCsrfToken} from '@/csrf'

export const SERVER = 'http://127.0.0.1:8000/api/'

export let requestInit: () => RequestInit = () => ({
  credentials: 'include',
  headers: {
    'X-CSRFToken': getCsrfToken() as string,
    // 'Content-Type': 'application/json'
  }
})






