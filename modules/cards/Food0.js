// Food0.js - Thẻ thức ăn cơ bản Gà Nấu Hoa Ngọt 
// Chức năng: Hồi phục HP ngay lập tức

class Food0 extends Card {
    constructor() {
        super(
            "Gà Nấu Hoa Ngọt", 
            "food", 
            "resources/food0.webp", 
            "Thức ăn hồi phục cơ bản"
        );
        this.heal = Math.floor(Math.random() * 6) + 1; // Hồi phục 1-6 HP
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Hồi phục HP ngay lập tức
        characterManager.healCharacterHP(this.heal);
        
        return {
            score: 0, // Food không tăng điểm
            type: this.type,
            heal: this.heal,
            effect: `Character hồi phục ${this.heal} HP`
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
            description: `${this.name} - HP: +${this.heal}`,
            heal: this.heal
        };
    }
} 