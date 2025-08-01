// Food1.js -  Bánh Khoai Tây Mondstadt 
// Chức năng: Thức ăn hồi phục HP

class Food1 extends Card {
    constructor() {
        super(
            "Bánh Khoai Tây", 
            "food", 
            "resources/food1.webp", 
            "Thức ăn loại 1"
        );
        this.heal = Math.floor(Math.random() * 7) + 3; // Hồi phục 3-9 HP
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

