"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { getCompanyProfile, updateCompanyProfile } from "@/lib/company";
import type { CompanyProfile } from "@/types/company";

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => { getCompanyProfile().then(setProfile).catch(() => setMessage("We could not load your company profile.")); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); if (!profile) return; try { setProfile(await updateCompanyProfile(profile)); setMessage("Company profile updated successfully."); } catch { setMessage("We could not save your company profile."); } }
  return <ProtectedDashboard role="HR"><div className="max-w-3xl space-y-6"><header><p className="text-sm font-medium text-[#5b55dc]">HR Portal</p><h1 className="mt-1 text-3xl font-bold">Company Profile</h1><p className="mt-2 text-sm text-slate-500">Keep your public company information accurate.</p></header>{!profile && !message && <p className="text-sm text-slate-500">Loading profile...</p>}{profile && <form onSubmit={submit} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2"><Field label="Company name" value={profile.companyName} onChange={(value) => setProfile({ ...profile, companyName: value })} /><Field label="Industry" value={profile.industry ?? ""} onChange={(value) => setProfile({ ...profile, industry: value })} /><Field label="Website" value={profile.website ?? ""} onChange={(value) => setProfile({ ...profile, website: value })} /><Field label="Company size" value={profile.companySize ?? ""} onChange={(value) => setProfile({ ...profile, companySize: value })} /><Field label="City" value={profile.city ?? ""} onChange={(value) => setProfile({ ...profile, city: value })} /><Field label="Country" value={profile.country ?? ""} onChange={(value) => setProfile({ ...profile, country: value })} /><label className="text-sm font-medium text-slate-700 sm:col-span-2">Description<textarea value={profile.description ?? ""} onChange={(e) => setProfile({ ...profile, description: e.target.value })} rows={5} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label><p className="text-sm text-amber-700">Verification: {profile.verificationStatus}</p><button className="w-fit rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white">Save changes</button>{message && <p className="text-sm text-slate-600">{message}</p>}</form>}</div></ProtectedDashboard>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="text-sm font-medium text-slate-700">{label}<input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>;
}
