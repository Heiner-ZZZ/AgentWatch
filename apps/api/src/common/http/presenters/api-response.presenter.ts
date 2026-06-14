export function apiResponse<T>(data: T, message?: string) {
  return {
    message: message ?? null,
    data,
  };
}
