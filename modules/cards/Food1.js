// Food1.js -  B�nh Khoai T�y Mondstadt 
// Ch?c nang: Th?c an h?i ph?c HP

class Food1 extends Card {
    constructor() {
        super(
            "Bánh Khoai Tây", 
            "food", 
            "resources/food1.webp", 
            "Th?c an lo?i 1",
            "food1"
        );
        this.heal = Math.floor(Math.random() * 7) + 3; // H?i ph?c 3-9 HP
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
            description: `<strong>${this.type}</strong> - Heal: <span class="heal-text">+${this.heal}</span><br><i>Bánh Khoai Tây là món ăn phổ biến của Mondstadt. Không chỉ hồi phục sức khỏe mà còn có khả năng loại bỏ độc tố khỏi cơ thể.</i>`,
            heal: this.heal
        };
    }
} 

