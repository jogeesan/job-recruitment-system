"use client";

import { FormEvent, useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { changePasswordApi, updateAccountApi } from "@/lib/auth";
import { useAuth } from "@/store/authStore";

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuth();
  const [account, setAccount] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
  });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
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
          <div>
            <h2 className="text-xl font-bold">Account details</h2>
            <p className="mt-1 text-sm text-slate-500">Update the personal details associated with your admin account.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" value={account.firstName} onChange={(value) => setAccount((current) => ({ ...current, firstName: value }))} />
            <Field label="Last name" value={account.lastName} onChange={(value) => setAccount((current) => ({ ...current, lastName: value }))} />
          </div>
          <Field label="Email" value={user?.email ?? ""} onChange={() => undefined} disabled />
          <Field label="Phone" value={account.phone} onChange={(value) => setAccount((current) => ({ ...current, phone: value }))} />
          {accountState.error && <Message variant="error">{accountState.error}</Message>}
          {accountState.success && <Message variant="success">{accountState.success}</Message>}
          <button disabled={savingAccount} type="submit" className="rounded-lg bg-[#5b55dc] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{savingAccount ? "Saving..." : "Save account details"}</button>
        </form>

        <form onSubmit={changePassword} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold">Change password</h2>
            <p className="mt-1 text-sm text-slate-500">Use at least six characters for your new password.</p>
          </div>
          <Field label="Current password" type="password" value={password.currentPassword} onChange={(value) => setPassword((current) => ({ ...current, currentPassword: value }))} />
          <Field label="New password" type="password" value={password.newPassword} onChange={(value) => setPassword((current) => ({ ...current, newPassword: value }))} />
          {passwordState.error && <Message variant="error">{passwordState.error}</Message>}
          {passwordState.success && <Message variant="success">{passwordState.success}</Message>}
          <button disabled={changingPassword} type="submit" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60">{changingPassword ? "Changing..." : "Change password"}</button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Account status</h2>
          <p className="mt-2 text-sm text-slate-500">Your admin account is currently <span className="font-semibold text-slate-700">{user?.status}</span>.</p>
        </div>
      </div>
    </ProtectedDashboard>
  );
}

function Field({ label, value, onChange, type = "text", disabled = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; disabled?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} required={!disabled && label !== "Phone"} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#5b55dc] disabled:bg-slate-50 disabled:text-slate-500" />
    </label>
  );
}

function Message({ children, variant }: { children: string; variant: "error" | "success" }) {
  return <p className={`rounded-lg p-3 text-sm ${variant === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{children}</p>;
}
