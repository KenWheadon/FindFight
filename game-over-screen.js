// Enhanced Game Over Screen Class - Extends Screen base class
class GameOverScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Game over screen specific properties
    this.gameOverType = "search"; // 'search' or 'tree'
    this.gameOverMessage = "";
    this.buttonsEnabled = true;
    this.fadeInComplete = false;
    this.rightColumnVisible = false;

    // Interactive story state
    this.storySegments = [
      {
        id: "immediate_spreading",
        title: "Click to see what happens next...",
        text: "The box seals itself with a satisfied whisper. Another detective consumed, another mind absorbed into its endless hunger. The tree's roots pulse with renewed vigor. Over the following months, more mysterious disappearances plague the city. The box appears in different locations, always finding its way to the curious, the brave, the foolish.",
        revealed: false,
        unlocked: true,
      },
      {
        id: "consequences_hope",
        title: "Click to witness the world's fate...",
        text: "Years pass. The tree's influence seeps beyond the box, poisoning dreams, twisting reality. Street lamps flicker with unnatural shadows. Children speak of voices in the wind. But somewhere, another detective picks up the trail.",
        revealed: false,
        unlocked: false,
      },
    ];

    this.currentRevealedCount = 0;
    this.allSegmentsRevealed = false;

    console.log("💀 Enhanced GameOverScreen instance created");
  }

  // Initialize with game over type and message
  initializeGameOver(type, message = "") {
    console.log(
      `💀 initializeGameOver called with type: ${type}, message: ${message}`
    );

    this.gameOverType = type;
    this.gameOverMessage = message;

    // Reset story state
    this.storySegments.forEach((segment) => {
      segment.revealed = false;
      segment.unlocked = segment.id === "immediate_spreading";
    });
    this.currentRevealedCount = 0;
    this.allSegmentsRevealed = false;
    this.rightColumnVisible = false;

    console.log(
      `💀 Game Over initialized - Type: ${type}, Message: ${message}`
    );
  }

  render() {
    // Determine content based on game over type
    const content = this.getGameOverContent();

    // Inject HTML content into the container with two-column layout
    this.container.innerHTML = `
      <div class="game-over-content">
        <!-- Left Column - Aftermath -->
        <div class="game-over-left-column" id="leftColumn">
          <div class="aftermath-section">
            <h2 class="aftermath-title">The Aftermath</h2>
            <p class="aftermath-intro">The story doesn't end with your defeat. Click to discover what happens next...</p>

            <div class="story-segments">
              ${this.storySegments
                .map(
                  (segment, index) => `
                <div class="story-segment ${
                  segment.unlocked ? "unlocked" : "locked"
                }" 
                     data-segment="${index}" 
                     id="story-segment-${index}">
                  <div class="story-title">${segment.title}</div>
                  <div class="story-text">${segment.text}</div>
                  <div class="story-click-hint">👆</div>
                </div>
              `
                )
                .join("")}
            </div>

            <div class="motivation-message" style="opacity: 0;">
              <p class="motivation-text">
                <strong>The world grows darker with each failure.</strong><br>
                But every detective who falls brings us closer to understanding the truth.<br>
                <em>Will you be the one to finally stop the Evil Tree?</em>
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column - Character and Controls -->
        <div class="game-over-right-column" id="rightColumn">
          <div class="character-section">
            <div class="game-over-story">
              <div class="rusty-portrait">
                <div class="rusty-image">
                  <img src="images/seed.png" alt="Cursed Seed" />
                </div>
              </div>
              <div class="game-over-narrative">
                <p class="game-over-main-text">${content.mainText}</p>
              </div>
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
                <span class="button-text">Save the World</span>
              </button>
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

    // Setup story segment listeners
    this.setupStorySegmentListeners();
  }

  getGameOverContent() {
    console.log(
      `💀 getGameOverContent called with gameOverType: ${this.gameOverType}`
    );

    if (this.gameOverType === "tree") {
      return {
        mainText:
          "Rusty's soul was consumed and his bones made into a seed that would soon sprout another evil tree.",
        status: "Defeated by Evil Tree",
      };
    } else {
      return {
        mainText:
          "Rusty's soul was consumed and his bones made into a seed that would soon sprout another evil tree.",
        status: "Search Exhaustion",
      };
    }
  }

  setupStorySegmentListeners() {
    const storySegments = this.container.querySelectorAll(".story-segment");

    storySegments.forEach((segment, index) => {
      segment.addEventListener("click", (e) => {
        this.revealStorySegment(index, e);
      });
    });
  }

  revealStorySegment(index, event) {
    const segment = this.storySegments[index];

    if (!segment.unlocked || segment.revealed) {
      console.log(`Segment ${index} not available for reveal`);
      return;
    }

    console.log(`📖 Revealing story segment: ${segment.id}`);

    // Mark as revealed
    segment.revealed = true;
    this.currentRevealedCount++;

    // Update UI
    const segmentElement = this.container.querySelector(
      `#story-segment-${index}`
    );
    const progressDot = this.container.querySelector(
      `.progress-dot[data-segment="${index}"]`
    );

    if (segmentElement) {
      segmentElement.classList.add("revealed");
      segmentElement.classList.remove("unlocked");
    }

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
    this.createParticleBurst(x, y, 8, "rgba(255, 68, 68, 0.7)");

    // Screen shake for impact
    this.triggerScreenShake(200);

    // Unlock next segment
    if (index + 1 < this.storySegments.length) {
      this.storySegments[index + 1].unlocked = true;
      const nextSegment = this.container.querySelector(
        `#story-segment-${index + 1}`
      );
      if (nextSegment) {
        nextSegment.classList.add("unlocked");
        nextSegment.classList.remove("locked");
      }
    }

    // Check if all segments are revealed
    if (this.currentRevealedCount >= this.storySegments.length) {
      this.onAllSegmentsRevealed();
    }

    // Show success message
    this.showTemporaryMessage(
      `📖 ${segment.title
        .replace("Click to ", "")
        .replace("...", "")} revealed!`,
      "info",
      2000
    );
  }

  onAllSegmentsRevealed() {
    console.log("🎭 All story segments revealed!");

    this.allSegmentsRevealed = true;

    // Show the motivation message
    const motivationMessage = this.container.querySelector(
      ".motivation-message"
    );
    if (motivationMessage) {
      motivationMessage.style.opacity = "1";
    }

    // Update left column positioning
    const leftColumn = document.getElementById("leftColumn");
    if (leftColumn) {
      leftColumn.classList.add("aftermath-complete");
    }

    // Show the right column with fade-in animation
    const rightColumn = document.getElementById("rightColumn");
    if (rightColumn) {
      this.setManagedTimeout(() => {
        rightColumn.classList.add("visible");
        this.rightColumnVisible = true;
      }, 800);
    }

    // Create dramatic effect
    this.createFinalRevealEffect();

    // Update button text to be more motivational
    const restartBtn = document.getElementById("restartBtn");
    if (restartBtn) {
      const buttonText = restartBtn.querySelector(".button-text");
      if (buttonText) {
        buttonText.textContent = "Save the World";
      }
    }

    // Show completion message
    this.showTemporaryMessage(
      "💀 The full horror is revealed. The world needs a hero!",
      "warning",
      3000
    );
  }

  createFinalRevealEffect() {
    // Create multiple dark particle bursts
    for (let i = 0; i < 5; i++) {
      this.setManagedTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        this.createParticleBurst(x, y, 12, "rgba(139, 0, 0, 0.8)");
      }, i * 300);
    }

    // Screen shake sequence
    this.setManagedTimeout(() => {
      this.triggerScreenShake(1000);
    }, 500);
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
    const leftColumn = document.getElementById("leftColumn");
    const rightColumn = document.getElementById("rightColumn");

    if (leftColumn) {
      leftColumn.style.opacity = "0";
      leftColumn.style.transform = "translateX(-30px)";
      leftColumn.style.transition = "all 0.8s ease-out";
    }

    // Right column starts invisible (handled by CSS)
    this.rightColumnVisible = false;

    // Initialize progress dots
    this.updateProgressDots();
  }

  updateProgressDots() {
    const dots = this.container.querySelectorAll(".progress-dot");
    dots.forEach((dot, index) => {
      const segment = this.storySegments[index];

      dot.classList.toggle("available", segment.unlocked);
      dot.classList.toggle("completed", segment.revealed);
    });
  }

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Get DOM elements
    const restartBtn = document.getElementById("restartBtn");

    // Restart button
    if (restartBtn) {
      restartBtn.addEventListener("click", (e) => {
        this.createRippleEffect(restartBtn, e);
        this.restartGame();
      });
    }
  }

  init() {
    console.log("🚀 Initializing Enhanced Game Over Screen");

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

    // Animate left column
    const leftColumn = document.getElementById("leftColumn");
    if (leftColumn) {
      this.setManagedTimeout(() => {
        leftColumn.style.opacity = "1";
        leftColumn.style.transform = "translateX(0)";
      }, 300);
    }

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
    this.showTemporaryMessage(
      "A new detective takes the case...",
      "success",
      2000
    );

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
        if (this.rightColumnVisible) {
          this.restartGame();
        }
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

    // Debug shortcut
    if (e.code === "KeyD" && e.ctrlKey) {
      this.debug();
    }
  }

  handleEscape() {
    console.log("🔙 Escape pressed on Game Over Screen");

    if (this.fadeInComplete && this.buttonsEnabled && this.rightColumnVisible) {
      this.restartGame();
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
      rightColumnVisible: this.rightColumnVisible,
      currentRevealedCount: this.currentRevealedCount,
      allSegmentsRevealed: this.allSegmentsRevealed,
      storySegments: this.storySegments,
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
    this.rightColumnVisible = false;
    this.gameOverType = "search";
    this.gameOverMessage = "";
    this.currentRevealedCount = 0;
    this.allSegmentsRevealed = false;

    // Reset story segments
    this.storySegments.forEach((segment) => {
      segment.revealed = false;
      segment.unlocked = segment.id === "immediate_spreading";
    });

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Enhanced Game Over Screen destroyed");
  }
}

// Make GameOverScreen available globally
window.GameOverScreen = GameOverScreen;

console.log("💀 Enhanced Game Over Screen class loaded");
