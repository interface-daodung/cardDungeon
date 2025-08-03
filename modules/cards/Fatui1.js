// Fatui1.js - Thẻ quái vật Fatui1
// Chức năng: Quái vật mạnh hơn với HP cao hơn

class Fatui1 extends Card {
    constructor() {
        super(
            "Fatui - Người Xử Lý Nợ Hỏa", 
            "enemy", 
            "resources/fatui1.webp", 
            "Quái vật Fatui mạnh",
            "fatui1"
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
        // Character bị mất HP bằng với HP của quái vật
        characterManager.damageCharacterHP(this.hp);
        
        // Cộng điểm khi ăn enemy
        gameState.addScore(this.score);
        
        return {
            score: this.score,
            type: this.type,
            hp: this.hp,
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
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Người Xử Lý Nợ Hỏa là chiến binh tinh nhuệ của Fatui. Chuyên về các nhiệm vụ thu hồi nợ và sử dụng sức mạnh hỏa nguyên tố để đe dọa.</i>`,
            hp: this.hp
        };
    }
} 
