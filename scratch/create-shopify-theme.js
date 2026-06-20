const fs = require('fs/promises');
const path = require('path');
const { execFile } = require('child_process');

const workspaceRoot = path.resolve(__dirname, '..');
const themeRoot = path.join(workspaceRoot, 'shopify-theme-sanctum');
const publicRoot = path.join(workspaceRoot, 'public');
const zipPath = path.join(workspaceRoot, 'shopify-theme-sanctum.zip');

const assetFiles = [
    'cinematic_room_1.jpg',
    'cinematic_room_2.jpg',
    'cinematic_room_3.jpg',
    'slide-dragon-1.jpg',
    'slide-dragon-2.jpg',
    'slide-dragon-3.jpg',
    'slide-dragon-4.jpg',
    'slide-dragon-5.jpg',
    'logo-full.png',
];

const files = {
    'layout/theme.liquid': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{{ page_title }} - {{ shop.name }}</title>
    <link rel="stylesheet" href="{{ 'theme.css' | asset_url }}" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/ScrollTrigger.min.js" defer></script>
    {{ content_for_header }}
  </head>
  <body class="theme-body">
    <div class="cinematic-environment" aria-hidden="true">
      <div class="cinematic-room cinematic-room-entry" style="background-image:url('{{ 'cinematic_room_1.jpg' | asset_url }}')"></div>
      <div class="cinematic-room cinematic-room-salon" style="background-image:url('{{ 'cinematic_room_2.jpg' | asset_url }}')"></div>
      <div class="cinematic-room cinematic-room-archive" style="background-image:url('{{ 'cinematic_room_3.jpg' | asset_url }}')"></div>
      <div class="cinematic-text-safety"></div>
      <canvas class="cinematic-particles"></canvas>
      <div class="cinematic-fog cinematic-fog-back"></div>
      <div class="cinematic-light-sweep"></div>
      <div class="cinematic-fog cinematic-fog-front"></div>
      <div class="cinematic-floor"></div>
      <div class="cinematic-grain"></div>
    </div>

    {% section 'header' %}
    <main id="MainContent" class="main-content">{{ content_for_layout }}</main>
    {% section 'cart-drawer' %}
    <script src="{{ 'theme.js' | asset_url }}" defer></script>
    {{ content_for_footer }}
  </body>
</html>
`,
    'templates/index.liquid': `{% section 'hero-slideshow' %}
{% section 'marquee-ribbon' %}
{% section 'technical-dossier' %}
{% section 'featured-collection-carousel' %}
{% section 'newsletter' %}
`,
    'templates/product.liquid': `{% section 'main-product' %}
`,
    'templates/collection.liquid': `{% section 'main-collection' %}
`,
    'templates/cart.liquid': `<div class="page-width">
  <div class="cart-page-shell">
    <h1 class="product-heading">Your Cart</h1>
    <div id="CartDrawer" class="cart-drawer cart-drawer--open"></div>
  </div>
</div>
`,
    'sections/header.liquid': `<section class="site-header">
  <div class="header-top">
    <div class="brand-mark">
      <img src="{{ 'logo-full.png' | asset_url }}" alt="{{ shop.name }}" />
    </div>
    <div class="header-announcement">THE SANCTUM // ONLINE RELEASE LIVE</div>
  </div>
  <div class="header-bottom">
    <nav class="site-nav" role="navigation" aria-label="Main navigation">
      <a href="/collections/all">Shop</a>
      <a href="/account">Account</a>
      <a href="/search">Search</a>
      <button class="cart-trigger" type="button" data-open-cart>Cart</button>
    </nav>
  </div>
</section>
`,
    'sections/hero-slideshow.liquid': `<section class="hero-slideshow" aria-label="Featured collection slideshow">
  <div class="hero-slideshow__slides" data-hero-slideshow>
    {% assign slide_images = 'slide-dragon-1.jpg,slide-dragon-2.jpg,slide-dragon-3.jpg,slide-dragon-4.jpg,slide-dragon-5.jpg' | split: ',' %}
    {% assign slide_titles = 'MEDITERRANEAN ORANGE COTTON FLEECE.,OBSIDIAN BLACK POST-ACTIVE KNIT.,CREAM ALABASTER HEAVYWEIGHT SWEATER.,CORAL PINK CONTUSION SWEATSHIRT.,PASTEL SUNLIGHT HEAVY COTTON CREW.' | split: ',' %}
    {% assign slide_ctas = 'Shop Orange,Shop Obsidian,Shop Alabaster,Shop Coral,Shop Sunlight' | split: ',' %}
    {% assign slide_urls = '/collections/all?query=orange,/collections/all?query=black,/collections/all?query=cream,/collections/all?query=coral,/collections/all?query=yellow' | split: ',' %}
    {% for slide in slide_images %}
      <article class="hero-slide{% if forloop.first %} is-active{% endif %}">
        <div class="hero-slide__background" style="background-image:url('{{ slide | asset_url }}')"></div>
        <div class="hero-slide__overlay"></div>
        <div class="hero-slide__content">
          <p class="eyebrow">THE DRAGON SERIES | LIMITED EDITION</p>
          <h1>{{ slide_titles[forloop.index0] }}</h1>
          <div class="hero-slide__actions">
            <a class="button button--primary" href="{{ slide_urls[forloop.index0] }}">{{ slide_ctas[forloop.index0] }}</a>
            <a class="button button--ghost" href="#featured-selections">Explore Featured</a>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
  <div class="hero-slide-controls">
    <button class="hero-slide-prev" type="button" aria-label="Previous slide">‹</button>
    <button class="hero-slide-next" type="button" aria-label="Next slide">›</button>
  </div>
  <div class="hero-slide-indicators" aria-label="Slide navigation"></div>
</section>
`,
    'sections/marquee-ribbon.liquid': `<section class="marquee-ribbon" aria-label="Materials ticker">
  <div class="marquee-track">
    <span>95% Cotton Modal Blend</span>
    <span>420 GSM Compressive Double-Fleece</span>
    <span>12% Shaping Pressure Matrix</span>
    <span>3D Seamless Anatomical Pouch</span>
    <span>Shape Retention Factor: 99.8%</span>
    <span>Flatlock Frictionless Joints</span>
    <span>95% Cotton Modal Blend</span>
    <span>420 GSM Compressive Double-Fleece</span>
  </div>
</section>
`,
    'sections/technical-dossier.liquid': `<section class="technical-dossier" aria-label="Technical dossier">
  <div class="feature-grid">
    <article>
      <span class="feature-label">01 | PRESSURE CONTROLS</span>
      <p>Abdominal alignment fibers woven at 300g pressure grids to support and contour muscle postures.</p>
    </article>
    <article>
      <span class="feature-label">02 | ELASTICITY MEMORY</span>
      <p>Double-spun modal yarns engineered to match physical dimensions and retain memory shape for 16+ hours.</p>
    </article>
    <article>
      <span class="feature-label">03 | THERM-FLOW WEAVE</span>
      <p>Open-cell micro ventilation channels within the modal matrix regulate heat dissipation.</p>
    </article>
    <article>
      <span class="feature-label">04 | SEAMLESS GEOMETRY</span>
      <p>Laser-cut panels bonded with cooling flatlock adhesives eliminate friction along movement paths.</p>
    </article>
  </div>
</section>
`,
    'sections/featured-collection-carousel.liquid': `<section class="featured-collection-carousel" id="featured-selections" aria-label="Featured collection carousel">
  <div class="featured-collection-carousel__header">
    <div>
      <span>01 | Featured Collection</span>
      <h2>Featured Selections</h2>
    </div>
    <span class="hint">Drag or swipe to explore</span>
  </div>
  <div class="carousel-shell" data-product-carousel>
    {% assign featured_products = collections[section.settings.collection].products | slice: 0, 8 %}
    {% for product in featured_products %}
      <div class="carousel-card">
        {% render 'product-card' with product %}
      </div>
    {% endfor %}
  </div>
</section>
`,
    'sections/newsletter.liquid': `<section class="newsletter-cta" aria-label="Newsletter sign-up">
  <div class="newsletter-shell">
    <div>
      <span>Newsletter Registry</span>
      <h2>Secure Early Access</h2>
      <p>Subscribe to receive early access updates, restock notifications, and exclusive design briefings.</p>
    </div>
    <form method="post" action="/contact#ContactFooter" class="newsletter-form">
      <label class="newsletter-input">
        <span>&gt;</span>
        <input type="email" name="contact[email]" placeholder="Enter your email address..." aria-label="Email address" required />
      </label>
      <button type="submit" class="button button--primary">Register</button>
    </form>
    <p class="newsletter-footnote">Secure Connection Enabled</p>
  </div>
</section>
`,
    'sections/main-product.liquid': `<section class="product-detail" aria-label="Product details">
  <div class="product-detail-shell">
    <div class="product-detail-media">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | img_url: '1500x' }}" alt="{{ product.title }}" />
      {% endif %}
    </div>
    <div class="product-detail-copy">
      <span class="eyebrow">Product Detail</span>
      <h1>{{ product.title }}</h1>
      <p class="price">{{ product.price | money }}</p>
      <div class="product-description">{{ product.description }}</div>
      <form method="post" action="/cart/add" id="ProductForm" class="product-form">
        {% if product.variants.size > 1 %}
          <label for="ProductSelect">Size</label>
          <select id="ProductSelect" name="id">
            {% for variant in product.variants %}
              <option value="{{ variant.id }}">{{ variant.title }} - {{ variant.price | money }}</option>
            {% endfor %}
          </select>
        {% else %}
          <input type="hidden" name="id" value="{{ product.variants.first.id }}" />
        {% endif %}
        <button type="submit" class="button button--primary" data-add-to-cart>Add to cart</button>
      </form>
      <div class="product-specs">
        <h2>Technical Specs</h2>
        <ul>
          <li>420 GSM cotton modal blend</li>
          <li>3D anatomical reinforcement</li>
          <li>Compression memory support</li>
          <li>Low-friction seam engineering</li>
        </ul>
      </div>
    </div>
  </div>
</section>
`,
    'sections/main-collection.liquid': `<section class="collection-grid" aria-label="Collection products">
  <div class="collection-grid__header">
    <span>Collection</span>
    <h1>{{ collection.title }}</h1>
  </div>
  <div class="collection-products">
    {% for product in collection.products %}
      <div class="collection-product-card">
        {% render 'product-card' with product %}
      </div>
    {% endfor %}
  </div>
</section>
`,
    'snippets/product-card.liquid': `<article class="product-card">
  <a href="{{ product.url }}" class="product-card__link">
    {% if product.featured_image %}
      <div class="product-card__image" style="background-image:url('{{ product.featured_image | img_url: '600x' }}')"></div>
    {% endif %}
    <div class="product-card__meta">
      <h3>{{ product.title }}</h3>
      <span>{{ product.price | money }}</span>
    </div>
  </a>
</article>
`,
    'snippets/cart-drawer.liquid': `<div class="cart-drawer" id="CartDrawer" aria-hidden="true">
  <div class="cart-drawer__panel">
    <button class="cart-drawer__close" type="button" data-close-cart>×</button>
    <h2>Your Cart</h2>
    <div class="cart-drawer__contents">
      {% if cart.item_count > 0 %}
        <ul class="cart-items">
          {% for line in cart.items %}
            <li class="cart-item">
              <div class="cart-item__details">
                <span class="cart-item__title">{{ line.product.title }}</span>
                <span class="cart-item__quantity">Qty: {{ line.quantity }}</span>
              </div>
              <span class="cart-item__price">{{ line.line_price | money }}</span>
            </li>
          {% endfor %}
        </ul>
        <div class="cart-drawer__footer">
          <span class="cart-total">Subtotal: {{ cart.total_price | money }}</span>
          <a class="button button--primary" href="/checkout">Checkout</a>
        </div>
      {% else %}
        <p class="cart-empty">Your cart is empty.</p>
      {% endif %}
    </div>
  </div>
</div>
`,
    'assets/theme.css': `:root {
  color-scheme: dark;
  font-family: Inter, system-ui, sans-serif;
  background: #090807;
  color: #f5f3ef;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
}

.theme-body {
  position: relative;
  background: #090807;
  color: #f5f3ef;
  overflow-x: hidden;
}

.main-content {
  position: relative;
  z-index: 2;
}

button,
input,
select {
  font: inherit;
}

img {
  display: block;
  max-width: 100%;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  padding: 1rem 1.5rem;
  background: rgba(10, 9, 8, 0.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-top,
.header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand-mark img {
  height: 38px;
  width: auto;
}

.header-announcement {
  font-size: 0.625rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(197, 168, 128, 0.95);
}

.site-nav {
  display: grid;
  grid-auto-flow: column;
  gap: 1rem;
  align-items: center;
}

.site-nav a,
.site-nav button {
  color: #f5f3ef;
  text-decoration: none;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  border: none;
  background: none;
  cursor: pointer;
}

.cart-trigger {
  padding: 0.65rem 1rem;
  background: rgba(197, 168, 128, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
}

.cinematic-environment {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #090807;
}

.cinematic-room {
  position: absolute;
  inset: -10%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 0.4s ease, transform 0.6s ease;
}

.cinematic-room-entry { opacity: 1; }
.cinematic-room-salon { opacity: 0.8; }
.cinematic-room-archive { opacity: 0.6; }

.cinematic-text-safety {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(5, 4, 3, 0.7), rgba(7, 6, 5, 0.2));
}

.cinematic-fog,
.cinematic-light-sweep,
.cinematic-floor,
.cinematic-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cinematic-fog-back,
.cinematic-fog-front {
  background: radial-gradient(circle at center, rgba(212, 194, 173, 0.18), transparent 48%);
  opacity: 0.14;
  transform: translate3d(0, 0, 0);
}

.cinematic-light-sweep {
  background: linear-gradient(90deg, transparent 34%, rgba(207, 153, 113, 0.06) 44%, rgba(239, 198, 146, 0.22) 52%, transparent 60%);
  opacity: 0.24;
  transform: rotate(-13deg) translateX(-20%);
}

.cinematic-floor {
  inset: 60% -15% -20%;
  background: linear-gradient(180deg, rgba(219, 170, 126, 0.12), transparent 70%);
  filter: blur(1.5px);
}

.cinematic-grain {
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
  mix-blend-mode: soft-light;
}

.hero-slideshow {
  position: relative;
  min-height: 80vh;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1s ease;
}

.hero-slide.is-active { opacity: 1; }

.hero-slide__background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.54) contrast(1.1);
}

.hero-slide__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 9, 8, 0.85), rgba(10, 9, 8, 0.05));
}

.hero-slide__content {
  position: relative;
  z-index: 2;
  padding: 3rem 1.5rem;
  text-align: center;
  max-width: 85rem;
  margin: 0 auto;
}

.hero-slide__content .eyebrow {
  color: rgba(197, 168, 128, 0.95);
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.hero-slide__content h1 {
  margin: 1rem 0 1.8rem;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 0.96;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.hero-slide__actions {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  justify-content: center;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.75rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
}

.button--primary {
  background: #c5a880;
  color: #0a0908;
}

.button--ghost {
  background: rgba(0,0,0,0.4);
  color: #f5f3ef;
  border-color: rgba(255,255,255,0.12);
}

.hero-slide-controls {
  position: absolute;
  inset: auto 1.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 3rem);
  z-index: 4;
}

.hero-slide-controls button {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.35);
  color: #ffffff;
  font-size: 1.4rem;
}

.hero-slide-indicators {
  position: absolute;
  left: 50%;
  bottom: 2.5rem;
  transform: translateX(-50%);
  display: flex;
  gap: 0.7rem;
  z-index: 4;
}

.hero-slide-indicators button {
  width: 3.5rem;
  height: 0.3rem;
  border-radius: 999px;
  border: none;
  background: rgba(255,255,255,0.18);
  cursor: pointer;
}

.hero-slide-indicators button.is-active {
  background: #c5a880;
}

.marquee-ribbon {
  overflow: hidden;
  background: rgba(255,255,255,0.04);
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.marquee-track {
  display: inline-flex;
  gap: 4rem;
  padding: 1rem 0;
  animation: marquee 24s linear infinite;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: rgba(197,168,128,0.65);
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.technical-dossier {
  padding: 4rem 1.5rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.feature-grid article {
  padding: 1.75rem;
  background: rgba(13,12,11,0.88);
  border: 1px solid rgba(255,255,255,0.06);
}

.feature-label {
  display: block;
  font-size: 0.68rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #c5a880;
  margin-bottom: 0.75rem;
}

.feature-grid p {
  margin: 0;
  color: rgba(245,243,239,0.75);
  font-size: 0.9rem;
  line-height: 1.8;
}

.featured-collection-carousel {
  padding: 4rem 1.5rem 3rem;
}

.featured-collection-carousel__header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 2rem;
}

.collection-products,
.carousel-shell {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
}

.carousel-card,
.collection-product-card {
  min-width: min(80vw, 26rem);
  scroll-snap-align: start;
}

.product-card {
  display: grid;
  gap: 1rem;
  background: rgba(13,12,11,0.9);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 1rem;
}

.product-card__image {
  min-height: 18rem;
  background-size: cover;
  background-position: center;
  border-radius: 0.8rem;
}

.product-card__meta h3 {
  margin: 0;
  font-size: 1rem;
  text-transform: uppercase;
}

.product-card__meta span {
  display: block;
  margin-top: 0.5rem;
  color: rgba(197,168,128,0.95);
}

.newsletter-cta {
  padding: 4rem 1.5rem;
}

.newsletter-shell {
  max-width: 44rem;
  margin: 0 auto;
  padding: 2.5rem;
  background: rgba(13,12,11,0.86);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 2rem;
}

.newsletter-shell span,
.newsletter-shell h2,
.newsletter-shell p {
  margin: 0;
}

.newsletter-shell span {
  display: inline-block;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #c5a880;
}

.newsletter-shell h2 {
  margin: 1rem 0;
  font-size: 2rem;
  line-height: 1.05;
}

.newsletter-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.newsletter-input {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 999px;
  padding: 0.9rem 1rem;
}

.newsletter-input input {
  border: none;
  background: transparent;
  color: #f5f3ef;
  width: 100%;
}

.newsletter-input input::placeholder {
  color: rgba(245,243,239,0.35);
  text-transform: uppercase;
}

.newsletter-footnote {
  margin-top: 1rem;
  color: rgba(245,243,239,0.35);
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.product-detail {
  padding: 4rem 1.5rem;
}

.product-detail-shell {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 2rem;
}

.product-detail-media img {
  width: 100%;
  border-radius: 1.5rem;
  object-fit: cover;
}

.product-detail-copy {
  display: grid;
  gap: 1.5rem;
}

.product-detail-copy .eyebrow {
  color: #c5a880;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.product-detail-copy h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.price {
  font-size: 1.5rem;
  color: #c5a880;
}

.product-description {
  color: rgba(245,243,239,0.74);
  line-height: 1.8;
}

.product-form {
  display: grid;
  gap: 1rem;
}

.product-form select,
.product-form button {
  width: 100%;
}

.product-specs ul {
  margin: 0;
  padding-left: 1.2rem;
  color: rgba(245,243,239,0.72);
  line-height: 1.8;
}

.cart-drawer {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: none;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.5);
}

.cart-drawer.is-open {
  display: flex;
}

.cart-drawer__panel {
  width: min(28rem, 100%);
  background: #090807;
  padding: 2rem;
  box-shadow: -24px 0 80px rgba(0,0,0,0.45);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-drawer__close {
  align-self: flex-end;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12);
  background: transparent;
  color: #f5f3ef;
  font-size: 1.4rem;
}

.cart-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 1rem;
}

.cart-item__title {
  font-size: 0.95rem;
  text-transform: uppercase;
}

.cart-total {
  display: block;
  font-size: 0.95rem;
  color: rgba(197,168,128,0.95);
}

.cart-empty {
  color: rgba(245,243,239,0.66);
}

@media (max-width: 960px) {
  .feature-grid { grid-template-columns: 1fr 1fr; }
  .product-detail-shell { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .site-header { padding: 1rem; }
  .hero-slide__content h1 { font-size: 2.5rem; }
  .hero-slide-controls { width: calc(100% - 2rem); }
  .feature-grid { grid-template-columns: 1fr; }
}
`,
    'assets/theme.js': `const assets = {
  slideSelectors: '[data-hero-slideshow] .hero-slide',
  prevBtn: '.hero-slide-prev',
  nextBtn: '.hero-slide-next',
  indicatorRoot: '.hero-slide-indicators',
  carouselShell: '[data-product-carousel]',
  cartTrigger: '[data-open-cart]',
  closeCart: '[data-close-cart]',
  cartDrawer: '#CartDrawer',
  addToCart: '[data-add-to-cart]',
};

const initHeroSlideshow = () => {
  const slides = Array.from(document.querySelectorAll(assets.slideSelectors));
  const prev = document.querySelector(assets.prevBtn);
  const next = document.querySelector(assets.nextBtn);
  const indicatorsRoot = document.querySelector(assets.indicatorRoot);
  if (!slides.length || !prev || !next || !indicatorsRoot) return;

  let currentIndex = 0;
  let intervalId = null;

  const updateState = (nextIndex) => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === nextIndex);
    });
    Array.from(indicatorsRoot.children).forEach((button, index) => {
      button.classList.toggle('is-active', index === nextIndex);
    });
    currentIndex = nextIndex;
  };

  slides.forEach((slide, index) => {
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.addEventListener('click', () => {
      updateState(index);
      resetTimer();
    });
    indicatorsRoot.appendChild(indicator);
  });

  const showPrevious = () => updateState((currentIndex - 1 + slides.length) % slides.length);
  const showNext = () => updateState((currentIndex + 1) % slides.length);

  prev.addEventListener('click', () => { showPrevious(); resetTimer(); });
  next.addEventListener('click', () => { showNext(); resetTimer(); });

  const startTimer = () => {
    intervalId = window.setInterval(() => showNext(), 7000);
  };

  const resetTimer = () => {
    if (intervalId) window.clearInterval(intervalId);
    startTimer();
  };

  updateState(0);
  startTimer();
};

const initProductCarousel = () => {
  const carousel = document.querySelector(assets.carouselShell);
  if (!carousel) return;

  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  carousel.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.pageX - carousel.offsetLeft;
    scrollStart = carousel.scrollLeft;
    carousel.classList.add('is-dragging');
  });

  carousel.addEventListener('mouseleave', () => { isDragging = false; carousel.classList.remove('is-dragging'); });
  carousel.addEventListener('mouseup', () => { isDragging = false; carousel.classList.remove('is-dragging'); });
  carousel.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollStart - walk;
  });
};

const initCartDrawer = () => {
  const toggleOpen = (open) => {
    const drawer = document.querySelector(assets.cartDrawer);
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
  };

  document.querySelectorAll(assets.cartTrigger).forEach((button) => {
    button.addEventListener('click', () => toggleOpen(true));
  });

  document.querySelectorAll(assets.closeCart).forEach((button) => {
    button.addEventListener('click', () => toggleOpen(false));
  });

  document.querySelectorAll(assets.addToCart).forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const form = button.closest('form');
      if (!form) return;
      const data = new FormData(form);
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        await refreshCartDrawer();
        toggleOpen(true);
      }
    });
  });
};

const refreshCartDrawer = async () => {
  const response = await fetch('/cart.js');
  const drawer = document.querySelector(assets.cartDrawer);
  if (!response.ok || !drawer) return;
  const cart = await response.json();
  drawer.innerHTML = '<div class="cart-drawer__panel"><button class="cart-drawer__close" type="button" data-close-cart>×</button><h2>Your Cart</h2></div>';
  if (cart.items && cart.items.length) {
    const list = document.createElement('ul');
    list.className = 'cart-items';
    cart.items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = '<div class="cart-item__details"><span class="cart-item__title">' + item.product_title + '</span><span class="cart-item__quantity">Qty: ' + item.quantity + '</span></div><span class="cart-item__price">' + (window.Shopify?.formatMoney ? Shopify.formatMoney(item.line_price, window.theme?.moneyFormat || '\${{amount}}') : '$' + (item.line_price / 100).toFixed(2)) + '</span>';
      list.appendChild(li);
    });
    drawer.querySelector('.cart-drawer__panel').appendChild(list);
    const footer = document.createElement('div');
    footer.className = 'cart-drawer__footer';
    footer.innerHTML = '<span class="cart-total">Subtotal: ' + (window.Shopify?.formatMoney ? Shopify.formatMoney(cart.total_price, window.theme?.moneyFormat || '\${{amount}}') : '$' + (cart.total_price / 100).toFixed(2)) + '</span><a class="button button--primary" href="/checkout">Checkout</a>';
    drawer.querySelector('.cart-drawer__panel').appendChild(footer);
  } else {
    const message = document.createElement('p');
    message.className = 'cart-empty';
    message.textContent = 'Your cart is empty.';
    drawer.querySelector('.cart-drawer__panel').appendChild(message);
  }
  initCartDrawer();
};

const initScrollAnimations = () => {
  const sections = Array.from(document.querySelectorAll('main section'));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    },
    { rootMargin: '-10% 0px -15%', threshold: 0.1 }
  );
  sections.forEach((section) => {
    section.classList.add('cinematic-section');
    observer.observe(section);
  });
};

const initGSAP = () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.to('.cinematic-room-entry', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.1,
    },
    opacity: 1,
  });
};

const initParticleCanvas = () => {
  const canvas = document.querySelector('.cinematic-particles');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 40 }, (_, i) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 0.5 + Math.random() * 1.5,
    speedX: (Math.random() - 0.5) * 0.08,
    speedY: -0.08 - Math.random() * 0.16,
    opacity: 0.1 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
  }));

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      particle.phase += 0.03;
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y + Math.sin(particle.phase) * 3, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(197,168,128,' + particle.opacity + ')';
      ctx.shadowColor = 'rgba(197,168,128,0.3)';
      ctx.shadowBlur = 3;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    requestAnimationFrame(render);
  };
  render();
};

const init = () => {
  initHeroSlideshow();
  initProductCarousel();
  initCartDrawer();
  initScrollAnimations();
  initGSAP();
  initParticleCanvas();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
`,
    'config/settings_schema.json': `[
  {
    "name": "Theme Settings",
    "settings": [
      {
        "type": "header",
        "content": "Colors & Branding"
      },
      {
        "type": "color",
        "id": "color_background",
        "label": "Background color",
        "default": "#090807"
      },
      {
        "type": "color",
        "id": "color_text",
        "label": "Text color",
        "default": "#f5f3ef"
      },
      {
        "type": "color",
        "id": "color_accent",
        "label": "Accent color",
        "default": "#c5a880"
      },
      {
        "type": "color",
        "id": "color_secondary",
        "label": "Secondary color",
        "default": "#5c4f44"
      },
      {
        "type": "image_picker",
        "id": "logo_image",
        "label": "Logo image"
      },
      {
        "type": "header",
        "content": "Cinematic Environment"
      },
      {
        "type": "checkbox",
        "id": "enable_fog",
        "label": "Enable smoky fog",
        "default": true
      },
      {
        "type": "range",
        "id": "fog_opacity",
        "label": "Fog opacity",
        "default": 18,
        "min": 0,
        "max": 100,
        "step": 5,
        "unit": "%"
      },
      {
        "type": "checkbox",
        "id": "enable_light_sweep",
        "label": "Enable gold light sweep",
        "default": true
      },
      {
        "type": "range",
        "id": "light_sweep_opacity",
        "label": "Light sweep opacity",
        "default": 32,
        "min": 0,
        "max": 100,
        "step": 5,
        "unit": "%"
      },
      {
        "type": "checkbox",
        "id": "enable_floor_reflection",
        "label": "Enable floor reflection",
        "default": true
      },
      {
        "type": "checkbox",
        "id": "enable_grain",
        "label": "Enable cinematic grain texture",
        "default": true
      },
      {
        "type": "range",
        "id": "grain_opacity",
        "label": "Grain opacity",
        "default": 5,
        "min": 0,
        "max": 50,
        "step": 1,
        "unit": "%"
      },
      {
        "type": "range",
        "id": "motion_intensity",
        "label": "Motion intensity",
        "default": 7,
        "min": 1,
        "max": 10,
        "step": 1
      },
      {
        "type": "header",
        "content": "Typography"
      },
      {
        "type": "font_picker",
        "id": "font_heading",
        "label": "Heading font",
        "default": "serif"
      },
      {
        "type": "font_picker",
        "id": "font_body",
        "label": "Body font",
        "default": "sans-serif"
      },
      {
        "type": "range",
        "id": "font_size_base",
        "label": "Base font size (px)",
        "default": 16,
        "min": 12,
        "max": 20,
        "step": 1
      },
      {
        "type": "range",
        "id": "letter_spacing",
        "label": "Letter spacing (em)",
        "default": 2,
        "min": 0,
        "max": 5,
        "step": 1
      },
      {
        "type": "header",
        "content": "Animations & Effects"
      },
      {
        "type": "checkbox",
        "id": "enable_scroll_animations",
        "label": "Enable scroll animations",
        "default": true
      },
      {
        "type": "checkbox",
        "id": "enable_hover_effects",
        "label": "Enable hover effects",
        "default": true
      },
      {
        "type": "checkbox",
        "id": "enable_particles",
        "label": "Enable particle system",
        "default": true
      },
      {
        "type": "range",
        "id": "particle_count",
        "label": "Particle count",
        "default": 40,
        "min": 10,
        "max": 100,
        "step": 5
      },
      {
        "type": "range",
        "id": "animation_speed",
        "label": "Animation speed multiplier",
        "default": 100,
        "min": 50,
        "max": 200,
        "step": 10,
        "unit": "%"
      },
      {
        "type": "header",
        "content": "Layout & Spacing"
      },
      {
        "type": "range",
        "id": "max_width",
        "label": "Max page width (px)",
        "default": 1280,
        "min": 960,
        "max": 1920,
        "step": 80
      },
      {
        "type": "range",
        "id": "section_spacing",
        "label": "Section spacing (rem)",
        "default": 6,
        "min": 2,
        "max": 12,
        "step": 1
      },
      {
        "type": "range",
        "id": "border_radius",
        "label": "Border radius (px)",
        "default": 0,
        "min": 0,
        "max": 20,
        "step": 2
      },
      {
        "type": "header",
        "content": "Components"
      },
      {
        "type": "checkbox",
        "id": "show_breadcrumbs",
        "label": "Show breadcrumbs",
        "default": true
      },
      {
        "type": "checkbox",
        "id": "show_product_reviews",
        "label": "Show product reviews",
        "default": true
      },
      {
        "type": "checkbox",
        "id": "show_related_products",
        "label": "Show related products",
        "default": true
      },
      {
        "type": "range",
        "id": "related_products_count",
        "label": "Related products count",
        "default": 4,
        "min": 2,
        "max": 12,
        "step": 1
      },
      {
        "type": "header",
        "content": "SEO & Accessibility"
      },
      {
        "type": "checkbox",
        "id": "enable_lazy_loading",
        "label": "Enable lazy loading for images",
        "default": true
      },
      {
        "type": "checkbox",
        "id": "enable_srcset",
        "label": "Enable responsive images (srcset)",
        "default": true
      },
      {
        "type": "text",
        "id": "meta_description",
        "label": "Store meta description"
      }
    ]
  },
  {
    "name": "Search & Navigation",
    "settings": [
      {
        "type": "checkbox",
        "id": "predictive_search_enabled",
        "label": "Enable predictive search",
        "default": true
      },
      {
        "type": "range",
        "id": "search_results_count",
        "label": "Search results limit",
        "default": 10,
        "min": 5,
        "max": 50,
        "step": 5
      }
    ]
  }
]
`,
};

async function prepareDirectories() {
    const directoryPaths = [
        themeRoot,
        path.join(themeRoot, 'layout'),
        path.join(themeRoot, 'templates'),
        path.join(themeRoot, 'sections'),
        path.join(themeRoot, 'snippets'),
        path.join(themeRoot, 'assets'),
        path.join(themeRoot, 'config'),
    ];

    for (const dir of directoryPaths) {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function writeThemeFiles() {
    const entries = Object.entries(files);
    for (const [relativePath, content] of entries) {
        const targetPath = path.join(themeRoot, relativePath);
        await fs.writeFile(targetPath, content, 'utf8');
    }
}

async function copyThemeAssets() {
    for (const asset of assetFiles) {
        const sourcePath = path.join(publicRoot, asset);
        const destinationPath = path.join(themeRoot, 'assets', asset);
        try {
            await fs.copyFile(sourcePath, destinationPath);
        } catch (error) {
            console.warn(`Warning: Could not copy asset ${asset}: ${error.message}`);
        }
    }
}

async function createZipArchive() {
    try {
        await fs.rm(zipPath, { force: true });
    } catch (error) {
        // ignore
    }

    if (process.platform === 'win32') {
        await new Promise((resolve, reject) => {
            const command = `Compress-Archive -Force -Path '${path.join(themeRoot, '*')}' -DestinationPath '${zipPath}'`;
            execFile('powershell', ['-NoProfile', '-Command', command], (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || error.message));
                } else {
                    resolve(stdout);
                }
            });
        });
    } else {
        await new Promise((resolve, reject) => {
            const zipCommand = `zip -r '${zipPath}' '${path.basename(themeRoot)}'`;
            execFile('sh', ['-lc', zipCommand], { cwd: workspaceRoot }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(stderr || stdout || error.message));
                } else {
                    resolve(stdout);
                }
            });
        });
    }
}

async function main() {
    console.log('Creating Shopify theme folder:', themeRoot);
    await prepareDirectories();
    await writeThemeFiles();
    await copyThemeAssets();
    console.log('Writing theme asset files and Liquid templates...');
    await createZipArchive();
    console.log('shopify-theme-sanctum.zip created successfully in workspace root.');
}

main().catch((error) => {
    console.error('Failed to create Shopify theme archive:', error);
    process.exit(1);
});
