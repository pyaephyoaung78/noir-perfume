document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ───
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ─── Mobile menu toggle ───
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  function closeMobileMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('mobile-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
      closeMobileMenu();
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // ─── Hero animation (replays on scroll back) ───
  const hero = document.querySelector('.hero');

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        hero.classList.add('animate');
      } else {
        hero.classList.remove('animate');
      }
    });
  }, { threshold: 0.2 });

  heroObserver.observe(hero);

  // ─── Counter animation (replays on scroll back) ───
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  const counterTimers = new Map();

  function animateCounter(el, target) {
    if (counterTimers.has(el)) clearInterval(counterTimers.get(el));
    let current = 0;
    el.textContent = '0';
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
        counterTimers.delete(el);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 30);
    counterTimers.set(el, timer);
  }

  // ─── Collection filter ───
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach((card, i) => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = `fadeIn3D 0.6s ${i * 0.1}s both`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ─── Newsletter form ───
  const form = document.getElementById('newsletterForm');
  const successMsg = document.getElementById('newsletterSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    if (email) {
      form.style.display = 'none';
      successMsg.classList.add('show');
    }
  });

  // ─── 3D Scroll Reveal (works both directions) ───
  const revealConfigs = [
    { selector: '.about-content', class: 'reveal-3d-left' },
    { selector: '.about-visual', class: 'reveal-3d-right' },
    { selector: '.collection-grid', class: 'reveal-3d-up' },
    { selector: '.testimonials-grid', class: 'reveal-3d-flip' },
    { selector: '.newsletter-content', class: 'reveal-3d-up' },
    { selector: '.footer-grid', class: 'reveal-3d-up' },
  ];

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealConfigs.forEach(config => {
    document.querySelectorAll(config.selector).forEach(el => {
      el.classList.add(config.class);
      revealObserver.observe(el);
    });
  });

  // ─── Stagger children on scroll (both directions) ───
  const staggerContainers = document.querySelectorAll('.collection-grid, .testimonials-grid, .about-features');

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  staggerContainers.forEach(el => {
    el.classList.add('stagger-children');
    staggerObserver.observe(el);
  });

  // ─── 3D Tilt on Mouse Move (product cards) ───
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tiltCards = document.querySelectorAll('.product-card, .testimonial-card');

  if (!prefersReducedMotion) {
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;

      // Update CSS variable for testimonial radial glow
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', percentX + '%');
      card.style.setProperty('--mouse-y', percentY + '%');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });
  } // end prefers-reduced-motion tilt guard

  // ─── 3D Bottle tilt on product image hover ───
  const productImages = document.querySelectorAll('.product-image');

  if (!prefersReducedMotion) {
  productImages.forEach(img => {
    const bottle = img.querySelector('.product-bottle');
    if (!bottle) return;

    img.addEventListener('mousemove', (e) => {
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      bottle.style.transform = `perspective(600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-12px) scale(1.08)`;
    });

    img.addEventListener('mouseleave', () => {
      bottle.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)';
    });
  });
  }

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#main') {
        if (targetId === '#main') return; // let skip link use native jump
        return;
      }
      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const offset = 80;
        const position = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // ─── Cart with localStorage + mini drawer ───
  const CART_KEY = 'noir_cart';
  const cartBtn = document.getElementById('cartBtn');
  const cartCount = document.getElementById('cartCount');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsEl = document.getElementById('cartItems');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartHeaderCount = document.getElementById('cartHeaderCount');
  const cartClose = document.getElementById('cartClose');
  const continueBtn = document.getElementById('continueBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const shopNowBtn = document.getElementById('shopNowBtn');
  const toastContainer = document.getElementById('toastContainer');

  let cart = new Map();
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (Array.isArray(saved)) cart = new Map(saved.map(item => [item.id, item]));
  } catch (err) {
    cart = new Map();
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify([...cart.values()]));
    } catch (err) {
      // storage unavailable — cart still works for session
    }
  }

  function getCartCount() {
    let n = 0;
    cart.forEach(item => { n += item.qty; });
    return n;
  }

  function getCartTotal() {
    let total = 0;
    cart.forEach(item => { total += item.price * item.qty; });
    return total;
  }

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    const dot = document.createElement('span');
    dot.className = 'toast-dot';
    toast.appendChild(dot);
    toast.appendChild(document.createTextNode(message));
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  function renderCart() {
    const count = getCartCount();
    const total = getCartTotal();
    if (cartCount) {
      cartCount.textContent = String(count);
      cartCount.classList.toggle('visible', count > 0);
    }
    if (cartHeaderCount) {
      cartHeaderCount.textContent = count > 0 ? `(${count})` : '';
    }
    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = `$${total}`;
    }
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';
    if (cart.size === 0) {
      const empty = document.createElement('div');
      empty.className = 'cart-empty';
      const title = document.createElement('p');
      title.textContent = 'Your cart is empty';
      const sub = document.createElement('p');
      sub.textContent = 'Discover a scent that tells your story.';
      empty.appendChild(title);
      empty.appendChild(sub);
      cartItemsEl.appendChild(empty);
      return;
    }
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const info = document.createElement('div');
      info.className = 'cart-item-info';
      const name = document.createElement('h4');
      name.textContent = item.name;
      const price = document.createElement('p');
      price.className = 'cart-item-price';
      price.textContent = `$${item.price} × ${item.qty} = $${item.price * item.qty}`;
      info.appendChild(name);
      info.appendChild(price);

      const actions = document.createElement('div');
      actions.className = 'cart-item-actions';
      const qtyWrap = document.createElement('div');
      qtyWrap.className = 'qty-controls';
      const dec = document.createElement('button');
      dec.textContent = '−';
      dec.setAttribute('aria-label', `Decrease ${item.name}`);
      dec.addEventListener('click', () => changeQty(item.id, -1));
      const qty = document.createElement('span');
      qty.textContent = String(item.qty);
      const inc = document.createElement('button');
      inc.textContent = '+';
      inc.setAttribute('aria-label', `Increase ${item.name}`);
      inc.addEventListener('click', () => changeQty(item.id, 1));
      qtyWrap.appendChild(dec);
      qtyWrap.appendChild(qty);
      qtyWrap.appendChild(inc);

      const remove = document.createElement('button');
      remove.className = 'cart-remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => removeItem(item.id));

      actions.appendChild(qtyWrap);
      actions.appendChild(remove);
      row.appendChild(info);
      row.appendChild(actions);
      cartItemsEl.appendChild(row);
    });
  }

  function bumpBadge() {
    if (!cartCount) return;
    cartCount.classList.remove('bump');
    void cartCount.offsetWidth; // reflow
    cartCount.classList.add('bump');
  }

  function addToCart(id, name, price) {
    const existing = cart.get(id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.set(id, { id, name, price, qty: 1 });
    }
    saveCart();
    renderCart();
    bumpBadge();
    showToast(`${name} added to cart`);
  }

  function changeQty(id, delta) {
    const item = cart.get(id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart.delete(id);
    saveCart();
    renderCart();
  }

  function removeItem(id) {
    const item = cart.get(id);
    cart.delete(id);
    saveCart();
    renderCart();
    if (item) showToast(`${item.name} removed`);
  }

  let lastFocusedBeforeCart = null;

  function openCart() {
    if (!cartDrawer || !cartOverlay) return;
    lastFocusedBeforeCart = document.activeElement;
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (cartClose) cartClose.focus();
  }

  function closeCart() {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedBeforeCart && lastFocusedBeforeCart.focus) {
      lastFocusedBeforeCart.focus();
    }
  }

  if (cartDrawer) {
    cartDrawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !cartDrawer.classList.contains('open')) return;
      const focusable = cartDrawer.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
      const visible = [...focusable].filter(el => !el.disabled);
      if (visible.length === 0) return;
      const first = visible[0];
      const last = visible[visible.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (continueBtn) continueBtn.addEventListener('click', closeCart);
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.size === 0) {
        showToast('Your cart is empty');
        return;
      }
      showToast(`Checkout demo — ${getCartCount()} items, $${getCartTotal()}`);
    });
  }
  if (shopNowBtn) {
    shopNowBtn.addEventListener('click', () => {
      const targetEl = document.querySelector('#collection');
      if (targetEl) {
        const position = targetEl.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: position, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('open')) {
      closeCart();
    }
  });

  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.btn-small');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = card.getAttribute('data-id') || card.querySelector('h3').textContent.trim().toLowerCase().replace(/\s+/g, '-');
      const name = card.getAttribute('data-name') || card.querySelector('h3').textContent.trim();
      const price = parseInt(card.getAttribute('data-price') || card.querySelector('.product-price').textContent.replace(/\D/g, ''), 10) || 0;
      addToCart(id, name, price);
      const original = 'Add to Cart';
      btn.textContent = 'Added!';
      btn.style.background = 'var(--accent)';
      btn.style.color = 'var(--bg-primary)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);
    });
  });

  renderCart();

});