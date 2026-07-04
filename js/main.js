/* ==========================================================================
   EchoFrame — shared vanilla JS
   No framework, no build step. Each function checks for its target
   elements before wiring up, so this single file is safe to include
   on every page regardless of which components are present.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Theme (light/dark) — persisted in localStorage, respects the
     product's dark-mode-by-default rule only inside the app shell.
     --------------------------------------------------------------------- */
  function initTheme() {
    var root = document.documentElement;
    var stored = localStorage.getItem('echoframe-theme');
    var defaultTheme = root.getAttribute('data-default-theme') || 'light';
    var theme = stored || defaultTheme;
    root.setAttribute('data-theme', theme);

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = root.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('echoframe-theme', next);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Mobile nav overlay
     --------------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a, [data-nav-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------------------------------------------------------------------
     Reveal-on-scroll — IntersectionObserver, respects reduced motion
     --------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Pricing — monthly / annual toggle
     --------------------------------------------------------------------- */
  function initPricingToggle() {
    var toggle = document.querySelector('[data-billing-toggle]');
    if (!toggle) return;
    var priceEls = document.querySelectorAll('[data-monthly][data-annual]');

    toggle.addEventListener('change', function () {
      var annual = toggle.checked;
      priceEls.forEach(function (el) {
        el.textContent = annual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
      });
      document.querySelectorAll('[data-period-label]').forEach(function (el) {
        el.textContent = annual ? '/mo, billed annually' : '/month';
      });
    });
  }

  /* ---------------------------------------------------------------------
     Integrations — category filter
     --------------------------------------------------------------------- */
  function initIntegrationFilter() {
    var buttons = document.querySelectorAll('[data-filter]');
    var cards = document.querySelectorAll('[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('btn-primary'); b.classList.add('btn-secondary'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
        btn.setAttribute('aria-pressed', 'true');

        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Generic form handling — client-side validation + inline confirmation,
     following the brand's "specific, no filler" voice for messages.
     --------------------------------------------------------------------- */
  function initForms() {
    document.querySelectorAll('[data-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;

        form.querySelectorAll('[required]').forEach(function (field) {
          var wrapper = field.closest('.field');
          var errorMsg = wrapper ? wrapper.querySelector('.field-error-msg') : null;
          var isEmpty = !field.value.trim();
          var isBadEmail = field.type === 'email' && field.value && !/^\S+@\S+\.\S+$/.test(field.value);

          if (wrapper) wrapper.classList.toggle('field-error', isEmpty || isBadEmail);
          if (errorMsg) {
            errorMsg.textContent = isEmpty
              ? 'This field is required.'
              : (isBadEmail ? 'Enter a valid email address.' : '');
          }
          if (isEmpty || isBadEmail) valid = false;
        });

        if (!valid) return;

        var confirm = form.getAttribute('data-confirm') || 'Thanks — we got it.';
        var wrap = document.createElement('div');
        wrap.className = 'form-confirm';
        wrap.innerHTML = '<strong>' + confirm + '</strong>';
        form.replaceWith(wrap);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Dashboard demo — sidebar collapse + toast trigger
     --------------------------------------------------------------------- */
  function initDashboardDemo() {
    var collapseBtn = document.querySelector('[data-sidebar-collapse]');
    var sidebar = document.querySelector('[data-sidebar]');
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', function () {
        sidebar.classList.toggle('is-collapsed');
      });
    }

    var toast = document.querySelector('[data-toast]');
    document.querySelectorAll('[data-toast-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!toast) return;
        toast.classList.add('is-visible');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function () { toast.classList.remove('is-visible'); }, 3200);
      });
    });

    document.querySelectorAll('[data-panel-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var panel = document.querySelector(trigger.getAttribute('data-panel-open'));
        if (panel) panel.classList.add('is-open');
      });
    });
    document.querySelectorAll('[data-panel-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.closest('.detail-panel').classList.remove('is-open');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initMobileNav();
    initReveal();
    initPricingToggle();
    initIntegrationFilter();
    initForms();
    initDashboardDemo();
  });
})();
