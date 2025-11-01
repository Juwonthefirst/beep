export interface CurrentUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthSuccessResponse {
  user?: CurrentUser;
  status?: string;
}
export interface AuthErrorResponse {
  error: string;
}

export type AuthResponse = AuthErrorResponse | AuthSuccessResponse;
