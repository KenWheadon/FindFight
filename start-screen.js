// Start Screen Class - Extends Screen base class
class StartScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Start screen specific properties
    this.magicalBox = null;
    this.isBoxOpen = false;
    this.introShown = false;
    this.buttonsEnabled = true;

    console.log("🦝 StartScreen instance created");
  }

  render() {
    // The HTML structure is already in index.html
    // We just need to initialize interactive elements
    this.initializeElements();
  }

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Get DOM elements
    this.magicalBox = document.getElementById("magicalBox");
    const startGameBtn = document.getElementById("startGameBtn");
    const settingsBtn = document.getElementById("settingsBtn");

    // Magical box click handler
    if (this.magicalBox) {
      this.magicalBox.addEventListener("click", (e) => {
        this.handleBoxClick(e);
      });

      // Add hover effects
      this.magicalBox.addEventListener("mouseenter", () => {
        this.onBoxHover();
      });

      this.magicalBox.addEventListener("mouseleave", () => {
        this.onBoxLeave();
      });
    }

    // Button event listeners
    if (startGameBtn) {
      startGameBtn.addEventListener("click", (e) => {
        this.createRippleEffect(startGameBtn, e);
        this.startGame();
      });
    }

    if (settingsBtn) {
      settingsBtn.addEventListener("click", (e) => {
        this.createRippleEffect(settingsBtn, e);
        this.showSettings();
      });
    }
  }

  initializeElements() {
    // Set up the story intro
    const storyIntro = document.getElementById("storyIntro");
    if (storyIntro) {
      // Initially hide the story intro
      storyIntro.style.opacity = "0";
      storyIntro.style.transform = "translateY(20px)";
      storyIntro.style.transition = "all 0.8s ease-out";
    }

    // Set up buttons
    const buttons = document.querySelector(".start-buttons");
    if (buttons) {
      buttons.style.opacity = "0";
      buttons.style.transform = "translateY(20px)";
      buttons.style.transition = "all 0.8s ease-out";
    }

    // Add magical box glow effect
    if (this.magicalBox) {
      this.magicalBox.style.transition = "all 0.3s ease";
    }
  }

  init() {
    console.log("🚀 Initializing Start Screen");

    // Call parent init
    super.init();

    // Start background music
    if (this.audioManager) {
      this.audioManager.playSound("background_music", true, 0.4);
    }

    // Show introduction after a brief delay
    this.setManagedTimeout(() => {
      this.showIntroduction();
    }, 1000);
  }

  showIntroduction() {
    console.log("📖 Showing introduction");

    const storyIntro = document.getElementById("storyIntro");
    const buttons = document.querySelector(".start-buttons");

    if (storyIntro) {
      storyIntro.style.opacity = "1";
      storyIntro.style.transform = "translateY(0)";
    }

    if (buttons) {
      this.setManagedTimeout(() => {
        buttons.style.opacity = "1";
        buttons.style.transform = "translateY(0)";
      }, 500);
    }

    this.introShown = true;
  }

  handleBoxClick(event) {
    if (!this.introShown || this.isBoxOpen) return;

    console.log("📦 Magical box clicked");

    // Play click sound
    if (this.audioManager) {
      this.audioManager.playSound("click", false, 0.8);
    }

    // Create ripple effect
    this.createRippleEffect(this.magicalBox, event);

    // Trigger box opening animation
    this.openMagicalBox();
  }

  openMagicalBox() {
    if (this.isBoxOpen) return;

    this.isBoxOpen = true;

    // Add opening animation class
    this.magicalBox.classList.add("opening");

    // Create particle burst at box location
    const rect = this.magicalBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    this.createParticleBurst(centerX, centerY, 15, "rgba(212, 175, 55, 0.8)");

    // Screen shake effect
    this.triggerScreenShake(400);

    // Play mystical sound
    if (this.audioManager) {
      this.audioManager.playSound("mystical_open", false, 0.6);
    }

    // Update box content
    this.setManagedTimeout(() => {
      const boxContent = this.magicalBox.querySelector(".box-content");
      if (boxContent) {
        boxContent.innerHTML = `
          <div class="box-icon">✨</div>
          <div class="box-text">The Box Opens...</div>
        `;
      }
    }, 300);

    // Enable start button and highlight it
    this.setManagedTimeout(() => {
      this.highlightStartButton();
    }, 800);
  }

  highlightStartButton() {
    const startBtn = document.getElementById("startGameBtn");
    if (startBtn) {
      startBtn.classList.add("highlighted");
      startBtn.style.animation = "pulse 2s ease-in-out infinite";

      // Show success message
      this.showSuccessMessage(
        "The detective's journey begins...\nClick 'Begin Adventure' to start!"
      );
    }
  }

  onBoxHover() {
    if (!this.introShown || this.isBoxOpen) return;

    this.magicalBox.style.transform = "scale(1.05)";
    this.magicalBox.style.boxShadow = "0 0 30px rgba(212, 175, 55, 0.6)";

    // Play hover sound
    if (this.audioManager) {
      this.audioManager.playSound("hover", false, 0.3);
    }
  }

  onBoxLeave() {
    if (!this.introShown || this.isBoxOpen) return;

    this.magicalBox.style.transform = "scale(1)";
    this.magicalBox.style.boxShadow = "0 0 20px rgba(139, 69, 19, 0.5)";
  }

  startGame() {
    if (!this.buttonsEnabled) return;

    console.log("🎯 Starting game from Start Screen");

    this.buttonsEnabled = false;

    // Play start sound
    if (this.audioManager) {
      this.audioManager.playSound("game_start", false, 0.7);
    }

    // Show starting message
    this.showTemporaryMessage("Beginning your adventure...", "info", 2000);

    // Fade out background music
    this.fadeOutBackgroundMusic();

    // Transition to game
    this.setManagedTimeout(() => {
      if (window.game) {
        window.game.beginAdventure();
      }
    }, 1500);
  }

  showSettings() {
    if (!this.buttonsEnabled) return;

    console.log("⚙️ Opening settings");

    // Play click sound
    if (this.audioManager) {
      this.audioManager.playSound("click", false, 0.6);
    }

    // Show settings popup (placeholder for now)
    this.showTemporaryMessage("Settings menu coming soon!", "info", 2000);
  }

  fadeOutBackgroundMusic() {
    if (!this.audioManager) return;

    // Gradual fade out effect
    let volume = 0.4;
    const fadeInterval = setInterval(() => {
      volume -= 0.05;
      if (volume <= 0) {
        this.audioManager.stopSound("background_music");
        clearInterval(fadeInterval);
      }
      // In real implementation, would adjust audio volume
    }, 100);

    this.intervals.push(fadeInterval);
  }

  handleKeydown(e) {
    // Call parent handler
    super.handleKeydown(e);

    // Start screen specific keyboard shortcuts
    if (e.code === "Enter" || e.code === "Space") {
      if (this.introShown && !this.isBoxOpen) {
        // Simulate box click
        this.openMagicalBox();
      } else if (this.isBoxOpen && this.buttonsEnabled) {
        // Start game
        this.startGame();
      }
    }

    // Debug shortcut
    if (e.code === "KeyD" && e.ctrlKey) {
      this.debug();
    }
  }

  handleEscape() {
    console.log("🔙 Escape pressed on Start Screen");

    // Could implement a quit confirmation dialog
    this.showTemporaryMessage("Press F5 to refresh the game", "info", 3000);
  }

  // Override parent method to inject Start Screen specific CSS
  startAnimations() {
    // Call parent animations
    super.startAnimations();

    // Add start screen specific CSS
    this.injectCSS(
      "start-screen-animations",
      `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .magical-box.opening {
        animation: boxOpen 0.8s ease-out;
      }
      
      @keyframes boxOpen {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(5deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      
      .game-button.highlighted {
        border-color: #d4af37 !important;
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.5) !important;
      }
    `
    );
  }

  // Debug method override
  debug() {
    super.debug();
    console.log("Start Screen Specific Debug Info:", {
      isBoxOpen: this.isBoxOpen,
      introShown: this.introShown,
      buttonsEnabled: this.buttonsEnabled,
    });
  }

  // Clean up when screen is destroyed
  destroy() {
    // Stop background music
    if (this.audioManager) {
      this.audioManager.stopSound("background_music");
    }

    // Reset state
    this.isBoxOpen = false;
    this.introShown = false;
    this.buttonsEnabled = true;

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Start Screen destroyed");
  }
}

// Make StartScreen available globally
window.StartScreen = StartScreen;

console.log("📱 Start Screen class loaded");
