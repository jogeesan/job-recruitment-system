"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { loginApi } from "@/lib/auth";
import { useAuth } from "@/store/authStore";

// ─── Validation Schema ────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginForm = z.infer<typeof loginSchema>;

function LoginContent() {
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const roleParam = searchParams.get("role");
  const initialRole = roleParam === "HR" ? "HR" : "JOB_SEEKER";

  const [selectedRole, setSelectedRole] = useState<"JOB_SEEKER" | "HR">(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      const authData = await loginApi(data);
      login(authData);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Sign in failed. Please try again.";
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col lg:flex-row selection:bg-indigo-600 selection:text-white">
      {/* ─── Left Dark Branding Panel ────────────────────────────────────────── */}
      <div className="lg:w-[45%] bg-[#080e1a] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle radial glows / decorative geometric circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              RF
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              RecruitFlow
            </span>
          </Link>
        </div>

        {/* Center Hero Copy */}
        <div className="relative z-10 py-12 lg:py-0 max-w-lg space-y-6">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#16223e] border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            Welcome Back
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.14]">
            Continue your recruitment journey.
          </h1>

          <p className="text-slate-400 text-base leading-relaxed">
            Access jobs, candidates, interviews, and insights from one secure workspace.
          </p>
        </div>

        {/* Bottom Testimonial / Value Prop Card */}
        <div className="relative z-10">
          <div className="rounded-2xl bg-[#121c33]/80 border border-[#1d2d52] p-6 backdrop-blur-md shadow-xl">
            <p className="text-slate-200 text-sm leading-relaxed mb-4">
              &ldquo;Everything you need to move from application to offer — clearly organized.&rdquo;
            </p>
            <div className="text-[11px] font-bold tracking-widest text-sky-400 uppercase">
              Secure • Centralized • Role-Based
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ────────────────────────────────────────────────── */}
      <div className="lg:w-[55%] flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-300/40 border border-slate-100">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sign in to RecruitFlow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose your role and enter your account details.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              I am signing in as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("JOB_SEEKER")}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedRole === "JOB_SEEKER"
                    ? "border-2 border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("HR")}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedRole === "HR"
                    ? "border-2 border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                HR / Company
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Server Error */}
            {serverError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder={
                    selectedRole === "HR" ? "name@company.com" : "name@example.com"
                  }
                  className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                    errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full bg-white border rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                    errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3 text-sm shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400 font-medium">
              New to RecruitFlow?
            </span>
          </div>

          {/* Create new account Button */}
          <Link
            href={`/register?role=${selectedRole}`}
            className="w-full block text-center bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-xl py-2.5 text-sm transition-all hover:border-slate-300 active:scale-[0.99]"
          >
            Create a new account
          </Link>

          {/* Footer Terms */}
          <p className="text-[11px] text-slate-400 text-center mt-6">
            By signing in, you agree to the Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
