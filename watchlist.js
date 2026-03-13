// ==================== WATCHLIST VIEW LOGIC ====================
let currentWatchlist = null;
let filteredStocks = [];
let currentPage = 1;
const stocksPerPage = 50;

// Load watchlist from URL
function loadWatchlist() {
    const urlParams = new URLSearchParams(window.location.search);
    const watchlistId = urlParams.get('id');
    
    if (!watchlistId) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    const watchlists = JSON.parse(localStorage.getItem('marketminds_watchlists')) || [];
    currentWatchlist = watchlists.find(w => w.id === watchlistId);
    
    if (!currentWatchlist) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    document.getElementById('watchlistName').textContent = currentWatchlist.name;
    document.getElementById('stockCount').textContent = currentWatchlist.stocks.length + ' stocks';
    
    if (currentWatchlist.createdAt) {
        document.getElementById('watchlistMeta').textContent = 'Created on ' + new Date(currentWatchlist.createdAt).toLocaleDateString();
    }
    
    filteredStocks = [...currentWatchlist.stocks];
    renderStocks();
}

// Render stocks with pagination
function renderStocks() {
    const container = document.getElementById('stocksList');
    if (!container) return;
    
    if (filteredStocks.length === 0) {
        container.innerHTML = '<div class="empty-state">No stocks found in this watchlist</div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    const start = (currentPage - 1) * stocksPerPage;
    const end = start + stocksPerPage;
    const paginatedStocks = filteredStocks.slice(start, end);
    
    let html = '';
    for (let i = 0; i < paginatedStocks.length; i++) {
        const stock = paginatedStocks[i];
        const globalIndex = start + i + 1;
        const price = (Math.random() * 1000 + 500).toFixed(2);
        const change = (Math.random() * 10 - 5).toFixed(2);
        const changeClass = parseFloat(change) >= 0 ? 'positive' : '';
        
        html += '<div class="stock-item" onclick="window.location.href=\'chart.html?symbol=' + stock + '\'">';
        html += '<div class="stock-number">' + globalIndex + '</div>';
        html += '<div class="stock-symbol">' + stock + '</div>';
        html += '<div class="stock-price">₹' + price + '</div>';
        html += '<div class="stock-change ' + changeClass + '">' + change + '%</div>';
        html += '</div>';
    }
    
    container.innerHTML = html;
    renderPagination();
}

// Render pagination
function renderPagination() {
    const container = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredStocks.length / stocksPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        let activeClass = i === currentPage ? 'active' : '';
        buttons += '<button class="page-btn ' + activeClass + '" onclick="goToPage(' + i + ')">' + i + '</button>';
    }
    
    container.innerHTML = buttons;
}

// Go to page
function goToPage(page) {
    currentPage = page;
    renderStocks();
}

// Filter stocks
function filterStocks() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchText = searchInput.value.toUpperCase();
    
    if (!searchText) {
        filteredStocks = [...currentWatchlist.stocks];
    } else {
        filteredStocks = [];
        for (let i = 0; i < currentWatchlist.stocks.length; i++) {
            if (currentWatchlist.stocks[i].toUpperCase().includes(searchText)) {
                filteredStocks.push(currentWatchlist.stocks[i]);
            }
        }
    }
    
    currentPage = 1;
    renderStocks();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadWatchlist();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterStocks);
    }
});

// Make functions global
window.goToPage = goToPage;
