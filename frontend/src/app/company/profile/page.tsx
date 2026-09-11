"use client";

import { FormEvent, useEffect, useState } from "react";
import { Building2, CheckCircle2, Globe2, MapPin, Save } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getCompanyProfile, updateCompanyProfile } from "@/lib/company";
import type { CompanyProfile } from "@/types/company";

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => { getCompanyProfile().then(setProfile).catch(() => setMessage("We could not load your company profile.")).finally(() => setIsLoading(false)); }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;
    setMessage(null);
    setIsSaving(true);
    try {
      const updated = await updateCompanyProfile({
        ...profile,
        industry: profile.industry || null,
        website: profile.website || null,
        logoUrl: profile.logoUrl || null,
        address: profile.address || null,
        city: profile.city || null,
        country: profile.country || null,
        companySize: profile.companySize || null,
        description: profile.description || null,
      });
      setProfile(updated);
      setMessage("Company profile updated successfully.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "We could not save your company profile.");
    } finally {
      setIsSaving(false);
    }
  }
  return <ProtectedDashboard role="HR"><div className="space-y-6"><header className="flex flex-wrap items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-[#5b55dc]">{profile?.logoUrl ? <img src={profile.logoUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" /> : <Building2 className="h-8 w-8" />}</div><div><p className="text-sm font-medium text-[#5b55dc]">HR Portal</p><h1 className="mt-1 text-3xl font-bold">{profile?.companyName || "Company Profile"}</h1><p className="mt-2 text-sm text-slate-500">{profile?.industry || "Keep your public company information accurate."}</p></div></header>{isLoading && <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white" />}{!isLoading && profile && <form onSubmit={submit} className="space-y-6"><section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><Building2 className="mt-0.5 h-5 w-5 text-[#5b55dc]" /><div><h2 className="text-lg font-bold">Company information</h2><p className="mt-1 text-sm text-slate-500">Maintain the company details visible to candidates.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Company name" value={profile.companyName} required onChange={(value) => setProfile({ ...profile, companyName: value })} /><Field label="Industry" value={profile.industry ?? ""} onChange={(value) => setProfile({ ...profile, industry: value })} /><Field label="Website" type="url" value={profile.website ?? ""} onChange={(value) => setProfile({ ...profile, website: value })} /><Field label="Company size" value={profile.companySize ?? ""} onChange={(value) => setProfile({ ...profile, companySize: value })} /><Field label="Address" value={profile.address ?? ""} onChange={(value) => setProfile({ ...profile, address: value })} /><Field label="City" value={profile.city ?? ""} onChange={(value) => setProfile({ ...profile, city: value })} /><Field label="Country" value={profile.country ?? ""} onChange={(value) => setProfile({ ...profile, country: value })} /><label className="text-sm font-medium text-slate-700 sm:col-span-2">Description<textarea value={profile.description ?? ""} onChange={(e) => setProfile({ ...profile, description: e.target.value })} rows={5} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10" /></label></div></section><section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /><div><h2 className="text-lg font-bold">Verification status</h2><p className="mt-1 text-sm text-slate-500">Verification is managed by the platform administrator.</p></div></div><StatusBadge status={profile.verificationStatus} /></div></section>{message && <p role="status" className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{message}</p>}<button disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c47c7] disabled:cursor-not-allowed disabled:opacity-60"><Save className="h-4 w-4" />{isSaving ? "Saving..." : "Save changes"}</button></form>}</div></ProtectedDashboard>;
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="text-sm font-medium text-slate-700">{label}<input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10" /></label>;
}

function StatusBadge({ status }: { status: string }) { const styles: Record<string, string> = { VERIFIED: "bg-emerald-50 text-emerald-700", PENDING: "bg-amber-50 text-amber-700", REJECTED: "bg-red-50 text-red-700" }; return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-slate-100 text-slate-700"}`}>{formatLabel(status)}</span>; }
function formatLabel(value: string): string { return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
