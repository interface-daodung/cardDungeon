// Catalyst0.js - Thẻ catalyst loại 0
// Chức năng: Thẻ catalyst cho điểm số

class Catalyst0 extends Card {
    constructor() {
        super(
            "Quả Ước Nguyện", 
            "weapon", 
            "resources/catalyst0.webp", 
            "Catalyst loại 0"
        );
        this.durability = Math.floor(Math.random() * 16) + 1; // độ bền 1-16
        this.score = 2; // điểm số nhận được
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        // Thêm vũ khí cho character
        characterManager.addWeaponToCharacter(this);
        
        return {
            score: 0, // Vũ khí không tăng điểm
            type: this.type,
            durability: this.durability,
            effect: `Character nhận catalyst với độ bền ${this.durability}`
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
            description: `Pháp khí này có được Chúc Phúc Của Rừng. Độ bền: ${this.durability}`,
            durability: this.durability
        };
    }
} 
