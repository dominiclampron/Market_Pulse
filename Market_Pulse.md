# Market Pulse 📊

A clean, static **daily financial dashboard** you can open every morning to get a quick overview of the markets. Built entirely with vanilla HTML, CSS, and JavaScript—no frameworks, no backend, no API keys required.

---

## What It Does

Market Pulse aggregates live financial data from **free embeddable widgets** (TradingView) and **public RSS feeds** (CNBC, Yahoo Finance) into a single, beautiful dashboard. Everything loads client-side in your browser.

### Key Features

| Feature | Description |
|---------|-------------|
| 📈 **Market Overview** | Live mini-charts for major indices/ETFs (SPY, QQQ, DIA, IWM, TLT, GLD) |
| 🗺️ **Sector Heatmap** | Visual heatmap of S&P 500 stocks grouped by sector |
| 🔥 **Biggest Movers** | Top gainers and losers with mini-charts |
| 📅 **Calendars** | Earnings calendar + Economic events calendar |
| 📰 **News Feed** | Aggregated headlines from CNBC & Yahoo Finance, deduplicated |
| 📋 **Watchlist** | Personal symbol watchlist with TradingView links |
| 📝 **Notes** | Freeform notepad for market thoughts |
| 💾 **Saved Views** | Save/restore combinations of filters and settings |
| 🌙 **Dark Mode** | Full light/dark theme support |
| 📱 **Responsive** | Desktop (3-col), Tablet (2-col), Mobile (1-col + bottom tabs) |

---

## Project Structure

```
Market_Pulse_Gemi/
├── index.html      # Main HTML structure
├── styles.css      # All styling (glassmorphism, themes, responsive)
├── app.js          # Application logic (widgets, RSS, state management)
└── Market_Pulse.md # This documentation
```

---

## Architecture

### Data Sources

The dashboard uses **zero backend servers** and **no API keys**. All data comes from:

1. **TradingView Widgets** (live market data)
   - Mini Symbol Overview widgets for index charts
   - Stock Heatmap widget for sector visualization
   - Hotlists widget for top movers
   - Events widgets for earnings & economic calendars

2. **Public RSS Feeds** (news)
   - CNBC Business News
   - CNBC Economy
   - Yahoo Finance
   - Fetched via [rss2json.com](https://rss2json.com) as a CORS proxy

### State Management

All user preferences are stored in `localStorage`:

| Key | Purpose |
|-----|---------|
| `mp_theme` | Light or dark theme |
| `mp_compact` | Compact view toggle |
| `mp_tab` | Last active tab |
| `mp_watchlist` | Array of watched symbols |
| `mp_notes` | Freeform notes content |
| `mp_views` | Array of saved view configurations |

---

## How It Works

### 1. Widget Integration

TradingView widgets are embedded dynamically via JavaScript. Each widget:

```javascript
// Example: Mini chart widget initialization
function createMiniChartWidget(containerId, symbol, colorTheme) {
  const script = document.createElement('script');
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
  script.innerHTML = JSON.stringify({
    symbol: symbol,
    colorTheme: colorTheme,
    // ... other options
  });
  container.appendChild(script);
}
```

Widgets are re-initialized when the theme changes to match light/dark mode.

### 2. RSS News Aggregation

News is fetched from multiple sources, merged, and deduplicated:

```javascript
// Fetch all feeds in parallel
const results = await Promise.allSettled(
  CONFIG.rssFeeds.map(feed => fetchFeed(feed))
);

// Merge, sort by date, deduplicate similar headlines
state.newsItems = deduplicateNews(allItems);
```

Deduplication uses normalized title comparison to remove near-identical headlines from different sources.

### 3. Sector Filtering

Since TradingView heatmap iframes don't expose click events, sector filtering uses a **separate pill bar**:

1. User clicks a sector pill (e.g., "Technology")
2. A filter chip appears showing the active filter
3. News feed is filtered by sector-related keywords
4. Clicking the chip's × clears the filter

### 4. Responsive Design

The layout uses CSS Grid with media queries:

```css
/* Desktop: 3 columns */
.main-layout {
  grid-template-columns: 280px 1fr 280px;
}

/* Tablet: 2 columns */
@media (max-width: 1200px) {
  .main-layout { grid-template-columns: 260px 1fr; }
  .sidebar-right { display: none; }
}

/* Mobile: 1 column + bottom tabs */
@media (max-width: 768px) {
  .main-layout { grid-template-columns: 1fr; }
  .sidebar-left { display: none; }
  .bottom-tab-bar { display: flex; }
}
```

---

## Styling

The design uses a **glassmorphism** aesthetic:

- Translucent card backgrounds (`rgba()` + `backdrop-filter: blur()`)
- Subtle borders and shadows
- Smooth transitions (150-350ms)
- Custom CSS variables for theming

### Theme Variables

```css
:root {
  --bg-primary: #f0f4f8;
  --bg-card: rgba(255, 255, 255, 0.7);
  --text-primary: #1a202c;
  --accent-primary: #4f46e5;
  --blur-amount: 12px;
  /* ... */
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-card: rgba(30, 41, 59, 0.75);
  --text-primary: #f1f5f9;
  /* ... */
}
```

---

## Usage

### Opening the Dashboard

Simply open `index.html` in any modern browser. No server required.

```bash
# From WSL/Linux
xdg-open index.html

# Or just double-click the file in Windows Explorer
```

### Daily Workflow

1. **Open in the morning** — widgets load with live pre-market or market data
2. **Check Overview** — quick glance at major indices
3. **Browse Sectors** — see which sectors are hot/cold
4. **Review Movers** — identify big gainers/losers
5. **Scan News** — catch up on headlines, filter by sector if needed
6. **Check Calendars** — see today's earnings and economic events
7. **Update watchlist** — add/remove symbols you're tracking
8. **Jot notes** — record observations for future reference

### Saving Views

Click the save icon (💾) in the top bar to save your current:
- Selected date
- Active sector filter
- Compact mode state
- Theme preference
- Active tab

Load saved views from the left sidebar to quickly restore a previous configuration.

---

## Error Handling

Each widget container has graceful degradation:

- If a TradingView widget fails to load → shows "Temporarily unavailable from source"
- If RSS feeds fail → individual feeds fail silently, others still display
- Uses `Promise.allSettled()` so one failure doesn't break the whole news feed

---

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ⚠️ Older browsers may lack `backdrop-filter` support (falls back gracefully)

---

## Customization

### Adding/Removing Index Widgets

Edit the `symbols` array in `app.js`:

```javascript
const symbols = [
  { container: 'widget-spy', symbol: 'AMEX:SPY' },
  { container: 'widget-qqq', symbol: 'NASDAQ:QQQ' },
  // Add more here...
];
```

### Adding RSS Sources

Add to the `CONFIG.rssFeeds` array:

```javascript
rssFeeds: [
  { url: 'https://example.com/feed.rss', name: 'Source Name' },
  // ...
]
```

### Modifying Sector Keywords

Update `CONFIG.sectorKeywords` to customize how sector filtering matches news:

```javascript
sectorKeywords: {
  technology: ['tech', 'software', 'apple', 'microsoft', ...],
  // ...
}
```

---

## Limitations

1. **No real-time updates** — Refresh the page manually to get new data
2. **Pre-market/After-hours tabs** — UI only; TradingView widget shows current session
3. **Sector heatmap clicks** — Can't click heatmap sectors directly (iframe limitation)
4. **RSS proxy dependency** — News relies on rss2json.com being available

---

## Credits

- **TradingView** — Free embeddable widgets
- **rss2json.com** — CORS proxy for RSS feeds
- **Inter Font** — Typography from Google Fonts
- **Feather Icons** — SVG icons used throughout

---

## License

This is a personal dashboard project. TradingView widgets are subject to TradingView's terms of service.
