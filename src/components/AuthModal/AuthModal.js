/**
 * AuthModal Component
 * Handles user authentication (login/register) UI
 */
export class AuthModal {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.onAuthCallback = null;
    this.passwordVisible = false;
  }

  /**
   * Create the auth modal HTML structure
   * @returns {HTMLElement} The auth modal element
   */
  create() {
    const modal = document.createElement('div');
    modal.id = 'auth-screen';
    modal.className = 'auth-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div id="auth-modal" class="auth-modal-inner">
        <div class="auth-modal-content">
          <h2 id="auth-title">Welcome to Linera Flappy!</h2>

          <!-- Single Login/Register Form -->
          <div id="auth-form" class="auth-form">
            <div class="form-group">
              <label for="auth-username">Discord Username</label>
              <input type="text" id="auth-username" class="form-input" placeholder="Enter your Discord username..." maxlength="20" />
            </div>

            <div class="form-group">
              <label for="auth-password">Password</label>
              <div class="password-field">
                <input type="password" id="auth-password" class="form-input" placeholder="Enter your password..." />
                <button type="button" id="toggle-auth-password" class="password-toggle">👁</button>
              </div>
            </div>

            <div class="auth-validation" id="auth-validation" style="display: none;">
              <div class="validation-message" id="auth-validation-message">Invalid credentials</div>
            </div>

            <div class="auth-info">
              <div class="info-item">
                <span class="info-icon">🔒</span>
                <span class="info-text">Password: At least 6 characters</span>
              </div>
              <div class="info-item">
                <span class="info-icon">🎮</span>
                <span class="info-text">This name will appear on leaderboards</span>
              </div>
              <div class="info-item">
                <span class="info-icon">✨</span>
                <span class="info-text">New users will be automatically registered</span>
              </div>
            </div>

            <div class="auth-actions">
              <button id="auth-btn" class="primary-auth-button">Login / Register</button>
            </div>
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

    // Password toggle
    const togglePasswordBtn = this.element.querySelector('#toggle-auth-password');
    const passwordInput = this.element.querySelector('#auth-password');

    if (togglePasswordBtn && passwordInput) {
      togglePasswordBtn.addEventListener('click', () => {
        this.passwordVisible = !this.passwordVisible;
        passwordInput.type = this.passwordVisible ? 'text' : 'password';
        togglePasswordBtn.textContent = this.passwordVisible ? '🙈' : '👁';
      });
    }

    // Handle Enter key on inputs
    const usernameInput = this.element.querySelector('#auth-username');
    if (usernameInput && passwordInput) {
      const handleEnter = (e) => {
        if (e.key === 'Enter') {
          const authBtn = this.element.querySelector('#auth-btn');
          if (authBtn) authBtn.click();
        }
      };
      usernameInput.addEventListener('keypress', handleEnter);
      passwordInput.addEventListener('keypress', handleEnter);
    }
  }

  /**
   * Show the auth modal
   * @param {Function} onAuth - Callback when auth is submitted
   */
  show(onAuth) {
    if (!this.element) {
      const modal = this.create();
      document.body.appendChild(modal);
    }

    this.onAuthCallback = onAuth;
    this.element.style.display = 'flex';
    this.isVisible = true;

    // Focus on username input
    const usernameInput = this.element.querySelector('#auth-username');
    if (usernameInput) {
      setTimeout(() => usernameInput.focus(), 100);
    }
  }

  /**
   * Hide the auth modal
   */
  hide() {
    if (!this.element) return;

    this.element.style.display = 'none';
    this.isVisible = false;
    this.clearForm();
  }

  /**
   * Clear the form inputs
   */
  clearForm() {
    if (!this.element) return;

    const usernameInput = this.element.querySelector('#auth-username');
    const passwordInput = this.element.querySelector('#auth-password');

    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';

    this.hideValidation();
  }

  /**
   * Get form values
   * @returns {{username: string, password: string}}
   */
  getFormValues() {
    if (!this.element) return { username: '', password: '' };

    const usernameInput = this.element.querySelector('#auth-username');
    const passwordInput = this.element.querySelector('#auth-password');

    return {
      username: usernameInput ? usernameInput.value.trim() : '',
      password: passwordInput ? passwordInput.value : ''
    };
  }

  /**
   * Show validation error
   * @param {string} message - Error message to display
   */
  showValidation(message) {
    if (!this.element) return;

    const validationEl = this.element.querySelector('#auth-validation');
    const messageEl = this.element.querySelector('#auth-validation-message');

    if (validationEl && messageEl) {
      messageEl.textContent = message;
      validationEl.style.display = 'block';
    }
  }

  /**
   * Hide validation error
   */
  hideValidation() {
    if (!this.element) return;

    const validationEl = this.element.querySelector('#auth-validation');
    if (validationEl) {
      validationEl.style.display = 'none';
    }
  }

  /**
   * Set loading state on auth button
   * @param {boolean} loading - Whether to show loading state
   */
  setLoading(loading) {
    if (!this.element) return;

    const authBtn = this.element.querySelector('#auth-btn');
    if (authBtn) {
      authBtn.disabled = loading;
      authBtn.textContent = loading ? 'Loading...' : 'Login / Register';
    }
  }

  /**
   * Update modal title
   * @param {string} title - New title text
   */
  setTitle(title) {
    if (!this.element) return;

    const titleEl = this.element.querySelector('#auth-title');
    if (titleEl) {
      titleEl.textContent = title;
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
    this.onAuthCallback = null;
  }

  /**
   * Static method to create and show auth modal
   * @param {Function} onAuth - Callback when auth is submitted
   * @returns {AuthModal} The modal instance
   */
  static show(onAuth) {
    const modal = new AuthModal();
    modal.show(onAuth);
    return modal;
  }
}

// Export singleton instance for convenience
export const globalAuthModal = new AuthModal();
