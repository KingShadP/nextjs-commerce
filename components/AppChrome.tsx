"use client";

import Header from "components/Header";
import { WelcomeToast } from "components/welcome-toast";
import type { SiteDesignSettings } from "lib/site-design-schema";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Toaster } from "sonner";

export default function AppChrome({
  children,
  settings,
}: {
  children: ReactNode;
  settings: SiteDesignSettings;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? null : <Header settings={settings} />}
      <main className={`relative z-20 flex-grow ${isAdminRoute ? "" : "pt-7"}`}>
        {children}
        <Toaster closeButton />
        {isAdminRoute ? null : <WelcomeToast />}
      </main>
    </>
  );
}
