// content.js (privacy-preserving activity monitor)
(() => {
  let monitoring = false;
  let mouseMoves = 0, keystrokes = 0;
  let lastActivity = 0;
  let pausedUntil = 0;
  let activityInterval = null;
  let overlay = null;

  function isSensitive(el) {
    if (!el) return false;
    const tag = (el.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') {
      const type = (el.type || '').toLowerCase();
      const ac = (el.getAttribute && el.getAttribute('autocomplete')) || '';
      if (type === 'password' || type === 'email' || /cc\-|card|cvv|csc|ssn/i.test(ac)) return true;
    }
    if (el.isContentEditable) return true;
    return false;
  }

  function onMouseMove() {
    if (Date.now() < pausedUntil) return;
    mouseMoves++;
    lastActivity = Date.now();
  }

  function onKeyDown(e) {
    if (Date.now() < pausedUntil) return;
    const tgt = e.target;
    if (isSensitive(tgt)) return;
    if (e.key && (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Tab')) {
      keystrokes++;
      lastActivity = Date.now();
    }
  }

  function showBreakOverlay(durationSec) {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'focusbuddy-break-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      left: 0, top: 0, right: 0, bottom: 0,
      zIndex: 2147483647,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      pointerEvents: 'auto'
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      padding: '18px 24px',
      borderRadius: '12px',
      background: '#000',
      border: '2px solid #39ff14',
      color: '#39ff14',
      textAlign: 'center',
      fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
      boxShadow: '0 0 30px #39ff14',
      minWidth: '260px'
    });

    const title = document.createElement('div');
    title.textContent = 'Take a 1-minute break';
    title.style.fontSize = '18px';
    title.style.fontWeight = '600';

    const timer = document.createElement('div');
    timer.style.fontSize = '28px';
    timer.style.marginTop = '8px';

    const note = document.createElement('div');
    note.style.fontSize = '12px';
    note.style.opacity = '0.8';
    note.style.marginTop = '8px';
    note.textContent = 'We paused tracking for the break.';

    box.appendChild(title);
    box.appendChild(timer);
    box.appendChild(note);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    let remaining = durationSec;
    timer.textContent = `${remaining}s`;
    const t = setInterval(() => {
      remaining--;
      timer.textContent = `${remaining}s`;
      if (remaining <= 0) {
        clearInterval(t);
        try { document.body.removeChild(overlay); } catch (e) {}
        overlay = null;
      }
    }, 1000);
  }

  function startMonitoring() {
    if (monitoring) return;
    monitoring = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown, true);

    if (activityInterval) clearInterval(activityInterval);
    activityInterval = setInterval(() => {
      if (Date.now() < pausedUntil) return;
      // consider active if last activity was within 20s
      if (Date.now() - lastActivity <= 20000) {
        chrome.runtime.sendMessage({
          type: 'activity_ping',
          timestamp: Date.now(),
          mouseMoves,
          keystrokes,
          hostname: location.hostname
        });
        mouseMoves = 0;
        keystrokes = 0;
      }
    }, 10000);

    lastActivity = Date.now();
    console.log('FocusBuddy: monitoring started on', location.hostname);
  }

  function stopMonitoring() {
    if (!monitoring) return;
    monitoring = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('keydown', onKeyDown, true);
    if (activityInterval) { clearInterval(activityInterval); activityInterval = null; }
    console.log('FocusBuddy: monitoring stopped on', location.hostname);
  }

  // listen to messages from background/popup
  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || !msg.type) return;
    if (msg.type === 'start_break') {
      const d = msg.duration || 60;
      pausedUntil = Date.now() + d * 1000;
      showBreakOverlay(d);
    } else if (msg.type === 'start_all') {
      startMonitoring();
    } else if (msg.type === 'stop_all') {
      stopMonitoring();
    }
  });

  // initialize according to stored setting
  chrome.storage.local.get(['trackingEnabled'], (res) => {
    if (res.trackingEnabled) startMonitoring();
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') return;
    if (changes.trackingEnabled) {
      if (changes.trackingEnabled.newValue) startMonitoring();
      else stopMonitoring();
    }
  });
})();
