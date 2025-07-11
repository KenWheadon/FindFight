// Main Game Controller - Rusty vs. The Evil Tree
class RustyGame {
  constructor() {
    // Centralized game state
    this.gameState = {
      currentScreen: "loading",
      currentPhase: 1,
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
      gameOverType: null,
      gameOverMessage: "",
    };

    // Screen instances
    this.screens = {};
    this.currentScreenInstance = null;
    this.gameContainer = null;

    // Centralized Audio Manager
    this.audioManager = null;

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

    // Initialize centralized audio manager
    this.initializeAudioManager();

    // Initialize screens
    this.initializeScreens();

    // Setup global event listeners
    this.setupEventListeners();

    // Start with loading screen
    this.showScreen("loading");
  }

  initializeAudioManager() {
    this.audioManager = {
      enabled: false,
      sounds: {},
      currentMusic: null,
      currentMusicName: null,
      musicVolume: 0.4,
      sfxVolume: 0.7,

      enable() {
        this.enabled = true;
        console.log("🔊 Centralized audio manager enabled");
      },

      preloadAudio(name, src) {
        if (!this.sounds[name]) {
          this.sounds[name] = new Audio(src);
          this.sounds[name].preload = "auto";
          console.log(`🎵 Preloaded audio: ${name}`);
        }
      },

      playMusic(musicName, loop = true, volume = null) {
        if (!this.enabled) return;

        const actualVolume = volume !== null ? volume : this.musicVolume;
        const audioPath = `audio/${musicName}.mp3`;

        console.log(`🎵 Playing music: ${musicName}`);

        // Stop current music if different
        if (this.currentMusic && this.currentMusicName !== musicName) {
          this.stopMusic();
        }

        // Don't restart if same music is already playing
        if (
          this.currentMusicName === musicName &&
          this.currentMusic &&
          !this.currentMusic.paused
        ) {
          return;
        }

        // Preload if not already loaded
        this.preloadAudio(musicName, audioPath);

        this.currentMusic = this.sounds[musicName];
        this.currentMusicName = musicName;
        this.currentMusic.loop = loop;
        this.currentMusic.volume = actualVolume;
        this.currentMusic.currentTime = 0;

        this.currentMusic.play().catch((e) => {
          console.warn(`Music playback failed for ${musicName}:`, e);
        });
      },

      stopMusic() {
        if (this.currentMusic) {
          console.log(`🔇 Stopping music: ${this.currentMusicName}`);
          this.currentMusic.pause();
          this.currentMusic.currentTime = 0;
          this.currentMusic = null;
          this.currentMusicName = null;
        }
      },

      fadeOutMusic(duration = 1000) {
        if (!this.currentMusic) return;

        const startVolume = this.currentMusic.volume;
        const fadeSteps = 20;
        const stepDuration = duration / fadeSteps;
        const volumeStep = startVolume / fadeSteps;

        let step = 0;
        const fadeInterval = setInterval(() => {
          step++;
          this.currentMusic.volume = Math.max(
            0,
            startVolume - volumeStep * step
          );

          if (step >= fadeSteps) {
            clearInterval(fadeInterval);
            this.stopMusic();
          }
        }, stepDuration);
      },

      playSound(soundName, loop = false, volume = null) {
        if (!this.enabled) return;

        const actualVolume = volume !== null ? volume : this.sfxVolume;
        const audioPath = `audio/${soundName}.mp3`;

        console.log(`🎵 Playing sound: ${soundName}`);

        // Preload if not already loaded
        this.preloadAudio(soundName, audioPath);

        const sound = this.sounds[soundName];
        sound.loop = loop;
        sound.volume = actualVolume;
        sound.currentTime = 0;

        sound.play().catch((e) => {
          console.warn(`Sound playback failed for ${soundName}:`, e);
        });
      },

      stopSound(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;

        console.log(`🔇 Stopped sound: ${soundName}`);
        this.sounds[soundName].pause();
        this.sounds[soundName].currentTime = 0;
      },

      stopAllSounds() {
        Object.keys(this.sounds).forEach((soundName) => {
          if (soundName !== this.currentMusicName) {
            this.stopSound(soundName);
          }
        });
      },

      setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
          this.currentMusic.volume = this.musicVolume;
        }
      },

      setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
      },
    };

    // Enable audio on first user interaction
    document.addEventListener(
      "click",
      () => {
        this.audioManager.enable();
      },
      { once: true }
    );

    console.log("🎵 Centralized audio manager initialized");
  }

  // Helper method to determine music based on screen and context
  getMusicForScreen(screenName, context = {}) {
    switch (screenName) {
      case "start":
        return "main-menu";

      case "storySegment":
        // Determine story music based on segment or phase
        const phase = context.phase || this.gameState.currentPhase || 1;
        if (phase === 1) return "story-1";
        if (phase === 2) return "story-2";
        if (phase === 3) return "story-3";
        return "story-1";

      case "search":
        // Determine search music based on location
        const location = context.location || "detectiveOffice";
        if (location === "detectiveOffice") return "search-park";
        if (location === "forestClearing") return "search-forest";
        if (location === "darkCatacombs") return "search-catacombs";
        return "search-park";

      case "fight":
        // Determine battle music based on phase
        const fightPhase = context.phase || this.gameState.currentPhase || 1;
        if (fightPhase === 1) return "battle-park";
        if (fightPhase === 2) return "battle-forest";
        if (fightPhase === 3) return "battle-catacombs";
        return "battle-park";

      case "gameOver":
        return "end-lose";

      case "victory":
        return "end-win";

      default:
        return null;
    }
  }

  initializeScreens() {
    // Create screen instances with the shared container and audio manager
    if (window.LoadingScreen) {
      this.screens.loading = new LoadingScreen(this.gameContainer, "loading");
      this.screens.loading.audioManager = this.audioManager;
    }

    if (window.StartScreen) {
      this.screens.start = new StartScreen(this.gameContainer, "start");
      this.screens.start.audioManager = this.audioManager;
    }

    if (window.SearchScreen) {
      this.screens.search = new SearchScreen(this.gameContainer, "search");
      this.screens.search.audioManager = this.audioManager;
    }

    if (window.FightScreen) {
      this.screens.fight = new FightScreen(this.gameContainer, "fight");
      this.screens.fight.audioManager = this.audioManager;
    }

    if (window.GameOverScreen) {
      this.screens.gameOver = new GameOverScreen(
        this.gameContainer,
        "gameOver"
      );
      this.screens.gameOver.audioManager = this.audioManager;
    }

    if (window.VictoryScreen) {
      this.screens.victory = new VictoryScreen(this.gameContainer, "victory");
      this.screens.victory.audioManager = this.audioManager;
    }

    if (window.StorySegmentScreen) {
      this.screens.storySegment = new StorySegmentScreen(
        this.gameContainer,
        "storySegment"
      );
      this.screens.storySegment.audioManager = this.audioManager;
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
  showScreen(screenName, context = {}) {
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

    // Handle music transitions
    const newMusic = this.getMusicForScreen(screenName, context);
    if (newMusic) {
      this.audioManager.playMusic(newMusic);
    }

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

    // Show the story segment screen with context for music
    this.showScreen("storySegment", { phase: this.gameState.currentPhase });
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

    // Store game over info for when we actually show the game over screen
    this.gameState.gameOverType = type;
    this.gameState.gameOverMessage = message;

    // Show defeat setup story first
    this.showStorySegment("defeatSetup");
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

    // Update game state to track progression
    this.updateGameState({ currentPhase: 2 });

    // Reset item usage state and found items for new level
    this.resetItemUsageState();
    this.resetFoundItemsState();

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

    // Update game state to track progression
    this.updateGameState({ currentPhase: 3 });

    // Reset item usage state and found items for new level
    this.resetItemUsageState();
    this.resetFoundItemsState();

    const locationData = ITEMS_UTILS.generateLocationData("darkCatacombs");
    if (!locationData) {
      console.error("Failed to generate catacombs location data");
      this.showScreen("start");
      return;
    }

    // Show confrontation story segment, then go to catacombs
    this.showStorySegment("confrontation", locationData);
  }

  // Reset item usage state between levels
  resetItemUsageState() {
    console.log("🔄 Resetting item usage state for new level");

    // Reset items through ITEMS_UTILS if the method exists
    if (ITEMS_UTILS && ITEMS_UTILS.resetAllItemUsage) {
      ITEMS_UTILS.resetAllItemUsage();
    } else {
      console.warn(
        "ITEMS_UTILS.resetAllItemUsage method not found - items may not reset properly"
      );
    }
  }

  // Reset found items state between levels
  resetFoundItemsState() {
    console.log("🧹 Resetting found items state for new level");

    // Clear found items from previous level
    const previousFoundItems = this.gameState.foundItems?.length || 0;
    const previousPlayerItems = this.gameState.playerItems?.length || 0;

    // Reset the arrays
    this.gameState.foundItems = [];
    this.gameState.playerItems = [];
    this.gameState.playerHand = [];
    this.gameState.visibleItems = [];

    console.log(
      `✅ Cleared ${previousFoundItems} found items and ${previousPlayerItems} player items`
    );
    console.log("🆕 Starting new level with fresh item state");
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
      // Pass location context for music
      this.showScreen("search", { location: locationData.id });
    } else {
      console.error("Search screen not available!");
    }
  }

  // Handle search completion - now includes stamina tracking
  onSearchComplete(foundItems, finalStamina) {
    console.log(
      "✅ Search completed with items:",
      foundItems,
      "Final stamina:",
      finalStamina
    );

    // Update game state with found items and stamina
    // Note: Don't accumulate playerItems - each level should start fresh
    this.updateGameState({
      foundItems: foundItems,
      playerItems: foundItems, // Replace, don't add to existing items
      playerStamina: finalStamina, // Store the stamina from search
    });

    console.log("🔍 Updated game state - Found items:", foundItems.length);
    console.log(
      "🎒 Player items for fight:",
      this.gameState.playerItems.length
    );

    // Transition to fight screen with the stamina value
    this.startFightScreen(foundItems, null, finalStamina);
  }

  // Method to start fight screen with found items and stamina
  startFightScreen(foundItems, phase = null, startingStamina = null) {
    console.log(
      "⚔️ Starting fight screen with items:",
      foundItems,
      "Starting stamina:",
      startingStamina
    );

    // Use current phase from game state if not specified
    const currentPhase = phase || this.gameState.currentPhase || 1;

    // Use passed stamina or default to game state stamina or 100
    const stamina =
      startingStamina !== null
        ? startingStamina
        : this.gameState.playerStamina || 100;

    if (this.screens.fight) {
      this.screens.fight.initializeFight(foundItems, currentPhase, stamina);
      // Pass phase context for music
      this.showScreen("fight", { phase: currentPhase });
    } else {
      console.error("Fight screen not available!");
      // Fallback to start screen
      this.showScreen("start");
    }
  }

  // Handle fight completion (called from fight screen)
  onFightComplete(phase, victory = true) {
    console.log(`⚔️ Fight completed - Phase ${phase}, Victory: ${victory}`);

    if (!victory) {
      // Player was defeated
      this.triggerGameOver("tree", "Defeated by the Evil Tree");
      return;
    }

    // Victory - check if this was the final phase
    if (phase >= 3) {
      // Final victory
      this.triggerVictory({
        itemsFound: this.gameState.foundItems?.length || 0,
        phasesCompleted: phase,
        timeElapsed: Date.now(), // Could track actual time
      });
    } else {
      // Progress to next phase
      if (phase === 1) {
        this.completeFirstLevel();
      } else if (phase === 2) {
        this.completeSecondLevel();
      }
    }
  }

  restartGame() {
    console.log("🔄 Restarting game");

    // Reset item usage state when restarting
    this.resetItemUsageState();

    // Reset found items state when restarting
    this.resetFoundItemsState();

    // Reset game state
    this.gameState = {
      currentScreen: "start",
      currentPhase: 1,
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
      gameOverType: null,
      gameOverMessage: "",
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
    // Pause music
    if (this.audioManager && this.audioManager.currentMusic) {
      this.audioManager.currentMusic.pause();
    }
  }

  resumeGame() {
    console.log("▶️ Game resumed");
    // Resume any paused timers/animations
    if (this.currentScreenInstance && this.currentScreenInstance.resume) {
      this.currentScreenInstance.resume();
    }
    // Resume music
    if (this.audioManager && this.audioManager.currentMusic) {
      this.audioManager.currentMusic.play().catch((e) => {
        console.warn("Failed to resume music:", e);
      });
    }
  }

  // Debug methods
  debug() {
    console.log("🔍 Game Debug Info:");
    console.log("Game State:", this.gameState);
    console.log("Current Screen:", this.currentScreenInstance?.screenName);
    console.log("Available Screens:", Object.keys(this.screens));
    console.log("Game Container:", this.gameContainer);
    console.log("Audio Manager:", this.audioManager);
    console.log("Current Music:", this.audioManager?.currentMusicName);

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
        audioManager: this.audioManager,
        startSearch: (locationData) => this.startSearchScreen(locationData),
        // Audio debug methods
        playMusic: (musicName) => this.audioManager.playMusic(musicName),
        stopMusic: () => this.audioManager.stopMusic(),
        setMusicVolume: (volume) => this.audioManager.setMusicVolume(volume),
        setSfxVolume: (volume) => this.audioManager.setSfxVolume(volume),
        // Item reset debug methods
        resetItems: () => this.resetItemUsageState(),
        resetFoundItems: () => this.resetFoundItemsState(),
        checkItemState: () => {
          console.log("Current item usage state:");
          if (ITEMS_UTILS && ITEMS_UTILS.debugItemUsage) {
            ITEMS_UTILS.debugItemUsage();
          }
        },
        checkFoundItemsState: () => {
          console.log("Current found items state:");
          console.log("Found items:", this.gameState.foundItems);
          console.log("Player items:", this.gameState.playerItems);
          console.log("Player hand:", this.gameState.playerHand);
          console.log("Current phase:", this.gameState.currentPhase);

          // Check for duplicates
          if (
            this.gameState.foundItems &&
            this.gameState.foundItems.length > 0
          ) {
            const itemNames = this.gameState.foundItems.map(
              (item) => item.name
            );
            const uniqueNames = [...new Set(itemNames)];
            if (itemNames.length !== uniqueNames.length) {
              console.warn("🚨 Duplicate items detected in foundItems!");
              console.warn("All items:", itemNames);
              console.warn("Unique items:", uniqueNames);
            }
          }
        },
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
        // Test fight scenarios with stamina
        testFightPhase1: () => {
          const testItems = ITEMS_UTILS.getRandomItems(10);
          this.startFightScreen(testItems, 1, 80); // Start with 80 stamina
        },
        testFightPhase2: () => {
          const testItems = ITEMS_UTILS.getRandomItems(15);
          this.startFightScreen(testItems, 2, 60); // Start with 60 stamina
        },
        testFightPhase3: () => {
          const testItems = ITEMS_UTILS.getRandomItems(21);
          this.startFightScreen(testItems, 3, 40); // Start with 40 stamina
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
        // Test level progression
        testLevelProgression: () => {
          console.log("Testing level progression...");
          this.completeFirstLevel();
        },
        testSecondLevelProgression: () => {
          console.log("Testing second level progression...");
          this.updateGameState({ currentPhase: 2 });
          this.completeSecondLevel();
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
