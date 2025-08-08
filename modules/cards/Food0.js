// Food0.js - Thẻ thức ăn cơ bản Gà Nấu Hoa Ngọt 
// Chức năng: Hồi phục HP ngay lập tức

class Food0 extends Card {
    constructor() {
        super(
            "Gà Nấu Hoa Ngọt", 
            "food", 
            "resources/food0.webp", 
            "food0"
        );
        this.heal = this.GetRandom(1, 9); // Hồi phục 1-6 HP
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns {Object} Thông tin kết quả
     */
    cardEffect(characterManager = null, gameState = null, cardManager = null) {
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
            description: `<strong>${this.type}</strong> - Heal: <span class="heal-text">+${this.heal}</span><br><i>Gà Nấu Hoa Ngọt là món ăn truyền thống được chế biến từ thịt gà và các loại gia vị thơm ngon. Món ăn này có khả năng hồi phục sức khỏe ngay lập tức.</i>`,
            heal: this.heal
        };
    }
} 
