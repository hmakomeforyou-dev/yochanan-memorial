/* ===================================================================
   עמותת המקום — donate-modal.js
   Self-injecting Bit/PayBox donation modal.
   Any element with [data-donate] opens it (fires DonateClick).
   window.openDonate() is also exposed.
   =================================================================== */
(function () {
  'use strict';

  var DONATE_DISPLAY = '050 6685023';
  var DONATE_RAW = '0506685023';

  function buildModal() {
    var css =
      '#hmDonate{position:fixed;inset:0;z-index:9600;display:none;align-items:center;justify-content:center;' +
      'padding:20px;background:rgba(15,12,10,.72);backdrop-filter:blur(6px);direction:rtl;' +
      'font-family:Heebo,system-ui,sans-serif}' +
      '#hmDonate.show{display:flex}' +
      '#hmDonate .box{width:min(400px,94vw);background:#221f1b;border:1px solid rgba(208,179,135,.45);' +
      'border-radius:20px;padding:30px 26px 26px;text-align:center;position:relative;' +
      'box-shadow:0 20px 60px rgba(0,0,0,.5)}' +
      '#hmDonate .hm-close{position:absolute;top:12px;left:14px;background:none;border:none;color:#DCD1BC;' +
      'font-size:1.3rem;cursor:pointer;line-height:1;padding:4px}' +
      '#hmDonate h3{font-size:1.35rem;font-weight:900;color:#FBE3A8;margin:0 0 6px}' +
      '#hmDonate .lead{font-size:.92rem;font-weight:300;color:#F3EEE3;line-height:1.6;margin:0 0 20px}' +
      '#hmDonate .num{direction:ltr;font-size:1.9rem;font-weight:900;color:#fff;letter-spacing:.04em;' +
      'background:rgba(243,238,227,.06);border:1px solid rgba(208,179,135,.35);border-radius:14px;' +
      'padding:16px;margin-bottom:12px;user-select:all}' +
      '#hmDonate .copy{width:100%;font-family:inherit;font-size:1rem;font-weight:700;border:none;' +
      'border-radius:12px;background:#D0B387;color:#313139;padding:14px;cursor:pointer;transition:background .2s}' +
      '#hmDonate .copy.ok{background:#4a7a3d;color:#fff}' +
      '#hmDonate .apps{font-size:.82rem;color:#B9926A;margin-top:14px;line-height:1.6}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var modal = document.createElement('div');
    modal.id = 'hmDonate';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'תרומה');
    modal.innerHTML =
      '<div class="box">' +
      '<button class="hm-close" aria-label="סגירה">✕</button>' +
      '<h3>תרומה למען המקום</h3>' +
      '<p class="lead">שלחו כל סכום בביט או ב PayBox למספר:</p>' +
      '<div class="num">' + DONATE_DISPLAY + '</div>' +
      '<button class="copy">העתקת המספר</button>' +
      '<p class="apps">כל שקל בונה את המקום 💛<br>לזכר יוחנן אליהו פרדג׳ ז״ל</p>' +
      '</div>';
    document.body.appendChild(modal);

    function close() { modal.classList.remove('show'); }
    modal.querySelector('.hm-close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    modal.querySelector('.copy').addEventListener('click', function () {
      var btn = this;
      var done = function () {
        btn.textContent = '✓ הועתק'; btn.classList.add('ok');
        setTimeout(function () { btn.textContent = 'העתקת המספר'; btn.classList.remove('ok'); }, 1800);
        if (window.track) window.track('DonateNumberCopied');
      };
      try {
        var ta = document.createElement('textarea'); ta.value = DONATE_RAW;
        ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta);
        ta.focus(); ta.select();
        var ok = document.execCommand('copy'); document.body.removeChild(ta);
        if (ok) { done(); return; }
      } catch (e) {}
      if (navigator.clipboard) navigator.clipboard.writeText(DONATE_RAW).then(done);
    });

    return modal;
  }

  var modalEl = null;
  function openDonate() {
    if (!modalEl) modalEl = buildModal();
    modalEl.classList.add('show');
    if (window.track) window.track('DonateClick');
  }
  window.openDonate = openDonate;

  function wire() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-donate]') : null;
      if (t) { e.preventDefault(); openDonate(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
