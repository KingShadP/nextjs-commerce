import { Mail, Package, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Account & Orders",
};

// If you have Shopify customer accounts enabled, this links to your real
// hosted order-status page. If not set up yet, this section just won't
// render the link below.
const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const orderStatusUrl = shopifyDomain
  ? `https://${shopifyDomain}/account`
  : null;

// TODO: replace with your real support inbox before launch.
const supportEmail = "support@kshadp.com";

export default function AccountPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-12 font-sans text-left">
      <div className="space-y-3 border-b border-white/10 pb-8">
        <span className="text-[8px] text-skims-accent tracking-[3px] uppercase block">
          Account & Orders
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-white uppercase tracking-wider font-light">
          Manage Your Orders
        </h1>
        <p className="font-sans text-sm text-skims-sand/55 leading-relaxed font-light">
          We don't have customer accounts set up on this storefront yet.
          Here's how to find what you need in the meantime.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="glass-panel border border-white/10 p-6 space-y-4 rounded-2xl">
          <Package className="w-5 h-5 text-skims-accent" />
          <h2 className="text-[11px] uppercase tracking-[2px] text-white font-bold">
            Track an order
          </h2>
          <p className="text-[12px] text-skims-sand/55 leading-relaxed font-light">
            After checkout, Shopify sends you an order confirmation and
            tracking email directly. Check your inbox for that, or use the
            link below.
          </p>
          {orderStatusUrl ? (
            <a
              href={orderStatusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[1.5px] text-skims-accent hover:text-white transition-colors"
            >
              View order status
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ) : null}
        </div>

        <div className="glass-panel border border-white/10 p-6 space-y-4 rounded-2xl">
          <Mail className="w-5 h-5 text-skims-accent" />
          <h2 className="text-[11px] uppercase tracking-[2px] text-white font-bold">
            Need help with an order?
          </h2>
          <p className="text-[12px] text-skims-sand/55 leading-relaxed font-light">
            Email us your order number and we'll sort it out.
          </p>
          <a
            href={`mailto:${supportEmail}`}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[1.5px] text-skims-accent hover:text-white transition-colors"
          >
            {supportEmail}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
