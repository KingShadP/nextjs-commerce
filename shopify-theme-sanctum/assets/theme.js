const assets = {
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
      li.innerHTML = '<div class="cart-item__details"><span class="cart-item__title">' + item.product_title + '</span><span class="cart-item__quantity">Qty: ' + item.quantity + '</span></div><span class="cart-item__price">' + (window.Shopify?.formatMoney ? Shopify.formatMoney(item.line_price, window.theme?.moneyFormat || '${{amount}}') : '$' + (item.line_price / 100).toFixed(2)) + '</span>';
      list.appendChild(li);
    });
    drawer.querySelector('.cart-drawer__panel').appendChild(list);
    const footer = document.createElement('div');
    footer.className = 'cart-drawer__footer';
    footer.innerHTML = '<span class="cart-total">Subtotal: ' + (window.Shopify?.formatMoney ? Shopify.formatMoney(cart.total_price, window.theme?.moneyFormat || '${{amount}}') : '$' + (cart.total_price / 100).toFixed(2)) + '</span><a class="button button--primary" href="/checkout">Checkout</a>';
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
