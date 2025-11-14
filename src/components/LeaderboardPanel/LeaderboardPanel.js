/**
 * LeaderboardPanel Component
 * Displays top players leaderboard with refresh capability
 */
export class LeaderboardPanel {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.entries = [];
    this.onRefreshCallback = null;
  }

  /**
   * Create the leaderboard panel HTML structure
   * @returns {HTMLElement} The leaderboard element
   */
  create() {
    const container = document.createElement('div');
    container.className = 'leaderboard-panel';

    container.innerHTML = `
      <h3 id="leaderboard-title">Top Players</h3>
      <div id="leaderboard-entries" class="leaderboard-list">
        <div class="loading">Loading...</div>
      </div>
      <button id="refreshBtn" class="refresh-button">↻ Refresh</button>
    `;

    this.element = container;
    this.attachEventListeners();
    return container;
  }

  /**
   * Attach event listeners to leaderboard elements
   */
  attachEventListeners() {
    if (!this.element) return;

    // Refresh button
    const refreshBtn = this.element.querySelector('#refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (this.onRefreshCallback) {
          this.onRefreshCallback();
        }
      });
    }
  }

  /**
   * Show the leaderboard panel
   * @param {Function} onRefresh - Callback when refresh is clicked
   */
  show(onRefresh) {
    if (!this.element) {
      const container = this.create();
      // Component needs to be appended by parent
      return container;
    }

    this.onRefreshCallback = onRefresh;
    this.element.style.display = 'block';
    this.isVisible = true;
  }

  /**
   * Hide the leaderboard panel
   */
  hide() {
    if (!this.element) return;

    this.element.style.display = 'none';
    this.isVisible = false;
  }

  /**
   * Set leaderboard title
   * @param {string} title - Title text
   */
  setTitle(title) {
    if (!this.element) return;

    const titleEl = this.element.querySelector('#leaderboard-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * Set leaderboard entries
   * @param {Array} entries - Array of leaderboard entries
   * @param {string} currentPlayerName - Current player's name for highlighting
   */
  setEntries(entries, currentPlayerName = null) {
    if (!this.element) return;

    this.entries = entries || [];
    const container = this.element.querySelector('#leaderboard-entries');
    if (!container) return;

    if (this.entries.length === 0) {
      container.innerHTML = '<div class="loading">No entries yet</div>';
      return;
    }

    container.innerHTML = this.entries.map((entry, index) => {
      const rank = index + 1;
      const isCurrentPlayer = currentPlayerName && entry.playerName === currentPlayerName;

      let rankClass = '';
      if (rank === 1) rankClass = 'gold';
      else if (rank === 2) rankClass = 'silver';
      else if (rank === 3) rankClass = 'bronze';

      const currentPlayerClass = isCurrentPlayer ? 'current-player' : '';

      return `
        <div class="leaderboard-entry ${rankClass} ${currentPlayerClass}">
          <div class="rank">${rank}</div>
          <div class="player-name">${entry.playerName}</div>
          <div class="score">${entry.score}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (!this.element) return;

    const container = this.element.querySelector('#leaderboard-entries');
    if (container) {
      container.innerHTML = '<div class="loading">Loading...</div>';
    }
  }

  /**
   * Add a single entry to the leaderboard
   * @param {Object} entry - Leaderboard entry
   * @param {string} currentPlayerName - Current player's name
   */
  addEntry(entry, currentPlayerName = null) {
    this.entries.push(entry);
    // Sort by score descending
    this.entries.sort((a, b) => b.score - a.score);
    // Limit to top entries (e.g., top 10)
    this.entries = this.entries.slice(0, 10);
    this.setEntries(this.entries, currentPlayerName);
  }

  /**
   * Update an entry in the leaderboard
   * @param {string} playerName - Player name to update
   * @param {Object} updates - Updated data
   */
  updateEntry(playerName, updates) {
    const index = this.entries.findIndex(e => e.playerName === playerName);
    if (index !== -1) {
      this.entries[index] = { ...this.entries[index], ...updates };
      this.setEntries(this.entries);
    }
  }

  /**
   * Clear all entries
   */
  clearEntries() {
    this.entries = [];
    if (!this.element) return;

    const container = this.element.querySelector('#leaderboard-entries');
    if (container) {
      container.innerHTML = '<div class="loading">No entries</div>';
    }
  }

  /**
   * Set refresh button enabled state
   * @param {boolean} enabled - Whether button should be enabled
   */
  setRefreshEnabled(enabled) {
    if (!this.element) return;

    const refreshBtn = this.element.querySelector('#refreshBtn');
    if (refreshBtn) {
      refreshBtn.disabled = !enabled;
      refreshBtn.style.opacity = enabled ? '1' : '0.5';
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
    this.entries = [];
    this.onRefreshCallback = null;
  }
}

// Export singleton instance for convenience
export const globalLeaderboardPanel = new LeaderboardPanel();
