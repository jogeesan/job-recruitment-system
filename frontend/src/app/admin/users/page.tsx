"use client";
import { Search, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getAdminUsers, updateAdminUserStatus } from "@/lib/admin";
import type { AdminUser } from "@/types/admin";
export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => { getAdminUsers().then(setItems).catch(() => setError("We could not load users.")).finally(() => setIsLoading(false)); }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery = !normalized || `${item.firstName} ${item.lastName} ${item.email}`.toLowerCase().includes(normalized);
      return matchesQuery && (!roleFilter || item.role === roleFilter) && (!statusFilter || item.status === statusFilter);
    });
  }, [items, query, roleFilter, statusFilter]);

  async function change(item: AdminUser, status: string) {
    setUpdatingId(item.id);
    setError(null);
    try { const updated = await updateAdminUserStatus(item.id, status); setItems((current) => current.map((x) => x.id === updated.id ? updated : x)); }
    catch { setError("We could not update this user."); }
    finally { setUpdatingId(null); }
  }

  return <ProtectedDashboard role="ADMIN"><div className="space-y-6"><header><p className="text-sm font-medium text-[#5b55dc]">Administration</p><h1 className="mt-1 text-3xl font-bold">Users</h1><p className="mt-2 text-sm text-slate-500">Review platform accounts and manage their access status.</p></header>{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_180px_180px]"><label className="relative block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email" aria-label="Search users" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#5b55dc]" /></label><select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Filter by role" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"><option value="">All roles</option>{Array.from(new Set(items.map((item) => item.role))).map((role) => <option key={role} value={role}>{formatLabel(role)}</option>)}</select><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"><option value="">All statuses</option>{Array.from(new Set(items.map((item) => item.status))).map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}</select></div>{isLoading && <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />}{!isLoading && filteredItems.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><UserRound className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">No users found</p><p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p></div>}{!isLoading && filteredItems.length > 0 && <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Joined</th><th className="p-4">Status</th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"><td className="p-4"><p className="font-semibold text-slate-900">{item.firstName} {item.lastName}</p><p className="text-xs text-slate-500">{item.email}</p></td><td className="p-4"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{formatLabel(item.role)}</span></td><td className="p-4 text-slate-500">{formatDate(item.createdAt)}</td><td className="p-4"><div className="flex items-center gap-2"><StatusBadge status={item.status} /><select disabled={updatingId === item.id} value={item.status} onChange={(e) => void change(item, e.target.value)} aria-label={`Update status for ${item.email}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-60"><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option><option value="INACTIVE">Inactive</option></select></div></td></tr>)}</tbody></table></div>}</div></ProtectedDashboard>;
}

function StatusBadge({ status }: { status: string }) { const styles: Record<string, string> = { ACTIVE: "bg-emerald-50 text-emerald-700", SUSPENDED: "bg-amber-50 text-amber-700", INACTIVE: "bg-slate-100 text-slate-700" }; return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-indigo-50 text-indigo-700"}`}>{formatLabel(status)}</span>; }
function formatLabel(value: string): string { return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
function formatDate(value: string): string { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
