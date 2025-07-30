// AnimationManager.js - Quản lý animation
class AnimationManager {
    constructor(cardManager, warriorManager) {
        this.cardManager = cardManager;
        this.warriorManager = warriorManager;
        this.eventManager = null; // Sẽ được set từ WarriorCardGame
    }

    setEventManager(eventManager) {
        this.eventManager = eventManager;
    }

    renderCards() {
        const grid = document.getElementById('cards-grid');
        grid.innerHTML = '';
        
        this.cardManager.getAllCards().forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            grid.appendChild(cardElement);
        });
    }

    renderCardsWithAppearEffect(newCardIndex) {
        const grid = document.getElementById('cards-grid');
        grid.innerHTML = '';
        
        this.cardManager.getAllCards().forEach((card, index) => {
            if (card) {
                const cardElement = this.createCardElement(card, index);
                if (index === newCardIndex) {
                    cardElement.classList.add('appearing');
                }
                grid.appendChild(cardElement);
            }
        });
    }

    createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.type}`;
        cardElement.dataset.index = index;
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.type = card.type;
        
        const imageElement = document.createElement('img');
        imageElement.className = 'card-image';
        imageElement.src = card.image;
        imageElement.alt = card.type;
        imageElement.draggable = card.type === 'warrior';
        
        cardElement.appendChild(imageElement);

        if (card.type === 'coin') {
            const scoreDisplay = document.createElement('div');
            scoreDisplay.className = 'score-display';
            scoreDisplay.textContent = card.score || 0;
            cardElement.appendChild(scoreDisplay);
        }

        if (card.type === 'food') {
            const healDisplay = document.createElement('div');
            healDisplay.className = 'heal-display';
            healDisplay.textContent = card.heal || 0;
            cardElement.appendChild(healDisplay);
        }

        if (card.type === 'sword') {
            const durabilityDisplay = document.createElement('div');
            durabilityDisplay.className = 'durability-display';
            durabilityDisplay.textContent = card.durability || 0;
            cardElement.appendChild(durabilityDisplay);
        }

        if (card.type === 'warrior') {
            const hpDisplay = document.createElement('div');
            hpDisplay.className = 'hp-display';
            hpDisplay.textContent = this.warriorManager.getWarriorHP();
            cardElement.appendChild(hpDisplay);
            
            if (this.warriorManager.getWarriorWeapon() > 0) {
                const weaponDisplay = document.createElement('div');
                weaponDisplay.className = 'weapon-display';
                weaponDisplay.textContent = this.warriorManager.getWarriorWeapon();
                cardElement.appendChild(weaponDisplay);
            }
        } else if (card.type === 'fatuice') {
            const hpDisplay = document.createElement('div');
            hpDisplay.className = 'hp-display';
            const currentHP = card.hp || Math.floor(Math.random() * 9) + 1;
            hpDisplay.textContent = currentHP;
            cardElement.appendChild(hpDisplay);
        }

        return cardElement;
    }

    updateWarriorDisplay() {
        const warriorElement = document.querySelector('.card.warrior');
        if (warriorElement) {
            const hpDisplay = warriorElement.querySelector('.hp-display');
            if (hpDisplay) {
                hpDisplay.textContent = this.warriorManager.getWarriorHP();
            }
            
            let weaponDisplay = warriorElement.querySelector('.weapon-display');
            if (this.warriorManager.getWarriorWeapon() > 0) {
                if (!weaponDisplay) {
                    weaponDisplay = document.createElement('div');
                    weaponDisplay.className = 'weapon-display';
                    warriorElement.appendChild(weaponDisplay);
                }
                weaponDisplay.textContent = this.warriorManager.getWarriorWeapon();
            } else if (weaponDisplay) {
                weaponDisplay.remove();
            }
        }
    }

    updateMonsterDisplay(monsterIndex) {
        const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
        if (monsterElement && this.cardManager.getCard(monsterIndex)) {
            const monster = this.cardManager.getCard(monsterIndex);
            const hpDisplay = monsterElement.querySelector('.hp-display');
            if (hpDisplay) {
                hpDisplay.textContent = monster.hp || 0;
            }
        }
    }

    createDamagePopup(element, damage) {
        const popup = document.createElement('div');
        popup.className = 'damage-popup';
        popup.textContent = `-${damage}`;
        element.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 800);
    }

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

    triggerGameOver() {
        const cards = document.querySelectorAll('.card');
        console.log(`Found ${cards.length} cards to animate`);
        
        if (cards.length === 0) {
            console.warn('No cards found to animate');
            this.showGameOverDialog();
            return;
        }
        
        let animatedCount = 0;
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('shrinking');
                animatedCount++;
                console.log(`Animating card ${index} (${animatedCount}/${cards.length})`);
                
                if (animatedCount === cards.length) {
                    console.log('All cards animated successfully');
                }
            }, index * 150);
        });

        const totalAnimationTime = cards.length * 150 + 1500;
        console.log(`Game over dialog will show in ${totalAnimationTime}ms`);
        
        setTimeout(() => {
            this.showGameOverDialog();
        }, totalAnimationTime);
    }

    showGameOverDialog() {
        this.forceHideAllCards();
        
        const dialog = document.getElementById('game-over-dialog');
        dialog.classList.add('show');
    }

    forceHideAllCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.display = 'none';
        });
        console.log('Force hidden all cards');
    }

    hideGameOverDialog() {
        const dialog = document.getElementById('game-over-dialog');
        dialog.classList.remove('show');
    }
} 