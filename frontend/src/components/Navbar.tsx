"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useAuth } from "@/store/authStore";

const links = [{ href: "/#candidates", label: "For job seekers" }, { href: "/#employers", label: "For employers" }];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const destination = user ? (user.role === "ADMIN" ? "/admin" : user.role === "HR" ? "/company" : "/job-seeker") : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <a href="#main-content" className="sr-only rounded-lg bg-white p-3 text-indigo-700 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">Skip to content</a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 sm:px-8">
        <Link href="/" aria-label="RecruitFlow home" className="flex items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">RF</span><span className="text-xl font-semibold tracking-tight text-slate-900">RecruitFlow</span></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">{links.map(link => <Link key={link.href} href={link.href} className="rounded text-sm font-medium text-slate-600 transition hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">{link.label}</Link>)}</nav>
        <div className="flex items-center gap-3">
          {!isLoading && <Link href={destination} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">{user ? "Dashboard" : "Sign in"}<ArrowRight aria-hidden="true" className="hidden h-4 w-4 sm:block" /></Link>}
          <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600 md:hidden">{open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}</button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="space-y-1 border-t border-slate-100 px-6 py-3 md:hidden">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">{link.label}</Link>)}</nav>}
    </header>
  );
}
