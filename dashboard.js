// ==================== DASHBOARD LOGIC ====================
let watchlists = [];
let currentEditId = null;
let currentUser = null;

// Check if user is logged in
function checkLoginStatus() {
    const savedUser = localStorage.getItem('pulsequant_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    document.getElementById('loggedOutView').style.display = 'none';
    document.getElementById('loggedInView').style.display = 'block';
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('accountInitial').textContent = '👤';
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.email.split('@')[0]}!`;
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    document.getElementById('loggedOutView').style.display = 'block';
    document.getElementById('loggedInView').style.display = 'none';
    document.getElementById('accountInitial').textContent = '👤';
    document.getElementById('welcomeMessage').textContent = 'Create and manage your stock watchlists';
}

// Toggle account dropdown
function toggleAccountDropdown() {
    const dropdown = document.getElementById('accountDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('accountDropdown');
    const accountCircle = document.querySelector('.account-circle');
    
    if (!accountCircle.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Logout function
function logout() {
    localStorage.removeItem('pulsequant_current_user');
    currentUser = null;
    updateUIForLoggedOutUser();
    document.getElementById('accountDropdown').classList.remove('show');
    
    // Reload default watchlists
    loadDefaultWatchlists();
}

// Get storage key based on user
function getStorageKey() {
    if (currentUser) {
        return `pulsequant_watchlists_${currentUser.email}`;
    } else {
        return 'pulsequant_watchlists_default';
    }
}

// Load default watchlists
function loadDefaultWatchlists() {
    watchlists = [
        {
            id: '1',
            name: 'NIFTY 50',
            stocks: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'LT'],
            isDefault: true,
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Banking',
            stocks: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 'INDUSINDBK', 'BANDHANBNK', 'FEDERALBNK', 'PNB', 'BANKBARODA'],
            isDefault: false,
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            name: 'IT',
            stocks: ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM', 'LTTS', 'MPHASIS', 'MINDTREE', 'COFORGE', 'PERSISTENT'],
            isDefault: false,
            createdAt: new Date().toISOString()
        },
        {
            id: '4',
            name: 'Pharma',
            stocks: ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB', 'BIOCON', 'LUPIN', 'ALKEM', 'TORNTPHARM', 'AUROPHARMA', 'GLENMARK'],
            isDefault: false,
            createdAt: new Date().toISOString()
        },
        {
            id: '5',
            name: 'Auto',
            stocks: ['TATAMOTORS', 'MARUTI', 'M&M', 'BAJAJ-AUTO', 'EICHERMOT', 'HEROMOTOCO', 'ASHOKLEY', 'TVSMOTOR', 'TATAMOTORS', 'BALKRISIND'],
            isDefault: false,
            createdAt: new Date().toISOString()
        }
    ];
    saveWatchlists();
    renderWatchlists();
}

// Load watchlists from localStorage
function loadWatchlists() {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
        watchlists = JSON.parse(saved);
    } else {
        loadDefaultWatchlists();
    }
    renderWatchlists();
}

// Save watchlists to localStorage
function saveWatchlists() {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(watchlists));
}

// Render all watchlists
function renderWatchlists() {
    const container = document.getElementById('watchlistsContainer');
    if (!container) return;
    
    if (watchlists.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No watchlists yet</h3>
                <p>Create your first watchlist to start tracking stocks</p>
                <button class="create-btn" onclick="openCreateModal()" style="width: auto;">+ Create Watchlist</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = watchlists.map(watchlist => `
        <div class="watchlist-card">
            <div class="watchlist-header">
                <span class="watchlist-name">${watchlist.name}</span>
                ${watchlist.isDefault ? '<span class="watchlist-badge">Default</span>' : ''}
            </div>
            <div class="watchlist-stats">
                <span>📊 ${watchlist.stocks.length} stocks</span>
                <span>📅 ${new Date(watchlist.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="watchlist-actions">
                <button class="action-btn view-btn" onclick="viewWatchlist('${watchlist.id}')">View</button>
                <button class="action-btn edit-btn" onclick="editWatchlist('${watchlist.id}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteWatchlist('${watchlist.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Filter watchlists
document.getElementById('searchWatchlists')?.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    const container = document.getElementById('watchlistsContainer');
    
    const filtered = watchlists.filter(w => 
        w.name.toLowerCase().includes(searchText) ||
        w.stocks.some(s => s.toLowerCase().includes(searchText))
    );
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No matching watchlists found</p></div>';
        return;
    }
    
    container.innerHTML = filtered.map(watchlist => `
        <div class="watchlist-card">
            <div class="watchlist-header">
                <span class="watchlist-name">${watchlist.name}</span>
                ${watchlist.isDefault ? '<span class="watchlist-badge">Default</span>' : ''}
            </div>
            <div class="watchlist-stats">
                <span>📊 ${watchlist.stocks.length} stocks</span>
                <span>📅 ${new Date(watchlist.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="watchlist-actions">
                <button class="action-btn view-btn" onclick="viewWatchlist('${watchlist.id}')">View</button>
                <button class="action-btn edit-btn" onclick="editWatchlist('${watchlist.id}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteWatchlist('${watchlist.id}')">Delete</button>
            </div>
        </div>
    `).join('');
});

// View watchlist
function viewWatchlist(id) {
    window.location.href = `watchlist.html?id=${id}`;
}

// Open create modal
function openCreateModal() {
    if (!currentUser) {
        if (confirm('You need to create an account to save watchlists. Go to account page?')) {
            window.location.href = 'account.html';
        }
        return;
    }
    
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Create New Watchlist';
    document.getElementById('watchlistName').value = '';
    document.getElementById('stockSymbols').value = '';
    document.getElementById('watchlistModal').classList.add('active');
}

// Edit watchlist
function editWatchlist(id) {
    if (!currentUser) {
        if (confirm('You need to create an account to edit watchlists. Go to account page?')) {
            window.location.href = 'account.html';
        }
        return;
    }
    
    const watchlist = watchlists.find(w => w.id === id);
    if (!watchlist) return;
    
    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Watchlist';
    document.getElementById('watchlistName').value = watchlist.name;
    document.getElementById('stockSymbols').value = watchlist.stocks.join('\n');
    document.getElementById('watchlistModal').classList.add('active');
}

// Delete watchlist
function deleteWatchlist(id) {
    if (!currentUser) {
        if (confirm('You need to create an account to delete watchlists. Go to account page?')) {
            window.location.href = 'account.html';
        }
        return;
    }
    
    if (confirm('Are you sure you want to delete this watchlist?')) {
        watchlists = watchlists.filter(w => w.id !== id);
        saveWatchlists();
        renderWatchlists();
    }
}

// Close modal
function closeModal() {
    document.getElementById('watchlistModal').classList.remove('active');
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        const symbols = content.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith(','))
            .map(line => line.split(',')[0].trim().toUpperCase());
        
        document.getElementById('stockSymbols').value = symbols.join('\n');
    };
    reader.readAsText(file);
}

// Save watchlist
function saveWatchlist() {
    const name = document.getElementById('watchlistName').value.trim();
    const symbolsText = document.getElementById('stockSymbols').value.trim();
    
    if (!name) {
        alert('Please enter a watchlist name');
        return;
    }
    
    const stocks = symbolsText ? 
        symbolsText.split('\n').map(s => s.trim()).filter(s => s) : 
        [];
    
    if (currentEditId) {
        // Update existing
        const index = watchlists.findIndex(w => w.id === currentEditId);
        if (index !== -1) {
            watchlists[index].name = name;
            watchlists[index].stocks = stocks;
        }
    } else {
        // Create new
        const newWatchlist = {
            id: Date.now().toString(),
            name: name,
            stocks: stocks,
            isDefault: false,
            createdAt: new Date().toISOString()
        };
        watchlists.push(newWatchlist);
    }
    
    saveWatchlists();
    renderWatchlists();
    closeModal();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadWatchlists();
});

// Make functions global
window.openCreateModal = openCreateModal;
window.closeModal = closeModal;
window.saveWatchlist = saveWatchlist;
window.handleFileUpload = handleFileUpload;
window.viewWatchlist = viewWatchlist;
window.editWatchlist = editWatchlist;
window.deleteWatchlist = deleteWatchlist;
window.toggleAccountDropdown = toggleAccountDropdown;
window.logout = logout;
