// Boom.js - Thẻ bom
// Chức năng: Thẻ bom gây hại cho người chơi

class Boom extends Card {
    constructor() {
        super(
            "Nổ Định Hướng Có Kiểm Soát", 
            "boom", 
            "resources/boom.webp", 
            "Bom nổ"
        );
        this.damage = Math.floor(Math.random() * 9) + 1; // Sát thương của bom
        this.countdown = 5; // Đếm ngược
    }



    /**
     * Tương tác với character (tương tự treasure)
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý cards
     * @param {number} boomIndex - Index của boom card
     * @returns {Object} Thông tin kết quả
     */
    interactWithCharacter(characterManager, gameState, cardManager, boomIndex) {
        // Tìm vị trí character
        const characterIndex = cardManager.findCharacterIndex();
        
        if (characterIndex !== null && boomIndex !== null) {
            // Lấy toàn bộ mảng cards hiện tại
            const cards = cardManager.getAllCards();
            
            // Đổi vị trí character và boom trong mảng
            const temp = cards[characterIndex];
            cards[characterIndex] = cards[boomIndex];
            cards[boomIndex] = temp;
            
            // Cập nhật id và position cho cả hai cards
            if (cards[characterIndex]) {
                cards[characterIndex].id = characterIndex;
                cards[characterIndex].position = { row: Math.floor(characterIndex / 3), col: characterIndex % 3 };
            }
            if (cards[boomIndex]) {
                cards[boomIndex].id = boomIndex;
                cards[boomIndex].position = { row: Math.floor(boomIndex / 3), col: boomIndex % 3 };
            }
            
            // Cập nhật toàn bộ mảng cards
            cardManager.setAllCards(cards);
            
            return {
                type: 'boom_interact',
                effect: `Boom đổi vị trí với character!`,
                characterPosition: boomIndex,
                boomPosition: characterIndex
            };
        }
        
        return {
            type: 'boom_interact',
            effect: `Tương tác với Boom!`
        };
    }

    /**
     * Hiệu ứng khi boom nổ (countdown = 0)
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý cards
     * @param {number} boomIndex - Index của boom card
     * @param {AnimationManager} animationManager - Manager quản lý animation (optional)
     * @returns {Object} Thông tin kết quả
     */
    explodeEffect(characterManager, gameState, cardManager, boomIndex, animationManager = null) {
        // Cập nhật vị trí character trước khi kiểm tra
        const cards = cardManager.getAllCards();
        let characterIndex = null;
        
        // Tìm character trong mảng cards hiện tại
        for (let i = 0; i < cards.length; i++) {
            if (cards[i] && cards[i].type === 'character') {
                characterIndex = i;
                break;
            }
        }
        
        
        // Tìm các thẻ liền kề (trên, dưới, trái, phải)
        const adjacentCards = this.getAdjacentCards(cardManager, boomIndex);
        
        // Gây damage cho character nếu character ở gần
        if (characterIndex !== null && adjacentCards.includes(characterIndex)) {
            characterManager.damageCharacterHP(this.damage);
            // Game over được xử lý trong damageCharacterHP khi HP = 0
        } else {
        }
        
        // Gây damage cho các thẻ khác (không phải character)
        const affectedNonCharacterCards = [];
        for (const cardIndex of adjacentCards) {
            if (cardIndex !== characterIndex) {
                const card = cardManager.getCard(cardIndex);
                if (card) {
                    // Gây damage cho enemy cards
                    if (card.type === 'enemy' && card.hp !== undefined && card.hp > 0) {
                        const originalHP = card.hp;
                        card.hp -= this.damage;
                        
                        if (card.hp <= 0) {
                            card.hp = 0; // Đảm bảo HP không âm
                            
                            // Chạy killByWeaponEffect nếu có
                            if (typeof card.killByWeaponEffect === 'function') {
                                const killResult = card.killByWeaponEffect(characterManager, gameState);
                                
                                // Xử lý kết quả từ killByWeaponEffect
                                if (killResult && killResult.reward) {
                                    if (killResult.reward.type === 'coin') {
                                        // Tạo coin mặc định
                                        const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
                                        coinCard.id = cardIndex;
                                        coinCard.position = { 
                                            row: Math.floor(cardIndex / 3), 
                                            col: cardIndex % 3 
                                        };
                                        cardManager.updateCard(cardIndex, coinCard);
                                    } else if (killResult.reward.type === 'food3') {
                                        // Tạo Food3 card
                                        const foodCard = cardManager.cardFactory.createCard('Food3');
                                        foodCard.id = cardIndex;
                                        foodCard.position = { 
                                            row: Math.floor(cardIndex / 3), 
                                            col: cardIndex % 3 
                                        };
                                        cardManager.updateCard(cardIndex, foodCard);
                                    }
                                } else {
                                    // Tạo coin mặc định nếu không có reward
                                    const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
                                    coinCard.id = cardIndex;
                                    coinCard.position = { 
                                        row: Math.floor(cardIndex / 3), 
                                        col: cardIndex % 3 
                                    };
                                    cardManager.updateCard(cardIndex, coinCard);
                                }
                            } else {
                                // Tạo coin theo mặc định nếu không có killByWeaponEffect
                                // Tạo coin ngay tại đây và thay thế thẻ
                                const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
                                coinCard.id = cardIndex;
                                coinCard.position = { 
                                    row: Math.floor(cardIndex / 3), 
                                    col: cardIndex % 3 
                                };
                                cardManager.updateCard(cardIndex, coinCard);
                            }
                        } else {
                            // HP chưa về 0, chạy attackByWeaponEffect nếu có
                            if (typeof card.attackByWeaponEffect === 'function') {
                                card.attackByWeaponEffect(characterManager, gameState);
                            }
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'enemy',
                            damage: this.damage,
                            remainingHP: card.hp,
                            wasKilled: originalHP > 0 && card.hp === 0
                        });
                    }
                    // Gây damage cho food cards (Food0-3)
                    else if (card.type === 'food' && card.heal !== undefined && card.heal > 0) {
                        const originalHeal = card.heal;
                        card.heal -= this.damage;
                        
                        if (card.heal <= 0) {
                            card.heal = 0; // Đảm bảo heal không âm
                            
                            // Tạo thẻ void thay thế
                            const voidCard = cardManager.cardFactory.createVoid();
                            voidCard.id = cardIndex;
                            voidCard.position = { 
                                row: Math.floor(cardIndex / 3), 
                                col: cardIndex % 3 
                            };
                            cardManager.updateCard(cardIndex, voidCard);
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'food',
                            damage: this.damage,
                            remainingHeal: card.heal,
                            wasKilled: originalHeal > 0 && card.heal === 0
                        });
                    }
                    // Gây damage cho poison cards
                    else if (card.type === 'poison' && card.poisonDuration !== undefined && card.poisonDuration > 0) {
                        const originalPoisonDuration = card.poisonDuration;
                        const originalHeal = card.heal;
                        
                        card.poisonDuration -= this.damage;
                        card.heal -= this.damage;
                        
                        if (card.poisonDuration <= 0 || card.heal <= 0) {
                            card.poisonDuration = Math.max(0, card.poisonDuration);
                            card.heal = Math.max(0, card.heal);
                            
                            // Tạo thẻ void thay thế
                            const voidCard = cardManager.cardFactory.createVoid();
                            voidCard.id = cardIndex;
                            voidCard.position = { 
                                row: Math.floor(cardIndex / 3), 
                                col: cardIndex % 3 
                            };
                            cardManager.updateCard(cardIndex, voidCard);
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'poison',
                            damage: this.damage,
                            remainingPoisonDuration: card.poisonDuration,
                            remainingHeal: card.heal,
                            wasKilled: (originalPoisonDuration > 0 && card.poisonDuration === 0) || (originalHeal > 0 && card.heal === 0)
                        });
                    }
                    // Gây damage cho coin cards
                    else if (card.type === 'coin' && card.score !== undefined && card.score > 0) {
                        const originalScore = card.score;
                        card.score -= this.damage;
                        
                        if (card.score <= 0) {
                            card.score = 0; // Đảm bảo score không âm
                            
                            // Tạo thẻ void thay thế
                            const voidCard = cardManager.cardFactory.createVoid();
                            voidCard.id = cardIndex;
                            voidCard.position = { 
                                row: Math.floor(cardIndex / 3), 
                                col: cardIndex % 3 
                            };
                            cardManager.updateCard(cardIndex, voidCard);
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'coin',
                            damage: this.damage,
                            remainingScore: card.score,
                            wasKilled: originalScore > 0 && card.score === 0
                        });
                    }
                    // Gây damage cho weapon cards (Sword, Catalyst)
                    else if ((card.type === 'weapon' || card.type === 'sword') && card.durability !== undefined && card.durability > 0) {
                        const originalDurability = card.durability;
                        card.durability -= this.damage;
                        
                        if (card.durability <= 0) {
                            card.durability = 0; // Đảm bảo durability không âm
                            
                            // Tạo thẻ void thay thế
                            const voidCard = cardManager.cardFactory.createVoid();
                            voidCard.id = cardIndex;
                            voidCard.position = { 
                                row: Math.floor(cardIndex / 3), 
                                col: cardIndex % 3 
                            };
                            cardManager.updateCard(cardIndex, voidCard);
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'weapon',
                            damage: this.damage,
                            remainingDurability: card.durability,
                            wasKilled: originalDurability > 0 && card.durability === 0
                        });
                    }
                    // Gây damage cho trap cards (không bao gồm Quicksand)
                    else if (card.nameId === 'trap' && card.damage !== undefined && card.damage > 0) {
                        const originalDamage = card.damage;
                        card.damage -= this.damage;
                        
                        if (card.damage <= 0) {
                            card.damage = 0; // Đảm bảo damage không âm
                            
                            // Tạo thẻ void thay thế
                            const voidCard = cardManager.cardFactory.createVoid();
                            voidCard.id = cardIndex;
                            voidCard.position = { 
                                row: Math.floor(cardIndex / 3), 
                                col: cardIndex % 3 
                            };
                            cardManager.updateCard(cardIndex, voidCard);
                        } else {
                            // Cập nhật hiển thị damage trên trap
                            // Có thể cần cập nhật UI hiển thị damage
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'trap',
                            damage: this.damage,
                            remainingDamage: card.damage,
                            wasKilled: originalDamage > 0 && card.damage === 0
                        });
                    }
                    // Có thể thêm logic cho các loại thẻ khác ở đây
                }
            }
        }
        
        // Tạo thẻ ngẫu nhiên thay thế boom
        const newCard = cardManager.cardFactory.createRandomCard(characterManager);
        newCard.id = boomIndex;
        newCard.position = { row: Math.floor(boomIndex / 3), col: boomIndex % 3 };
        
        return {
            type: 'boom_exploded',
            effect: `Boom nổ! Gây ${this.damage} damage cho các thẻ liền kề!`,
            damage: this.damage,
            adjacentCards: adjacentCards,
            affectedNonCharacterCards: affectedNonCharacterCards,
            newCard: newCard,
            boomIndex: boomIndex
        };
    }

    /**
     * Lấy danh sách các thẻ liền kề
     * @param {CardManager} cardManager - Manager quản lý cards
     * @param {number} boomIndex - Index của boom card
     * @returns {Array} Mảng các index của thẻ liền kề
     */
    getAdjacentCards(cardManager, boomIndex) {
        const adjacentCards = [];
        const boomRow = Math.floor(boomIndex / 3);
        const boomCol = boomIndex % 3;
        
        
        // Kiểm tra các vị trí liền kề
        const adjacentPositions = [
            { row: boomRow - 1, col: boomCol }, // Trên
            { row: boomRow + 1, col: boomCol }, // Dưới
            { row: boomRow, col: boomCol - 1 }, // Trái
            { row: boomRow, col: boomCol + 1 }  // Phải
        ];
        
        for (const pos of adjacentPositions) {
            // Kiểm tra vị trí hợp lệ (trong grid 3x3)
            if (pos.row >= 0 && pos.row < 3 && pos.col >= 0 && pos.col < 3) {
                const index = pos.row * 3 + pos.col;
                const card = cardManager.getCard(index);
                if (card && card.type !== 'boom') { // Không bao gồm boom khác
                    adjacentCards.push(index);
                }
            } else {
            }
        }
        
        return adjacentCards;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `<strong>${this.type}</strong> - Damage: <span class="damage-text">${this.damage}</span><br><i>Bom nổ là vũ khí nguy hiểm được chế tạo từ thuốc nổ mạnh. Khi nổ, nó sẽ gây sát thương cho tất cả các thẻ liền kề và tạo ra thẻ mới.</i>`,
            damage: this.damage
        };
    }
} 
