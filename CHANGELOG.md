# Changelog

All notable changes to Market Pulse will be documented in this file.

---

## [2.0.1] - 2025-12-16

### Changed
- **Dark Mode Default**: New users now start with dark theme instead of light
- **4K/High-Resolution Layout**: 
  - At 1920px+: All 4 widgets (Market Overview, Movers, Earnings, Economic) display in a single horizontal row
  - Heatmap height scales progressively: 1.5x at 1920px, 1.75x at 2560px, 2x at 4K (3840px)
  - Widget cards scale appropriately for larger displays

### Technical
- Added media queries for 1920px, 2560px, and 3840px breakpoints
- Merged overview-row-2 and overview-row-3 into unified overview-widgets-grid
- Grid switches from 2-column to 4-column above 1920px

---

## [1.4.2] - 2025-12-16

### Changed
- **Movers Tab Full-Width Layout**: Sidebar hidden, widget expanded to 80vh height (shows all tickers)
- **Calendars Tab Full-Width Layout**: Sidebar hidden, calendars use full width side-by-side at 70vh height

### Removed
- **Period Tabs**: Removed non-functional Regular Hours/Pre-Market/After-Hours tabs (TradingView API limitation)

---

## [1.4.1] - 2025-12-16

### Changed
- **Heatmaps Tab Full-Width Layout**: Left sidebar is now hidden when viewing the Heatmaps tab
- Heatmap widget dynamically expands to use full available width (80vh height)
- Added `data-active-tab` body attribute for tab-specific CSS styling

---

## [1.4.0] - 2025-12-16

### Added
- **Heatmap Selector**: New buttons to switch between three heatmap types:
  - **S&P 500**: Stock market heatmap (default)
  - **ETF**: ETF heatmap by asset class
  - **Crypto**: Cryptocurrency coins heatmap
- Selector appears in both Overview section and dedicated Heatmaps tab
- Both areas sync when heatmap type is changed

### Changed
- **Renamed Sectors Tab to Heatmaps**: Better reflects the content
- **Heatmap Card Header**: Now includes selector buttons alongside title

### Removed
- **Sector Pills**: Removed unused Technology, Healthcare, Financials, etc. buttons
- **Sector Filter Chip**: Removed associated filter functionality

### Technical
- Added `createEtfHeatmapWidget()` and `createCryptoHeatmapWidget()` functions
- Added `renderHeatmap()` function that switches between heatmap types based on state
- Added `activeHeatmap` state variable

---

## [1.3.2] - 2025-12-16

### Changed
- **Top Bar**: Reduced vertical padding from 12px to 2px for minimal height
- **Search Placeholder**: Changed from "Search watchlist & news..." to "Search a News Topic"

### Removed
- **Sector Heatmap Legend**: Removed duplicate color legend (TradingView widget has built-in legend)

---

## [1.3.1] - 2025-12-16

### Changed
- **Watchlist Widget Size**: Doubled sidebar width (420px) and increased widget height by 1.5x (180px) for better visibility
- **Chart Date Range**: Changed from 12-month to 1-day view for real-time day trading focus

### Added
- **5 Widget Limit**: Watchlist now supports maximum 5 symbols
- **Disabled Add Button**: Plus (+) button turns grey and becomes inactive when 5 widgets are displayed

### Fixed
- Removed max-height scroll so all 5 widgets display at full height without scrolling
- **Biggest Movers**: Increased widget height from 360px to 520px so more stocks are visible (7-8 instead of 3-4), matching TradingView's internal scroll
- **Market Overview**: Increased height to 600px to match Movers for visual consistency

---

## [1.3.0] - 2025-12-16

### Changed
- **Watchlist Redesign**: Complete overhaul of the Watchlist feature
  - Now displays TradingView mini-chart widgets for each symbol instead of text links
  - Each widget shows 12-month chart, price, and change percentage
  - Symbols are prefixed with `NASDAQ:` automatically
  
### Added
- **Add Symbol (+)**: Click plus button to add new tickers to watchlist
- **Remove Mode (-)**: Click minus button to enter remove mode
  - Each widget shows a "Remove" overlay
  - Click the overlay to remove that ticker
  - Click minus again to exit remove mode
  
### Technical
- Uses `embed-widget-mini-symbol-overview.js` for watchlist widgets
- Widgets are stored as symbol strings in localStorage and rendered as TradingView widgets

---

## [1.2.0] - 2025-12-16

### Changed
- **Market Overview Widget**: Now uses `embed-widget-market-overview.js` for proper display of S&P 500, Nasdaq 100, and Dow 30 indices with integrated chart
- **Layout Restructure**: 
  - Row 1: Sector Heatmap (full width)
  - Row 2: Market Overview + Biggest Movers (equal width)
  - Row 3: Earnings Calendar + Economic Calendar (equal width)
  - Row 4: Financial News (full width)
- **Color Theme**: Updated to pure black background (#000000) with dark grey cards (#1a1a1a) for better contrast

### Fixed
- Removed duplicate Active/Gainers/Losers tabs from Biggest Movers card (TradingView widget has built-in tabs)
- Market Overview and Biggest Movers now have equal width as requested

### Notes
- The Regular Hours/Pre-Market/After-Hours tabs in the dedicated Movers section are UI-only; TradingView's embed widget API doesn't support session filtering

---

## [1.1.0] - 2025-12-16

### Added
- **Consolidated Overview Dashboard**: All components (Market Overview, Sector Heatmap, Biggest Movers, Earnings Calendar, Economic Calendar, Financial News) now visible in a single Overview tab
- New grid-based layout optimized for 1080p displays
- Market Overview card with main chart and 3 index ticker displays (S&P 500, Nasdaq 100, DOW 30)
- Biggest Movers card with Active/Gainers/Losers tabs
- Overview-specific news feed showing top 30 articles

### Changed
- Redesigned Overview section with 3-row grid layout
- Left sidebar width reduced from 280px to 210px for more content space
- Notes section moved from right sidebar to left sidebar (under Saved Views)
- Updated color theme to dark slate (removed purple gradient accents)
- Financial News now displays 30 articles in Overview (was 10)

### Fixed
- Layout optimization for 1920x1080 resolution
- Widget sizing for Market Overview and Biggest Movers
- Horizontal space utilization across all sections

---

## [1.0.0] - 2025-12-15

### Added
- Initial release of Market Pulse dashboard
- **Market Overview**: Live mini-charts for major indices (SPY, QQQ, DIA, IWM, TLT, GLD)
- **Sector Heatmap**: Visual S&P 500 heatmap by sector
- **Biggest Movers**: Top gainers/losers with mini-charts and period tabs
- **Calendars**: Earnings and Economic event calendars
- **News Feed**: Aggregated headlines from CNBC & Yahoo Finance
- **Watchlist**: Personal symbol tracking with TradingView links
- **Notes**: Freeform notepad for market observations
- **Saved Views**: Save/restore dashboard configurations
- Light/Dark theme toggle
- Compact mode toggle
- Responsive design (desktop, tablet, mobile)
- LocalStorage persistence for all user preferences
