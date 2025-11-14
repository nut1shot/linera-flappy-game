/**
 * TournamentLeaderboardModal Component
 * Displays detailed tournament leaderboard with rankings and player stats
 */
export class TournamentLeaderboardModal {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.currentTournamentId = null;
    this.onJoinCallback = null;
    this.onRefreshCallback = null;
  }

  /**
   * Create the tournament leaderboard modal HTML structure
   * @returns {HTMLElement} The modal element
   */
  create() {
    const modal = document.createElement('div');
    modal.id = 'tournament-leaderboard-modal';
    modal.className = 'tournament-leaderboard-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="tournament-leaderboard-content">
        <div class="tournament-leaderboard-header">
          <h2 id="tournament-leaderboard-title">Tournament Leaderboard</h2>
          <button id="close-tournament-leaderboard" class="close-modal-btn">✕</button>
        </div>

        <div class="tournament-leaderboard-info">
          <div class="tournament-meta-info">
            <div class="meta-item">
              <span class="meta-label">Tournament:</span>
              <span id="modal-tournament-name" class="meta-value">Summer Championship</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Status:</span>
              <span id="modal-tournament-status" class="meta-value status-active">Active</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Players:</span>
              <span id="modal-tournament-players" class="meta-value">0</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Time Left:</span>
              <span id="modal-tournament-time-left" class="meta-value">-</span>
            </div>
          </div>
        </div>

        <div class="tournament-leaderboard-controls">
          <div class="leaderboard-actions">
            <button id="join-tournament-from-modal-btn" class="join-tournament-btn">
              JOIN TOURNAMENT
            </button>
            <button id="refresh-tournament-leaderboard" class="refresh-leaderboard-btn">
              ↻ Refresh
            </button>
          </div>
        </div>

        <div class="tournament-leaderboard-table">
          <div class="leaderboard-header">
            <div class="header-rank">#</div>
            <div class="header-player">Player</div>
            <div class="header-score">Best Score</div>
          </div>

          <div id="tournament-leaderboard-entries" class="leaderboard-entries">
            <div class="leaderboard-loading">
              <div class="loading-spinner"></div>
              <div class="loading-text">Loading tournament leaderboard...</div>
            </div>
          </div>
        </div>

        <div class="tournament-leaderboard-footer">
          <div class="my-position" id="my-tournament-position" style="display: none;">
            <span class="position-label">Your Position:</span>
            <span class="position-rank">#-</span>
            <span class="position-score">0 points</span>
          </div>

          <div class="modal-actions">
            <button id="close-tournament-leaderboard-footer" class="modal-action-btn secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    this.element = modal;
    this.attachEventListeners();
    return modal;
  }

  /**
   * Attach event listeners to modal elements
   */
  attachEventListeners() {
    if (!this.element) return;

    // Close button handlers
    const closeBtn = this.element.querySelector('#close-tournament-leaderboard');
    const closeFooterBtn = this.element.querySelector('#close-tournament-leaderboard-footer');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    if (closeFooterBtn) {
      closeFooterBtn.addEventListener('click', () => this.hide());
    }

    // Join tournament button
    const joinBtn = this.element.querySelector('#join-tournament-from-modal-btn');
    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        console.log('Join button clicked');
        console.log('onJoinCallback:', this.onJoinCallback);
        console.log('currentTournamentId:', this.currentTournamentId);
        if (this.onJoinCallback && this.currentTournamentId) {
          this.onJoinCallback(this.currentTournamentId);
        } else {
          console.warn('Join callback or tournament ID missing');
        }
      });
    }

    // Refresh button
    const refreshBtn = this.element.querySelector('#refresh-tournament-leaderboard');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        console.log('Refresh button clicked');
        console.log('onRefreshCallback:', this.onRefreshCallback);
        console.log('currentTournamentId:', this.currentTournamentId);
        if (this.onRefreshCallback && this.currentTournamentId) {
          this.onRefreshCallback(this.currentTournamentId);
        } else {
          console.warn('Refresh callback or tournament ID missing');
        }
      });
    }

    // Close on background click
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.hide();
      }
    });
  }

  /**
   * Show the tournament leaderboard modal
   * @param {Object} options - Modal options
   * @param {string} options.tournamentId - Tournament ID
   * @param {string} options.tournamentName - Tournament name
   * @param {string} options.status - Tournament status
   * @param {number} options.playerCount - Number of players
   * @param {string} options.timeLeft - Time remaining
   * @param {Function} options.onJoin - Callback when join is clicked
   * @param {Function} options.onRefresh - Callback when refresh is clicked
   */
  show(options = {}) {
    if (!this.element) {
      const modal = this.create();
      document.body.appendChild(modal);
    }

    this.currentTournamentId = options.tournamentId;
    this.onJoinCallback = options.onJoin;
    this.onRefreshCallback = options.onRefresh;

    // Update modal info
    if (options.tournamentName) {
      this.setTournamentName(options.tournamentName);
    }
    if (options.status) {
      this.setStatus(options.status);
    }
    if (options.playerCount !== undefined) {
      this.setPlayerCount(options.playerCount);
    }
    if (options.timeLeft) {
      this.setTimeLeft(options.timeLeft);
    }

    this.element.style.display = 'flex';
    this.isVisible = true;
  }

  /**
   * Hide the modal
   */
  hide() {
    if (!this.element) return;

    this.element.style.display = 'none';
    this.isVisible = false;
  }

  /**
   * Set tournament name
   * @param {string} name - Tournament name
   */
  setTournamentName(name) {
    if (!this.element) return;

    const nameEl = this.element.querySelector('#modal-tournament-name');
    if (nameEl) {
      nameEl.textContent = name;
    }
  }

  /**
   * Set tournament status
   * @param {string} status - Status (active, ended, etc.)
   */
  setStatus(status) {
    if (!this.element) return;

    const statusEl = this.element.querySelector('#modal-tournament-status');
    if (statusEl) {
      statusEl.textContent = status;
      statusEl.className = 'meta-value';

      if (status.toLowerCase() === 'active') {
        statusEl.classList.add('status-active');
      } else if (status.toLowerCase().includes('ending')) {
        statusEl.classList.add('status-ending-soon');
      } else if (status.toLowerCase() === 'ended') {
        statusEl.classList.add('status-ended');
      }
    }
  }

  /**
   * Set player count
   * @param {number} count - Number of players
   */
  setPlayerCount(count) {
    if (!this.element) return;

    const countEl = this.element.querySelector('#modal-tournament-players');
    if (countEl) {
      countEl.textContent = count.toString();
    }
  }

  /**
   * Set time left
   * @param {string} timeLeft - Time remaining string
   */
  setTimeLeft(timeLeft) {
    if (!this.element) return;

    const timeEl = this.element.querySelector('#modal-tournament-time-left');
    if (timeEl) {
      timeEl.textContent = timeLeft;
    }
  }

  /**
   * Set leaderboard entries
   * @param {Array} entries - Array of leaderboard entries
   * @param {string} currentPlayerName - Current player's name for highlighting
   */
  setLeaderboardEntries(entries, currentPlayerName = null) {
    if (!this.element) return;

    const container = this.element.querySelector('#tournament-leaderboard-entries');
    if (!container) return;

    if (!entries || entries.length === 0) {
      container.innerHTML = '<div class="leaderboard-loading"><div class="loading-text">No entries yet</div></div>';
      return;
    }

    container.innerHTML = entries.map((entry, index) => {
      const rank = index + 1;
      const isCurrentPlayer = currentPlayerName && entry.playerName === currentPlayerName;
      const rankClass = rank <= 3 ? `rank-${rank}` : '';
      const currentPlayerClass = isCurrentPlayer ? 'current-player' : '';

      return `
        <div class="tournament-leaderboard-entry ${rankClass} ${currentPlayerClass}">
          <div class="entry-rank">${rank}</div>
          <div class="entry-player">
            <span class="entry-player-name">${entry.playerName}</span>
            ${entry.badge ? `<span class="entry-player-badge">${entry.badge}</span>` : ''}
          </div>
          <div class="entry-score">${entry.score}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (!this.element) return;

    const container = this.element.querySelector('#tournament-leaderboard-entries');
    if (container) {
      container.innerHTML = `
        <div class="leaderboard-loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">Loading tournament leaderboard...</div>
        </div>
      `;
    }
  }

  /**
   * Set current player position
   * @param {number} rank - Player's rank
   * @param {number} score - Player's score
   */
  setPlayerPosition(rank, score) {
    if (!this.element) return;

    const positionEl = this.element.querySelector('#my-tournament-position');
    if (!positionEl) return;

    if (rank && score !== undefined) {
      const rankSpan = positionEl.querySelector('.position-rank');
      const scoreSpan = positionEl.querySelector('.position-score');

      if (rankSpan) rankSpan.textContent = `#${rank}`;
      if (scoreSpan) scoreSpan.textContent = `${score} points`;

      positionEl.style.display = 'flex';
    } else {
      positionEl.style.display = 'none';
    }
  }

  /**
   * Show/hide join button
   * @param {boolean} show - Whether to show the button
   */
  setJoinButtonVisible(show) {
    if (!this.element) return;

    const joinBtn = this.element.querySelector('#join-tournament-from-modal-btn');
    if (joinBtn) {
      joinBtn.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * Destroy the modal
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.isVisible = false;
    this.currentTournamentId = null;
    this.onJoinCallback = null;
    this.onRefreshCallback = null;
  }
}

// Export singleton instance for convenience
export const globalTournamentLeaderboardModal = new TournamentLeaderboardModal();
