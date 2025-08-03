// Food3.js - Th? th?c an lo?i 3
// Ch?c nang: Th?c an h?i ph?c HP

class Food3 extends Card {
    constructor() {
        super(
            "Sinh Mệnh Sinh Sôi", 
            "food", 
            "resources/food3.webp", 
            "Th?c an lo?i 3",
            "food3"
        );
        this.heal = Math.floor(Math.random() * 9) + 1; // H?i ph?c 1-9 HP
    }

    /**
     * Hi?u ?ng khi th? b? an
     * @param {CharacterManager} characterManager - Manager qu?n l� character
     * @param {GameState} gameState - Manager qu?n l� game state
     * @returns {Object} Th�ng tin k?t qu?
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // H?i ph?c HP cho character
        characterManager.healCharacterHP(this.heal);
        // lo?i b? d?c
        const currentPoison = characterManager.getPoisoned();
        if (currentPoison > 0) {
            characterManager.setPoisoned(0); // Lo?i b? d?c
        }
        return {
            type: 'food',
            heal: this.heal,
            message: `H?i ph?c ${this.heal} HP!`
        };
    }

    /**
     * L?y th�ng tin hi?n th? cho dialog
     * @returns {Object} Th�ng tin d? hi?n th?
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
