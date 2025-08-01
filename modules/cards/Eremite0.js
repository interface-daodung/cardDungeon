// Eremite0.js - Thẻ quái vật Eremite loại 0
// Chức năng: Quái vật Eremite

class Eremite0 extends Card {
    constructor() {
        super(
            "Eremite - Diệp Luân Vũ Giả", 
            "enemy", 
            "resources/eremite0.webp", 
            "Eremite loại 0"
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
            description: `Quái vật Eremite - HP: ${this.hp}`,
            hp: this.hp
        };
    }
} 
