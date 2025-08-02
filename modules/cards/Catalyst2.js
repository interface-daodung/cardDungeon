// Catalyst2.js - Thẻ catalyst loại 2
// Chức năng: Thẻ catalyst cho điểm số

class Catalyst2 extends Card {
    constructor() {
        super(
            "Quản Đốc Vàng Ròng", 
            "weapon", 
            "resources/catalyst2.webp", 
            "Catalyst loại 2"
        );
        this.durability = Math.floor(Math.random() * 16) + 1; // Độ bền 1-16
        this.score = 4; // Điểm số nhận được
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
            description: `Thiết bị lơ lửng, có thể giám sát các dòng hải lưu, mang theo chúc phúc của Biển. Độ bền: ${this.durability}`,
            durability: this.durability
        };
    }
} 
