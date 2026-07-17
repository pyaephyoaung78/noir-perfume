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
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      document.body.style.overflow = '';
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
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

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
  const tiltCards = document.querySelectorAll('.product-card, .testimonial-card');

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

  // ─── 3D Bottle tilt on product image hover ───
  const productImages = document.querySelectorAll('.product-image');

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

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const offset = 80;
        const position = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // ─── Add cart button feedback ───
  document.querySelectorAll('.product-card .btn-small').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const original = btn.textContent;
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

});