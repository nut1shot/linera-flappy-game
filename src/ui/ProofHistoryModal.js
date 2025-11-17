import { Loading } from '../utils/LoadingManager.js';

export class ProofHistoryModal {
  constructor(lineraClient = null) {
    this.proofHistoryContainer = null;
    this.statusFilter = null;
    this.modeFilter = null;
    this.lineraClient = lineraClient;
    this.proofHistory = [];
    this.allProofs = []; // Store all proofs for client-side filtering
    this.currentStatusFilter = 'all'; // 'all', 'accepted', 'rejected', 'pending'
    this.currentModeFilter = 'all'; // 'all', 'practice', 'tournament'

    this.initializeElements();
  }

  initializeElements() {
    // These will be set when DOM is ready
    this.proofHistoryContainer = document.getElementById("proof-history-container");
    this.statusFilter = document.getElementById("proof-status-filter");
    this.modeFilter = document.getElementById("proof-mode-filter");
  }

  async loadAndDisplayProofHistory() {
    // Re-initialize elements in case DOM was updated
    this.initializeElements();

    if (!this.proofHistoryContainer) {
      console.error("Proof history container not found");
      return;
    }

    // Show loading message
    this.proofHistoryContainer.innerHTML = '<div class="loading-message">Loading proof history...</div>';

    try {
      // Load proof history from blockchain
      await this.loadProofHistory();

      // Setup filter dropdown if not already set up
      this.setupFilterDropdown();

      // Render proof history
      this.renderProofHistory();

    } catch (error) {
      console.error("Failed to load proof history:", error);
      if (this.proofHistoryContainer) {
        this.proofHistoryContainer.innerHTML = `
          <div class="error-message">
            <p>❌ Failed to load proof history</p>
            <p class="error-details">${error.message}</p>
            <button class="retry-btn" onclick="window.proofHistoryModal?.loadAndDisplayProofHistory()">Retry</button>
          </div>
        `;
      }
    }
  }

  async loadProofHistory() {
    if (!this.lineraClient) {
      throw new Error("Linera client not initialized");
    }

    // Fetch all proofs from blockchain (only once)
    this.allProofs = await this.lineraClient.getProofHistory();

    // Apply filters client-side
    this.applyFilters();
  }

  applyFilters() {
    // Start with all proofs
    let filteredProofs = [...this.allProofs];

    // Filter by status
    if (this.currentStatusFilter !== 'all') {
      const statusMap = {
        'accepted': 'Accepted',
        'rejected': 'Rejected',
        'pending': 'Pending'
      };
      const targetStatus = statusMap[this.currentStatusFilter];
      filteredProofs = filteredProofs.filter(proof => proof.status === targetStatus);
    }

    // Filter by mode (practice vs tournament)
    if (this.currentModeFilter !== 'all') {
      if (this.currentModeFilter === 'practice') {
        // Practice mode means no tournament ID
        filteredProofs = filteredProofs.filter(proof => !proof.tournamentId);
      } else if (this.currentModeFilter === 'tournament') {
        // Tournament mode means has tournament ID
        filteredProofs = filteredProofs.filter(proof => proof.tournamentId);
      }
    }

    // Update displayed proofs
    this.proofHistory = filteredProofs;
  }

  setupFilterDropdown() {
    // Setup status filter
    if (this.statusFilter) {
      // Remove existing listener if any
      const newStatusFilter = this.statusFilter.cloneNode(true);
      this.statusFilter.parentNode.replaceChild(newStatusFilter, this.statusFilter);
      this.statusFilter = newStatusFilter;

      // Add change event listener
      this.statusFilter.addEventListener('change', (e) => {
        this.currentStatusFilter = e.target.value;
        this.handleFilterChange();
      });
    }

    // Setup mode filter
    if (this.modeFilter) {
      // Remove existing listener if any
      const newModeFilter = this.modeFilter.cloneNode(true);
      this.modeFilter.parentNode.replaceChild(newModeFilter, this.modeFilter);
      this.modeFilter = newModeFilter;

      // Add change event listener
      this.modeFilter.addEventListener('change', (e) => {
        this.currentModeFilter = e.target.value;
        this.handleFilterChange();
      });
    }
  }

  handleFilterChange() {
    // Show loading
    if (this.proofHistoryContainer) {
      this.proofHistoryContainer.innerHTML = '<div class="loading-message">Filtering proofs...</div>';
    }

    try {
      // Apply filters to already loaded data
      this.applyFilters();
      this.renderProofHistory();
    } catch (error) {
      console.error("Failed to filter proof history:", error);
      if (this.proofHistoryContainer) {
        this.proofHistoryContainer.innerHTML = `
          <div class="error-message">
            <p>❌ Failed to filter proofs</p>
            <p class="error-details">${error.message}</p>
          </div>
        `;
      }
    }
  }

  renderProofHistory() {
    if (!this.proofHistoryContainer) return;

    if (this.proofHistory.length === 0) {
      // Check if filters are active
      const hasActiveFilters = this.currentStatusFilter !== 'all' || this.currentModeFilter !== 'all';
      const filterText = hasActiveFilters
        ? `No proofs match your current filters (${this.currentStatusFilter} status, ${this.currentModeFilter} mode)`
        : 'No proof history found';

      this.proofHistoryContainer.innerHTML = `
        <div class="empty-message">
          <p>📋 ${filterText}</p>
          <p class="hint">${hasActiveFilters ? 'Try adjusting your filters or play more games!' : 'Play games to start building your proof history!'}</p>
        </div>
      `;
      return;
    }

    // Generate HTML for each proof entry
    const proofEntriesHTML = this.proofHistory.map((entry, index) => {
      const status = this.getStatusText(entry.status);
      const statusClass = this.getStatusClass(entry.status);
      const submittedDate = this.formatTimestamp(entry.submittedAt);
      const confirmedDate = entry.confirmedAt ? this.formatTimestamp(entry.confirmedAt) : '-';
      const gameMode = entry.tournamentId ? '🏆 Tournament' : '🎮 Practice';
      const gameModeClass = entry.tournamentId ? 'mode-tournament' : 'mode-practice';

      return `
        <div class="proof-entry ${statusClass}">
          <div class="proof-header">
            <div class="proof-number">#${index + 1}</div>
            <div class="proof-badges">
              <div class="proof-mode ${gameModeClass}">${gameMode}</div>
              <div class="proof-status ${statusClass}">${status}</div>
            </div>
          </div>

          <div class="proof-details">
            <div class="proof-row">
              <span class="proof-label">Score:</span>
              <span class="proof-value">${entry.proof.finalScore}</span>
            </div>

            <div class="proof-row">
              <span class="proof-label">Pipes Passed:</span>
              <span class="proof-value">${entry.proof.pipesPassed}</span>
            </div>

            <div class="proof-row">
              <span class="proof-label">Jumps:</span>
              <span class="proof-value">${entry.proof.jumpCount}</span>
            </div>

            <div class="proof-row">
              <span class="proof-label">Duration:</span>
              <span class="proof-value">${this.formatDuration(entry.proof.gameDurationMs)}</span>
            </div>

            ${entry.tournamentId ? `
              <div class="proof-row">
                <span class="proof-label">Tournament:</span>
                <span class="proof-value">${entry.tournamentId}</span>
              </div>
            ` : ''}

            ${entry.leaderboardRank ? `
              <div class="proof-row">
                <span class="proof-label">Rank:</span>
                <span class="proof-value">#${entry.leaderboardRank}</span>
              </div>
            ` : ''}

            <div class="proof-row">
              <span class="proof-label">Submitted:</span>
              <span class="proof-value">${submittedDate}</span>
            </div>

            <div class="proof-row">
              <span class="proof-label">Confirmed:</span>
              <span class="proof-value">${confirmedDate}</span>
            </div>

            ${entry.rejectionReason ? `
              <div class="proof-row rejection-reason">
                <span class="proof-label">Rejection Reason:</span>
                <span class="proof-value error">${entry.rejectionReason}</span>
              </div>
            ` : ''}
          </div>

          <div class="proof-footer">
            <small class="session-id">Session: ${entry.sessionId}</small>
          </div>
        </div>
      `;
    }).join('');

    this.proofHistoryContainer.innerHTML = proofEntriesHTML;
  }

  getStatusText(status) {
    switch (status) {
      case 'Accepted':
        return '✓ Accepted';
      case 'Rejected':
        return '✗ Rejected';
      case 'Pending':
        return '⏳ Pending';
      default:
        return status;
    }
  }

  getStatusClass(status) {
    switch (status) {
      case 'Accepted':
        return 'status-accepted';
      case 'Rejected':
        return 'status-rejected';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  formatTimestamp(timestamp) {
    // Convert microseconds to milliseconds
    const date = new Date(Number(timestamp) / 1000);
    return date.toLocaleString();
  }

  formatDuration(durationMs) {
    const seconds = Math.floor(durationMs / 1000);
    const ms = durationMs % 1000;
    return `${seconds}.${ms.toString().padStart(3, '0')}s`;
  }
}
