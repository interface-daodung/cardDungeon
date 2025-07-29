// Game State
class WarriorCardGame {
    constructor() {
        this.cards = [];
        this.score = 0;
        this.level = 1;
        this.moves = 0;
        this.draggedCard = null;
        this.dragStartPos = null;
        this.longPressTimer = null;
        this.longPressDelay = 500; // 500ms for long press
        
        // Array of different Fatui images (4 types)
        this.fatuiImages = [
            'FatuiIce.png',
            'FatuiFire.png',
            'FatuiThunder.png',
            'FatuiWater.png'
        ];
        
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
                    image: 'Warrior.png',
                    position: { row: Math.floor(i / 3), col: i % 3 }
                });
            } else {
                // FatuiIce cards around with random image
                const randomFatuiImage = this.getRandomFatuiImage();
                this.cards.push({
                    id: i,
                    type: 'fatuice',
                    image: randomFatuiImage,
                    position: { row: Math.floor(i / 3), col: i % 3 }
                });
            }
        }
    }

    // Get random Fatui image
    getRandomFatuiImage() {
        const randomIndex = Math.floor(Math.random() * this.fatuiImages.length);
        return this.fatuiImages[randomIndex];
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

        // Add drag events for warrior cards
        if (card.type === 'warrior') {
            this.setupDragEvents(cardElement, index);
            this.setupClickEvents(cardElement, index);
        } else {
            this.setupClickEventsForAll(cardElement, index); // For FatuiIce cards
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
            effect.textContent = 'Thẻ không có hiệu ứng nào';
        } else if (card.type === 'fatuice') {
            title.textContent = 'Thông tin thẻ';
            name.textContent = 'Fatui';
            effect.textContent = 'Quái vật thông thường';
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
        const cardType = cardElement.dataset.type;
        
        // If clicked card is fatuice, check if it's adjacent to warrior
        if (cardType === 'fatuice') {
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
        
        if (targetIndex !== null && this.isValidMove(this.draggedCard, targetIndex)) {
            this.getMoveFunction()(this.draggedCard, targetIndex);
        }
    }

    // Touch events for mobile
    handleTouchStart(e, index) {
        e.preventDefault();
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
        
        if (targetCard) {
            const targetIndex = this.getCardIndexFromElement(targetCard);
            if (targetIndex !== null && this.isValidMove(this.draggedCard, targetIndex)) {
                this.getMoveFunction()(this.draggedCard, targetIndex);
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
        
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        // Check if target is fatuice card
        if (this.cards[toIndex].type !== 'fatuice') {
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



    // Find the card that should move to fill the empty position
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
            if (card && card.type === 'fatuice' && i !== toIndex) {
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
        const warriorCard = this.cards[fromIndex];
        const fatuiceCard = this.cards[toIndex];
        
        // Get elements
        const warriorElement = document.querySelector(`[data-index="${fromIndex}"]`);
        const fatuiceElement = document.querySelector(`[data-index="${toIndex}"]`);
        
        // Calculate movement direction for warrior
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        const moveX = (toPos.col - fromPos.col) * 100;
        const moveY = (toPos.row - fromPos.row) * 100;
        
        // Find the card that should move to fill the empty position
        const cardToMove = this.findCardToMove(fromIndex, toIndex);
        
        // Enhanced dual movement animation
        if (cardToMove) {
            // DUAL MOVEMENT: Warrior and reverse card move simultaneously
            const reverseCardElement = document.querySelector(`[data-index="${cardToMove.fromIndex}"]`);
            if (reverseCardElement) {
                const cardPos = { row: Math.floor(cardToMove.fromIndex / 3), col: cardToMove.fromIndex % 3 };
                const moveToX = (fromPos.col - cardPos.col) * 100;
                const moveToY = (fromPos.row - cardPos.row) * 100;
                
                // Set CSS variables for dual animation
                warriorElement.style.setProperty('--dual-move-x', `${moveX}%`);
                warriorElement.style.setProperty('--dual-move-y', `${moveY}%`);
                reverseCardElement.style.setProperty('--dual-reverse-x', `${moveToX}%`);
                reverseCardElement.style.setProperty('--dual-reverse-y', `${moveToY}%`);
                
                // Apply dual movement classes
                warriorElement.classList.add('dual-moving');
                reverseCardElement.classList.add('dual-reverse');
                fatuiceElement.classList.add('dual-eating');
                
                // Add visual feedback for dual movement
                warriorElement.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.8)';
                reverseCardElement.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.8)';
                
            }
        } else {
            // SINGLE MOVEMENT: Only warrior moves
            warriorElement.classList.add('sliding');
            warriorElement.style.setProperty('--move-x', `${moveX}%`);
            warriorElement.style.setProperty('--move-y', `${moveY}%`);
            warriorElement.style.transform = `translate(${moveX}%, ${moveY}%)`;
            fatuiceElement.classList.add('eating');
        }
        
        setTimeout(() => {
            // Create new cards array
            const newCards = [...this.cards];
            
            // Move warrior to new position
            newCards[toIndex] = { ...warriorCard, position: { row: Math.floor(toIndex / 3), col: toIndex % 3 } };
            
            if (cardToMove) {
                // Move that card to the empty position
                newCards[fromIndex] = { ...cardToMove.card, position: { row: Math.floor(fromIndex / 3), col: fromIndex % 3 } };
                
                // Fill the position where the moved card was with new fatuice
                newCards[cardToMove.fromIndex] = {
                    id: cardToMove.fromIndex,
                    type: 'fatuice',
                    image: this.getRandomFatuiImage(),
                    position: { row: Math.floor(cardToMove.fromIndex / 3), col: cardToMove.fromIndex % 3 }
                };
            } else {
                // If no card needs to move, just fill the empty position with new fatuice
                newCards[fromIndex] = {
                    id: fromIndex,
                    type: 'fatuice',
                    image: this.getRandomFatuiImage(),
                    position: { row: Math.floor(fromIndex / 3), col: fromIndex % 3 }
                };
            }
            
            // Update the cards array
            this.cards = newCards;
            
            // Update score and moves
            this.score += 10;
            this.moves++;
            this.level = Math.floor(this.score / 50) + 1;
            
            // Re-render cards with appear effect for new card
            const newCardIndex = cardToMove ? cardToMove.fromIndex : fromIndex;
            this.renderCardsWithAppearEffect(newCardIndex);
            this.updateUI();
            
            // Check for game completion
            if (this.isGameComplete()) {
                this.showMessage("Congratulations! You've eaten all FatuiIce!");
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



    // Check if game is complete (all fatuice eaten)
    isGameComplete() {
        return this.cards.every(card => card.type === 'warrior');
    }



    // Reset game
    resetGame() {
        this.score = 0;
        this.level = 1;
        this.moves = 0;
        this.draggedCard = null;
        this.dragStartPos = null;
        
        this.initializeGame();
        this.showMessage("Game reset!");
    }

    // Start a new game
    newGame() {
        this.score = 0;
        this.level = 1;
        this.moves = 0;
        this.draggedCard = null;
        this.dragStartPos = null;
        
        this.initializeGame();
        this.showMessage("New game started!");
    }

    // Update the UI
    updateUI() {
        this.updateScore();
        this.updateLevel();
        this.updateMoves();
    }

    // Update score display
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    // Update level display
    updateLevel() {
        document.getElementById('level').textContent = this.level;
    }

    // Update moves display
    updateMoves() {
        document.getElementById('moves').textContent = this.moves;
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

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            } else if (e.key === 'n' || e.key === 'N') {
                this.newGame();
            } else if (e.key === 'Escape') {
                this.hideCardInfo();
            }
        });

        // Add dialog close event
        document.getElementById('close-card-info').addEventListener('click', () => {
            this.hideCardInfo();
        });

        // Close dialog when clicking outside
        document.getElementById('card-info-dialog').addEventListener('click', (e) => {
            if (e.target.id === 'card-info-dialog') {
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