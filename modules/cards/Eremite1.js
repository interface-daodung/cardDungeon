// Eremite1.js - Thẻ quái vật Eremite loại 1
// Chức năng: Quái vật Eremite mạnh

class Eremite1 extends Card {
    constructor() {
        super(
            "Eremite - Người Kể Chuyện Cát Nóng", 
            "enemy", 
            "resources/eremite1.webp", 
            "Eremite loại 1"
        );
        this.hp = Math.floor(Math.random() * 13) + 4; // HP của quái vật
        this.score = Math.floor(Math.random() * 8) + 3; // Điểm khi tiêu diệt
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        // Quái vật gây sát thương cho character
        characterManager.updateCharacterHP(this.hp);
        
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
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `Quái vật Eremite mạnh - HP: ${this.hp}`,
            hp: this.hp
        };
    }
} 
