// content_script.js (privacy-first)
(function () {
  // helper to check if target is sensitive
  function isSensitive(el) {
    if (!el) return false;
    const tag = el.tagName && el.tagName.toLowerCase();
    if (tag === 'input') {
      const t = el.type && el.type.toLowerCase();
      if (t === 'password' || t === 'email' || t === 'tel') return true;
      const ac = el.getAttribute('autocomplete') || '';
      // common sensitive autocomplete attributes
      if (/cc\-number|cc-name|cc-exp|cc-csc|email|password/i.test(ac)) return true;
    }
    if (el.isContentEditable) return true; // treat contenteditable as potentially sensitive
    return false;
  }

  // activity counters
  let mouseMoves = 0;
  let keystrokes = 0;
  let lastMouse = { x: null, y: null };

  // mouse move tracker (lightweight)
  document.addEventListener('mousemove', e => {
    // coarse filter to reduce noise
    if (lastMouse.x === null || Math.abs(e.clientX - lastMouse.x) > 2 || Math.abs(e.clientY - lastMouse.y) > 2) {
      mouseMoves++;
      lastMouse = { x: e.clientX, y: e.clientY };
    }
  }, { passive: true });

  // keydown tracker (counts events but never stores actual keys)
  document.addEventListener('keydown', e => {
    const tgt = e.target;
    if (isSensitive(tgt)) return;   // do not record inside sensitive inputs
    // ignore modifier keys
    if (e.key && (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace')) {
      keystrokes++;
    }
  }, true);

  // send a batched summary every 5 seconds
  setInterval(() => {
    if (mouseMoves === 0 && keystrokes === 0) return;
    chrome.runtime.sendMessage({ type: 'activity', payload: { mouseMoves, keystrokes } });
    mouseMoves = 0; keystrokes = 0;
  }, 5000);

  // optional: inject small overlay to provide opt-in UI or live feedback
  function injectOverlay() {
    if (document.getElementById('activity-overlay')) return;
    const div = document.createElement('div');
    div.id = 'activity-overlay';
    div.style = 'position:fixed;right:12px;bottom:12px;padding:8px 12px;border-radius:8px;background:rgba(0,0,0,0.6);color:#fff;z-index:2147483647;font-family:sans-serif;font-size:12px;';
    div.textContent = 'Activity Monitor: active';
    document.body.appendChild(div);
  }
  injectOverlay();

})();
