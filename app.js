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

    if (window.SearchScreen) {
      this.screens.search = new SearchScreen(this.gameContainer, "search");
    }

    if (window.GameOverScreen) {
      this.screens.gameOver = new GameOverScreen(
        this.gameContainer,
        "gameOver"
      );
    }

    if (window.VictoryScreen) {
      this.screens.victory = new VictoryScreen(this.gameContainer, "victory");
    }

    if (window.StorySegmentScreen) {
      this.screens.storySegment = new StorySegmentScreen(
        this.gameContainer,
        "storySegment"
      );
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

  // Story segment methods
  showStorySegment(segmentName, nextScreenData = null) {
    console.log(`📖 Showing story segment: ${segmentName}`);

    const segmentData = STORY_UTILS.prepareSegment(segmentName, nextScreenData);
    if (!segmentData) {
      console.error(`Failed to prepare story segment: ${segmentName}`);
      // Fallback to next screen directly
      if (nextScreenData) {
        this.startSearchScreen(nextScreenData);
      } else {
        this.showScreen("start");
      }
      return;
    }

    // Initialize the story segment screen
    if (this.screens.storySegment) {
      this.screens.storySegment.initializeStorySegment(segmentData);
    }

    // Show the story segment screen
    this.showScreen("storySegment");
  }

  // Victory methods
  triggerVictory(stats = {}) {
    console.log("🏆 Victory triggered with stats:", stats);

    // Show victory setup story first
    this.showStorySegment("victorySetup");

    // Store victory stats for when we actually show the victory screen
    this.gameState.victoryStats = stats;
  }

  // Show victory screen directly (called from story segment)
  showVictoryScreen(stats = null) {
    const victoryStats = stats || this.gameState.victoryStats || {};

    // Initialize the victory screen with the game stats
    if (this.screens.victory) {
      this.screens.victory.initializeVictory(victoryStats);
    }

    // Show the victory screen
    this.showScreen("victory");
  }

  // Game over methods
  triggerGameOver(type, message = "") {
    console.log(`💀 Game Over triggered - Type: ${type}, Message: ${message}`);

    // Show defeat setup story first
    this.showStorySegment("defeatSetup");

    // Store game over info for when we actually show the game over screen
    this.gameState.gameOverType = type;
    this.gameState.gameOverMessage = message;
  }

  // Show game over screen directly (called from story segment)
  showGameOverScreen(type = null, message = "") {
    const gameOverType = type || this.gameState.gameOverType || "search";
    const gameOverMessage = message || this.gameState.gameOverMessage || "";

    // Initialize the game over screen with the specific type
    if (this.screens.gameOver) {
      this.screens.gameOver.initializeGameOver(gameOverType, gameOverMessage);
    }

    // Show the game over screen
    this.showScreen("gameOver");
  }

  // Specific game over scenarios
  gameOverSearchExhaustion() {
    this.triggerGameOver("search", "Stamina depleted during investigation");
  }

  gameOverTreeAttack() {
    this.triggerGameOver("tree", "Defeated by the Evil Tree");
  }

  // Game progression methods
  completeFirstLevel() {
    console.log("🎯 First level completed, transitioning to second area");

    const locationData = ITEMS_UTILS.generateLocationData("forestClearing");
    if (!locationData) {
      console.error("Failed to generate forest location data");
      this.showScreen("start");
      return;
    }

    // Show investigation story segment, then go to forest
    this.showStorySegment("investigation", locationData);
  }

  completeSecondLevel() {
    console.log("🎯 Second level completed, transitioning to final area");

    const locationData = ITEMS_UTILS.generateLocationData("darkCatacombs");
    if (!locationData) {
      console.error("Failed to generate catacombs location data");
      this.showScreen("start");
      return;
    }

    // Show confrontation story segment, then go to catacombs
    this.showStorySegment("confrontation", locationData);
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

    // Use the detective office location from items config
    const locationData = ITEMS_UTILS.generateLocationData("detectiveOffice");

    if (!locationData) {
      console.error("Failed to generate location data");
      this.showScreen("start");
      return;
    }

    // Show intro story segment first, then go to search
    this.showStorySegment("intro", locationData);
  }

  // Method to start search with custom location data
  startSearchScreen(locationData) {
    console.log("🔍 Starting search screen with location:", locationData.name);

    if (this.screens.search) {
      this.screens.search.initializeSearch(locationData);
      this.showScreen("search");
    } else {
      console.error("Search screen not available!");
    }
  }

  // Handle search completion
  onSearchComplete(foundItems) {
    console.log("✅ Search completed with items:", foundItems);

    // Update game state with found items
    this.updateGameState({
      foundItems: foundItems,
      playerItems: [...this.gameState.playerItems, ...foundItems],
    });

    // For now, return to start screen
    // In full game, this would transition to combat
    setTimeout(() => {
      this.showScreen("start");
    }, 1000);
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
        startSearch: (locationData) => this.startSearchScreen(locationData),
        // Quick test searches using items config
        testOffice: () => {
          const locationData =
            ITEMS_UTILS.generateLocationData("detectiveOffice");
          this.startSearchScreen(locationData);
        },
        testForest: () => {
          const locationData =
            ITEMS_UTILS.generateLocationData("forestClearing");
          this.startSearchScreen(locationData);
        },
        testCatacombs: () => {
          const locationData =
            ITEMS_UTILS.generateLocationData("darkCatacombs");
          this.startSearchScreen(locationData);
        },
        testRandom: () => {
          const locationData = ITEMS_UTILS.createTestLocation(6);
          this.startSearchScreen(locationData);
        },
        // Test game over scenarios
        testGameOverSearch: () => {
          this.gameOverSearchExhaustion();
        },
        testGameOverTree: () => {
          this.gameOverTreeAttack();
        },
        // Test victory scenario
        testVictory: () => {
          this.triggerVictory({
            itemsFound: 21,
            timeElapsed: 1200,
            phasesCompleted: 3,
          });
        },
        // Test story segments
        testStoryIntro: () => {
          const locationData =
            ITEMS_UTILS.generateLocationData("detectiveOffice");
          this.showStorySegment("intro", locationData);
        },
        testStoryInvestigation: () => {
          const locationData =
            ITEMS_UTILS.generateLocationData("forestClearing");
          this.showStorySegment("investigation", locationData);
        },
        testStoryConfrontation: () => {
          const locationData =
            ITEMS_UTILS.generateLocationData("darkCatacombs");
          this.showStorySegment("confrontation", locationData);
        },
        testStoryVictory: () => {
          this.showStorySegment("victorySetup");
        },
        testStoryDefeat: () => {
          this.showStorySegment("defeatSetup");
        },
        testStoryRandom: () => {
          const testSegment = STORY_UTILS.createTestSegment(4);
          this.screens.storySegment.initializeStorySegment(testSegment);
          this.showScreen("storySegment");
        },
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
