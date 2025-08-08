// Boom.js - Thẻ bom
// Chức năng: Thẻ bom gây hại cho người chơi

class Boom extends Card {
    constructor() {
        super(
            "Nổ Định Hướng Có Kiểm Soát", 
            "boom", 
            "resources/boom.webp", 
            "boom"
        );
        this.damage = this.GetRandom(3, 7); // Sát thương của bom
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
    interactWithCharacter(characterManager = null, gameState = null, cardManager = null, boomIndex = null) {
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
    explodeEffect(characterManager = null, gameState = null, cardManager = null, boomIndex = null, animationManager = null) {
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
        }  
        
        // Gây damage cho các thẻ khác (không phải character)

        
        const affectedNonCharacterCards = [];
        for (const cardIndex of adjacentCards) {
            if (cardIndex !== characterIndex) {
                const card = cardManager.getCard(cardIndex);
                card.takeDamageEffect(document.querySelector(`[data-index="${cardIndex}"]`), this.damage, 'boom', characterManager, cardManager);
                if (card && card.type !== 'character') {
                    affectedNonCharacterCards.push({
                        index: cardIndex,
                        type: card.type,
                        damage: this.damage,
                        remainingHeal: card.heal,
                        wasKilled: card.hp > 0 && card.hp === 0
                    });
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
                // có bao gồm boom khác 
                //if (card && card.type !== 'boom') { // Không bao gồm boom khác
                if (card) {
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
