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
    const btn = document.getElementById('submitBtn');
    btn.querySelector('.btn-text').classList.add('hidden');
    btn.querySelector('.btn-loading').classList.remove('hidden');
    btn.disabled = true;

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
    } catch (_) {}

    form.classList.add('hidden');
    success.classList.remove('hidden');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
