(function () {
  'use strict';

  var MIN_MESSAGE_LENGTH = 10;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var COOKIE_CONSENT_KEY = 'pl_cookie_consent';
  var COOKIE_CONSENT_EXPIRY_DAYS = 365;
  // Sostituisci con il tuo Meta Pixel ID
  var META_PIXEL_ID = 'XXXXXXXXXX';

  function byId(id) { return document.getElementById(id); }
  function bySelector(s) { return document.querySelector(s); }
  function bySelectorAll(s) { return document.querySelectorAll(s); }

  /* ── Cookie consent (Google Consent Mode v2 + GA4 + Meta) ── */
  function getConsent() {
    try {
      var raw = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data && data.value && data.expiry && data.expiry > Date.now()) return data.value;
      return null;
    } catch (e) { return null; }
  }

  function setConsent(value) {
    try {
      var expiry = Date.now() + COOKIE_CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ value: value, expiry: expiry }));
    } catch (e) {}
  }

  function applyConsentGranted() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
        security_storage: 'granted'
      });
    }
    if (typeof fbq === 'undefined' && META_PIXEL_ID && META_PIXEL_ID !== 'XXXXXXXXXX') {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',META_PIXEL_ID);fbq('track','PageView');
    }
  }

  function showBanner() {
    var banner = byId('cookie-banner');
    if (banner) banner.hidden = false;
  }

  function hideBanner() {
    var banner = byId('cookie-banner');
    if (banner) banner.hidden = true;
  }

  function initCookieConsent() {
    var consent = getConsent();
    var banner = byId('cookie-banner');
    var acceptBtn = byId('cookie-accept');
    var rejectBtn = byId('cookie-reject');
    var settingsBtn = byId('cookie-settings-btn');

    if (consent === 'granted') {
      applyConsentGranted();
      hideBanner();
    } else if (consent === 'denied') {
      hideBanner();
    } else if (banner) {
      showBanner();
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setConsent('granted');
        applyConsentGranted();
        hideBanner();
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        setConsent('denied');
        hideBanner();
      });
    }
    if (settingsBtn) {
      settingsBtn.addEventListener('click', function () { showBanner(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
  } else {
    initCookieConsent();
  }

  /* ── Nav: mobile toggle ── */
  var navToggle = byId('nav-toggle');
  var navLinks = byId('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      navToggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    });
  }

  /* ── Smooth scroll for anchor links ── */
  bySelectorAll('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    a.addEventListener('click', function (e) {
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navLinks.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        return;
      }
      var target = byId(href.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Highlight active section in navbar ── */
  var sections = [
    { id: 'sfide', link: bySelector('.nav-link[href="#sfide"]') },
    { id: 'servizi', link: bySelector('.nav-link[href="#servizi"]') },
    { id: 'contatti', link: bySelector('.nav-link[href="#contatti"]') }
  ].filter(function (s) { return s.link; });

  function setActiveSection() {
    var scrollY = window.scrollY;
    var viewportMid = scrollY + window.innerHeight / 2;
    var active = null;
    sections.forEach(function (s) {
      var el = byId(s.id);
      if (!el) return;
      var top = el.offsetTop;
      var bottom = top + el.offsetHeight;
      if (viewportMid >= top && viewportMid <= bottom) active = s;
    });
    sections.forEach(function (s) {
      s.link.classList.toggle('active', s === active);
    });
  }

  window.addEventListener('scroll', setActiveSection, { passive: true });
  setActiveSection();

  /* ── Footer year ── */
  var yearEl = byId('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Form validation and fake submit ── */
  var form = byId('contact-form');
  var formWrapper = byId('form-wrapper');
  var formSuccess = byId('form-success');

  function showError(inputId, message) {
    var input = byId(inputId);
    var errorEl = byId(inputId + '-error');
    if (input) {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearErrors() {
    bySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(function (el) {
      el.classList.remove('invalid');
      el.removeAttribute('aria-invalid');
    });
    bySelectorAll('.form-error').forEach(function (el) { el.textContent = ''; });
  }

  function validate() {
    clearErrors();
    var name = (byId('name') && byId('name').value.trim()) || '';
    var email = (byId('email') && byId('email').value.trim()) || '';
    var area = (byId('area') && byId('area').value) || '';
    var message = (byId('message') && byId('message').value.trim()) || '';
    var valid = true;

    if (!name) {
      showError('name', 'Inserisci il nome.');
      valid = false;
    }
    if (!email) {
      showError('email', 'Inserisci l’email.');
      valid = false;
    } else if (!EMAIL_RE.test(email)) {
      showError('email', 'Inserisci un’email valida.');
      valid = false;
    }
    if (!area) {
      showError('area', 'Seleziona l’area di competenza della richiesta.');
      valid = false;
    }
    if (message.length < MIN_MESSAGE_LENGTH) {
      showError('message', 'La richiesta deve avere almeno ' + MIN_MESSAGE_LENGTH + ' caratteri.');
      valid = false;
    }
    return valid;
  }

  if (form && formWrapper && formSuccess) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      formWrapper.hidden = true;
      formSuccess.hidden = false;
      formSuccess.setAttribute('aria-live', 'polite');
    });
  }
})();
