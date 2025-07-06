// Story Segment Screen Class - Extends Screen base class
class StorySegmentScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Story segment specific properties
    this.currentSegment = null;
    this.currentFrame = 0;
    this.frames = [];
    this.isAdvancing = false;
    this.nextScreen = "start";
    this.nextScreenData = null;
    this.segmentComplete = false;
    this.clickToAdvance = true;
    this.particleSystem = null;
    this.ambientSounds = [];
    this.textAnimationComplete = false; // Track when text animation is done
    this.currentTypewriterInterval = null; // Track current typewriter animation
    this.isTyping = false; // Track if currently typing

    console.log("📖 StorySegmentScreen instance created");
  }

  // Initialize with story segment data
  initializeStorySegment(segmentData) {
    this.currentSegment = segmentData;
    this.frames = segmentData.frames || [];
    this.currentFrame = 0;
    this.nextScreen = segmentData.nextScreen || "start";
    this.nextScreenData = segmentData.nextScreenData || null;
    this.segmentComplete = false;
    this.clickToAdvance = true;
    this.isAdvancing = false;
    this.textAnimationComplete = false;
    this.currentTypewriterInterval = null;
    this.isTyping = false;

    console.log("📖 Story segment initialized:", segmentData.name);
  }

  render() {
    // Create the enhanced structure
    this.container.innerHTML = `
      <div class="story-segment-content">
        <!-- Enhanced Background Layer -->
        <div class="story-background" id="storyBackground">
          <div class="background-overlay"></div>
          <div class="background-particles" id="backgroundParticles"></div>
        </div>
        
        <!-- Enhanced Items Layer -->
        <div class="story-items-layer" id="storyItems">
          <!-- Items will be positioned here -->
        </div>
        
        <!-- Atmospheric Effects -->
        <div class="story-atmosphere" id="storyAtmosphere">
          <div class="fog-layer"></div>
          <div class="light-rays"></div>
        </div>
        
        <!-- Enhanced Text Layer -->
        <div class="story-text-layer" id="storyText">
          <div class="story-text-box" id="storyTextBox">
            <div class="text-box-glow"></div>
            <div class="story-text-content" id="storyTextContent">
              <!-- Text content will be inserted here -->
            </div>
            <div class="text-progress-bar" id="textProgressBar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>
        
        <!-- Enhanced Controls -->
        <div class="story-controls" id="storyControls">
          <button class="game-button primary enhanced-button" id="continueBtn" style="display: none;">
            <span class="button-text">Continue</span>
            <div class="button-glow"></div>
          </button>
        </div>
        
        <!-- Enhanced Click Indicator -->
        <div class="story-click-indicator" id="clickIndicator">
          <div class="click-prompt">
            <div class="click-icon">👆</div>
            <span>Click to continue...</span>
          </div>
        </div>
        
        <!-- Progress Indicator -->
        <div class="story-progress" id="storyProgress">
          <div class="progress-dots" id="progressDots"></div>
        </div>
        
        <!-- Screen Effects -->
        <div class="screen-effects" id="screenEffects">
          <div class="vignette-overlay"></div>
          <div class="screen-flash" id="screenFlash"></div>
        </div>
      </div>

      <!-- Enhanced Background layers -->
      <div class="stars-layer enhanced-stars"></div>
      <div class="particles-layer enhanced-particles"></div>
    `;

    // Initialize progress dots
    this.initializeProgressDots();

    // Start particle system
    this.initializeParticleSystem();

    // Start with the first frame
    this.showFrame(0);
  }

  initializeProgressDots() {
    const progressDots = document.getElementById("progressDots");
    if (!progressDots) return;

    progressDots.innerHTML = "";

    for (let i = 0; i < this.frames.length; i++) {
      const dot = document.createElement("div");
      dot.className = `progress-dot ${i === 0 ? "active" : ""}`;
      dot.style.animationDelay = `${i * 0.1}s`;
      progressDots.appendChild(dot);
    }
  }

  initializeParticleSystem() {
    const particlesContainer = document.getElementById("backgroundParticles");
    if (!particlesContainer) return;

    // Create floating particles
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.className = "floating-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 10 + "s";
      particle.style.animationDuration = 8 + Math.random() * 4 + "s";
      particlesContainer.appendChild(particle);
    }
  }

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Enhanced click to advance with visual feedback
    this.container.addEventListener("click", (e) => {
      // Don't advance if clicking on the continue button
      if (e.target.id === "continueBtn" || e.target.closest("#continueBtn")) {
        return;
      }

      if (this.clickToAdvance && !this.isAdvancing) {
        // Play click sound
        if (this.audioManager) {
          this.audioManager.playSound("click", false, 0.5);
        }

        this.createClickEffect(e.clientX, e.clientY);

        // If currently typing, complete the text animation first
        if (this.isTyping) {
          this.completeCurrentTextAnimation();
        } else {
          // Otherwise advance to next frame
          this.advanceFrame();
        }
      }
    });

    // Enhanced continue button
    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) {
      // Button hover sound
      continueBtn.addEventListener("mouseenter", () => {
        if (this.audioManager) {
          this.audioManager.playSound("button-hover", false, 0.3);
        }
      });

      continueBtn.addEventListener("click", (e) => {
        // Play click sound
        if (this.audioManager) {
          this.audioManager.playSound("click", false, 0.5);
        }

        this.createRippleEffect(continueBtn, e);
        this.createScreenFlash();
        this.exitStorySegment();
      });
    }

    // Enhanced keyboard support
    document.addEventListener("keydown", (e) => {
      if (this.isActive) {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();

          // Play click sound for keyboard navigation
          if (this.audioManager) {
            this.audioManager.playSound("click", false, 0.5);
          }

          if (this.segmentComplete) {
            this.createScreenFlash();
            this.exitStorySegment();
          } else if (this.clickToAdvance && !this.isAdvancing) {
            // If currently typing, complete the text animation first
            if (this.isTyping) {
              this.completeCurrentTextAnimation();
            } else {
              // Otherwise advance to next frame
              this.advanceFrame();
            }
          }
        }
      }
    });
  }

  createClickEffect(x, y) {
    const clickEffect = document.createElement("div");
    clickEffect.className = "click-effect";
    clickEffect.style.left = x + "px";
    clickEffect.style.top = y + "px";
    document.body.appendChild(clickEffect);

    this.setManagedTimeout(() => {
      clickEffect.remove();
    }, 600);
  }

  createScreenFlash() {
    const screenFlash = document.getElementById("screenFlash");
    if (screenFlash) {
      screenFlash.classList.add("flash-active");
      this.setManagedTimeout(() => {
        screenFlash.classList.remove("flash-active");
      }, 300);
    }
  }

  init() {
    console.log("🚀 Initializing Story Segment Screen");

    // Call parent init
    super.init();

    // Hide click indicator initially
    const clickIndicator = document.getElementById("clickIndicator");
    if (clickIndicator) {
      clickIndicator.style.opacity = "0";
    }

    // Add entrance animation
    const content = this.container.querySelector(".story-segment-content");
    if (content) {
      content.style.opacity = "0";
      content.style.transform = "translateY(20px)";
      content.style.transition = "all 1s ease-out";

      this.setManagedTimeout(() => {
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
      }, 200);
    }

    // Play appropriate atmospheric sound based on segment
    this.playSegmentAtmosphericSound();
  }

  // Play atmospheric sound based on segment type
  playSegmentAtmosphericSound() {
    if (!this.audioManager || !this.currentSegment) return;

    const segmentName = this.currentSegment.name;

    // Play appropriate atmospheric sound for dramatic segments
    if (segmentName === "Victory Setup") {
      this.audioManager.playSound("victory-fanfare", false, 0.4);
    } else if (segmentName === "Defeat Setup") {
      this.audioManager.playSound("defeat-sting", false, 0.4);
    }
  }

  showFrame(frameIndex) {
    if (frameIndex >= this.frames.length) {
      this.completeStorySegment();
      return;
    }

    const frame = this.frames[frameIndex];
    this.currentFrame = frameIndex;
    this.isAdvancing = true;
    this.textAnimationComplete = false;
    this.isTyping = false;

    // Clear any existing typewriter animation
    if (this.currentTypewriterInterval) {
      clearInterval(this.currentTypewriterInterval);
      this.currentTypewriterInterval = null;
    }

    console.log(`📖 Showing frame ${frameIndex + 1}/${this.frames.length}`);

    // Play page turn sound when advancing frames (but not for first frame)
    if (frameIndex > 0 && this.audioManager) {
      this.audioManager.playSound("page-turn", false, 0.3);
    }

    // Hide click indicator immediately when showing new frame
    this.updateClickIndicator(false);

    // Update progress dots
    this.updateProgressDots(frameIndex);

    // Update background with enhanced effects
    this.updateBackground(frame.background);

    // Update items with enhanced animations
    this.updateItems(frame.items || []);

    // Update text with enhanced presentation
    this.updateText(frame.text || "");

    // Update atmospheric effects
    this.updateAtmosphere(frame);

    // Allow advancing after animations complete
    this.setManagedTimeout(() => {
      this.isAdvancing = false;
    }, 1200);
  }

  updateProgressDots(currentFrame) {
    const dots = document.querySelectorAll(".progress-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentFrame);
      dot.classList.toggle("completed", index < currentFrame);
    });
  }

  updateBackground(backgroundData) {
    const background = document.getElementById("storyBackground");
    if (!background || !backgroundData) return;

    if (backgroundData.image) {
      background.style.backgroundImage = `url(${backgroundData.image})`;
    }

    if (backgroundData.position) {
      background.style.backgroundPosition = backgroundData.position;
    }

    if (backgroundData.size) {
      background.style.backgroundSize = backgroundData.size;
    }

    // Enhanced fade transition with scaling
    background.style.opacity = "0";
    background.style.transform = "scale(1.05)";
    background.style.transition = "all 1s ease-in-out";

    this.setManagedTimeout(() => {
      background.style.opacity = "1";
      background.style.transform = "scale(1)";
    }, 100);
  }

  updateItems(itemsData) {
    const itemsLayer = document.getElementById("storyItems");
    if (!itemsLayer) return;

    // Clear existing items with fade out
    const existingItems = itemsLayer.querySelectorAll(".story-item");
    existingItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "scale(0.8)";
    });

    this.setManagedTimeout(() => {
      itemsLayer.innerHTML = "";

      // Add new items with enhanced effects
      itemsData.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.className = "story-item enhanced-item";
        itemElement.id = `story-item-${index}`;

        // Handle image content
        if (item.image) {
          const img = document.createElement("img");
          img.src = item.image;
          img.alt = item.name || "Story Item";
          img.onload = () => {
            // Apply tint if specified
            if (item.tint) {
              img.style.filter = `hue-rotate(${this.getTintHue(
                item.tint
              )}) saturate(150%)`;
            }
          };
          itemElement.appendChild(img);
        } else if (item.symbol) {
          // Fallback for symbols
          itemElement.innerHTML = item.symbol;
        }

        // Set initial position and enhanced styling
        itemElement.style.cssText = `
          position: absolute;
          left: ${item.x || 50}%;
          top: ${item.y || 50}%;
          transform: translate(-50%, -50%) scale(${item.scale || 1});
          opacity: ${item.opacity || 1};
          transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: ${item.zIndex || 10};
          font-size: ${item.fontSize || "2em"};
          filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.8));
        `;

        // Add enhanced animation classes
        if (item.animation) {
          itemElement.classList.add(`story-animation-${item.animation}`);
          itemElement.classList.add("enhanced-animation");
        }

        itemsLayer.appendChild(itemElement);

        // Enhanced entrance animation with sound
        if (item.animateFrom) {
          itemElement.style.left = `${item.animateFrom.x}%`;
          itemElement.style.top = `${item.animateFrom.y}%`;
          itemElement.style.transform = `translate(-50%, -50%) scale(${
            item.animateFrom.scale || 0.3
          }) rotate(${Math.random() * 360}deg)`;
          itemElement.style.opacity = item.animateFrom.opacity || 0;

          this.setManagedTimeout(() => {
            itemElement.style.left = `${item.x || 50}%`;
            itemElement.style.top = `${item.y || 50}%`;
            itemElement.style.transform = `translate(-50%, -50%) scale(${
              item.scale || 1
            }) rotate(0deg)`;
            itemElement.style.opacity = item.opacity || 1;

            // Play item sparkle sound for animated items
            if (this.audioManager) {
              this.audioManager.playSound("item-sparkle", false, 0.2);
            }
          }, 300 + index * 100);
        }

        // Add hover effects for interactivity
        itemElement.addEventListener("mouseenter", () => {
          if (!this.isAdvancing) {
            itemElement.style.transform = `translate(-50%, -50%) scale(${
              (item.scale || 1) * 1.1
            })`;
            itemElement.style.filter =
              "drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))";
          }
        });

        itemElement.addEventListener("mouseleave", () => {
          if (!this.isAdvancing) {
            itemElement.style.transform = `translate(-50%, -50%) scale(${
              item.scale || 1
            })`;
            itemElement.style.filter =
              "drop-shadow(0 0 10px rgba(0, 0, 0, 0.8))";
          }
        });
      });
    }, 200);
  }

  getTintHue(color) {
    // Convert color to hue rotation
    const colorMap = {
      "#ff4444": "0deg",
      "#ff0000": "0deg",
      "#44ff44": "120deg",
      "#4444ff": "240deg",
      "#ffff44": "60deg",
      "#ff44ff": "300deg",
      "#44ffff": "180deg",
      "#666": "0deg",
      "#ffd700": "50deg",
    };
    return colorMap[color] || "0deg";
  }

  updateText(textData) {
    const textContent = document.getElementById("storyTextContent");
    const textBox = document.getElementById("storyTextBox");
    const progressBar = document.getElementById("textProgressBar");

    if (!textContent || !textBox) return;

    if (!textData) {
      textBox.style.opacity = "0";
      textBox.style.transform = "translateY(50px)";
      this.textAnimationComplete = true;
      this.isTyping = false;
      return;
    }

    // Handle string or object text data
    let text = "";
    let speaker = "";
    let style = "normal";

    if (typeof textData === "string") {
      text = textData;
    } else {
      text = textData.text || "";
      speaker = textData.speaker || "";
      style = textData.style || "normal";
    }

    // Clear and set new content
    textContent.innerHTML = "";

    // Create speaker element first if we have a speaker
    if (speaker) {
      const speakerElement = document.createElement("div");
      speakerElement.className = "story-speaker enhanced-speaker";
      speakerElement.textContent = speaker;

      // Add speaker-specific styling
      if (speaker === "The Evil Tree" || speaker === "???") {
        speakerElement.classList.add("evil-speaker");
      }

      textContent.appendChild(speakerElement);
    }

    // Create text element
    const textElement = document.createElement("div");
    textElement.className = `story-text story-text-${style} enhanced-text`;
    textContent.appendChild(textElement);

    // Enhanced text box entrance
    textBox.style.opacity = "0";
    textBox.style.transform = "translateY(50px) scale(0.95)";
    textBox.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    this.setManagedTimeout(() => {
      textBox.style.opacity = "1";
      textBox.style.transform = "translateY(0) scale(1)";
    }, 400);

    // Enhanced typewriter effect
    if (text.length > 0) {
      this.enhancedTypeWriterEffect(textElement, text, progressBar);
    } else {
      // If no text, mark as complete immediately
      this.textAnimationComplete = true;
      this.isTyping = false;
      // Show click indicator if not the last frame
      if (this.currentFrame < this.frames.length - 1) {
        this.setManagedTimeout(() => {
          this.updateClickIndicator(true);
        }, 800);
      }
    }
  }

  enhancedTypeWriterEffect(element, text, progressBar) {
    element.innerHTML = "";
    let index = 0;
    const words = text.split(" ");
    let currentWord = 0;
    this.isTyping = true;

    this.currentTypewriterInterval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);

        // Update progress bar
        if (progressBar) {
          const progress = (index / text.length) * 100;
          const fill = progressBar.querySelector(".progress-fill");
          if (fill) {
            fill.style.width = progress + "%";
          }
        }

        // Add word-by-word reveal effect
        if (text.charAt(index) === " ") {
          const wordSpan = document.createElement("span");
          wordSpan.className = "word-reveal";
          wordSpan.style.animationDelay = currentWord * 0.05 + "s";
          currentWord++;
        }

        index++;

        // Play typing sound occasionally (reduced frequency to avoid overwhelming)
        if (index % 4 === 0 && this.audioManager) {
          this.audioManager.playSound("typewriter_click", false, 0.08);
        }
      } else {
        this.finishTextAnimation(progressBar);
      }
    }, 40);

    this.intervals.push(this.currentTypewriterInterval);
  }

  // New method to complete text animation instantly
  completeCurrentTextAnimation() {
    if (!this.isTyping || !this.currentTypewriterInterval) return;

    // Clear the interval
    clearInterval(this.currentTypewriterInterval);
    this.currentTypewriterInterval = null;

    // Get the current frame's text
    const frame = this.frames[this.currentFrame];
    if (!frame || !frame.text) return;

    let text = "";
    if (typeof frame.text === "string") {
      text = frame.text;
    } else {
      text = frame.text.text || "";
    }

    // Complete the text immediately
    const textElement = document.querySelector(".story-text");
    if (textElement && text) {
      textElement.innerHTML = text;
    }

    // Complete progress bar
    const progressBar = document.getElementById("textProgressBar");
    this.finishTextAnimation(progressBar);
  }

  // Helper method to finish text animation
  finishTextAnimation(progressBar) {
    // Clear the interval
    if (this.currentTypewriterInterval) {
      clearInterval(this.currentTypewriterInterval);
      this.currentTypewriterInterval = null;
    }

    // Complete progress bar
    if (progressBar) {
      const fill = progressBar.querySelector(".progress-fill");
      if (fill) {
        fill.style.width = "100%";
      }
    }

    // Mark text animation as complete
    this.textAnimationComplete = true;
    this.isTyping = false;

    // Show click indicator if not the last frame
    if (this.currentFrame < this.frames.length - 1) {
      this.setManagedTimeout(() => {
        this.updateClickIndicator(true);
      }, 500);
    }
  }

  updateAtmosphere(frame) {
    const atmosphere = document.getElementById("storyAtmosphere");
    if (!atmosphere) return;

    // Update atmospheric effects based on frame content
    const fog = atmosphere.querySelector(".fog-layer");
    const lightRays = atmosphere.querySelector(".light-rays");

    if (frame.background && frame.background.image) {
      // Adjust atmosphere based on background
      if (frame.background.image.includes("void")) {
        fog.style.opacity = "0.8";
        lightRays.style.opacity = "0.2";
      } else if (frame.background.image.includes("forest")) {
        fog.style.opacity = "0.4";
        lightRays.style.opacity = "0.6";
      } else if (frame.background.image.includes("catacomb")) {
        fog.style.opacity = "0.6";
        lightRays.style.opacity = "0.3";
      } else {
        fog.style.opacity = "0.3";
        lightRays.style.opacity = "0.5";
      }
    }
  }

  updateClickIndicator(show) {
    const clickIndicator = document.getElementById("clickIndicator");
    if (!clickIndicator) return;

    if (show) {
      clickIndicator.style.opacity = "1";
      clickIndicator.style.transform = "translateY(0) scale(1)";
      clickIndicator.style.pointerEvents = "auto";
    } else {
      clickIndicator.style.opacity = "0";
      clickIndicator.style.transform = "translateY(10px) scale(0.9)";
      clickIndicator.style.pointerEvents = "none";
    }
  }

  advanceFrame() {
    if (this.isAdvancing) return;

    this.showFrame(this.currentFrame + 1);
  }

  completeStorySegment() {
    console.log("📖 Story segment completed");

    this.segmentComplete = true;
    this.clickToAdvance = false;
    this.isTyping = false;

    // Clear any existing typewriter animation
    if (this.currentTypewriterInterval) {
      clearInterval(this.currentTypewriterInterval);
      this.currentTypewriterInterval = null;
    }

    // Play success sound when segment completes
    if (this.audioManager) {
      this.audioManager.playSound("success", false, 0.5);
    }

    // Hide click indicator
    this.updateClickIndicator(false);

    // Show enhanced continue button
    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) {
      continueBtn.style.display = "block";
      continueBtn.style.opacity = "0";
      continueBtn.style.transform = "translateY(30px) scale(0.9)";
      continueBtn.style.transition =
        "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      this.setManagedTimeout(() => {
        continueBtn.style.opacity = "1";
        continueBtn.style.transform = "translateY(0) scale(1)";
      }, 600);
    }

    // Complete all progress dots
    const dots = document.querySelectorAll(".progress-dot");
    dots.forEach((dot) => {
      dot.classList.add("completed");
    });

    // Add completion particle burst
    this.createCompletionEffect();
  }

  createCompletionEffect() {
    const itemsLayer = document.getElementById("storyItems");
    if (!itemsLayer) return;

    // Create particle burst
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "completion-particle";
      particle.style.left = "50%";
      particle.style.top = "50%";
      particle.style.transform = `translate(-50%, -50%) rotate(${
        Math.random() * 360
      }deg)`;
      itemsLayer.appendChild(particle);

      this.setManagedTimeout(() => {
        particle.remove();
      }, 2000);
    }
  }

  exitStorySegment() {
    console.log("📖 Exiting story segment to:", this.nextScreen);

    // Enhanced fade out
    const content = this.container.querySelector(".story-segment-content");
    if (content) {
      content.style.opacity = "0";
      content.style.transform = "translateY(-30px) scale(0.95)";
      content.style.transition = "all 1s ease-in-out";
    }

    // Transition to next screen
    this.setManagedTimeout(() => {
      if (window.game) {
        // If next screen needs special data, handle it
        if (this.nextScreenData) {
          if (this.nextScreen === "search") {
            window.game.startSearchScreen(this.nextScreenData);
          } else {
            window.game.showScreen(this.nextScreen);
          }
        } else {
          window.game.showScreen(this.nextScreen);
        }
      }
    }, 1000);
  }

  handleKeydown(e) {
    // Call parent handler
    super.handleKeydown(e);

    // Story segment specific keyboard shortcuts
    if (e.code === "ArrowRight" || e.code === "ArrowDown") {
      e.preventDefault();
      if (this.segmentComplete) {
        this.exitStorySegment();
      } else if (this.clickToAdvance && !this.isAdvancing) {
        // If currently typing, complete the text animation first
        if (this.isTyping) {
          this.completeCurrentTextAnimation();
        } else {
          // Otherwise advance to next frame
          this.advanceFrame();
        }
      }
    }

    if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
      e.preventDefault();
      if (this.currentFrame > 0 && !this.isAdvancing) {
        this.showFrame(this.currentFrame - 1);
      }
    }

    // Skip to end
    if (e.code === "KeyS" && e.ctrlKey) {
      e.preventDefault();
      this.showFrame(this.frames.length);
    }
  }

  handleEscape() {}

  // Debug method override
  debug() {
    super.debug();
    console.log("Story Segment Screen Specific Debug Info:", {
      currentFrame: this.currentFrame,
      totalFrames: this.frames.length,
      segmentComplete: this.segmentComplete,
      clickToAdvance: this.clickToAdvance,
      isAdvancing: this.isAdvancing,
      textAnimationComplete: this.textAnimationComplete,
      isTyping: this.isTyping,
      nextScreen: this.nextScreen,
      currentSegment: this.currentSegment?.name,
    });
  }

  // Clean up when screen is destroyed
  destroy() {
    // Clear any existing typewriter animation
    if (this.currentTypewriterInterval) {
      clearInterval(this.currentTypewriterInterval);
      this.currentTypewriterInterval = null;
    }

    // Clean up particle system
    if (this.particleSystem) {
      this.particleSystem = null;
    }

    // Reset state
    this.currentSegment = null;
    this.currentFrame = 0;
    this.frames = [];
    this.isAdvancing = false;
    this.nextScreen = "start";
    this.nextScreenData = null;
    this.segmentComplete = false;
    this.clickToAdvance = true;
    this.textAnimationComplete = false;
    this.isTyping = false;
    this.currentTypewriterInterval = null;
    this.ambientSounds = [];

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Story Segment Screen destroyed");
  }
}

// Make StorySegmentScreen available globally
window.StorySegmentScreen = StorySegmentScreen;

console.log("📖 Enhanced Story Segment Screen class loaded");
