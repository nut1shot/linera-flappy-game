/**
 * TournamentList Component
 * Displays available tournaments with filtering and actions
 */
export class TournamentList {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.tournaments = [];
    this.isAdmin = false;
    this.onCreateCallback = null;
    this.onBackCallback = null;
    this.onJoinCallback = null;
    this.onViewCallback = null;
  }

  /**
   * Create the tournament list HTML structure
   * @returns {HTMLElement} The list element
   */
  create() {
    const container = document.createElement('div');
    container.id = 'tournament-screen';
    container.className = 'tournament-list';
    container.style.display = 'none';

    container.innerHTML = `
      <h2>Available Tournaments</h2>

      <div id="tournament-list" class="tournament-list-container">
        <!-- Tournaments will be populated here -->
      </div>

      <div class="tournament-actions">
        <button id="create-tournament-btn" class="admin-only create-tournament-btn" style="display: none;">
          CREATE TOURNAMENT
        </button>
        <button id="back-to-mode-btn" class="back-button">
          ← BACK TO MODES
        </button>
      </div>
    `;

    this.element = container;
    this.attachEventListeners();
    return container;
  }

  /**
   * Attach event listeners to list elements
   */
  attachEventListeners() {
    if (!this.element) return;

    // Create tournament button
    const createBtn = this.element.querySelector('#create-tournament-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        if (this.onCreateCallback) {
          this.onCreateCallback();
        }
      });
    }

    // Back button
    const backBtn = this.element.querySelector('#back-to-mode-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.onBackCallback) {
          this.onBackCallback();
        }
      });
    }
  }

  /**
   * Show the tournament list
   * @param {Object} options - Display options
   * @param {boolean} options.isAdmin - Whether user is admin
   * @param {Function} options.onCreate - Callback when create is clicked
   * @param {Function} options.onBack - Callback when back is clicked
   * @param {Function} options.onJoin - Callback when join is clicked
   * @param {Function} options.onView - Callback when view is clicked
   */
  show(options = {}) {
    if (!this.element) {
      const container = this.create();
      document.body.appendChild(container);
    }

    this.isAdmin = options.isAdmin || false;
    this.onCreateCallback = options.onCreate;
    this.onBackCallback = options.onBack;
    this.onJoinCallback = options.onJoin;
    this.onViewCallback = options.onView;

    // Show/hide create button based on admin status
    const createBtn = this.element.querySelector('#create-tournament-btn');
    if (createBtn) {
      createBtn.style.display = this.isAdmin ? 'inline-block' : 'none';
    }

    this.element.style.display = 'flex';
    this.isVisible = true;
  }

  /**
   * Hide the list
   */
  hide() {
    if (!this.element) return;

    this.element.style.display = 'none';
    this.isVisible = false;
  }

  /**
   * Set tournaments to display
   * @param {Array} tournaments - Array of tournament objects
   */
  setTournaments(tournaments) {
    if (!this.element) return;

    this.tournaments = tournaments || [];
    const container = this.element.querySelector('#tournament-list');
    if (!container) return;

    if (this.tournaments.length === 0) {
      container.innerHTML = '<div class="loading">No tournaments available</div>';
      return;
    }

    container.innerHTML = this.tournaments.map(tournament =>
      this.createTournamentCard(tournament)
    ).join('');

    // Attach event listeners to tournament cards
    this.attachTournamentCardListeners();
  }

  /**
   * Create tournament card HTML
   * @param {Object} tournament - Tournament data
   * @returns {string} HTML string
   */
  createTournamentCard(tournament) {
    const statusClass = tournament.status?.toLowerCase() || '';
    const pinnedClass = tournament.pinned ? 'pinned' : '';
    const endingSoonClass = tournament.endingSoon ? 'ending-soon' : '';

    return `
      <div class="tournament-card ${statusClass} ${pinnedClass} ${endingSoonClass}" data-tournament-id="${tournament.id}">
        ${this.isAdmin ? this.createAdminControls(tournament) : ''}

        <h3 class="tournament-name">${tournament.name}</h3>

        <div class="tournament-meta">
          <div class="info-item">
            <span class="label">Status:</span>
            <span class="value">${tournament.status}</span>
          </div>
          <div class="info-item">
            <span class="label">Players:</span>
            <span class="value">${tournament.playerCount || 0}</span>
          </div>
          <div class="info-item">
            <span class="label">Start:</span>
            <span class="value">${tournament.startDate || 'TBD'}</span>
          </div>
          <div class="info-item">
            <span class="label">End:</span>
            <span class="value">${tournament.endDate || 'TBD'}</span>
          </div>
        </div>

        ${tournament.description ? `<p class="tournament-description">${tournament.description}</p>` : ''}

        <div class="tournament-card-actions">
          <button class="tournament-action-btn join-btn" data-action="join" data-id="${tournament.id}">
            JOIN
          </button>
          <button class="tournament-action-btn view-btn" data-action="view" data-id="${tournament.id}">
            VIEW LEADERBOARD
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Create admin controls HTML
   * @param {Object} tournament - Tournament data
   * @returns {string} HTML string
   */
  createAdminControls(tournament) {
    const isPinned = tournament.pinned ? 'pinned' : '';
    return `
      <div class="tournament-admin-controls">
        <button class="admin-icon-btn pin-icon-btn ${isPinned}" data-action="pin" data-id="${tournament.id}" title="Pin Tournament">
          📌
        </button>
        <button class="admin-icon-btn edit-icon-btn" data-action="edit" data-id="${tournament.id}" title="Edit Tournament">
          ✏️
        </button>
        <button class="admin-icon-btn delete-icon-btn" data-action="delete" data-id="${tournament.id}" title="Delete Tournament">
          🗑️
        </button>
      </div>
    `;
  }

  /**
   * Attach event listeners to tournament card buttons
   */
  attachTournamentCardListeners() {
    if (!this.element) return;

    const container = this.element.querySelector('#tournament-list');
    if (!container) return;

    // Use event delegation for all buttons
    container.addEventListener('click', (e) => {
      const button = e.target.closest('button[data-action]');
      if (!button) return;

      const action = button.dataset.action;
      const tournamentId = button.dataset.id;

      switch (action) {
        case 'join':
          if (this.onJoinCallback) {
            this.onJoinCallback(tournamentId);
          }
          break;
        case 'view':
          if (this.onViewCallback) {
            this.onViewCallback(tournamentId);
          }
          break;
        case 'pin':
        case 'edit':
        case 'delete':
          // Admin actions - can be handled with additional callbacks if needed
          console.log(`Admin action: ${action} on tournament ${tournamentId}`);
          break;
      }
    });
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (!this.element) return;

    const container = this.element.querySelector('#tournament-list');
    if (container) {
      container.innerHTML = '<div class="loading">Loading tournaments...</div>';
    }
  }

  /**
   * Get tournament by ID
   * @param {string} tournamentId - Tournament ID
   * @returns {Object|null} Tournament object or null
   */
  getTournament(tournamentId) {
    return this.tournaments.find(t => t.id === tournamentId) || null;
  }

  /**
   * Update single tournament
   * @param {string} tournamentId - Tournament ID
   * @param {Object} updates - Updated tournament data
   */
  updateTournament(tournamentId, updates) {
    const index = this.tournaments.findIndex(t => t.id === tournamentId);
    if (index !== -1) {
      this.tournaments[index] = { ...this.tournaments[index], ...updates };
      this.setTournaments(this.tournaments);
    }
  }

  /**
   * Remove tournament
   * @param {string} tournamentId - Tournament ID
   */
  removeTournament(tournamentId) {
    this.tournaments = this.tournaments.filter(t => t.id !== tournamentId);
    this.setTournaments(this.tournaments);
  }

  /**
   * Destroy the component
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.isVisible = false;
    this.tournaments = [];
    this.onCreateCallback = null;
    this.onBackCallback = null;
    this.onJoinCallback = null;
    this.onViewCallback = null;
  }
}

// Export singleton instance for convenience
export const globalTournamentList = new TournamentList();
