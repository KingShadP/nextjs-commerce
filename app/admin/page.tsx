import AdminDashboard from "components/AdminDashboard";
import { isAdminAuthenticated } from "lib/admin-auth";
import { getAdminDashboardSummary } from "lib/admin-dashboard";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Console",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const summary = await getAdminDashboardSummary();

  return <AdminDashboard summary={summary} />;
}
