// Start Screen Class - Extends Screen base class
class StartScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Start screen specific properties
    this.buttonsEnabled = true;
    this.introShown = false;
    this.creditsOpen = false;

    console.log("🦝 StartScreen instance created");
  }

  render() {
    // Inject HTML content into the container
    this.container.innerHTML = `
      <div class="start-content">
       <div class="logo-section">
                <img 
                    src="images/logo.png" 
                    alt="Game Logo" 
                    class="game-logo"
                    id="gameLogo"
                />
                <p class="game-subtitle">Hidden Object Detective Adventure</p>
            </div>
        <div class="start-columns">
           
                    <div class="story-intro" id="storyIntro">
          <div class="story-text">
            <p class="story-quote">Name's Rusty. Been chasing cases longer than I've had this trench coat. But this cardboard box? It's tied to vanishing people... and now I'm trapped inside it.</p>
            <p class="story-objective">Find hidden objects, fight the Evil Tree, and escape the cursed box.</p>
          </div>
        </div>

        <div class="game-controls" id="gameControls">
          <div class="quick-instructions">
            <div class="instruction-item">
              <span class="instruction-icon">🔍</span>
              <span class="instruction-text">Search scenes for hidden objects</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-icon">🃏</span>
              <span class="instruction-text">Use objects as combat cards</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-icon">⚔️</span>
              <span class="instruction-text">Defeat the Evil Tree across 3 phases</span>
            </div>
          </div>
          
          <div class="start-buttons" id="startButtons">
            <button class="game-button primary pulse" id="startGameBtn">
              <span class="button-text">Start</span>
            </button>
            <button class="game-button secondary" id="creditsBtn">
              <span class="button-text">Credits</span>
            </button>
          </div>
        </div>
        </div>

      </div>

      <!-- Credits Modal -->
      <div class="credits-modal" id="creditsModal">
        <div class="credits-content">
          <div class="credits-header">
            <img src="images/company-logo.png" alt="Weird Demon Games" class="company-logo" />
            <h2>Weird Demon Games</h2>
            <button class="close-credits" id="closeCredits">×</button>
          </div>
          <div class="credits-body">
            <div class="company-info">
              <h3>About the Studio</h3>
              <p>Weird Demon Games was founded in the depths of creative madness, where nightmares meet nostalgia. We specialize the weird and wacky that make you wonder - what did I play, and why did I have fun doing it!</p>
              
              <h3>Our Mission</h3>
              <p>To create unforgettable gaming experiences that bring a smile to your face and inspire you to make something wacky of your own!</p>
              
              <h3>Team</h3>
              <div class="team-credits">
                <div class="credit-role">
                  <span class="role">Game Lead</span>
                  <span class="name">Ken Whaeadon</span>
                </div>
                <div class="credit-role">
                  <span class="role">Logo</span>
                  <span class="name">Wrymskin</span>
                </div>
                <div class="credit-role">
                  <span class="role">Audio Effect</span>
                  <span class="name">https://freesound.org/: Name1, Name2, Name3, Name4</span>
                </div>
                <div class="credit-role">
                  <span class="role">Game Art</span>
                  <span class="name">ChatGPT</span>
                </div>
                <div class="credit-role">
                  <span class="role">Music</span>
                  <span class="name">Suno</span>
                </div>
                <div class="credit-role">
                  <span class="role">Programming</span>
                  <span class="name">Claude Sonnet 4</span>
                </div>
              </div>
              
              <div class="company-tagline">
                <em>"Where every game is a portal to the impossible."</em>
              </div>
            </div>
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

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Get DOM elements
    const startGameBtn = document.getElementById("startGameBtn");
    const creditsBtn = document.getElementById("creditsBtn");
    const creditsModal = document.getElementById("creditsModal");
    const closeCredits = document.getElementById("closeCredits");

    // Start game button
    if (startGameBtn) {
      startGameBtn.addEventListener("click", (e) => {
        this.createRippleEffect(startGameBtn, e);
        this.startGame();
      });
    }

    // Credits button
    if (creditsBtn) {
      creditsBtn.addEventListener("click", (e) => {
        this.createRippleEffect(creditsBtn, e);
        this.showCredits();
      });
    }

    // Close credits
    if (closeCredits) {
      closeCredits.addEventListener("click", () => {
        this.hideCredits();
      });
    }

    // Close credits when clicking outside modal
    if (creditsModal) {
      creditsModal.addEventListener("click", (e) => {
        if (e.target === creditsModal) {
          this.hideCredits();
        }
      });
    }
  }

  initializeElements() {
    // Set up the logo section
    const logoSection = this.container.querySelector(".logo-section");
    if (logoSection) {
      logoSection.style.opacity = "0";
      logoSection.style.transform = "translateY(-20px)";
      logoSection.style.transition = "all 0.8s ease-out";
    }

    // Set up the story intro
    const storyIntro = document.getElementById("storyIntro");
    if (storyIntro) {
      storyIntro.style.opacity = "0";
      storyIntro.style.transform = "translateY(20px)";
      storyIntro.style.transition = "all 0.8s ease-out";
    }

    // Set up the game controls
    const gameControls = document.getElementById("gameControls");
    if (gameControls) {
      gameControls.style.opacity = "0";
      gameControls.style.transform = "translateY(20px)";
      gameControls.style.transition = "all 0.8s ease-out";
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

    const logoSection = this.container.querySelector(".logo-section");
    const storyIntro = document.getElementById("storyIntro");
    const gameControls = document.getElementById("gameControls");

    // Show logo section first
    if (logoSection) {
      logoSection.style.opacity = "1";
      logoSection.style.transform = "translateY(0)";
    }

    // Show story intro
    if (storyIntro) {
      this.setManagedTimeout(() => {
        storyIntro.style.opacity = "1";
        storyIntro.style.transform = "translateY(0)";
      }, 300);
    }

    // Show game controls
    if (gameControls) {
      this.setManagedTimeout(() => {
        gameControls.style.opacity = "1";
        gameControls.style.transform = "translateY(0)";
      }, 600);
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
    this.showTemporaryMessage("Beginning your investigation...", "info", 2000);

    // Fade out background music
    this.fadeOutBackgroundMusic();

    // Transition to game
    this.setManagedTimeout(() => {
      if (window.game) {
        window.game.beginAdventure();
      }
    }, 1500);
  }

  showCredits() {
    if (!this.buttonsEnabled || this.creditsOpen) return;

    console.log("👥 Opening credits");

    // Play click sound
    if (this.audioManager) {
      this.audioManager.playSound("click", false, 0.6);
    }

    const creditsModal = document.getElementById("creditsModal");
    if (creditsModal) {
      this.creditsOpen = true;
      creditsModal.classList.add("visible");

      // Focus trap for accessibility
      const closeButton = document.getElementById("closeCredits");
      if (closeButton) {
        closeButton.focus();
      }
    }
  }

  hideCredits() {
    if (!this.creditsOpen) return;

    console.log("❌ Closing credits");

    const creditsModal = document.getElementById("creditsModal");
    if (creditsModal) {
      creditsModal.classList.remove("visible");
      this.creditsOpen = false;

      // Return focus to credits button
      const creditsBtn = document.getElementById("creditsBtn");
      if (creditsBtn) {
        creditsBtn.focus();
      }
    }
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

    // Handle credits modal
    if (this.creditsOpen && e.code === "Escape") {
      this.hideCredits();
      return;
    }

    // Start screen specific keyboard shortcuts
    if (e.code === "Enter" || e.code === "Space") {
      if (this.introShown && this.buttonsEnabled && !this.creditsOpen) {
        this.startGame();
      }
    }

    // Credits shortcut
    if (e.code === "KeyC" && !this.creditsOpen) {
      this.showCredits();
    }

    // Debug shortcut
    if (e.code === "KeyD" && e.ctrlKey) {
      this.debug();
    }
  }

  handleEscape() {
    console.log("🔙 Escape pressed on Start Screen");

    if (this.creditsOpen) {
      this.hideCredits();
    } else {
      this.showTemporaryMessage("Press F5 to refresh the game", "info", 3000);
    }
  }

  // Debug method override
  debug() {
    super.debug();
    console.log("Start Screen Specific Debug Info:", {
      introShown: this.introShown,
      buttonsEnabled: this.buttonsEnabled,
      creditsOpen: this.creditsOpen,
    });
  }

  // Clean up when screen is destroyed
  destroy() {
    // Stop background music
    if (this.audioManager) {
      this.audioManager.stopSound("background_music");
    }

    // Close credits if open
    if (this.creditsOpen) {
      this.hideCredits();
    }

    // Reset state
    this.introShown = false;
    this.buttonsEnabled = true;
    this.creditsOpen = false;

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Start Screen destroyed");
  }
}

// Make StartScreen available globally
window.StartScreen = StartScreen;

console.log("📱 Start Screen class loaded");
