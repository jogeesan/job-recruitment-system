// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface AuthUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "HR" | "JOB_SEEKER";
  status: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  roleName?: string;
  companyName?: string;
  companySize?: string;
}
