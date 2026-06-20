import AdminDesignStudio from "components/AdminDesignStudio";
import { isAdminAuthenticated } from "lib/admin-auth";
import { getSiteDesignSettings } from "lib/site-design";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Storefront Design Studio",
  robots: { index: false, follow: false },
};

export default async function AdminDesignPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const settings = await getSiteDesignSettings();

  return (
    <AdminDesignStudio
      initialSettings={settings}
      storageMode={
        process.env.BLOB_READ_WRITE_TOKEN
          ? "Vercel Blob"
          : "Local development"
      }
    />
  );
}

