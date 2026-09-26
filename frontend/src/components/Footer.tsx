export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-semibold tracking-tight text-slate-900">RecruitFlow <span className="ml-2 font-normal text-slate-500">Recruitment &amp; applicant tracking</span></p>
        <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} RecruitFlow</p>
      </div>
    </footer>
  );
}
