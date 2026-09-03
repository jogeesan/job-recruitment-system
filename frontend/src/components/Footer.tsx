import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-10 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            RF
          </div>
          <span className="font-bold text-slate-800">RecruitFlow</span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            © 2025 RecruitFlow Inc. All rights reserved.
          </span>
        </div>

        {/* Right links */}
        <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-500">
          <Link href="#" className="hover:text-indigo-600 transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-indigo-600 transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-indigo-600 transition-colors">
            Documentation
          </Link>
          <Link href="#" className="hover:text-indigo-600 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
