# Tab Out

**Keep tabs on your tabs.**

Tab Out is a local-first Chrome extension that opens a clean dashboard of everything you have open, grouped by domain. Click the extension icon whenever you want to tidy up, jump across windows, close duplicates, or save tabs for later.

By default, Tab Out is **click to open**. If you want it to appear every time you open a new tab, turn on **Open Tab Out in new tab** from the dashboard.

No server. No account. No external API calls.

---

## Features

- **Click the toolbar icon to open Tab Out** without replacing your normal new tab page
- **Optional new-tab mode** from the dashboard settings toggle
- **See all your open tabs at a glance** on a clean grid, grouped by domain
- **Homepages group** pulls Gmail inbox, X home, YouTube, LinkedIn, GitHub homepages into one card
- **Close tabs with style** with swoosh sound + confetti burst
- **Duplicate detection** flags repeated pages, with one-click cleanup
- **Click any tab title to jump to it** across Chrome windows
- **Save for later** bookmark tabs to a checklist before closing them
- **Localhost grouping** shows port numbers next to local development tabs
- **Expandable groups** show the first 8 tabs with a clickable "+N more"
- **100% local** saved tabs and settings stay in `chrome.storage.local`

---

## Install

1. Clone this repo:

```bash
git clone https://github.com/zarazhangrui/tab-out.git
cd tab-out
```

2. Open Chrome extensions:

```text
chrome://extensions
```

3. Turn on **Developer mode** in the top-right corner.

4. Click **Load unpacked**.

5. Select the `extension/` folder inside this repo.

6. Pin Tab Out to your Chrome toolbar, then click the icon to open the dashboard.

---

## Optional: Open Tab Out In Every New Tab

Tab Out no longer takes over new tabs by default. To enable that behavior:

1. Click the Tab Out toolbar icon.
2. In the dashboard header, turn on **Open Tab Out in new tab**.
3. Open a new tab.

Turn the same switch off whenever you want Chrome's normal new tab behavior back.

---

## How It Works

```text
Click the Tab Out icon
  -> Tab Out opens a dashboard of your current tabs
  -> Tabs are grouped by domain
  -> Homepages are grouped separately
  -> Duplicate tabs are flagged
  -> Click a tab title to jump to it
  -> Save tabs for later or close them with one click
```

When new-tab mode is enabled, the extension watches for Chrome's blank new tab page and redirects that tab to Tab Out. The setting is stored locally and can be changed from the dashboard at any time.

---

## Privacy

Tab Out runs entirely inside Chrome.

- No server
- No account
- No analytics
- No external API calls
- Saved tabs are stored in `chrome.storage.local`
- Settings are stored in `chrome.storage.local`

Favicons are requested from Google's favicon service so tab rows can show familiar site icons.

---

## Update

```bash
cd tab-out
git pull
```

Then go to `chrome://extensions` and click **Reload** on Tab Out.

---

## Tech Stack

| What | How |
| --- | --- |
| Extension | Chrome Manifest V3 |
| Dashboard | Plain HTML, CSS, JavaScript |
| Storage | `chrome.storage.local` |
| Sound | Web Audio API |
| Animations | CSS transitions + JavaScript confetti |

---

## License

MIT

Built by [Zara](https://x.com/zarazhangrui)
