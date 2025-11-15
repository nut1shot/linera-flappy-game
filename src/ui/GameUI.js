import { GAME_CONFIG, UI_CONFIG } from "../constants/GameConstants.js";

export class GameUI {
  constructor() {
    this.elements = {};
    this.callbacks = {};
    this.isInitialized = false;
    this.userRole = "player";
    this.components = {}; // Will hold references to UI components
    this.currentGameMode = null; // Track current game mode
  }

  setComponents(components) {
    this.components = components;
  }

  initialize() {
    if (this.isInitialized) return;

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.cacheElements();
        this.setupEventListeners();
        this.setupMobileOptimizations();
      });
    } else {
      this.cacheElements();
      this.setupEventListeners();
      this.setupMobileOptimizations();
    }

    this.isInitialized = true;
  }

  cacheElements() {
    // Game elements
    this.elements.canvas = document.getElementById("gameCanvas");
    this.elements.startBtn = document.getElementById("startBtn");
    this.elements.restartBtn = document.getElementById("restartBtn");
    this.elements.playerBest = document.getElementById("player-best");
    this.elements.chainId = document.getElementById("chain-id");

    // Screen elements
    this.elements.initialLoadingScreen = document.getElementById(
      "initial-loading-screen"
    );
    this.elements.authScreen = document.getElementById("auth-screen");
    this.elements.modeSelectionScreen = document.getElementById(
      "mode-selection-screen"
    );
    this.elements.gameScreen = document.getElementById("game-screen");
    this.elements.tournamentScreen =
      document.getElementById("tournament-screen");

    // Loading elements
    this.elements.loadingSteps = document.getElementById("loading-steps");
    this.elements.loadingProgress = document.getElementById("loading-progress");
    this.elements.loadingPercentage =
      document.getElementById("loading-percentage");

    // Auth modal elements
    this.elements.authModal = document.getElementById("auth-modal");
    this.elements.authForm = document.getElementById("auth-form");
    this.elements.authBtn = document.getElementById("auth-btn");
    this.elements.passwordToggles =
      document.querySelectorAll(".password-toggle");

    // Mode selection elements
    this.elements.practiceBtn = document.getElementById("practice-mode-btn");
    this.elements.tournamentBtn = document.getElementById(
      "tournament-mode-btn"
    );

    // Tournament elements
    this.elements.tournamentList = document.getElementById("tournament-list");
    this.elements.backToModeBtn = document.getElementById("back-to-mode-btn");

    // Leaderboard elements
    this.elements.leaderboardEntries = document.getElementById(
      "leaderboard-entries"
    );
    this.elements.myPosition = document.getElementById("my-position");
    this.elements.myRank = document.getElementById("my-rank");
    this.elements.myScore = document.getElementById("my-score");

    // Admin elements
    this.elements.adminPanel = document.getElementById("admin-panel");
    this.elements.createTournamentBtn = document.getElementById(
      "create-tournament-btn"
    );
    this.elements.manageTournamentsBtn = document.getElementById(
      "manage-tournaments-btn"
    );

    // Additional elements
    this.elements.retryButton = document.getElementById("retry-button");
    this.elements.changeModeBtn = document.getElementById("change-mode-btn");
    this.elements.logoutBtn = document.getElementById("logout-btn");
    this.elements.closeTournamentLeaderboardBtn = document.getElementById(
      "close-tournament-leaderboard"
    );
    this.elements.closeTournamentLeaderboardFooterBtn = document.getElementById(
      "close-tournament-leaderboard-footer"
    );
  }

  setupEventListeners() {
    // Game controls
    if (this.elements.startBtn) {
      this.elements.startBtn.addEventListener("click", () =>
        this.emit("startGame")
      );
    }

    if (this.elements.restartBtn) {
      this.elements.restartBtn.addEventListener("click", () =>
        this.emit("restartGame")
      );
    }

    // Auth modal - event listeners are handled by AuthModal component
    // No need to set up here as component manages its own events

    // Mode selection
    if (this.elements.practiceBtn) {
      this.elements.practiceBtn.addEventListener("click", () =>
        this.emit("selectPracticeMode")
      );
    }

    if (this.elements.tournamentBtn) {
      this.elements.tournamentBtn.addEventListener("click", () =>
        this.emit("selectTournamentMode")
      );
    }

    // Tournament navigation
    if (this.elements.backToModeBtn) {
      this.elements.backToModeBtn.addEventListener("click", () =>
        this.emit("backToModeSelection")
      );
    }

    // Additional event listeners
    if (this.elements.retryButton) {
      this.elements.retryButton.addEventListener("click", () =>
        this.emit("retryConnection")
      );
    }

    if (this.elements.changeModeBtn) {
      this.elements.changeModeBtn.addEventListener("click", () =>
        this.emit("changeMode")
      );
    }

    if (this.elements.logoutBtn) {
      this.elements.logoutBtn.addEventListener("click", () =>
        this.emit("logout")
      );
    }

    if (this.elements.createTournamentBtn) {
      this.elements.createTournamentBtn.addEventListener("click", () =>
        this.emit("createTournament")
      );
    }

    // Refresh button
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () =>
        this.emit("refreshLeaderboard")
      );
    }

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        
        // Check if start button is visible
        if (this.elements.startBtn && this.elements.startBtn.classList.contains("show")) {
          this.emit("startGame");
          return;
        }
        
        // Check if restart button is visible
        if (this.elements.restartBtn && this.elements.restartBtn.classList.contains("show")) {
          this.emit("restartGame");
          return;
        }
        
        // Otherwise, use spacebar for jump (during gameplay)
        this.emit("jump");
      }
    });

    // Canvas click/touch for jump
    if (this.elements.canvas) {
      this.elements.canvas.addEventListener("click", () => this.emit("jump"));
      this.elements.canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.emit("jump");
      });
    }

    // Overlay event listeners will be setup when game screen is shown
    // See setupOverlayEventListeners() method
  }

  setCallbacks(callbacks) {
    this.callbacks = callbacks;
  }

  emit(event, data = null) {
    if (this.callbacks[event]) {
      this.callbacks[event](data);
    }
  }

  // Screen management
  showScreen(screenName) {
    // Hide all component-based screens
    if (this.components.authModal) this.components.authModal.hide();
    if (this.components.modeSelection) this.components.modeSelection.hide();
    if (this.components.tournamentList) this.components.tournamentList.hide();
    if (this.components.tournamentCreation) this.components.tournamentCreation.hide();

    // Hide DOM-based screens
    const gameScreen = document.getElementById("game-screen");
    if (gameScreen) gameScreen.style.display = "none";

    // Close info overlay modal when switching to a different screen
    if (screenName !== "game-screen") {
      this.hideInfoOverlay();
    }

    // Show requested screen
    switch (screenName) {
      case "auth-screen":
        // Auth modal will be shown by the auth flow
        break;
      case "mode-selection-screen":
        if (this.components.modeSelection) {
          this.components.modeSelection.show();
        }
        break;
      case "tournament-screen":
        if (this.components.tournamentList) {
          this.components.tournamentList.show({
            isAdmin: this.userRole === "ADMIN"
          });
        }
        break;
      case "tournament-creation":
        if (this.components.tournamentCreation) {
          this.components.tournamentCreation.show();
        }
        break;
      case "game-screen":
        if (gameScreen) {
          gameScreen.style.display = "flex";
          // Setup overlay event listeners when game screen is shown
          this.setupOverlayEventListeners();
          // Show menu button initially (game hasn't started yet)
          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            this.showMenuButton();
          }, 100);
        }
        break;
      case "initial-loading-screen":
        // Loading is handled by LoadingSpinner component
        break;
      default:
        console.warn(`Unknown screen: ${screenName}`);
    }
  }

  setupOverlayEventListeners() {
    // Menu button
    const menuBtn = document.getElementById("game-menu-btn");
    if (menuBtn) {
      // Remove existing listeners by cloning
      const newMenuBtn = menuBtn.cloneNode(true);
      menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
      newMenuBtn.addEventListener("click", () => this.showInfoOverlay());
      // Ensure menu button is visible when setting up (game hasn't started yet)
      newMenuBtn.style.display = "flex";
    }

    // Close overlay button
    const closeOverlayBtn = document.getElementById("close-overlay-btn");
    if (closeOverlayBtn) {
      const newCloseBtn = closeOverlayBtn.cloneNode(true);
      closeOverlayBtn.parentNode.replaceChild(newCloseBtn, closeOverlayBtn);
      newCloseBtn.addEventListener("click", () => this.hideInfoOverlay());
    }

    // Navigation buttons
    const navButtons = document.querySelectorAll(".info-nav-btn");
    navButtons.forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener("click", (e) => {
        const section = e.target.getAttribute("data-section");
        this.switchInfoSection(section);
      });
    });

    // Close overlay on background click
    const overlay = document.getElementById("info-overlay");
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this.hideInfoOverlay();
        }
      });
    }
  }

  // Loading UI
  updateLoadingStep(stepIndex, status = "active") {
    const steps = this.elements.loadingSteps?.children;
    if (!steps || stepIndex >= steps.length) return;

    // Reset all steps
    for (let i = 0; i < steps.length; i++) {
      steps[i].className = "loading-step";
      if (i < stepIndex) {
        steps[i].classList.add("completed");
      } else if (i === stepIndex) {
        steps[i].classList.add(status);
      }
    }
  }

  updateLoadingProgress(percentage, text) {
    if (this.elements.loadingProgress) {
      this.elements.loadingProgress.style.width = `${percentage}%`;
      this.elements.loadingProgress.style.transition = "width 0.3s ease";
    }

    if (this.elements.loadingPercentage) {
      this.elements.loadingPercentage.textContent = `${Math.round(
        percentage
      )}%`;
    }

    // Update the main loading text
    const loadingTextElement = document.getElementById("loading-text");
    if (loadingTextElement && text) {
      loadingTextElement.textContent = text;
    }
  }

  // Username modal
  showAuthModal() {
    if (this.components.authModal) {
      // Show modal with callback to handleLogin
      this.components.authModal.show(() => {
        // This callback will be called when auth form is submitted
        // The actual login handling is done via the login callback in setupCallbacks
        this.emit("login");
      });
    }
  }

  hideAuthModal() {
    if (this.components.authModal) {
      this.components.authModal.hide();
    }
  }

  updatePlayerInfo(user) {
    // Update using component if available
    if (this.components.playerInfo) {
      this.components.playerInfo.setPlayerName(user.username);
      this.components.playerInfo.setPlayerRole(user.role === "ADMIN" ? "Admin" : "Player");
    }

    // Fallback to direct DOM manipulation
    const playerNameElement = document.getElementById("player-name");
    const playerRoleElement = document.getElementById("player-role");

    if (playerNameElement) {
      playerNameElement.textContent = user.username;
    }

    if (playerRoleElement) {
      playerRoleElement.textContent =
        user.role === "ADMIN" ? "Admin" : "Player";
    }
  }

  clearPlayerInfo() {
    const playerNameElement = document.getElementById("player-name");
    const playerRoleElement = document.getElementById("player-role");

    if (playerNameElement) {
      playerNameElement.textContent = "Loading...";
    }

    if (playerRoleElement) {
      playerRoleElement.textContent = "Player";
    }
  }

  // Game UI updates
  updatePlayerBest(best) {
    if (this.elements.playerBest) {
      this.elements.playerBest.textContent = best;
    }
  }

  updatePlayerRank(rank) {
    const playerRankElement = document.getElementById("player-rank");
    if (playerRankElement) {
      playerRankElement.textContent = rank > 0 ? `#${rank}` : "-";
    }
  }

  updateChainId(chainId) {
    if (this.elements.chainId) {
      this.elements.chainId.textContent = chainId;
    }
  }

  showRestartButton() {
    if (this.elements.restartBtn) {
      this.elements.restartBtn.classList.add("show");
    }
    // Show menu button when restart button is shown (game has ended)
    this.showMenuButton();
  }

  hideRestartButton() {
    if (this.elements.restartBtn) {
      this.elements.restartBtn.classList.remove("show");
    }
    // Hide menu button when restart button is hidden (game is starting)
    this.hideMenuButton();
  }

  showStartButton() {
    if (this.elements.startBtn) {
      this.elements.startBtn.classList.add("show");
    }
    // Show menu button when start button is shown (game hasn't started yet)
    this.showMenuButton();
  }

  hideStartButton() {
    if (this.elements.startBtn) {
      this.elements.startBtn.classList.remove("show");
    }
    // Hide menu button when start button is hidden (game has started - playing)
    this.hideMenuButton();
  }

  showMenuButton() {
    const menuBtn = document.getElementById("game-menu-btn");
    if (menuBtn) {
      menuBtn.style.display = "flex";
      menuBtn.style.visibility = "visible";
    }
  }

  hideMenuButton() {
    const menuBtn = document.getElementById("game-menu-btn");
    if (menuBtn) {
      menuBtn.style.display = "none";
      menuBtn.style.visibility = "hidden";
    }
  }

  // Tournament UI
  renderTournamentList(tournaments) {
    if (!this.elements.tournamentList) return;

    if (tournaments.length === 0) {
      this.elements.tournamentList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏆</div>
          <div class="empty-state-title">No Tournaments Available</div>
          <div class="empty-state-description">
            ${
              this.userRole === "ADMIN"
                ? "Create the first tournament to get started!"
                : "Check back later for upcoming tournaments."
            }
          </div>
        </div>
      `;
      return;
    }

    // Sort tournaments with pinned priority
    const sortedTournaments = tournaments.sort((a, b) => {
      // Primary sort: pinned first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Secondary sort: status priority
      const statusPriority = { ACTIVE: 3, REGISTRATION: 2, ENDED: 1 };
      const statusDiff =
        (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
      if (statusDiff !== 0) return statusDiff;

      // Tertiary sort: creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    this.elements.tournamentList.innerHTML = sortedTournaments
      .map((tournament) => {
        const cardClass =
          "tournament-card " +
          tournament.status.toLowerCase().replace(/\s+/g, "-");
        const isAdmin = this.userRole === "ADMIN";

        return `
        <div class="${cardClass}${tournament.pinned ? " pinned" : ""}">
          ${
            isAdmin
              ? `
            <div class="tournament-admin-controls">
              <button data-tournament-id="${
                tournament.id
              }" class="admin-icon-btn pin-icon-btn ${
                  tournament.pinned ? "pinned" : ""
                }" data-action="pin">
                ${tournament.pinned ? "📍" : "📌"}
              </button>
              <button data-tournament-id="${
                tournament.id
              }" class="admin-icon-btn edit-icon-btn" data-action="edit">
                ✏️
              </button>
              <button data-tournament-id="${
                tournament.id
              }" class="admin-icon-btn delete-icon-btn" data-action="delete">
                🗑️
              </button>
            </div>
          `
              : ""
          }
          <div class="tournament-name">${tournament.name}</div>
          <div class="tournament-meta">
            <div class="info-item">
              <span class="label">Status:</span>
              <span class="value">${tournament.status}</span>
            </div>
            <div class="info-item players-info">
              <span class="label">Players:</span>
              <span class="value players-count">${tournament.playerCount}</span>
            </div>
            <div class="info-item">
              <span class="label">Best Score:</span>
              <span class="value">${tournament.maxScore}</span>
            </div>
            <div class="info-item">
              <span class="label">Starts:</span>
              <span class="value" style="font-size: 7px;">${this.formatTournamentDate(
                tournament.startTime
              )}</span>
            </div>
            <div class="info-item">
              <span class="label">Ends:</span>
              <span class="value" style="font-size: 7px;">${this.formatTournamentDate(
                tournament.endTime
              )}</span>
            </div>
          </div>
          <div class="tournament-card-actions">
            ${
              tournament.status === "REGISTRATION" ||
              tournament.status === "ACTIVE"
                ? `
              <button data-tournament-id="${tournament.id}" class="tournament-action-btn join-btn" data-action="join">
                JOIN TOURNAMENT
              </button>
            `
                : ""
            }
            <button data-tournament-id="${
              tournament.id
            }" class="tournament-action-btn view-btn" data-action="view">
              VIEW LEADERBOARD
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    // Add event listeners for tournament action buttons
    this.setupTournamentActionListeners();
  }

  setupTournamentActionListeners() {
    // Admin action buttons
    document.querySelectorAll(".admin-icon-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const tournamentId = e.target.getAttribute("data-tournament-id");
        const action = e.target.getAttribute("data-action");

        if (action === "pin") {
          this.emit("toggleTournamentPin", tournamentId);
        } else if (action === "edit") {
          this.emit("editTournament", tournamentId);
        } else if (action === "delete") {
          this.emit("deleteTournament", tournamentId);
        }
      });
    });

    // User action buttons
    document.querySelectorAll(".tournament-action-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const tournamentId = e.target.getAttribute("data-tournament-id");
        const action = e.target.getAttribute("data-action");

        if (action === "join") {
          this.emit("joinTournament", tournamentId);
        } else if (action === "view") {
          this.emit("viewTournamentLeaderboard", tournamentId);
        }
      });
    });
  }

  // Leaderboard UI
  updateLeaderboard(leaderboard) {
    if (!this.elements.leaderboardEntries) return;

    this.elements.leaderboardEntries.innerHTML = leaderboard
      .map(
        (entry, index) => `
      <div class="leaderboard-entry ${
        entry.isCurrentPlayer ? "current-player" : ""
      }">
        <div class="entry-rank">#${index + 1}</div>
        <div class="entry-player">${
          entry.username || entry.playerName || "Unknown"
        }</div>
        <div class="entry-score">${entry.score}</div>
      </div>
    `
      )
      .join("");
  }

  updateMyPosition(rank, score) {
    if (this.elements.myRank) {
      this.elements.myRank.textContent = `#${rank}`;
    }

    if (this.elements.myScore) {
      this.elements.myScore.textContent = score;
    }

    if (this.elements.myPosition) {
      this.elements.myPosition.style.display = rank ? "flex" : "none";
    }
  }

  // Admin UI
  updateUIBasedOnRole(role) {
    this.userRole = role;
    const isAdmin = role === "ADMIN";

    // Update admin panel if it exists
    if (this.elements.adminPanel) {
      this.elements.adminPanel.style.display = isAdmin ? "block" : "none";
    }

    // Update player role display
    const roleEl = document.getElementById("player-role");
    if (roleEl) {
      roleEl.textContent = role.charAt(0).toUpperCase() + role.slice(1);
      roleEl.className = "value " + role;
    }

    // Update player name with admin badge
    const nameEl = document.getElementById("player-name");
    if (nameEl) {
      if (isAdmin && !nameEl.textContent.includes("👑")) {
        nameEl.innerHTML += ' <span class="admin-badge">👑</span>';
      } else if (!isAdmin && nameEl.textContent.includes("👑")) {
        nameEl.innerHTML = nameEl.textContent.replace(" 👑", "");
      }
    }

    // Show/hide all admin-only elements
    const adminElements = document.querySelectorAll(".admin-only");
    adminElements.forEach((el) => {
      el.style.display = isAdmin ? "block" : "none";
    });
  }

  // Utility methods
  showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = "block";
    }
  }

  hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = "none";
    }
  }

  addClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add(className);
    }
  }

  removeClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove(className);
    }
  }

  setText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
    }
  }

  setHTML(elementId, html) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
    }
  }

  // Game mode UI updates
  updateGameModeDisplay(mode) {
    this.currentGameMode = mode; // Store current mode
    
    const currentModeElement = document.getElementById("current-mode");
    const tournamentInfoPanel = document.getElementById("tournament-info");
    const leaderboardTitle = document.getElementById("leaderboard-title");

    if (currentModeElement) {
      currentModeElement.textContent =
        mode === "practice" ? "Practice" : "Tournament";
      currentModeElement.className = `mode-value ${mode}`;
    }

    if (tournamentInfoPanel) {
      tournamentInfoPanel.style.display =
        mode === "tournament" ? "block" : "none";
    }

    if (leaderboardTitle) {
      leaderboardTitle.textContent =
        mode === "practice" ? "Top Players" : "Tournament Leaderboard";
    }

    // Update Tournament button visibility in overlay navigation
    this.updateTournamentButtonVisibility();
  }

  updateTournamentButtonVisibility() {
    const tournamentNavBtn = document.querySelector('.info-nav-btn[data-section="tournament"]');
    if (tournamentNavBtn) {
      // Show Tournament button only in tournament mode
      tournamentNavBtn.style.display = this.currentGameMode === "tournament" ? "inline-block" : "none";
    }
  }

  updateTournamentInfo(tournament) {
    if (!tournament) return;

    const tournamentName = document.getElementById("tournament-name");
    const tournamentStatus = document.getElementById("tournament-status");
    const tournamentTimeLeft = document.getElementById("tournament-time-left");
    const tournamentPlayers = document.getElementById("tournament-players");

    if (tournamentName) tournamentName.textContent = tournament.name;
    if (tournamentStatus) {
      tournamentStatus.textContent = tournament.status;
      tournamentStatus.className = `value status-${tournament.status.toLowerCase()}`;
    }
    if (tournamentTimeLeft)
      tournamentTimeLeft.textContent = tournament.timeLeft;
    if (tournamentPlayers)
      tournamentPlayers.textContent = tournament.playerCount;
  }

  // Mobile optimization methods
  setupMobileOptimizations() {
    this.preventMobileZoom();
    this.handleOrientationChange();
    this.optimizeCanvasForMobile();
    this.addMobileTouchTargets();
  }

  preventMobileZoom() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      },
      { passive: false }
    );

    // Prevent pinch zoom
    document.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }

  handleOrientationChange() {
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.optimizeCanvasForMobile();
        this.emit("orientationChanged");
      }, 100);
    });
  }

  optimizeCanvasForMobile() {
    if (!this.elements.canvas) return;

    const canvas = this.elements.canvas;

    // Keep original game dimensions for consistent gameplay
    const gameWidth = GAME_CONFIG.CANVAS.BASE_WIDTH;
    const gameHeight = GAME_CONFIG.CANVAS.BASE_HEIGHT;
    const aspectRatio = gameHeight / gameWidth;

    // Detect device type and get appropriate scaling config
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth <= UI_CONFIG.MOBILE_BREAKPOINT;

    const scaleConfig = isMobile
      ? GAME_CONFIG.CANVAS.MOBILE_SCALE
      : GAME_CONFIG.CANVAS.DESKTOP_SCALE;

    // Calculate maximum allowed dimensions with enhanced scaling
    const maxWidthByViewport =
      viewportWidth * (scaleConfig.MAX_VIEWPORT_WIDTH_PERCENT / 100);
    const maxWidthByScale = gameWidth * scaleConfig.MAX_SCALE_MULTIPLIER;
    const maxHeightByViewport =
      viewportHeight * (scaleConfig.MAX_VIEWPORT_HEIGHT_PERCENT / 100);

    const maxWidth = Math.min(maxWidthByViewport, maxWidthByScale);
    const maxHeight = maxHeightByViewport;

    // Start with width-based sizing
    const initialDisplayWidth = Math.min(
      maxWidth,
      gameWidth * scaleConfig.MAX_SCALE_MULTIPLIER
    );
    let displayWidth = initialDisplayWidth;
    let displayHeight = displayWidth * aspectRatio;

    // If height exceeds available space, scale down based on height
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = displayHeight / aspectRatio;
    }

    // Ensure minimum readable size - use fixed minimums to avoid viewport scaling issues
    const minWidthFallback = isMobile
      ? Math.min(viewportWidth * 0.6, 400)
      : 350; // Fixed 350px minimum for desktop
    const minWidth = Math.max(scaleConfig.MIN_WIDTH, minWidthFallback);

    if (displayWidth < minWidth) {
      displayWidth = minWidth;
      displayHeight = displayWidth * aspectRatio;

      // Final check: if still too tall, compromise
      if (displayHeight > maxHeight) {
        displayHeight = maxHeight;
        displayWidth = displayHeight / aspectRatio;
      }
    }

    // Always keep game canvas at original size for consistent game logic
    canvas.width = gameWidth;
    canvas.height = gameHeight;

    // Only scale the display size via CSS
    canvas.style.width = Math.round(displayWidth) + "px";
    canvas.style.height = Math.round(displayHeight) + "px";

    // Add responsive canvas class for CSS targeting
    canvas.classList.toggle("mobile-canvas", isMobile);

    // Don't scale the context - let CSS handle the scaling
    // This preserves game coordinate system

    // Notify game engine of display scale for input handling
    this.emit("canvasScaleChanged", {
      scaleX: displayWidth / gameWidth,
      scaleY: displayHeight / gameHeight,
    });
  }

  addMobileTouchTargets() {
    // Add mobile-friendly CSS classes to improve touch targets
    const touchElements = [
      ...document.querySelectorAll("button"),
      ...document.querySelectorAll(".admin-icon-btn"),
      ...document.querySelectorAll(".close-modal-btn"),
      ...document.querySelectorAll(".tournament-action-btn"),
    ];

    touchElements.forEach((element) => {
      element.classList.add("mobile-touch-target");
    });
  }

  // Check if device is mobile
  isMobileDevice() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    );
  }

  // Helper method to format tournament dates
  formatTournamentDate(timestamp) {
    if (!timestamp) return "Not set";

    try {
      // Handle different timestamp formats
      let date;
      if (typeof timestamp === "string") {
        // Try parsing as ISO string first
        date = new Date(timestamp);
      } else if (typeof timestamp === "number") {
        // Handle different timestamp formats
        if (timestamp > 1000000000 && timestamp < 10000000000) {
          // This is a Unix timestamp in seconds (between 2001 and 2286)
          date = new Date(timestamp * 1000);
        } else if (timestamp > 1000000000000 && timestamp < 10000000000000) {
          // This is a Unix timestamp in milliseconds (between 2001 and 2286)
          date = new Date(timestamp);
        } else if (timestamp > 1000000000000000) {
          // This is a Unix timestamp in microseconds (16+ digits)
          date = new Date(timestamp / 1000); // Convert microseconds to milliseconds
        } else {
          // For other numbers, try different interpretations
          const asSeconds = new Date(timestamp * 1000);
          const asMilliseconds = new Date(timestamp);
          const asMicroseconds = new Date(timestamp / 1000);

          // Check which one gives a reasonable date (between 1970 and 2100)
          const minDate = new Date("1970-01-01");
          const maxDate = new Date("2100-01-01");

          if (asMicroseconds >= minDate && asMicroseconds <= maxDate) {
            date = asMicroseconds;
          } else if (asSeconds >= minDate && asSeconds <= maxDate) {
            date = asSeconds;
          } else if (asMilliseconds >= minDate && asMilliseconds <= maxDate) {
            date = asMilliseconds;
          } else {
            // Neither interpretation works, return the raw number with error
            console.error("Cannot interpret timestamp:", timestamp);
            return `Invalid (${timestamp})`;
          }
        }
      } else {
        return "Invalid date";
      }

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } catch (error) {
      console.error("Error formatting date:", error, "timestamp:", timestamp);
      return "Invalid date";
    }
  }

  // ===== INFO OVERLAY METHODS =====

  showInfoOverlay() {
    const overlay = document.getElementById("info-overlay");
    if (overlay) {
      overlay.style.display = "flex";
      // Update Tournament button visibility based on current mode
      this.updateTournamentButtonVisibility();
      // Show first section by default
      this.switchInfoSection("mode");
    }
  }

  hideInfoOverlay() {
    const overlay = document.getElementById("info-overlay");
    if (overlay) {
      overlay.style.display = "none";
    }
  }

  switchInfoSection(sectionName) {
    // Prevent accessing tournament section in practice mode
    if (sectionName === "tournament" && this.currentGameMode !== "tournament") {
      sectionName = "mode"; // Fallback to mode section
    }

    // Hide all sections
    const allSections = document.querySelectorAll(".info-section-content");
    allSections.forEach((section) => {
      section.classList.remove("active");
    });

    // Show selected section
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Update navigation buttons
    const allNavButtons = document.querySelectorAll(".info-nav-btn");
    allNavButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-section") === sectionName) {
        btn.classList.add("active");
      }
    });
  }
}
