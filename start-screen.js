// Start Screen Class - Extends Screen base class
class StartScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Start screen specific properties
    this.buttonsEnabled = true;
    this.introShown = false;

    console.log("🦝 StartScreen instance created");
  }

  render() {
    // Inject HTML content into the container
    this.container.innerHTML = `
      <div class="start-content">
        <img 
          src="images/logo.png" 
          alt="Game Logo" 
          class="game-logo"
          id="gameLogo"
        />
        
        <h1 class="game-title">Rusty vs. The Evil Tree</h1>
        <p class="game-subtitle">A Hidden Object Adventure</p>

        <div class="story-intro" id="storyIntro">
          <div class="narrative-text">
            <p><strong>The Story:</strong></p>
            <p>"Name's Rusty. Rusty the Raccoon. Been chasing cases longer than I've had this trench coat. But this one? This one smelled... ancient. A wooden box, sealed tight and tied to vanishing people. They hired me to investigate. I opened it. Now I'm <em>in</em> it. And there's something down here with roots deeper than reason."</p>
          </div>
        </div>

        <div class="instructions" id="instructions">
          <div class="instruction-text">
            <p><strong>How to Play:</strong></p>
            <ul>
              <li>🔍 <strong>Search:</strong> Find hidden objects in surreal scenes</li>
              <li>🃏 <strong>Combat:</strong> Use found items as cards to fight the Evil Tree</li>
              <li>💚 <strong>Survive:</strong> Manage your stamina and exploit the tree's weaknesses</li>
              <li>🏆 <strong>Win:</strong> Reduce the Evil Tree's HP to 0 across 3 phases</li>
            </ul>
          </div>
        </div>

        <div class="start-buttons" id="startButtons">
          <button class="game-button primary" id="startGameBtn">
            🎮 Start Game
          </button>
          <button class="game-button secondary" id="settingsBtn">
            ⚙️ Settings
          </button>
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

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Get DOM elements
    const startGameBtn = document.getElementById("startGameBtn");
    const settingsBtn = document.getElementById("settingsBtn");

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

    // Set up the instructions
    const instructions = document.getElementById("instructions");
    if (instructions) {
      // Initially hide the instructions
      instructions.style.opacity = "0";
      instructions.style.transform = "translateY(20px)";
      instructions.style.transition = "all 0.8s ease-out";
    }

    // Set up buttons
    const buttons = document.getElementById("startButtons");
    if (buttons) {
      buttons.style.opacity = "0";
      buttons.style.transform = "translateY(20px)";
      buttons.style.transition = "all 0.8s ease-out";
    }

    // Set up logo
    const logo = document.getElementById("gameLogo");
    if (logo) {
      logo.style.opacity = "0";
      logo.style.transform = "scale(0.8)";
      logo.style.transition = "all 0.8s ease-out";
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
    }, 500);
  }

  showIntroduction() {
    console.log("📖 Showing introduction");

    const logo = document.getElementById("gameLogo");
    const storyIntro = document.getElementById("storyIntro");
    const instructions = document.getElementById("instructions");
    const buttons = document.getElementById("startButtons");

    // Show logo first
    if (logo) {
      logo.style.opacity = "1";
      logo.style.transform = "scale(1)";
    }

    // Show story intro
    if (storyIntro) {
      this.setManagedTimeout(() => {
        storyIntro.style.opacity = "1";
        storyIntro.style.transform = "translateY(0)";
      }, 300);
    }

    // Show instructions
    if (instructions) {
      this.setManagedTimeout(() => {
        instructions.style.opacity = "1";
        instructions.style.transform = "translateY(0)";
      }, 600);
    }

    // Show buttons
    if (buttons) {
      this.setManagedTimeout(() => {
        buttons.style.opacity = "1";
        buttons.style.transform = "translateY(0)";
      }, 900);
    }

    this.introShown = true;
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
      if (this.introShown && this.buttonsEnabled) {
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
      .game-logo {
        max-width: 300px;
        width: 100%;
        height: auto;
        margin-bottom: 20px;
        filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
      }
      
      .instruction-text {
        background: rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(212, 175, 55, 0.3);
        border-radius: 15px;
        padding: 20px;
        font-size: 1em;
        line-height: 1.6;
        position: relative;
        backdrop-filter: blur(5px);
        max-width: 600px;
        margin: 0 auto;
      }
      
      .instruction-text::before {
        content: "🎮";
        position: absolute;
        top: -10px;
        left: 20px;
        background: linear-gradient(45deg, #1a1a2e, #2a2a3e);
        padding: 5px 10px;
        border-radius: 8px;
        font-size: 1.2em;
      }
      
      .instruction-text ul {
        list-style: none;
        padding: 0;
        margin: 10px 0 0 0;
      }
      
      .instruction-text li {
        margin: 10px 0;
        padding: 5px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .instruction-text li:last-child {
        border-bottom: none;
      }
      
      .instructions {
        max-width: 700px;
        margin: 20px 0;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s ease-out;
      }
      
      .start-buttons .game-button {
        min-width: 180px;
        padding: 15px 30px;
        font-size: 1.2em;
        position: relative;
        overflow: hidden;
      }
      
      .start-buttons .game-button::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        transition: left 0.5s ease;
      }
      
      .start-buttons .game-button:hover::before {
        left: 100%;
      }
      
      @media (max-width: 768px) {
        .game-logo {
          max-width: 250px;
        }
        
        .instruction-text {
          padding: 15px;
          font-size: 0.9em;
        }
        
        .start-buttons {
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        
        .start-buttons .game-button {
          min-width: 160px;
          padding: 12px 25px;
          font-size: 1.1em;
        }
      }
      
      @media (max-width: 480px) {
        .game-logo {
          max-width: 200px;
        }
        
        .instruction-text {
          padding: 12px;
          font-size: 0.85em;
        }
        
        .start-buttons .game-button {
          min-width: 140px;
          padding: 10px 20px;
          font-size: 1em;
        }
      }
    `
    );
  }

  // Debug method override
  debug() {
    super.debug();
    console.log("Start Screen Specific Debug Info:", {
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
