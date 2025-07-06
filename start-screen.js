// Start Screen Class - Extends Screen base class
class StartScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Start screen specific properties
    this.buttonsEnabled = true;
    this.introShown = false;
    this.creditsOpen = false;
    this.hoverSoundsEnabled = false; // Prevent hover sounds until after intro

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
              <p>Weird Demon Games was founded in the depths of creative madness, where nightmares meet nostalgia. We specialize in the weird and wacky that make you wonder - what did I play, and why did I have fun doing it!</p>
              
              <h3>Our Mission</h3>
              <p>To create unforgettable experiences that bring a smile to your face and inspire you to make something wacky of your own!</p>
              
              <h3>Team</h3>
              <div class="team-credits">
                <div class="credit-role">
                  <span class="role">Foudner / Game Lead</span>
                  <span class="name">Ken Whaeadon</span>
                </div>
                <div class="credit-role">
                  <span class="role">Logo</span>
                  <span class="name">Wrymskin</span>
                </div>
                <div class="credit-role">
                  <span class="role">Audio Effects - freesound.org</span>
                  <span class="name">colorsCrimsonTears, David819, SilverIllusionist, mrickey13, plasterbrain, Sess8it, Bertrof, GameAudio, Yoshicakes77</span>
                </div>

                <div class="credit-role">
                  <span class="role">Audio Effects - pixabay.com</span>
                  <span class="name">Karim-Nessim, Universfield, freesound_community</span>
                </div>

                <div class="credit-role">
                  <span class="role">Lead Artist</span>
                  <span class="name">ChatGPT</span>
                </div>
                <div class="credit-role">
                  <span class="role">Music Composer</span>
                  <span class="name">Suno</span>
                </div>
                <div class="credit-role">
                  <span class="role">Lead Programmer</span>
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
        this.playButtonClickSound();
        this.startGame();
      });

      // Add hover sound effect
      startGameBtn.addEventListener("mouseenter", () => {
        this.playButtonHoverSound();
      });
    }

    // Credits button
    if (creditsBtn) {
      creditsBtn.addEventListener("click", (e) => {
        this.createRippleEffect(creditsBtn, e);
        this.playButtonClickSound();
        this.showCredits();
      });

      // Add hover sound effect
      creditsBtn.addEventListener("mouseenter", () => {
        this.playButtonHoverSound();
      });
    }

    // Close credits
    if (closeCredits) {
      closeCredits.addEventListener("click", () => {
        this.playButtonClickSound();
        this.hideCredits();
      });

      // Add hover sound effect
      closeCredits.addEventListener("mouseenter", () => {
        this.playButtonHoverSound();
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

    // Show logo section first with sparkle sound
    if (logoSection) {
      this.playLogoAppearSound();
      logoSection.style.opacity = "1";
      logoSection.style.transform = "translateY(0)";
    }

    // Show story intro with typewriter effect
    if (storyIntro) {
      this.setManagedTimeout(() => {
        this.showStoryIntroWithTypewriter(storyIntro);
      }, 300);
    }

    // Show game controls with success sound
    if (gameControls) {
      this.setManagedTimeout(() => {
        this.playControlsAppearSound();
        gameControls.style.opacity = "1";
        gameControls.style.transform = "translateY(0)";

        // Enable hover sounds after intro is complete
        this.hoverSoundsEnabled = true;
      }, 600);
    }

    this.introShown = true;
  }

  showStoryIntroWithTypewriter(storyIntro) {
    // Create story content
    const storyContent = `
      <div class="story-text">
        <div class="story-quote" id="storyQuote">
          Detective Rusty receives a mysterious case: an ancient tree in the city park has been cursed, 
          turning malevolent and threatening all who approach. Armed with wit and determination, 
          Rusty must investigate three connected locations to gather the tools needed to break the curse.
        </div>
        <div class="story-objective" id="storyObjective">
          Find hidden objects, use them as combat cards, and defeat the Evil Tree!
        </div>
      </div>
    `;

    // Set initial content
    storyIntro.innerHTML = storyContent;

    // Start typewriter effect
    const storyQuote = document.getElementById("storyQuote");
    const storyObjective = document.getElementById("storyObjective");

    if (storyQuote && storyObjective) {
      // Hide text initially
      storyQuote.style.opacity = "0";
      storyObjective.style.opacity = "0";

      // Start typewriter for quote
      this.typeWriterEffect(storyQuote, () => {
        // After quote is done, show objective
        this.setManagedTimeout(() => {
          storyObjective.style.opacity = "1";
          storyObjective.style.transition = "opacity 0.5s ease-out";
        }, 500);
      });
    }

    // Show the story intro container
    storyIntro.style.opacity = "1";
    storyIntro.style.transform = "translateY(0)";
  }

  typeWriterEffect(element, callback) {
    const originalText = element.textContent;
    element.textContent = "";
    element.style.opacity = "1";

    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < originalText.length) {
        element.textContent += originalText.charAt(i);

        // Play typewriter sound occasionally (not every character to avoid spam)
        if (i % 3 === 0) {
          this.playTypewriterSound();
        }

        i++;
      } else {
        clearInterval(typeInterval);
        if (callback) callback();
      }
    }, 30); // Adjust speed as needed

    this.intervals.push(typeInterval);
  }

  // Enhanced audio methods
  playButtonClickSound() {
    if (this.audioManager) {
      this.audioManager.playSound("click", false, 0.7);
    }
  }

  playButtonHoverSound() {
    if (this.audioManager && this.hoverSoundsEnabled) {
      this.audioManager.playSound("button-hover", false, 0.4);
    }
  }

  playLogoAppearSound() {
    // if (this.audioManager) {
    //   this.audioManager.playSound("item-sparkle", false, 0.5);
    // }
  }

  playTypewriterSound() {
    if (this.audioManager) {
      this.audioManager.playSound("typewriter_click", false, 0.3);
    }
  }

  playControlsAppearSound() {
    if (this.audioManager) {
      this.audioManager.playSound("success", false, 0.6);
    }
  }

  playPageTurnSound() {
    if (this.audioManager) {
      this.audioManager.playSound("page-turn", false, 0.5);
    }
  }

  playKeyboardSound() {
    if (this.audioManager) {
      this.audioManager.playSound("click", false, 0.5);
    }
  }

  startGame() {
    if (!this.buttonsEnabled) return;

    console.log("🎯 Starting game from Start Screen");

    this.buttonsEnabled = false;

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

    // Play page turn sound instead of just click
    this.playPageTurnSound();

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

    // Play page turn sound
    this.playPageTurnSound();

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
        this.playKeyboardSound();
        this.startGame();
      }
    }

    // Credits shortcut
    if (e.code === "KeyC" && !this.creditsOpen) {
      this.playKeyboardSound();
      this.showCredits();
    }

    // Debug shortcut
    if (e.code === "KeyD" && e.ctrlKey) {
      this.debug();
    }
  }

  handleEscape() {}

  // Debug method override
  debug() {
    super.debug();
    console.log("Start Screen Specific Debug Info:", {
      introShown: this.introShown,
      buttonsEnabled: this.buttonsEnabled,
      creditsOpen: this.creditsOpen,
      hoverSoundsEnabled: this.hoverSoundsEnabled,
    });
  }

  // Clean up when screen is destroyed
  destroy() {
    // Close credits if open
    if (this.creditsOpen) {
      this.hideCredits();
    }

    // Reset state
    this.introShown = false;
    this.buttonsEnabled = true;
    this.creditsOpen = false;
    this.hoverSoundsEnabled = false;

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Start Screen destroyed");
  }
}

// Make StartScreen available globally
window.StartScreen = StartScreen;

console.log("📱 Start Screen class loaded");
