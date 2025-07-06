// Loading Screen Class - Extends Screen base class
class LoadingScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Loading-specific properties
    this.loadingComplete = false;
    this.loadingStartTime = 0;
    this.assetsToLoad = 0;
    this.assetsLoaded = 0;
    this.progressInterval = null;
    this.imageCache = new Map();
    this.audioCache = new Map();
    this.currentMessageIndex = 0;

    console.log("🔄 LoadingScreen instance created");
  }

  render() {
    // Inject HTML content into the container
    this.container.innerHTML = `
      <div class="loading-content">
        <img
          src="images/company-logo.png"
          alt="Company Logo"
          class="loading-logo"
          id="loadingLogo"
        />
        <h1 class="loading-text" id="loadingText">Loading...</h1>
        <div class="loading-bar-container">
          <div class="loading-bar" id="loadingBar"></div>
        </div>
        <div class="loading-percentage" id="loadingPercentage">0%</div>
      </div>

      <!-- Background layers -->
      <div class="stars-layer"></div>
      <div class="asteroids-layer"></div>
      <div class="particles-layer"></div>
    `;

    // Initialize the content
    this.updateLoadingMessage();
  }

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Loading screen specific event listeners
    document.addEventListener(
      "click",
      () => {
        this.enableAudio();
      },
      { once: true }
    );
  }

  init() {
    console.log("🚀 Initializing Loading Screen");

    // Call parent init
    super.init();

    // Start loading process
    this.loadingStartTime = Date.now();
    this.startLoadingProcess();
  }

  startLoadingProcess() {
    // Start progress animation
    this.startProgressAnimation();

    // Load all assets
    this.loadAllAssets();

    // Cycle through loading messages
    this.cycleLoadingMessages();

    // Play loading sound
    if (this.audioManager) {
      this.audioManager.playSound("loading_ambient", true, 0.3);
    }
  }

  startProgressAnimation() {
    this.progressInterval = this.setManagedInterval(() => {
      this.updateLoadingProgress();

      if (this.loadingComplete) {
        this.completeLoading();
      }
    }, 50);
  }

  updateLoadingProgress() {
    if (this.loadingComplete) return;

    const elapsed = Date.now() - this.loadingStartTime;
    const minimumTime = GAME_CONFIG.MINIMUM_LOADING_TIME;

    // Calculate progress based on assets loaded and minimum time
    const assetProgress =
      this.assetsToLoad > 0 ? this.assetsLoaded / this.assetsToLoad : 0;
    const timeProgress = Math.min(elapsed / minimumTime, 1);

    // Use the slower of the two progress indicators
    const overallProgress = Math.min(assetProgress, timeProgress);
    const percentage = Math.floor(overallProgress * 100);

    // Update UI elements
    this.updateElementSafe("loadingPercentage", percentage + "%");

    const loadingBar = document.getElementById("loadingBar");
    if (loadingBar) {
      loadingBar.style.width = percentage + "%";
    }

    // Check if loading is complete
    if (assetProgress >= 1 && elapsed >= minimumTime) {
      this.loadingComplete = true;
    }
  }

  cycleLoadingMessages() {
    const messages = GAME_CONFIG.screens.loading.messages;

    const messageInterval = this.setManagedInterval(() => {
      if (this.loadingComplete) return;

      const message = messages[this.currentMessageIndex];
      this.updateElementSafe("loadingText", message);

      this.currentMessageIndex =
        (this.currentMessageIndex + 1) % messages.length;
    }, 2000);
  }

  async loadAllAssets() {
    // Define assets to load
    const imagesToLoad = [
      // Core game images
      "images/logo.png",
      "images/company-logo.png",
      "images/rusty.png",
      "images/box.png",
      "images/seed.png", // Used in game over screen
      "images/favicon.ico",

      // Tree images (different phases)
      "images/tree.png",
      "images/tree-small.png",
      "images/tree-stronger.png",

      // Background images
      "images/park-bg.png", // Detective office background
      "images/woods-bg.png", // Forest clearing background
      "images/catacomb-bg.png", // Dark catacombs background
      "images/void-battle-1.png", // Fight background phase 1
      "images/void-battle-2.png", // Fight background phase 2
      "images/void-battle-3.png", // Fight background phase 3

      // UI elements
      "images/magnifying-glass.png", // Detective badge and UI
      "images/sparkles2.png", // Sparkle effects
      "images/pebble.png", // Pebble cards in fight

      // Tree symbol images
      "images/symbol-detection.png",
      "images/symbol-weakness.png",
      "images/symbol-emotional.png",
      "images/symbol-mental.png",

      // All 21 item images
      "images/item_1.png", // Part Sign
      "images/item_2.png", // Milkshake
      "images/item_3.png", // Baseball Cap
      "images/item_4.png", // Map
      "images/item_5.png", // No Walking Sign
      "images/item_6.png", // Horseshoe
      "images/item_7.png", // Arrow
      "images/item_8.png", // Acorn
      "images/item_9.png", // Water Bottle
      "images/item_10.png", // Pink Flower
      "images/item_11.png", // Fallen Leaf
      "images/item_12.png", // Pad Lock
      "images/item_13.png", // Pinecone
      "images/item_14.png", // Tennis Ball
      "images/item_15.png", // Purse
      "images/item_16.png", // Street Lamp
      "images/item_17.png", // Message Board
      "images/item_18.png", // Stereo
      "images/item_19.png", // Rock
      "images/item_20.png", // Backpack
      "images/item_21.png", // Flying Kite
    ];

    const audioFiles = [
      // Music tracks
      "audio/main-menu.mp3",
      "audio/story-1.mp3",
      "audio/story-2.mp3",
      "audio/story-3.mp3",
      "audio/search-park.mp3",
      "audio/search-forest.mp3",
      "audio/search-catacombs.mp3",
      "audio/battle-park.mp3",
      "audio/battle-forest.mp3",
      "audio/battle-catacombs.mp3",
      "audio/end-win.mp3",
      "audio/end-lose.mp3",

      // Sound effects - UI
      "audio/click.mp3",
      "audio/button-hover.mp3",
      "audio/screen-transition.mp3",
      "audio/typewriter_click.mp3",
      "audio/page-turn.mp3",

      // Sound effects - Game mechanics
      "audio/success.mp3",
      "audio/item-found.mp3",
      "audio/item-sparkle.mp3",
      "audio/stamina-low.mp3",

      // Sound effects - Combat
      "audio/card-select.mp3",
      "audio/card-throw.mp3",
      "audio/card-hit.mp3",
      "audio/damage.mp3",
      "audio/cursed.mp3",
      "audio/tree-hurt.mp3",
      "audio/tree-attack.mp3",

      // Sound effects - Outcomes
      "audio/victory-fanfare.mp3",
      "audio/defeat-sting.mp3",

      // Sound effects - Ambient
      "audio/loading_ambient.mp3",
      "audio/background.mp3", // Legacy fallback
    ];

    this.assetsToLoad = imagesToLoad.length + audioFiles.length;

    // Load assets in parallel
    try {
      await Promise.all([
        this.loadImages(imagesToLoad),
        this.loadAudio(audioFiles),
      ]);
    } catch (error) {
      console.warn("Some assets failed to load:", error);
      // Continue anyway - loading complete
    }
  }

  async loadImages(imagesToLoad) {
    const imagePromises = imagesToLoad.map((imagePath) => {
      return new Promise((resolve) => {
        if (this.imageCache.has(imagePath)) {
          this.assetsLoaded++;
          resolve();
          return;
        }

        const img = new Image();

        const onLoad = () => {
          this.assetsLoaded++;
          this.imageCache.set(imagePath, img);
          cleanup();
          resolve();
        };

        const onError = () => {
          console.warn(`Failed to load image: ${imagePath}`);
          this.assetsLoaded++;
          cleanup();
          resolve();
        };

        const cleanup = () => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
        };

        img.addEventListener("load", onLoad);
        img.addEventListener("error", onError);
        img.src = imagePath;
      });
    });

    return Promise.all(imagePromises);
  }

  async loadAudio(audioFiles) {
    const audioPromises = audioFiles.map((audioPath) => {
      return new Promise((resolve) => {
        const audio = new Audio();
        audio.volume = 0.3;

        // Set loop for background music
        if (audioPath.includes("background")) {
          audio.loop = true;
        }

        const onCanPlay = () => {
          this.assetsLoaded++;
          const key = this.getAudioKey(audioPath);
          if (key) {
            this.audioCache.set(key, audio);
          }
          cleanup();
          resolve();
        };

        const onError = () => {
          console.warn(`Failed to load audio: ${audioPath}`);
          this.assetsLoaded++;
          cleanup();
          resolve();
        };

        const cleanup = () => {
          audio.removeEventListener("canplaythrough", onCanPlay);
          audio.removeEventListener("error", onError);
        };

        audio.addEventListener("canplaythrough", onCanPlay);
        audio.addEventListener("error", onError);
        audio.src = audioPath;
      });
    });

    return Promise.all(audioPromises);
  }

  getAudioKey(audioPath) {
    // Extract key from file path
    const filename = audioPath.split("/").pop().split(".")[0];
    return filename;
  }

  updateLoadingMessage() {
    const messages = GAME_CONFIG.screens.loading.messages;
    const message = messages[0]; // Start with first message
    this.updateElementSafe("loadingText", message);
  }

  completeLoading() {
    console.log("✅ Loading complete");

    // Stop loading sound
    if (this.audioManager) {
      this.audioManager.stopSound("loading_ambient");
    }

    // Play completion sound
    if (this.audioManager) {
      this.audioManager.playSound("success", false, 0.5);
    }

    // Clear progress interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    // Update to 100%
    this.updateElementSafe("loadingPercentage", "100%");
    const loadingBar = document.getElementById("loadingBar");
    if (loadingBar) {
      loadingBar.style.width = "100%";
    }

    // Show completion message
    this.updateElementSafe("loadingText", "Loading Complete!");

    // Notify game controller
    this.setManagedTimeout(() => {
      if (window.game) {
        window.game.onLoadingComplete();
      }
    }, 1000);
  }

  handleKeydown(e) {
    // Call parent handler
    super.handleKeydown(e);

    // Skip loading on Enter or Space (for testing)
    if (e.code === "Enter" || e.code === "Space") {
      if (!this.loadingComplete) {
        console.log("⏭️ Skipping loading (debug)");
        this.loadingComplete = true;
        this.completeLoading();
      }
    }
  }

  // Utility methods
  updateElementSafe(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
      if (typeof content === "string") {
        element.textContent = content;
      } else {
        element.innerHTML = content;
      }
    }
  }

  getImage(imagePath) {
    return this.imageCache.get(imagePath);
  }

  getAudio(audioKey) {
    return this.audioCache.get(audioKey);
  }

  // Cleanup when screen is destroyed
  destroy() {
    // Stop loading sound
    if (this.audioManager) {
      this.audioManager.stopSound("loading_ambient");
    }

    // Clear progress interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Loading Screen destroyed");
  }
}

// Make LoadingScreen available globally
window.LoadingScreen = LoadingScreen;

console.log("📱 Loading Screen class loaded");
