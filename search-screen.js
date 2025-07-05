// Search Screen for Rusty vs. The Evil Tree
class SearchScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Search-specific state
    this.searchState = {
      currentLocation: null,
      items: [],
      foundItems: [],
      timeRemaining: 60,
      stamina: 100,
      maxStamina: 100,
      staminaDrainRate: 0.5,
      isSearching: false,
      isPaused: false,
      searchStartTime: null,
      tooltip: null,
    };

    // Timer intervals
    this.searchTimer = null;
    this.staminaTimer = null;
  }

  // Initialize the search screen with location data
  initializeSearch(locationData) {
    this.searchState.currentLocation = locationData;
    this.searchState.items = [...locationData.items]; // Copy items array
    this.searchState.foundItems = [];
    this.searchState.timeRemaining = locationData.timeLimit || 60;
    this.searchState.stamina = locationData.startingStamina || 100;
    this.searchState.maxStamina = locationData.maxStamina || 100;
    this.searchState.staminaDrainRate = locationData.staminaDrainRate || 0.5;

    console.log(`🔍 Search initialized for location: ${locationData.name}`);
    console.log(`📦 Items to find: ${this.searchState.items.length}`);
  }

  render() {
    if (!this.searchState.currentLocation) {
      console.error("No location data provided to SearchScreen");
      return;
    }

    const location = this.searchState.currentLocation;

    this.container.innerHTML = `
      <div class="search-screen">
        <!-- Background Layers -->
        <div class="stars-layer"></div>
        <div class="asteroids-layer"></div>
        <div class="particles-layer"></div>
        
        <!-- Location Background -->
        <div class="search-location" style="background-image: url('${location.backgroundImage}')"></div>
        
        <!-- Search UI Overlay -->
        <div class="search-ui">
          <!-- Stats Bar -->
          <div class="search-stats">
            <div class="search-timer">
              <span class="search-timer-text">Time: <span id="search-time-remaining">60</span>s</span>
              <div class="search-timer-bar">
                <div class="search-timer-fill" id="search-timer-fill"></div>
              </div>
            </div>
            
            <div class="search-items-found">
              Items: <span id="search-items-count">0</span>/${this.searchState.items.length}
            </div>
            
            <div class="search-stamina">
              <span class="search-stamina-text">Stamina: <span id="search-stamina-value">100</span></span>
              <div class="search-stamina-bar">
                <div class="search-stamina-fill" id="search-stamina-fill"></div>
              </div>
            </div>
          </div>
          
          <!-- Items Container -->
          <div class="search-items-container" id="search-items-container">
            <!-- Items will be populated here -->
          </div>
          
          <!-- Controls -->
          <div class="search-controls">
            <button class="search-control-btn" id="search-pause-btn">Pause</button>
            <button class="search-control-btn primary" id="search-finish-btn">Finish Search</button>
            <button class="search-control-btn danger" id="search-exit-btn">Exit</button>
          </div>
        </div>
        
        <!-- Tooltip -->
        <div class="item-tooltip" id="item-tooltip"></div>
      </div>
    `;

    // Render items
    this.renderItems();

    // Update initial UI
    this.updateUI();
  }

  renderItems() {
    const container = this.container.querySelector("#search-items-container");
    if (!container) return;

    container.innerHTML = "";

    this.searchState.items.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.className = "search-item";
      itemElement.style.left = `${item.x}%`;
      itemElement.style.top = `${item.y}%`;
      itemElement.dataset.itemIndex = index;

      // Add symbol or icon
      if (item.symbol) {
        itemElement.innerHTML = item.symbol;
      } else {
        itemElement.innerHTML = "?";
      }

      // Add classes based on item state
      if (item.hasUsed) {
        itemElement.classList.add("found");
      } else if (item.cursed) {
        itemElement.classList.add("cursed");
      }

      container.appendChild(itemElement);
    });
  }

  setupEventListeners() {
    super.setupEventListeners();

    // Item click handlers
    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("search-item")) {
        this.handleItemClick(e);
      }
    });

    // Item hover handlers for tooltips
    this.container.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("search-item")) {
        this.showTooltip(e);
      }
    });

    this.container.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("search-item")) {
        this.hideTooltip();
      }
    });

    // Control button handlers
    const pauseBtn = this.container.querySelector("#search-pause-btn");
    const finishBtn = this.container.querySelector("#search-finish-btn");
    const exitBtn = this.container.querySelector("#search-exit-btn");

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => this.togglePause());
    }

    if (finishBtn) {
      finishBtn.addEventListener("click", () => this.finishSearch());
    }

    if (exitBtn) {
      exitBtn.addEventListener("click", () => this.exitSearch());
    }
  }

  handleItemClick(event) {
    if (this.searchState.isPaused) return;

    const itemIndex = parseInt(event.target.dataset.itemIndex);
    const item = this.searchState.items[itemIndex];

    if (!item) return;

    // Create ripple effect
    this.createRippleEffect(event.target, event);

    // If item hasn't been used, mark as found
    if (!item.hasUsed) {
      this.foundItem(itemIndex);
    }

    // Play sound
    if (this.audioManager) {
      const soundName = item.cursed ? "cursed" : "item-found";
      this.audioManager.playSound(soundName);
    }

    // Show item information
    this.showItemInfo(item);
  }

  foundItem(itemIndex) {
    const item = this.searchState.items[itemIndex];
    if (!item || item.hasUsed) return;

    // Mark as used
    item.hasUsed = true;
    this.searchState.foundItems.push(item);

    // Update visual state
    const itemElement = this.container.querySelector(
      `[data-item-index="${itemIndex}"]`
    );
    if (itemElement) {
      itemElement.classList.add("found");
      if (item.cursed) {
        itemElement.classList.add("cursed");
      }
    }

    // Create particle burst
    const rect = itemElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const color = item.cursed
      ? "rgba(220, 53, 69, 0.8)"
      : "rgba(40, 167, 69, 0.8)";
    this.createParticleBurst(centerX, centerY, 8, color);

    // Update UI
    this.updateUI();

    // Check if all items found
    if (this.searchState.foundItems.length === this.searchState.items.length) {
      this.allItemsFound();
    }

    console.log(
      `✅ Item found: ${item.name} (${this.searchState.foundItems.length}/${this.searchState.items.length})`
    );
  }

  showItemInfo(item) {
    let message = `Found: ${item.name}`;

    if (item.hasUsed) {
      // Show full stats for used items
      const stats = [];
      if (item.damage) stats.push(`Damage: ${item.damage}`);
      if (item.restore) stats.push(`Restore: ${item.restore}`);
      if (item.type) stats.push(`Type: ${item.type}`);

      if (stats.length > 0) {
        message += `\n${stats.join(" | ")}`;
      }

      if (item.text && item.text.length > 0) {
        message += `\n"${item.text[0]}"`;
      }
    } else {
      message += "\nStats will be revealed when used in combat.";
    }

    // Show temporary message
    this.showTemporaryMessage(message, item.cursed ? "warning" : "success");
  }

  showTooltip(event) {
    const itemIndex = parseInt(event.target.dataset.itemIndex);
    const item = this.searchState.items[itemIndex];
    const tooltip = this.container.querySelector("#item-tooltip");

    if (!item || !tooltip) return;

    // Build tooltip content
    let content = `<div class="item-name">${item.name}</div>`;

    if (item.hasUsed) {
      // Show stats for used items
      const stats = [];
      if (item.damage)
        stats.push(`<span class="item-stat damage">⚔️ ${item.damage}</span>`);
      if (item.restore)
        stats.push(`<span class="item-stat restore">💚 ${item.restore}</span>`);
      if (item.type)
        stats.push(`<span class="item-stat type">🏷️ ${item.type}</span>`);

      if (stats.length > 0) {
        content += `<div class="item-stats">${stats.join("")}</div>`;
      }

      if (item.text && item.text.length > 0) {
        content += `<div class="item-description">"${item.text[0]}"</div>`;
      }
    } else {
      content += `<div class="item-description">Click to discover this item's properties</div>`;
    }

    tooltip.innerHTML = content;

    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    let left = rect.left - containerRect.left + rect.width / 2;
    let top = rect.top - containerRect.top - 10;

    // Keep tooltip on screen
    if (left + 150 > containerRect.width) {
      left = containerRect.width - 150;
    }
    if (left < 0) left = 0;
    if (top < 0) top = rect.bottom - containerRect.top + 10;

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
    tooltip.classList.add("visible");
  }

  hideTooltip() {
    const tooltip = this.container.querySelector("#item-tooltip");
    if (tooltip) {
      tooltip.classList.remove("visible");
    }
  }

  startSearch() {
    if (this.searchState.isSearching) return;

    this.searchState.isSearching = true;
    this.searchState.searchStartTime = Date.now();

    // Start timer
    this.searchTimer = this.setManagedInterval(() => {
      if (!this.searchState.isPaused) {
        this.searchState.timeRemaining--;
        this.updateUI();

        if (this.searchState.timeRemaining <= 0) {
          this.timeUp();
        }
      }
    }, 1000);

    // Start stamina drain
    this.staminaTimer = this.setManagedInterval(() => {
      if (!this.searchState.isPaused && this.searchState.isSearching) {
        this.searchState.stamina -= this.searchState.staminaDrainRate;
        this.searchState.stamina = Math.max(0, this.searchState.stamina);
        this.updateUI();

        if (this.searchState.stamina <= 0) {
          this.staminaDepleted();
        }
      }
    }, 1000);

    console.log("🔍 Search started");
  }

  stopSearch() {
    this.searchState.isSearching = false;

    if (this.searchTimer) {
      clearInterval(this.searchTimer);
      this.searchTimer = null;
    }

    if (this.staminaTimer) {
      clearInterval(this.staminaTimer);
      this.staminaTimer = null;
    }

    console.log("🛑 Search stopped");
  }

  togglePause() {
    const pauseBtn = this.container.querySelector("#search-pause-btn");

    if (this.searchState.isPaused) {
      this.searchState.isPaused = false;
      if (pauseBtn) pauseBtn.textContent = "Pause";
      console.log("▶️ Search resumed");
    } else {
      this.searchState.isPaused = true;
      if (pauseBtn) pauseBtn.textContent = "Resume";
      console.log("⏸️ Search paused");
    }
  }

  finishSearch() {
    this.stopSearch();
    this.onSearchComplete();
  }

  exitSearch() {
    this.stopSearch();
    this.onSearchExit();
  }

  timeUp() {
    this.stopSearch();
    this.showTemporaryMessage(
      "Time's up! Moving to combat with found items.",
      "warning"
    );

    setTimeout(() => {
      this.onSearchComplete();
    }, 2000);
  }

  staminaDepleted() {
    this.stopSearch();
    this.showTemporaryMessage(
      "Stamina depleted! Rusty is too tired to continue.",
      "error"
    );

    setTimeout(() => {
      this.onSearchExit();
    }, 2000);
  }

  allItemsFound() {
    this.showTemporaryMessage(
      "All items found! Excellent detective work!",
      "success"
    );
    this.triggerScreenShake(500);

    setTimeout(() => {
      this.finishSearch();
    }, 2000);
  }

  updateUI() {
    // Update timer
    this.updateElementSafe(
      "search-time-remaining",
      this.searchState.timeRemaining
    );

    const timerFill = this.container.querySelector("#search-timer-fill");
    if (timerFill) {
      const maxTime = this.searchState.currentLocation?.timeLimit || 60;
      const percentage = (this.searchState.timeRemaining / maxTime) * 100;
      timerFill.style.width = percentage + "%";
    }

    // Update stamina
    this.updateElementSafe(
      "search-stamina-value",
      Math.floor(this.searchState.stamina)
    );

    const staminaFill = this.container.querySelector("#search-stamina-fill");
    if (staminaFill) {
      const percentage =
        (this.searchState.stamina / this.searchState.maxStamina) * 100;
      staminaFill.style.width = percentage + "%";
    }

    // Update items found counter
    this.updateElementSafe(
      "search-items-count",
      this.searchState.foundItems.length
    );
  }

  // Callback methods - to be overridden by game controller
  onSearchComplete() {
    console.log("✅ Search completed");
    console.log("Found items:", this.searchState.foundItems);

    // Show results first
    this.showSearchResults();

    // Call game controller's completion handler
    if (window.game && window.game.onSearchComplete) {
      setTimeout(() => {
        window.game.onSearchComplete(this.searchState.foundItems);
      }, 3000);
    } else {
      // Default behavior - return to start screen
      setTimeout(() => {
        if (window.game) {
          window.game.showScreen("start");
        }
      }, 3000);
    }
  }

  onSearchExit() {
    console.log("🚪 Search exited");

    // Call game controller's exit handler
    if (window.game && window.game.onSearchExit) {
      window.game.onSearchExit(this.searchState.foundItems);
    } else {
      // Default behavior - return to previous screen
      if (window.game) {
        window.game.showScreen("start");
      }
    }
  }

  showSearchResults() {
    const foundCount = this.searchState.foundItems.length;
    const totalCount = this.searchState.items.length;
    const cursedCount = this.searchState.foundItems.filter(
      (item) => item.cursed
    ).length;

    let message = `Search Complete!\n`;
    message += `Found ${foundCount}/${totalCount} items\n`;
    if (cursedCount > 0) {
      message += `Warning: ${cursedCount} cursed items found!\n`;
    }
    message += `Remaining Stamina: ${Math.floor(this.searchState.stamina)}`;

    this.showTemporaryMessage(message, "success", 5000);
  }

  // Override init to start search automatically
  init() {
    super.init();

    // Start search after a brief delay
    setTimeout(() => {
      this.startSearch();
    }, 500);
  }

  // Override destroy to clean up search timers
  destroy() {
    this.stopSearch();
    this.hideTooltip();
    super.destroy();
  }

  // Keyboard handling
  handleKeydown(e) {
    super.handleKeydown(e);

    if (e.code === "Space") {
      e.preventDefault();
      this.togglePause();
    } else if (e.code === "Enter") {
      e.preventDefault();
      this.finishSearch();
    } else if (e.code === "Escape") {
      e.preventDefault();
      this.exitSearch();
    }
  }

  // Debug method
  debug() {
    super.debug();
    console.log("🔍 Search State:", this.searchState);
  }
}

// Make available globally
window.SearchScreen = SearchScreen;

console.log("🔍 Search Screen class loaded");
