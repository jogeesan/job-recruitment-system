"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Eye, EyeOff, Loader2, Briefcase, AlertCircle,
  User, Mail, Lock, Phone, ChevronDown
} from "lucide-react";
import { registerApi } from "@/lib/auth";
import { useAuth } from "@/store/authStore";

// ─── Schema ───────────────────────────────────────────────────────────────────
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  roleName: z.enum(["JOB_SEEKER", "HR"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type RegisterForm = z.infer<typeof registerSchema>;

const ROLES = [
  { value: "JOB_SEEKER", label: "Job Seeker", description: "Looking for opportunities" },
  { value: "HR", label: "HR / Recruiter", description: "Hiring for a company" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { roleName: "JOB_SEEKER" },
  });

  const selectedRole = watch("roleName");

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      const { confirmPassword, ...payload } = data;
      void confirmPassword;
      const authData = await registerApi(payload);
      login(authData);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Registration failed. Try again.";
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-700/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-violet-700/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            TalentBridge
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">Create account</h1>
            <p className="text-sm text-gray-400 mt-1">
              Join TalentBridge to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Server Error */}
            {serverError && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`relative flex flex-col p-3 rounded-xl border cursor-pointer transition-all duration-200
                      ${selectedRole === role.value
                        ? "border-violet-500/60 bg-violet-500/10"
                        : "border-white/[0.08] bg-white/[0.03] hover:border-white/20"
                      }`}
                  >
                    <input
                      {...register("roleName")}
                      type="radio"
                      value={role.value}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-white">{role.label}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{role.description}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    {...register("firstName")}
                    placeholder="John"
                    className={`w-full bg-white/[0.06] border rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-gray-500 text-sm outline-none transition-all duration-200
                      focus:border-violet-500/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-violet-500/20
                      ${errors.firstName ? "border-red-500/60" : "border-white/[0.10]"}`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-400">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Last name</label>
                <input
                  {...register("lastName")}
                  placeholder="Doe"
                  className={`w-full bg-white/[0.06] border rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 text-sm outline-none transition-all duration-200
                    focus:border-violet-500/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-violet-500/20
                    ${errors.lastName ? "border-red-500/60" : "border-white/[0.10]"}`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full bg-white/[0.06] border rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-gray-500 text-sm outline-none transition-all duration-200
                    focus:border-violet-500/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-violet-500/20
                    ${errors.email ? "border-red-500/60" : "border-white/[0.10]"}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Phone (optional) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">
                Phone <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/[0.06] border border-white/[0.10] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-gray-500 text-sm outline-none transition-all duration-200 focus:border-violet-500/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className={`w-full bg-white/[0.06] border rounded-xl pl-9 pr-12 py-2.5 text-white placeholder:text-gray-500 text-sm outline-none transition-all duration-200
                    focus:border-violet-500/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-violet-500/20
                    ${errors.password ? "border-red-500/60" : "border-white/[0.10]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  className={`w-full bg-white/[0.06] border rounded-xl pl-9 pr-12 py-2.5 text-white placeholder:text-gray-500 text-sm outline-none transition-all duration-200
                    focus:border-violet-500/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-violet-500/20
                    ${errors.confirmPassword ? "border-red-500/60" : "border-white/[0.10]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                text-white font-semibold rounded-xl py-3 text-sm
                transition-all duration-200 shadow-lg shadow-violet-500/25
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 mt-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
