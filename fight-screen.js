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
    this.treeAttackDamage = 5;
    this.phaseDialogue = "";
    this.symbols = ["🔍", "🪓", "💔", "💭"];
    this.firstTimeUse = new Set(); // Track first-time item usage

    console.log("⚔️ FightScreen instance created");
  }

  // Initialize fight with found items from search
  initializeFight(foundItems, phase = 1) {
    console.log(`⚔️ Initializing fight - Phase ${phase}`, foundItems);

    this.currentPhase = phase;
    this.availableItems = [...foundItems];
    this.usedItems = [];
    this.firstTimeUse.clear();

    // Set phase-specific values
    this.setPhaseParameters();

    // Draw initial hand
    this.drawHand();

    // Set initial tree weakness/immunity
    this.setTreeSymbols();

    console.log(
      `⚔️ Fight initialized - Phase ${this.currentPhase}, Tree HP: ${this.treeHP}`
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
      damage: 1,
      restore: 1,
      type: "weakness",
      text: ["A small stone.", "Better than nothing.", "Reliable in a pinch."],
      cursed: false,
      isPebble: true,
    };
  }

  setTreeSymbols() {
    // Randomly select weakness and immunity symbols
    this.treeWeakness =
      this.symbols[Math.floor(Math.random() * this.symbols.length)];

    // Ensure immunity is different from weakness
    let immunityOptions = this.symbols.filter((s) => s !== this.treeWeakness);
    this.treeImmunity =
      immunityOptions[Math.floor(Math.random() * immunityOptions.length)];

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
          <div class="tree-visual" id="treeVisual">
            <div class="tree-image">🌳</div>
            <div class="tree-health-bar">
              <div class="health-bar-bg">
                <div class="health-bar-fill" id="treeHealthFill"></div>
              </div>
              <div class="health-text" id="treeHealthText">
                ${this.treeHP}/${this.maxTreeHP}
              </div>
            </div>
          </div>
          
          <div class="tree-symbols">
            <div class="symbol-container">
              <div class="symbol-label">Weakness</div>
              <div class="tree-symbol weakness" id="treeWeakness">${this.treeWeakness}</div>
            </div>
            <div class="symbol-container">
              <div class="symbol-label">Immunity</div>
              <div class="tree-symbol immunity" id="treeImmunity">${this.treeImmunity}</div>
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
              <div class="cards-used">${this.cardsUsedThisTurn}/${this.maxCardsPerTurn} cards used</div>
            </div>
          </div>
          
          <div class="player-hand" id="playerHand">
            <!-- Cards will be rendered here -->
          </div>
          
          <div class="combat-controls">
            <button class="game-button secondary" id="endTurnBtn" disabled>
              End Turn
            </button>
            <button class="game-button primary" id="playCardsBtn" disabled>
              Play Selected Cards
            </button>
          </div>
        </div>
        
        <!-- Feedback overlay -->
        <div class="combat-feedback" id="combatFeedback"></div>
      </div>
    `;

    // Update UI elements
    this.updateUI();
    this.renderHand();
  }

  setupEventListeners() {
    super.setupEventListeners();

    // Card selection
    document.addEventListener("click", (e) => {
      if (e.target.closest(".card-item")) {
        this.handleCardClick(e.target.closest(".card-item"));
      }
    });

    // Combat controls
    const playCardsBtn = document.getElementById("playCardsBtn");
    const endTurnBtn = document.getElementById("endTurnBtn");

    if (playCardsBtn) {
      playCardsBtn.addEventListener("click", () => {
        this.playSelectedCards();
      });
    }

    if (endTurnBtn) {
      endTurnBtn.addEventListener("click", () => {
        this.endTurn();
      });
    }
  }

  init() {
    console.log("🚀 Initializing Fight Screen");
    super.init();

    if (this.audioManager) {
      this.audioManager.playSound("combat_music", true, 0.4);
    }

    this.combatInProgress = true;
    this.isPlayerTurn = true;
  }

  handleCardClick(cardElement) {
    if (!this.isPlayerTurn || this.cardsUsedThisTurn >= this.maxCardsPerTurn) {
      return;
    }

    const cardId = cardElement.dataset.cardId;
    const card = this.playerHand.find((c) => c.id === cardId);

    if (!card) return;

    // Toggle card selection
    if (this.selectedCards.includes(cardId)) {
      this.selectedCards = this.selectedCards.filter((id) => id !== cardId);
      cardElement.classList.remove("selected");
    } else {
      if (
        this.selectedCards.length <
        this.maxCardsPerTurn - this.cardsUsedThisTurn
      ) {
        this.selectedCards.push(cardId);
        cardElement.classList.add("selected");
      }
    }

    this.updateCombatControls();
  }

  playSelectedCards() {
    if (this.selectedCards.length === 0) return;

    this.combatInProgress = true;

    // Play each selected card
    this.selectedCards.forEach((cardId) => {
      const card = this.playerHand.find((c) => c.id === cardId);
      if (card) {
        this.playCard(card);
      }
    });

    // Update turn state
    this.cardsUsedThisTurn += this.selectedCards.length;
    this.selectedCards = [];

    // Remove played cards from hand
    this.selectedCards.forEach((cardId) => {
      const cardIndex = this.playerHand.findIndex((c) => c.id === cardId);
      if (cardIndex !== -1) {
        this.usedItems.push(this.playerHand.splice(cardIndex, 1)[0]);
      }
    });

    this.renderHand();
    this.updateCombatControls();

    // Check for end of turn or combat
    this.checkCombatState();
  }

  playCard(card) {
    console.log(`🃏 Playing card: ${card.name}`);

    // Calculate damage/healing
    let damage = card.damage || 0;
    let stamina = card.restore || 0;

    // Apply type effectiveness
    const cardSymbol = this.getCardSymbol(card);

    if (cardSymbol === this.treeWeakness) {
      damage = Math.floor(damage * 1.5); // 50% bonus for weakness
      this.showCombatFeedback(`🔥 Critical hit: ${damage} DMG!`, "critical");
    } else if (cardSymbol === this.treeImmunity) {
      damage = 0;
      this.showCombatFeedback(`🛡️ IMMUNE!`, "immune");
    } else {
      this.showCombatFeedback(`⚔️ Hit: ${damage} DMG!`, "normal");
    }

    // Handle cursed items
    if (card.cursed) {
      damage = Math.abs(damage); // Cursed items heal the tree
      this.treeHP = Math.min(this.treeHP + damage, this.maxTreeHP);
      this.showCombatFeedback(
        `☠️ CURSED ITEM! Tree heals ${damage} HP!`,
        "cursed"
      );
    } else {
      this.treeHP = Math.max(0, this.treeHP - damage);
    }

    // Restore player stamina
    if (stamina > 0) {
      this.playerStamina = Math.min(
        this.playerStamina + stamina,
        this.maxPlayerStamina
      );
      this.showCombatFeedback(`💚 Restored ${stamina} stamina`, "heal");
    }

    // Show card dialogue (first time use)
    if (!this.firstTimeUse.has(card.id)) {
      this.firstTimeUse.add(card.id);
      const dialogue = card.text[Math.floor(Math.random() * card.text.length)];
      this.showCombatFeedback(`"${dialogue}"`, "dialogue");
    }

    this.updateUI();
  }

  getCardSymbol(card) {
    // Map card types to symbols
    const typeSymbolMap = {
      detection: "🔍",
      weakness: "🪓",
      emotional: "💔",
      mental: "💭",
    };

    return typeSymbolMap[card.type] || card.symbol;
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
    this.showCombatFeedback(
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
    while (this.playerHand.length < this.handSize) {
      const card = this.drawCard();
      if (card) {
        this.playerHand.push(card);
      } else {
        break; // No more cards available
      }
    }

    // Change tree symbols
    this.setTreeSymbols();

    this.renderHand();
    this.updateUI();
    this.updateCombatControls();
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

    if (this.audioManager) {
      this.audioManager.stopSound("combat_music");
      this.audioManager.playSound("victory", false, 0.8);
    }

    // Notify the game controller
    if (window.game) {
      window.game.onFightComplete(this.currentPhase, true);
    }
  }

  handleDefeat() {
    console.log("💀 Player defeated!");

    this.combatInProgress = false;

    if (this.audioManager) {
      this.audioManager.stopSound("combat_music");
      this.audioManager.playSound("defeat", false, 0.8);
    }

    // Notify the game controller
    if (window.game) {
      window.game.onFightComplete(this.currentPhase, false);
    }
  }

  renderHand() {
    const handContainer = document.getElementById("playerHand");
    if (!handContainer) return;

    handContainer.innerHTML = "";

    this.playerHand.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card-item";
      cardElement.dataset.cardId = card.id;

      const cardSymbol = this.getCardSymbol(card);
      const isSelected = this.selectedCards.includes(card.id);

      cardElement.innerHTML = `
        <div class="card-content ${isSelected ? "selected" : ""}">
          <div class="card-symbol">${cardSymbol}</div>
          <div class="card-name">${card.name}</div>
          <div class="card-stats">
            <div class="card-damage">DMG: ?</div>
            <div class="card-restore">+${card.restore || 0}</div>
          </div>
        </div>
      `;

      // Show actual stats if used before
      if (this.firstTimeUse.has(card.id)) {
        const damageElement = cardElement.querySelector(".card-damage");
        damageElement.textContent = `DMG: ${card.damage || 0}`;
      }

      handContainer.appendChild(cardElement);
    });
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
      treeWeaknessElement.textContent = this.treeWeakness;
    }

    if (treeImmunityElement) {
      treeImmunityElement.textContent = this.treeImmunity;
    }

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

  updateCombatControls() {
    const playCardsBtn = document.getElementById("playCardsBtn");
    const endTurnBtn = document.getElementById("endTurnBtn");

    if (!this.isPlayerTurn || this.combatInProgress) {
      if (playCardsBtn) playCardsBtn.disabled = true;
      if (endTurnBtn) endTurnBtn.disabled = true;
      return;
    }

    if (playCardsBtn) {
      playCardsBtn.disabled = this.selectedCards.length === 0;
    }

    if (endTurnBtn) {
      endTurnBtn.disabled = this.cardsUsedThisTurn === 0;
    }
  }

  handleKeydown(e) {
    super.handleKeydown(e);

    if (!this.isPlayerTurn || this.combatInProgress) return;

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

    // Space to play selected cards
    if (e.code === "Space" && this.selectedCards.length > 0) {
      e.preventDefault();
      this.playSelectedCards();
    }

    // Enter to end turn
    if (e.code === "Enter" && this.cardsUsedThisTurn > 0) {
      e.preventDefault();
      this.endTurn();
    }
  }

  handleEscape() {
    console.log("🔙 Escape pressed on Fight Screen");

    // In combat, show pause menu or confirmation
    if (this.combatInProgress) {
      this.showTemporaryMessage(
        "Combat in progress! Cannot exit now.",
        "warning"
      );
    } else {
      // Could show pause menu or return to previous screen
      this.showTemporaryMessage("Press ESC again to forfeit combat", "warning");
    }
  }

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
    });
  }

  // Clean up when screen is destroyed
  destroy() {
    // Stop combat music
    if (this.audioManager) {
      this.audioManager.stopSound("combat_music");
    }

    // Reset combat state
    this.combatInProgress = false;
    this.isPlayerTurn = false;
    this.selectedCards = [];
    this.playerHand = [];
    this.availableItems = [];
    this.usedItems = [];
    this.firstTimeUse.clear();

    // Call parent destroy
    super.destroy();

    console.log("🗑️ Fight Screen destroyed");
  }
}

// Make FightScreen available globally
window.FightScreen = FightScreen;

console.log("⚔️ Fight Screen class loaded");
