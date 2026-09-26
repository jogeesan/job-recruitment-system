import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, BriefcaseBusiness, Building2, CalendarDays, Check, FileText, Search, UserRound } from "lucide-react";

const journey = [
  { icon: UserRound, title: "Build your profile", text: "Keep your experience, skills and resume together." },
  { icon: Search, title: "Find an opportunity", text: "Search vacancies and apply for a role that fits." },
  { icon: CalendarDays, title: "Follow your progress", text: "Track application updates and manage interviews." },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-indigo-100">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200 bg-[#f7f8fc]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-52 h-[650px] w-[650px] rounded-full border-[100px] border-indigo-100/40" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:py-28">
            <div>
              <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700"><span className="h-px w-8 bg-indigo-500" /> Recruitment, made simpler</p>
              <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Your next chapter.<br /><span className="text-indigo-600">Starts here.</span></h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">A place for people to find their next role and companies to build their teams. Keep every step of recruitment in one workspace.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/register?role=JOB_SEEKER" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">Find a role <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
                <Link href="/register?role=HR" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"><Building2 aria-hidden="true" className="h-4 w-4" /> Hire talent</Link>
              </div>
            </div>
            <div className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9">
              <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><BriefcaseBusiness aria-hidden="true" className="h-5 w-5" /></span>
                <div><p className="text-xs font-medium uppercase tracking-widest text-slate-500">The journey</p><h2 className="mt-1 text-lg font-semibold tracking-tight">From application to opportunity</h2></div>
              </div>
              <ol className="space-y-0">
                {journey.map(({ icon: Icon, title, text }, index) => (
                  <li key={title} className="relative flex gap-5 pb-8 last:pb-0">
                    {index < journey.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-5 top-11 w-px bg-slate-200" />}
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                    <div className="pt-1"><h3 className="text-sm font-semibold text-slate-900">{title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-500">{text}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section aria-labelledby="workspace-heading" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24">
          <div className="mb-10 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Built around your next move</p><h2 id="workspace-heading" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">The right tools, on both sides.</h2><p className="mt-4 leading-7 text-slate-500">Whether you are applying or hiring, stay organised from the first application to the final decision.</p></div>
          <div className="grid gap-6 md:grid-cols-2">
            <article id="candidates" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50/60 p-7 sm:p-9">
              <UserRound aria-hidden="true" className="mb-6 h-7 w-7 text-indigo-600" /><p className="text-xs font-semibold uppercase tracking-widest text-slate-500">For job seekers</p><h3 className="mt-3 text-2xl font-semibold tracking-tight">Move forward with clarity.</h3><p className="mt-4 text-sm leading-7 text-slate-600">Bring your experience together and keep your job search organised in a dedicated workspace.</p>
              <ul className="mt-6 space-y-4">{["Search jobs by keyword, location and employment type", "Save opportunities and apply with your resume", "View application history and respond to interviews"].map(text => <li key={text} className="flex gap-3 text-sm leading-6 text-slate-700"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-indigo-600" />{text}</li>)}</ul>
            </article>
            <article id="employers" className="scroll-mt-24 rounded-2xl bg-slate-900 p-7 text-white sm:p-9">
              <Building2 aria-hidden="true" className="mb-6 h-7 w-7 text-indigo-300" /><p className="text-xs font-semibold uppercase tracking-widest text-slate-400">For employers</p><h3 className="mt-3 text-2xl font-semibold tracking-tight">Give hiring a clear direction.</h3><p className="mt-4 text-sm leading-7 text-slate-300">Manage your vacancies and applicants together, with the information you need to take the next step.</p>
              <ul className="mt-6 space-y-4">{["Create, publish and manage your job vacancies", "Review applications, resumes and cover letters", "Update candidate statuses and schedule interviews"].map(text => <li key={text} className="flex gap-3 text-sm leading-6 text-slate-200"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-indigo-300" />{text}</li>)}</ul>
            </article>
          </div>
          <div className="mt-10 flex items-start gap-4 rounded-xl border border-slate-200 px-6 py-5 sm:items-center">
            <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" /><p className="text-sm leading-6 text-slate-600">Your profile, applications and interviews. <span className="font-medium text-slate-900">Together in one place.</span></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
