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

    // Interactive story state
    this.storySegments = [
      {
        id: "revelation",
        title: "Click to reveal the aftermath...",
        text: "The tree's ancient whispers fade to silence. Its gnarled branches crumble to dust, and the cursed box begins to crack like an eggshell around me.",
        revealed: false,
      },
      {
        id: "escape",
        title: "Click to discover your escape...",
        text: "Light pours through the fractures—real light, not the sickly glow of this prison. I can smell the outside world: rain, exhaust, the city I know.",
        revealed: false,
      },
      {
        id: "reflection",
        title: "Click to hear Rusty's final words...",
        text: '"Case closed," I mutter, straightening my trench coat. "Some mysteries are meant to be solved... and some boxes are meant to stay shut forever."',
        revealed: false,
      },
    ];

    this.currentRevealedCount = 0;

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

        <div class="victory-main">
          <div class="victory-story">
            <div class="rusty-celebration">
              <div class="rusty-image">
                <img src="images/rusty.png" alt="Rusty the Raccoon Detective" />
              </div>
              <div class="detective-badge">
                <img src="images/magnifying-glass.png" alt="Detective Badge" />
              </div>
            </div>
            
            <div class="story-progress">
              <div class="progress-dot" data-segment="0"></div>
              <div class="progress-dot" data-segment="1"></div>
              <div class="progress-dot" data-segment="2"></div>
            </div>

            <div class="story-segments">
              ${this.storySegments
                .map(
                  (segment, index) => `
                <div class="story-segment" data-segment="${index}" id="story-segment-${index}">
                  <div class="story-title">${segment.title}</div>
                  <div class="story-text">${segment.text}</div>
                  <div class="story-click-hint">👆</div>
                </div>
              `
                )
                .join("")}
            </div>

            <div class="victory-quote" style="opacity: 0; transition: opacity 0.5s ease;">
              <em>"Another case closed. The detective's work is never truly done, but tonight, justice has roots deeper than evil."</em>
            </div>
          </div>

          <div class="victory-stats">
            <div class="stats-title">Investigation Results</div>
            <div class="stat-card">
              <div class="stat-icon">
                <img src="images/magnifying-glass.png" alt="Search Icon" />
              </div>
              <div class="stat-number">${this.finalStats.itemsFound}</div>
              <div class="stat-label">Objects Found</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🕐</div>
              <div class="stat-number">${this.formatTime(
                this.finalStats.timeElapsed
              )}</div>
              <div class="stat-label">Time Elapsed</div>
            </div>
          </div>
        </div>

        <div class="victory-controls">
          <div class="victory-message">
            <p>🎉 Congratulations, Detective! 🎉</p>
            <p>You have successfully escaped the cursed box and defeated the Evil Tree!</p>
            <p id="story-completion-message">Click on the story segments above to reveal the full tale of your victory!</p>
          </div>
          
          <div class="victory-buttons">
            <button class="game-button primary pulse" id="replayBtn">
              <span class="button-icon">🎮</span>
              <span class="button-text">Play Again</span>
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

    // Setup story segment listeners after DOM is ready
    this.setupStorySegmentListeners();
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
    const sections = [".victory-header", ".victory-main", ".victory-controls"];

    sections.forEach((selector, index) => {
      const element = this.container.querySelector(selector);
      if (element) {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = `all 0.8s ease-out ${index * 0.3}s`;
      }
    });

    // Set up sparkle animations
    const sparkles = this.container.querySelectorAll(".sparkle");
    sparkles.forEach((sparkle, index) => {
      sparkle.style.animationDelay = `${index * 0.2}s`;
    });

    // Show story completion message
    const storyMessage = document.getElementById("story-completion-message");
    if (storyMessage) {
      storyMessage.style.opacity = "1";
    }
  }

  formatTime(milliseconds) {
    if (!milliseconds || milliseconds === 0) return "N/A";
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Get DOM elements
    const replayBtn = document.getElementById("replayBtn");

    // Replay button
    if (replayBtn) {
      replayBtn.addEventListener("click", (e) => {
        this.createRippleEffect(replayBtn, e);
        this.replayGame();
      });
    }

    // Story segment click handlers - Set up after render
    this.setupStorySegmentListeners();
  }

  setupStorySegmentListeners() {
    // Story segment click handlers
    const storySegments = this.container.querySelectorAll(".story-segment");
    console.log(
      "Setting up story segment listeners for",
      storySegments.length,
      "segments"
    );

    storySegments.forEach((segment, index) => {
      segment.addEventListener("click", (e) => {
        console.log("Story segment clicked:", index);
        this.revealStorySegment(index, e);
      });

      // Add pointer cursor to make it clear they're clickable
      segment.style.cursor = "pointer";
    });
  }

  revealStorySegment(index, event) {
    const segment = this.storySegments[index];
    if (segment.revealed) {
      console.log("Segment already revealed:", index);
      return;
    }

    const segmentElement = this.container.querySelector(
      `#story-segment-${index}`
    );
    const progressDot = this.container.querySelector(
      `.progress-dot[data-segment="${index}"]`
    );

    if (!segmentElement) {
      console.log("Segment element not found:", index);
      return;
    }

    console.log(`📖 Revealing story segment: ${segment.id}`);

    // Mark as revealed
    segment.revealed = true;
    segmentElement.classList.add("revealed");

    // Update progress dot
    if (progressDot) {
      progressDot.classList.add("completed");
    }

    // Play reveal sound
    if (this.audioManager) {
      this.audioManager.playSound("story_reveal", false, 0.6);
    }

    // Create particle burst at click location
    const rect = segmentElement.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    this.createParticleBurst(x, y, 8, "rgba(255, 215, 0, 0.7)");

    // Add screen shake for impact
    this.triggerScreenShake(200);

    // Increment revealed count
    this.currentRevealedCount++;

    // Check if all segments are revealed
    if (this.currentRevealedCount >= this.storySegments.length) {
      this.onAllSegmentsRevealed();
    }

    // Show success message
    this.showTemporaryMessage(
      `✨ ${segment.title
        .replace("Click to ", "")
        .replace("...", "")} revealed!`,
      "success",
      2000
    );
  }

  onAllSegmentsRevealed() {
    console.log("🎉 All story segments revealed!");

    // Show the final quote
    const quote = this.container.querySelector(".victory-quote");
    if (quote) {
      quote.style.opacity = "1";
    }

    // Hide the story completion message
    const storyMessage = document.getElementById("story-completion-message");
    if (storyMessage) {
      storyMessage.style.opacity = "0";
    }

    // Create celebration effect
    this.createFinalCelebration();

    // Show completion message
    this.showTemporaryMessage(
      "🎊 The complete story has been revealed! 🎊",
      "success",
      3000
    );
  }

  createFinalCelebration() {
    // Create multiple particle bursts around the screen
    const colors = [
      "rgba(255, 215, 0, 0.8)",
      "rgba(0, 255, 136, 0.8)",
      "rgba(255, 20, 147, 0.8)",
      "rgba(30, 144, 255, 0.8)",
    ];

    for (let i = 0; i < 6; i++) {
      this.setManagedTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const color = colors[Math.floor(Math.random() * colors.length)];
        this.createParticleBurst(x, y, 12, color);
      }, i * 200);
    }
  }

  init() {
    console.log("🚀 Initializing Victory Screen");

    // Reset story state
    this.storySegments.forEach((segment) => (segment.revealed = false));
    this.currentRevealedCount = 0;

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

    // Create initial particle burst
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

      this.createParticleBurst(x, y, 10, color);
    };

    // Create multiple bursts
    for (let i = 0; i < 3; i++) {
      this.setManagedTimeout(() => {
        createRandomBurst();
      }, i * 500);
    }

    // Continue creating bursts periodically
    const celebrationInterval = this.setManagedInterval(() => {
      if (Math.random() < 0.2) {
        // 20% chance each interval
        createRandomBurst();
      }
    }, 3000);
  }

  startFadeInAnimation() {
    console.log("🎭 Starting victory fade-in animation");

    const victoryContent = this.container.querySelector(".victory-content");
    if (victoryContent) {
      victoryContent.style.opacity = "1";
      victoryContent.style.transform = "translateY(0)";
    }

    // Animate individual sections
    const sections = [".victory-header", ".victory-main", ".victory-controls"];

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

    // Story reveal shortcuts
    if (e.code === "Digit1" || e.code === "Numpad1") {
      this.revealStorySegment(0, {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      });
    }
    if (e.code === "Digit2" || e.code === "Numpad2") {
      this.revealStorySegment(1, {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      });
    }
    if (e.code === "Digit3" || e.code === "Numpad3") {
      this.revealStorySegment(2, {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      });
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
      maxParticles: 25, // Moderate amount for victory

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
        }, 800);

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
      currentRevealedCount: this.currentRevealedCount,
      storySegments: this.storySegments,
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

    // Reset story state
    this.storySegments.forEach((segment) => (segment.revealed = false));
    this.currentRevealedCount = 0;

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Victory Screen destroyed");
  }
}

// Make VictoryScreen available globally
window.VictoryScreen = VictoryScreen;

console.log("🏆 Victory Screen class loaded");
