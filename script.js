// Mobile menu controller (matches your current HTML/CSS)
// Requires: .nav-toggle button in header, #mobileMenu overlay block at end of <body>

(() => {
  const toggle   = document.querySelector('.nav-toggle');         // hamburger
  const menu     = document.getElementById('mobileMenu');         // overlay root
  if (!toggle || !menu) return;

  const sheet    = menu.querySelector('.mobile-menu_sheet');      // white panel
  const closeBtn = menu.querySelector('.nav-close');              // X button

  let lastFocused = null;
  let isOpen = false;

  function openMenu() {
    if (isOpen) return;
    isOpen = true;

    lastFocused = document.activeElement;
    menu.hidden = false;
    // Force reflow so the transition runs from the hidden starting state
    void menu.offsetHeight;
    menu.classList.add('is-open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');

    (closeBtn || sheet || menu).focus?.({ preventScroll: true });

    document.addEventListener('keydown', trapTab, true);
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');

    // Wait for the transition to finish before hiding fully
    setTimeout(() => {
      if (!isOpen) menu.hidden = true;
    }, 300);

    (lastFocused || toggle).focus?.({ preventScroll: true });
    document.removeEventListener('keydown', trapTab, true);
  }

  // Trap Tab key inside the menu while open (ESC does NOT close by spec)
  function trapTab(e) {
    if (e.key !== 'Tab' || menu.hidden) return;
    const focusables = menu.querySelectorAll(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    const list = Array.from(focusables).filter(el => el.offsetParent !== null);
    if (!list.length) return;

    const first = list[0];
    const last  = list[list.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  // Open on hamburger
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isOpen) openMenu();     // only the X closes it
  });

  // Close on X button (only)
  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeMenu();
  });

  // Safety: if user resizes to desktop while open, close the menu
  const mq = window.matchMedia('(min-width: 769px)');
  mq.addEventListener?.('change', e => { if (e.matches) closeMenu(); });
})();
// Page-load entrance trigger
// Adds .is-ready to <body> once the page is parsed.
// CSS picks up the class and fades the hero up.
(() => {
  const ready = () => document.body.classList.add('is-ready');

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    requestAnimationFrame(ready);
  } else {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(ready));
  }
})();
