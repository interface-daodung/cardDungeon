// Sword2.js - Thẻ vũ khí loại 2
// Chức năng: Vũ khí cho character

class Sword2 extends Card {
    constructor() {
        super(
            "Sword2", 
            "weapon", 
            "resources/sword2.webp", 
            "Vũ khí loại 2"
        );
        this.durability = Math.floor(Math.random() * 16) + 1; // Độ bền 1-16
        this.score = 3; // Điểm khi thu thập
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
        characterManager.addWeaponToCharacter(this.durability, this.name);
        
        return {
            score: 0, // Vũ khí không tăng điểm
            type: this.type,
            durability: this.durability,
            effect: `Character nhận vũ khí với độ bền ${this.durability}`
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
            description: `Vũ khí cấp 2 - Độ bền ${this.durability}`,
            durability: this.durability
        };
    }
} 
