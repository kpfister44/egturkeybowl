// Global app state
let currentData = {
    players: [],
    teams: [],
    history: {},
    settings: {}
};

let isAdminMode = false;
let currentPage = 'home';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupNavigation();
    setupAdminMode();
    setupCountdown();
    renderCurrentPage();

    // Set up mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

// Load data from JS files and localStorage
function loadData() {
    // Load settings
    currentData.settings = loadFromStorage('settings', eventSettings);

    // Load players
    currentData.players = loadFromStorage('players', playersData);

    // Load teams
    currentData.teams = loadFromStorage('teams', teamsData);

    // Load history
    currentData.history = loadFromStorage('history', historyData);

    console.log('Data loaded:', currentData);
}

// Load from localStorage with fallback to default data
function loadFromStorage(dataType, defaultData) {
    try {
        const stored = localStorage.getItem(`turkeybowl_${dataType}`);
        return stored ? JSON.parse(stored) : defaultData;
    } catch (error) {
        console.error(`Error loading ${dataType} from localStorage:`, error);
        return defaultData;
    }
}

// Save data to localStorage
function saveToLocalStorage(dataType, data) {
    try {
        localStorage.setItem(`turkeybowl_${dataType}`, JSON.stringify(data));
        console.log(`${dataType} saved to localStorage`);
    } catch (error) {
        console.error(`Error saving ${dataType} to localStorage:`, error);
    }
}

// Setup navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.dataset.page;
            navigateToPage(page);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', (e) => {
        e.preventDefault();
        const hash = window.location.hash.substring(1);
        if (hash && ['home', 'roster', 'teams', 'history'].includes(hash)) {
            navigateToPage(hash);
        }
    });

    // Set initial page from URL hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && ['home', 'roster', 'teams', 'history'].includes(initialHash)) {
        currentPage = initialHash;
    }
}

// Navigate to a specific page
function navigateToPage(page) {
    if (currentPage === page) return;

    // Update navigation buttons - use inline styles to override Tailwind classes
    document.querySelectorAll('.nav-button').forEach(btn => {
        if (btn.dataset.page === page) {
            // Make active - orange color and bold
            btn.style.color = '#f26c0d';
            btn.style.fontWeight = 'bold';
            btn.classList.add('active');
        } else {
            // Make inactive - white color and normal weight
            btn.style.color = 'white';
            btn.style.fontWeight = '500';
            btn.classList.remove('active');
        }
    });

    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(page);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update URL hash
    window.location.hash = page;
    currentPage = page;

    // Render page content
    renderCurrentPage();

    // Scroll to top of page - do this after rendering
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 10);

    // Close mobile menu if open
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
}

// Render the current page content
function renderCurrentPage() {
    switch (currentPage) {
        case 'home':
            renderHomePage();
            break;
        case 'roster':
            renderRosterPage();
            break;
        case 'teams':
            renderTeamsPage();
            break;
        case 'history':
            renderHistoryPage();
            break;
    }
}

// Render home page
function renderHomePage() {
    // Update event details
    const eventDate = document.getElementById('event-date');
    const eventLocation = document.getElementById('event-location');
    const registrationDeadline = document.getElementById('registration-deadline');

    if (eventDate) {
        const date = new Date(currentData.settings.eventDate);
        eventDate.textContent = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    if (eventLocation) {
        eventLocation.textContent = currentData.settings.eventLocation;
    }

    if (registrationDeadline) {
        const deadline = new Date(currentData.settings.registrationDeadline);
        registrationDeadline.textContent = deadline.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }
}

// Setup countdown timer
function setupCountdown() {
    function updateCountdown() {
        const eventDate = new Date(currentData.settings.eventDate);
        const now = new Date();
        const timeLeft = eventDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }

    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Render roster page
// Pagination state
let rosterCurrentPage = 1;
let playersPerPage = 10;
let filteredPlayers = [];

function renderRosterPage() {
    filteredPlayers = [...currentData.players];
    setupSearch();
    renderPlayersTable();
    renderPagination();
}

function setupSearch() {
    const searchInput = document.getElementById('player-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterPlayers(searchTerm);
        });
    }
}

function filterPlayers(searchTerm) {
    if (!searchTerm) {
        filteredPlayers = [...currentData.players];
    } else {
        filteredPlayers = currentData.players.filter(player => {
            return (
                player.name.toLowerCase().includes(searchTerm) ||
                player.position.toLowerCase().includes(searchTerm) ||
                player.nickname.toLowerCase().includes(searchTerm)
            );
        });
    }
    rosterCurrentPage = 1; // Reset to first page when filtering
    renderPlayersTable();
    renderPagination();
}

function renderPlayersTable() {
    const tbody = document.getElementById('players-table-body');
    if (!tbody) return;

    // Clear existing content
    tbody.innerHTML = '';

    // Calculate pagination
    const startIndex = (rosterCurrentPage - 1) * playersPerPage;
    const endIndex = startIndex + playersPerPage;
    const playersToShow = filteredPlayers.slice(startIndex, endIndex);

    playersToShow.forEach(player => {
        const row = createPlayerTableRow(player);
        tbody.appendChild(row);
    });
}

function createPlayerTableRow(player) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-white/5 transition-colors';
    row.dataset.playerId = player.id;

    // Find team name
    const playerTeam = currentData.teams.find(team => team.players.includes(player.id));
    const teamName = playerTeam ? playerTeam.name : 'Free Agent';

    row.innerHTML = `
        <td class="table-player-cell-style">${player.name}</td>
        <td class="table-data-cell-style">${player.position}</td>
        <td class="table-data-cell-style">${teamName}</td>
        <td class="table-data-cell-style">${player.yearsPlayed} year${player.yearsPlayed !== 1 ? 's' : ''}</td>
        ${isAdminMode ? `
        <td class="table-data-cell-style">
            <button class="edit-player-btn admin-btn mr-2">Edit</button>
            <button class="delete-player-btn admin-btn">Delete</button>
        </td>
        ` : ''}
    `;

    // Add click handler to show player details
    row.addEventListener('click', (e) => {
        if (!e.target.closest('.admin-btn')) {
            showPlayerCardModal(player);
        }
    });

    // Setup admin controls if in admin mode
    if (isAdminMode) {
        setupPlayerRowEditing(row, player);
    }

    return row;
}

function setupPlayerRowEditing(row, player) {
    const editBtn = row.querySelector('.edit-player-btn');
    const deleteBtn = row.querySelector('.delete-player-btn');

    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPlayerCardModal(player, true);
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete ${player.name}?`)) {
                deletePlayer(player.id);
            }
        });
    }
}

function renderPagination() {
    const paginationNumbers = document.getElementById('pagination-numbers');
    if (!paginationNumbers) return;

    // Clear existing pagination
    paginationNumbers.innerHTML = '';

    const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

    // Don't show pagination if only one page
    if (totalPages <= 1) {
        const parent = paginationNumbers.parentElement;
        parent.style.display = 'none';
        return;
    }

    const parent = paginationNumbers.parentElement;
    parent.style.display = 'flex';

    // Generate page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-number ${i === rosterCurrentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            rosterCurrentPage = i;
            renderPlayersTable();
            renderPagination();
        });
        paginationNumbers.appendChild(pageBtn);
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
    const newPage = rosterCurrentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
        rosterCurrentPage = newPage;
        renderPlayersTable();
        renderPagination();
    }
}

// Create player card element
function createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.dataset.playerId = player.id;

    const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K'];

    card.innerHTML = `
        <div class="player-photo" style="background-image: url('${player.photoPath}')">
            ${player.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div class="player-name" ${isAdminMode ? 'contenteditable="true"' : ''}>${player.name}</div>
        ${isAdminMode ? `
        <select class="player-position-select" style="background: none; border: none; color: #9ca3af; font-size: 0.875rem; margin-bottom: 8px;">
            ${positions.map(pos => `<option value="${pos}" ${pos === player.position ? 'selected' : ''}>${pos}</option>`).join('')}
        </select>
        ` : `<div class="player-position">${player.position}</div>`}
        <div class="player-experience">${player.yearsPlayed} year${player.yearsPlayed !== 1 ? 's' : ''} experience</div>
        ${isAdminMode ? '<button class="delete-player-btn admin-btn" style="margin-top: 10px;">Delete</button>' : ''}
    `;

    if (isAdminMode) {
        setupPlayerCardEditing(card, player);
    }

    // Add click handler to show full player info
    card.addEventListener('click', () => {
        if (!isAdminMode) {
            showPlayerCardModal(player);
        }
    });

    return card;
}

// Setup player card editing for admin mode
function setupPlayerCardEditing(card, player) {
    const nameEl = card.querySelector('.player-name');
    const positionEl = card.querySelector('.player-position-select');
    const deleteBtn = card.querySelector('.delete-player-btn');

    if (nameEl) {
        nameEl.addEventListener('blur', () => {
            player.name = nameEl.textContent.trim();
            savePlayerData();
        });
    }

    if (positionEl) {
        positionEl.addEventListener('change', () => {
            player.position = positionEl.value;
            savePlayerData();
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete ${player.name}?`)) {
                deletePlayer(player.id);
            }
        });
    }
}

// Create player list item for fantasy draft style layout
function createPlayerListItem(player) {
    const listItem = document.createElement('div');
    listItem.className = 'player-list-item';
    listItem.dataset.playerId = player.id;

    listItem.innerHTML = `
        <div class="player-list-avatar">
            ${player.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div class="player-list-info">
            <div class="player-list-name">${player.name}</div>
            <div class="player-list-nickname">"${player.nickname}"</div>
        </div>
        <div class="player-list-position">${player.position}</div>
        <div class="player-list-years">${player.yearsPlayed}yr${player.yearsPlayed > 1 ? 's' : ''}</div>
        ${isAdminMode ? `
        <div class="player-list-admin-controls">
            <button class="edit-player-btn admin-btn">Edit</button>
            <button class="delete-player-btn admin-btn">Delete</button>
        </div>
        ` : ''}
    `;

    // Add click handler to show player card modal
    listItem.addEventListener('click', (e) => {
        // Don't trigger modal if clicking admin controls
        if (e.target.closest('.player-list-admin-controls')) {
            return;
        }
        showPlayerCardModal(player);
    });

    // Setup admin controls if in admin mode
    if (isAdminMode) {
        setupPlayerListItemEditing(listItem, player);
    }

    return listItem;
}

// Setup editing for player list item in admin mode
function setupPlayerListItemEditing(listItem, player) {
    const editBtn = listItem.querySelector('.edit-player-btn');
    const deleteBtn = listItem.querySelector('.delete-player-btn');

    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPlayerCardModal(player, true); // true for edit mode
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete ${player.name}?`)) {
                deletePlayer(player.id);
            }
        });
    }
}

// Show player card in modal
function showPlayerCardModal(player, editMode = false) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    // Create player card for modal
    const playerCardContent = createPlayerCardForModal(player, editMode);
    modalBody.innerHTML = '';
    modalBody.appendChild(playerCardContent);

    // Show modal
    modal.classList.remove('hidden');

    // Setup modal close handlers
    setupModalCloseHandlers(modal);
}

// Create player card content for modal display
function createPlayerCardForModal(player, editMode = false) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'player-card-modal';

    const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K'];

    cardContainer.innerHTML = `
        <div class="player-photo">
            ${player.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div class="player-name" ${editMode ? 'contenteditable="true"' : ''}>${player.name}</div>
        <div class="player-nickname" ${editMode ? 'contenteditable="true"' : ''}>"${player.nickname}"</div>
        ${editMode ? `
        <select class="player-position-select" style="background: linear-gradient(145deg, var(--bright-orange), #e55500); color: white; border: none; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin-bottom: 15px;">
            ${positions.map(pos => `<option value="${pos}" ${pos === player.position ? 'selected' : ''}>${pos}</option>`).join('')}
        </select>
        ` : `<div class="player-position">${player.position}</div>`}
        <div class="player-bio" ${editMode ? 'contenteditable="true"' : ''}>${player.bio}</div>
        <div class="player-years">${player.yearsPlayed} year${player.yearsPlayed > 1 ? 's' : ''} played</div>
        ${editMode ? '<button class="save-player-btn admin-btn" style="margin-top: 15px;">Save Changes</button>' : ''}
    `;

    // Setup editing functionality if in edit mode
    if (editMode) {
        setupModalPlayerCardEditing(cardContainer, player);
    }

    return cardContainer;
}

// Setup player card editing in modal
function setupModalPlayerCardEditing(cardContainer, player) {
    const nameEl = cardContainer.querySelector('.player-name');
    const nicknameEl = cardContainer.querySelector('.player-nickname');
    const positionEl = cardContainer.querySelector('.player-position-select');
    const bioEl = cardContainer.querySelector('.player-bio');
    const saveBtn = cardContainer.querySelector('.save-player-btn');

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Update player data
            if (nameEl) player.name = nameEl.textContent.trim();
            if (nicknameEl) player.nickname = nicknameEl.textContent.trim().replace(/"/g, '');
            if (positionEl) player.position = positionEl.value;
            if (bioEl) player.bio = bioEl.textContent.trim();

            // Save to localStorage
            savePlayerData();

            // Close modal and refresh page
            document.getElementById('modal').classList.add('hidden');
            renderCurrentPage();
        });
    }
}

// Setup modal close handlers
function setupModalCloseHandlers(modal) {
    const closeBtn = modal.querySelector('.modal-close');

    // Close on X button click
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.add('hidden');
    }

    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };

    // Close on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modal.classList.add('hidden');
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Save player data to localStorage
function savePlayerData() {
    saveToLocalStorage('players', currentData.players);
}

// Delete player
function deletePlayer(playerId) {
    currentData.players = currentData.players.filter(p => p.id !== playerId);

    // Remove player from all teams
    currentData.teams.forEach(team => {
        team.players = team.players.filter(pid => pid !== playerId);
    });

    savePlayerData();
    saveToLocalStorage('teams', currentData.teams);
    renderCurrentPage();
}

// Render teams page
function renderTeamsPage() {
    const teamsContainer = document.getElementById('teams-container');
    if (!teamsContainer) return;

    teamsContainer.innerHTML = '';

    currentData.teams.forEach(team => {
        const teamCard = createTeamCard(team);
        teamsContainer.appendChild(teamCard);
    });
}

// Create team card element
function createTeamCard(team) {
    const card = document.createElement('div');
    card.className = 'team-card-style group';
    card.dataset.teamId = team.id;

    const captain = currentData.players.find(p => p.id === team.captainId);

    // Get team initial and color based on team name
    const teamColors = {
        'The Turkeys': { initial: 'T', color: 'bg-orange-600' },
        'The Gobblers': { initial: 'G', color: 'bg-amber-800' },
        'The Pilgrims': { initial: 'P', color: 'bg-orange-600' },
        'The Cranberries': { initial: 'C', color: 'bg-red-700' },
        'The Stuffings': { initial: 'S', color: 'bg-yellow-600' },
        'The Gravy Boats': { initial: 'G', color: 'bg-amber-800' }
    };

    const teamInfo = teamColors[team.name] || { initial: team.name.charAt(0), color: 'bg-gray-600' };

    // Mock W/L/T records - you can make this dynamic later
    const records = {
        'The Turkeys': { w: 3, l: 1, t: 0 },
        'The Gobblers': { w: 0, l: 4, t: 0 },
        'The Pilgrims': { w: 3, l: 1, t: 0 },
        'The Cranberries': { w: 2, l: 2, t: 0 },
        'The Stuffings': { w: 1, l: 3, t: 0 },
        'The Gravy Boats': { w: 0, l: 4, t: 0 }
    };

    const record = records[team.name] || { w: 0, l: 0, t: 0 };

    card.innerHTML = `
        <div class="flex items-center gap-6">
            <div class="team-logo-style ${teamInfo.color}">${teamInfo.initial}</div>
            <div>
                <h3 class="team-name-style">${team.name}</h3>
                <p class="team-captain-style">Captain: ${captain ? captain.name : 'TBD'}</p>
            </div>
        </div>
        <div class="team-stats-style">
            <div class="stat-item-style">
                <span class="stat-label-style">W</span>
                <span class="stat-value-style">${record.w}</span>
            </div>
            <div class="stat-item-style">
                <span class="stat-label-style">L</span>
                <span class="stat-value-style">${record.l}</span>
            </div>
            <div class="stat-item-style">
                <span class="stat-label-style">T</span>
                <span class="stat-value-style">${record.t}</span>
            </div>
        </div>
        ${isAdminMode ? `
        <div class="admin-controls" style="margin-left: 20px;">
            <button class="edit-team-btn admin-btn mr-2">Edit</button>
            <button class="delete-team-btn admin-btn">Delete</button>
        </div>
        ` : ''}
    `;

    if (isAdminMode) {
        setupTeamCardEditing(card, team);
    }

    return card;
}

// Setup team card editing for admin mode
function setupTeamCardEditing(card, team) {
    const nameEl = card.querySelector('.team-name');
    const deleteBtn = card.querySelector('.delete-team-btn');
    const editRosterBtn = card.querySelector('.edit-roster-btn');
    const removePlayerBtns = card.querySelectorAll('.remove-player');

    if (nameEl) {
        nameEl.addEventListener('blur', () => {
            team.name = nameEl.textContent.trim();
            saveToLocalStorage('teams', currentData.teams);
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete team ${team.name}?`)) {
                deleteTeam(team.id);
            }
        });
    }

    if (editRosterBtn) {
        editRosterBtn.addEventListener('click', () => {
            showEditRosterModal(team);
        });
    }

    removePlayerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const playerDiv = btn.parentElement;
            const playerId = parseInt(playerDiv.dataset.playerId);
            if (playerId && confirm('Remove this player from the team?')) {
                team.players = team.players.filter(pid => pid !== playerId);
                saveToLocalStorage('teams', currentData.teams);
                renderCurrentPage();
            }
        });
    });
}

// Delete team
function deleteTeam(teamId) {
    currentData.teams = currentData.teams.filter(t => t.id !== teamId);
    saveToLocalStorage('teams', currentData.teams);
    renderCurrentPage();
}

const HALL_OF_FAME_TABLES = [
    {
        key: 'mvp',
        source: 'awards',
        awardName: 'Most Valuable Player',
        bodyId: 'hof-mvp-body',
        columns: [
            { field: 'year', className: 'table-data-cell-style', type: 'number' },
            { field: 'playerName', className: 'table-player-cell-style' },
            { field: 'teamName', className: 'table-data-cell-style', placeholder: '—' }
        ]
    },
    {
        key: 'offensive',
        source: 'awards',
        awardName: 'Offensive Player of the Year',
        bodyId: 'hof-offensive-body',
        columns: [
            { field: 'year', className: 'table-data-cell-style', type: 'number' },
            { field: 'playerName', className: 'table-player-cell-style' },
            { field: 'teamName', className: 'table-data-cell-style', placeholder: '—' }
        ]
    },
    {
        key: 'defensive',
        source: 'awards',
        awardName: 'Defensive Player of the Year',
        bodyId: 'hof-defensive-body',
        columns: [
            { field: 'year', className: 'table-data-cell-style', type: 'number' },
            { field: 'playerName', className: 'table-player-cell-style' },
            { field: 'teamName', className: 'table-data-cell-style', placeholder: '—' }
        ]
    },
    {
        key: 'championships',
        source: 'championships',
        bodyId: 'hof-championships-body',
        columns: [
            { field: 'year', className: 'table-data-cell-style', type: 'number' },
            { field: 'teamName', className: 'table-player-cell-style' },
            { field: 'score', className: 'table-data-cell-style', placeholder: '—' }
        ]
    }
];

// Render history page
function renderHistoryPage() {
    HALL_OF_FAME_TABLES.forEach(config => renderHallOfFameTable(config));
}

function renderHallOfFameTable(config) {
    const tbody = document.getElementById(config.bodyId);
    if (!tbody) return;

    tbody.innerHTML = '';

    const sourceArray = currentData.history[config.source] || [];
    const entries = sourceArray
        .filter(entry => {
            if (config.source === 'awards') {
                return normalizeAwardName(entry.awardName) === config.awardName;
            }
            return true;
        })
        .sort((a, b) => (b.year || 0) - (a.year || 0));

    if (entries.length === 0) {
        const emptyRow = document.createElement('tr');
        const colspan = config.columns.length + (isAdminMode ? 1 : 0);
        emptyRow.innerHTML = `<td class="table-data-cell-style text-center" colspan="${colspan}">No entries yet.</td>`;
        tbody.appendChild(emptyRow);
        return;
    }

    entries.forEach(entry => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-white/5 transition-colors';
        row.dataset.entryId = entry.id;
        row.dataset.entryType = config.source;
        if (config.awardName) {
            row.dataset.awardName = config.awardName;
        }

        let rowHtml = '';
        config.columns.forEach(column => {
            const rawValue = entry[column.field];
            const displayValue = rawValue === undefined || rawValue === null || rawValue === '' ? (column.placeholder || '') : rawValue;
            const editable = isAdminMode;
            rowHtml += `
                <td class="${column.className}" ${editable ? 'contenteditable="true"' : ''} data-field="${column.field}" data-type="${column.type || 'text'}">${displayValue}</td>
            `;
        });

        if (isAdminMode) {
            rowHtml += `
                <td class="table-data-cell-style admin-only">
                    <button class="delete-history-btn admin-btn">Delete</button>
                </td>
            `;
        }

        row.innerHTML = rowHtml;

        if (isAdminMode) {
            setupHallOfFameRowEditing(row, entry, config);
        }

        tbody.appendChild(row);
    });
}

function setupHallOfFameRowEditing(row, entry, config) {
    const editableCells = row.querySelectorAll('[data-field]');
    editableCells.forEach(cell => {
        const columnConfig = config.columns.find(col => col.field === cell.dataset.field) || {};
        cell.addEventListener('blur', () => {
            if (updateHallOfFameEntry(entry, config, cell, columnConfig)) {
                saveToLocalStorage('history', currentData.history);
                renderHistoryPage();
            }
        });
    });

    const deleteBtn = row.querySelector('.delete-history-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this entry?')) {
                deleteHistoryItem(entry.id, config.source);
            }
        });
    }
}

function updateHallOfFameEntry(entry, config, cell, column = {}) {
    const field = cell.dataset.field;
    const type = cell.dataset.type || 'text';
    const text = cell.textContent.trim();

    if (type === 'number') {
        const parsed = parseInt(text, 10);
        if (Number.isNaN(parsed)) {
            cell.textContent = entry[field] ?? '';
            return false;
        }
        if (entry[field] === parsed) {
            return false;
        }
        entry[field] = parsed;
    } else {
        const placeholder = column.placeholder;
        const normalizedText = placeholder && text === placeholder ? '' : text;
        const newValue = normalizedText === '' ? undefined : normalizedText;
        const previousValue = entry[field] === undefined || entry[field] === null ? undefined : entry[field];
        if (previousValue === newValue) {
            return false;
        }
        if (newValue === undefined) {
            delete entry[field];
        } else {
            entry[field] = newValue;
        }
    }

    if (config.source === 'awards' && config.awardName) {
        entry.awardName = config.awardName;
    }

    return true;
}

function normalizeAwardName(name = '') {
    const normalized = name.toLowerCase().trim();
    switch (normalized) {
        case 'mvp':
        case 'most valuable player':
            return 'Most Valuable Player';
        case 'offensive player of the year':
        case 'opoy':
            return 'Offensive Player of the Year';
        case 'defensive player of the year':
        case 'dpoy':
            return 'Defensive Player of the Year';
        default:
            return name;
    }
}

// Delete history item
function deleteHistoryItem(itemId, type) {
    currentData.history[type] = currentData.history[type].filter(item => item.id !== itemId);
    saveToLocalStorage('history', currentData.history);
    renderHistoryPage();
}

// Setup admin mode
function setupAdminMode() {
    let adminSequence = '';
    const adminKeyword = 'kpfister44';

    document.addEventListener('keydown', (e) => {
        if (isAdminMode) return;

        adminSequence += e.key.toLowerCase();

        // Keep only the last characters equal to keyword length
        if (adminSequence.length > adminKeyword.length) {
            adminSequence = adminSequence.slice(-adminKeyword.length);
        }

        // Check if sequence matches admin keyword
        if (adminSequence === adminKeyword) {
            promptAdminPassword();
            adminSequence = '';
        }
    });

    // Setup admin bar buttons
    document.getElementById('export-data').addEventListener('click', exportData);
    document.getElementById('import-data').addEventListener('click', importData);
    document.getElementById('reset-data').addEventListener('click', resetData);
    document.getElementById('exit-admin').addEventListener('click', exitAdminMode);
}

// Prompt for admin password
function promptAdminPassword() {
    const password = prompt('Enter admin password:');
    if (password === currentData.settings.adminPassword) {
        enterAdminMode();
    } else if (password !== null) {
        alert('Incorrect password!');
    }
}

// Enter admin mode
function enterAdminMode() {
    isAdminMode = true;
    document.body.classList.add('admin-mode');
    document.getElementById('admin-bar').classList.remove('hidden');
    renderCurrentPage();
    console.log('Admin mode activated');
}

// Exit admin mode
function exitAdminMode() {
    isAdminMode = false;
    document.body.classList.remove('admin-mode');
    document.getElementById('admin-bar').classList.add('hidden');
    renderCurrentPage();
    console.log('Admin mode deactivated');
}

// Export all data as JSON
function exportData() {
    const dataToExport = {
        players: currentData.players,
        teams: currentData.teams,
        history: currentData.history,
        settings: currentData.settings,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `turkeybowl-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    console.log('Data exported');
}

// Import data from JSON file
function importData() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();

    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);

                if (confirm('Import data? This will overwrite current data.')) {
                    if (importedData.players) currentData.players = importedData.players;
                    if (importedData.teams) currentData.teams = importedData.teams;
                    if (importedData.history) currentData.history = importedData.history;
                    if (importedData.settings) currentData.settings = importedData.settings;

                    // Save to localStorage
                    saveToLocalStorage('players', currentData.players);
                    saveToLocalStorage('teams', currentData.teams);
                    saveToLocalStorage('history', currentData.history);
                    saveToLocalStorage('settings', currentData.settings);

                    renderCurrentPage();
                    alert('Data imported successfully!');
                }
            } catch (error) {
                alert('Error importing data: Invalid JSON file');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    };
}

// Reset data to defaults
function resetData() {
    if (confirm('Reset all data to defaults? This cannot be undone.')) {
        localStorage.removeItem('turkeybowl_players');
        localStorage.removeItem('turkeybowl_teams');
        localStorage.removeItem('turkeybowl_history');
        localStorage.removeItem('turkeybowl_settings');

        loadData();
        renderCurrentPage();
        alert('Data reset to defaults!');
    }
}
