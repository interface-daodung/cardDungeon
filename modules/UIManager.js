// UIManager.js - Quản lý giao diện
class UIManager {
    constructor(gameState, warriorManager) {
        this.gameState = gameState;
        this.warriorManager = warriorManager;
    }

    updateUI() {
        this.updateScore();
        this.updateMoves();
        this.updateHighScore();
        this.updateWarriorDisplay();
    }

    updateScore() {
        document.getElementById('score').textContent = this.gameState.getScore();
    }

    updateMoves() {
        document.getElementById('moves').textContent = this.gameState.getMoves();
    }

    updateHighScore() {
        document.getElementById('high-score').textContent = this.gameState.getHighScore();
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

    showCardInfo(cardIndex, cardManager) {
        const card = cardManager.getCard(cardIndex);
        if (!card) return;

        const dialog = document.getElementById('card-info-dialog');
        const title = document.getElementById('card-info-title');
        const image = document.getElementById('card-info-img');
        const name = document.getElementById('card-info-name');
        const effect = document.getElementById('card-info-effect');

        if (card.type === 'warrior') {
            title.textContent = 'Thông tin thẻ';
            name.textContent = 'Warrior';
            const warriorHP = this.warriorManager.getWarriorHP();
            const warriorWeapon = this.warriorManager.getWarriorWeapon();
            let effectText = `HP: ${warriorHP}/10`;
            
            if (warriorWeapon > 0) {
                effectText += ` - Vũ khí: ${warriorWeapon} độ bền`;
            }
            
            effect.textContent = effectText;
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
            if (card.image === 'resources/food1.webp') {
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

        image.src = card.image;
        image.alt = card.type;

        dialog.classList.add('show');
    }

    hideCardInfo() {
        const dialog = document.getElementById('card-info-dialog');
        dialog.classList.remove('show');
    }

    showValidTargets(draggedCardIndex, cardManager) {
        if (draggedCardIndex === null) return;
        
        const draggedCard = cardManager.getCard(draggedCardIndex);
        if (!draggedCard || draggedCard.type !== 'warrior') return;
        
        cardManager.getAllCards().forEach((card, index) => {
            if (this.isValidMove(draggedCardIndex, index, cardManager)) {
                const cardElement = document.querySelector(`[data-index="${index}"]`);
                if (cardElement) {
                    cardElement.classList.add('valid-target');
                }
            }
        });
    }

    clearValidTargets() {
        document.querySelectorAll('.valid-target').forEach(element => {
            element.classList.remove('valid-target');
        });
    }

    isValidMove(fromIndex, toIndex, cardManager) {
        if (fromIndex === null || toIndex === null) return false;
        
        const targetCard = cardManager.getCard(toIndex);
        if (targetCard && targetCard.type === 'warrior') {
            return false;
        }
        
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        if (targetCard && targetCard.type !== 'fatuice' && targetCard.type !== 'coin' && targetCard.type !== 'food' && targetCard.type !== 'sword') {
            return false;
        }
        
        const rowDiff = Math.abs(fromPos.row - toPos.row);
        const colDiff = Math.abs(fromPos.col - toPos.col);
        
        const isValid = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
        
        return isValid;
    }

    getCardIndexFromElement(element) {
        if (!element || !element.dataset.index) return null;
        return parseInt(element.dataset.index);
    }
} 