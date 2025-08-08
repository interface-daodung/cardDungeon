// AbyssLector0.js - Thẻ quái vật Abyss Lector loại 0
// Chức năng: Quái vật Abyss Lector

class AbyssLector0 extends Card {
    constructor() {
        super(
            "Học Sĩ Vực Sâu - Uyên Hỏa", 
            "enemy", 
            "resources/abyssLector0.webp", 
            "abyssLector0"
        );
        this.hp = this.GetRandom(4, 13); // HP từ 5-13
        this.shield = 1; // Shield của quái vật
        this.score = this.GetRandom(6, 9); // Điểm từ 3-12
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager = null, gameState = null, cardManager = null) {
        // Quái vật gây sát thương cho character
        characterManager.damageCharacterHP(this.hp);
        
        // Cộng điểm khi ăn enemy
        gameState.addScore(this.score);
        
        return {
            type: 'enemy',
            hp: this.hp,
            score: this.score,
            effect: `Character bị mất ${this.hp} HP, nhận ${this.score} điểm`
        };
    }

    /**
     * Hiệu ứng khi thẻ bị giết bởi vũ khí
     * @param {CharacterManager} characterManager - Manager quản lý character (optional)
     * @returns {Object|null} Thông tin kết quả hoặc null
     */
    killByWeaponEffect(characterManager = null, cardManager = null) {
        // Chỉ có hiệu ứng khi shield = 1
        if (this.shield === 1) {
            // Tạo thẻ AbyssLector0 mới với HP ngẫu nhiên và shield = 0
            const newAbyssLector = new AbyssLector0();
            newAbyssLector.hp = this.GetRandom(1, 3); // HP từ 1-3
            newAbyssLector.shield = 0; // Không có shield
            newAbyssLector.id = this.id;
            newAbyssLector.position = { 
                            row: Math.floor(this.id / 3), 
                            col: this.id % 3 
                        };
            cardManager.updateCard(this.id, newAbyssLector);

            return {
                type: 'enemy_killed_by_weapon',
                reward: {
                    type: 'abysslector',
                    card: newAbyssLector,
                    effect: `Tạo AbyssLector0 mới - HP: ${newAbyssLector.hp}`
                }
            };
        } else {
            const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);

            coinCard.id = this.id;
            coinCard.position = {
                row: Math.floor(this.id / 3),
                col: this.id % 3
            };
            cardManager.updateCard(this.id, coinCard);

            return {
                type: 'enemy_killed_by_weapon',
                reward: {
                    type: 'Coin',
                    effect: `${this.name} bị giết! Nhận được coin`
                }
            };
        }
        
        // Nếu shield = 0 thì trả về null để tạo coin như bình thường
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Học sĩ vực sâu với khả năng tạo ra ngọn lửa uyên ảo. Khi bị tiêu diệt, hắn sẽ tái sinh với sức mạnh yếu hơn nhưng vẫn nguy hiểm.</i>`,
            hp: this.hp
        };
    }
} 
