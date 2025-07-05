// Main Game Controller - Rusty vs. The Evil Tree
class RustyGame {
  constructor() {
    // Centralized game state
    this.gameState = {
      currentScreen: "loading",
      currentPhase: 0,
      treeHP: 100,
      playerStamina: 100,
      playerItems: [],
      playerHand: [],
      currentTurn: 1,
      cardsUsedThisTurn: 0,
      treeWeakness: null,
      treeImmunity: null,
      foundItems: [],
      visibleItems: [],
      gameStarted: false,
      loadingComplete: false,
    };

    // Screen instances
    this.screens = {};
    this.currentScreenInstance = null;
    this.gameContainer = null;

    // Initialize game
    this.init();
  }

  init() {
    console.log("🎮 Initializing Rusty vs. The Evil Tree");

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupGame());
    } else {
      this.setupGame();
    }
  }

  setupGame() {
    // Get the game container
    this.gameContainer = document.getElementById("game-container");
    if (!this.gameContainer) {
      console.error("Game container not found!");
      return;
    }

    // Initialize screens
    this.initializeScreens();

    // Setup global event listeners
    this.setupEventListeners();

    // Start with loading screen
    this.showScreen("loading");
  }

  initializeScreens() {
    // Create screen instances with the shared container
    if (window.LoadingScreen) {
      this.screens.loading = new LoadingScreen(this.gameContainer, "loading");
    }

    if (window.StartScreen) {
      this.screens.start = new StartScreen(this.gameContainer, "start");
    }

    console.log("📱 Screen instances created:", Object.keys(this.screens));
  }

  setupEventListeners() {
    // Global keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.code === "F11") {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });

    // Handle visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseGame();
      } else {
        this.resumeGame();
      }
    });
  }

  // Screen management
  showScreen(screenName) {
    console.log(`🔄 Transitioning to ${screenName} screen`);

    // Cleanup current screen
    if (this.currentScreenInstance) {
      this.currentScreenInstance.destroy();
    }

    // Clear the container
    this.gameContainer.innerHTML = "";

    // Remove all screen classes from container
    this.gameContainer.className = "game-container";

    // Add the new screen class
    this.gameContainer.classList.add(`${screenName}-screen`);

    // Initialize new screen
    if (this.screens[screenName]) {
      this.currentScreenInstance = this.screens[screenName];
      this.currentScreenInstance.init();
    } else {
      console.error(`Screen "${screenName}" not found!`);
      // Fallback content
      this.gameContainer.innerHTML = `
        <div class="screen-content">
          <h2>${
            screenName.charAt(0).toUpperCase() + screenName.slice(1)
          } Screen</h2>
          <p>This screen is not yet implemented.</p>
          <button class="game-button" onclick="game.showScreen('start')">Back to Start</button>
        </div>
      `;
    }

    // Update game state
    this.gameState.currentScreen = screenName;
  }

  // Game state management
  updateGameState(updates) {
    Object.assign(this.gameState, updates);
    console.log("🔄 Game state updated:", updates);
  }

  // Element update helper
  updateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
      if (typeof content === "string") {
        element.textContent = content;
      } else {
        element.innerHTML = content;
      }
    }
  }

  // Game flow methods
  startGame() {
    console.log("🎯 Starting game");
    this.updateGameState({ gameStarted: true });
    this.showScreen("start");
  }

  onLoadingComplete() {
    console.log("✅ Loading complete");
    this.updateGameState({ loadingComplete: true });

    // Auto-transition to start screen after a brief delay
    setTimeout(() => {
      this.showScreen("start");
    }, 500);
  }

  beginAdventure() {
    console.log("🦝 Beginning Rusty's adventure");
    // This will be implemented when we add more screens
    this.showScreen("hiddenObject");
  }

  restartGame() {
    console.log("🔄 Restarting game");

    // Reset game state
    this.gameState = {
      currentScreen: "start",
      currentPhase: 0,
      treeHP: 100,
      playerStamina: 100,
      playerItems: [],
      playerHand: [],
      currentTurn: 1,
      cardsUsedThisTurn: 0,
      treeWeakness: null,
      treeImmunity: null,
      foundItems: [],
      visibleItems: [],
      gameStarted: false,
      loadingComplete: true,
    };

    this.showScreen("start");
  }

  // Utility methods
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  pauseGame() {
    console.log("⏸️ Game paused");
    // Pause any active timers/animations
    if (this.currentScreenInstance && this.currentScreenInstance.pause) {
      this.currentScreenInstance.pause();
    }
  }

  resumeGame() {
    console.log("▶️ Game resumed");
    // Resume any paused timers/animations
    if (this.currentScreenInstance && this.currentScreenInstance.resume) {
      this.currentScreenInstance.resume();
    }
  }

  // Debug methods
  debug() {
    console.log("🔍 Game Debug Info:");
    console.log("Game State:", this.gameState);
    console.log("Current Screen:", this.currentScreenInstance?.screenName);
    console.log("Available Screens:", Object.keys(this.screens));
    console.log("Game Container:", this.gameContainer);

    if (this.currentScreenInstance && this.currentScreenInstance.debug) {
      this.currentScreenInstance.debug();
    }
  }

  // Expose debug methods globally in development
  exposeDebugMethods() {
    if (typeof window !== "undefined") {
      window.gameDebug = {
        debug: () => this.debug(),
        showScreen: (screenName) => this.showScreen(screenName),
        gameState: this.gameState,
        screens: this.screens,
        container: this.gameContainer,
      };
    }
  }
}

// Initialize game when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Create global game instance
  window.game = new RustyGame();

  // Expose debug methods in development
  window.game.exposeDebugMethods();

  console.log("🎮 Rusty vs. The Evil Tree initialized");
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = RustyGame;
}
