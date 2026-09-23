/* ===================================================================
   עמותת המקום — donate-link.js
   Replaces the old Bit/PayBox copy-the-number modal (donate-modal.js).
   Every [data-donate] element now leads to the Peach campaign page.

   The real href lives in the HTML so the buttons work with JS disabled
   and the campaign link is shareable and crawlable. This file only
   (a) fires the DonateClick pixel event and
   (b) covers the one CTA that is a <button> and cannot carry an href.
   =================================================================== */
(function () {
  'use strict';

  var DONATE_URL = 'https://pe4ch.com/ref/aJ6nVhlw2che?lang=he';
  window.HM_DONATE_URL = DONATE_URL;

  function openDonate() {
    if (window.track) window.track('DonateClick');
    window.open(DONATE_URL, '_blank', 'noopener');
  }
  window.openDonate = openDonate;

  function harden() {
    var els = document.querySelectorAll('a[data-donate]');
    for (var i = 0; i < els.length; i++) {
      var a = els[i];
      // never leave a donate link pointing at "#" if a page was missed
      if (!a.getAttribute('href') || a.getAttribute('href') === '#') {
        a.setAttribute('href', DONATE_URL);
      }
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    }
  }

  function wire() {
    harden();
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-donate]') : null;
      if (!t) return;
      if (t.tagName === 'A') {
        if (window.track) window.track('DonateClick');   // let the browser follow the href
        return;
      }
      e.preventDefault();
      openDonate();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
