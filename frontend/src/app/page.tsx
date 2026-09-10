"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Briefcase,
  Users,
  Calendar,
  Bell,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  UserCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Sticky Header */}
      <Navbar />

      <main className="flex-1">
        {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          {/* Subtle decorative background gradient glows */}
          <div className="absolute top-0 -left-20 w-[550px] h-[550px] bg-indigo-100/60 rounded-full blur-[130px] pointer-events-none -z-10" />
          <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-violet-100/50 rounded-full blur-[120px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline & CTA */}
              <div className="lg:col-span-7 space-y-6">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI-Powered Matching Platform</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  Where great talent <br className="hidden sm:inline" />
                  meets the{" "}
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
                    right opportunity.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                  Eliminate recruitment friction for job seekers and hiring teams
                  alike — from first search to final hire.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/register?role=JOB_SEEKER"
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/35 active:scale-[0.98]"
                  >
                    Find your next role
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/register?role=HR"
                    className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300 active:scale-[0.98]"
                  >
                    Post a job
                  </Link>
                </div>

                {/* Trust Proof Metrics */}
                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>2,500+ companies</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>50k+ active applicants</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>94% match accuracy</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Candidate Pipeline Preview Card */}
              <div className="lg:col-span-5 relative">
                {/* Floating Candidate Pipeline Dashboard Frame */}
                <div className="relative rounded-2xl bg-white shadow-2xl shadow-indigo-900/10 border border-slate-100 overflow-hidden">
                  {/* Window Bar */}
                  <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                      Candidate Pipeline
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      Live
                    </span>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Top Stat Pills */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-indigo-50/70 border border-indigo-100/60 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-indigo-700">124</div>
                        <div className="text-[11px] font-medium text-slate-500">Applied</div>
                      </div>
                      <div className="bg-sky-50/70 border border-sky-100/60 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-sky-700">48</div>
                        <div className="text-[11px] font-medium text-slate-500">Shortlisted</div>
                      </div>
                      <div className="bg-amber-50/70 border border-amber-100/60 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-amber-700">18</div>
                        <div className="text-[11px] font-medium text-slate-500">Interview</div>
                      </div>
                    </div>

                    {/* Top Matches Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Top Matches
                        </span>
                        <span className="text-xs text-indigo-600 font-medium hover:underline cursor-pointer">
                          View all
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {/* Candidate 1 */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              AM
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                Alex Morgan
                              </div>
                              <div className="text-xs text-slate-500">
                                Senior React Developer
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                            96% Match
                          </span>
                        </div>

                        {/* Candidate 2 */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              SL
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                Sarah Lin
                              </div>
                              <div className="text-xs text-slate-500">
                                Product Designer UI/UX
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                            89% Match
                          </span>
                        </div>

                        {/* Candidate 3 */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              DK
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                David Kim
                              </div>
                              <div className="text-xs text-slate-500">
                                Full Stack Engineer
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                            84% Match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Role-Based Experiences Section ───────────────────────────────────── */}
        <section className="py-16 sm:py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
                Role-Based Design
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                One platform. Two focused experiences.
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                Every feature respects whether you&apos;re looking for work or building a team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Card 1: Job Seeker */}
              <div className="group relative rounded-2xl bg-[#fafbfc] border border-slate-200/80 p-8 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 transition-transform">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Job Seeker</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Personalized job matches, one-click applications, and real-time status
                    tracking in one clean place.
                  </p>
                </div>
                <Link
                  href="/register?role=JOB_SEEKER"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group-hover:gap-2.5 transition-all"
                >
                  Explore Seeker
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 2: HR / Company */}
              <div className="group relative rounded-2xl bg-[#fafbfc] border border-slate-200/80 p-8 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center font-bold text-lg mb-5 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">HR / Company</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Streamlined candidate pipelines, team collaboration, and automated
                    screening to hire faster.
                  </p>
                </div>
                <Link
                  href="/register?role=HR"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group-hover:gap-2.5 transition-all"
                >
                  Explore Hiring
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How It Works Section ────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 bg-[#fafbfc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
                How It Works
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                From opportunity to offer — without the chaos.
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                Three simple paths designed to take the friction out of the hiring journey.
              </p>
            </div>

            {/* Steps Timeline Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative mb-16">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
                  01
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  Create your profile
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Set up your personal or company profile in minutes.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
                  02
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  Discover & connect
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Match with ideal candidates or dream roles effortlessly.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
                  03
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  Manage the process
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Track applications, review materials, and schedule interviews.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
                  04
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  Hire with clarity
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Make confident decisions backed by rich profiles and feedback.
                </p>
              </div>
            </div>

            {/* Dark Highlight Banner */}
            <div className="rounded-2xl bg-[#0b132b] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-900/10">
              <p className="text-base sm:text-lg font-medium text-slate-200 text-center md:text-left">
                &ldquo;Recruitment should be clear, human, and measurable — for everyone
                involved.&rdquo;
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/30 flex-shrink-0"
              >
                Start your journey
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Complete Toolset Section ────────────────────────────────────────── */}
        <section id="features" className="py-16 sm:py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
                Complete Toolset
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Powerful tools, thoughtfully organized.
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                Purpose-built workflows for both candidates and recruitment teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-[#fafbfc] border border-slate-200/80 rounded-2xl p-7 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center font-bold text-sm mb-4 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Job management</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Publish, manage, and distribute listings with ease and flexibility.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#fafbfc] border border-slate-200/80 rounded-2xl p-7 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-sky-100/80 text-sky-600 flex items-center justify-center font-bold text-sm mb-4 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Applicant tracking</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A clean Kanban-style pipeline to move candidates through stages.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#fafbfc] border border-slate-200/80 rounded-2xl p-7 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center font-bold text-sm mb-4 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Interview coordinator
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Schedule, send reminders, and collect interviewer feedback.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#fafbfc] border border-slate-200/80 rounded-2xl p-7 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center font-bold text-sm mb-4 group-hover:scale-105 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Smart notifications</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never miss a status update, interview request, or candidate reply.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#fafbfc] border border-slate-200/80 rounded-2xl p-7 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-violet-100/80 text-violet-600 flex items-center justify-center font-bold text-sm mb-4 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Reports & insights</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Understand pipeline health, time-to-hire, and source effectiveness.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#fafbfc] border border-slate-200/80 rounded-2xl p-7 hover:border-indigo-300 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-600 flex items-center justify-center font-bold text-sm mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Security & access</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Role-based permissions to protect candidate and company data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Proven Impact (Dark Navy Section) ─────────────────────────────────── */}
        <section className="py-20 bg-[#080e1a] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
              Proven Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-14">
              Built for confident, data-informed decisions.
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  100%
                </div>
                <div className="text-sm text-slate-400 mt-2 font-medium">
                  Data encryption
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  3x
                </div>
                <div className="text-sm text-slate-400 mt-2 font-medium">
                  Faster time-to-hire
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  24/7
                </div>
                <div className="text-sm text-slate-400 mt-2 font-medium">
                  Pipeline visibility
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  1
                </div>
                <div className="text-sm text-slate-400 mt-2 font-medium">
                  Unified platform
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Customer Success / Testimonial Section ───────────────────────────── */}
        <section className="py-20 bg-[#fafbfc]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Quote */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
                  Customer Success
                </span>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
                  &ldquo;At last, a recruitment workspace where every role sees exactly what
                  matters — and nothing gets lost between application and offer.&rdquo;
                </p>
                <div className="pt-2">
                  <div className="font-bold text-slate-900">Maria Chen</div>
                  <div className="text-sm text-slate-500">Lead Hiring Specialist</div>
                </div>
              </div>

              {/* Mini Hiring Progress Card */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200/70 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Hiring progress</h5>
                    <p className="text-xs text-slate-500">Frontend Engineering Team</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                    12 / 15 Hired
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>Sourced</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full w-[85%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>Screened</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-sky-500 h-2 rounded-full w-[60%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>Interview</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full w-[40%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>Offer</span>
                      <span>20%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[20%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Bottom CTA Banner ───────────────────────────────────────────────── */}
        <section className="pb-24 bg-[#fafbfc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white p-10 sm:p-14 overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  Ready to get started?
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Your next great match starts here.
                </h2>
                <p className="text-indigo-100 text-base leading-relaxed">
                  Join thousands of candidates and companies growing with RecruitFlow today.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    href="/register?role=JOB_SEEKER"
                    className="inline-flex items-center justify-center bg-white text-indigo-700 hover:bg-slate-50 font-semibold px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]"
                  >
                    Find Your Next Role
                  </Link>
                  <Link
                    href="/register?role=HR"
                    className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition-all backdrop-blur-md active:scale-[0.98]"
                  >
                    Hire Great Talent
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
