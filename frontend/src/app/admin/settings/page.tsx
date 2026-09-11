"use client";

import { FormEvent, type ReactNode, useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { changePasswordApi, updateAccountApi } from "@/lib/auth";
import { useAuth } from "@/store/authStore";

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuth();
  const [account, setAccount] = useState({ firstName: "", lastName: "", phone: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [accountState, setAccountState] = useState<{ error?: string; success?: string }>({});
  const [passwordState, setPasswordState] = useState<{ error?: string; success?: string }>({});
  const [savingAccount, setSavingAccount] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (user) setAccount({ firstName: user.firstName ?? "", lastName: user.lastName ?? "", phone: user.phone ?? "" });
  }, [user]);

  async function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountState({});
    if (!account.firstName.trim() || !account.lastName.trim()) {
      setAccountState({ error: "First name and last name are required." });
      return;
    }
    setSavingAccount(true);
    try {
      const updated = await updateAccountApi({ firstName: account.firstName.trim(), lastName: account.lastName.trim(), phone: account.phone.trim() });
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
    if (!password.currentPassword || !password.newPassword) {
      setPasswordState({ error: "Enter your current password and a new password." });
      return;
    }
    if (password.newPassword.length < 6) {
      setPasswordState({ error: "Your new password must be at least six characters." });
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
    <ProtectedDashboard role="ADMIN">
      <div className="max-w-3xl space-y-6">
        <header>
          <p className="text-sm font-medium text-[#5b55dc]">Admin Portal</p>
          <h1 className="mt-1 text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your administrator account and sign-in security.</p>
        </header>

        <form onSubmit={saveAccount} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading icon={<UserRound className="h-5 w-5" />} title="Account details" description="Update the personal details associated with your admin account." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" value={account.firstName} onChange={(value) => setAccount((current) => ({ ...current, firstName: value }))} />
            <Field label="Last name" value={account.lastName} onChange={(value) => setAccount((current) => ({ ...current, lastName: value }))} />
          </div>
          <Field label="Email" value={user?.email ?? ""} onChange={() => undefined} disabled />
          <Field label="Phone" value={account.phone} onChange={(value) => setAccount((current) => ({ ...current, phone: value }))} required={false} />
          {accountState.error && <Message variant="error">{accountState.error}</Message>}
          {accountState.success && <Message variant="success">{accountState.success}</Message>}
          <button disabled={savingAccount} type="submit" className="rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c47c7] disabled:cursor-not-allowed disabled:opacity-60">{savingAccount ? "Saving..." : "Save account details"}</button>
        </form>

        <form onSubmit={changePassword} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading icon={<LockKeyhole className="h-5 w-5" />} title="Change password" description="Use at least six characters for your new password." />
          <PasswordField label="Current password" value={password.currentPassword} visible={showCurrentPassword} onToggle={() => setShowCurrentPassword((visible) => !visible)} onChange={(value) => setPassword((current) => ({ ...current, currentPassword: value }))} />
          <PasswordField label="New password" value={password.newPassword} visible={showNewPassword} onToggle={() => setShowNewPassword((visible) => !visible)} onChange={(value) => setPassword((current) => ({ ...current, newPassword: value }))} />
          {passwordState.error && <Message variant="error">{passwordState.error}</Message>}
          {passwordState.success && <Message variant="success">{passwordState.success}</Message>}
          <button disabled={changingPassword} type="submit" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#5b55dc] hover:text-[#5b55dc] disabled:cursor-not-allowed disabled:opacity-60">{changingPassword ? "Changing..." : "Change password"}</button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading icon={<ShieldCheck className="h-5 w-5" />} title="Account status" description="Your current administrator account status." />
          <p className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{user?.status ?? "Unavailable"}</p>
        </div>
      </div>
    </ProtectedDashboard>
  );
}

function SectionHeading({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return <div className="flex items-start gap-3"><div className="rounded-lg bg-indigo-50 p-2.5 text-[#5b55dc]">{icon}</div><div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div></div>;
}

function Field({ label, value, onChange, disabled = false, required = true }: { label: string; value: string; onChange: (value: string) => void; disabled?: boolean; required?: boolean }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}<input type="text" value={value} disabled={disabled} required={required} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc] disabled:bg-slate-50 disabled:text-slate-500" /></label>;
}

function PasswordField({ label, value, visible, onToggle, onChange }: { label: string; value: string; visible: boolean; onToggle: () => void; onChange: (value: string) => void }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}<div className="relative mt-2"><input type={visible ? "text" : "password"} value={value} required onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-11 text-sm outline-none focus:border-[#5b55dc]" /><button type="button" onClick={onToggle} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-400 hover:text-slate-700">{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>;
}

function Message({ children, variant }: { children: string; variant: "error" | "success" }) {
  return <p role="status" className={`rounded-lg p-3 text-sm ${variant === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{children}</p>;
}
