// Search Screen for Rusty vs. The Evil Tree
class SearchScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Search-specific state
    this.searchState = {
      currentLocation: null,
      items: [],
      foundItems: [],
      stamina: 100,
      maxStamina: 100,
      staminaDrainRate: 0.5,
      isSearching: false,
      isPaused: false,
      searchStartTime: null,
      revealDuration: 60, // seconds to reveal all items
      revealedItems: new Set(), // track which items have been revealed
    };

    // Timer intervals
    this.staminaTimer = null;
    this.revealTimer = null;
  }

  // Initialize the search screen with location data
  initializeSearch(locationData) {
    this.searchState.currentLocation = locationData;
    this.searchState.items = [...locationData.items]; // Copy items array
    this.searchState.foundItems = [];
    this.searchState.stamina = locationData.startingStamina || 100;
    this.searchState.maxStamina = locationData.maxStamina || 100;
    this.searchState.staminaDrainRate = locationData.staminaDrainRate || 0.5;
    this.searchState.revealDuration = locationData.revealDuration || 60;
    this.searchState.revealedItems = new Set();

    // Mark initially visible items as revealed
    this.searchState.items.forEach((item, index) => {
      if (item.initiallyVisible) {
        this.searchState.revealedItems.add(index);
      }
    });

    console.log(`🔍 Search initialized for location: ${locationData.name}`);
    console.log(`📦 Total items: ${this.searchState.items.length}`);
    console.log(`👁️ Initially visible: ${this.searchState.revealedItems.size}`);
  }

  render() {
    if (!this.searchState.currentLocation) {
      console.error("No location data provided to SearchScreen");
      return;
    }

    const location = this.searchState.currentLocation;

    this.container.innerHTML = `
      <div class="search-screen">
        <!-- Location Background -->
        <div class="search-location" style="background-image: url('${location.backgroundImage}')"></div>
        
        <!-- Search UI Overlay -->
        <div class="search-ui">
          <!-- Stats Bar (no timer) -->
          <div class="search-stats">
            <div class="search-collections" id="search-collections">
              <div class="collections-icon">🎒</div>
              <span class="collections-count" id="collections-count">0</span>
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
        
        <!-- Pause Screen Overlay -->
        <div class="pause-overlay" id="pause-overlay">
          <div class="pause-content">
            <img src="images/logo.png" alt="Rusty vs. The Evil Tree" class="pause-logo">
            <div class="pause-tips">
              <h3>How to Search</h3>
              <ul>
                <li>Click on objects to collect them</li>
                <li>Watch your stamina - searching drains energy</li>
                <li>Some items may be cursed - be careful!</li>
                <li>Use your detective instincts to find hidden clues</li>
                <li>Items are hidden naturally in the scene</li>
                <li>More items will appear over time</li>
              </ul>
            </div>
            <button class="game-button primary" id="resume-btn">Resume Search</button>
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

      // Use responsive positioning with viewport units
      itemElement.style.left = `${item.x}vw`;
      itemElement.style.top = `${item.y}vh`;

      // Apply scale from item data
      const scale = item.scale || 1.0;
      itemElement.style.transform = `scale(${scale})`;

      itemElement.dataset.itemIndex = index;

      // Use image if available, otherwise use symbol
      if (item.image) {
        itemElement.style.backgroundImage = `url('${item.image}')`;
        itemElement.innerHTML = ""; // Clear any text content
      } else if (item.symbol) {
        itemElement.innerHTML = item.symbol;
      } else {
        itemElement.innerHTML = "?";
      }

      // Set initial visibility
      if (this.searchState.revealedItems.has(index)) {
        itemElement.classList.add("visible");
      } else {
        itemElement.classList.add("hidden");
      }

      // Add classes based on item state
      if (item.hasUsed) {
        itemElement.classList.add("found");
      }
      if (item.cursed) {
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

    // Control button handlers
    const pauseBtn = this.container.querySelector("#search-pause-btn");
    const finishBtn = this.container.querySelector("#search-finish-btn");
    const exitBtn = this.container.querySelector("#search-exit-btn");
    const resumeBtn = this.container.querySelector("#resume-btn");

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => this.togglePause());
    }

    if (finishBtn) {
      finishBtn.addEventListener("click", () => this.finishSearch());
    }

    if (exitBtn) {
      exitBtn.addEventListener("click", () => this.exitSearch());
    }

    if (resumeBtn) {
      resumeBtn.addEventListener("click", () => this.togglePause());
    }
  }

  handleItemClick(event) {
    if (this.searchState.isPaused) return;

    const itemIndex = parseInt(event.target.dataset.itemIndex);
    const item = this.searchState.items[itemIndex];

    if (!item) return;

    // Only allow clicking on revealed items
    if (!this.searchState.revealedItems.has(itemIndex)) return;

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
  }

  foundItem(itemIndex) {
    const item = this.searchState.items[itemIndex];
    if (!item || item.hasUsed) return;

    // Mark as used
    item.hasUsed = true;
    this.searchState.foundItems.push(item);

    // Get item element for animation
    const itemElement = this.container.querySelector(
      `[data-item-index="${itemIndex}"]`
    );
    if (itemElement) {
      // Start wiggle animation
      this.wiggleItem(itemElement, () => {
        // After wiggle, fly to collection
        this.flyToCollection(itemElement, item);
      });
    }

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

  startSearch() {
    if (this.searchState.isSearching) return;

    this.searchState.isSearching = true;
    this.searchState.searchStartTime = Date.now();

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

    // Start item reveal system
    this.startItemReveal();

    console.log("🔍 Search started");
  }

  startItemReveal() {
    // Get all items that are not initially visible
    const hiddenItems = this.searchState.items
      .map((item, index) => ({ item, index }))
      .filter(({ item, index }) => !this.searchState.revealedItems.has(index));

    if (hiddenItems.length === 0) return;

    // Calculate reveal interval - spread 11 items over 60 seconds
    const revealInterval =
      (this.searchState.revealDuration * 1000) / hiddenItems.length;

    let revealIndex = 0;
    this.revealTimer = this.setManagedInterval(() => {
      if (
        !this.searchState.isPaused &&
        this.searchState.isSearching &&
        revealIndex < hiddenItems.length
      ) {
        const { index } = hiddenItems[revealIndex];
        this.revealItem(index);
        revealIndex++;
      }
    }, revealInterval);
  }

  revealItem(itemIndex) {
    if (this.searchState.revealedItems.has(itemIndex)) return;

    this.searchState.revealedItems.add(itemIndex);

    // Find the item element and reveal it
    const itemElement = this.container.querySelector(
      `[data-item-index="${itemIndex}"]`
    );
    if (itemElement) {
      itemElement.classList.remove("hidden");
      itemElement.classList.add("visible");
    }

    console.log(`👁️ Item revealed: ${this.searchState.items[itemIndex].name}`);
  }

  stopSearch() {
    this.searchState.isSearching = false;

    if (this.staminaTimer) {
      clearInterval(this.staminaTimer);
      this.staminaTimer = null;
    }

    if (this.revealTimer) {
      clearInterval(this.revealTimer);
      this.revealTimer = null;
    }

    console.log("🛑 Search stopped");
  }

  togglePause() {
    const pauseOverlay = this.container.querySelector("#pause-overlay");

    if (this.searchState.isPaused) {
      this.searchState.isPaused = false;
      if (pauseOverlay) {
        pauseOverlay.classList.remove("active");
      }
      console.log("▶️ Search resumed");
    } else {
      this.searchState.isPaused = true;
      if (pauseOverlay) {
        pauseOverlay.classList.add("active");
      }
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

    // Update collections counter
    this.updateElementSafe(
      "collections-count",
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
    const cursedCount = this.searchState.foundItems.filter(
      (item) => item.cursed
    ).length;

    let message = `Search Complete!\n`;
    message += `Found ${foundCount} items\n`;
    if (cursedCount > 0) {
      message += `Warning: ${cursedCount} cursed items found!\n`;
    }
    message += `Remaining Stamina: ${Math.floor(this.searchState.stamina)}`;

    this.showTemporaryMessage(message, "success", 5000);
  }

  // Animation methods
  wiggleItem(itemElement, callback) {
    itemElement.classList.add("wiggle");

    const timeout = setTimeout(() => {
      itemElement.classList.remove("wiggle");
      if (callback) callback();
    }, 500);

    this.timeouts.push(timeout);
  }

  flyToCollection(itemElement, item) {
    const collectionsIcon = this.container.querySelector("#search-collections");
    if (!collectionsIcon) return;

    // Get positions
    const itemRect = itemElement.getBoundingClientRect();
    const collectionsRect = collectionsIcon.getBoundingClientRect();

    // Calculate distance
    const deltaX =
      collectionsRect.left +
      collectionsRect.width / 2 -
      (itemRect.left + itemRect.width / 2);
    const deltaY =
      collectionsRect.top +
      collectionsRect.height / 2 -
      (itemRect.top + itemRect.height / 2);

    // Start animation
    itemElement.style.transition =
      "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    itemElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.5)`;
    itemElement.style.opacity = "0.7";

    // After animation, hide item and show collection effect
    const timeout = setTimeout(() => {
      itemElement.style.display = "none";

      // Add collection effect
      collectionsIcon.classList.add("collection-bounce");

      // Create particle burst at collection
      const centerX = collectionsRect.left + collectionsRect.width / 2;
      const centerY = collectionsRect.top + collectionsRect.height / 2;
      const color = item.cursed
        ? "rgba(220, 53, 69, 0.8)"
        : "rgba(40, 167, 69, 0.8)";
      this.createParticleBurst(centerX, centerY, 6, color);

      setTimeout(() => {
        collectionsIcon.classList.remove("collection-bounce");
      }, 300);
    }, 800);

    this.timeouts.push(timeout);
  }

  // Override init to start search automatically and skip animations
  init() {
    this.render();
    this.setupEventListeners();
    this.initializeAudio();
    this.isActive = true;

    console.log(`✅ ${this.screenName} Screen initialized`);

    // Start search after a brief delay
    setTimeout(() => {
      this.startSearch();
    }, 500);
  }

  // Override destroy to clean up search timers
  destroy() {
    this.stopSearch();
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
