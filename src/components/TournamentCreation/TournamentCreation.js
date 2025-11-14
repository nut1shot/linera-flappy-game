/**
 * TournamentCreation Component
 * Form for creating new tournaments (admin only)
 */
export class TournamentCreation {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.onCreateCallback = null;
    this.onCancelCallback = null;
  }

  /**
   * Create the tournament creation form HTML structure
   * @returns {HTMLElement} The form element
   */
  create() {
    const container = document.createElement('div');
    container.id = 'tournament-creation';
    container.className = 'tournament-creation';
    container.style.display = 'none';

    container.innerHTML = `
      <h2>Create Tournament</h2>

      <form id="tournament-form" class="tournament-form">
        <div class="form-section">
          <h3>Basic Information</h3>

          <div class="form-group">
            <label for="tournament-name-input">Tournament Name</label>
            <input type="text" id="tournament-name-input" class="form-input" maxlength="50" placeholder="Summer Championship" required>
          </div>

          <div class="form-group">
            <label for="tournament-description">Description</label>
            <textarea id="tournament-description" class="form-textarea" maxlength="200" placeholder="An exciting tournament for all skill levels..."></textarea>
          </div>

        </div>

        <div class="form-section">
          <h3>Schedule</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="start-date">Start Date</label>
              <input type="date" id="start-date" class="form-input" required>
            </div>

            <div class="form-group">
              <label for="start-time">Start Time</label>
              <input type="time" id="start-time" class="form-input" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="end-date">End Date</label>
              <input type="date" id="end-date" class="form-input" required>
            </div>

            <div class="form-group">
              <label for="end-time">End Time</label>
              <input type="time" id="end-time" class="form-input" required>
            </div>
          </div>

          <div class="form-group">
            <label for="duration-preset">Quick Duration</label>
            <select id="duration-preset" class="form-select">
              <option value="">Custom Duration</option>
              <option value="1hour">1 Hour</option>
              <option value="6hours">6 Hours</option>
              <option value="1day">1 Day</option>
              <option value="3days">3 Days</option>
              <option value="1week">1 Week</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" id="cancel-tournament" class="cancel-button">Cancel</button>
          <button type="submit" class="create-button">Create Tournament</button>
        </div>
      </form>
    `;

    this.element = container;
    this.attachEventListeners();
    return container;
  }

  /**
   * Attach event listeners to form elements
   */
  attachEventListeners() {
    if (!this.element) return;

    const form = this.element.querySelector('#tournament-form');
    const cancelBtn = this.element.querySelector('#cancel-tournament');
    const durationPreset = this.element.querySelector('#duration-preset');

    // Form submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.onCreateCallback) {
          const formData = this.getFormData();
          this.onCreateCallback(formData);
        }
      });
    }

    // Cancel button
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (this.onCancelCallback) {
          this.onCancelCallback();
        } else {
          this.hide();
        }
      });
    }

    // Duration preset
    if (durationPreset) {
      durationPreset.addEventListener('change', (e) => {
        this.applyDurationPreset(e.target.value);
      });
    }
  }

  /**
   * Apply duration preset to date/time fields
   * @param {string} preset - Duration preset value
   */
  applyDurationPreset(preset) {
    if (!this.element || !preset) return;

    const startDate = this.element.querySelector('#start-date');
    const startTime = this.element.querySelector('#start-time');
    const endDate = this.element.querySelector('#end-date');
    const endTime = this.element.querySelector('#end-time');

    if (!startDate || !endDate) return;

    // Set start to now
    const now = new Date();
    const start = new Date(now);

    startDate.value = this.formatDate(start);
    startTime.value = this.formatTime(start);

    // Calculate end time based on preset
    const end = new Date(start);
    switch (preset) {
      case '1hour':
        end.setHours(end.getHours() + 1);
        break;
      case '6hours':
        end.setHours(end.getHours() + 6);
        break;
      case '1day':
        end.setDate(end.getDate() + 1);
        break;
      case '3days':
        end.setDate(end.getDate() + 3);
        break;
      case '1week':
        end.setDate(end.getDate() + 7);
        break;
    }

    endDate.value = this.formatDate(end);
    endTime.value = this.formatTime(end);
  }

  /**
   * Format date for input field (YYYY-MM-DD)
   * @param {Date} date - Date object
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format time for input field (HH:MM)
   * @param {Date} date - Date object
   * @returns {string} Formatted time string
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Get form data
   * @returns {Object} Form data object
   */
  getFormData() {
    if (!this.element) return null;

    const form = this.element.querySelector('#tournament-form');
    if (!form) return null;

    const formData = new FormData(form);
    const data = {};

    // Get all form values
    data.name = this.element.querySelector('#tournament-name-input')?.value || '';
    data.description = this.element.querySelector('#tournament-description')?.value || '';
    data.startDate = this.element.querySelector('#start-date')?.value || '';
    data.startTime = this.element.querySelector('#start-time')?.value || '';
    data.endDate = this.element.querySelector('#end-date')?.value || '';
    data.endTime = this.element.querySelector('#end-time')?.value || '';

    // Combine date and time into timestamps
    if (data.startDate && data.startTime) {
      data.startTimestamp = new Date(`${data.startDate}T${data.startTime}`).getTime();
    }

    if (data.endDate && data.endTime) {
      data.endTimestamp = new Date(`${data.endDate}T${data.endTime}`).getTime();
    }

    return data;
  }

  /**
   * Show the tournament creation form
   * @param {Object} callbacks - Event callbacks
   * @param {Function} callbacks.onCreate - Callback when form is submitted
   * @param {Function} callbacks.onCancel - Callback when cancelled
   */
  show(callbacks = {}) {
    if (!this.element) {
      const container = this.create();
      document.body.appendChild(container);
    }

    this.onCreateCallback = callbacks.onCreate;
    this.onCancelCallback = callbacks.onCancel;

    // Set default start/end dates
    this.setDefaultDates();

    this.element.style.display = 'flex';
    this.isVisible = true;

    // Focus on name input
    const nameInput = this.element.querySelector('#tournament-name-input');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 100);
    }
  }

  /**
   * Set default dates (start now, end in 1 day)
   */
  setDefaultDates() {
    if (!this.element) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startDate = this.element.querySelector('#start-date');
    const startTime = this.element.querySelector('#start-time');
    const endDate = this.element.querySelector('#end-date');
    const endTime = this.element.querySelector('#end-time');

    if (startDate) startDate.value = this.formatDate(now);
    if (startTime) startTime.value = this.formatTime(now);
    if (endDate) endDate.value = this.formatDate(tomorrow);
    if (endTime) endTime.value = this.formatTime(tomorrow);
  }

  /**
   * Hide the form
   */
  hide() {
    if (!this.element) return;

    this.element.style.display = 'none';
    this.isVisible = false;
    this.clearForm();
  }

  /**
   * Clear form inputs
   */
  clearForm() {
    if (!this.element) return;

    const form = this.element.querySelector('#tournament-form');
    if (form) {
      form.reset();
    }
  }

  /**
   * Set form loading state
   * @param {boolean} loading - Whether form is loading
   */
  setLoading(loading) {
    if (!this.element) return;

    const submitBtn = this.element.querySelector('.create-button');
    const cancelBtn = this.element.querySelector('#cancel-tournament');

    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Creating...' : 'Create Tournament';
    }

    if (cancelBtn) {
      cancelBtn.disabled = loading;
    }
  }

  /**
   * Show validation error
   * @param {string} message - Error message
   */
  showError(message) {
    // TODO: Add error display element to form if needed
    console.error('Tournament creation error:', message);
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
    this.onCreateCallback = null;
    this.onCancelCallback = null;
  }
}

// Export singleton instance for convenience
export const globalTournamentCreation = new TournamentCreation();
