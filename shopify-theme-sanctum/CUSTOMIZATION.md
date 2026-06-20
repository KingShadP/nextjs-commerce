# Shopify Theme Sanctum - Customization Guide

## Quick Start

1. **Extract & Upload**: Extract `shopify-theme-sanctum.zip` in Shopify Admin → Themes → Upload theme file
2. **Customize**: Go to Themes → Customize to edit colors, layouts, and animations
3. **Deploy**: Publish the theme to your store

---

## Theme Settings (Customizer)

### Colors & Branding
- **Background Color**: Main background (default: #090807)
- **Text Color**: Primary text (default: #f5f3ef)
- **Accent Color**: Buttons, highlights (default: #c5a880)
- **Secondary Color**: Alternate accent (default: #5c4f44)
- **Logo Image**: Upload custom logo

### Cinematic Environment
- **Fog Effect**: Toggle smoky background fog (default: ON)
  - Fog Opacity: 0-100% (default: 18%)
- **Light Sweep**: Golden animated light effect (default: ON)
  - Light Sweep Opacity: 0-100% (default: 32%)
- **Floor Reflection**: Perspective floor effect (default: ON)
- **Grain Texture**: Film grain overlay (default: ON)
  - Grain Opacity: 0-50% (default: 5%)
- **Motion Intensity**: Scroll animation intensity 1-10 (default: 7)

### Typography
- **Heading Font**: Choose serif/sans-serif
- **Body Font**: Choose serif/sans-serif
- **Base Font Size**: 12-20px (default: 16px)
- **Letter Spacing**: 0-5em (default: 2em)

### Animations & Effects
- **Scroll Animations**: Enable parallax/fade effects on scroll
- **Hover Effects**: Enable 3D tilt/scale on hover
- **Particle System**: Enable gold dust particle animation
  - Particle Count: 10-100 (default: 40)
- **Animation Speed**: 50-200% multiplier (default: 100%)

### Layout & Spacing
- **Max Page Width**: 960-1920px (default: 1280px)
- **Section Spacing**: 2-12rem (default: 6rem)
- **Border Radius**: 0-20px (default: 0px)

### Components
- **Show Breadcrumbs**: Navigation path display
- **Show Product Reviews**: Customer ratings & reviews
- **Show Related Products**: Suggest similar items
- **Related Products Count**: 2-12 items (default: 4)

### SEO & Accessibility
- **Lazy Loading**: Defer image loading for performance
- **Responsive Images**: Enable srcset for different screen sizes
- **Meta Description**: Store-wide SEO description

### Search & Navigation
- **Predictive Search**: Show suggestions as users type
- **Search Results Limit**: 5-50 results (default: 10)

---

## Section Customization

### Hero Slideshow
Edit homepage hero section carousel:
- **Slide Subtitle**: Eyebrow text
- **Slide Title**: Main heading
- **Primary Button**: Shop link
- **Secondary Button**: Explore link
- **Auto Rotate**: Enable/disable auto-advance
- **Slide Duration**: 3-15 seconds

### Marquee Ribbon
Scrolling materials ticker:
- **Materials Text**: Pipe-separated items (|)
- **Animation Speed**: 10-60 seconds
- **Text Color**: Custom color

### Technical Dossier
Feature grid showcase:
- **Feature 1-4 Titles**: Custom labels
- **Feature 1-4 Descriptions**: Full descriptions

### Featured Collection Carousel
Horizontal product carousel:
- **Section Number**: Section label (e.g., "01")
- **Collection Label**: Category label
- **Section Title**: Main heading
- **Hint Text**: User instruction
- **Collection**: Select collection
- **Product Count**: 4-20 items

### Newsletter
Email signup section:
- **Label**: Section label
- **Title**: Heading
- **Description**: Body text
- **Input Prefix**: Symbol before input (>)
- **Input Placeholder**: Input text hint
- **Button Text**: CTA button
- **Footnote**: Security message

### Main Product
Product detail page:
- **Label**: Section label
- **Variant Label**: Size/color selector label
- **Add to Cart Text**: Button text

### Main Collection
Product grid display:
- **Label**: Collection label

### Cart Drawer
Shopping cart sidebar:
- **Cart Title**: Header text
- **Quantity Label**: "Qty" customization
- **Subtotal Label**: Subtotal text
- **Checkout Button Text**: CTA text
- **Empty Cart Message**: Empty state text

---

## CSS Customization

Edit `assets/theme.css` for:
- Layout adjustments
- Color overrides
- Animation timing
- Responsive breakpoints
- Custom fonts

Key CSS variables:
```css
:root {
  --background: #090807;
  --foreground: #f5f3ef;
  --skims-accent: #c5a880;
}
```

---

## JavaScript Customization

Edit `assets/theme.js` for:
- Carousel behavior
- Cart drawer logic
- Animation timing
- Event handlers
- Custom effects

---

## Advanced: Modifying Liquid Templates

### Adding New Sections
1. Create file: `sections/my-section.liquid`
2. Add `{% schema %}` block with settings
3. Use in templates: `{% section 'my-section' %}`

### Using Settings in Liquid
```liquid
{{ section.settings.setting_id }}
{{ section.settings.setting_id | money }}
```

### Adding CSS Classes from Settings
```liquid
<div class="{% if section.settings.some_checkbox %}has-feature{% endif %}">
```

---

## Performance Tips

1. **Enable Lazy Loading**: Defer offscreen images
2. **Optimize Images**: Use WebP format when possible
3. **Minimize Particles**: Reduce particle count on mobile
4. **Disable Animations**: On slower devices via `prefers-reduced-motion`

---

## Mobile Responsive

Theme automatically adapts:
- Desktop: Full cinematic environment
- Tablet: Reduced fog/effects
- Mobile: Simplified animations, stacked layout

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Graceful fallbacks for:
- GSAP/ScrollTrigger (loaded from CDN)
- Canvas particle system
- CSS Grid/Flexbox layouts

---

## Support & Troubleshooting

### Theme not updating?
- Clear Shopify cache: Settings → Clear theme cache
- Hard refresh browser: Ctrl+Shift+R (Cmd+Shift+R on Mac)

### Animations too slow?
- Reduce Motion Intensity setting
- Disable particle system
- Check browser performance

### Images not loading?
- Verify `public/` asset files exist
- Check asset file permissions
- Re-run: `node scratch/create-shopify-theme.js`

---

## File Structure

```
shopify-theme-sanctum/
├── layout/
│   └── theme.liquid          # Main template
├── templates/
│   ├── index.liquid          # Homepage
│   ├── product.liquid        # Product detail
│   ├── collection.liquid     # Category pages
│   └── cart.liquid           # Shopping cart
├── sections/
│   ├── header.liquid         # Navigation
│   ├── hero-slideshow.liquid # Hero carousel
│   ├── marquee-ribbon.liquid # Ticker
│   ├── technical-dossier.liquid
│   ├── featured-collection-carousel.liquid
│   ├── newsletter.liquid     # Email signup
│   ├── main-product.liquid   # Product details
│   └── main-collection.liquid
├── snippets/
│   ├── product-card.liquid   # Reusable product card
│   └── cart-drawer.liquid    # Cart sidebar
├── assets/
│   ├── theme.css             # All styles
│   ├── theme.js              # All JavaScript
│   └── [image files]         # Room backgrounds, etc.
└── config/
    └── settings_schema.json  # Theme customizer UI
```

---

## Regenerating Theme

To regenerate with latest changes:

```bash
cd /path/to/the-sanctum
node scratch/create-shopify-theme.js
```

This will:
1. Rebuild `shopify-theme-sanctum/` directory
2. Copy assets from `public/`
3. Create new `shopify-theme-sanctum.zip`
4. Ready to upload to Shopify

---

## License

© 2026 The Sanctum. All customizations allowed for authorized stores.
