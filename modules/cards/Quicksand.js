// Quicksand.js - Th? c�t l�n
// Ch?c nang: Th? c�t l�n g�y h?i cho ngu?i choi

class Quicksand extends Card {
    constructor() {
        super(
            "Quicksand", 
            "trap", 
            "resources/quicksand.webp", 
            "quicksand"
        );
        this.damage = 2; // S�t thuong c?a c�t l�n
    }

    /**
     * Hi?u ?ng khi th? b? an
     * @param {CharacterManager} characterManager - Manager qu?n l� character
     * @param {GameState} gameState - Manager qu?n l� game state
     * @param {CardManager} cardManager - Manager qu?n l� th?
     * @returns {Object} Th�ng tin k?t qu?
     */
    cardEffect(characterManager, gameState, cardManager) {
        return {
            type: 'trap',
            message: `Cát lún! Tất cả thể bị dịch chuyển!`,
            shuffleEffect: true
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
            description: `<strong>${this.type}</strong> - Effect: <span class="effect-text">Shuffle</span><br><i>Cát Lún là bẫy nguy hiểm ẩn dưới bề mặt sa mạc. Khi kích hoạt, nó sẽ làm xáo trộn tất cả các thẻ trên bàn chơi.</i>`,
            effect: "Shuffle"
        };
    }
} 
