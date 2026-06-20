import type { AdminDashboardSummary } from "lib/admin-dashboard";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Brush,
  CircleAlert,
  CircleCheck,
  Database,
  Layers3,
  Package,
  Palette,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const adminNavItems: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
  prefetch?: boolean;
}> = [
  { label: "Overview", href: "/admin", icon: Activity },
  { label: "Design Studio", href: "/admin/design", icon: Palette },
  { label: "Storefront", href: "/", icon: Store, prefetch: false },
  { label: "Catalog", href: "/search", icon: ShoppingBag, prefetch: false },
];

function StatusPill({ status }: { status: "connected" | "missing" | "error" }) {
  const label =
    status === "connected"
      ? "Connected"
      : status === "error"
        ? "Needs review"
        : "Setup needed";
  const Icon = status === "connected" ? CircleCheck : CircleAlert;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.2em] ${
        status === "connected"
          ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
          : "border-amber-300/20 bg-amber-300/10 text-amber-200"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Boxes;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#12110f]/85 p-5 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[8px] uppercase tracking-[0.24em] text-white/40">
            {label}
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-normal text-white">
            {value}
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-skims-accent">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-5 text-xs leading-5 text-white/45">{detail}</p>
    </section>
  );
}

export default function AdminDashboard({
  summary,
}: {
  summary: AdminDashboardSummary;
}) {
  const updatedAt =
    summary.design.updatedAt === new Date(0).toISOString()
      ? "Default settings"
      : new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(summary.design.updatedAt));

  return (
    <div className="relative z-40 min-h-screen bg-[#090807]/94 px-4 pb-20 pt-10 text-white backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-8 xl:grid-cols-[280px_1fr]">
        <aside className="xl:sticky xl:top-8 xl:h-[calc(100vh-4rem)]">
          <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/35 p-4">
            <Link href="/" className="px-3 py-4">
              <p className="font-serif text-xl uppercase tracking-[0.18em]">
                {summary.design.brandName}
              </p>
              <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-skims-accent">
                Admin Console
              </p>
            </Link>

            <nav className="mt-8 space-y-2">
              {adminNavItems.map(({ label, href, icon: Icon, prefetch }) => (
                <Link
                  key={label}
                  href={href}
                  prefetch={prefetch}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-skims-accent" />
                    {label}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              ))}
            </nav>

            <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[8px] uppercase tracking-[0.24em] text-white/35">
                Current accent
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className="h-8 w-8 rounded-full border border-white/20"
                  style={{ backgroundColor: summary.design.accentColor }}
                />
                <span className="font-mono text-xs text-white/70">
                  {summary.design.accentColor}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.4em] text-skims-accent">
                SaaS command center
              </p>
              <h1 className="mt-3 font-serif text-4xl uppercase tracking-[0.08em] sm:text-5xl">
                Storefront Admin
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
                Monitor the Shopify connection, review catalog readiness, and
                publish storefront design changes from one protected workspace.
              </p>
            </div>
            <Link
              href="/admin/design"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-skims-accent px-5 text-[9px] font-bold uppercase tracking-[0.22em] text-black transition hover:bg-white"
            >
              <Brush className="h-4 w-4" />
              Open design studio
            </Link>
          </header>

          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Products"
              value={summary.metrics.products}
              detail={`${summary.metrics.activeProducts} available in storefront sales channels.`}
              icon={Package}
            />
            <MetricCard
              label="Collections"
              value={summary.metrics.collections}
              detail="Connected collections available through storefront navigation."
              icon={Layers3}
            />
            <MetricCard
              label="Homepage"
              value={summary.metrics.homepageSections}
              detail="Sections controlled by the design settings document."
              icon={Boxes}
            />
            <MetricCard
              label="Design"
              value={updatedAt}
              detail="Latest published storefront design configuration."
              icon={Palette}
            />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-2xl border border-white/10 bg-[#12110f]/85 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-[10px] uppercase tracking-[0.26em] text-white/80">
                    Recent products
                  </h2>
                  <p className="mt-2 text-xs text-white/40">
                    Pulled from the Shopify Storefront API.
                  </p>
                </div>
                <Link
                  href="/search"
                  prefetch={false}
                  className="text-[8px] font-bold uppercase tracking-[0.2em] text-skims-accent"
                >
                  View catalog
                </Link>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
                {summary.products.length ? (
                  summary.products.map((product) => (
                    <Link
                      key={product.handle}
                      href={`/product/${product.handle}`}
                      prefetch={false}
                      className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border-b border-white/10 bg-black/20 p-3 last:border-b-0 transition hover:bg-white/[0.04]"
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-lg bg-white/[0.05]">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {product.title}
                        </p>
                        <p className="mt-1 font-mono text-xs text-white/35">
                          /product/{product.handle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">{product.price}</p>
                        <p
                          className={`mt-1 text-[8px] uppercase tracking-[0.18em] ${
                            product.availableForSale
                              ? "text-emerald-200"
                              : "text-white/35"
                          }`}
                        >
                          {product.availableForSale ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="bg-black/20 px-5 py-12 text-center">
                    <Package className="mx-auto h-8 w-8 text-white/25" />
                    <p className="mt-4 text-sm text-white/65">
                      No products loaded yet.
                    </p>
                    <p className="mt-2 text-xs leading-5 text-white/35">
                      Connect Shopify credentials to populate this table.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl border border-white/10 bg-[#12110f]/85 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.26em] text-white/80">
                      Shopify
                    </h2>
                    <p className="mt-2 font-mono text-xs text-white/45">
                      {summary.storefront.shopifyDomain}
                    </p>
                  </div>
                  <StatusPill status={summary.storefront.shopifyStatus} />
                </div>
                <p className="mt-5 text-sm leading-6 text-white/45">
                  {summary.storefront.shopifyMessage}
                </p>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#12110f]/85 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.26em] text-white/80">
                      Design storage
                    </h2>
                    <p className="mt-2 font-mono text-xs text-white/45">
                      settings/site-design.json
                    </p>
                  </div>
                  <StatusPill status={summary.storefront.blobStatus} />
                </div>
                <p className="mt-5 text-sm leading-6 text-white/45">
                  {summary.storefront.blobMessage}
                </p>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#12110f]/85 p-5">
                <h2 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-white/80">
                  <Database className="h-4 w-4 text-skims-accent" />
                  Connected surfaces
                </h2>
                <div className="mt-5 space-y-3 text-sm text-white/50">
                  <p>Storefront catalog: Shopify Storefront API</p>
                  <p>Theme controls: local or Vercel Blob JSON</p>
                  <p>Admin access: signed HTTP-only session cookie</p>
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
