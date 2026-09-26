"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Code2, Plus, Search, Trash2 } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { createSkill, deleteSkill, getSkills } from "@/lib/admin";
import type { Skill } from "@/types/admin";

export default function AdminSkillsPage() {
  const [items, setItems] = useState<Skill[]>([]);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getSkills()
      .then(setItems)
      .catch(() => setError("We could not load skills."))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => !normalized || item.name.toLowerCase().includes(normalized));
  }, [items, query]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    setFormError(null);
    setError(null);

    if (!trimmedName) {
      setFormError("Enter a skill name before adding it.");
      return;
    }

    if (items.some((item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase())) {
      setFormError("This skill already exists.");
      return;
    }

    setIsSaving(true);
    try {
      const skill = await createSkill(trimmedName);
      setItems((current) => [...current, skill].sort((first, second) => first.name.localeCompare(second.name)));
      setName("");
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "We could not create the skill.");
    } finally {
      setIsSaving(false);
    }
  }

  async function remove(item: Skill) {
    if (!window.confirm(`Delete the skill "${item.name}"?`)) return;
    setDeletingId(item.id);
    setError(null);
    try {
      await deleteSkill(item.id);
      setItems((current) => current.filter((skill) => skill.id !== item.id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not delete the skill.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ProtectedDashboard role="ADMIN">
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">Administration</p>
          <h1 className="mt-1 text-3xl font-bold">Skills</h1>
          <p className="mt-2 text-sm text-slate-500">Manage the skills available when job seekers build their profiles.</p>
        </header>

        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-indigo-50 p-2.5 text-[#5b55dc]"><Plus className="h-5 w-5" /></div>
            <div>
              <h2 className="font-bold text-slate-900">Add a skill</h2>
              <p className="mt-1 text-sm text-slate-500">Create a reusable skill option for job seeker profiles.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input value={name} onChange={(event) => { setName(event.target.value); setFormError(null); }} placeholder="Enter skill name" aria-label="Skill name" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc]" />
            <button disabled={isSaving} type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c47c7] disabled:cursor-not-allowed disabled:opacity-60"><Plus className="h-4 w-4" />{isSaving ? "Adding..." : "Add skill"}</button>
          </div>
          {formError && <p role="alert" className="mt-3 text-sm text-red-600">{formError}</p>}
        </form>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-xl font-bold">Available skills</h2><p className="mt-1 text-sm text-slate-500">{items.length} skill{items.length === 1 ? "" : "s"} configured</p></div>
            <label className="relative block sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills" aria-label="Search skills" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#5b55dc]" /></label>
          </div>

          {isLoading && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><div className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white" /><div className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white" /><div className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white" /></div>}
          {!isLoading && filteredItems.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><Code2 className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">{items.length === 0 ? "No skills configured" : "No skills found"}</p><p className="mt-1 text-sm text-slate-500">{items.length === 0 ? "Add the first skill using the form above." : "Try changing your search."}</p></div>}
          {!isLoading && filteredItems.length > 0 && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filteredItems.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"><div className="flex min-w-0 items-center gap-3"><div className="rounded-lg bg-slate-100 p-2 text-slate-500"><Code2 className="h-4 w-4" /></div><span className="truncate font-semibold text-slate-800">{item.name}</span></div><button type="button" disabled={deletingId === item.id} onClick={() => void remove(item)} aria-label={`Delete ${item.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 className="h-4 w-4" /></button></div>)}</div>}
        </section>
      </div>
    </ProtectedDashboard>
  );
}
