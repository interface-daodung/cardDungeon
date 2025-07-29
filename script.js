// Game State
class WarriorCardGame {
    constructor() {
        this.cards = [];
        this.score = 0;
        this.moves = 0;
        this.draggedCard = null;
        this.dragStartPos = null;
        this.longPressTimer = null;
        this.longPressDelay = 500; // 500ms for long press
        this.warriorHP = 10; // Warrior starts with max HP
        this.healFood1 = 0; // Food1 healing counter
        this.warriorWeapon = 0; // Warrior weapon durability
        
        // Card image arrays
        this.fatuiImages = [
            'resources/Fatui0.png',
            'resources/Fatui1.png',
            'resources/Fatui2.png',
            'resources/Fatui3.png'
        ];
        this.coinImages = [
            'resources/coin0.png',
            'resources/coin1.png',
            'resources/coin2.png',
            'resources/coin3.png',
            'resources/coin4.png',
            'resources/coin5.png',
            'resources/coin6.png'
        ];
        this.foodImages = [
            'resources/food0.png',
            'resources/food1.png'
        ];
        this.swordImages = [
            'resources/sword0.png',
            'resources/sword1.png',
            'resources/sword2.png'
        ];
        this.allCardImages = [...this.fatuiImages, ...this.coinImages, ...this.foodImages, ...this.swordImages];
        
        this.initializeGame();
        this.setupEventListeners();
    }

    // Initialize the game
    initializeGame() {
        this.createCards();
        this.renderCards();
        this.updateUI();
    }

    // Create 3x3 grid with warrior in center and fatuice around
    createCards() {
        this.cards = [];
        const centerIndex = 4; // Center position (1,1) in 3x3 grid
        
        for (let i = 0; i < 9; i++) {
            if (i === centerIndex) {
                // Warrior card in center
                this.cards.push({
                    id: i,
                    type: 'warrior',
                    image: 'resources/Warrior.png',
                    position: { row: Math.floor(i / 3), col: i % 3 }
                });
            } else {
                // Random cards around with random image
                const randomCardImage = this.getRandomCardImage();
                const randomCardType = this.getCardType(randomCardImage);
                this.cards.push({
                    id: i,
                    type: randomCardType,
                    image: randomCardImage,
                    position: { row: Math.floor(i / 3), col: i % 3 },
                    score: randomCardType === 'coin' ? this.getRandomScore('coin') : null,
                    hp: randomCardType === 'fatuice' ? Math.floor(Math.random() * 9) + 1 : null,
                    heal: randomCardType === 'food' ? (randomCardImage === 'resources/food1.png' ? this.getRandomHealAmountFood1() : this.getRandomHealAmount()) : null,
                    durability: randomCardType === 'sword' ? this.getRandomWeaponDurability() : null
                });
            }
        }
    }

    // Get random Fatui image
    getRandomFatuiImage() {
        const randomIndex = Math.floor(Math.random() * this.fatuiImages.length);
        return this.fatuiImages[randomIndex];
    }

    // Get random card image (Fatui or Coin)
    getRandomCardImage() {
        const randomIndex = Math.floor(Math.random() * this.allCardImages.length);
        return this.allCardImages[randomIndex];
    }

    // Get card type based on image name
    getCardType(imageName) {
        if (this.fatuiImages.includes(imageName)) {
            return 'fatuice';
        } else if (this.coinImages.includes(imageName)) {
            return 'coin';
        } else if (this.foodImages.includes(imageName)) {
            return 'food';
        } else if (this.swordImages.includes(imageName)) {
            return 'sword';
        }
        return 'fatuice'; // Default fallback
    }

    // Get random score for card type
    getRandomScore(cardType) {
        if (cardType === 'coin') {
            return Math.floor(Math.random() * 9) + 1; // 1-9 points
        } else if (cardType === 'fatuice') {
            return Math.floor(Math.random() * 9) + 1; // 1-9 points
        } else if (cardType === 'food') {
            return 0; // Food has no points
        } else if (cardType === 'sword') {
            return 0; // Sword has no points
        }
        return 0; // Warrior has no points
    }

    // Manage Warrior HP
    updateWarriorHP(damage) {
        this.warriorHP = Math.max(0, Math.min(10, this.warriorHP - damage));
        return this.warriorHP;
    }

    // Heal Warrior HP
    healWarriorHP(amount) {
        this.warriorHP = Math.min(10, this.warriorHP + amount);
        return this.warriorHP;
    }

    // Get random heal amount for food
    getRandomHealAmount() {
        return Math.floor(Math.random() * 9) + 1; // 1-9 HP
    }

    // Get random heal amount for food1 (2-12)
    getRandomHealAmountFood1() {
        return Math.floor(Math.random() * 11) + 2; // 2-12 HP
    }

    // Process food1 healing on move
    processFood1Healing() {
        if (this.healFood1 > 0) {
            this.healWarriorHP(1);
            this.healFood1--;
            return true;
        }
        return false;
    }

    // Get random weapon durability
    getRandomWeaponDurability() {
        return Math.floor(Math.random() * 9) + 1; // 1-9 durability
    }

    // Add weapon to warrior
    addWeaponToWarrior(durability) {
        this.warriorWeapon = durability;
        return this.warriorWeapon;
    }

    // Use weapon (decrease durability)
    useWeapon() {
        if (this.warriorWeapon > 0) {
            this.warriorWeapon--;
            return this.warriorWeapon;
        }
        return 0;
    }

    // Attack monster from distance with weapon
    attackMonsterFromDistance(monsterIndex) {
        if (this.warriorWeapon <= 0) return false;
        
        const monster = this.cards[monsterIndex];
        if (!monster || monster.type !== 'fatuice') return false;
        
        const monsterHP = monster.hp || 0;
        const weaponDamage = this.warriorWeapon;
        
        // Calculate damage (weapon damage vs monster HP)
        const actualDamage = Math.min(weaponDamage, monsterHP);
        
        // Update monster HP
        monster.hp = monsterHP - actualDamage;
        
        // Update weapon durability
        this.warriorWeapon -= actualDamage;
        
        // Check if monster dies
        if (monster.hp <= 0) {
            // Monster dies - show death animation first
            const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
            if (monsterElement) {
                monsterElement.classList.add('monster-dying');
            }
            
            // Replace with random coin after animation
            setTimeout(() => {
                const randomCoinIndex = Math.floor(Math.random() * 7); // 0-6
                const randomCoinScore = Math.floor(Math.random() * 9) + 1; // 1-9
                
                this.cards[monsterIndex] = {
                    id: monsterIndex,
                    type: 'coin',
                    image: `resources/coin${randomCoinIndex}.png`,
                    position: { row: Math.floor(monsterIndex / 3), col: monsterIndex % 3 },
                    score: randomCoinScore,
                    hp: null,
                    heal: null,
                    durability: null
                };
                
                // Add score
                this.score += randomCoinScore;
                this.moves++;
                
                // Re-render with appear effect
                this.renderCardsWithAppearEffect(monsterIndex);
                this.updateUI();
            }, 600); // Wait for death animation
            
            return true;
        }
        
        // Monster survives - update UI
        this.moves++;
        this.updateUI();
        
        return true;
    }

    // Attack monster with weapon (warrior stays in place)
    attackMonsterWithWeapon(warriorIndex, monsterIndex) {
        const monster = this.cards[monsterIndex];
        const monsterHP = monster.hp || 0;
        const weaponDamage = this.warriorWeapon;
        
        // Calculate damage (weapon damage vs monster HP)
        const actualDamage = Math.min(weaponDamage, monsterHP);
        
        // Start combat animation
        this.startCombatAnimation(warriorIndex, monsterIndex, actualDamage);
        
        // Update monster HP after animation starts
        setTimeout(() => {
            monster.hp = monsterHP - actualDamage;
            
            // Update weapon durability
            this.warriorWeapon -= actualDamage;
            
            // Update moves and score
            this.moves++;
            
            // Update UI immediately
            this.updateUI();
            
            // Update warrior card display
            this.updateWarriorDisplay();
            
            // Check if monster dies
            if (monster.hp <= 0) {
                // Monster dies - show death animation first
                const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
                if (monsterElement) {
                    monsterElement.classList.add('monster-dying');
                }
                
                // Replace with random coin after animation
                setTimeout(() => {
                    const randomCoinIndex = Math.floor(Math.random() * 7); // 0-6
                    const randomCoinScore = Math.floor(Math.random() * 9) + 1; // 1-9
                    
                    this.cards[monsterIndex] = {
                        id: monsterIndex,
                        type: 'coin',
                        image: `resources/coin${randomCoinIndex}.png`,
                        position: { row: Math.floor(monsterIndex / 3), col: monsterIndex % 3 },
                        score: randomCoinScore,
                        hp: null,
                        heal: null,
                        durability: null
                    };
                    
                    // Add score
                    this.score += randomCoinScore;
                    
                    // Re-render with appear effect
                    this.renderCardsWithAppearEffect(monsterIndex);
                    this.updateUI();
                }, 600); // Wait for death animation
            } else {
                // Monster survives - update monster display
                this.updateMonsterDisplay(monsterIndex);
            }
        }, 150); // Wait for combat animation to start
        
        return true;
    }

    // Check for game over
    checkGameOver() {
        if (this.warriorHP <= 0) {
            this.triggerGameOver();
            return true;
        }
        return false;
    }

    // Trigger game over animation and dialog
    triggerGameOver() {
        // Get all cards and ensure we have the correct count
        const cards = document.querySelectorAll('.card');
        console.log(`Found ${cards.length} cards to animate`);
        
        if (cards.length === 0) {
            console.warn('No cards found to animate');
            this.showGameOverDialog();
            return;
        }
        
        // Animate all cards shrinking and disappearing
        let animatedCount = 0;
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('shrinking');
                animatedCount++;
                console.log(`Animating card ${index} (${animatedCount}/${cards.length})`);
                
                // Check if all cards have been animated
                if (animatedCount === cards.length) {
                    console.log('All cards animated successfully');
                }
            }, index * 150); // Reduced delay for faster animation
        });

        // Show game over dialog after all cards have animated
        const totalAnimationTime = cards.length * 150 + 1500; // Extra time for animation to complete
        console.log(`Game over dialog will show in ${totalAnimationTime}ms`);
        
        setTimeout(() => {
            this.showGameOverDialog();
        }, totalAnimationTime);
    }

    // Show game over dialog
    showGameOverDialog() {
        // Force hide any remaining cards
        this.forceHideAllCards();
        
        const dialog = document.getElementById('game-over-dialog');
        dialog.classList.add('show');
    }

    // Force hide all cards (backup method)
    forceHideAllCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.display = 'none';
        });
        console.log('Force hidden all cards');
    }

    // Hide game over dialog
    hideGameOverDialog() {
        const dialog = document.getElementById('game-over-dialog');
        dialog.classList.remove('show');
    }

    // Restart game from game over
    restartFromGameOver() {
        this.hideGameOverDialog();
        this.newGame();
    }

    // Render the 3x3 grid of cards
    renderCards() {
        const grid = document.getElementById('cards-grid');
        grid.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            grid.appendChild(cardElement);
        });
    }

    // Create a card element
    createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.type}`;
        cardElement.dataset.index = index;
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.type = card.type;
        
        // Create image element
        const imageElement = document.createElement('img');
        imageElement.className = 'card-image';
        imageElement.src = card.image;
        imageElement.alt = card.type;
        imageElement.draggable = card.type === 'warrior';
        
        cardElement.appendChild(imageElement);

        // Add score display for coin cards
        if (card.type === 'coin') {
            const scoreDisplay = document.createElement('div');
            scoreDisplay.className = 'score-display';
            scoreDisplay.textContent = card.score || this.getRandomScore('coin');
            cardElement.appendChild(scoreDisplay);
        }

        // Add heal display for food cards
        if (card.type === 'food') {
            const healDisplay = document.createElement('div');
            healDisplay.className = 'heal-display';
            if (card.image === 'resources/food1.png') {
                healDisplay.textContent = card.heal || this.getRandomHealAmountFood1();
            } else {
                healDisplay.textContent = card.heal || this.getRandomHealAmount();
            }
            cardElement.appendChild(healDisplay);
        }

        // Add durability display for sword cards
        if (card.type === 'sword') {
            const durabilityDisplay = document.createElement('div');
            durabilityDisplay.className = 'durability-display';
            durabilityDisplay.textContent = card.durability || this.getRandomWeaponDurability();
            cardElement.appendChild(durabilityDisplay);
        }

        // Add HP display for warrior and fatui cards
        if (card.type === 'warrior') {
            const hpDisplay = document.createElement('div');
            hpDisplay.className = 'hp-display';
            hpDisplay.textContent = this.warriorHP;
            cardElement.appendChild(hpDisplay);
            
            // Add weapon display for warrior
            if (this.warriorWeapon > 0) {
                const weaponDisplay = document.createElement('div');
                weaponDisplay.className = 'weapon-display';
                weaponDisplay.textContent = this.warriorWeapon;
                cardElement.appendChild(weaponDisplay);
            }
        } else if (card.type === 'fatuice') {
            const hpDisplay = document.createElement('div');
            hpDisplay.className = 'hp-display';
            const currentHP = card.hp || Math.floor(Math.random() * 9) + 1;
            hpDisplay.textContent = currentHP;
            cardElement.appendChild(hpDisplay);
        }

        // Add drag events for warrior cards
        if (card.type === 'warrior') {
            this.setupDragEvents(cardElement, index);
            this.setupClickEvents(cardElement, index);
        } else {
            this.setupClickEventsForAll(cardElement, index); // For all cards
        }

        // Add drop events for all cards
        this.setupDropEvents(cardElement, index);
        
        // Add long press events for all cards
        this.setupLongPressEvents(cardElement, index);

        return cardElement;
    }

    // Setup long press events for all cards
    setupLongPressEvents(cardElement, index) {
        // Mouse events for desktop - only for non-warrior cards
        if (cardElement.dataset.type !== 'warrior') {
            cardElement.addEventListener('mousedown', (e) => {
                this.handleLongPressStart(e, index);
            });

            cardElement.addEventListener('mouseup', (e) => {
                this.handleLongPressEnd(e);
            });

            cardElement.addEventListener('mouseleave', (e) => {
                this.handleLongPressCancel(e);
            });
        }

        // Touch events for mobile - only for non-warrior cards to avoid conflict
        if (cardElement.dataset.type !== 'warrior') {
            cardElement.addEventListener('touchstart', (e) => {
                this.handleLongPressStart(e, index);
            });

            cardElement.addEventListener('touchend', (e) => {
                this.handleLongPressEnd(e);
            });

            cardElement.addEventListener('touchcancel', (e) => {
                this.handleLongPressCancel(e);
            });
        }
    }

    // Handle long press start
    handleLongPressStart(e, index) {
        e.preventDefault();
        this.longPressTimer = setTimeout(() => {
            this.showCardInfo(index);
        }, this.longPressDelay);
    }

    // Handle long press end
    handleLongPressEnd(e) {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    // Handle long press cancel
    handleLongPressCancel(e) {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    // Show card info dialog
    showCardInfo(cardIndex) {
        const card = this.cards[cardIndex];
        if (!card) return;

        const dialog = document.getElementById('card-info-dialog');
        const title = document.getElementById('card-info-title');
        const image = document.getElementById('card-info-img');
        const name = document.getElementById('card-info-name');
        const effect = document.getElementById('card-info-effect');

        // Set card info based on type
        if (card.type === 'warrior') {
            title.textContent = 'Thông tin thẻ';
            name.textContent = 'Warrior';
            effect.textContent = `Thẻ không có hiệu ứng nào - HP: ${this.warriorHP}/10`;
        } else if (card.type === 'fatuice') {
            title.textContent = 'Thông tin thẻ';
            name.textContent = 'Fatui';
            const currentHP = card.hp || Math.floor(Math.random() * 9) + 1;
            effect.textContent = `Quái vật thông thường - HP: ${currentHP}`;
        } else if (card.type === 'coin') {
            title.textContent = 'Thông tin thẻ';
            name.textContent = 'Coin';
            effect.textContent = 'Thẻ tiền xu quý giá';
        } else if (card.type === 'food') {
            title.textContent = 'Thông tin thẻ';
            if (card.image === 'resources/food1.png') {
                name.textContent = 'Food1';
                effect.textContent = `Thẻ thức ăn hồi phục dần - HP: +${card.heal || 0} (1 HP/move)`;
            } else {
                name.textContent = 'Food0';
                effect.textContent = `Thẻ thức ăn hồi phục - HP: +${card.heal || 0}`;
            }
        } else if (card.type === 'sword') {
            title.textContent = 'Thông tin thẻ';
            name.textContent = 'Sword';
            effect.textContent = `Thẻ phi kiếm quý giá - Độ bền: ${card.durability || 0}`;
        }

        // Set image
        image.src = card.image;
        image.alt = card.type;

        // Show dialog
        dialog.classList.add('show');
    }

    // Hide card info dialog
    hideCardInfo() {
        const dialog = document.getElementById('card-info-dialog');
        dialog.classList.remove('show');
    }

    // Get move function (always use dual mode)
    getMoveFunction() {
        return this.moveWarriorDual.bind(this);
    }

    // Setup drag events for warrior cards
    setupDragEvents(cardElement, index) {
        // Drag events
        cardElement.addEventListener('dragstart', (e) => {
            this.handleDragStart(e, index);
        });

        cardElement.addEventListener('dragend', (e) => {
            this.handleDragEnd(e);
        });

        // Touch events for mobile
        cardElement.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e, index);
        });

        cardElement.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        });

        cardElement.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        });

        // Add long press for warrior cards (mouse only to avoid conflict with drag)
        cardElement.addEventListener('mousedown', (e) => {
            this.handleLongPressStart(e, index);
        });

        cardElement.addEventListener('mouseup', (e) => {
            this.handleLongPressEnd(e);
        });

        cardElement.addEventListener('mouseleave', (e) => {
            this.handleLongPressCancel(e);
        });
    }

    // Setup click events for warrior cards
    setupClickEvents(cardElement, index) {
        cardElement.addEventListener('click', (e) => {
            this.handleWarriorClick(e, index);
        });
    }

    // Setup click events for all cards (to handle hint clicks)
    setupClickEventsForAll(cardElement, index) {
        cardElement.addEventListener('click', (e) => {
            this.handleCardClick(e, index);
        });
    }

    // Setup drop events for all cards
    setupDropEvents(cardElement, index) {
        cardElement.addEventListener('dragover', (e) => {
            this.handleDragOver(e);
        });

        cardElement.addEventListener('drop', (e) => {
            this.handleDrop(e);
        });
    }

    // Handle warrior click
    handleWarriorClick(e, index) {
        // Removed hint functionality
    }

    // Handle any card click - if it's adjacent to warrior, move warrior there
    handleCardClick(e, index) {
        const cardElement = e.target.closest('.card');
        if (!cardElement) return;
        
        const cardType = cardElement.dataset.type;
        
        // Never allow eating warrior cards
        if (cardType === 'warrior') {
            return;
        }
        
        // If clicked card is eatable, check if it's adjacent to warrior
        if (cardType === 'fatuice' || cardType === 'coin' || cardType === 'food' || cardType === 'sword') {
            const warriorIndex = this.findWarriorIndex();
            if (warriorIndex !== null && this.isValidMove(warriorIndex, index)) {
                this.getMoveFunction()(warriorIndex, index);
            }
        }
        // If clicked card is hint target (already highlighted), also move
        else if (cardElement.classList.contains('valid-target')) {
            const warriorIndex = this.findWarriorIndex();
            if (warriorIndex !== null && this.isValidMove(warriorIndex, index)) {
                this.getMoveFunction()(warriorIndex, index);
                this.clearValidTargets();
            }
        }
    }

    // Find the current warrior index
    findWarriorIndex() {
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].type === 'warrior') {
                return i;
            }
        }
        return null;
    }



    // Handle drag start
    handleDragStart(e, index) {
        // Only allow warrior to be dragged
        if (this.cards[index].type !== 'warrior') {
            e.preventDefault();
            return;
        }
        
        this.draggedCard = index;
        this.dragStartPos = { row: Math.floor(index / 3), col: index % 3 };
        e.target.closest('.card').classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    // Handle drag end
    handleDragEnd(e) {
        e.target.closest('.card').classList.remove('dragging');
        this.clearValidTargets();
        this.draggedCard = null;
        this.dragStartPos = null;
    }

    // Handle drag over
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    // Handle drop
    handleDrop(e) {
        e.preventDefault();
        const targetCard = e.target.closest('.card');
        if (!targetCard) return;
        
        const targetIndex = this.getCardIndexFromElement(targetCard);
        
        // Only allow warrior to move
        if (this.draggedCard !== null && this.cards[this.draggedCard].type === 'warrior') {
            if (targetIndex !== null && this.isValidMove(this.draggedCard, targetIndex)) {
                this.getMoveFunction()(this.draggedCard, targetIndex);
            }
        }
    }

    // Touch events for mobile
    handleTouchStart(e, index) {
        e.preventDefault();
        
        // Only allow warrior to be touched for movement
        if (this.cards[index].type !== 'warrior') {
            return;
        }
        
        this.draggedCard = index;
        this.dragStartPos = { row: Math.floor(index / 3), col: index % 3 };
        e.target.closest('.card').classList.add('dragging');
    }

    handleTouchMove(e) {
        e.preventDefault();
        // Show valid targets during touch move
        this.showValidTargets();
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetCard = element.closest('.card');
        
        // Only allow warrior to move
        if (this.draggedCard !== null && this.cards[this.draggedCard].type === 'warrior') {
            if (targetCard) {
                const targetIndex = this.getCardIndexFromElement(targetCard);
                if (targetIndex !== null && this.isValidMove(this.draggedCard, targetIndex)) {
                    this.getMoveFunction()(this.draggedCard, targetIndex);
                }
            }
        }
        
        this.clearValidTargets();
        if (this.draggedCard !== null) {
            document.querySelector(`[data-index="${this.draggedCard}"]`).classList.remove('dragging');
        }
        this.draggedCard = null;
        this.dragStartPos = null;
    }

    // Get card index from element
    getCardIndexFromElement(element) {
        if (!element || !element.dataset.index) return null;
        return parseInt(element.dataset.index);
    }

    // Check if move is valid (adjacent only, no diagonal)
    isValidMove(fromIndex, toIndex) {
        if (fromIndex === null || toIndex === null) return false;
        
        // Never allow eating warrior cards
        if (this.cards[toIndex].type === 'warrior') {
            return false;
        }
        
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        // Check if target is eatable card (fatuice, coin, or food)
        if (this.cards[toIndex].type !== 'fatuice' && this.cards[toIndex].type !== 'coin' && this.cards[toIndex].type !== 'food' && this.cards[toIndex].type !== 'sword') {
            return false;
        }
        
        // Check if adjacent (no diagonal)
        const rowDiff = Math.abs(fromPos.row - toPos.row);
        const colDiff = Math.abs(fromPos.col - toPos.col);
        
        const isValid = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
        
        return isValid;
    }

    // Show valid targets during drag
    showValidTargets() {
        if (this.draggedCard === null) return;
        
        // Only show targets for warrior
        if (this.cards[this.draggedCard].type !== 'warrior') return;
        
        this.cards.forEach((card, index) => {
            if (this.isValidMove(this.draggedCard, index)) {
                const cardElement = document.querySelector(`[data-index="${index}"]`);
                if (cardElement) {
                    cardElement.classList.add('valid-target');
                }
            }
        });
    }

    // Clear valid targets
    clearValidTargets() {
        document.querySelectorAll('.valid-target').forEach(element => {
            element.classList.remove('valid-target');
        });
    }



    // Find which card should move to fill the empty position
    findCardToMove(fromIndex, toIndex) {
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        // Determine the direction of movement
        let direction = '';
        if (toPos.row < fromPos.row) direction = 'up';
        else if (toPos.row > fromPos.row) direction = 'down';
        else if (toPos.col < fromPos.col) direction = 'left';
        else if (toPos.col > fromPos.col) direction = 'right';
        
        // Find the card that should move in the reverse direction
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            if (card && (card.type === 'fatuice' || card.type === 'coin' || card.type === 'food' || card.type === 'sword') && i !== toIndex) {
                const cardPos = { row: Math.floor(i / 3), col: i % 3 };
                let shouldMove = false;
                
                switch (direction) {
                    case 'up':
                        // If warrior moved up, find card below that needs to move up
                        shouldMove = cardPos.row > fromPos.row && cardPos.col === fromPos.col;
                        break;
                    case 'down':
                        // If warrior moved down, find card above that needs to move down
                        shouldMove = cardPos.row < fromPos.row && cardPos.col === fromPos.col;
                        break;
                    case 'left':
                        // If warrior moved left, find card to the right that needs to move left
                        shouldMove = cardPos.col > fromPos.col && cardPos.row === fromPos.row;
                        break;
                    case 'right':
                        // If warrior moved right, find card to the left that needs to move right
                        shouldMove = cardPos.col < fromPos.col && cardPos.row === fromPos.row;
                        break;
                }
                
                if (shouldMove) {
                    return { card, fromIndex: i };
                }
            }
        }
        
        return null;
    }



    // Enhanced dual movement animation
    moveWarriorDual(fromIndex, toIndex) {
        if (!this.isValidMove(fromIndex, toIndex)) return;
        
        // Double check: never allow eating warrior
        if (this.cards[toIndex].type === 'warrior') {
            console.warn('Attempted to eat warrior card - prevented');
            return;
        }

        // Store the card type and score before removing it for scoring
        const eatenCardType = this.cards[toIndex].type;
        const eatenCardScore = this.cards[toIndex].score || this.getRandomScore(eatenCardType);
        const eatenCardHP = this.cards[toIndex].hp || 0;
        const eatenCardHeal = this.cards[toIndex].heal || 0;
        const eatenCardImage = this.cards[toIndex].image;
        const eatenCardDurability = this.cards[toIndex].durability || 0;
        
        // If warrior has weapon and target is fatuice, attack with weapon instead of moving
        if (this.warriorWeapon > 0 && eatenCardType === 'fatuice') {
            this.attackMonsterWithWeapon(fromIndex, toIndex);
            return;
        }
        
        // Find which card should move to fill the empty position
        const cardToMove = this.findCardToMove(fromIndex, toIndex);
        
        // Calculate movement distances
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        const moveX = (toPos.col - fromPos.col) * 100;
        const moveY = (toPos.row - fromPos.row) * 100;
        
        // Get the warrior card element
        const warriorElement = document.querySelector(`[data-index="${fromIndex}"]`);
        const targetElement = document.querySelector(`[data-index="${toIndex}"]`);
        
        if (!warriorElement || !targetElement) return;
        
        // Create damage popup for warrior if eating Fatui (before animation)
        if (eatenCardType === 'fatuice') {
            this.createDamagePopup(warriorElement, eatenCardHP);
        }
        
        // Set CSS variables for dual movement
        warriorElement.style.setProperty('--dual-move-x', `${moveX}px`);
        warriorElement.style.setProperty('--dual-move-y', `${moveY}px`);
        
        // Apply dual movement animation to warrior
        warriorElement.classList.add('dual-moving');
        
        // Apply eating animation to target card
        targetElement.classList.add('dual-eating');
        
        // If there's a card that needs to move, animate it too
        if (cardToMove) {
            const cardToMoveElement = document.querySelector(`[data-index="${cardToMove.fromIndex}"]`);
            if (cardToMoveElement) {
                const reverseMoveX = (fromPos.col - Math.floor(cardToMove.fromIndex % 3)) * 100;
                const reverseMoveY = (fromPos.row - Math.floor(cardToMove.fromIndex / 3)) * 100;
                
                cardToMoveElement.style.setProperty('--dual-reverse-x', `${reverseMoveX}px`);
                cardToMoveElement.style.setProperty('--dual-reverse-y', `${reverseMoveY}px`);
                cardToMoveElement.classList.add('dual-reverse');
            }
        }
        
        // Update game state after animation
        setTimeout(() => {
            // Create new cards array
            const newCards = [...this.cards];
            
            // Move warrior to target position
            newCards[toIndex] = { ...newCards[fromIndex], position: { row: Math.floor(toIndex / 3), col: toIndex % 3 } };
            newCards[fromIndex] = null;
            
            // Move the card that should fill the empty position
            if (cardToMove) {
                newCards[fromIndex] = { ...cardToMove.card, position: { row: Math.floor(fromIndex / 3), col: fromIndex % 3 } };
                
                // Fill the position where the moved card was with new random card
                const newCardImage = this.getRandomCardImage();
                const newCardType = this.getCardType(newCardImage);
                newCards[cardToMove.fromIndex] = {
                    id: cardToMove.fromIndex,
                    type: newCardType,
                    image: newCardImage,
                    position: { row: Math.floor(cardToMove.fromIndex / 3), col: cardToMove.fromIndex % 3 },
                    score: newCardType === 'coin' ? this.getRandomScore('coin') : null,
                    hp: newCardType === 'fatuice' ? Math.floor(Math.random() * 9) + 1 : null,
                    heal: newCardType === 'food' ? (newCardImage === 'resources/food1.png' ? this.getRandomHealAmountFood1() : this.getRandomHealAmount()) : null,
                    durability: newCardType === 'sword' ? this.getRandomWeaponDurability() : null
                };
            } else {
                // If no card needs to move, just fill the empty position with new random card
                const newCardImage = this.getRandomCardImage();
                const newCardType = this.getCardType(newCardImage);
                newCards[fromIndex] = {
                    id: fromIndex,
                    type: newCardType,
                    image: newCardImage,
                    position: { row: Math.floor(fromIndex / 3), col: fromIndex % 3 },
                    score: newCardType === 'coin' ? this.getRandomScore('coin') : null,
                    hp: newCardType === 'fatuice' ? Math.floor(Math.random() * 9) + 1 : null,
                    heal: newCardType === 'food' ? (newCardImage === 'resources/food1.png' ? this.getRandomHealAmountFood1() : this.getRandomHealAmount()) : null,
                    durability: newCardType === 'sword' ? this.getRandomWeaponDurability() : null
                };
            }
            
            // Update the cards array
            this.cards = newCards;
            
            // Update score and moves using the stored card type
            this.score += eatenCardScore;
            this.moves++;
            
            // Update Warrior HP if eating Fatui
            if (eatenCardType === 'fatuice') {
                this.updateWarriorHP(eatenCardHP);
                
                // Check for game over
                if (this.checkGameOver()) {
                    return; // Stop execution if game over
                }
            }
            
            // Heal Warrior HP if eating Food
            if (eatenCardType === 'food') {
                if (eatenCardImage === 'resources/food1.png') {
                    // Food1: Set healFood1 counter and heal 1 HP immediately
                    this.healFood1 = eatenCardHeal;
                    this.healWarriorHP(1);
                    this.healFood1--;
                } else {
                    // Food0: Heal immediately
                    this.healWarriorHP(eatenCardHeal);
                }
            }
            
            // Add weapon to warrior if eating Sword
            if (eatenCardType === 'sword') {
                this.addWeaponToWarrior(eatenCardDurability);
            }
            
            // Update warrior display
            this.updateWarriorDisplay();
            
            // Re-render cards with appear effect for new card
            const newCardIndex = cardToMove ? cardToMove.fromIndex : fromIndex;
            this.renderCardsWithAppearEffect(newCardIndex);
            this.updateUI();
            
            // Process food1 healing on move
            this.processFood1Healing();
            
            // Check for game completion
            if (this.isGameComplete()) {
                this.showMessage("Congratulations! You've eaten all cards!");
            }
        }, 400); // Start appear animation halfway through movement
    }



    // Render cards with appear effect for new card
    renderCardsWithAppearEffect(newCardIndex) {
        const grid = document.getElementById('cards-grid');
        grid.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            if (card) { // Only render if card exists
                const cardElement = this.createCardElement(card, index);
                
                // Add appear effect for the new card
                if (index === newCardIndex) {
                    cardElement.classList.add('appearing');
                }
                
                grid.appendChild(cardElement);
            }
        });
    }



    // Check if game is complete (all eatable cards eaten)
    isGameComplete() {
        return this.cards.every(card => card.type === 'warrior');
    }



    // Reset game
    resetGame() {
        this.score = 0;
        this.moves = 0;
        this.warriorHP = 10; // Reset Warrior HP to max
        this.healFood1 = 0; // Reset food1 healing counter
        this.warriorWeapon = 0; // Reset warrior weapon durability
        this.draggedCard = null;
        this.dragStartPos = null;
        
        this.initializeGame();
        this.showMessage("Game reset!");
    }

    // Start a new game
    newGame() {
        this.score = 0;
        this.moves = 0;
        this.warriorHP = 10; // Reset Warrior HP to max
        this.healFood1 = 0; // Reset food1 healing counter
        this.warriorWeapon = 0; // Reset warrior weapon durability
        this.draggedCard = null;
        this.dragStartPos = null;
        
        this.initializeGame();
        this.showMessage("New game started!");
    }

    // Update the UI
    updateUI() {
        this.updateScore();
        this.updateMoves();
        this.updateWarriorDisplay();
    }

    // Update score display
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }



    // Update moves display
    updateMoves() {
        document.getElementById('moves').textContent = this.moves;
    }

    // Update warrior card display
    updateWarriorDisplay() {
        const warriorElement = document.querySelector('.card.warrior');
        if (warriorElement) {
            // Update HP display
            const hpDisplay = warriorElement.querySelector('.hp-display');
            if (hpDisplay) {
                hpDisplay.textContent = this.warriorHP;
            }
            
            // Update weapon display
            let weaponDisplay = warriorElement.querySelector('.weapon-display');
            if (this.warriorWeapon > 0) {
                if (!weaponDisplay) {
                    weaponDisplay = document.createElement('div');
                    weaponDisplay.className = 'weapon-display';
                    warriorElement.appendChild(weaponDisplay);
                }
                weaponDisplay.textContent = this.warriorWeapon;
            } else if (weaponDisplay) {
                weaponDisplay.remove();
            }
        }
    }

    // Update monster card display
    updateMonsterDisplay(monsterIndex) {
        const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
        if (monsterElement && this.cards[monsterIndex]) {
            const monster = this.cards[monsterIndex];
            const hpDisplay = monsterElement.querySelector('.hp-display');
            if (hpDisplay) {
                hpDisplay.textContent = monster.hp || 0;
            }
        }
    }

    // Create damage popup
    createDamagePopup(element, damage) {
        const popup = document.createElement('div');
        popup.className = 'damage-popup';
        popup.textContent = `-${damage}`;
        element.appendChild(popup);
        
        // Remove popup after animation
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 800);
    }

    // Combat animation
    startCombatAnimation(warriorIndex, monsterIndex, damage) {
        const warriorElement = document.querySelector(`[data-index="${warriorIndex}"]`);
        const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
        
        if (warriorElement) {
            warriorElement.classList.add('combat-attacking');
            setTimeout(() => {
                warriorElement.classList.remove('combat-attacking');
            }, 300);
        }
        
        if (monsterElement) {
            monsterElement.classList.add('combat-defending');
            this.createDamagePopup(monsterElement, damage);
            setTimeout(() => {
                monsterElement.classList.remove('combat-defending');
            }, 300);
        }
    }

    // Show message to user
    showMessage(message) {
        const grid = document.getElementById('cards-grid');
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            font-size: 1.1rem;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        `;
        
        grid.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 2000);
    }

    // Setup event listeners
    setupEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('reset').addEventListener('click', () => {
            this.resetGame();
        });

        // Card info dialog events
        document.getElementById('close-card-info').addEventListener('click', () => {
            this.hideCardInfo();
        });

        // Click outside dialog to close
        document.getElementById('card-info-dialog').addEventListener('click', (e) => {
            if (e.target.id === 'card-info-dialog') {
                this.hideCardInfo();
            }
        });

        // Game over dialog events
        document.getElementById('restart-game').addEventListener('click', () => {
            this.restartFromGameOver();
        });

        // Escape key to close dialogs
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCardInfo();
            }
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new WarriorCardGame();
    
    // Make game globally accessible for debugging
    window.warriorCardGame = game;
}); 