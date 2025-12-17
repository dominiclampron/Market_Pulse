/**
 * Market Pulse - Daily Financial Dashboard
 * All data from free embeddable widgets and public RSS feeds
 */

// ===== Configuration =====
const CONFIG = {
    rssProxy: 'https://api.rss2json.com/v1/api.json?rss_url=',
    rssFeeds: [
        { url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html', name: 'CNBC' },
        { url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html', name: 'CNBC Economy' },
        { url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US', name: 'Yahoo Finance' }
    ],
    sectorKeywords: {
        technology: ['tech', 'software', 'apple', 'microsoft', 'google', 'nvidia', 'semiconductor', 'ai', 'chip', 'cloud'],
        healthcare: ['health', 'pharma', 'biotech', 'drug', 'fda', 'medical', 'hospital', 'vaccine'],
        financials: ['bank', 'finance', 'rate', 'fed', 'interest', 'loan', 'credit', 'goldman', 'jpmorgan', 'morgan stanley'],
        energy: ['oil', 'gas', 'energy', 'exxon', 'chevron', 'crude', 'opec', 'petroleum', 'renewable'],
        consumer: ['retail', 'consumer', 'amazon', 'walmart', 'target', 'shop', 'spend', 'sales'],
        industrials: ['industrial', 'manufacturing', 'boeing', 'caterpillar', 'construction', 'aerospace'],
        utilities: ['utility', 'utilities', 'electric', 'power', 'grid', 'water'],
        materials: ['material', 'mining', 'steel', 'aluminum', 'chemical', 'gold', 'copper'],
        realestate: ['real estate', 'property', 'housing', 'mortgage', 'reit', 'home'],
        communication: ['media', 'telecom', 'netflix', 'disney', 'meta', 'facebook', 'communication']
    },
    tradingViewTheme: {
        light: 'light',
        dark: 'dark'
    }
};

// ===== State Management =====
const state = {
    theme: localStorage.getItem('mp_theme') || 'light',
    compactMode: localStorage.getItem('mp_compact') === 'true',
    activeTab: localStorage.getItem('mp_tab') || 'overview',
    activeSector: null,
    searchQuery: '',
    watchlist: JSON.parse(localStorage.getItem('mp_watchlist') || '["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"]'),
    notes: localStorage.getItem('mp_notes') || '',
    savedViews: JSON.parse(localStorage.getItem('mp_views') || '[]'),
    newsItems: [],
    moversPeriod: 'regular',
    watchlistRemoveMode: false,
    activeHeatmap: 'stocks'
};

// ===== DOM Elements =====
const elements = {
    body: document.body,
    datePicker: document.getElementById('date-picker'),
    dateDisplay: document.getElementById('date-display'),
    tabNav: document.getElementById('tab-nav'),
    bottomTabBar: document.getElementById('bottom-tab-bar'),
    searchInput: document.getElementById('search-input'),
    themeToggle: document.getElementById('theme-toggle'),
    compactToggle: document.getElementById('compact-toggle'),
    saveViewBtn: document.getElementById('save-view-btn'),
    watchlistWidgets: document.getElementById('watchlist-widgets'),
    watchlistInputWrapper: document.getElementById('watchlist-input-wrapper'),
    watchlistInput: document.getElementById('watchlist-input'),
    addWatchlistBtn: document.getElementById('add-watchlist-btn'),
    removeWatchlistBtn: document.getElementById('remove-watchlist-btn'),
    watchlistAddConfirm: document.getElementById('watchlist-add-confirm'),
    notesTextarea: document.getElementById('notes-textarea'),
    clearNotesBtn: document.getElementById('clear-notes-btn'),
    savedViewsList: document.getElementById('saved-views'),
    newsFeed: document.getElementById('news-feed'),
    newsCount: document.getElementById('news-count'),
    newsFeedOverview: document.getElementById('news-feed-overview'),
    newsCountOverview: document.getElementById('news-count-overview'),
    saveViewModal: document.getElementById('save-view-modal'),
    viewNameInput: document.getElementById('view-name-input'),
    closeSaveModal: document.getElementById('close-save-modal'),
    cancelSaveView: document.getElementById('cancel-save-view'),
    confirmSaveView: document.getElementById('confirm-save-view'),
    moversTabs: document.querySelectorAll('.movers-tab')
};

// ===== Initialization =====
function init() {
    applyTheme();
    applyCompactMode();
    setTodayDate();
    renderWatchlist();
    renderSavedViews();
    loadNotes();
    initWidgets();
    loadNews();
    setupEventListeners();
    showActiveTab();
}

// ===== Theme Management =====
function applyTheme() {
    elements.body.dataset.theme = state.theme;
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('mp_theme', state.theme);
    applyTheme();
    // Reload widgets with new theme
    initWidgets();
}

// ===== Compact Mode =====
function applyCompactMode() {
    elements.body.dataset.compact = state.compactMode;
}

function toggleCompactMode() {
    state.compactMode = !state.compactMode;
    localStorage.setItem('mp_compact', state.compactMode);
    applyCompactMode();
}

// ===== Date Picker =====
function setTodayDate() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    elements.datePicker.value = dateStr;
}

// ===== Tab Navigation =====
function showActiveTab() {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show active section
    const activeSection = document.getElementById(`section-${state.activeTab}`);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    // Update tab buttons
    document.querySelectorAll('.tab-btn, .bottom-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === state.activeTab);
    });

    // Update body attribute for tab-specific layouts
    document.body.setAttribute('data-active-tab', state.activeTab);
}

function switchTab(tab) {
    state.activeTab = tab;
    localStorage.setItem('mp_tab', tab);
    showActiveTab();
}

// ===== TradingView Widget Initialization =====
function initWidgets() {
    const colorTheme = CONFIG.tradingViewTheme[state.theme];

    // === Overview Dashboard Widgets ===

    // Market Overview Widget - shows chart with multiple symbols like reference image
    createMarketOverviewWidget('widget-market-chart', colorTheme);

    // Sector Heatmap for Overview
    renderHeatmap('widget-heatmap-overview');

    // Movers List (hotlists widget with chart)
    createMoversWidget('widget-movers-overview', colorTheme);

    // Calendars for Overview
    createEarningsWidget('widget-earnings-overview', colorTheme);
    createEconomicCalendarWidget('widget-economic-overview', colorTheme);

    // === Dedicated Tab Widgets (for when user clicks those tabs) ===

    // Stock Heatmap Widget (full version for Heatmaps tab)
    renderHeatmap('widget-heatmap');

    // Stock Market Widget (Movers tab)
    createMoversWidget('widget-movers', colorTheme);

    // Earnings Calendar (Calendars tab)
    createEarningsWidget('widget-earnings', colorTheme);

    // Economic Calendar (Calendars tab)
    createEconomicCalendarWidget('widget-economic', colorTheme);
}

function createMiniChartWidget(containerId, symbol, colorTheme) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        symbol: symbol,
        width: '100%',
        height: '100%',
        locale: 'en',
        dateRange: '1D',
        colorTheme: colorTheme,
        isTransparent: true,
        autosize: true,
        largeChartUrl: ''
    });

    script.onerror = () => {
        container.innerHTML = '<div class="widget-error">Temporarily unavailable from source</div>';
    };

    widgetContainer.appendChild(script);
}

// Market Overview Widget - using market-overview widget
function createMarketOverviewWidget(containerId, colorTheme) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        colorTheme: colorTheme,
        dateRange: '12M',
        showChart: true,
        locale: 'en',
        width: '100%',
        height: '100%',
        largeChartUrl: '',
        isTransparent: true,
        showSymbolLogo: true,
        showFloatingTooltip: true,
        plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
        plotLineColorFalling: 'rgba(41, 98, 255, 1)',
        gridLineColor: 'rgba(240, 243, 250, 0)',
        scaleFontColor: 'rgba(120, 123, 134, 1)',
        belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
        belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
        belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
        belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
        symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
        tabs: [
            {
                title: 'Indices',
                symbols: [
                    { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
                    { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
                    { s: 'FOREXCOM:DJI', d: 'Dow 30' }
                ],
                originalTitle: 'Indices'
            }
        ]
    });

    script.onerror = () => {
        container.innerHTML = '<div class="widget-error">Temporarily unavailable from source</div>';
    };

    widgetContainer.appendChild(script);
}

function createHeatmapWidget(containerId, colorTheme) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        exchanges: [],
        dataSource: 'SPX500',
        grouping: 'sector',
        blockSize: 'market_cap_basic',
        blockColor: 'change',
        locale: 'en',
        symbolUrl: '',
        colorTheme: colorTheme,
        hasTopBar: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        isMonoSize: false,
        width: '100%',
        height: '100%'
    });

    script.onerror = () => {
        container.innerHTML = '<div class="widget-error">Temporarily unavailable from source</div>';
    };

    widgetContainer.appendChild(script);
}

function createEtfHeatmapWidget(containerId, colorTheme) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-etf-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        dataSource: 'AllUSEtf',
        blockSize: 'volume',
        blockColor: 'change',
        grouping: 'asset_class',
        locale: 'en',
        symbolUrl: '',
        colorTheme: colorTheme,
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        isMonoSize: false,
        width: '100%',
        height: '100%'
    });

    script.onerror = () => {
        container.innerHTML = '<div class="widget-error">Temporarily unavailable from source</div>';
    };

    widgetContainer.appendChild(script);
}

function createCryptoHeatmapWidget(containerId, colorTheme) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        dataSource: 'Crypto',
        blockSize: 'market_cap_calc',
        blockColor: '24h_close_change|5',
        locale: 'en',
        symbolUrl: '',
        colorTheme: colorTheme,
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        isMonoSize: false,
        width: '100%',
        height: '100%'
    });

    script.onerror = () => {
        container.innerHTML = '<div class="widget-error">Temporarily unavailable from source</div>';
    };

    widgetContainer.appendChild(script);
}

function renderHeatmap(containerId) {
    const colorTheme = CONFIG.tradingViewTheme[state.theme];

    switch (state.activeHeatmap) {
        case 'etf':
            createEtfHeatmapWidget(containerId, colorTheme);
            break;
        case 'crypto':
            createCryptoHeatmapWidget(containerId, colorTheme);
            break;
        case 'stocks':
        default:
            createHeatmapWidget(containerId, colorTheme);
            break;
    }
}

function createMoversWidget(containerId, colorTheme) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        colorTheme: colorTheme,
        dateRange: '1D',
        exchange: 'US',
        showChart: true,
        locale: 'en',
        largeChartUrl: '',
        isTransparent: true,
        showSymbolLogo: true,
        showFloatingTooltip: false,
        width: '100%',
        height: '100%',
        plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
        plotLineColorFalling: 'rgba(255, 0, 0, 1)',
        gridLineColor: 'rgba(240, 243, 250, 0)',
        scaleFontColor: 'rgba(120, 123, 134, 1)',
        belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
        belowLineFillColorFalling: 'rgba(255, 0, 0, 0.12)',
        belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
        belowLineFillColorFallingBottom: 'rgba(255, 0, 0, 0)',
        symbolActiveColor: 'rgba(41, 98, 255, 0.12)'
    });

    script.onerror = () => {
        container.innerHTML = '<div class="widget-error">Temporarily unavailable from source</div>';
    };

    widgetContainer.appendChild(script);
}

function createEarningsWidget(containerId, colorTheme) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        colorTheme: colorTheme,
        isTransparent: true,
        width: '100%',
        height: '100%',
        locale: 'en',
        importanceFilter: '-1,0,1',
        countryFilter: 'us'
    });

    script.onerror = () => {
        container.innerHTML = '<div class="widget-error">Temporarily unavailable from source</div>';
    };

    widgetContainer.appendChild(script);
}

function createEconomicCalendarWidget(containerId, colorTheme) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        colorTheme: colorTheme,
        isTransparent: true,
        width: '100%',
        height: '100%',
        locale: 'en',
        importanceFilter: '0,1',
        countryFilter: 'us,eu,gb,jp,cn'
    });

    script.onerror = () => {
        container.innerHTML = '<div class="widget-error">Temporarily unavailable from source</div>';
    };

    widgetContainer.appendChild(script);
}

// ===== RSS News Feed =====
async function loadNews() {
    elements.newsFeed.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <span>Loading news...</span>
    </div>
  `;

    try {
        const feedPromises = CONFIG.rssFeeds.map(feed => fetchFeed(feed));
        const results = await Promise.allSettled(feedPromises);

        let allItems = [];

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                const sourceName = CONFIG.rssFeeds[index].name;
                allItems = allItems.concat(
                    result.value.map(item => ({
                        ...item,
                        source: sourceName
                    }))
                );
            }
        });

        // Sort by date (newest first)
        allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        // Deduplicate by similar titles
        state.newsItems = deduplicateNews(allItems);

        renderNews();
    } catch (error) {
        console.error('Error loading news:', error);
        elements.newsFeed.innerHTML = `
      <div class="widget-error">
        Unable to load news. Please try again later.
      </div>
    `;
    }
}

async function fetchFeed(feed) {
    try {
        const response = await fetch(CONFIG.rssProxy + encodeURIComponent(feed.url));
        if (!response.ok) throw new Error('Feed fetch failed');

        const data = await response.json();

        if (data.status !== 'ok') throw new Error('Feed parse failed');

        return data.items.map(item => ({
            title: cleanTitle(item.title),
            link: item.link,
            pubDate: item.pubDate,
            description: item.description || ''
        }));
    } catch (error) {
        console.error(`Error fetching ${feed.name}:`, error);
        return null;
    }
}

function cleanTitle(title) {
    // Remove common RSS artifacts
    return title
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}

function deduplicateNews(items) {
    const seen = new Set();
    return items.filter(item => {
        // Create a normalized version of the title for comparison
        const normalized = item.title.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(' ')
            .filter(w => w.length > 3)
            .slice(0, 5)
            .join(' ');

        if (seen.has(normalized)) {
            return false;
        }
        seen.add(normalized);
        return true;
    });
}

function renderNews() {
    const filteredItems = filterNewsItems();

    if (filteredItems.length === 0) {
        const emptyMessage = `
      <div class="widget-error">
        No news items match your current filters.
      </div>
    `;
        if (elements.newsFeed) {
            elements.newsFeed.innerHTML = emptyMessage;
        }
        if (elements.newsFeedOverview) {
            elements.newsFeedOverview.innerHTML = emptyMessage;
        }
        if (elements.newsCount) {
            elements.newsCount.textContent = '0 articles';
        }
        if (elements.newsCountOverview) {
            elements.newsCountOverview.textContent = '0 articles';
        }
        return;
    }

    const newsHTML = (items) => items.map(item => `
    <a href="${item.link}" target="_blank" rel="noopener" class="news-item" data-title="${escapeHtml(item.title.toLowerCase())}">
      <h3 class="news-headline">${escapeHtml(item.title)}</h3>
      <div class="news-meta">
        <span class="news-source">${escapeHtml(item.source)}</span>
        <span class="news-time">${formatTimeAgo(item.pubDate)}</span>
      </div>
    </a>
  `).join('');

    // Full news feed (News tab)
    if (elements.newsFeed) {
        elements.newsFeed.innerHTML = newsHTML(filteredItems);
    }
    if (elements.newsCount) {
        elements.newsCount.textContent = `${filteredItems.length} articles`;
    }

    // Overview news feed (show more articles - 30 items)
    const overviewItems = filteredItems.slice(0, 30);
    if (elements.newsFeedOverview) {
        elements.newsFeedOverview.innerHTML = newsHTML(overviewItems);
    }
    if (elements.newsCountOverview) {
        elements.newsCountOverview.textContent = `${filteredItems.length} articles`;
    }
}

function filterNewsItems() {
    let items = [...state.newsItems];

    // Filter by sector
    if (state.activeSector) {
        const keywords = CONFIG.sectorKeywords[state.activeSector] || [];
        items = items.filter(item => {
            const text = (item.title + ' ' + item.description).toLowerCase();
            return keywords.some(keyword => text.includes(keyword));
        });
    }

    // Filter by search query
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        items = items.filter(item =>
            item.title.toLowerCase().includes(query)
        );
    }

    return items;
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Sector Filtering =====
function selectSector(sector) {
    if (state.activeSector === sector) {
        clearSectorFilter();
        return;
    }

    state.activeSector = sector;

    // Update UI
    document.querySelectorAll('.sector-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.sector === sector);
    });

    elements.activeSectorName.textContent = sector.charAt(0).toUpperCase() + sector.slice(1);
    elements.sectorFilterChip.classList.remove('hidden');

    // Re-render news with filter
    renderNews();
}

function clearSectorFilter() {
    state.activeSector = null;

    document.querySelectorAll('.sector-pill').forEach(pill => {
        pill.classList.remove('active');
    });

    elements.sectorFilterChip.classList.add('hidden');

    renderNews();
}

// ===== Search =====
function handleSearch(query) {
    state.searchQuery = query;
    renderNews();
}

// ===== Watchlist =====
const WATCHLIST_MAX = 5;

function renderWatchlist() {
    const colorTheme = CONFIG.tradingViewTheme[state.theme];

    if (state.watchlist.length === 0) {
        elements.watchlistWidgets.innerHTML = `
            <div class="watchlist-empty">No symbols in watchlist</div>
        `;
        updateAddButtonState();
        return;
    }

    // Clear and rebuild widgets
    elements.watchlistWidgets.innerHTML = '';

    state.watchlist.forEach(symbol => {
        createWatchlistWidget(symbol, colorTheme);
    });

    // Update remove mode state and add button state
    updateWatchlistRemoveMode();
    updateAddButtonState();
}

function createWatchlistWidget(symbol, colorTheme) {
    const fullSymbol = `NASDAQ:${symbol}`;

    // Create widget item container
    const widgetItem = document.createElement('div');
    widgetItem.className = 'watchlist-widget-item';
    widgetItem.dataset.symbol = symbol;

    // Create remove overlay
    const removeOverlay = document.createElement('div');
    removeOverlay.className = 'remove-overlay';
    removeOverlay.innerHTML = '<span>Remove</span>';
    removeOverlay.addEventListener('click', () => {
        removeFromWatchlist(symbol);
    });

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'widget-container';

    // Create TradingView widget structure
    const tvContainer = document.createElement('div');
    tvContainer.className = 'tradingview-widget-container';
    tvContainer.style.height = '100%';
    tvContainer.style.width = '100%';

    const tvWidget = document.createElement('div');
    tvWidget.className = 'tradingview-widget-container__widget';
    tvWidget.style.height = '100%';
    tvWidget.style.width = '100%';

    tvContainer.appendChild(tvWidget);

    // Create and append script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        symbol: fullSymbol,
        width: '100%',
        height: '100%',
        locale: 'en',
        dateRange: '1D',
        colorTheme: colorTheme,
        isTransparent: true,
        autosize: true,
        chartOnly: false,
        noTimeScale: false
    });

    tvContainer.appendChild(script);
    widgetContainer.appendChild(tvContainer);

    // Assemble widget item
    widgetItem.appendChild(removeOverlay);
    widgetItem.appendChild(widgetContainer);

    // Add to watchlist widgets container
    elements.watchlistWidgets.appendChild(widgetItem);
}

function addToWatchlist(symbol) {
    symbol = symbol.toUpperCase().trim();
    if (!symbol || state.watchlist.includes(symbol)) return;
    if (state.watchlist.length >= WATCHLIST_MAX) return; // Max 5 widgets

    state.watchlist.push(symbol);
    localStorage.setItem('mp_watchlist', JSON.stringify(state.watchlist));
    renderWatchlist();
}

function removeFromWatchlist(symbol) {
    state.watchlist = state.watchlist.filter(s => s !== symbol);
    localStorage.setItem('mp_watchlist', JSON.stringify(state.watchlist));
    renderWatchlist();
}

function toggleWatchlistRemoveMode() {
    state.watchlistRemoveMode = !state.watchlistRemoveMode;
    updateWatchlistRemoveMode();
}

function updateWatchlistRemoveMode() {
    if (state.watchlistRemoveMode) {
        elements.watchlistWidgets.classList.add('remove-mode');
        elements.removeWatchlistBtn.classList.add('active');
    } else {
        elements.watchlistWidgets.classList.remove('remove-mode');
        elements.removeWatchlistBtn.classList.remove('active');
    }
}

function updateAddButtonState() {
    if (state.watchlist.length >= WATCHLIST_MAX) {
        elements.addWatchlistBtn.classList.add('disabled');
        elements.addWatchlistBtn.disabled = true;
    } else {
        elements.addWatchlistBtn.classList.remove('disabled');
        elements.addWatchlistBtn.disabled = false;
    }
}

// ===== Notes =====
function loadNotes() {
    elements.notesTextarea.value = state.notes;
}

function saveNotes() {
    state.notes = elements.notesTextarea.value;
    localStorage.setItem('mp_notes', state.notes);
}

function clearNotes() {
    if (confirm('Clear all notes?')) {
        state.notes = '';
        elements.notesTextarea.value = '';
        localStorage.setItem('mp_notes', '');
    }
}

// ===== Saved Views =====
function renderSavedViews() {
    if (state.savedViews.length === 0) {
        elements.savedViewsList.innerHTML = `
      <li class="saved-views-empty">No saved views</li>
    `;
        return;
    }

    elements.savedViewsList.innerHTML = state.savedViews.map((view, index) => `
    <li class="saved-view-item" data-index="${index}">
      <span>${escapeHtml(view.name)}</span>
      <button class="saved-view-remove" data-index="${index}">×</button>
    </li>
  `).join('');

    // Add click handlers
    elements.savedViewsList.querySelectorAll('.saved-view-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('saved-view-remove')) {
                loadView(parseInt(item.dataset.index));
            }
        });
    });

    elements.savedViewsList.querySelectorAll('.saved-view-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeView(parseInt(btn.dataset.index));
        });
    });
}

function saveCurrentView(name) {
    const view = {
        name,
        date: elements.datePicker.value,
        sector: state.activeSector,
        compact: state.compactMode,
        theme: state.theme,
        tab: state.activeTab
    };

    state.savedViews.push(view);
    localStorage.setItem('mp_views', JSON.stringify(state.savedViews));
    renderSavedViews();
}

function loadView(index) {
    const view = state.savedViews[index];
    if (!view) return;

    elements.datePicker.value = view.date;

    if (view.sector) {
        selectSector(view.sector);
    } else {
        clearSectorFilter();
    }

    if (view.compact !== state.compactMode) {
        toggleCompactMode();
    }

    if (view.theme !== state.theme) {
        toggleTheme();
    }

    if (view.tab) {
        switchTab(view.tab);
    }
}

function removeView(index) {
    state.savedViews.splice(index, 1);
    localStorage.setItem('mp_views', JSON.stringify(state.savedViews));
    renderSavedViews();
}

function openSaveViewModal() {
    elements.saveViewModal.classList.remove('hidden');
    elements.viewNameInput.value = '';
    elements.viewNameInput.focus();
}

function closeSaveViewModal() {
    elements.saveViewModal.classList.add('hidden');
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Compact mode toggle
    elements.compactToggle.addEventListener('click', toggleCompactMode);

    // Tab navigation
    elements.tabNav.addEventListener('click', (e) => {
        const tab = e.target.closest('.tab-btn');
        if (tab) switchTab(tab.dataset.tab);
    });

    // Bottom tab bar (mobile)
    elements.bottomTabBar.addEventListener('click', (e) => {
        const tab = e.target.closest('.bottom-tab');
        if (tab) switchTab(tab.dataset.tab);
    });

    // Search
    elements.searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    // Heatmap selector buttons
    document.querySelectorAll('.heatmap-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const heatmapType = btn.dataset.heatmap;
            state.activeHeatmap = heatmapType;

            // Update all heatmap buttons
            document.querySelectorAll('.heatmap-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.heatmap === heatmapType);
            });

            // Re-render both heatmaps
            renderHeatmap('widget-heatmap-overview');
            renderHeatmap('widget-heatmap');
        });
    });

    // Watchlist
    elements.addWatchlistBtn.addEventListener('click', () => {
        elements.watchlistInputWrapper.classList.toggle('hidden');
        if (!elements.watchlistInputWrapper.classList.contains('hidden')) {
            elements.watchlistInput.focus();
        }
    });

    elements.watchlistAddConfirm.addEventListener('click', () => {
        addToWatchlist(elements.watchlistInput.value);
        elements.watchlistInput.value = '';
        elements.watchlistInputWrapper.classList.add('hidden');
    });

    elements.watchlistInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addToWatchlist(elements.watchlistInput.value);
            elements.watchlistInput.value = '';
            elements.watchlistInputWrapper.classList.add('hidden');
        }
    });

    // Watchlist remove mode toggle
    elements.removeWatchlistBtn.addEventListener('click', toggleWatchlistRemoveMode);

    // Notes
    elements.notesTextarea.addEventListener('input', saveNotes);
    elements.clearNotesBtn.addEventListener('click', clearNotes);

    // Save view
    elements.saveViewBtn.addEventListener('click', openSaveViewModal);
    elements.closeSaveModal.addEventListener('click', closeSaveViewModal);
    elements.cancelSaveView.addEventListener('click', closeSaveViewModal);
    elements.confirmSaveView.addEventListener('click', () => {
        const name = elements.viewNameInput.value.trim();
        if (name) {
            saveCurrentView(name);
            closeSaveViewModal();
        }
    });

    elements.viewNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const name = e.target.value.trim();
            if (name) {
                saveCurrentView(name);
                closeSaveViewModal();
            }
        }
    });

    // Modal overlay click to close
    elements.saveViewModal.addEventListener('click', (e) => {
        if (e.target === elements.saveViewModal) {
            closeSaveViewModal();
        }
    });

    // Movers period tabs (dedicated Movers tab)
    elements.moversTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            state.moversPeriod = tab.dataset.period;
            elements.moversTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Note: TradingView hotlists widget doesn't support period switching
            // The widget always shows regular hours data
        });
    });
}

// ===== Start Application =====
document.addEventListener('DOMContentLoaded', init);
