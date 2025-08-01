// CoinUp0.js - Tháº» coin tÄƒng Ä‘iá»ƒm loáº¡i 0
// Chá»©c nÄƒng: Tháº» coin tÄƒng Ä‘iá»ƒm sá»‘

class CoinUp0 extends Card {
    constructor() {
        super(
            "Cá»™ng HÆ°á»Ÿng NguyÃªn Tá»‘: BÄƒng Vá»¥n Vá»¡", 
            "coinUp", 
            "resources/coinUp0.webp", 
            "Coin tÄƒng Ä‘iá»ƒm loáº¡i 0"
        );
        this.score = 2; // Äiá»ƒm sá»‘ nháº­n Ä‘Æ°á»£c
    }

    /**
     * Hiá»‡u á»©ng khi tháº» bá»‹ Äƒn
     * @param {CharacterManager} characterManager - Manager quáº£n lÃ½ character
     * @param {GameState} gameState - Manager quáº£n lÃ½ game state
     * @returns
     * @param {CardManager} cardManager - Manager quáº£n lÃ½ tháº» {Object} ThÃ´ng tin káº¿t quáº£
     */
    cardEffect(characterManager, gameState, cardManager) {
        // ThÃªm Ä‘iá»ƒm sá»‘
        gameState.addScore(this.score);
        
        return {
            type: 'coinUp',
            score: this.score,
            message: `Nháº­n Ä‘Æ°á»£c ${this.score} Ä‘iá»ƒm tá»« coin tÄƒng!`
        };
    }

    /**
     * Láº¥y thÃ´ng tin hiá»ƒn thá»‹ cho dialog
     * @returns {Object} ThÃ´ng tin Ä‘á»ƒ hiá»ƒn thá»‹
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `Coin tÄƒng Ä‘iá»ƒm nhá» - Nháº­n ${this.score} Ä‘iá»ƒm`,
            score: this.score
        };
    }
} 
