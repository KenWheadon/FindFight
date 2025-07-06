// Fight Screen Class - Combat phase of the game
class FightScreen extends Screen {
  constructor(container, screenName) {
    super(container, screenName);

    // Fight screen specific properties
    this.currentPhase = 1;
    this.treeHP = 20;
    this.maxTreeHP = 20;
    this.playerStamina = 100;
    this.maxPlayerStamina = 100;
    this.playerHand = [];
    this.availableItems = [];
    this.usedItems = [];
    this.currentTurn = 1;
    this.cardsUsedThisTurn = 0;
    this.maxCardsPerTurn = 2;
    this.handSize = 5;
    this.treeWeakness = null;
    this.treeImmunity = null;
    this.selectedCards = [];
    this.isPlayerTurn = true;
    this.combatInProgress = false;
    this.cardAnimationInProgress = false;
    this.treeAttackDamage = 5;
    this.phaseDialogue = "";
    this.symbols = ["detection", "weakness", "emotional", "mental"];

    // Message queue system for staggered feedback
    this.messageQueue = [];
    this.isProcessingMessages = false;

    // Tooltip system
    this.tooltip = null;

    console.log("⚔️ FightScreen instance created");
  }

  // Initialize fight with found items from search and starting stamina
  initializeFight(foundItems, phase = 1, startingStamina = 100) {
    console.log(
      `⚔️ Initializing fight - Phase ${phase}`,
      foundItems,
      `Starting stamina: ${startingStamina}`
    );

    this.currentPhase = phase;
    this.availableItems = [...foundItems];
    this.usedItems = [];

    // Set starting stamina from search screen
    this.playerStamina = startingStamina;
    this.maxPlayerStamina = 100;

    // Set phase-specific values
    this.setPhaseParameters();

    // Draw initial hand
    this.drawHand();

    // Set initial tree weakness/immunity
    this.setTreeSymbols();

    console.log(
      `⚔️ Fight initialized - Phase ${this.currentPhase}, Tree HP: ${this.treeHP}, Starting Stamina: ${this.playerStamina}`
    );
  }

  setPhaseParameters() {
    switch (this.currentPhase) {
      case 1:
        this.treeHP = this.maxTreeHP = 20;
        this.treeAttackDamage = 5;
        this.phaseDialogue = "You don't belong here, little detective...";
        break;
      case 2:
        this.treeHP = this.maxTreeHP = 30;
        this.treeAttackDamage = 10;
        this.phaseDialogue =
          "Ask the blacksmith's daughter what she found beneath the roots...";
        break;
      case 3:
        this.treeHP = this.maxTreeHP = 50;
        this.treeAttackDamage = 15;
        this.phaseDialogue = "You opened the box. You *are* the next seed.";
        break;
    }
  }

  // Get tree image based on current phase
  getTreeImage() {
    switch (this.currentPhase) {
      case 1:
        return "images/tree-small.png";
      case 2:
        return "images/tree.png";
      case 3:
        return "images/tree-stronger.png";
      default:
        return "images/tree.png";
    }
  }

  // Get background image based on current phase
  getBackgroundImage() {
    switch (this.currentPhase) {
      case 1:
        return "images/void-battle-1.png";
      case 2:
        return "images/void-battle-2.png";
      case 3:
        return "images/void-battle-3.png";
      default:
        return "images/void-battle-1.png";
    }
  }

  drawHand() {
    this.playerHand = [];

    // Draw up to handSize cards
    for (let i = 0; i < this.handSize; i++) {
      const card = this.drawCard();
      if (card) {
        this.playerHand.push(card);
      }
    }

    console.log(`🃏 Drew hand of ${this.playerHand.length} cards`);
  }

  drawCard() {
    // First try to draw from available items
    if (this.availableItems.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * this.availableItems.length
      );
      const item = this.availableItems.splice(randomIndex, 1)[0];

      // Ensure the item has an id property - use the item's original id
      if (!item.id) {
        item.id = item.id || `item_${Date.now()}_${Math.random()}`;
      }

      return item;
    }

    // If no items left, create a pebble card
    return this.createPebbleCard();
  }

  createPebbleCard() {
    return {
      id: "pebble_" + Date.now() + Math.random(),
      name: "Pebble",
      symbol: "🪨",
      image: "images/pebble.png", // Updated to use pebble.png
      damage: 1,
      restore: 1,
      type: "weakness",
      text: ["A small stone.", "Better than nothing.", "Reliable in a pinch."],
      cursed: false,
      isPebble: true,
      hasUsed: true, // Pebbles are always known
    };
  }

  setTreeSymbols() {
    // Randomly select weakness and immunity types
    this.treeWeakness =
      this.symbols[Math.floor(Math.random() * this.symbols.length)];
    this.treeImmunity = this.symbols.filter((s) => s !== this.treeWeakness)[
      Math.floor(Math.random() * (this.symbols.length - 1))
    ];

    console.log(
      `🎯 Tree weakness: ${this.treeWeakness}, immunity: ${this.treeImmunity}`
    );
  }

  render() {
    this.container.innerHTML = `
      <div class="fight-screen-content">
        <!-- Background layers -->
        <div class="stars-layer"></div>
        <div class="asteroids-layer"></div>
        <div class="particles-layer"></div>
        
        <!-- Tree section -->
        <div class="tree-section">
          <!-- Tree health bar positioned above tree -->
          <div class="tree-health-bar">
            <div class="health-bar-bg">
              <div class="health-bar-fill" id="treeHealthFill"></div>
            </div>
            <div class="health-text" id="treeHealthText">
              ${this.treeHP}/${this.maxTreeHP}
            </div>
          </div>
          
          <!-- Tree visual with symbols on sides -->
          <div class="tree-visual-container">
            <!-- Weakness symbol (left) -->
            <div class="tree-symbol weakness" id="treeWeakness">
              <img src="${ITEMS_UTILS.getTreeSymbolImage(
                this.treeWeakness
              )}" alt="Weakness" class="symbol-image">
            </div>
            
            <!-- Tree image -->
            <div class="tree-visual" id="treeVisual">
              <img src="${this.getTreeImage()}" alt="Evil Tree" class="tree-image" id="treeImage">
            </div>
            
            <!-- Immunity symbol (right) -->
            <div class="tree-symbol immunity" id="treeImmunity">
              <img src="${ITEMS_UTILS.getTreeSymbolImage(
                this.treeImmunity
              )}" alt="Immunity" class="symbol-image">
            </div>
          </div>
          
          <div class="tree-dialogue" id="treeDialogue">
            ${this.phaseDialogue}
          </div>
        </div>
        
        <!-- Player section -->
        <div class="player-section">
          <div class="player-stats">
            <div class="stamina-bar">
              <div class="stamina-label">Stamina</div>
              <div class="stamina-bar-bg">
                <div class="stamina-bar-fill" id="playerStaminaFill"></div>
              </div>
              <div class="stamina-text" id="playerStaminaText">
                ${this.playerStamina}/${this.maxPlayerStamina}
              </div>
            </div>
            
            <div class="turn-info">
              <div class="turn-text">Turn ${this.currentTurn}</div>
              <div class="cards-used">${this.cardsUsedThisTurn}/${
      this.maxCardsPerTurn
    } cards used</div>
            </div>
          </div>
          
          <div class="player-hand" id="playerHand">
            <!-- Cards will be rendered here -->
          </div>
          
          <div class="combat-instructions">
            <p>Select up to ${
              this.maxCardsPerTurn
            } cards and they will automatically be thrown at the tree</p>
          </div>
        </div>
        
        <!-- Feedback overlay -->
        <div class="combat-feedback" id="combatFeedback"></div>
        
        <!-- Tooltip -->
        <div class="card-tooltip" id="cardTooltip"></div>
      </div>
    `;

    // Update UI elements
    this.updateUI();
    this.renderHand();
    this.setupTooltip();
    this.updateBackground();
  }

  setupEventListeners() {
    super.setupEventListeners();
  }

  setupTooltip() {
    this.tooltip = document.getElementById("cardTooltip");
    if (!this.tooltip) return;

    // Hide tooltip initially
    this.tooltip.style.display = "none";
  }

  showTooltip(card, event) {
    if (!this.tooltip) return;

    const textIndex = Math.min(this.currentPhase - 1, card.text.length - 1);
    const tooltipText = card.text[textIndex];

    this.tooltip.textContent = `"${tooltipText}"`;
    this.tooltip.style.display = "block";

    // Position tooltip above the card
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();

    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.top - tooltipRect.height - 10;

    // Keep tooltip within screen bounds
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
      top = rect.bottom + 10; // Show below if no room above
    }

    this.tooltip.style.left = left + "px";
    this.tooltip.style.top = top + "px";
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style.display = "none";
    }
  }

  init() {
    console.log("🚀 Initializing Fight Screen");
    super.init();

    this.combatInProgress = false;
    this.cardAnimationInProgress = false;
    this.isPlayerTurn = true;
    this.messageQueue = [];
    this.isProcessingMessages = false;
  }

  handleCardClick(cardElement) {
    const cardId = cardElement.dataset.cardId;
    console.log("🃏 Card clicked:", cardId);

    if (
      !this.isPlayerTurn ||
      this.combatInProgress ||
      this.cardAnimationInProgress
    ) {
      console.log(
        "❌ Cannot select card - not player turn or combat in progress"
      );
      return;
    }

    const card = this.playerHand.find((c) => String(c.id) === String(cardId));

    if (!card) {
      console.log("❌ Card not found in hand:", cardId);
      return;
    }

    console.log("✅ Found card:", card.name, "with ID:", card.id);

    // Toggle card selection
    if (this.selectedCards.includes(cardId)) {
      this.selectedCards = this.selectedCards.filter((id) => id !== cardId);
      cardElement.classList.remove("selected");
      cardElement.querySelector(".card-content").classList.remove("selected");
      console.log("🔄 Card deselected:", card.name);
    } else {
      if (
        this.selectedCards.length <
        this.maxCardsPerTurn - this.cardsUsedThisTurn
      ) {
        this.selectedCards.push(cardId);
        cardElement.classList.add("selected");
        cardElement.querySelector(".card-content").classList.add("selected");
        console.log("✅ Card selected:", card.name);

        // Auto-play cards if we've selected the maximum
        if (
          this.selectedCards.length ===
          this.maxCardsPerTurn - this.cardsUsedThisTurn
        ) {
          setTimeout(() => this.playSelectedCards(), 500);
        }
      } else {
        console.log("⚠️ Cannot select more cards this turn");
      }
    }
  }

  async playSelectedCards() {
    if (this.selectedCards.length === 0) return;

    console.log("🎮 Playing selected cards:", this.selectedCards);
    this.combatInProgress = true;
    this.cardAnimationInProgress = true;

    // Play each selected card with staggered animation
    for (let i = 0; i < this.selectedCards.length; i++) {
      const cardId = this.selectedCards[i];
      const card = this.playerHand.find((c) => String(c.id) === String(cardId));

      if (card) {
        await this.animateCardThrow(cardId, card);
        await this.delay(1000); // Brief pause between cards
      }
    }

    // Update turn state
    this.cardsUsedThisTurn += this.selectedCards.length;

    // Remove played cards from hand
    this.selectedCards.forEach((cardId) => {
      const cardIndex = this.playerHand.findIndex(
        (c) => String(c.id) === String(cardId)
      );
      if (cardIndex !== -1) {
        this.usedItems.push(this.playerHand.splice(cardIndex, 1)[0]);
      }
    });

    this.selectedCards = [];
    this.renderHand();

    // Check for end of turn or combat
    setTimeout(() => {
      this.cardAnimationInProgress = false;
      this.combatInProgress = false;
      this.checkCombatState();

      // Auto-end turn if we've used all cards
      if (this.cardsUsedThisTurn >= this.maxCardsPerTurn) {
        setTimeout(() => this.endTurn(), 1000);
      }
    }, 1000);
  }

  async animateCardThrow(cardId, card) {
    return new Promise((resolve) => {
      const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
      const treeElement = document.getElementById("treeImage");

      if (!cardElement || !treeElement) {
        console.error("Card or tree element not found for animation");
        this.playCard(card);
        resolve();
        return;
      }

      // Get positions
      const cardRect = cardElement.getBoundingClientRect();
      const treeRect = treeElement.getBoundingClientRect();

      // Calculate throw trajectory
      const startX = cardRect.left + cardRect.width / 2;
      const startY = cardRect.top + cardRect.height / 2;
      const endX = treeRect.left + treeRect.width / 2;
      const endY = treeRect.top + treeRect.height / 2;

      // Create flying card element
      const flyingCard = cardElement.cloneNode(true);
      flyingCard.style.position = "fixed";
      flyingCard.style.left = startX + "px";
      flyingCard.style.top = startY + "px";
      flyingCard.style.zIndex = "1000";
      flyingCard.style.pointerEvents = "none";
      flyingCard.style.transform = "scale(0.8)";
      flyingCard.classList.add("flying-card");

      document.body.appendChild(flyingCard);

      // Hide original card
      cardElement.style.opacity = "0.3";

      // Animate the flying card
      const animation = flyingCard.animate(
        [
          {
            transform: `translate(0, 0) scale(0.8) rotate(0deg)`,
            opacity: 1,
          },
          {
            transform: `translate(${endX - startX}px, ${
              endY - startY
            }px) scale(0.6) rotate(360deg)`,
            opacity: 0.8,
          },
        ],
        {
          duration: 600,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      );

      animation.addEventListener("finish", () => {
        // Remove flying card
        flyingCard.remove();

        // Apply card effect
        this.playCard(card);

        // Create impact effect
        this.createImpactEffect(endX, endY);

        resolve();
      });
    });
  }

  createImpactEffect(x, y) {
    // Create particle burst at impact point
    this.createParticleBurst(x, y, 8, "rgba(255, 215, 0, 0.8)");

    // Shake the tree
    const treeImage = document.getElementById("treeImage");
    if (treeImage) {
      treeImage.classList.add("tree-hit");
      setTimeout(() => {
        treeImage.classList.remove("tree-hit");
      }, 500);
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  playCard(card) {
    console.log(`🃏 Playing card: ${card.name}`);

    // Mark the item as used in the global config if it hasn't been used before
    if (!card.isPebble) {
      ITEMS_UTILS.markItemAsUsed(card.id);
    }

    // Calculate damage/healing
    let damage = card.damage || 0;
    let stamina = card.restore || 0;

    // Apply type effectiveness
    const cardType = card.type;

    if (cardType === this.treeWeakness) {
      damage = Math.floor(damage * 1.5);
      this.queueCombatMessage(`🔥 Critical hit: ${damage} DMG!`, "critical");
    } else if (cardType === this.treeImmunity) {
      damage = 0;
      this.queueCombatMessage(`🛡️ IMMUNE!`, "immune");
    } else {
      this.queueCombatMessage(`⚔️ Hit: ${damage} DMG!`, "normal");
    }

    // Handle cursed items
    if (card.cursed) {
      damage = Math.abs(damage);
      this.treeHP = Math.min(this.treeHP + damage, this.maxTreeHP);
      this.queueCombatMessage(
        `☠️ CURSED ITEM! Tree heals ${damage} HP!`,
        "cursed"
      );
    } else {
      this.treeHP = Math.max(0, this.treeHP - damage);
    }

    // Handle stamina changes (positive or negative)
    if (stamina !== 0) {
      this.playerStamina = Math.max(
        0,
        Math.min(this.playerStamina + stamina, this.maxPlayerStamina)
      );

      if (stamina > 0) {
        this.queueCombatMessage(`💚 Restored ${stamina} stamina`, "heal");
      } else {
        this.queueCombatMessage(
          `💔 Lost ${Math.abs(stamina)} stamina`,
          "damage"
        );
      }
    }

    // No longer show card dialogue in combat messages - it's in the tooltip now

    this.updateUI();
  }

  // Message queue system for staggered feedback
  queueCombatMessage(message, type) {
    this.messageQueue.push({ message, type });
    if (!this.isProcessingMessages) {
      this.processMessageQueue();
    }
  }

  processMessageQueue() {
    if (this.messageQueue.length === 0) {
      this.isProcessingMessages = false;
      return;
    }

    this.isProcessingMessages = true;
    const { message, type } = this.messageQueue.shift();

    this.showCombatFeedback(message, type);

    // Process next message after delay
    setTimeout(() => {
      this.processMessageQueue();
    }, 1200);
  }

  showCombatFeedback(message, type) {
    const feedbackContainer = document.getElementById("combatFeedback");
    if (!feedbackContainer) return;

    const feedbackElement = document.createElement("div");
    feedbackElement.className = `feedback-message ${type}`;
    feedbackElement.textContent = message;

    feedbackContainer.appendChild(feedbackElement);

    // Animate and remove
    setTimeout(() => {
      feedbackElement.style.animation = "fadeOut 0.5s ease-out forwards";
      setTimeout(() => {
        if (feedbackElement.parentNode) {
          feedbackElement.remove();
        }
      }, 500);
    }, 2000);
  }

  endTurn() {
    console.log("🔄 Ending player turn");

    this.isPlayerTurn = false;
    this.cardsUsedThisTurn = 0;
    this.selectedCards = [];

    // Tree's turn
    setTimeout(() => {
      this.treeAttack();
    }, 1000);
  }

  treeAttack() {
    console.log("🌳 Tree attacking");

    // Tree attacks player
    this.playerStamina = Math.max(
      0,
      this.playerStamina - this.treeAttackDamage
    );
    this.queueCombatMessage(
      `🌳 Tree attacks for ${this.treeAttackDamage} damage!`,
      "tree-attack"
    );

    // Trigger screen shake
    this.triggerScreenShake(400);

    this.updateUI();

    // Check for game over
    if (this.playerStamina <= 0) {
      setTimeout(() => {
        this.handleDefeat();
      }, 1500);
      return;
    }

    // Start new turn
    setTimeout(() => {
      this.startNewTurn();
    }, 1500);
  }

  startNewTurn() {
    console.log("🆕 Starting new turn");

    this.currentTurn++;
    this.isPlayerTurn = true;
    this.cardsUsedThisTurn = 0;

    // Refill hand if needed
    const cardsToAdd = [];
    while (this.playerHand.length < this.handSize) {
      const card = this.drawCard();
      if (card) {
        cardsToAdd.push(card);
        this.playerHand.push(card);
      } else {
        break; // No more cards available
      }
    }

    // Change tree symbols
    this.setTreeSymbols();

    // Render hand with animations for new cards
    this.renderHandWithAnimations(cardsToAdd);
    this.updateUI();
  }

  checkCombatState() {
    if (this.treeHP <= 0) {
      setTimeout(() => {
        this.handleVictory();
      }, 1500);
    } else if (this.playerStamina <= 0) {
      setTimeout(() => {
        this.handleDefeat();
      }, 1500);
    }
  }

  handleVictory() {
    console.log("🏆 Player victory!");

    this.combatInProgress = false;

    // Notify the game controller
    if (window.game) {
      window.game.onFightComplete(this.currentPhase, true);
    }
  }

  handleDefeat() {
    console.log("💀 Player defeated!");

    this.combatInProgress = false;

    // Notify the game controller
    if (window.game) {
      window.game.onFightComplete(this.currentPhase, false);
    }
  }

  renderHandWithAnimations(newCards = []) {
    const handContainer = document.getElementById("playerHand");
    if (!handContainer) return;

    console.log(
      "🃏 Rendering hand with cards:",
      this.playerHand.map((c) => `${c.name} (ID: ${c.id})`)
    );

    handContainer.innerHTML = "";

    this.playerHand.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card-item";
      cardElement.dataset.cardId = String(card.id);

      const isSelected = this.selectedCards.includes(String(card.id));
      const isNewCard = newCards.some(
        (newCard) => String(newCard.id) === String(card.id)
      );

      // Use item image if available, otherwise use symbol
      let cardVisual = "";
      if (card.image) {
        cardVisual = `<img src="${card.image}" alt="${card.name}" class="card-image" />`;
      } else {
        cardVisual = `<div class="card-symbol">${this.getCardSymbol(
          card
        )}</div>`;
      }

      // Show stats based on usage - damage always shown, but restore based on hasUsed
      const hasBeenUsed =
        ITEMS_UTILS.hasItemBeenUsed(card.id) || card.isPebble || card.hasUsed;
      const damageDisplay = hasBeenUsed ? `DMG: ${card.damage || 0}` : "DMG: ?";
      const restoreDisplay = hasBeenUsed ? `+${card.restore || 0}` : "?";
      const typeDisplay = this.getTypeDisplayName(card.type); // Always show type

      cardElement.innerHTML = `
        <div class="card-content ${isSelected ? "selected" : ""}">
          ${cardVisual}
          <div class="card-name">${card.name}</div>
          <div class="card-stats">
            <div class="card-damage">${damageDisplay}</div>
            <div class="card-restore">Restore: ${restoreDisplay}</div>
          </div>
          <div class="card-type">${typeDisplay}</div>
        </div>
      `;

      // Add animation for new cards
      if (isNewCard) {
        cardElement.classList.add("card-slide-in");
        cardElement.style.transform = "translateY(200px)";
        cardElement.style.opacity = "0";

        setTimeout(() => {
          cardElement.style.transform = "translateY(0)";
          cardElement.style.opacity = "1";
        }, index * 100);
      }

      // Add event listeners for click, hover, and tooltip
      cardElement.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleCardClick(cardElement);
      });

      // Tooltip event listeners
      cardElement.addEventListener("mouseenter", (e) => {
        this.showTooltip(card, e);
      });

      cardElement.addEventListener("mouseleave", () => {
        this.hideTooltip();
      });

      // Update tooltip position on mouse move
      cardElement.addEventListener("mousemove", (e) => {
        if (this.tooltip && this.tooltip.style.display !== "none") {
          this.showTooltip(card, e);
        }
      });

      handContainer.appendChild(cardElement);
    });

    console.log("🃏 Hand rendered with", this.playerHand.length, "cards");
  }

  renderHand() {
    this.renderHandWithAnimations([]);
  }

  getCardSymbol(card) {
    const typeSymbolMap = {
      detection: "🔍",
      weakness: "🪓",
      emotional: "💔",
      mental: "💭",
    };
    return typeSymbolMap[card.type] || card.symbol;
  }

  getTypeDisplayName(type) {
    const typeNames = {
      detection: "Detection",
      weakness: "Weakness",
      emotional: "Emotional",
      mental: "Mental",
    };
    return typeNames[type] || type;
  }

  updateUI() {
    // Update tree health
    const treeHealthFill = document.getElementById("treeHealthFill");
    const treeHealthText = document.getElementById("treeHealthText");

    if (treeHealthFill) {
      const healthPercentage = (this.treeHP / this.maxTreeHP) * 100;
      treeHealthFill.style.width = `${healthPercentage}%`;
    }

    if (treeHealthText) {
      treeHealthText.textContent = `${this.treeHP}/${this.maxTreeHP}`;
    }

    // Update player stamina
    const playerStaminaFill = document.getElementById("playerStaminaFill");
    const playerStaminaText = document.getElementById("playerStaminaText");

    if (playerStaminaFill) {
      const staminaPercentage =
        (this.playerStamina / this.maxPlayerStamina) * 100;
      playerStaminaFill.style.width = `${staminaPercentage}%`;
    }

    if (playerStaminaText) {
      playerStaminaText.textContent = `${this.playerStamina}/${this.maxPlayerStamina}`;
    }

    // Update tree symbols
    const treeWeaknessElement = document.getElementById("treeWeakness");
    const treeImmunityElement = document.getElementById("treeImmunity");

    if (treeWeaknessElement) {
      const weaknessImg = treeWeaknessElement.querySelector(".symbol-image");
      if (weaknessImg) {
        weaknessImg.src = ITEMS_UTILS.getTreeSymbolImage(this.treeWeakness);
      }
    }

    if (treeImmunityElement) {
      const immunityImg = treeImmunityElement.querySelector(".symbol-image");
      if (immunityImg) {
        immunityImg.src = ITEMS_UTILS.getTreeSymbolImage(this.treeImmunity);
      }
    }

    // Update tree image based on phase
    const treeImage = document.getElementById("treeImage");
    if (treeImage) {
      treeImage.src = this.getTreeImage();
    }

    // Update background based on phase
    this.updateBackground();

    // Update turn info
    const elements = {
      ".turn-text": `Turn ${this.currentTurn}`,
      ".cards-used": `${this.cardsUsedThisTurn}/${this.maxCardsPerTurn} cards used`,
    };

    Object.entries(elements).forEach(([selector, text]) => {
      const element = this.container.querySelector(selector);
      if (element) {
        element.textContent = text;
      }
    });
  }

  // Update background image based on current phase
  updateBackground() {
    const fightContent = this.container.querySelector(".fight-screen-content");
    if (fightContent) {
      const backgroundImage = this.getBackgroundImage();
      fightContent.style.backgroundImage = `url('${backgroundImage}'), linear-gradient(135deg, #1a1a2e, #16213e)`;
    }
  }

  handleKeydown(e) {
    super.handleKeydown(e);

    if (
      !this.isPlayerTurn ||
      this.combatInProgress ||
      this.cardAnimationInProgress
    )
      return;

    // Number keys to select cards
    const cardIndex = parseInt(e.key) - 1;
    if (cardIndex >= 0 && cardIndex < this.playerHand.length) {
      const cardElement = this.container.querySelector(
        `[data-card-id="${this.playerHand[cardIndex].id}"]`
      );
      if (cardElement) {
        this.handleCardClick(cardElement);
      }
    }
  }

  handleEscape() {}

  // Debug method override
  debug() {
    super.debug();
    console.log("Fight Screen Specific Debug Info:", {
      currentPhase: this.currentPhase,
      treeHP: this.treeHP,
      maxTreeHP: this.maxTreeHP,
      playerStamina: this.playerStamina,
      maxPlayerStamina: this.maxPlayerStamina,
      currentTurn: this.currentTurn,
      cardsUsedThisTurn: this.cardsUsedThisTurn,
      handSize: this.playerHand.length,
      availableItems: this.availableItems.length,
      usedItems: this.usedItems.length,
      treeWeakness: this.treeWeakness,
      treeImmunity: this.treeImmunity,
      selectedCards: this.selectedCards,
      isPlayerTurn: this.isPlayerTurn,
      combatInProgress: this.combatInProgress,
      cardAnimationInProgress: this.cardAnimationInProgress,
      messageQueueLength: this.messageQueue.length,
      isProcessingMessages: this.isProcessingMessages,
    });
  }

  // Clean up when screen is destroyed
  destroy() {
    // Hide tooltip
    this.hideTooltip();

    // Clear message queue and timers
    this.messageQueue = [];
    this.isProcessingMessages = false;
    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
      this.messageTimer = null;
    }

    // Clean up any flying cards
    const flyingCards = document.querySelectorAll(".flying-card");
    flyingCards.forEach((card) => card.remove());

    // Reset combat state
    this.combatInProgress = false;
    this.cardAnimationInProgress = false;
    this.isPlayerTurn = false;
    this.selectedCards = [];
    this.playerHand = [];
    this.availableItems = [];
    this.usedItems = [];
    this.tooltip = null;

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Fight Screen destroyed");
  }
}

// Make FightScreen available globally
window.FightScreen = FightScreen;

console.log("⚔️ Fight Screen class loaded");
