/* =========================================
   ORBIT ARISTOCRAT — script.js
   ========================================= */

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2400);
});

/* ---- STARFIELD CANVAS ---- */
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initStars(count = 200) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.pulse += 0.02;
      const a = 0.3 + 0.5 * Math.abs(Math.sin(s.pulse));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${a * 0.25})`;
      ctx.fill();

      // occasional bright star
      if (s.r > 1.2) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,246,248,${a * 0.6})`;
        ctx.fill();
      }

      // slow drift
      s.y -= s.speed;
      if (s.y < -5) {
        s.y = H + 5;
        s.x = Math.random() * W;
      }
    });
    requestAnimationFrame(drawStars);
  }

  resize();
  initStars();
  drawStars();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

/* ---- SPA PAGE SWITCHING ---- */
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

function switchPage(id) {
  // Hide all
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));

  // Show target
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Highlight nav
  navLinks.forEach(l => {
    if (l.getAttribute('data-page') === id) {
      l.classList.add('active');
    }
  });

  // Re-trigger reveal animations
  setTimeout(initReveal, 100);
}

// Handle nav link clicks
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    switchPage(page);
    // Close hamburger if open
    document.getElementById('navLinks').classList.remove('open');
  });
});

function scrollToSection(id) {
  switchPage(id);
}

// Make globally available
window.switchPage = switchPage;
window.scrollToSection = scrollToSection;

/* ---- HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

/* ---- REVEAL ANIMATIONS ---- */
function initReveal() {
  const reveals = document.querySelectorAll('.page.active .reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => {
    el.classList.remove('visible');
    observer.observe(el);
  });
}

window.addEventListener('load', () => {
  setTimeout(initReveal, 300);
});

/* ---- ANIMATED COUNTERS ---- */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

// Trigger counters when hero stats are visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---- FAQ ACCORDION ---- */
window.toggleFaq = function (btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-question.open').forEach(q => {
    q.classList.remove('open');
    q.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
  });

  // Open this if it was closed
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
};

/* ---- CONTACT FORM ---- */
window.handleForm = function (e) {
  e.preventDefault();
  const form = e.target;
  const successEl = document.getElementById('formSuccess');

  // Simulate send (real implementation uses mailto or backend)
  const email = form.querySelector('input[type="email"]').value;
  const name = form.querySelector('input[type="text"]').value;

  // Build mailto link
  const subject = encodeURIComponent('Mission Inquiry — Orbit Aristocrat');
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nInquiry submitted via website.`
  );
  window.open(`mailto:contactglanders@gmail.com?subject=${subject}&body=${body}`);

  // Show success
  form.style.display = 'none';
  successEl.style.display = 'block';
};

/* ---- PARALLAX on hero image ---- */
window.addEventListener('scroll', () => {
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    const scrolled = window.scrollY;
    heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

/* ---- SMOOTH hover on service cards ---- */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.zIndex = '10';
  });
  card.addEventListener('mouseleave', () => {
    card.style.zIndex = '';
  });
});

/* ---- CURSOR GLOW (desktop only) ---- */
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    background: radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ---- MARQUEE duplicate for seamless loop ---- */
const stripContent = document.querySelector('.strip-content');
if (stripContent) {
  stripContent.innerHTML += stripContent.innerHTML;
}

console.log('%c ORBIT ARISTOCRAT ', 'background: #c9a227; color: #020408; font-size: 16px; font-weight: bold; padding: 8px 16px;');
console.log('%c Precision. Excellence. Orbit. ', 'color: #c9a227; font-size: 11px;');
