// Eremite0.js - Thẻ quái vật Eremite loại 0
// Chức năng: Quái vật Eremite

class Eremite0 extends Card {
    constructor() {
        super(
            "Eremite - Diệp Luân Vũ Giả", 
            "enemy", 
            "resources/eremite0.webp", 
            "eremite0"
        );
        this.hp = this.GetRandom(6, 12); // HP của quái vật
        this.score = this.GetRandom(3, 9); // Điểm khi tiêu diệt
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
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Diệp Luân Vũ Giả là chiến binh sa mạc của bộ tộc Eremite. Sử dụng vũ khí cánh quạt để tấn công với tốc độ cao và sự linh hoạt.</i>`,
            hp: this.hp
        };
    }
} 
