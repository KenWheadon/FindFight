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
        <div class="search-container">
          <!-- Left Control Panel -->
          <div class="search-control-panel">
            <div class="search-control-section">
              <h3>🔍 Search Progress</h3>
              <div class="search-stats-panel">
                <div class="search-collections" id="search-collections">
                  <div class="collections-icon">🎒</div>
                  <span class="collections-count" id="collections-count">0</span>
                  <span class="collections-label">Items Found</span>
                </div>
                
                <div class="search-stamina-panel">
                  <div class="search-stamina-label">
                    <span>Stamina: <span id="search-stamina-value">100</span></span>
                    <span class="drain-rate">Drain: ${this.searchState.staminaDrainRate}/sec</span>
                  </div>
                  <div class="search-stamina-bar">
                    <div class="search-stamina-fill" id="search-stamina-fill"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="search-control-section">
              <h3>🎯 Location</h3>
              <div class="search-location-info">
                <div class="location-name">${location.name}</div>
                <div class="location-details">
                  <div class="location-stat">
                    <span class="stat-label">Status:</span>
                    <span class="stat-value">Searching...</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="search-control-section">
              <h3>⚡ Controls</h3>
              <div class="search-controls">
                <button class="search-control-btn" id="search-pause-btn">
                  <span class="btn-icon">⏸️</span>
                  <span class="btn-text">Pause</span>
                </button>
                <button class="search-control-btn primary" id="search-finish-btn">
                  <span class="btn-icon">✅</span>
                  <span class="btn-text">Finish Search</span>
                </button>
              </div>
            </div>

            <div class="search-control-section">
              <h3>💡 Tips</h3>
              <div class="search-tips">
                <ul>
                  <li>Click objects to collect them</li>
                  <li>Watch your stamina level</li>
                  <li>Items appear over time</li>
                  <li>Look for hidden details</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Right Search Area -->
          <div class="search-area">
            <div class="search-location-bg" style="background-image: url('${location.backgroundImage}')"></div>
            <div class="search-items-container" id="search-items-container">
              <!-- Items will be populated here -->
            </div>
          </div>
        </div>
        
        <!-- Pause Screen Overlay -->
        <div class="pause-overlay" id="pause-overlay">
          <div class="pause-content">
            <img src="images/logo.png" alt="Rusty vs. The Evil Tree" class="pause-logo">
            <div class="pause-tips">
              <h3>Search Paused</h3>
              <p>Take a break and plan your next moves!</p>
              <div class="pause-stats">
                <div class="pause-stat">
                  <span>Items Found:</span>
                  <span id="pause-items-found">0</span>
                </div>
                <div class="pause-stat">
                  <span>Stamina:</span>
                  <span id="pause-stamina">100</span>
                </div>
              </div>
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

      // Use percentage-based positioning exactly like the tool does
      // Apply positioning with proper precision
      itemElement.style.left = `${item.x}%`;
      itemElement.style.top = `${item.y}%`;

      // Set base size first (matching the tool's base size of 40px exactly)
      const baseSize = 40;
      itemElement.style.width = `${baseSize}px`;
      itemElement.style.height = `${baseSize}px`;

      // Apply scale from item data - this should match the tool exactly
      const scale = item.scale || 1.0;
      // Use the same transform as the tool
      itemElement.style.transform = `scale(${scale})`;

      // Calculate actual size for font sizing (used when no image)
      const actualSize = baseSize * scale;

      itemElement.dataset.itemIndex = index;

      // Use image if available, otherwise use symbol
      if (item.image) {
        itemElement.style.backgroundImage = `url('${item.image}')`;
        itemElement.innerHTML = ""; // Clear any text content
      } else if (item.symbol) {
        itemElement.innerHTML = item.symbol;
        // Font size based on actual scaled size
        itemElement.style.fontSize = `${actualSize * 0.6}px`;
        // Center text properly
        itemElement.style.lineHeight = `${baseSize}px`;
      } else {
        itemElement.innerHTML = "?";
        itemElement.style.fontSize = `${actualSize * 0.6}px`;
        itemElement.style.lineHeight = `${baseSize}px`;
      }

      // Set initial visibility
      if (this.searchState.revealedItems.has(index)) {
        itemElement.classList.add("visible");
      } else {
        itemElement.classList.add("hidden");
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
    const resumeBtn = this.container.querySelector("#resume-btn");

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => this.togglePause());
    }

    if (finishBtn) {
      finishBtn.addEventListener("click", () => this.finishSearch());
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

    // Create sparkle particle effect
    this.createSparkleEffect(event.target, event);

    // Create ripple effect
    this.createRippleEffect(event.target, event);

    // If item hasn't been used, mark as found
    if (!item.hasUsed) {
      this.foundItem(itemIndex);
    }
  }

  foundItem(itemIndex) {
    const item = this.searchState.items[itemIndex];
    if (!item || item.hasUsed) return;

    // Mark as used
    item.hasUsed = false;
    this.searchState.foundItems.push(item);

    // Get item element for animation
    const itemElement = this.container.querySelector(
      `[data-item-index="${itemIndex}"]`
    );
    if (itemElement) {
      // Start wiggle animation with scaling
      this.wiggleItem(itemElement, () => {
        // After wiggle, fly to collection
        this.flyToCollection(itemElement, item);
      });
    }

    // Update UI
    this.updateUI();

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
    const pauseBtn = this.container.querySelector(
      "#search-pause-btn .btn-text"
    );

    if (this.searchState.isPaused) {
      this.searchState.isPaused = false;
      if (pauseOverlay) {
        pauseOverlay.classList.remove("active");
      }
      if (pauseBtn) {
        pauseBtn.textContent = "Pause";
      }
      console.log("▶️ Search resumed");
    } else {
      this.searchState.isPaused = true;
      if (pauseOverlay) {
        pauseOverlay.classList.add("active");
      }
      if (pauseBtn) {
        pauseBtn.textContent = "Resume";
      }
      // Update pause screen stats
      this.updatePauseStats();
      console.log("⏸️ Search paused");
    }
  }

  updatePauseStats() {
    const pauseItemsFound = this.container.querySelector("#pause-items-found");
    const pauseStamina = this.container.querySelector("#pause-stamina");

    if (pauseItemsFound) {
      pauseItemsFound.textContent = this.searchState.foundItems.length;
    }
    if (pauseStamina) {
      pauseStamina.textContent = Math.floor(this.searchState.stamina);
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

    // Call the game's stamina depletion handler instead of just exiting
    setTimeout(() => {
      if (window.game && window.game.gameOverSearchExhaustion) {
        window.game.gameOverSearchExhaustion();
      } else {
        // Fallback to exit if game method not available
        this.onSearchExit();
      }
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
        window.game.onSearchComplete(
          this.searchState.foundItems,
          this.searchState.stamina
        );
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

    // this.showTemporaryMessage(message, "success", 5000);
  }

  // Animation methods
  wiggleItem(itemElement, callback) {
    // Get the current scale from the item data
    const itemIndex = parseInt(itemElement.dataset.itemIndex);
    const item = this.searchState.items[itemIndex];
    const currentScale = item.scale || 1.0;

    // Apply wiggle animation with scaling effect
    let wigglePhase = 0;
    const wiggleInterval = 50; // 50ms intervals
    const wiggleDuration = 500; // 500ms total
    const wiggleSteps = wiggleDuration / wiggleInterval;

    const wiggleTimer = setInterval(() => {
      wigglePhase++;

      // Calculate rotation and scale
      const rotation = Math.sin(wigglePhase * 0.8) * 15; // -15 to +15 degrees
      const scaleMultiplier = 1 + Math.sin(wigglePhase * 0.6) * 0.3; // 0.7 to 1.3
      const totalScale = currentScale * scaleMultiplier;

      // Apply transform
      itemElement.style.transform = `scale(${totalScale}) rotate(${rotation}deg)`;

      if (wigglePhase >= wiggleSteps) {
        clearInterval(wiggleTimer);
        // Reset to original scale
        itemElement.style.transform = `scale(${currentScale})`;
        if (callback) callback();
      }
    }, wiggleInterval);

    this.timeouts.push(wiggleTimer);
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

  // Sparkle effect using sparkles2.png
  createSparkleEffect(itemElement, event) {
    const rect = itemElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create 8-12 sparkles
    const sparkleCount = 8 + Math.floor(Math.random() * 5);

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle-particle";
      sparkle.style.position = "fixed";
      sparkle.style.left = centerX + "px";
      sparkle.style.top = centerY + "px";
      sparkle.style.width = "16px";
      sparkle.style.height = "16px";
      sparkle.style.backgroundImage = 'url("images/sparkles2.png")';
      sparkle.style.backgroundSize = "contain";
      sparkle.style.backgroundRepeat = "no-repeat";
      sparkle.style.backgroundPosition = "center";
      sparkle.style.pointerEvents = "none";
      sparkle.style.zIndex = "15";
      sparkle.style.opacity = "1";

      // Random direction and distance
      const angle = (Math.PI * 2 * i) / sparkleCount + Math.random() * 0.5;
      const distance = 30 + Math.random() * 40;
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;

      // Random scale
      const scale = 0.5 + Math.random() * 0.8;
      sparkle.style.transform = `scale(${scale})`;

      document.body.appendChild(sparkle);

      // Animate sparkle
      const animation = sparkle.animate(
        [
          {
            transform: `translate(0, 0) scale(${scale}) rotate(0deg)`,
            opacity: 1,
          },
          {
            transform: `translate(${endX - centerX}px, ${
              endY - centerY
            }px) scale(${scale * 1.5}) rotate(180deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 600 + Math.random() * 400,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      );

      animation.onfinish = () => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      };
    }
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
