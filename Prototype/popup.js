// popup.js
const PRODUCTIVE_DOMAINS = ['leetcode.com','github.com','stackoverflow.com','linkedin.com','medium.com'];
const DISTRACTING_DOMAINS = ['instagram.com','facebook.com','youtube.com','tiktok.com','reddit.com','twitter.com'];

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
}

function updateUI() {
  chrome.storage.local.get(['activeSeconds','perHost','trackingEnabled'], data => {
    const secs = data.activeSeconds || 0;
    document.getElementById('time').textContent = formatTime(secs);

    const perHost = data.perHost || {};
    const listEl = document.getElementById('sites');
    listEl.innerHTML = '';

    const items = Object.entries(perHost).sort((a,b)=>b[1]-a[1]).slice(0,6);
    let total=0, productive=0;
    for (const [host, s] of items) {
      total += s;
      if (PRODUCTIVE_DOMAINS.some(d => host.includes(d))) productive += s;
      const row = document.createElement('div');
      row.className = 'siteRow';
      row.innerHTML = `<span>${host}</span><span>${Math.round(s/60)}m</span>`;
      listEl.appendChild(row);
    }

    const percentEl = document.getElementById('percent');
    const ring = document.getElementById('ring');
    if (total === 0) {
      percentEl.textContent = '—';
      ring.style.background = 'conic-gradient(#222 0deg, #222 360deg)';
    } else {
      const pct = Math.round((productive / total) * 100);
      percentEl.textContent = pct + '%';
      const deg = Math.round((pct / 100) * 360);
      ring.style.background = `conic-gradient(#39ff14 ${deg}deg, rgba(255,255,255,0.06) ${deg}deg)`;
    }

    document.getElementById('toggle').checked = !!data.trackingEnabled;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  setInterval(updateUI, 1500);

  // toggle behavior
  document.getElementById('toggle').addEventListener('change', (e) => {
    const enabled = e.target.checked;
    chrome.storage.local.set({ trackingEnabled: enabled }, () => {
      // notify all tabs to start/stop monitoring
      chrome.tabs.query({}, tabs => {
        for (const t of tabs) {
          if (t.id) chrome.tabs.sendMessage(t.id, { type: enabled ? 'start_all' : 'stop_all' });
        }
      });
      // small desktop notify
      chrome.runtime.sendMessage({ type: 'ui_notify', text: enabled ? 'Tracking enabled' : 'Tracking disabled' });
    });
  });

  // reset data
  document.getElementById('reset').addEventListener('click', () => {
    chrome.storage.local.set({ activeSeconds: 0, perHost: {}, perTabLast: {}, actionCount: 0 }, () => {
      updateUI();
      chrome.runtime.sendMessage({ type: 'ui_notify', text: 'Data reset' });
    });
  });

  // show current tab domain + quick productivity label
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        document.getElementById('current').textContent = url.hostname;
        const host = url.hostname;
        const status = PRODUCTIVE_DOMAINS.some(d => host.includes(d)) ? 'Productive' :
          (DISTRACTING_DOMAINS.some(d => host.includes(d)) ? 'Distracting' : 'Neutral');
        document.getElementById('status').textContent = status;
      } catch (e) {}
    }
  });
});
