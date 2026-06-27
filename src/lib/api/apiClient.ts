import axios, { AxiosInstance, AxiosError } from "axios";

// Single axios instance — auth via HttpOnly cookie (withCredentials).
// Never reads localStorage for tokens: the server sets the "token" cookie on
// login/register and the browser sends it automatically on every request.
const apiClient: AxiosInstance = axios.create({
  baseURL:         "/api",
  timeout:         15_000,
  headers:         { "Content-Type": "application/json" },
  withCredentials: true,   // sends HttpOnly "token" cookie automatically
});

// 401 → clear stale UI caches and redirect to sign-in
apiClient.interceptors.response.use(
  res => res,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("account_type");
      localStorage.removeItem("user_display");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  const axiosErr = error as AxiosError<{ message?: string }>;
  return axiosErr?.response?.data?.message ?? "An unexpected error occurred";
}

export function isSuccessResponse(response: unknown): boolean {
  return (response as any)?.data?.success === true;
}
