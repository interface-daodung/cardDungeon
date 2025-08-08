// Apep.js - Thẻ quái vật Apep
// Chức năng: Boss quái vật mạnh

class Apep extends Card {
    constructor() {
        super(
            "Kẻ Thủ Hộ Của Ốc Đảo Apep", 
            "enemy", 
            "resources/apep.webp", 
            "apep"
        );
        this.hp = this.GetRandom(3, 9); // HP từ 3-9
        this.score = this.GetRandom(1, 9); // Điểm từ 1-9
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager = null, gameState = null, cardManager = null) {
        // Boss gây sát thương cho character
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
     * @returns {Object} Thông tin kết quả
     */
    killByWeaponEffect(characterManager = null, cardManager = null) {
        // Apep khi bị giết bởi vũ khí sẽ tạo ra thẻ Food3 cố định

        const foodCard = cardManager.cardFactory.createCard('Food3');
                        foodCard.id = this.id;
                        foodCard.position = { 
                            row: Math.floor(this.id / 3), 
                            col: this.id % 3 
                        };
                        cardManager.updateCard(this.id, foodCard);

        return {
            type: 'enemy_killed_by_weapon',
            reward: {
                type: 'food3',
                cardName: 'Food3',
                effect: `Apep bị giết! Nhận được thẻ Food3`
            }
        };
    }



    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Kẻ Thủ Hộ Của Ốc Đảo Apep là boss quái vật mạnh mẽ. Khi bị tiêu diệt bằng vũ khí, nó sẽ để lại một món ăn quý hiếm.</i>`,
            hp: this.hp
        };
    }
} 
