/**
 * ModeSelection Component
 * Allows users to choose between Practice and Tournament game modes
 */
export class ModeSelection {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.onPracticeModeCallback = null;
    this.onTournamentModeCallback = null;
  }

  /**
   * Create the mode selection HTML structure
   * @returns {HTMLElement} The mode selection element
   */
  create() {
    const container = document.createElement('div');
    container.id = 'mode-selection-screen';
    container.className = 'mode-selection';
    container.style.display = 'none';

    container.innerHTML = `
      <h2>Select Game Mode</h2>

      <button class="mode-button practice" id="practice-mode-btn">
        <span class="mode-icon">🎮</span>
        PRACTICE MODE
        <div class="mode-description">
          Free play mode<br>
          Improve your skills and compete on the global leaderboard
        </div>
      </button>

      <button class="mode-button tournament" id="tournament-mode-btn">
        <span class="mode-icon">🏆</span>
        TOURNAMENT MODE
        <div class="mode-description">
          Compete in time-limited tournaments<br>
          Win prizes and climb the championship ranks
        </div>
      </button>
    `;

    this.element = container;
    this.attachEventListeners();
    return container;
  }

  /**
   * Attach event listeners to mode selection elements
   */
  attachEventListeners() {
    if (!this.element) return;

    // Practice mode button
    const practiceBtn = this.element.querySelector('#practice-mode-btn');
    if (practiceBtn) {
      practiceBtn.addEventListener('click', () => {
        if (this.onPracticeModeCallback) {
          this.onPracticeModeCallback();
        }
      });
    }

    // Tournament mode button
    const tournamentBtn = this.element.querySelector('#tournament-mode-btn');
    if (tournamentBtn) {
      tournamentBtn.addEventListener('click', () => {
        if (this.onTournamentModeCallback) {
          this.onTournamentModeCallback();
        }
      });
    }
  }

  /**
   * Show the mode selection screen
   * @param {Object} callbacks - Event callbacks
   * @param {Function} callbacks.onPracticeMode - Callback when practice mode is selected
   * @param {Function} callbacks.onTournamentMode - Callback when tournament mode is selected
   */
  show(callbacks = {}) {
    if (!this.element) {
      const container = this.create();
      document.body.appendChild(container);
    }

    this.onPracticeModeCallback = callbacks.onPracticeMode;
    this.onTournamentModeCallback = callbacks.onTournamentMode;

    this.element.style.display = 'flex';
    this.isVisible = true;
  }

  /**
   * Hide the mode selection screen
   */
  hide() {
    if (!this.element) return;

    this.element.style.display = 'none';
    this.isVisible = false;
  }

  /**
   * Toggle visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Set button enabled/disabled state
   * @param {string} mode - 'practice' or 'tournament'
   * @param {boolean} enabled - Whether button should be enabled
   */
  setButtonEnabled(mode, enabled) {
    if (!this.element) return;

    const btnId = mode === 'practice' ? '#practice-mode-btn' : '#tournament-mode-btn';
    const btn = this.element.querySelector(btnId);

    if (btn) {
      btn.disabled = !enabled;
      btn.style.opacity = enabled ? '1' : '0.5';
      btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
    }
  }

  /**
   * Update mode description
   * @param {string} mode - 'practice' or 'tournament'
   * @param {string} description - New description text
   */
  setModeDescription(mode, description) {
    if (!this.element) return;

    const btnId = mode === 'practice' ? '#practice-mode-btn' : '#tournament-mode-btn';
    const btn = this.element.querySelector(btnId);

    if (btn) {
      const descEl = btn.querySelector('.mode-description');
      if (descEl) {
        descEl.innerHTML = description;
      }
    }
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
    this.onPracticeModeCallback = null;
    this.onTournamentModeCallback = null;
  }
}

// Export singleton instance for convenience
export const globalModeSelection = new ModeSelection();
