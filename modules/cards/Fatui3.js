// Fatui3.js - Thẻ quái vật Fatui loại 3
// Chức năng: Quái vật rất mạnh

class Fatui3 extends Card {
    constructor() {
        super(
            "Fatui - Thuật Sĩ Cicin Băng", 
            "enemy", 
            "resources/fatui3.webp", 
            "fatui3"
        );
        this.hp = this.GetRandom(1, 9); // HP từ 1-9
        this.score = this.GetRandom(1, 9); // Điểm khi tiêu diệt
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
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Thuật Sĩ Cicin Băng là thành viên tinh nhuệ của Fatui. Sử dụng ma thuật băng để đóng băng kẻ địch và tạo ra những cơn bão tuyết khủng khiếp.</i>`,
            hp: this.hp
        };
    }
} 
