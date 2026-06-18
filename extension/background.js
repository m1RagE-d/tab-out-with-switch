/**
 * background.js — Service Worker for Badge Updates
 *
 * Chrome's "always-on" background script for Tab Out.
 * It keeps the toolbar badge showing the current open tab count, opens the
 * dashboard from the toolbar icon, and optionally opens Tab Out in new tabs.
 *
 * Since we no longer have a server, we query chrome.tabs directly.
 * The badge counts real web tabs (skipping chrome:// and extension pages).
 *
 * Color coding gives a quick at-a-glance health signal:
 *   Green  (#3d7a4a) → 1–10 tabs  (focused, manageable)
 *   Amber  (#b8892e) → 11–20 tabs (getting busy)
 *   Red    (#b35a5a) → 21+ tabs   (time to cull!)
 */

const SETTINGS_KEY = 'tabOutSettings';
const DEFAULT_SETTINGS = {
  openDashboardInNewTabs: false,
};

async function getSettings() {
  const stored = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(stored[SETTINGS_KEY] || {}) };
}

async function ensureDefaultSettings() {
  const stored = await chrome.storage.local.get(SETTINGS_KEY);
  if (!stored[SETTINGS_KEY]) {
    await chrome.storage.local.set({ [SETTINGS_KEY]: DEFAULT_SETTINGS });
  }
}

function isBrowserNewTab(tab) {
  const url = tab.pendingUrl || tab.url || '';
  return (
    url === 'chrome://newtab/' ||
    url === 'edge://newtab/' ||
    url === 'brave://newtab/'
  );
}

async function redirectNewTabIfEnabled(tab) {
  const settings = await getSettings();
  if (!settings.openDashboardInNewTabs || !tab || !tab.id || !isBrowserNewTab(tab)) return;
  await chrome.tabs.update(tab.id, { url: chrome.runtime.getURL('index.html') });
}

// ─── Badge updater ────────────────────────────────────────────────────────────

/**
 * updateBadge()
 *
 * Counts open real-web tabs and updates the extension's toolbar badge.
 * "Real" tabs = not chrome://, not extension pages, not about:blank.
 */
async function updateBadge() {
  try {
    const tabs = await chrome.tabs.query({});

    // Only count actual web pages — skip browser internals and extension pages
    const count = tabs.filter(t => {
      const url = t.url || '';
      return (
        !url.startsWith('chrome://') &&
        !url.startsWith('chrome-extension://') &&
        !url.startsWith('about:') &&
        !url.startsWith('edge://') &&
        !url.startsWith('brave://')
      );
    }).length;

    // Don't show "0" — an empty badge is cleaner
    await chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });

    if (count === 0) return;

    // Pick badge color based on workload level
    let color;
    if (count <= 10) {
      color = '#3d7a4a'; // Green — you're in control
    } else if (count <= 20) {
      color = '#b8892e'; // Amber — things are piling up
    } else {
      color = '#b35a5a'; // Red — time to focus and close some tabs
    }

    await chrome.action.setBadgeBackgroundColor({ color });

  } catch {
    // If something goes wrong, clear the badge rather than show stale data
    chrome.action.setBadgeText({ text: '' });
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

// Open Tab Out when the toolbar icon is clicked. If a Tab Out page is already
// open, focus it instead of creating another dashboard tab.
chrome.action.onClicked.addListener(async () => {
  const dashboardUrl = chrome.runtime.getURL('index.html');
  const dashboardTabs = await chrome.tabs.query({ url: dashboardUrl });

  if (dashboardTabs.length > 0) {
    const [dashboardTab] = dashboardTabs;
    await chrome.tabs.update(dashboardTab.id, { active: true });
    await chrome.windows.update(dashboardTab.windowId, { focused: true });
    return;
  }

  await chrome.tabs.create({ url: dashboardUrl });
});

// Update badge when the extension is first installed
chrome.runtime.onInstalled.addListener(async () => {
  await ensureDefaultSettings();
  await updateBadge();
});

// Update badge when Chrome starts up
chrome.runtime.onStartup.addListener(() => {
  updateBadge();
});

// Update badge whenever a tab is opened
chrome.tabs.onCreated.addListener(async (tab) => {
  await redirectNewTabIfEnabled(tab);
  await updateBadge();
});

// Update badge whenever a tab is closed
chrome.tabs.onRemoved.addListener(() => {
  updateBadge();
});

// Update badge when a tab's URL changes (e.g. navigating to/from chrome://)
chrome.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
  await redirectNewTabIfEnabled(tab);
  await updateBadge();
});

// ─── Initial run ─────────────────────────────────────────────────────────────

// Run once immediately when the service worker first loads
updateBadge();
