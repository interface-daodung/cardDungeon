// Operative.js - Thẻ quái vật Operative
// Chức năng: Quái vật Operative

class Operative extends Card {
    constructor() {
        super(
            "Fatui - Đặc Vụ Băng", 
            "enemy", 
            "resources/operative.webp", 
            "Operative"
        );
        this.hp = Math.floor(Math.random() * 9) + 1; // HP từ 1-9
        this.score = Math.floor(Math.random() * 9) + 1; // Điểm khi tiêu diệt
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
            description: `Quái vật Operative - HP: ${this.hp}`,
            hp: this.hp
        };
    }
} 
