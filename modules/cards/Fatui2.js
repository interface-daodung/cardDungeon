// Fatui2.js - Thẻ quái vật Fatui loại 2
// Chức năng: Quái vật mạnh hơn

class Fatui2 extends Card {
    constructor() {
        super(
            "Fatui - Thiếu Nữ Kính", 
            "enemy", 
            "resources/fatui2.webp", 
            "Fatui loại 2"
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
            description: `Quái vật Fatui mạnh - HP: ${this.hp}`,
            hp: this.hp
        };
    }
} 
