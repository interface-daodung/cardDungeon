// Food3.js - Thẻ thức ăn Sinh Mệnh Sinh Sôi
// Chức năng: Thức ăn hồi phục HP

class Food3 extends Card {
    constructor() {
        super(
            "Sinh Mệnh Sinh Sôi", 
            "food", 
            "resources/food3.webp", 
            "food3"
        );
        this.heal = this.GetRandom(6, 9); // Hồi phục 1-9 HP
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
        // Loại bỏ độc
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
            description: `<strong>${this.type}</strong> - Heal: <span class="heal-text">+${this.heal}</span><br><i>Sinh Mệnh Sinh Sôi là món ăn thần kỳ được chế biến từ các nguyên liệu quý hiếm. Có khả năng hồi phục sức khỏe và loại bỏ độc tố.</i>`,
            heal: this.heal
        };
    }
} 
