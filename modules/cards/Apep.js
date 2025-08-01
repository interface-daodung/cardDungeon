// Apep.js - Thẻ quái vật Apep
// Chức năng: Boss quái vật mạnh

class Apep extends Card {
    constructor() {
        super(
            "Kẻ Thủ Hộ Của Ốc Đảo Apep", 
            "enemy", 
            "resources/apep.webp", 
            "Apep"
        );
        this.hp = Math.floor(Math.random() * 7) + 3; // HP từ 3-9
        this.score = Math.floor(Math.random() * 9) + 1; // Điểm từ 1-9
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        // Boss gây sát thương cho character
        characterManager.updateCharacterHP(this.hp);
        
        // Cộng điểm khi ăn enemy
        gameState.addScore(this.score);
        
        return {
            type: 'enemy',
            hp: this.hp,
            score: score,
            effect: `Character bị mất ${this.hp} HP, nhận ${score} điểm`
        };
    }

    /**
     * Hiệu ứng khi thẻ bị giết bởi vũ khí
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    killByWeaponEffect(characterManager, gameState) {
        // Apep khi bị giết bởi vũ khí sẽ tạo ra thẻ Food3 cố định
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
            description: `${this.name} - HP: ${this.hp}`,
            hp: this.hp
        };
    }
} 
