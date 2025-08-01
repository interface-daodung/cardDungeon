// Quicksand.js - Thẻ cát lún
// Chức năng: Thẻ cát lún gây hại cho người chơi

class Quicksand extends Card {
    constructor() {
        super(
            "Quicksand", 
            "trap", 
            "resources/quicksand.webp", 
            "Cát lún"
        );
        this.damage = 2; // Sát thương của cát lún
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @returns {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        return {
            type: 'trap',
            message: `Cát lún! Tất cả thẻ bị đổi chỗ!`,
            shuffleEffect: true
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
            description: `Cát lún - Đổi chỗ tất cả thẻ`,
            effect: "Shuffle"
        };
    }
} 