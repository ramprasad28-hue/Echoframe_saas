/* ==========================================================================
   EchoFrame — premium enhancement script
   Additive layer on top of main.js: page loader, cursor glow, button
   ripple, animated counters, grouped scroll-reveal, dashboard widget
   entrance animation. Every feature checks for its target elements
   before wiring up and respects prefers-reduced-motion.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Page loader — hides once the page has painted
     --------------------------------------------------------------------- */
  function initLoader() {
    var loader = document.querySelector('[data-page-loader]');
    if (!loader) return;
    function hide() {
      loader.classList.add('is-hidden');
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 550);
    }
    if (document.readyState === 'complete') {
      setTimeout(hide, 150);
    } else {
      window.addEventListener('load', function () { setTimeout(hide, 150); });
      // Safety net so the loader never blocks the page indefinitely.
      setTimeout(hide, 1800);
    }
  }

  /* ---------------------------------------------------------------------
     Cursor glow — follows the pointer on hover-capable devices
     --------------------------------------------------------------------- */
  function initCursorGlow() {
    var glow = document.querySelector('[data-cursor-glow]');
    if (!glow) return;
    if (!window.matchMedia('(pointer: fine)').matches || reduced) return;

    var raf = null;
    var x = 0, y = 0;

    function apply() {
      glow.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      raf = null;
    }

    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      glow.classList.add('is-active');
      if (!raf) raf = requestAnimationFrame(apply);
    });
    document.addEventListener('mouseleave', function () {
      glow.classList.remove('is-active');
    });
  }

  /* ---------------------------------------------------------------------
     Button ripple — lightweight click feedback on all .btn elements
     --------------------------------------------------------------------- */
  function initRipple() {
    if (reduced) return;
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.btn') : null;
      if (!btn) return;
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 1.6;
      var ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  }

  /* ---------------------------------------------------------------------
     Grouped scroll reveal — .reveal-stagger containers fade their
     direct children in with a stagger, mirroring main.js's .reveal
     --------------------------------------------------------------------- */
  function initStaggerReveal() {
    var groups = document.querySelectorAll('.reveal-stagger');
    if (!groups.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      groups.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    groups.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Animated stat counters — elements with [data-count-to]
     --------------------------------------------------------------------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-count-to]');
    if (!els.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-count-suffix') || '';
      if (reduced || isNaN(target)) {
        el.textContent = target + suffix;
        return;
      }
      var duration = 900;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(animate);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Dashboard widgets — trigger the pipeline / sparkline fill-in once
     the widget scrolls into view (or immediately if already visible)
     --------------------------------------------------------------------- */
  function initWidgetAnimation() {
    var widgets = document.querySelectorAll('.widget[data-animate-in]');
    if (!widgets.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      widgets.forEach(function (el) { el.classList.add('is-animated'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    widgets.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initCursorGlow();
    initRipple();
    initStaggerReveal();
    initCounters();
    initWidgetAnimation();
  });
})();
