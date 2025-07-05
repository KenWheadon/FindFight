// Game Over Screen Class - Extends Screen base class
class GameOverScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Game over screen specific properties
    this.gameOverType = "search"; // 'search' or 'tree'
    this.gameOverMessage = "";
    this.buttonsEnabled = true;
    this.fadeInComplete = false;

    console.log("💀 GameOverScreen instance created");
  }

  // Initialize with game over type and message
  initializeGameOver(type, message = "") {
    this.gameOverType = type;
    this.gameOverMessage = message;
    console.log(
      `💀 Game Over initialized - Type: ${type}, Message: ${message}`
    );
  }

  render() {
    // Determine content based on game over type
    const content = this.getGameOverContent();

    // Inject HTML content into the container
    this.container.innerHTML = `
      <div class="game-over-content">
        <div class="game-over-header">
          <div class="game-over-icon">
            ${content.icon}
          </div>
          <h1 class="game-over-title">${content.title}</h1>
        </div>

        <div class="game-over-story">
          <div class="rusty-portrait">
            <div class="rusty-image">🦝</div>
          </div>
          <div class="game-over-narrative">
            <p class="game-over-main-text">${content.mainText}</p>
            <p class="game-over-sub-text">${content.subText}</p>
          </div>
        </div>

        <div class="game-over-controls">
          <div class="game-over-stats">
            <div class="stat-item">
              <span class="stat-label">Investigation Status:</span>
              <span class="stat-value">${content.status}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Stamina Remaining:</span>
              <span class="stat-value">0%</span>
            </div>
          </div>
          
          <div class="game-over-buttons">
            <button class="game-button primary pulse" id="restartBtn">
              <span class="button-icon">🔄</span>
              <span class="button-text">Try Again</span>
            </button>
            <button class="game-button secondary" id="menuBtn">
              <span class="button-icon">🏠</span>
              <span class="button-text">Main Menu</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Background layers -->
      <div class="stars-layer"></div>
      <div class="asteroids-layer"></div>
      <div class="particles-layer"></div>
    `;

    // Initialize elements
    this.initializeElements();
  }

  getGameOverContent() {
    if (this.gameOverType === "tree") {
      return {
        icon: "🌲",
        title: "The Tree Claims Victory",
        mainText:
          'The Evil Tree\'s roots have drained your strength. Its ancient whispers echo: "Another detective falls to the eternal hunger of the cursed box."',
        subText:
          "Rusty collapses, overwhelmed by the tree's malevolent power. The investigation ends here... but the mystery remains.",
        status: "Defeated by Evil Tree",
      };
    } else {
      return {
        icon: "🔍",
        title: "Investigation Exhausted",
        mainText:
          "The endless search has drained Rusty's energy. \"Can't... keep looking. These objects... they're everywhere but nowhere.\"",
        subText:
          "Sometimes even the best detective runs out of steam. The cursed box's illusions proved too taxing.",
        status: "Search Exhaustion",
      };
    }
  }

  initializeElements() {
    // Set up fade-in animations
    const gameOverContent = this.container.querySelector(".game-over-content");
    if (gameOverContent) {
      gameOverContent.style.opacity = "0";
      gameOverContent.style.transform = "translateY(30px)";
      gameOverContent.style.transition = "all 1s ease-out";
    }

    // Set up individual sections for staggered animation
    const sections = [
      ".game-over-header",
      ".game-over-story",
      ".game-over-controls",
    ];

    sections.forEach((selector, index) => {
      const element = this.container.querySelector(selector);
      if (element) {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = `all 0.8s ease-out ${index * 0.3}s`;
      }
    });
  }

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Get DOM elements
    const restartBtn = document.getElementById("restartBtn");
    const menuBtn = document.getElementById("menuBtn");

    // Restart button
    if (restartBtn) {
      restartBtn.addEventListener("click", (e) => {
        this.createRippleEffect(restartBtn, e);
        this.restartGame();
      });
    }

    // Menu button
    if (menuBtn) {
      menuBtn.addEventListener("click", (e) => {
        this.createRippleEffect(menuBtn, e);
        this.returnToMenu();
      });
    }
  }

  init() {
    console.log("🚀 Initializing Game Over Screen");

    // Call parent init
    super.init();

    // Play game over sound
    if (this.audioManager) {
      this.audioManager.playSound("game_over", false, 0.6);
    }

    // Trigger screen shake effect
    this.triggerScreenShake(500);

    // Start fade-in animation after a brief delay
    this.setManagedTimeout(() => {
      this.startFadeInAnimation();
    }, 800);
  }

  startFadeInAnimation() {
    console.log("🎭 Starting fade-in animation");

    const gameOverContent = this.container.querySelector(".game-over-content");
    if (gameOverContent) {
      gameOverContent.style.opacity = "1";
      gameOverContent.style.transform = "translateY(0)";
    }

    // Animate individual sections
    const sections = [
      ".game-over-header",
      ".game-over-story",
      ".game-over-controls",
    ];

    sections.forEach((selector, index) => {
      const element = this.container.querySelector(selector);
      if (element) {
        this.setManagedTimeout(() => {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }, 300 + index * 300);
      }
    });

    // Enable buttons after animation
    this.setManagedTimeout(() => {
      this.fadeInComplete = true;
      this.buttonsEnabled = true;
    }, 1500);
  }

  restartGame() {
    if (!this.buttonsEnabled) return;

    console.log("🔄 Restarting game from Game Over Screen");

    this.buttonsEnabled = false;

    // Play restart sound
    if (this.audioManager) {
      this.audioManager.playSound("button_click", false, 0.7);
    }

    // Show restarting message
    this.showTemporaryMessage("Restarting investigation...", "info", 2000);

    // Fade out the screen
    const gameOverContent = this.container.querySelector(".game-over-content");
    if (gameOverContent) {
      gameOverContent.style.opacity = "0";
      gameOverContent.style.transform = "translateY(-20px)";
    }

    // Restart the game
    this.setManagedTimeout(() => {
      if (window.game) {
        window.game.restartGame();
      }
    }, 1000);
  }

  returnToMenu() {
    if (!this.buttonsEnabled) return;

    console.log("🏠 Returning to main menu");

    this.buttonsEnabled = false;

    // Play menu sound
    if (this.audioManager) {
      this.audioManager.playSound("button_click", false, 0.7);
    }

    // Show menu message
    this.showTemporaryMessage("Returning to main menu...", "info", 2000);

    // Fade out the screen
    const gameOverContent = this.container.querySelector(".game-over-content");
    if (gameOverContent) {
      gameOverContent.style.opacity = "0";
      gameOverContent.style.transform = "translateY(-20px)";
    }

    // Return to start screen
    this.setManagedTimeout(() => {
      if (window.game) {
        window.game.showScreen("start");
      }
    }, 1000);
  }

  handleKeydown(e) {
    // Call parent handler
    super.handleKeydown(e);

    // Game over screen specific keyboard shortcuts
    if (this.fadeInComplete && this.buttonsEnabled) {
      if (e.code === "Enter" || e.code === "Space") {
        this.restartGame();
      }

      if (e.code === "KeyM") {
        this.returnToMenu();
      }
    }

    // Debug shortcut
    if (e.code === "KeyD" && e.ctrlKey) {
      this.debug();
    }
  }

  handleEscape() {
    console.log("🔙 Escape pressed on Game Over Screen");

    if (this.fadeInComplete && this.buttonsEnabled) {
      this.returnToMenu();
    }
  }

  // Debug method override
  debug() {
    super.debug();
    console.log("Game Over Screen Specific Debug Info:", {
      gameOverType: this.gameOverType,
      gameOverMessage: this.gameOverMessage,
      fadeInComplete: this.fadeInComplete,
      buttonsEnabled: this.buttonsEnabled,
    });
  }

  // Clean up when screen is destroyed
  destroy() {
    // Stop any audio
    if (this.audioManager) {
      this.audioManager.stopSound("game_over");
    }

    // Reset state
    this.fadeInComplete = false;
    this.buttonsEnabled = true;
    this.gameOverType = "search";
    this.gameOverMessage = "";

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Game Over Screen destroyed");
  }
}

// Make GameOverScreen available globally
window.GameOverScreen = GameOverScreen;

console.log("💀 Game Over Screen class loaded");
