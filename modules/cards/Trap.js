// Trap.js - Thẻ bẫy
// Chức năng: Thẻ bẫy gây hại cho người chơi

class Trap extends Card {
    constructor() {
        super(
            "Trap", 
            "trap", 
            "resources/trap.webp", 
            "Bẫy nguy hiểm"
        );
        this.damage = Math.floor(Math.random() * 6) + 1; // Sát thương của bẫy từ 1-6
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý thẻ (optional)
     * @returns {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Bẫy gây sát thương cho character
        characterManager.updateCharacterHP(this.damage);
        
        return {
            type: 'trap',
            damage: this.damage,
            message: `Bị thương ${this.damage} HP từ bẫy!`
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
            description: `Bẫy nguy hiểm - Gây ${this.damage} sát thương`,
            damage: this.damage
        };
    }
} 