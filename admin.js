// Admin functionality for CRUD operations
document.addEventListener('DOMContentLoaded', function() {
    setupAdminButtons();
    setupModal();
});

// Setup admin buttons
function setupAdminButtons() {
    // Player management
    const addPlayerBtn = document.getElementById('add-player');
    if (addPlayerBtn) {
        addPlayerBtn.addEventListener('click', () => showAddPlayerModal());
    }

    // Team management
    const addTeamBtn = document.getElementById('add-team');
    if (addTeamBtn) {
        addTeamBtn.addEventListener('click', () => showAddTeamModal());
    }

    // History management
    const addChampionshipBtn = document.getElementById('add-championship');
    if (addChampionshipBtn) {
        addChampionshipBtn.addEventListener('click', () => showAddChampionshipModal());
    }

    const hallOfFameButtons = [
        { id: 'add-mvp-award', awardName: 'Most Valuable Player' },
        { id: 'add-offensive-award', awardName: 'Offensive Player of the Year' },
        { id: 'add-defensive-award', awardName: 'Defensive Player of the Year' }
    ];

    hallOfFameButtons.forEach(({ id, awardName }) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => showAddAwardModal(awardName));
        }
    });
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Show modal
function showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    if (modalBody) {
        modalBody.innerHTML = `
            <h2>${title}</h2>
            ${content}
        `;
    }

    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
    }

    // Remove wide class from modal content
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.classList.remove('wide');
        modalContent.classList.remove('modal-player-detail');
    }
}

// Show Add Player Modal
function showAddPlayerModal() {
    const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K'];

    const content = `
        <form id="add-player-form">
            <div class="form-group">
                <label for="player-name">Name:</label>
                <input type="text" id="player-name" required>
            </div>
            <div class="form-group">
                <label for="player-nickname">Nickname:</label>
                <input type="text" id="player-nickname">
            </div>
            <div class="form-group">
                <label for="player-position">Position:</label>
                <select id="player-position" required>
                    ${positions.map(pos => `<option value="${pos}">${pos}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="player-bio">Bio:</label>
                <textarea id="player-bio" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="player-years">Years Played:</label>
                <input type="number" id="player-years" min="1" value="1">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Player</button>
            </div>
        </form>
    `;

    showModal('Add New Player', content);

    // Setup form submission
    const form = document.getElementById('add-player-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewPlayer();
        });
    }
}

// Add new player
function addNewPlayer() {
    const name = document.getElementById('player-name').value.trim();
    const nickname = document.getElementById('player-nickname').value.trim();
    const position = document.getElementById('player-position').value;
    const bio = document.getElementById('player-bio').value.trim();
    const yearsPlayed = parseInt(document.getElementById('player-years').value);

    if (!name || !position) {
        alert('Name and position are required!');
        return;
    }

    const newPlayer = {
        id: Math.max(...currentData.players.map(p => p.id), 0) + 1,
        name: name,
        nickname: nickname || name.split(' ')[0],
        position: position,
        bio: bio || `${position} player for the Turkey Bowl.`,
        photoPath: `images/players/player${Math.max(...currentData.players.map(p => p.id), 0) + 1}.jpg`,
        yearsPlayed: yearsPlayed,
        currentYear: true
    };

    currentData.players.push(newPlayer);
    saveToLocalStorage('players', currentData.players);

    closeModal();

    renderRosterPage();

    console.log('Player added:', newPlayer);
}

// Show Add Team Modal
function showAddTeamModal() {
    const availablePlayers = currentData.players.filter(p => p.currentYear);

    const content = `
        <form id="add-team-form">
            <div class="form-group">
                <label for="team-name">Team Name:</label>
                <input type="text" id="team-name" required>
            </div>
            <div class="form-group">
                <label for="team-captain">Captain:</label>
                <select id="team-captain" required>
                    <option value="">Select Captain</option>
                    ${availablePlayers.map(player =>
                        `<option value="${player.id}">${player.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Team Players:</label>
                <div class="team-player-selector">
                    <div class="player-column">
                        <h4>Available</h4>
                        <div class="player-list" id="available-team-players">
                            ${availablePlayers.map(player => `
                                <button type="button" class="player-chip" data-player-id="${player.id}">
                                    <span class="player-name">${player.name}</span>
                                    <span class="player-position">${player.position}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="player-actions">
                        <button type="button" class="btn btn-primary player-move-btn" data-action="add">Add →</button>
                        <button type="button" class="btn btn-secondary player-move-btn" data-action="remove">← Remove</button>
                    </div>
                    <div class="player-column">
                        <h4>Team Roster</h4>
                        <div class="player-list" id="selected-team-players"></div>
                    </div>
                </div>
            </div>
            <input type="hidden" id="team-player-selection">
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Team</button>
            </div>
        </form>
    `;

    showModal('Add New Team', content);

    const form = document.getElementById('add-team-form');
    if (form) {
        setupPlayerSelectionUI({
            availableContainerId: 'available-team-players',
            selectedContainerId: 'selected-team-players',
            hiddenInputId: 'team-player-selection',
            captainSelectId: 'team-captain'
        });

        const captainSelect = document.getElementById('team-captain');
        if (captainSelect) {
            captainSelect.addEventListener('change', () => {
                const selectedId = parseInt(captainSelect.value, 10);
                ensurePlayerInSelection(selectedId, 'team-player-selection');
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewTeam();
        });
    }
}

// Add new team
function addNewTeam() {
    const name = document.getElementById('team-name').value.trim();
    const captainId = parseInt(document.getElementById('team-captain').value);
    const selectedPlayers = getSelectedPlayersFromHidden('team-player-selection');

    if (!name || !captainId) {
        alert('Team name and captain are required!');
        return;
    }

    if (selectedPlayers.length === 0) {
        alert('Please select at least one player for the team!');
        return;
    }

    // Ensure captain is in the team
    if (!selectedPlayers.includes(captainId)) {
        selectedPlayers.push(captainId);
    }

    const newTeam = {
        id: Math.max(...currentData.teams.map(t => t.id), 0) + 1,
        name: name,
        captainId: captainId,
        logoPath: `images/teams/${name.toLowerCase().replace(/\s+/g, '-')}-logo.png`,
        year: currentData.settings.currentYear,
        players: selectedPlayers,
        record: { w: 0, l: 0, t: 0 }
    };

    currentData.teams.push(newTeam);
    saveToLocalStorage('teams', currentData.teams);

    closeModal();

    renderTeamsPage();

    console.log('Team added:', newTeam);
}

// Show Add Championship Modal
function showAddChampionshipModal() {
    const teams = currentData.teams;

    const content = `
        <form id="add-championship-form">
            <div class="form-group">
                <label for="championship-year">Year:</label>
                <input type="number" id="championship-year" min="2020" max="2030" value="${currentData.settings.currentYear}" required>
            </div>
            <div class="form-group">
                <label for="championship-team">Winning Team:</label>
                <select id="championship-team" required>
                    <option value="">Select Team</option>
                    ${teams.map(team =>
                        `<option value="${team.name}">${team.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="championship-score">Final Score (optional):</label>
                <input type="text" id="championship-score" placeholder="e.g., 28-21">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Championship</button>
            </div>
        </form>
    `;

    showModal('Add Championship', content);

    // Setup form submission
    const form = document.getElementById('add-championship-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewChampionship();
        });
    }
}

// Add new championship
function addNewChampionship() {
    const year = parseInt(document.getElementById('championship-year').value);
    const teamName = document.getElementById('championship-team').value;
    const score = document.getElementById('championship-score').value.trim();

    if (!year || !teamName) {
        alert('Year and team are required!');
        return;
    }

    const newChampionship = {
        id: Math.max(...currentData.history.championships.map(c => c.id), 0) + 1,
        year: year,
        teamName: teamName,
        winner: true,
        score: score || undefined
    };

    currentData.history.championships.unshift(newChampionship); // Add to beginning
    saveToLocalStorage('history', currentData.history);

    closeModal();

    renderHistoryPage();

    console.log('Championship added:', newChampionship);
}

// Show Add Award Modal
function showAddAwardModal(awardName) {
    const players = currentData.players;

    const content = `
        <form id="add-award-form" data-award-name="${awardName}">
            <input type="hidden" id="award-category" value="${awardName}">
            <div class="form-group">
                <label for="award-year">Year:</label>
                <input type="number" id="award-year" min="2000" max="2100" value="${currentData.settings.currentYear}" required>
            </div>
            <div class="form-group">
                <label for="award-player">Player:</label>
                <select id="award-player" required>
                    <option value="">Select Player</option>
                    ${players.map(player =>
                        `<option value="${player.id}">${player.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="award-team">Team:</label>
                <input type="text" id="award-team" placeholder="e.g., The Gobblers">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add ${awardName}</button>
            </div>
        </form>
    `;

    showModal(`Add ${awardName}`, content);

    const form = document.getElementById('add-award-form');
    if (form) {
        const playerSelect = document.getElementById('award-player');
        const teamInput = document.getElementById('award-team');

        if (playerSelect && teamInput) {
            playerSelect.addEventListener('change', () => {
                const playerId = parseInt(playerSelect.value, 10);
                if (!playerId) {
                    teamInput.value = '';
                    return;
                }

                const selectedPlayer = currentData.players.find(p => p.id === playerId);
                if (!selectedPlayer) {
                    teamInput.value = '';
                    return;
                }

                const playerTeam = currentData.teams.find(team => team.players.includes(playerId));
                teamInput.value = playerTeam ? playerTeam.name : '';
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewAward();
        });
    }
}

// Add new award
function addNewAward() {
    const year = parseInt(document.getElementById('award-year').value, 10);
    const awardName = document.getElementById('award-category').value;
    const playerId = parseInt(document.getElementById('award-player').value, 10);
    const teamName = document.getElementById('award-team').value.trim();

    if (!year || !awardName || !playerId) {
        alert('Year and player are required!');
        return;
    }

    const player = currentData.players.find(p => p.id === playerId);
    if (!player) {
        alert('Selected player could not be found.');
        return;
    }

    const playerName = player.name;

    const newAward = {
        id: Math.max(...currentData.history.awards.map(a => a.id), 0) + 1,
        year: year,
        awardName: awardName,
        playerName: playerName,
        teamName: teamName || undefined
    };

    currentData.history.awards.unshift(newAward);
    saveToLocalStorage('history', currentData.history);

    closeModal();

    renderHistoryPage();

    console.log('Award added:', newAward);
}

// Show Add Record Modal
function showAddRecordModal() {
    const players = currentData.players;

    const content = `
        <form id="add-record-form">
            <div class="form-group">
                <label for="record-year">Year:</label>
                <input type="number" id="record-year" min="2020" max="2030" value="${currentData.settings.currentYear}" required>
            </div>
            <div class="form-group">
                <label for="record-name">Record Name:</label>
                <input type="text" id="record-name" placeholder="e.g., Most Passing Yards (Single Game)" required>
            </div>
            <div class="form-group">
                <label for="record-value">Record Value:</label>
                <input type="text" id="record-value" placeholder="e.g., 312 yards, 4 touchdowns" required>
            </div>
            <div class="form-group">
                <label for="record-player">Player:</label>
                <select id="record-player" required>
                    <option value="">Select Player</option>
                    ${players.map(player =>
                        `<option value="${player.name}">${player.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Record</button>
            </div>
        </form>
    `;

    showModal('Add Record', content);

    // Setup form submission
    const form = document.getElementById('add-record-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewRecord();
        });
    }
}

// Add new record
function addNewRecord() {
    const year = parseInt(document.getElementById('record-year').value);
    const recordName = document.getElementById('record-name').value.trim();
    const recordValue = document.getElementById('record-value').value.trim();
    const playerName = document.getElementById('record-player').value;

    if (!year || !recordName || !recordValue || !playerName) {
        alert('All fields are required!');
        return;
    }

    const newRecord = {
        id: Math.max(...currentData.history.records.map(r => r.id), 0) + 1,
        year: year,
        recordName: recordName,
        recordValue: recordValue,
        playerName: playerName
    };

    currentData.history.records.unshift(newRecord); // Add to beginning
    saveToLocalStorage('history', currentData.history);

    closeModal();

    renderHistoryPage();

    console.log('Record added:', newRecord);
}

// Show Edit Roster Modal
function showEditRosterModal(team) {
    const availablePlayers = currentData.players.filter(p => p.currentYear);
    const currentPlayers = team.players;

    const content = `
        <form id="edit-roster-form">
            <div class="form-group">
                <label>Team: ${team.name}</label>
            </div>
            <div class="form-group">
                <label for="edit-team-captain">Captain:</label>
                <select id="edit-team-captain" required>
                    ${availablePlayers.map(player =>
                        `<option value="${player.id}" ${player.id === team.captainId ? 'selected' : ''}>${player.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Team Players:</label>
                <div class="team-player-selector">
                    <div class="player-column">
                        <h4>Available</h4>
                        <div class="player-list" id="available-edit-team-players">
                            ${availablePlayers.filter(player => !currentPlayers.includes(player.id)).map(player => `
                                <button type="button" class="player-chip" data-player-id="${player.id}">
                                    <span class="player-name">${player.name}</span>
                                    <span class="player-position">${player.position}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="player-actions">
                        <button type="button" class="btn btn-primary player-move-btn" data-action="add">Add →</button>
                        <button type="button" class="btn btn-secondary player-move-btn" data-action="remove">← Remove</button>
                    </div>
                    <div class="player-column">
                        <h4>Team Roster</h4>
                        <div class="player-list" id="selected-edit-team-players">
                            ${availablePlayers.filter(player => currentPlayers.includes(player.id)).map(player => `
                                <button type="button" class="player-chip selected" data-player-id="${player.id}">
                                    <span class="player-name">${player.name}</span>
                                    <span class="player-position">${player.position}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <input type="hidden" id="edit-team-player-selection" value="${currentPlayers.join(',')}">
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Update Roster</button>
            </div>
        </form>
    `;

    showModal('Edit Team Roster', content);

    // Make this modal wider
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.classList.add('wide');
    }

    const form = document.getElementById('edit-roster-form');
    if (form) {
        setupPlayerSelectionUI({
            availableContainerId: 'available-edit-team-players',
            selectedContainerId: 'selected-edit-team-players',
            hiddenInputId: 'edit-team-player-selection',
            captainSelectId: 'edit-team-captain'
        });

        const captainSelect = document.getElementById('edit-team-captain');
        if (captainSelect) {
            captainSelect.addEventListener('change', () => {
                const selectedId = parseInt(captainSelect.value, 10);
                ensurePlayerInSelection(selectedId, 'edit-team-player-selection');
            });
        }

        ensurePlayerInSelection(team.captainId, 'edit-team-player-selection');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            updateTeamRoster(team);
        });
    }
}

// Update team roster
function updateTeamRoster(team) {
    const captainId = parseInt(document.getElementById('edit-team-captain').value);
    const selectedPlayers = getSelectedPlayersFromHidden('edit-team-player-selection');

    if (!captainId) {
        alert('Captain is required!');
        return;
    }

    if (selectedPlayers.length === 0) {
        alert('Please select at least one player for the team!');
        return;
    }

    // Ensure captain is in the team
    if (!selectedPlayers.includes(captainId)) {
        selectedPlayers.push(captainId);
    }

    team.captainId = captainId;
    team.players = selectedPlayers;

    saveToLocalStorage('teams', currentData.teams);

    closeModal();

    renderTeamsPage();

    console.log('Team roster updated:', team);
}

// Setup dual-column player selection UI
function setupPlayerSelectionUI({ availableContainerId, selectedContainerId, hiddenInputId, captainSelectId }) {
    const availableContainer = document.getElementById(availableContainerId);
    const selectedContainer = document.getElementById(selectedContainerId);
    const hiddenInput = document.getElementById(hiddenInputId);
    if (!availableContainer || !selectedContainer || !hiddenInput) {
        return;
    }

    const form = hiddenInput.closest('form');
    hiddenInput.dataset.availableContainer = availableContainerId;
    hiddenInput.dataset.selectedContainer = selectedContainerId;
    if (captainSelectId) {
        hiddenInput.dataset.captainSelect = captainSelectId;
    }

    function getCurrentCaptainId() {
        if (!captainSelectId) return null;
        const selectEl = document.getElementById(captainSelectId);
        if (!selectEl) return null;
        const id = parseInt(selectEl.value, 10);
        return Number.isNaN(id) ? null : id;
    }

    function toggleChipActive(chip) {
        chip.classList.toggle('active');
    }

    function attachChipClick(container) {
        container.addEventListener('click', (event) => {
            const chip = event.target.closest('.player-chip');
            if (!chip) return;
            event.preventDefault();
            toggleChipActive(chip);
        });

        container.addEventListener('dblclick', (event) => {
            const chip = event.target.closest('.player-chip');
            if (!chip) return;
            event.preventDefault();
            chip.classList.add('active');
            if (container === availableContainer) {
                moveChips(availableContainer, selectedContainer, true);
            } else {
                moveChips(selectedContainer, availableContainer, false);
                const captainId = getCurrentCaptainId();
                if (captainId) {
                    ensurePlayerInSelection(captainId, hiddenInputId);
                }
            }
        });
    }

    function moveChips(source, target, markAsSelected) {
        const chipsToMove = Array.from(source.querySelectorAll('.player-chip.active'));
        if (chipsToMove.length === 0) {
            return;
        }

        chipsToMove.forEach(chip => {
            chip.classList.remove('active');
            if (markAsSelected) {
                chip.classList.add('selected');
            } else {
                chip.classList.remove('selected');
            }
            target.appendChild(chip);
        });

        updateHiddenSelectionFromContainers(hiddenInput);
    }

    attachChipClick(availableContainer);
    attachChipClick(selectedContainer);

    if (form) {
        const moveButtons = form.querySelectorAll('.player-move-btn');
        moveButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const action = button.dataset.action;
                if (action === 'add') {
                    moveChips(availableContainer, selectedContainer, true);
                } else if (action === 'remove') {
                    moveChips(selectedContainer, availableContainer, false);
                    const captainId = getCurrentCaptainId();
                    if (captainId) {
                        ensurePlayerInSelection(captainId, hiddenInputId);
                    }
                }
            });
        });
    }

    updateHiddenSelectionFromContainers(hiddenInput);

    const initialCaptain = getCurrentCaptainId();
    if (initialCaptain) {
        ensurePlayerInSelection(initialCaptain, hiddenInputId);
    }
}

// Read selected players stored in hidden inputs
function getSelectedPlayersFromHidden(inputId) {
    const hiddenInput = document.getElementById(inputId);
    if (!hiddenInput) {
        return [];
    }

    const value = hiddenInput.value.trim();
    if (!value) {
        return [];
    }

    return value.split(',').map(id => parseInt(id, 10)).filter(id => !Number.isNaN(id));
}

function updateHiddenSelectionFromContainers(hiddenInput) {
    if (!hiddenInput) return;
    const selectedContainerId = hiddenInput.dataset.selectedContainer;
    const selectedContainer = selectedContainerId ? document.getElementById(selectedContainerId) : null;
    if (!selectedContainer) {
        hiddenInput.value = '';
        return;
    }

    const ids = Array.from(selectedContainer.querySelectorAll('.player-chip')).map(chip => parseInt(chip.dataset.playerId, 10)).filter(id => !Number.isNaN(id));
    hiddenInput.value = ids.join(',');
}

function ensurePlayerInSelection(playerId, hiddenInputId) {
    if (!playerId) return;
    const hiddenInput = document.getElementById(hiddenInputId);
    if (!hiddenInput) return;

    const selectedContainerId = hiddenInput.dataset.selectedContainer;
    const availableContainerId = hiddenInput.dataset.availableContainer;
    if (!selectedContainerId || !availableContainerId) return;
    const selectedContainer = selectedContainerId ? document.getElementById(selectedContainerId) : null;
    const availableContainer = availableContainerId ? document.getElementById(availableContainerId) : null;
    if (!selectedContainer || !availableContainer) return;

    const alreadySelected = Array.from(selectedContainer.querySelectorAll('.player-chip')).some(chip => parseInt(chip.dataset.playerId, 10) === playerId);
    if (alreadySelected) {
        return;
    }

    const chip = availableContainer.querySelector(`.player-chip[data-player-id="${playerId}"]`);
    if (!chip) {
        return;
    }

    chip.classList.remove('active');
    chip.classList.add('selected');
    selectedContainer.appendChild(chip);
    updateHiddenSelectionFromContainers(hiddenInput);
}

// Admin utility functions
function getNextPlayerId() {
    return Math.max(...currentData.players.map(p => p.id), 0) + 1;
}

function getNextTeamId() {
    return Math.max(...currentData.teams.map(t => t.id), 0) + 1;
}

function getNextHistoryId(type) {
    if (!currentData.history[type] || currentData.history[type].length === 0) {
        return 1;
    }
    return Math.max(...currentData.history[type].map(item => item.id), 0) + 1;
}

// Admin validation functions
function validatePlayerData(playerData) {
    const errors = [];

    if (!playerData.name || playerData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!playerData.position) {
        errors.push('Position is required');
    }

    if (playerData.yearsPlayed < 1) {
        errors.push('Years played must be at least 1');
    }

    return errors;
}

function validateTeamData(teamData) {
    const errors = [];

    if (!teamData.name || teamData.name.trim().length < 2) {
        errors.push('Team name must be at least 2 characters long');
    }

    if (!teamData.captainId) {
        errors.push('Captain is required');
    }

    if (!teamData.players || teamData.players.length === 0) {
        errors.push('Team must have at least one player');
    }

    return errors;
}

// Admin helper functions for data management
function removePlayerFromAllTeams(playerId) {
    currentData.teams.forEach(team => {
        team.players = team.players.filter(pid => pid !== playerId);

        // If captain was removed, assign new captain
        if (team.captainId === playerId && team.players.length > 0) {
            team.captainId = team.players[0];
        }
    });

    // Remove teams with no players
    currentData.teams = currentData.teams.filter(team => team.players.length > 0);
}

function updatePlayerReferences(oldId, newId) {
    currentData.teams.forEach(team => {
        // Update player list
        const playerIndex = team.players.indexOf(oldId);
        if (playerIndex !== -1) {
            team.players[playerIndex] = newId;
        }

        // Update captain reference
        if (team.captainId === oldId) {
            team.captainId = newId;
        }
    });
}
