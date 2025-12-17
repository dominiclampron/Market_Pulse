# Market Pulse (v2.0)

**Zero installation. No server. No dependencies.**  
Just open `index.html` in your browser—that's it.

A standalone financial dashboard powered by free TradingView widgets and public RSS feeds. Works entirely client-side. Download, drag-and-drop into any browser, and start tracking markets instantly.

---

## Features

### Dashboard Overview
- **Sector Heatmap** - S&P 500, ETF, and Crypto heatmaps with selector buttons
- **Market Overview** - Live S&P 500, Nasdaq 100, and Dow 30 indices with integrated chart
- **Biggest Movers** - Active stocks, gainers, and losers with built-in tabs
- **Earnings Calendar** - Upcoming earnings reports
- **Economic Calendar** - Economic events and indicators
- **Financial News** - Filtered news articles with sector pills

### Dedicated Tabs
- **Overview** - All-in-one dashboard view
- **Heatmaps** - Full-screen heatmap with S&P 500/ETF/Crypto selector
- **Movers** - Full-screen biggest movers widget
- **Calendars** - Side-by-side earnings and economic calendars
- **News** - Full news feed with category filtering

### Left Sidebar
- **Watchlist** - Up to 5 TradingView mini-chart widgets with 1-day view
  - Add (+) and Remove (-) mode for managing symbols
  - Symbols auto-prefixed with `NASDAQ:`
- **Quick Links** - Portfolio, screener, and charts links
- **Saved Views** - Custom watchlist configurations
- **Notes** - Personal notes with local persistence

### UI Features
- **Dark/Light Theme** - Pure black dark mode (#000000 background)
- **Compact Mode** - Reduced spacing for more content
- **Responsive Design** - Desktop, tablet, and mobile layouts
- **Local Storage** - Persists theme, watchlist, notes, and views

## Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Custom properties, grid, flexbox, dark mode
- **JavaScript** - Vanilla ES6+ with no dependencies
- **TradingView Widgets** - Free embeddable market widgets
- **RSS Feeds** - Yahoo Finance via rss2json API

## Quick Start

```
1. Download or clone this repo
2. Open index.html in your browser
3. Done. No build step. No npm. No server.
```

*Optional: For local development, run `python3 -m http.server 8080`*

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Main HTML structure |
| `styles.css` | All styling with CSS variables |
| `app.js` | Application logic and widget initialization |
| `CHANGELOG.md` | Version history and changes |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Version

**Current: v2.0** (December 2024)

See `CHANGELOG.md` for detailed version history.

## License

MIT License
