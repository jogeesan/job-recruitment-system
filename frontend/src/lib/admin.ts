import api from "@/lib/api";
import type { ApiResponse } from "@/types/auth";
import type { AdminApplication, AdminCompany, AdminDashboard, AdminJob, AdminUser, Skill } from "@/types/admin";
async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> { const response = await request; if (!response.data.success) throw new Error(response.data.message); return response.data.data; }
export const getAdminDashboard = () => unwrap<AdminDashboard>(api.get("/api/admin/dashboard"));
export const getAdminUsers = () => unwrap<AdminUser[]>(api.get("/api/admin/users"));
export const updateAdminUserStatus = (id: number, status: string) => unwrap<AdminUser>(api.put(`/api/admin/users/${id}/status`, { status }));
export const getAdminCompanies = () => unwrap<AdminCompany[]>(api.get("/api/admin/companies"));
export const updateCompanyVerification = (id: number, status: string) => unwrap<AdminCompany>(api.put(`/api/admin/companies/${id}/verification`, null, { params: { status } }));
export const getAdminJobs = () => unwrap<AdminJob[]>(api.get("/api/admin/jobs"));
export const updateAdminJobStatus = (id: number, status: string) => unwrap<AdminJob>(api.put(`/api/admin/jobs/${id}/status`, null, { params: { status } }));
export const getAdminApplications = () => unwrap<AdminApplication[]>(api.get("/api/admin/applications"));
export const getSkills = () => unwrap<Skill[]>(api.get("/api/admin/skills"));
export const createSkill = (name: string) => unwrap<Skill>(api.post("/api/admin/skills", { name }));
export async function deleteSkill(id: number) { const response = await api.delete<ApiResponse<null>>(`/api/admin/skills/${id}`); if (!response.data.success) throw new Error(response.data.message); }
