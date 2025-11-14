/**
 * TournamentInfo Component
 * Displays current tournament information during gameplay
 */
export class TournamentInfo {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.tournamentId = null;
  }

  /**
   * Create the tournament info HTML structure
   * @returns {HTMLElement} The tournament info element
   */
  create() {
    const container = document.createElement('div');
    container.id = 'tournament-info';
    container.className = 'tournament-info';
    container.style.display = 'none';

    container.innerHTML = `
      <h3 id="tournament-name">Tournament Name</h3>
      <div class="info-item">
        <span class="label">Status:</span>
        <span id="tournament-status" class="value">Active</span>
      </div>
      <div class="info-item">
        <span class="label">Time Left:</span>
        <span id="tournament-time-left" class="value">-</span>
      </div>
      <div class="info-item">
        <span class="label">Players:</span>
        <span id="tournament-players" class="value">0</span>
      </div>
    `;

    this.element = container;
    return container;
  }

  /**
   * Show the tournament info panel
   * @param {Object} tournamentData - Tournament data to display
   * @param {string} tournamentData.id - Tournament ID
   * @param {string} tournamentData.name - Tournament name
   * @param {string} tournamentData.status - Tournament status
   * @param {string} tournamentData.timeLeft - Time remaining
   * @param {number} tournamentData.playerCount - Number of players
   */
  show(tournamentData = {}) {
    if (!this.element) {
      const container = this.create();
      // Component needs to be appended by parent
      return container;
    }

    this.tournamentId = tournamentData.id;

    // Update tournament data
    if (tournamentData.name) {
      this.setTournamentName(tournamentData.name);
    }
    if (tournamentData.status) {
      this.setStatus(tournamentData.status);
    }
    if (tournamentData.timeLeft) {
      this.setTimeLeft(tournamentData.timeLeft);
    }
    if (tournamentData.playerCount !== undefined) {
      this.setPlayerCount(tournamentData.playerCount);
    }

    this.element.style.display = 'block';
    this.isVisible = true;
  }

  /**
   * Hide the tournament info panel
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

    const nameEl = this.element.querySelector('#tournament-name');
    if (nameEl) {
      nameEl.textContent = name;
    }
  }

  /**
   * Set tournament status
   * @param {string} status - Tournament status
   */
  setStatus(status) {
    if (!this.element) return;

    const statusEl = this.element.querySelector('#tournament-status');
    if (statusEl) {
      statusEl.textContent = status;
    }
  }

  /**
   * Set time left
   * @param {string} timeLeft - Time remaining string
   */
  setTimeLeft(timeLeft) {
    if (!this.element) return;

    const timeEl = this.element.querySelector('#tournament-time-left');
    if (timeEl) {
      timeEl.textContent = timeLeft;
    }
  }

  /**
   * Set player count
   * @param {number} count - Number of players
   */
  setPlayerCount(count) {
    if (!this.element) return;

    const countEl = this.element.querySelector('#tournament-players');
    if (countEl) {
      countEl.textContent = count.toString();
    }
  }

  /**
   * Update all tournament data at once
   * @param {Object} data - Tournament data
   * @param {string} data.name - Tournament name
   * @param {string} data.status - Tournament status
   * @param {string} data.timeLeft - Time remaining
   * @param {number} data.playerCount - Number of players
   */
  updateTournamentData(data) {
    if (data.name !== undefined) {
      this.setTournamentName(data.name);
    }
    if (data.status !== undefined) {
      this.setStatus(data.status);
    }
    if (data.timeLeft !== undefined) {
      this.setTimeLeft(data.timeLeft);
    }
    if (data.playerCount !== undefined) {
      this.setPlayerCount(data.playerCount);
    }
  }

  /**
   * Get current tournament ID
   * @returns {string|null} Tournament ID or null
   */
  getTournamentId() {
    return this.tournamentId;
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
    this.tournamentId = null;
  }
}

// Export singleton instance for convenience
export const globalTournamentInfo = new TournamentInfo();
