// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['activeSeconds','perHost','perTabLast','actionCount','lastBreak'], d => {
    if (d.activeSeconds === undefined) chrome.storage.local.set({ activeSeconds: 0 });
    if (d.perHost === undefined) chrome.storage.local.set({ perHost: {} });
    if (d.perTabLast === undefined) chrome.storage.local.set({ perTabLast: {} });
    if (d.actionCount === undefined) chrome.storage.local.set({ actionCount: 0 });
    if (d.lastBreak === undefined) chrome.storage.local.set({ lastBreak: 0 });
  });
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type === undefined) return;

  if (msg.type === 'activity_ping') {
    const tabId = sender && sender.tab ? sender.tab.id : (msg.tabId || '0');
    const ts = msg.timestamp || Date.now();
    const hostname = msg.hostname || 'unknown';
    const actions = (msg.mouseMoves || 0) + (msg.keystrokes || 0);

    chrome.storage.local.get(['perTabLast','activeSeconds','perHost','actionCount','lastBreak'], data => {
      const perTabLast = data.perTabLast || {};
      const last = perTabLast[tabId] || 0;

      // compute delta seconds for this tab (cap to avoid spikes)
      let delta = 0;
      if (last) {
        delta = Math.round((ts - last) / 1000);
        if (delta < 0) delta = 0;
        if (delta > 60) delta = 60;
      }
      perTabLast[tabId] = ts;

      const activeSeconds = (data.activeSeconds || 0) + delta;
      const perHost = data.perHost || {};
      perHost[hostname] = (perHost[hostname] || 0) + delta;
      const actionCount = (data.actionCount || 0) + actions;

      chrome.storage.local.set({ perTabLast, activeSeconds, perHost, actionCount }, () => {
        // Demo break logic (tweak thresholds for production)
        const now = Date.now();
        const BREAK_THRESHOLD = 80; // number of keyboard+mouse events to trigger demo break
        const MIN_BREAK_INTERVAL = 2 * 60 * 1000; // 2 minutes between auto-breaks (demo)
        const lastBreak = data.lastBreak || 0;

        if (actionCount >= BREAK_THRESHOLD && (now - lastBreak) > MIN_BREAK_INTERVAL) {
          // reset actionCount and set lastBreak
          chrome.storage.local.set({ actionCount: 0, lastBreak: now }, () => {
            // create a desktop notification
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'icons/icon48.png',
              title: 'FocusBuddy — Take a 1-minute break',
              message: "You've been active for a while. Take a 1-minute break."
            });

            // notify all tabs (content script will show an on-page overlay)
            chrome.tabs.query({}, tabs => {
              for (const t of tabs) {
                if (t.id) {
                  chrome.tabs.sendMessage(t.id, { type: 'start_break', duration: 60 });
                }
              }
            });
          });
        }
      });
    });
  } else if (msg.type === 'ui_notify') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'FocusBuddy',
      message: msg.text || ''
    });
  }
});
