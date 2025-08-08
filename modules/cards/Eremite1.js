// Eremite1.js - Thẻ quái vật Eremite loại 1
// Chức năng: Quái vật Eremite mạnh

class Eremite1 extends Card {
    constructor() {
        super(
            "Eremite - Người Kể Chuyện Cát Nóng", 
            "enemy", 
            "resources/eremite1.webp", 
            "eremite1"
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
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Người Kể Chuyện Cát Nóng là chiến binh tinh nhuệ của bộ tộc Eremite. Sử dụng ma thuật cát nóng để tạo ra những cơn bão cát và tấn công kẻ địch.</i>`,
            hp: this.hp
        };
    }
} 
