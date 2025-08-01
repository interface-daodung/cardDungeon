// Poison.js - Thẻ chất độc
// Chức năng: Thẻ chất độc gây hại cho người chơi

class Poison extends Card {
    constructor() {
        super(
            "Súp Huyền Bí", 
            "food", 
            "resources/poison.webp", 
            "Chất độc"
        );
        this.poisonDuration = Math.floor(Math.random() * 9) + 2; // Độc kéo dài 2-10 lượt
        this.heal = this.poisonDuration;  
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        // Thêm chất độc vào character
        characterManager.setPoisoned(this.poisonDuration);
        
        return {
            type: 'poison',
            poisonDuration: this.poisonDuration,
            message: `Bị nhiễm độc! Mất 1 HP và sẽ mất 1 HP mỗi lượt trong ${this.poisonDuration} lượt!`
        };
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin độc hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `Chất độc nguy hiểm - Gây độc trong ${this.poisonDuration} lượt`,
            poisonDuration: this.poisonDuration
        };
    }
} 
