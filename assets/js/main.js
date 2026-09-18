/* ═══════════════════════════════════════════════════════════════════
   Kawsher HRidoy — portfolio behaviour
   Variant: claude/portfolio
   No dependencies. Everything degrades gracefully without JS.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Theme ────────────────────────────────────────────────────── */
  function initTheme() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    function label() {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }

    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (err) { /* storage blocked */ }
      label();
      // The canvas samples theme colours on each frame, so just nudge it.
      if (window.__signalRepaint) window.__signalRepaint();
    });

    label();
  }

  /* ── Header state + mobile menu ───────────────────────────────── */
  function initHeader() {
    var header = document.getElementById('site-header');
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('nav');

    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-stuck', window.scrollY > 8);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });

    // Reset when the layout returns to desktop.
    window.matchMedia('(min-width: 821px)').addEventListener('change', function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* ── Scroll reveal ────────────────────────────────────────────── */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ── Counting stats ───────────────────────────────────────────── */
  function initCounters() {
    var counters = document.querySelectorAll('.count');
    if (!counters.length) return;

    function settle(el) {
      el.textContent = el.dataset.count;
    }

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      counters.forEach(settle);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);

        var target = parseInt(el.dataset.count, 10);
        if (!isFinite(target)) { settle(el); return; }

        var duration = 900;
        var start = null;

        function step(now) {
          if (start === null) start = now;
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(step);
          else settle(el);
        }

        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      el.textContent = '0';
      observer.observe(el);
    });
  }

  /* ── Active nav link ──────────────────────────────────────────── */
  function initActiveSection() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
    if (!links.length) return;

    var sections = links
      .map(function (link) {
        var id = link.getAttribute('href').slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var offset = (parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 68) * 16;
      var line = window.scrollY + offset + 24;
      var current = null;

      sections.forEach(function (section) {
        if (section.offsetTop <= line) current = section.id;
      });

      // Past the last section: keep the last one lit.
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ── Hero telemetry signal ────────────────────────────────────── */
  /* A slow oscilloscope trace: layered sine baseline with a periodic
     event spike sweeping across it — a nod to the failure-countdown
     work in Autopilot. ~30fps, pauses off-screen and when hidden.   */
  function initSignal() {
    var canvas = document.getElementById('signal');
    if (!canvas || reduceMotion.matches) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var POINTS = 150;
    var width = 0;
    var height = 0;
    var colors = { line: '#4f8cff', fill: 'rgba(79,140,255,0.10)' };
    var time = 0;
    var lastDraw = 0;
    var frame = null;
    var visible = true;
    var onScreen = true;

    function readColors() {
      var styles = getComputedStyle(canvas);
      var accent = styles.getPropertyValue('--accent').trim() || '#4f8cff';
      colors.line = accent;
      colors.fill = styles.getPropertyValue('--accent-soft').trim() || 'rgba(79,140,255,0.10)';
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function sample(i, t) {
      var x = i / (POINTS - 1);
      var value =
        Math.sin(x * 6.4 + t * 0.85) * 0.46 +
        Math.sin(x * 14.1 - t * 0.55) * 0.20 +
        Math.sin(x * 27.3 + t * 1.35) * 0.075;

      // Event spike sweeping left to right, like a countdown reaching zero.
      var phase = (t * 0.19) % 1;
      var spike = phase * 1.18 - 0.09;
      var distance = Math.abs(x - spike);
      if (distance < 0.055) {
        var strength = 1 - distance / 0.055;
        value += strength * strength * 1.35;
      }
      return value;
    }

    function draw(now) {
      frame = requestAnimationFrame(draw);
      if (!visible || !onScreen) return;
      if (now - lastDraw < 33) return; // ~30fps is plenty for this
      lastDraw = now;
      time += 0.033;

      readColors();
      ctx.clearRect(0, 0, width, height);

      var mid = height * 0.66;
      var amplitude = height * 0.3;
      var points = [];

      for (var i = 0; i < POINTS; i++) {
        points.push([(i / (POINTS - 1)) * width, mid - sample(i, time) * amplitude]);
      }

      // Filled area under the trace.
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (var j = 0; j < points.length; j++) ctx.lineTo(points[j][0], points[j][1]);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = colors.fill;
      ctx.fill();

      // The trace itself.
      ctx.beginPath();
      for (var k = 0; k < points.length; k++) {
        if (k === 0) ctx.moveTo(points[k][0], points[k][1]);
        else ctx.lineTo(points[k][0], points[k][1]);
      }
      ctx.strokeStyle = colors.line;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.4;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Leading marker on the spike.
      var leadIndex = Math.round((((time * 0.19) % 1) * 1.18 - 0.09) * (POINTS - 1));
      if (leadIndex >= 0 && leadIndex < points.length) {
        ctx.beginPath();
        ctx.arc(points[leadIndex][0], points[leadIndex][1], 2.6, 0, Math.PI * 2);
        ctx.fillStyle = colors.line;
        ctx.fill();
      }
    }

    function start() {
      if (frame === null) frame = requestAnimationFrame(draw);
    }
    function stop() {
      if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
    }

    resize();
    readColors();
    start();

    window.addEventListener('resize', function () {
      resize();
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
      }, { threshold: 0 }).observe(canvas);
    }

    window.__signalRepaint = function () {
      readColors();
    };

    reduceMotion.addEventListener('change', function (event) {
      if (event.matches) { stop(); canvas.style.display = 'none'; }
    });
  }

  /* ── Copy email ───────────────────────────────────────────────── */
  function initCopy() {
    var button = document.getElementById('copy-email');
    if (!button) return;

    var label = button.querySelector('.copy__label');
    var timer = null;

    function flash(text) {
      if (!label) return;
      label.textContent = text;
      button.classList.add('is-done');
      clearTimeout(timer);
      timer = setTimeout(function () {
        label.textContent = 'Copy';
        button.classList.remove('is-done');
      }, 1600);
    }

    function legacyCopy(value) {
      var field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:absolute;left:-9999px;top:0;';
      document.body.appendChild(field);
      field.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(field);
      return ok;
    }

    button.addEventListener('click', function () {
      var value = button.dataset.email;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(
          function () { flash('Copied'); },
          function () { flash(legacyCopy(value) ? 'Copied' : 'Failed'); }
        );
      } else {
        flash(legacyCopy(value) ? 'Copied' : 'Failed');
      }
    });
  }

  /* ── Footer year ──────────────────────────────────────────────── */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ── Boot ─────────────────────────────────────────────────────── */
  function boot() {
    initTheme();
    initHeader();
    initReveal();
    initCounters();
    initActiveSection();
    initSignal();
    initCopy();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
