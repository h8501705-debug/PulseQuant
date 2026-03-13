// ==================== INDIVIDUAL WATCHLIST VIEW ====================
let currentWatchlist = null;
let filteredStocks = [];
let currentPage = 1;
const stocksPerPage = 50;

// Load watchlist from URL parameter
function loadWatchlist() {
    const urlParams = new URLSearchParams(window.location.search);
    const watchlistId = urlParams.get('id');
    
    if (!watchlistId) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    const watchlists = JSON.parse(localStorage.getItem('watchlists')) || [];
    currentWatchlist = watchlists.find(w => w.id === watchlistId);
    
    if (!currentWatchlist) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    document.getElementById('watchlistName').textContent = currentWatchlist.name;
    document.getElementById('stockCount').textContent = `${currentWatchlist.stocks.length} stocks`;
    
    filteredStocks = [...currentWatchlist.stocks];
    renderStocks();
}

// Render stocks with pagination
function renderStocks() {
    const container = document.getElementById('stocksList');
    if (!container) return;
    
    if (filteredStocks.length === 0) {
        container.innerHTML = '<div class="empty-message">No stocks found</div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    // Pagination
    const start = (currentPage - 1) * stocksPerPage;
    const end = start + stocksPerPage;
    const paginatedStocks = filteredStocks.slice(start, end);
    
    container.innerHTML = paginatedStocks.map((stock, index) => {
        const globalIndex = start + index + 1;
        // Generate random price for demo
        const price = (Math.random() * 1000 + 500).toFixed(2);
        const change = (Math.random() * 10 - 5).toFixed(2);
        const changeClass = parseFloat(change) >= 0 ? 'positive' : '';
        
        return `
            <div class="stock-item" onclick="window.location.href='chart.html?symbol=${stock}'">
                <div class="stock-number">${globalIndex}</div>
                <div class="stock-symbol">${stock}</div>
                <div class="stock-price">₹${price}</div>
                <div class="stock-change ${changeClass}">${change}%</div>
            </div>
        `;
    }).join('');
    
    renderPagination();
}

// Render pagination buttons
function renderPagination() {
    const container = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredStocks.length / stocksPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        buttons += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    container.innerHTML = buttons;
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    renderStocks();
}

// Filter stocks
function filterStocks() {
    const searchText = document.getElementById('searchInput').value.toUpperCase();
    
    if (!searchText) {
        filteredStocks = [...currentWatchlist.stocks];
    } else {
        filteredStocks = currentWatchlist.stocks.filter(stock => 
            stock.toUpperCase().includes(searchText)
        );
    }
    
    currentPage = 1;
    renderStocks();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadWatchlist();
});

// Make functions global
window.filterStocks = filterStocks;
window.goToPage = goToPage;
