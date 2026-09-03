"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            RF
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            RecruitFlow
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-indigo-600 transition-colors">
            Features
          </Link>
          <Link href="#candidates" className="hover:text-indigo-600 transition-colors">
            For Candidates
          </Link>
          <Link href="#employers" className="hover:text-indigo-600 transition-colors">
            For Employers
          </Link>
          <Link href="#pricing" className="hover:text-indigo-600 transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-sm shadow-indigo-500/25 transition-all hover:shadow-md hover:shadow-indigo-500/30 active:scale-[0.98]"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 hover:text-indigo-600 py-1"
          >
            Features
          </Link>
          <Link
            href="#candidates"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 hover:text-indigo-600 py-1"
          >
            For Candidates
          </Link>
          <Link
            href="#employers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 hover:text-indigo-600 py-1"
          >
            For Employers
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 hover:text-indigo-600 py-1"
          >
            Pricing
          </Link>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              className="text-center text-sm font-medium text-slate-700 hover:bg-slate-100 py-2 rounded-lg"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
