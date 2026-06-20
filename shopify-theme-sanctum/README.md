# Shopify Theme Sanctum

A highly customizable, cinematic e-commerce theme with advanced animations, professional design patterns, and extensive settings for complete brand control.

**✨ Key Features:**
- Cinematic animated background with fog, lighting effects, and particles
- Extensive customizer settings for colors, typography, animations
- Modular section-based architecture
- Mobile-responsive design
- GSAP ScrollTrigger integration
- Performance optimized

---

## 📦 Installation

### Step 1: Upload to Shopify
1. Go to Shopify Admin → **Themes**
2. Click **Upload theme file**
3. Select `shopify-theme-sanctum.zip`
4. Wait for upload to complete

### Step 2: Customize
1. Click **Customize** on the newly uploaded theme
2. Adjust theme settings (colors, animations, layout)
3. Edit sections (Hero, Newsletter, Products, etc.)
4. Preview on different devices

### Step 3: Publish
1. Click **Publish** to make theme live
2. Your store now uses The Sanctum theme

---

## 🎨 Customization Guide

### Global Theme Settings

Access via **Customize → Theme Settings**

#### Colors & Branding
| Setting | Default | Usage |
|---------|---------|-------|
| Background Color | #090807 | Main page background |
| Text Color | #f5f3ef | Primary text |
| Accent Color | #c5a880 | Buttons, links, highlights |
| Secondary Color | #5c4f44 | Alternate accents |
| Logo Image | — | Upload custom logo |

#### Cinematic Environment
| Effect | Default | Control |
|--------|---------|---------|
| Smoky Fog | ON | Enable/disable |
| Fog Opacity | 18% | 0-100% |
| Light Sweep | ON | Golden animated light |
| Light Sweep Opacity | 32% | 0-100% |
| Floor Reflection | ON | Perspective effect |
| Grain Texture | ON | Film grain overlay |
| Grain Opacity | 5% | 0-50% |
| Motion Intensity | 7/10 | Scroll animation intensity |

*Note: Cinematic effects degrade gracefully on mobile devices*

#### Typography
- **Heading Font**: Choice of serif/sans-serif
- **Body Font**: Choice of serif/sans-serif
- **Base Font Size**: 12-20px (default 16px)
- **Letter Spacing**: 0-5em for uppercase tracking (default 2em)

#### Animations
- **Enable Scroll Animations**: Parallax, fade-in effects
- **Enable Hover Effects**: 3D tilt, scale, color transitions
- **Enable Particle System**: Gold dust particle animation
- **Particle Count**: 10-100 (default 40)
- **Animation Speed**: 50-200% multiplier (default 100%)

#### Layout
- **Max Page Width**: 960-1920px (default 1280px)
- **Section Spacing**: 2-12rem vertical spacing (default 6rem)
- **Border Radius**: 0-20px for rounded corners (default 0px)

#### Components
- **Show Breadcrumbs**: Navigation path on product pages
- **Show Product Reviews**: Customer ratings
- **Show Related Products**: Similar item suggestions
- **Related Products Count**: 2-12 (default 4)

#### SEO & Performance
- **Lazy Loading**: Defer offscreen images
- **Responsive Images**: Enable srcset for different screens
- **Meta Description**: Store-wide SEO text

---

## 📄 Available Sections

All sections are highly customizable. Edit via **Customize** or **Customize → Select Theme**:

### Core Sections

#### Header
- Announcement text & color
- Navigation link labels
- Sticky header toggle
- Background & text colors
- Height adjustment

#### Hero Slideshow
- Slide subtitle/title
- Button URLs & text
- Auto-rotate toggle
- Slide duration (3-15 seconds)
- Navigation controls

#### Marquee Ribbon
- Materials text (pipe-separated)
- Animation speed
- Custom text color

#### Technical Dossier
- Feature 1-4 titles
- Feature 1-4 descriptions
- Icon/visual customization

#### Featured Collection Carousel
- Section numbering
- Collection selection
- Product count (4-20)
- Button text & styling
- Responsive scroll

#### Newsletter
- All text customizable (title, description, button)
- Input placeholder customization
- Form styling options

#### Product Detail Page
- Label customization
- Variant selector label
- Add-to-cart text
- Related products display

#### Collection Grid
- Custom label
- Product per page
- Sorting options

#### Cart Drawer
- Cart title
- Button text
- Empty state message
- Quantity/subtotal labels

### Optional Premium Sections

#### Rich Text + Image
**Create flexible content layouts**
- Image placement (left/right)
- Rich text editor
- Button with custom styling
- Great for: About sections, feature highlights

**Customizable:**
- Image & text
- Button style (primary/ghost)
- Layout direction

#### Testimonials
**Customer review carousel**
- Per-testimonial settings:
  - Customer avatar image
  - Name & title
  - 1-5 star rating
  - Review text

**Grid display:** Automatically responsive

#### Call to Action
**High-impact promotion section**
- Eyebrow text
- Heading (large, scalable)
- Description
- Primary & secondary buttons
- Background color
- Text alignment (left/center/right)
- Custom padding

#### FAQ / Accordion
**Expandable Q&A section**
- Add unlimited questions
- Per-question customization:
  - Question text
  - Rich text answers
- Smooth expand/collapse animation
- Auto-close on new question (optional)

---

## 🔧 Advanced Customization

### Adding Custom Sections

1. Create new file in `sections/` folder
2. Use Liquid template format
3. Add `{% schema %}` block with settings
4. Include in templates via `{% section 'my-section' %}`

Example:
```liquid
<section class="my-section">
  <h2>{{ section.settings.title }}</h2>
  <p>{{ section.settings.content }}</p>
</section>

{% schema %}
{
  "name": "My Custom Section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title"
    },
    {
      "type": "textarea",
      "id": "content",
      "label": "Content"
    }
  ]
}
{% endschema %}
```

### CSS Customization

Edit `assets/theme.css` for:
- Layout tweaks
- Color overrides
- Animation timing
- Responsive breakpoints
- Custom fonts

Key CSS variables (in `:root`):
```css
--background: #090807;
--foreground: #f5f3ef;
--skims-accent: #c5a880;
```

### JavaScript Customization

Edit `assets/theme.js` for:
- Carousel behavior
- Cart drawer logic
- Event handlers
- Custom animations

---

## 📱 Responsive Behavior

Theme automatically adapts:

| Device | Behavior |
|--------|----------|
| Desktop (1200px+) | Full cinematic environment, all effects enabled |
| Tablet (768-1200px) | Reduced fog, simplified animations |
| Mobile (<768px) | Stacked layout, minimal effects, optimized images |

Graceful fallbacks:
- CSS Grid → Flexbox
- GSAP animations → CSS transitions
- Particle system → Disabled on mobile

---

## 🚀 Performance Tips

1. **Enable Lazy Loading**: Defers offscreen image loading
2. **Use WebP Images**: Modern format saves bandwidth
3. **Reduce Particles**: Lower count on slower devices
4. **Minify CSS/JS**: Production builds
5. **Enable Responsive Images**: Different sizes per device
6. **CDN Assets**: Store images on CDN (Shopify built-in)

Performance checklist:
- ✅ Lazy load enabled
- ✅ Responsive images enabled
- ✅ Images optimized (<100KB per image)
- ✅ Particle count reasonable (20-40)
- ✅ Animations enabled but not excessive

---

## ⌨️ Keyboard Shortcuts

In Shopify Customizer:
| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + S | Save changes |
| Cmd/Ctrl + Z | Undo |
| Cmd/Ctrl + Shift + Z | Redo |
| Escape | Close dialog |

---

## 🐛 Troubleshooting

### Settings Not Updating?
1. Clear browser cache: **Cmd/Ctrl + Shift + R**
2. Hard refresh: **Cmd/Ctrl + Shift + Delete** (cached files)
3. Incognito window: Test in private browsing
4. Different browser: Rule out browser issues

### Animations Too Slow?
1. Reduce **Motion Intensity** (1-3 instead of 7-10)
2. Disable **Particle System**
3. Check browser performance (DevTools)
4. Update browser to latest version

### Images Not Loading?
1. Verify image files in `public/` directory exist
2. Check image file permissions (should be readable)
3. Re-run compiler: `node scratch/create-shopify-theme.js`
4. Clear Shopify CDN cache (Settings → Cache)

### Mobile Menu Not Working?
1. Check for JavaScript errors (DevTools Console)
2. Verify hamburger menu JS in `theme.js`
3. Test in different mobile browser
4. Clear mobile browser cache

### Colors Not Applying?
1. Go to **Customize → Theme Settings → Colors**
2. Verify each color is set
3. Check for section-level color overrides
4. Clear cache and refresh

---

## 📊 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| IE 11 | Any | ⚠️ Limited (no animations) |

Graceful degradation:
- Animations fall back to CSS transitions
- Grid layouts fall back to Flexbox
- Modern filters use fallback colors

---

## 📄 File Structure

```
shopify-theme-sanctum/
├── layout/
│   └── theme.liquid              # Main template
├── templates/
│   ├── index.liquid              # Homepage
│   ├── product.liquid            # Product pages
│   ├── collection.liquid         # Category pages
│   └── cart.liquid               # Shopping cart
├── sections/
│   ├── header.liquid             # Navigation
│   ├── hero-slideshow.liquid     # Hero carousel
│   ├── marquee-ribbon.liquid     # Ticker
│   ├── technical-dossier.liquid  # Feature grid
│   ├── featured-collection-carousel.liquid
│   ├── newsletter.liquid         # Email signup
│   ├── main-product.liquid       # Product details
│   ├── main-collection.liquid    # Product grid
│   ├── cart-drawer.liquid        # Shopping cart UI
│   ├── rich-text-image.liquid    # Content section
│   ├── testimonials.liquid       # Reviews carousel
│   ├── call-to-action.liquid     # CTA banner
│   └── faq.liquid                # FAQ accordion
├── snippets/
│   ├── product-card.liquid       # Reusable product component
│   └── cart-drawer.liquid        # Cart sidebar logic
├── assets/
│   ├── theme.css                 # All styles
│   ├── theme.js                  # All JavaScript
│   └── [image files]             # Room backgrounds, logos, etc.
├── config/
│   └── settings_schema.json      # Customizer UI configuration
└── CUSTOMIZATION.md              # This file
```

---

## 🔄 Regenerating the Theme

To update with latest changes:

```bash
cd /path/to/the-sanctum
node scratch/create-shopify-theme.js
```

This:
1. Rebuilds `shopify-theme-sanctum/` directory
2. Copies assets from `public/`
3. Creates new `shopify-theme-sanctum.zip`
4. Ready to upload to Shopify

---

## 📞 Support

For issues or questions:
1. Check Shopify Theme Store documentation
2. Review theme customization guide above
3. Test in Shopify development store first
4. Check browser console for errors (DevTools)
5. Contact Shopify support for platform issues

---

## 📜 License

© 2026 The Sanctum. All rights reserved.

This theme is licensed for use on authorized Shopify stores only.

---

## 🎯 Next Steps

1. ✅ Upload theme to Shopify
2. ✅ Customize colors & branding
3. ✅ Add/edit sections on homepage
4. ✅ Test on mobile devices
5. ✅ Publish to store

**Happy selling! 🚀**
