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

    console.log("📖 Story segment initialized:", segmentData.name);
  }

  render() {
    // Create the basic structure
    this.container.innerHTML = `
      <div class="story-segment-content">
        <div class="story-background" id="storyBackground">
          <!-- Background will be set via CSS -->
        </div>
        
        <div class="story-items-layer" id="storyItems">
          <!-- Items will be positioned here -->
        </div>
        
        <div class="story-text-layer" id="storyText">
          <div class="story-text-box" id="storyTextBox">
            <div class="story-text-content" id="storyTextContent">
              <!-- Text content will be inserted here -->
            </div>
          </div>
        </div>
        
        <div class="story-controls" id="storyControls">
          <button class="game-button primary" id="continueBtn" style="display: none;">
            <span class="button-text">Continue</span>
          </button>
        </div>
        
        <div class="story-click-indicator" id="clickIndicator">
          <div class="click-prompt">Click to continue...</div>
        </div>
      </div>

      <!-- Background layers for particles -->
      <div class="stars-layer"></div>
      <div class="particles-layer"></div>
    `;

    // Start with the first frame
    this.showFrame(0);
  }

  setupEventListeners() {
    // Call parent setup
    super.setupEventListeners();

    // Click to advance
    this.container.addEventListener("click", (e) => {
      // Don't advance if clicking on the continue button
      if (e.target.id === "continueBtn" || e.target.closest("#continueBtn")) {
        return;
      }

      if (this.clickToAdvance && !this.isAdvancing) {
        this.advanceFrame();
      }
    });

    // Continue button
    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) {
      continueBtn.addEventListener("click", (e) => {
        this.createRippleEffect(continueBtn, e);
        this.exitStorySegment();
      });
    }

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      if (this.isActive) {
        if (e.code === "Space" || e.code === "Enter") {
          if (this.segmentComplete) {
            this.exitStorySegment();
          } else if (this.clickToAdvance && !this.isAdvancing) {
            this.advanceFrame();
          }
        }
      }
    });
  }

  init() {
    console.log("🚀 Initializing Story Segment Screen");

    // Call parent init
    super.init();

    // Play story music if available
    if (this.audioManager) {
      this.audioManager.playSound("story_music", true, 0.3);
    }

    // Hide click indicator initially
    const clickIndicator = document.getElementById("clickIndicator");
    if (clickIndicator) {
      clickIndicator.style.opacity = "0";
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

    console.log(`📖 Showing frame ${frameIndex + 1}/${this.frames.length}`);

    // Update background
    this.updateBackground(frame.background);

    // Update items
    this.updateItems(frame.items || []);

    // Update text
    this.updateText(frame.text || "");

    // Show/hide click indicator
    this.updateClickIndicator(frameIndex < this.frames.length - 1);

    // Allow advancing after animations complete
    this.setManagedTimeout(() => {
      this.isAdvancing = false;
    }, 1000);
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

    // Add fade transition
    background.style.opacity = "0";
    background.style.transition = "opacity 0.8s ease-in-out";

    this.setManagedTimeout(() => {
      background.style.opacity = "1";
    }, 100);
  }

  updateItems(itemsData) {
    const itemsLayer = document.getElementById("storyItems");
    if (!itemsLayer) return;

    // Clear existing items
    itemsLayer.innerHTML = "";

    // Add new items
    itemsData.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.className = "story-item";
      itemElement.id = `story-item-${index}`;

      // Set content
      if (item.image) {
        itemElement.innerHTML = `<img src="${item.image}" alt="${
          item.name || "Story Item"
        }" />`;
      } else if (item.symbol) {
        itemElement.innerHTML = item.symbol;
      } else if (item.text) {
        itemElement.innerHTML = item.text;
      }

      // Set initial position and style
      itemElement.style.cssText = `
        position: absolute;
        left: ${item.x || 50}%;
        top: ${item.y || 50}%;
        transform: translate(-50%, -50%) scale(${item.scale || 1});
        opacity: ${item.opacity || 1};
        transition: all 0.8s ease-in-out;
        z-index: ${item.zIndex || 10};
        font-size: ${item.fontSize || "2em"};
        color: ${item.color || "#e0e0e0"};
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      `;

      // Add animation class if specified
      if (item.animation) {
        itemElement.classList.add(`story-animation-${item.animation}`);
      }

      itemsLayer.appendChild(itemElement);

      // Animate to final position if specified
      if (item.animateFrom) {
        itemElement.style.left = `${item.animateFrom.x}%`;
        itemElement.style.top = `${item.animateFrom.y}%`;
        itemElement.style.transform = `translate(-50%, -50%) scale(${
          item.animateFrom.scale || 0.5
        })`;
        itemElement.style.opacity = item.animateFrom.opacity || 0;

        this.setManagedTimeout(() => {
          itemElement.style.left = `${item.x || 50}%`;
          itemElement.style.top = `${item.y || 50}%`;
          itemElement.style.transform = `translate(-50%, -50%) scale(${
            item.scale || 1
          })`;
          itemElement.style.opacity = item.opacity || 1;
        }, 200);
      }
    });
  }

  updateText(textData) {
    const textContent = document.getElementById("storyTextContent");
    const textBox = document.getElementById("storyTextBox");

    if (!textContent || !textBox) return;

    if (!textData) {
      textBox.style.opacity = "0";
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

    if (speaker) {
      const speakerElement = document.createElement("div");
      speakerElement.className = "story-speaker";
      speakerElement.textContent = speaker;
      textContent.appendChild(speakerElement);
    }

    const textElement = document.createElement("div");
    textElement.className = `story-text story-text-${style}`;
    textElement.innerHTML = text.replace(/\n/g, "<br>");
    textContent.appendChild(textElement);

    // Show text box with animation
    textBox.style.opacity = "0";
    textBox.style.transform = "translateY(20px)";
    textBox.style.transition = "all 0.6s ease-out";

    this.setManagedTimeout(() => {
      textBox.style.opacity = "1";
      textBox.style.transform = "translateY(0)";
    }, 300);

    // Type writer effect for text
    if (text.length > 0) {
      this.typeWriterEffect(textElement, text);
    }
  }

  typeWriterEffect(element, text) {
    element.innerHTML = "";
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);

    this.intervals.push(typeInterval);
  }

  updateClickIndicator(show) {
    const clickIndicator = document.getElementById("clickIndicator");
    if (!clickIndicator) return;

    if (show) {
      clickIndicator.style.opacity = "1";
      clickIndicator.style.pointerEvents = "auto";
    } else {
      clickIndicator.style.opacity = "0";
      clickIndicator.style.pointerEvents = "none";
    }
  }

  advanceFrame() {
    if (this.isAdvancing) return;

    // Play advance sound
    if (this.audioManager) {
      this.audioManager.playSound("page_turn", false, 0.5);
    }

    this.showFrame(this.currentFrame + 1);
  }

  completeStorySegment() {
    console.log("📖 Story segment completed");

    this.segmentComplete = true;
    this.clickToAdvance = false;

    // Hide click indicator
    this.updateClickIndicator(false);

    // Show continue button
    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) {
      continueBtn.style.display = "block";
      continueBtn.style.opacity = "0";
      continueBtn.style.transform = "translateY(20px)";
      continueBtn.style.transition = "all 0.6s ease-out";

      this.setManagedTimeout(() => {
        continueBtn.style.opacity = "1";
        continueBtn.style.transform = "translateY(0)";
      }, 500);
    }

    // Play completion sound
    if (this.audioManager) {
      this.audioManager.playSound("story_complete", false, 0.6);
    }
  }

  exitStorySegment() {
    console.log("📖 Exiting story segment to:", this.nextScreen);

    // Play exit sound
    if (this.audioManager) {
      this.audioManager.playSound("story_exit", false, 0.7);
    }

    // Fade out
    const content = this.container.querySelector(".story-segment-content");
    if (content) {
      content.style.opacity = "0";
      content.style.transform = "translateY(-20px)";
      content.style.transition = "all 0.8s ease-in-out";
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
    }, 800);
  }

  handleKeydown(e) {
    // Call parent handler
    super.handleKeydown(e);

    // Story segment specific keyboard shortcuts
    if (e.code === "ArrowRight" || e.code === "ArrowDown") {
      if (this.segmentComplete) {
        this.exitStorySegment();
      } else if (this.clickToAdvance && !this.isAdvancing) {
        this.advanceFrame();
      }
    }

    // Skip to end
    if (e.code === "KeyS" && e.ctrlKey) {
      this.showFrame(this.frames.length);
    }
  }

  handleEscape() {
    console.log("🔙 Escape pressed on Story Segment Screen");

    if (this.segmentComplete) {
      this.exitStorySegment();
    } else {
      // Show skip dialog or skip to end
      this.showFrame(this.frames.length);
    }
  }

  // Debug method override
  debug() {
    super.debug();
    console.log("Story Segment Screen Specific Debug Info:", {
      currentFrame: this.currentFrame,
      totalFrames: this.frames.length,
      segmentComplete: this.segmentComplete,
      clickToAdvance: this.clickToAdvance,
      isAdvancing: this.isAdvancing,
      nextScreen: this.nextScreen,
      currentSegment: this.currentSegment?.name,
    });
  }

  // Clean up when screen is destroyed
  destroy() {
    // Stop story music
    if (this.audioManager) {
      this.audioManager.stopSound("story_music");
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

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Story Segment Screen destroyed");
  }
}

// Make StorySegmentScreen available globally
window.StorySegmentScreen = StorySegmentScreen;

console.log("📖 Story Segment Screen class loaded");
