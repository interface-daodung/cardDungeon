// Fatui3.js - Thẻ quái vật Fatui loại 3
// Chức năng: Quái vật rất mạnh

class Fatui3 extends Card {
    constructor() {
        super(
            "Fatui - Thuật Sĩ Cicin Băng", 
            "enemy", 
            "resources/fatui3.webp", 
            "Fatui loại 3"
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
            description: `Quái vật Fatui rất mạnh - HP: ${this.hp}`,
            hp: this.hp
        };
    }
} 
