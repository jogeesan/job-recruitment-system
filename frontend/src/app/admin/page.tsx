import { redirect } from "next/navigation";

// /admin → /admin/dashboard redirect
export default function AdminRootPage() {
  redirect("/admin/dashboard");
}
