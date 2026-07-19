/* ===================================================================
   עמותת המקום — marketing-tools.js
   Consent-gated analytics bundle: Meta Pixel + GA4 + Microsoft Clarity.
   Empty ID string = that tool is skipped entirely.
   Consent key: cookie_consent_v2 = 'all' | 'essential'
   =================================================================== */
(function () {
  'use strict';

  var PIXEL_ID = '2132323570952002';
  var GA4_ID = '';      // e.g. 'G-XXXXXXXXXX' — filled after property creation
  var CLARITY_ID = '';  // e.g. 'abcdefghij' — filled after project creation

  var CONSENT_KEY = 'cookie_consent_v2';
  var ready = false;
  var queue = [];

  /* ---------- tracking injectors ---------- */
  function injectPixel() {
    if (!PIXEL_ID || window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function injectGA4() {
    if (!GA4_ID || window.gtag) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);
  }

  function injectClarity() {
    if (!CLARITY_ID || window.clarity) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function initializeTracking() {
    if (ready) return;
    ready = true;
    injectPixel();
    injectGA4();
    injectClarity();
    while (queue.length) { send(queue.shift()); }
  }

  function stopTracking() {
    if (window.clarity) { try { window.clarity('stop'); } catch (e) {} }
  }

  /* ---------- public event API ---------- */
  function send(item) {
    if (window.fbq) window.fbq('trackCustom', item.name, item.params);
    if (window.gtag) window.gtag('event', item.name, item.params);
  }

  window.track = function (name, params) {
    var item = { name: name, params: params || {} };
    if (ready) send(item); else queue.push(item);
  };
  window.initializeTracking = initializeTracking;

  /* ---------- consent banner ---------- */
  function buildBanner() {
    var css =
      '#mkConsent{position:fixed;z-index:9500;bottom:14px;right:14px;left:14px;max-width:560px;' +
      'margin-inline:auto;background:rgba(28,26,23,.94);border:1px solid rgba(208,179,135,.45);' +
      'border-radius:14px;padding:14px 18px;backdrop-filter:blur(10px);display:flex;direction:rtl;' +
      'align-items:center;gap:14px;flex-wrap:wrap;font-family:Heebo,system-ui,sans-serif}' +
      '#mkConsent p{font-size:.85rem;font-weight:300;color:#F3EEE3;line-height:1.5;flex:1;min-width:220px;margin:0}' +
      '#mkConsent button{font-family:inherit;font-size:.85rem;font-weight:700;border-radius:30px;' +
      'padding:12px 24px;cursor:pointer;border:none;min-height:42px}' +
      '#mkConsent .ok{background:#D0B387;color:#313139}' +
      '#mkConsent .min{background:transparent;border:1px solid rgba(208,179,135,.5);color:#F3EEE3}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var el = document.createElement('div');
    el.id = 'mkConsent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'הסכמת עוגיות');
    el.innerHTML =
      '<p>אנחנו משתמשים בעוגיות למדידת ביקורים ושיפור החוויה, כדי שנדע שהסיפור מגיע לאנשים. אפשר להמשיך גם בלי.</p>' +
      '<button class="ok" id="mkConsentAll">אישור</button>' +
      '<button class="min" id="mkConsentMin">רק חיוני</button>';
    document.body.appendChild(el);

    document.getElementById('mkConsentAll').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'all');
      el.remove();
      initializeTracking();
    });
    document.getElementById('mkConsentMin').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'essential');
      el.remove();
      stopTracking();
    });
  }

  function boot() {
    var saved = null;
    try { saved = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (saved === 'all') { initializeTracking(); }
    else if (saved !== 'essential') { buildBanner(); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
