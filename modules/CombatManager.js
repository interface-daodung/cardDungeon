// CombatManager.js - Quản lý chiến đấu
// Chức năng: Xử lý logic chiến đấu, tấn công và tương tác giữa Warrior và các thẻ khác
class CombatManager {
    constructor(warriorManager, cardManager, animationManager) {
        this.warriorManager = warriorManager; // Quản lý trạng thái Warrior
        this.cardManager = cardManager; // Quản lý thẻ
        this.animationManager = animationManager; // Quản lý animation
    }

    // Tấn công monster từ xa bằng vũ khí (không cần di chuyển)
    attackMonsterFromDistance(monsterIndex) {
        // Kiểm tra Warrior có vũ khí không
        if (!this.warriorManager.hasWeapon()) return false;
        
        // Lấy thông tin monster
        const monster = this.cardManager.getCard(monsterIndex);
        if (!monster || monster.type !== 'fatuice') return false; // Chỉ tấn công được quái vật
        
        const monsterHP = monster.hp || 0; // HP hiện tại của monster
        const weaponDamage = this.warriorManager.getWarriorWeapon(); // Độ bền vũ khí = sát thương
        
        // Tính sát thương thực tế (không vượt quá HP monster)
        const actualDamage = Math.min(weaponDamage, monsterHP);
        
        // Giảm HP monster
        monster.hp = monsterHP - actualDamage;
        
        // Giảm độ bền vũ khí
        this.warriorManager.warriorWeapon -= actualDamage;
        
        // Cập nhật hiển thị độ bền vũ khí
        this.animationManager.updateWarriorDisplay();
        
        // Nếu monster chết
        if (monster.hp <= 0) {
            // Thêm hiệu ứng chết cho monster
            const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
            if (monsterElement) {
                monsterElement.classList.add('monster-dying');
            }
            
            // Sau 600ms, tạo coin mới thay thế monster
            setTimeout(() => {
                const randomCoinIndex = Math.floor(Math.random() * 7); // Chọn coin ngẫu nhiên
                const randomCoinScore = Math.floor(Math.random() * 9) + 1; // Điểm ngẫu nhiên
                
                // Tạo thẻ coin mới
                const newCoinCard = {
                    id: monsterIndex, 
                    type: 'coin', 
                    image: `resources/coin${randomCoinIndex}.webp`,
                    position: { row: Math.floor(monsterIndex / 3), col: monsterIndex % 3 },
                    score: randomCoinScore, 
                    hp: null, 
                    heal: null, 
                    durability: null
                };
                
                this.cardManager.updateCard(monsterIndex, newCoinCard); // Cập nhật thẻ
                this.animationManager.renderCardsWithAppearEffect(monsterIndex); // Render với hiệu ứng
            }, 600);
            
            return true; // Tấn công thành công
        }
        
        return true; // Tấn công thành công (monster còn sống)
    }

    attackMonsterWithWeapon(warriorIndex, monsterIndex) {
        const monster = this.cardManager.getCard(monsterIndex);
        const monsterHP = monster.hp || 0;
        const weaponDamage = this.warriorManager.getWarriorWeapon();
        
        const actualDamage = Math.min(weaponDamage, monsterHP);
        
        this.animationManager.startCombatAnimation(warriorIndex, monsterIndex, actualDamage);
        
        setTimeout(() => {
            monster.hp = monsterHP - actualDamage;
            
            this.warriorManager.warriorWeapon -= actualDamage;
            
            // Cập nhật hiển thị độ bền vũ khí
            this.animationManager.updateWarriorDisplay();
            
            if (monster.hp <= 0) {
                const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
                if (monsterElement) {
                    monsterElement.classList.add('monster-dying');
                }
                
                setTimeout(() => {
                    // Tạo coin mới thay thế monster (Warrior không di chuyển)
                    const randomCoinIndex = Math.floor(Math.random() * 7);
                    const randomCoinScore = Math.floor(Math.random() * 9) + 1; // Điểm từ 1-9
                    
                    const newCoinCard = {
                        id: monsterIndex, type: 'coin', image: `resources/coin${randomCoinIndex}.webp`,
                        position: { row: Math.floor(monsterIndex / 3), col: monsterIndex % 3 },
                        score: randomCoinScore, hp: null, heal: null, durability: null
                    };
                    
                    this.cardManager.updateCard(monsterIndex, newCoinCard);
                    
                    // Warrior không di chuyển, chỉ render coin mới
                    this.animationManager.renderCardsWithAppearEffect(monsterIndex);
                    
                    // Cập nhật score và moves
                    if (this.animationManager.eventManager && this.animationManager.eventManager.gameState) {
                        this.animationManager.eventManager.gameState.addScore(randomCoinScore); // Thêm điểm của coin
                        this.animationManager.eventManager.gameState.incrementMoves();
                    }
                    
                    // Setup events lại cho coin mới để Warrior có thể di chuyển đến
                    this.setupCardEventsAfterCombat();
                    
                    // Cập nhật UI
                    if (this.animationManager.eventManager && this.animationManager.eventManager.uiManager) {
                        this.animationManager.eventManager.uiManager.updateUI();
                    }
                    
                    // Kiểm tra game over sau khi tấn công
                    if (this.checkGameOver()) {
                        this.animationManager.triggerGameOver();
                        return;
                    }
                }, 600);
            } else {
                this.animationManager.updateMonsterDisplay(monsterIndex);
                // Cập nhật hiển thị độ bền vũ khí ngay cả khi monster không chết
                this.animationManager.updateWarriorDisplay();
            }
        }, 150);
        
        return true;
    }

    moveWarriorAfterCombat(fromIndex, toIndex) {
        // Tạo animation di chuyển warrior
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
        
        setTimeout(() => {
            // Cập nhật vị trí warrior
            const newCards = [...this.cardManager.getAllCards()];
            newCards[toIndex] = { ...newCards[fromIndex], position: { row: Math.floor(toIndex / 3), col: toIndex % 3 } };
            newCards[fromIndex] = null;
            
            // Tạo thẻ mới ở vị trí cũ của warrior
            const newCard = this.cardManager.createRandomCard(fromIndex);
            newCards[fromIndex] = newCard;
            
            this.cardManager.cards = newCards;
            
            // Render lại và setup events
            this.animationManager.updateWarriorDisplay();
            this.animationManager.renderCardsWithAppearEffect(fromIndex);
            
            // Cập nhật UI
            if (this.animationManager.eventManager && this.animationManager.eventManager.uiManager) {
                this.animationManager.eventManager.uiManager.updateUI();
            }
            
            // Setup events lại cho các thẻ mới
            this.setupCardEventsAfterCombat();
        }, 400);
    }

    setupCardEventsAfterCombat() {
        // Gọi setupCardEvents từ EventManager thông qua AnimationManager
        if (this.animationManager.eventManager) {
            this.animationManager.eventManager.setupCardEvents();
        }
    }

    checkGameOver() {
        return !this.warriorManager.isAlive();
    }

    processCardEating(fromIndex, toIndex) {
        const targetCard = this.cardManager.getCard(toIndex);
        if (!targetCard) return false;

        const eatenCardType = targetCard.type;
        const eatenCardScore = targetCard.score || 0;
        const eatenCardHP = targetCard.hp || 0;
        const eatenCardHeal = targetCard.heal || 0;
        const eatenCardImage = targetCard.image;
        const eatenCardDurability = targetCard.durability || 0;

        if (this.warriorManager.hasWeapon() && eatenCardType === 'fatuice') {
            this.attackMonsterWithWeapon(fromIndex, toIndex);
            return true;
        }

        this.warriorManager.processCardConsumption(eatenCardType, {
            hp: eatenCardHP, heal: eatenCardHeal, image: eatenCardImage, durability: eatenCardDurability
        });

        return {
            score: eatenCardScore, type: eatenCardType, hp: eatenCardHP
        };
    }
} 