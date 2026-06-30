/* ══════════════════════════════════════════
   SAVORY SOUTH BITES — Premium JS
══════════════════════════════════════════ */

// ── Loader ────────────────────────────────
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('gone'), 900);
});

// ── Custom cursor ─────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (cursor && follower) {
  let mouseX = 0, mouseY = 0, follX = 0, follY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    follX += (mouseX - follX) * 0.1;
    follY += (mouseY - follY) * 0.1;
    follower.style.left = follX + 'px';
    follower.style.top  = follY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a,button,.dish-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform    = 'translate(-50%,-50%) scale(2.4)';
      follower.style.width      = '60px';
      follower.style.height     = '60px';
      follower.style.opacity    = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform    = 'translate(-50%,-50%) scale(1)';
      follower.style.width      = '32px';
      follower.style.height     = '32px';
      follower.style.opacity    = '0.5';
    });
  });
}

// ── Navbar scroll ─────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 72);
}, { passive: true });

// ── Hamburger ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Scroll reveal ─────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-fade')
  .forEach(el => io.observe(el));

// ── Counter animation ─────────────────────
function runCounter(el) {
  const target = +el.dataset.target;
  const dur = 1800;
  const step = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.round(cur);
    if (cur >= target) clearInterval(t);
  }, 16);
}

const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      runCounter(e.target);
      cio.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-target]').forEach(el => cio.observe(el));

// ── Hero parallax ─────────────────────────
const heroBg = document.querySelector('.hero-media');
if (heroBg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.12}px)`;
    }
  }, { passive: true });
}

// ── Drag-scroll menu ──────────────────────
const track = document.querySelector('.menu-scroll');
if (track) {
  let isDown = false, startX, scrollLeft;

  track.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  document.addEventListener('mouseup', () => {
    isDown = false;
    if (track) track.style.cursor = 'grab';
  });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.2;
  });

  let startTouchX;
  track.addEventListener('touchstart', e => {
    startTouchX = e.touches[0].pageX;
    scrollLeft = track.scrollLeft;
  }, { passive: true });
  track.addEventListener('touchmove', e => {
    const x = e.touches[0].pageX;
    track.scrollLeft = scrollLeft - (x - startTouchX);
  }, { passive: true });
}

// ── Order form ────────────────────────────
// Submits to a Google Apps Script Web App, which appends the order to a
// Google Sheet (no WhatsApp auto-send). Replace SCRIPT_URL with your
// deployed Apps Script /exec URL — see SETUP_ORDER_FORM.md.
const ORDER_FORM_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwASMTPWeV7XU9ntKA-9-3DTID4Rm8nXvlR-qy_ihL1iJl11heBVb2xwb0fTS943jFs/exec';
const BUSINESS_WHATSAPP_NUMBER = '31649286005'; // your number, country code, no + or spaces
const ORDER_FORM_SECRET = '8b356999d2a7bb85f934f05518f0f5fe'; // must match SECRET_KEY in the Apps Script

const form = document.getElementById('orderForm');
const success = document.getElementById('formSuccess');

if (form) {
  const dateInput = document.getElementById('dateInput');
  if (dateInput) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    dateInput.min = d.toISOString().split('T')[0];
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // honeypot: bots fill every field, real users never see/fill this one
    if (form.elements['company']?.value) return;

    const btn = document.getElementById('submitBtn');
    btn.querySelector('.btn-text').classList.add('hidden');
    btn.querySelector('.btn-loading').classList.remove('hidden');
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form).entries());
    data.secret = ORDER_FORM_SECRET;

    try {
      await fetch(ORDER_FORM_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script doesn't return CORS headers; response is opaque but the write still happens
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
    } catch (_) {
      // network failure — still show success so the user isn't blocked
    }

    // Build a pre-filled WhatsApp message so the customer just taps send
    const waMessage =
      `Hi! I'd like to confirm my order:\n\n` +
      `Name: ${data.name}\n` +
      `Phone: ${data.phone}\n` +
      `Area: ${data.area}\n` +
      `Date: ${data.date}\n` +
      `Order: ${data['order-details']}\n` +
      `Address: ${data.address}` +
      (data.notes ? `\nNotes: ${data.notes}` : '');

    const waLink = document.getElementById('waConfirmLink');
    if (waLink) {
      waLink.href = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
    }

    form.classList.add('hidden');
    success.classList.remove('hidden');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });

    btn.querySelector('.btn-text').classList.remove('hidden');
    btn.querySelector('.btn-loading').classList.add('hidden');
    btn.disabled = false;
  });
}

// ── Smooth scroll ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 68, behavior: 'smooth' });
  });
});

// ── Active nav highlight ──────────────────
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navAs.forEach(a => {
        const match = a.getAttribute('href') === `#${id}`;
        a.style.color = match ? 'var(--gold-lt)' : '';
      });
    }
  });
}, { threshold: 0.45 }).observe(document.querySelector('#home'));

sections.forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--gold-lt)' : '';
        });
      }
    });
  }, { threshold: 0.4 }).observe(s);
});
