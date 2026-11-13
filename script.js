document.addEventListener('DOMContentLoaded', () => {
  const topbar = document.getElementById('topbar');
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const navDrawer = document.getElementById('nav-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const sections = document.querySelectorAll('main section[id], footer[id]');

  // Topbar scroll state
  const handleScroll = () => {
    topbar?.classList.toggle('scrolled', window.scrollY > 18);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Slide-over navigation drawer
  const openDrawer = () => {
    if (!navDrawer || !drawerBackdrop) return;
    navDrawer.hidden = false;
    drawerBackdrop.hidden = false;
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menuClose?.focus();
  };

  const closeDrawer = () => {
    if (!navDrawer || !drawerBackdrop) return;
    navDrawer.hidden = true;
    drawerBackdrop.hidden = true;
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuToggle?.addEventListener('click', openDrawer);
  menuClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Active section highlight in drawer
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        drawerLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      });
    },
    { rootMargin: '-35% 0px -50% 0px' }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  // Typewriter effect matching reference
  const typewriterEl = document.getElementById('typewriter-text');
  if (typewriterEl) {
    const phrases = [
      'const focus = "Software & Systems";',
      'BSIT Senior · STI College Batangas',
      'Web Platforms · SQL · Visual Computing',
    ];
    let phraseIdx = 0;
    let charIdx = phrases[0].length;
    let deleting = false;

    const tick = () => {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        typewriterEl.textContent = current.slice(0, charIdx);
        if (charIdx >= current.length) {
          deleting = true;
          setTimeout(tick, 2400);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIdx--;
        typewriterEl.textContent = current.slice(0, charIdx);
        if (charIdx <= 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, 28);
      }
    };

    setTimeout(() => {
      deleting = true;
      tick();
    }, 2600);
  }

  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // Skills filter pills
  const filterPills = document.querySelectorAll('.filter-pill');
  const skillCards = document.querySelectorAll('.skill-bento-card');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const filter = pill.dataset.filter;
      filterPills.forEach((p) => {
        const isActive = p === pill;
        p.classList.toggle('active', isActive);
        p.setAttribute('aria-selected', String(isActive));
      });

      skillCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  // Lightbox modal (shared for project screenshot & certificates)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('.lightbox__caption');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox-src]');
  const closeLightboxBtn = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  const openLightbox = (src, alt, caption) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || caption || 'Preview';
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeLightboxBtn?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  lightboxTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      openLightbox(
        btn.dataset.lightboxSrc,
        img?.getAttribute('alt'),
        btn.dataset.lightboxCaption
      );
    });
  });

  closeLightboxBtn?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && !lightbox.hidden) closeLightbox();
      if (navDrawer && !navDrawer.hidden) closeDrawer();
    }
  });

  // Copy email to clipboard + toast
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  let toastTimeout;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  };

  copyEmailBtn?.addEventListener('click', async () => {
    const email = copyEmailBtn.dataset.copy;
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      copyEmailBtn.textContent = 'COPIED';
      showToast('Email copied to clipboard!');
      setTimeout(() => {
        copyEmailBtn.textContent = 'COPY';
      }, 2000);
    } catch {
      showToast('Email: ' + email);
    }
  });
});
