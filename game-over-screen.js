// Enhanced Game Over Screen Class - Extends Screen base class
class GameOverScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Game over screen specific properties
    this.gameOverType = "search"; // 'search' or 'tree'
    this.gameOverMessage = "";
    this.buttonsEnabled = true;
    this.fadeInComplete = false;

    // Interactive story state
    this.storySegments = [
      {
        id: "immediate",
        title: "Click to see what happens immediately after...",
        text: "The box seals itself with a satisfied whisper. Another detective consumed, another mind absorbed into its endless hunger. The tree's roots pulse with renewed vigor.",
        revealed: false,
        unlocked: true,
      },
      {
        id: "spreading",
        title: "Click to discover the spreading darkness...",
        text: "Over the following months, more mysterious disappearances plague the city. The box appears in different locations, always finding its way to the curious, the brave, the foolish.",
        revealed: false,
        unlocked: false,
      },
      {
        id: "consequences",
        title: "Click to witness the world's fate...",
        text: "Years pass. The tree's influence seeps beyond the box, poisoning dreams, twisting reality. Street lamps flicker with unnatural shadows. Children speak of voices in the wind.",
        revealed: false,
        unlocked: false,
      },
      {
        id: "hope",
        title: "Click to find the glimmer of hope...",
        text: "But somewhere, another detective picks up the trail. Someone who might succeed where others failed. Someone who might finally close this case for good. Will you be that detective?",
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
      segment.unlocked = segment.id === "immediate";
    });
    this.currentRevealedCount = 0;
    this.allSegmentsRevealed = false;

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
        <div class="game-over-story">
          <div class="rusty-portrait">
            <div class="rusty-image">🦝</div>
          </div>
          <div class="game-over-narrative">
            <p class="game-over-main-text">${content.mainText}</p>
            <p class="game-over-sub-text">${content.subText}</p>
          </div>
        </div>

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

    // Setup story segment listeners
    this.setupStorySegmentListeners();
  }

  getGameOverContent() {
    console.log(
      `💀 getGameOverContent called with gameOverType: ${this.gameOverType}`
    );

    if (this.gameOverType === "tree") {
      return {
        icon: "🌲",
        title: "The Tree Claims Victory",
        mainText:
          "As rusty's bones shimmer and fuse into a strange seed, a deep sense of dread could be felt for miles around the box in every direction.",
        subText:
          "Sometimes even the best detective runs out of steam. Good thing they can always turn into seeds!",
        status: "Defeated by Evil Tree",
      };
    } else {
      return {
        icon: "🔍",
        title: "The Tree Claims Victory",
        mainText:
          "As rusty's bones shimmer and fuse into a strange seed, a deep sense of dread could be felt for miles around the box in every direction.",
        subText:
          "Sometimes even the best detective runs out of steam. Good thing they can always turn into seeds!",
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
    const sections = [
      ".game-over-header",
      ".game-over-story",
      ".aftermath-section",
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

    // Animate individual sections
    const sections = [
      ".game-over-header",
      ".game-over-story",
      ".aftermath-section",
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
        this.restartGame();
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
    if (e.code === "Digit4" || e.code === "Numpad4") {
      this.revealStorySegment(3, {
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
    this.gameOverType = "search";
    this.gameOverMessage = "";
    this.currentRevealedCount = 0;
    this.allSegmentsRevealed = false;

    // Reset story segments
    this.storySegments.forEach((segment) => {
      segment.revealed = false;
      segment.unlocked = segment.id === "immediate";
    });

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Enhanced Game Over Screen destroyed");
  }
}

// Make GameOverScreen available globally
window.GameOverScreen = GameOverScreen;

console.log("💀 Enhanced Game Over Screen class loaded");
