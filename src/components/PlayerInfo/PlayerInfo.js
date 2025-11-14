/**
 * PlayerInfo Component
 * Displays current player information and stats
 */
export class PlayerInfo {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.onLogoutCallback = null;
  }

  /**
   * Create the player info HTML structure
   * @returns {HTMLElement} The player info element
   */
  create() {
    const container = document.createElement('div');
    container.className = 'player-info';

    container.innerHTML = `
      <h3>Player Info</h3>
      <div class="info-item">
        <span class="label">Name:</span>
        <span id="player-name" class="value">Loading...</span>
      </div>
      <div class="info-item">
        <span class="label">Role:</span>
        <span id="player-role" class="value">Player</span>
      </div>
      <div class="info-item">
        <span class="label">Best:</span>
        <span id="player-best" class="value">0</span>
      </div>
      <div class="info-item">
        <span class="label">Rank:</span>
        <span id="player-rank" class="value">-</span>
      </div>

      <div class="player-actions">
        <button id="logout-btn" class="logout-button">🚪 Logout</button>
      </div>
    `;

    this.element = container;
    this.attachEventListeners();
    return container;
  }

  /**
   * Attach event listeners to player info elements
   */
  attachEventListeners() {
    if (!this.element) return;

    // Logout button
    const logoutBtn = this.element.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (this.onLogoutCallback) {
          this.onLogoutCallback();
        }
      });
    }
  }

  /**
   * Show the player info panel
   * @param {Function} onLogout - Callback when logout is clicked
   */
  show(onLogout) {
    if (!this.element) {
      const container = this.create();
      // Component needs to be appended by parent
      return container;
    }

    this.onLogoutCallback = onLogout;
    this.element.style.display = 'block';
    this.isVisible = true;
  }

  /**
   * Hide the player info panel
   */
  hide() {
    if (!this.element) return;

    this.element.style.display = 'none';
    this.isVisible = false;
  }

  /**
   * Set player name
   * @param {string} name - Player name
   */
  setPlayerName(name) {
    if (!this.element) return;

    const nameEl = this.element.querySelector('#player-name');
    if (nameEl) {
      nameEl.textContent = name;
    }
  }

  /**
   * Set player role
   * @param {string} role - Player role (PLAYER, ADMIN, etc.)
   */
  setPlayerRole(role) {
    if (!this.element) return;

    const roleEl = this.element.querySelector('#player-role');
    if (roleEl) {
      roleEl.textContent = role;
      roleEl.className = `value ${role}`;
    }
  }

  /**
   * Set player best score
   * @param {number} score - Best score
   */
  setPlayerBest(score) {
    if (!this.element) return;

    const bestEl = this.element.querySelector('#player-best');
    if (bestEl) {
      bestEl.textContent = score.toString();
    }
  }

  /**
   * Set player rank
   * @param {number|string} rank - Player rank or '-' if no rank
   */
  setPlayerRank(rank) {
    if (!this.element) return;

    const rankEl = this.element.querySelector('#player-rank');
    if (rankEl) {
      rankEl.textContent = rank !== null && rank !== undefined ? `#${rank}` : '-';
    }
  }

  /**
   * Set all player data at once
   * @param {Object} data - Player data
   * @param {string} data.name - Player name
   * @param {string} data.role - Player role
   * @param {number} data.bestScore - Best score
   * @param {number|string} data.rank - Player rank
   */
  setPlayerData(data) {
    if (data.name !== undefined) {
      this.setPlayerName(data.name);
    }
    if (data.role !== undefined) {
      this.setPlayerRole(data.role);
    }
    if (data.bestScore !== undefined) {
      this.setPlayerBest(data.bestScore);
    }
    if (data.rank !== undefined) {
      this.setPlayerRank(data.rank);
    }
  }

  /**
   * Set loading state
   * @param {boolean} loading - Whether component is loading
   */
  setLoading(loading) {
    if (!this.element) return;

    const nameEl = this.element.querySelector('#player-name');
    if (nameEl) {
      nameEl.textContent = loading ? 'Loading...' : nameEl.textContent;
    }
  }

  /**
   * Get the component element (useful for adding to parent)
   * @returns {HTMLElement|null} The component element
   */
  getElement() {
    if (!this.element) {
      return this.create();
    }
    return this.element;
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
    this.onLogoutCallback = null;
  }
}

// Export singleton instance for convenience
export const globalPlayerInfo = new PlayerInfo();
