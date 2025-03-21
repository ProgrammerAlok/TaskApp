import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

export const endpoints = {
  auth: {
    signup: `/api/v1/auth/register`,
    signin: `/api/v1/auth/login`,
    signout: `/api/v1/auth/logout`,
    me: `/api/v1/auth/me`,
  },
  task: {
    create: `/api/v1/t/tasks`,
    get: `/api/v1/t/tasks`,
    update: `/api/v1/t/task`,
    delete: (id: string) => `/api/v1/t/tasks/${id}`,
  },
};
