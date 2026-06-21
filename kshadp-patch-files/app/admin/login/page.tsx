import { isAdminAuthenticated } from "lib/admin-auth";
import { redirect } from "next/navigation";
import { loginAdmin } from "../actions";

export const metadata = {
  title: "Admin Access",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin/design");
  const { error } = await searchParams;

  return (
    <div className="relative z-40 flex min-h-[calc(100vh-1.75rem)] items-center justify-center px-6 py-20">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0b0a09]/90 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <p className="text-[8px] uppercase tracking-[0.38em] text-skims-accent">
          KSHADP
        </p>
        <h1 className="mt-4 font-serif text-3xl uppercase tracking-[0.08em] text-white">
          Design Studio
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/45">
          Authorized administrators can publish storefront design changes.
        </p>

        <form action={loginAdmin} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-white/55">
              Admin passcode
            </span>
            <input
              required
              autoFocus
              type="password"
              name="passcode"
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-white/10 bg-black/45 px-4 text-sm text-white outline-none transition focus:border-skims-accent"
            />
          </label>
          {error ? (
            <p className="text-xs text-red-300">
              The passcode was not accepted.
            </p>
          ) : null}
          <button className="h-12 w-full rounded-xl bg-skims-accent text-[9px] font-bold uppercase tracking-[0.25em] text-black transition hover:bg-white">
            Enter studio
          </button>
        </form>
      </div>
    </div>
  );
}
