import api from "./api";
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

// ─── Login ────────────────────────────────────────────────────────────────────
export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>("/api/auth/login", data);
  if (!res.data.success) throw new Error(res.data.message);
  return res.data.data;
}

// ─── Register ─────────────────────────────────────────────────────────────────
export async function registerApi(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>("/api/auth/register", data);
  if (!res.data.success) throw new Error(res.data.message);
  return res.data.data;
}

// ─── Get Current User ─────────────────────────────────────────────────────────
export async function getMeApi(): Promise<AuthResponse> {
  const res = await api.get<ApiResponse<AuthResponse>>("/api/auth/me");
  if (!res.data.success) throw new Error(res.data.message);
  return res.data.data;
}
