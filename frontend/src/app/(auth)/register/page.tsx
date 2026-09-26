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
  ArrowLeft,
  AlertCircle,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { registerApi } from "@/lib/auth";
import { useAuth } from "@/store/authStore";

// ─── Validation Schemas ───────────────────────────────────────────────────────
const seekerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the Terms & Privacy Policy" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const hrSchema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid work email address"),
    companySize: z.string().min(1, "Please select company size"),
    phone: z.string().min(6, "Valid phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the Terms & Privacy Policy" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SeekerForm = z.infer<typeof seekerSchema>;
type HrForm = z.infer<typeof hrSchema>;

function RegisterContent() {
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const roleParam = searchParams.get("role");
  const initialRole = roleParam === "HR" ? "HR" : "JOB_SEEKER";

  const [role, setRole] = useState<"JOB_SEEKER" | "HR">(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Seeker Form
  const seekerForm = useForm<SeekerForm>({
    resolver: zodResolver(seekerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // HR Form
  const hrForm = useForm<HrForm>({
    resolver: zodResolver(hrSchema),
    defaultValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      companySize: "11-50 employees",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSeekerSubmit = async (data: SeekerForm) => {
    setServerError(null);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        roleName: "JOB_SEEKER",
      };
      const authData = await registerApi(payload);
      login(authData);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      setServerError(msg);
    }
  };

  const onHrSubmit = async (data: HrForm) => {
    setServerError(null);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        companyName: data.companyName,
        companySize: data.companySize,
        roleName: "HR",
      };
      const authData = await registerApi(payload);
      login(authData);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-dvh bg-[#f4f6f9] flex flex-col lg:flex-row selection:bg-indigo-600 selection:text-white">
      {/* ─── Left Dark Branding & Steps Panel ────────────────────────────────── */}
      <div className="lg:w-[40%] bg-[#080e1a] text-white p-5 lg:p-10 xl:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-28 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
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

        {/* Center Copy & Steps */}
        <div className="relative z-10 hidden lg:block max-w-lg space-y-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#16223e] border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              Join RecruitFlow
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-[1.14]">
              Create your account. <br />
              <span className="text-slate-300 font-semibold">Shape what comes next.</span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {role === "JOB_SEEKER"
                ? "Choose your role and get a workspace designed around your recruitment journey."
                : "Create your company profile, publish jobs and manage applications."}
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-4 pt-2">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-600/30 ring-4 ring-indigo-500/20">
                01
              </div>
              <div>
                <div className="text-sm font-bold text-white">Choose your role</div>
                <div className="text-xs text-slate-400">
                  {role === "JOB_SEEKER" ? "Job seeker profile" : "HR & Company profile"}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#121c33] border border-[#1d2d52] text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                02
              </div>
              <div>
                <div className="text-sm font-bold text-slate-200">
                  {role === "JOB_SEEKER"
                    ? "Add your details"
                    : "Company & recruiter details"}
                </div>
                <div className="text-xs text-slate-400">
                  {role === "JOB_SEEKER"
                    ? "Create a secure professional account"
                    : "Set up your organization & team profile"}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#121c33] border border-[#1d2d52] text-slate-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                03
              </div>
              <div>
                <div className="text-sm font-bold text-slate-200">
                  {role === "JOB_SEEKER" ? "Start your journey" : "Publish & hire"}
                </div>
                <div className="text-xs text-slate-400">
                  {role === "JOB_SEEKER"
                    ? "Find opportunities or track applications"
                    : "Post jobs and manage candidate pipeline"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 hidden lg:block pt-4">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Secure account
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Role-based access
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Centralized workspace
            </span>
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ────────────────────────────────────────────────── */}
      <div className="lg:w-[60%] flex flex-1 items-center justify-center p-4 sm:p-5 lg:p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-300/20 border border-slate-100">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>

          {/* Heading */}
          <div className="mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {role === "JOB_SEEKER"
                ? "Create your account"
                : "Create your company account"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {role === "JOB_SEEKER"
                ? "Start with the role that best describes you."
                : "Start hiring top talent with RecruitFlow."}
            </p>
          </div>

          {/* Role Toggle Selector */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Choose account type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("JOB_SEEKER")}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  role === "JOB_SEEKER"
                    ? "border-2 border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("HR")}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  role === "HR"
                    ? "border-2 border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                HR / Company
              </button>
            </div>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
              <span>{serverError}</span>
            </div>
          )}

          {/* ─── JOB SEEKER FORM ────────────────────────────────────────────── */}
          {role === "JOB_SEEKER" && (
            <form
              onSubmit={seekerForm.handleSubmit(onSeekerSubmit)}
              noValidate
              className="space-y-2.5"
            >
              {/* First & Last Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    First name
                  </label>
                  <input
                    {...seekerForm.register("firstName")}
                    placeholder="Your first name"
                    className={`w-full bg-white border rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                      seekerForm.formState.errors.firstName
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  {seekerForm.formState.errors.firstName && (
                    <p className="text-[11px] text-red-600">
                      {seekerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Last name
                  </label>
                  <input
                    {...seekerForm.register("lastName")}
                    placeholder="Your last name"
                    className={`w-full bg-white border rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                      seekerForm.formState.errors.lastName
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  {seekerForm.formState.errors.lastName && (
                    <p className="text-[11px] text-red-600">
                      {seekerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  {...seekerForm.register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full bg-white border rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                    seekerForm.formState.errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  }`}
                />
                {seekerForm.formState.errors.email && (
                  <p className="text-[11px] text-red-600">
                    {seekerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...seekerForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className={`w-full bg-white border rounded-xl pl-3.5 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                        seekerForm.formState.errors.password
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
                  {seekerForm.formState.errors.password && (
                    <p className="text-[11px] text-red-600">
                      {seekerForm.formState.errors.password.message}
                    </p>
                  )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    {...seekerForm.register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className={`w-full bg-white border rounded-xl pl-3.5 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                      seekerForm.formState.errors.confirmPassword
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {seekerForm.formState.errors.confirmPassword && (
                  <p className="text-[11px] text-red-600">
                    {seekerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              </div>

              <p className="text-[11px] text-slate-400">
                Use at least 8 characters.
              </p>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    {...seekerForm.register("agreeTerms")}
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600">
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>
                {seekerForm.formState.errors.agreeTerms && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {seekerForm.formState.errors.agreeTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={seekerForm.formState.isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-2.5 text-sm shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {seekerForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create My Account"
                )}
              </button>
            </form>
          )}

          {/* ─── COMPANY / HR FORM ──────────────────────────────────────────── */}
          {role === "HR" && (
            <form
              onSubmit={hrForm.handleSubmit(onHrSubmit)}
              noValidate
              className="space-y-2.5"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Company Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Company name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...hrForm.register("companyName")}
                      placeholder="Acme Technologies Inc."
                      className={`w-full bg-white border rounded-xl pl-10 pr-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                        hrForm.formState.errors.companyName
                          ? "border-red-400 focus:ring-2 focus:ring-red-200"
                          : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                      }`}
                    />
                  </div>
                  {hrForm.formState.errors.companyName && (
                    <p className="text-[11px] text-red-600">
                      {hrForm.formState.errors.companyName.message}
                    </p>
                  )}
              </div>

              {/* Work Email */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Work email address
                </label>
                <input
                  {...hrForm.register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full bg-white border rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                    hrForm.formState.errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  }`}
                />
                {hrForm.formState.errors.email && (
                  <p className="text-[11px] text-red-600">
                    {hrForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              </div>

              {/* Recruiter Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    First name
                  </label>
                  <input
                    {...hrForm.register("firstName")}
                    placeholder="Your first name"
                    className={`w-full bg-white border rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                      hrForm.formState.errors.firstName
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  {hrForm.formState.errors.firstName && (
                    <p className="text-[11px] text-red-600">
                      {hrForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Last name
                  </label>
                  <input
                    {...hrForm.register("lastName")}
                    placeholder="Your last name"
                    className={`w-full bg-white border rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                      hrForm.formState.errors.lastName
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  {hrForm.formState.errors.lastName && (
                    <p className="text-[11px] text-red-600">
                      {hrForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Company Size & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Company size
                  </label>
                  <select
                    {...hrForm.register("companySize")}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="1-10 employees">1 - 10 employees</option>
                    <option value="11-50 employees">11 - 50 employees</option>
                    <option value="51-200 employees">51 - 200 employees</option>
                    <option value="201-500 employees">201 - 500 employees</option>
                    <option value="500+ employees">500+ employees</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Phone number
                  </label>
                  <input
                    {...hrForm.register("phone")}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className={`w-full bg-white border rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                      hrForm.formState.errors.phone
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  {hrForm.formState.errors.phone && (
                    <p className="text-[11px] text-red-600">
                      {hrForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...hrForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className={`w-full bg-white border rounded-xl pl-3.5 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                        hrForm.formState.errors.password
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
                  {hrForm.formState.errors.password && (
                    <p className="text-[11px] text-red-600">
                      {hrForm.formState.errors.password.message}
                    </p>
                  )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    {...hrForm.register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className={`w-full bg-white border rounded-xl pl-3.5 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                      hrForm.formState.errors.confirmPassword
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {hrForm.formState.errors.confirmPassword && (
                  <p className="text-[11px] text-red-600">
                    {hrForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              </div>

              <p className="text-[11px] text-slate-400">
                Use at least 8 characters.
              </p>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    {...hrForm.register("agreeTerms")}
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600">
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>
                {hrForm.formState.errors.agreeTerms && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {hrForm.formState.errors.agreeTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={hrForm.formState.isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-2.5 text-sm shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {hrForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating company account...
                  </>
                ) : (
                  "Create Company Account"
                )}
              </button>
            </form>
          )}

          {/* Already have an account link */}
          <div className="mt-3 text-center border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-500">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
