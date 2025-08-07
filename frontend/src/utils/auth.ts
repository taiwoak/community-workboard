export const getToken = () => localStorage.getItem('token');
export const saveToken = (token: string) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

export const getRole = () => localStorage.getItem('role');
export const saveRole = (role: string) => localStorage.setItem('role', role);