// EventManager.js - Quản lý events
class EventManager {
    constructor(gameState, cardManager, warriorManager, combatManager, animationManager, uiManager) {
        this.gameState = gameState;
        this.cardManager = cardManager;
        this.warriorManager = warriorManager;
        this.combatManager = combatManager;
        this.animationManager = animationManager;
        this.uiManager = uiManager;
    }

    setupEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => {
            this.onNewGame();
        });

        document.getElementById('reset').addEventListener('click', () => {
            this.onReset();
        });

        document.getElementById('close-card-info').addEventListener('click', () => {
            this.uiManager.hideCardInfo();
        });

        document.getElementById('card-info-dialog').addEventListener('click', (e) => {
            if (e.target.id === 'card-info-dialog') {
                this.uiManager.hideCardInfo();
            }
        });

        document.getElementById('restart-game').addEventListener('click', () => {
            this.onRestartFromGameOver();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.uiManager.hideCardInfo();
            }
        });
    }

    setupCardEvents() {
        this.cardManager.getAllCards().forEach((card, index) => {
            const cardElement = document.querySelector(`[data-index="${index}"]`);
            if (cardElement) {
                if (card.type === 'warrior') {
                    this.setupDragEvents(cardElement, index);
                    this.setupClickEvents(cardElement, index);
                } else {
                    this.setupClickEventsForAll(cardElement, index);
                }
                this.setupDropEvents(cardElement, index);
                this.setupLongPressEvents(cardElement, index);
            }
        });
    }

    setupDragEvents(cardElement, index) {
        cardElement.addEventListener('dragstart', (e) => {
            this.handleDragStart(e, index);
        });

        cardElement.addEventListener('dragend', (e) => {
            this.handleDragEnd(e);
        });

        cardElement.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e, index);
        });

        cardElement.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        });

        cardElement.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        });

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

    setupClickEvents(cardElement, index) {
        cardElement.addEventListener('click', (e) => {
            this.handleWarriorClick(e, index);
        });
    }

    setupClickEventsForAll(cardElement, index) {
        cardElement.addEventListener('click', (e) => {
            this.handleCardClick(e, index);
        });
    }

    setupDropEvents(cardElement, index) {
        cardElement.addEventListener('dragover', (e) => {
            this.handleDragOver(e);
        });

        cardElement.addEventListener('drop', (e) => {
            this.handleDrop(e);
        });
    }

    setupLongPressEvents(cardElement, index) {
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

    handleWarriorClick(e, index) {
        // Removed hint functionality
    }

    handleCardClick(e, index) {
        const cardElement = e.target.closest('.card');
        if (!cardElement) return;
        
        const cardType = cardElement.dataset.type;
        
        if (cardType === 'warrior') {
            return;
        }
        
        if (cardType === 'fatuice' || cardType === 'coin' || cardType === 'food' || cardType === 'sword') {
            const warriorIndex = this.cardManager.findWarriorIndex();
            if (warriorIndex !== null && this.uiManager.isValidMove(warriorIndex, index, this.cardManager)) {
                this.moveWarrior(warriorIndex, index);
            }
        }
        else if (cardElement.classList.contains('valid-target')) {
            const warriorIndex = this.cardManager.findWarriorIndex();
            if (warriorIndex !== null && this.uiManager.isValidMove(warriorIndex, index, this.cardManager)) {
                this.moveWarrior(warriorIndex, index);
                this.uiManager.clearValidTargets();
            }
        }
    }

    handleDragStart(e, index) {
        if (this.cardManager.getCard(index).type !== 'warrior') {
            e.preventDefault();
            return;
        }
        
        this.gameState.setDraggedCard(index);
        this.gameState.setDragStartPos({ row: Math.floor(index / 3), col: index % 3 });
        e.target.closest('.card').classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragEnd(e) {
        e.target.closest('.card').classList.remove('dragging');
        this.uiManager.clearValidTargets();
        this.gameState.clearDraggedCard();
        this.gameState.clearDragStartPos();
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
        e.preventDefault();
        const targetCard = e.target.closest('.card');
        if (!targetCard) return;
        
        const targetIndex = this.uiManager.getCardIndexFromElement(targetCard);
        
        const draggedCardIndex = this.gameState.getDraggedCard();
        if (draggedCardIndex !== null && this.cardManager.getCard(draggedCardIndex).type === 'warrior') {
            if (targetIndex !== null && this.uiManager.isValidMove(draggedCardIndex, targetIndex, this.cardManager)) {
                this.moveWarrior(draggedCardIndex, targetIndex);
            }
        }
    }

    handleTouchStart(e, index) {
        e.preventDefault();
        
        if (this.cardManager.getCard(index).type !== 'warrior') {
            return;
        }
        
        this.gameState.setDraggedCard(index);
        this.gameState.setDragStartPos({ row: Math.floor(index / 3), col: index % 3 });
        e.target.closest('.card').classList.add('dragging');
    }

    handleTouchMove(e) {
        e.preventDefault();
        this.uiManager.showValidTargets(this.gameState.getDraggedCard(), this.cardManager);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetCard = element.closest('.card');
        
        const draggedCardIndex = this.gameState.getDraggedCard();
        if (draggedCardIndex !== null && this.cardManager.getCard(draggedCardIndex).type === 'warrior') {
            if (targetCard) {
                const targetIndex = this.uiManager.getCardIndexFromElement(targetCard);
                if (targetIndex !== null && this.uiManager.isValidMove(draggedCardIndex, targetIndex, this.cardManager)) {
                    this.moveWarrior(draggedCardIndex, targetIndex);
                }
            }
        }
        
        this.uiManager.clearValidTargets();
        if (this.gameState.getDraggedCard() !== null) {
            document.querySelector(`[data-index="${this.gameState.getDraggedCard()}"]`).classList.remove('dragging');
        }
        this.gameState.clearDraggedCard();
        this.gameState.clearDragStartPos();
    }

    handleLongPressStart(e, index) {
        e.preventDefault();
        const timer = setTimeout(() => {
            this.uiManager.showCardInfo(index, this.cardManager);
        }, this.gameState.getLongPressDelay());
        this.gameState.setLongPressTimer(timer);
    }

    handleLongPressEnd(e) {
        this.gameState.clearLongPressTimer();
    }

    handleLongPressCancel(e) {
        this.gameState.clearLongPressTimer();
    }

    moveWarrior(fromIndex, toIndex) {
        if (!this.uiManager.isValidMove(fromIndex, toIndex, this.cardManager)) return;
        
        if (this.cardManager.getCard(toIndex).type === 'warrior') {
            console.warn('Attempted to eat warrior card - prevented');
            return;
        }

        const eatingResult = this.combatManager.processCardEating(fromIndex, toIndex);
        if (eatingResult === true) {
            return;
        }

        if (eatingResult) {
            this.gameState.addScore(eatingResult.score);
            this.gameState.incrementMoves();
            
            if (eatingResult.type === 'fatuice') {
                const warriorElement = document.querySelector(`[data-index="${fromIndex}"]`);
                if (warriorElement) {
                    this.animationManager.createDamagePopup(warriorElement, eatingResult.hp);
                }
            }
            
            // Kiểm tra game over sau khi ăn thẻ
            if (this.combatManager.checkGameOver()) {
                this.animationManager.triggerGameOver();
                return;
            }
        }

        const cardToMove = this.cardManager.findCardToMove(fromIndex, toIndex);
        
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        const moveX = (toPos.col - fromPos.col) * 100;
        const moveY = (toPos.row - fromPos.row) * 100;
        
        const warriorElement = document.querySelector(`[data-index="${fromIndex}"]`);
        const targetElement = document.querySelector(`[data-index="${toIndex}"]`);
        
        if (!warriorElement || !targetElement) return;
        
        warriorElement.style.setProperty('--dual-move-x', `${moveX}px`);
        warriorElement.style.setProperty('--dual-move-y', `${moveY}px`);
        
        warriorElement.classList.add('dual-moving');
        targetElement.classList.add('dual-eating');
        
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
        
        setTimeout(() => {
            const newCards = [...this.cardManager.getAllCards()];
            
            newCards[toIndex] = { ...newCards[fromIndex], position: { row: Math.floor(toIndex / 3), col: toIndex % 3 } };
            newCards[fromIndex] = null;
            
            if (cardToMove) {
                newCards[fromIndex] = { ...cardToMove.card, position: { row: Math.floor(fromIndex / 3), col: fromIndex % 3 } };
                
                const newCard = this.cardManager.createRandomCard(cardToMove.fromIndex);
                newCards[cardToMove.fromIndex] = newCard;
            } else {
                const newCard = this.cardManager.createRandomCard(fromIndex);
                newCards[fromIndex] = newCard;
            }
            
            this.cardManager.cards = newCards;
            
            this.animationManager.updateWarriorDisplay();
            
            const newCardIndex = cardToMove ? cardToMove.fromIndex : fromIndex;
            this.animationManager.renderCardsWithAppearEffect(newCardIndex);
            this.uiManager.updateUI();
            
            // FIX: Setup events lại cho các thẻ mới
            this.setupCardEvents();
            
            this.warriorManager.processFood1Healing();
            
            // Kiểm tra game over sau khi hồi phục HP
            if (this.combatManager.checkGameOver()) {
                this.animationManager.triggerGameOver();
                return;
            }
            
            if (this.cardManager.isGameComplete()) {
                this.animationManager.showMessage("Congratulations! You've eaten all cards!");
            }
        }, 400);
    }

    onNewGame() {
        this.gameState.reset();
        this.warriorManager.reset();
        this.cardManager.createCards();
        this.animationManager.renderCards();
        this.uiManager.updateUI();
        this.setupCardEvents();
        this.animationManager.showMessage("New game started!");
    }

    onReset() {
        this.gameState.reset();
        this.warriorManager.reset();
        this.cardManager.createCards();
        this.animationManager.renderCards();
        this.uiManager.updateUI();
        this.setupCardEvents();
        this.animationManager.showMessage("Game reset!");
    }

    onRestartFromGameOver() {
        this.animationManager.hideGameOverDialog();
        this.onNewGame();
    }
} 