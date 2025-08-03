// Food0.js - Th? th?c an co b?n G� N?u Hoa Ng?t 
// Ch?c nang: H?i ph?c HP ngay l?p t?c

class Food0 extends Card {
    constructor() {
        super(
            "Gà Nấu Hoa Ngọt", 
            "food", 
            "resources/food0.webp", 
            "Th?c an h?i ph?c co b?n",
            "food0"
        );
        this.heal = Math.floor(Math.random() * 6) + 1; // H?i ph?c 1-6 HP
    }

    /**
     * Hi?u ?ng khi th? b? an
     * @param {CharacterManager} characterManager - Manager qu?n l� character
     * @param {GameState} gameState - Manager qu?n l� game state
     * @returns {Object} Th�ng tin k?t qu?
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // H?i ph?c HP ngay l?p t?c
        characterManager.healCharacterHP(this.heal);
        
        return {
            score: 0, // Food kh�ng tang di?m
            type: this.type,
            heal: this.heal,
            effect: `Character h?i ph?c ${this.heal} HP`
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
            description: `<strong>${this.type}</strong> - Heal: <span class="heal-text">+${this.heal}</span><br><i>Gà Nấu Hoa Ngọt là món ăn truyền thống được chế biến từ thịt gà và các loại gia vị thơm ngon. Món ăn này có khả năng hồi phục sức khỏe ngay lập tức.</i>`,
            heal: this.heal
        };
    }
} 
