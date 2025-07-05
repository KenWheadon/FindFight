// Victory Screen Class - Extends Screen base class
class VictoryScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Victory screen specific properties
    this.buttonsEnabled = true;
    this.fadeInComplete = false;
    this.celebrationStarted = false;
    this.finalStats = {
      itemsFound: 0,
      timeElapsed: 0,
      phasesCompleted: 3,
    };

    console.log("🏆 VictoryScreen instance created");
  }

  // Initialize with final game stats
  initializeVictory(stats = {}) {
    this.finalStats = {
      itemsFound: stats.itemsFound || 0,
      timeElapsed: stats.timeElapsed || 0,
      phasesCompleted: stats.phasesCompleted || 3,
    };
    console.log("🏆 Victory initialized with stats:", this.finalStats);
  }

  render() {
    // Inject HTML content into the container
    this.container.innerHTML = `
      <div class="victory-content">
        <div class="victory-header">
          <div class="victory-crown">
            <div class="crown-icon">👑</div>
            <div class="victory-sparkles">
              <span class="sparkle">✨</span>
              <span class="sparkle">✨</span>
              <span class="sparkle">✨</span>
              <span class="sparkle">✨</span>
            </div>
          </div>
          <h1 class="victory-title">Case Closed!</h1>
          <p class="victory-subtitle">The Evil Tree has been defeated</p>
        </div>

        <div class="victory-story">
          <div class="rusty-celebration">
            <div class="rusty-image">🦝</div>
            <div class="detective-badge">🔍</div>
          </div>
          <div class="victory-narrative">
            <p class="victory-main-text">
              "It's over. The tree's gone silent, its roots withered to dust. The cursed box creaks one last time before the illusion shatters like glass."
            </p>
            <p class="victory-quote">
              <em>"Another case closed. Some mysteries are meant to be solved... and some boxes are meant to stay shut."</em>
            </p>
            <p class="victory-ending">
              Rusty tips his hat and walks toward the light. The detective's work is never truly done, but tonight, justice has roots deeper than evil.
            </p>
          </div>
        </div>

        <div class="victory-stats">
          <div class="stat-card">
            <div class="stat-icon">🔍</div>
            <div class="stat-number">${this.finalStats.itemsFound}</div>
            <div class="stat-label">Objects Found</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⚔️</div>
            <div class="stat-number">${this.finalStats.phasesCompleted}</div>
            <div class="stat-label">Phases Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-number">100%</div>
            <div class="stat-label">Victory Rate</div>
          </div>
        </div>

        <div class="victory-controls">
          <div class="victory-message">
            <p>🎉 Congratulations, Detective! 🎉</p>
            <p>You have successfully escaped the cursed box and defeated the Evil Tree!</p>
          </div>
          
          <div class="victory-buttons">
            <button class="game-button primary pulse" id="replayBtn">
              <span class="button-icon">🎮</span>
              <span class="button-text">Play Again</span>
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

  initializeElements() {
    // Set up fade-in animations
    const victoryContent = this.container.querySelector(".victory-content");
    if (victoryContent) {
      victoryContent.style.opacity = "0";
      victoryContent.style.transform = "translateY(30px)";
      victoryContent.style.transition = "all 1s ease-out";
    }

    // Set up individual sections for staggered animation
    const sections = [
      ".victory-header",
      ".victory-story",
      ".victory-stats",
      ".victory-controls",
    ];

    sections.forEach((selector, index) => {
      const element = this.container.querySelector(selector);
      if (element) {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = `all 0.8s ease-out ${index * 0.4}s`;
      }
    });

    // Set up sparkle animations
    const sparkles = this.container.querySelectorAll(".sparkle");
    sparkles.forEach((sparkle, index) => {
      sparkle.style.animationDelay = `${index * 0.2}s`;
    });
  }

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Get DOM elements
    const replayBtn = document.getElementById("replayBtn");
    const menuBtn = document.getElementById("menuBtn");

    // Replay button
    if (replayBtn) {
      replayBtn.addEventListener("click", (e) => {
        this.createRippleEffect(replayBtn, e);
        this.replayGame();
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
    console.log("🚀 Initializing Victory Screen");

    // Call parent init
    super.init();

    // Play victory sound
    if (this.audioManager) {
      this.audioManager.playSound("victory", false, 0.8);
    }

    // Start celebration effects
    this.startCelebration();

    // Start fade-in animation after a brief delay
    this.setManagedTimeout(() => {
      this.startFadeInAnimation();
    }, 1000);
  }

  startCelebration() {
    console.log("🎉 Starting victory celebration");

    this.celebrationStarted = true;

    // Create particle burst at random locations
    const createRandomBurst = () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const colors = [
        "rgba(255, 215, 0, 0.8)", // Gold
        "rgba(0, 255, 136, 0.8)", // Green
        "rgba(255, 20, 147, 0.8)", // Deep pink
        "rgba(30, 144, 255, 0.8)", // Dodger blue
        "rgba(255, 165, 0, 0.8)", // Orange
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.createParticleBurst(x, y, 15, color);
    };

    // Create multiple bursts
    for (let i = 0; i < 5; i++) {
      this.setManagedTimeout(() => {
        createRandomBurst();
      }, i * 300);
    }

    // Continue creating bursts periodically
    const celebrationInterval = this.setManagedInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance each interval
        createRandomBurst();
      }
    }, 2000);
  }

  startFadeInAnimation() {
    console.log("🎭 Starting victory fade-in animation");

    const victoryContent = this.container.querySelector(".victory-content");
    if (victoryContent) {
      victoryContent.style.opacity = "1";
      victoryContent.style.transform = "translateY(0)";
    }

    // Animate individual sections
    const sections = [
      ".victory-header",
      ".victory-story",
      ".victory-stats",
      ".victory-controls",
    ];

    sections.forEach((selector, index) => {
      const element = this.container.querySelector(selector);
      if (element) {
        this.setManagedTimeout(() => {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }, 400 + index * 400);
      }
    });

    // Enable buttons after animation
    this.setManagedTimeout(() => {
      this.fadeInComplete = true;
      this.buttonsEnabled = true;
    }, 2000);
  }

  replayGame() {
    if (!this.buttonsEnabled) return;

    console.log("🎮 Replaying game from Victory Screen");

    this.buttonsEnabled = false;

    // Play button sound
    if (this.audioManager) {
      this.audioManager.playSound("button_click", false, 0.7);
    }

    // Show replay message
    this.showTemporaryMessage("Starting new adventure...", "success", 2000);

    // Create final celebration burst
    this.createParticleBurst(
      window.innerWidth / 2,
      window.innerHeight / 2,
      20,
      "rgba(255, 215, 0, 0.8)"
    );

    // Fade out the screen
    const victoryContent = this.container.querySelector(".victory-content");
    if (victoryContent) {
      victoryContent.style.opacity = "0";
      victoryContent.style.transform = "translateY(-20px)";
    }

    // Restart the game
    this.setManagedTimeout(() => {
      if (window.game) {
        window.game.restartGame();
      }
    }, 1500);
  }

  returnToMenu() {
    if (!this.buttonsEnabled) return;

    console.log("🏠 Returning to main menu from Victory Screen");

    this.buttonsEnabled = false;

    // Play menu sound
    if (this.audioManager) {
      this.audioManager.playSound("button_click", false, 0.7);
    }

    // Show menu message
    this.showTemporaryMessage("Returning to main menu...", "info", 2000);

    // Fade out the screen
    const victoryContent = this.container.querySelector(".victory-content");
    if (victoryContent) {
      victoryContent.style.opacity = "0";
      victoryContent.style.transform = "translateY(-20px)";
    }

    // Return to start screen
    this.setManagedTimeout(() => {
      if (window.game) {
        window.game.showScreen("start");
      }
    }, 1500);
  }

  handleKeydown(e) {
    // Call parent handler
    super.handleKeydown(e);

    // Victory screen specific keyboard shortcuts
    if (this.fadeInComplete && this.buttonsEnabled) {
      if (e.code === "Enter" || e.code === "Space") {
        this.replayGame();
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
    console.log("🔙 Escape pressed on Victory Screen");

    if (this.fadeInComplete && this.buttonsEnabled) {
      this.returnToMenu();
    }
  }

  // Override particle system to create golden victory particles
  startParticleSystem() {
    const particlesContainer = this.container.querySelector(".particles-layer");
    if (!particlesContainer) return;

    // Store reference to screen instance for proper context
    const screenInstance = this;

    this.particleSystem = {
      container: particlesContainer,
      particles: [],
      maxParticles: 30, // More particles for victory

      createParticle() {
        const particle = document.createElement("div");
        particle.className = "particle victory-particle";

        const size = Math.random() * 4 + 2;
        particle.style.width = particle.style.height = size + "px";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 2 + "s";
        particle.style.animationDuration = 6 + Math.random() * 4 + "s";

        // Golden particles for victory
        particle.style.background =
          "radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)";

        particlesContainer.appendChild(particle);
        this.particles.push(particle);

        const timeout = setTimeout(() => {
          if (particle.parentNode) {
            particle.remove();
            const index = this.particles.indexOf(particle);
            if (index > -1) {
              this.particles.splice(index, 1);
            }
          }
        }, 10000);

        // Track timeout for cleanup on screen instance
        screenInstance.timeouts.push(timeout);
      },

      start() {
        const interval = setInterval(() => {
          if (this.particles.length < this.maxParticles) {
            this.createParticle();
          }
        }, 600);

        // Track interval for cleanup on screen instance
        screenInstance.intervals.push(interval);
      },
    };

    this.particleSystem.start();
  }

  // Debug method override
  debug() {
    super.debug();
    console.log("Victory Screen Specific Debug Info:", {
      fadeInComplete: this.fadeInComplete,
      buttonsEnabled: this.buttonsEnabled,
      celebrationStarted: this.celebrationStarted,
      finalStats: this.finalStats,
    });
  }

  // Clean up when screen is destroyed
  destroy() {
    // Stop any audio
    if (this.audioManager) {
      this.audioManager.stopSound("victory");
    }

    // Reset state
    this.fadeInComplete = false;
    this.buttonsEnabled = true;
    this.celebrationStarted = false;
    this.finalStats = {
      itemsFound: 0,
      timeElapsed: 0,
      phasesCompleted: 3,
    };

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Victory Screen destroyed");
  }
}

// Make VictoryScreen available globally
window.VictoryScreen = VictoryScreen;

console.log("🏆 Victory Screen class loaded");
