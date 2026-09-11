"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { changePasswordApi, updateAccountApi } from "@/lib/auth";
import { useAuth } from "@/store/authStore";

export default function JobSeekerSettingsPage() {
  const { user, updateUser } = useAuth();
  const [account, setAccount] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
  });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [accountState, setAccountState] = useState<{ error?: string; success?: string }>({});
  const [passwordState, setPasswordState] = useState<{ error?: string; success?: string }>({});
  const [savingAccount, setSavingAccount] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  async function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountState({});
    setSavingAccount(true);
    try {
      const updated = await updateAccountApi(account);
      updateUser(updated);
      setAccountState({ success: "Account details updated successfully." });
    } catch (reason) {
      setAccountState({ error: reason instanceof Error ? reason.message : "We could not update your account." });
    } finally {
      setSavingAccount(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordState({});
    if (password.newPassword.length < 6) {
      setPasswordState({ error: "Your new password must contain at least six characters." });
      return;
    }
    setChangingPassword(true);
    try {
      await changePasswordApi(password);
      setPassword({ currentPassword: "", newPassword: "" });
      setPasswordState({ success: "Password changed successfully." });
    } catch (reason) {
      setPasswordState({ error: reason instanceof Error ? reason.message : "We could not change your password." });
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <ProtectedDashboard role="JOB_SEEKER">
      <div className="space-y-6">
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">Job Seeker Workspace</p>
          <h1 className="mt-1 text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your account details and sign-in security.</p>
        </header>

        <form onSubmit={saveAccount} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-5 w-5 text-[#5b55dc]" />
            <div>
              <h2 className="text-xl font-bold">Account details</h2>
              <p className="mt-1 text-sm text-slate-500">Update the personal details associated with your account.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" value={account.firstName} onChange={(value) => setAccount((current) => ({ ...current, firstName: value }))} />
            <Field label="Last name" value={account.lastName} onChange={(value) => setAccount((current) => ({ ...current, lastName: value }))} />
          </div>
          <Field label="Email" value={user?.email ?? ""} onChange={() => undefined} disabled />
          <Field label="Phone" value={account.phone} onChange={(value) => setAccount((current) => ({ ...current, phone: value }))} />
          {accountState.error && <Message variant="error">{accountState.error}</Message>}
          {accountState.success && <Message variant="success">{accountState.success}</Message>}
          <button disabled={savingAccount} type="submit" className="rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c47c7] disabled:cursor-not-allowed disabled:opacity-60">
            {savingAccount ? "Saving..." : "Save account details"}
          </button>
        </form>

        <form onSubmit={changePassword} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 text-[#5b55dc]" />
            <div>
              <h2 className="text-xl font-bold">Change password</h2>
              <p className="mt-1 text-sm text-slate-500">Use at least six characters for your new password.</p>
            </div>
          </div>
          <PasswordField label="Current password" value={password.currentPassword} visible={showCurrentPassword} onToggle={() => setShowCurrentPassword((current) => !current)} onChange={(value) => setPassword((current) => ({ ...current, currentPassword: value }))} />
          <PasswordField label="New password" value={password.newPassword} visible={showNewPassword} onToggle={() => setShowNewPassword((current) => !current)} onChange={(value) => setPassword((current) => ({ ...current, newPassword: value }))} />
          {passwordState.error && <Message variant="error">{passwordState.error}</Message>}
          {passwordState.success && <Message variant="success">{passwordState.success}</Message>}
          <button disabled={changingPassword} type="submit" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#5b55dc] hover:text-[#5b55dc] disabled:cursor-not-allowed disabled:opacity-60">
            {changingPassword ? "Changing..." : "Change password"}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold">Account status</h2>
              <p className="mt-2 text-sm text-slate-500">Your account is currently <span className="font-semibold text-slate-700">{user?.status ?? "Unavailable"}</span>.</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboard>
  );
}

function Field({ label, value, onChange, disabled = false }: { label: string; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input type="text" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} required={!disabled && label !== "Phone"} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10 disabled:bg-slate-50 disabled:text-slate-500" />
    </label>
  );
}

function PasswordField({ label, value, visible, onToggle, onChange }: { label: string; value: string; visible: boolean; onToggle: () => void; onChange: (value: string) => void }) {
  const Icon = visible ? EyeOff : Eye;
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <span className="relative mt-2 block">
        <input type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} required className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#5b55dc] focus:ring-2 focus:ring-[#5b55dc]/10" />
        <button type="button" onClick={onToggle} aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
          <Icon className="h-4 w-4" />
        </button>
      </span>
    </label>
  );
}

function Message({ children, variant }: { children: string; variant: "error" | "success" }) {
  return <p role="status" className={`rounded-lg p-3 text-sm ${variant === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{children}</p>;
}
