// Food1.js -  Thẻ thức ăn Bánh Khoai Tây Mondstadt 
// Chức năng: Thức ăn hồi phục HP

class Food1 extends Card {
    constructor() {
        super(
            "Bánh Khoai Tây", 
            "food", 
            "resources/food1.webp", 
            "food1"
        );
        this.heal = this.GetRandom(3, 6); // Hồi phục 3-9 HP
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns {Object} Thông tin kết quả
     */
    cardEffect(characterManager = null, gameState = null, cardManager = null) {
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
            description: `<strong>${this.type}</strong> - Heal: <span class="heal-text">+${this.heal}</span><br><i>Bánh Khoai Tây là món ăn phổ biến của Mondstadt. Không chỉ hồi phục sức khỏe mà còn có khả năng loại bỏ độc tố khỏi cơ thể.</i>`,
            heal: this.heal
        };
    }
} 

