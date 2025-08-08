// Poison.js - Thẻ chất độc
// Chức năng: Thẻ chất độc gây hại cho người chơi

class Poison extends Card {
    constructor() {
        super(
            "Súp Huyền Bí", 
            "food", 
            "resources/poison.webp", 
            "poison"
        );
        this.poisonDuration = this.GetRandom(3, 12); // Độc kéo dài 2-10 lượt
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
            description: `<strong>${this.type}</strong> - Poison: <span class="poison-text">${this.poisonDuration}</span><br><i>Súp Huyền Bí là món ăn độc hại được chế biến từ các nguyên liệu bí ẩn. Khi ăn sẽ bị nhiễm độc và mất HP dần dần.</i>`,
            poisonDuration: this.poisonDuration
        };
    }
} 
