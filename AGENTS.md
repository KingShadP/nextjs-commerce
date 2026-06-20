# KSHADP Storefront — Notes for AI Coding Tools

## Stack

- **Next.js 15 App Router** — use `app/` directory conventions. Server components by default; add `"use client"` only when the component needs browser APIs, state, or event handlers.
- **React 19** with `useOptimistic` for the cart
- **Tailwind CSS v4** — no `tailwind.config.js`; configuration is in `app/globals.css` via `@theme`
- **Shopify Storefront API** — all commerce data lives in `lib/shopify/`. Do not call Shopify directly from client components; use Server Actions or server components.
- **pnpm** — use `pnpm` for all install and run commands, not `npm` or `yarn`

## Key conventions

- Tailwind color tokens use the `skims-*` prefix: `text-skims-accent`, `bg-skims-sand`, etc. These are defined in `app/globals.css`.
- Design settings (colors, hero slides, announcements, per-product image overrides) are managed through the admin design studio at `/admin` and stored via `lib/site-design.ts`. Do not hardcode these values in components.
- The admin passcode gate lives in `lib/admin-auth.ts`. The session cookie is named `kshadp-admin`.
- Mock product fallbacks in `lib/mock.ts` are used automatically when Shopify credentials are not set. Do not remove or bypass this fallback — it enables development without a live Shopify connection.
- Cart state is managed optimistically via `components/cart/cart-context.tsx`. Server-side cart mutations are Server Actions in `components/cart/actions.ts`.

## What not to touch

- `lib/shopify/` — Shopify GraphQL queries and type definitions. Change only if the Storefront API schema changes.
- `pnpm-lock.yaml` — do not delete or regenerate without `pnpm install`
- `.data/` — local design settings storage, gitignored
