export type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  redirectUrl?: string;
};

export function createResponse<T = undefined>(
  success: boolean,
  message: string,
  data?: T,
  options: { redirectUrl?: string } = {},
): ApiResponse<T> {
  return {
    success,
    message,
    ...(data !== undefined && { data }),
    ...(options.redirectUrl && { redirectUrl: options.redirectUrl }),
  };
}
