// Food3.js - Thẻ thức ăn loại 3
// Chức năng: Thức ăn hồi phục HP

class Food3 extends Card {
    constructor() {
        super(
            "Sinh Mệnh Sinh Sôi", 
            "food", 
            "resources/food3.webp", 
            "Thức ăn loại 3"
        );
        this.heal = Math.floor(Math.random() * 9) + 1; // Hồi phục 1-9 HP
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Hồi phục HP cho character
        characterManager.healCharacterHP(this.heal);
        // loại bỏ độc
        const currentPoison = characterManager.getPoisoned();
        if (currentPoison > 0) {
            characterManager.setPoisoned(0); // Loại bỏ độc
        }
        return {
            type: 'food',
            heal: this.heal,
            message: `Hồi phục ${this.heal} HP!`
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
            description: `${this.name} - Hồi phục ${this.heal} HP, loại bỏ độc`,
            heal: this.heal
        };
    }
} 