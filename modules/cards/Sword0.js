// Sword0.js - Thẻ vũ khí cơ bản
// Chức năng: Cung cấp vũ khí với độ bền thấp

class Sword0 extends Card {
    constructor() {
        super(
            "Sword0", 
            "weapon", 
            "resources/sword0.webp", 
            "Vũ khí cơ bản"
        );
        this.durability = Math.floor(Math.random() * 16) + 1; // Độ bền 1-16
        this.score = 1; // Điểm khi thu thập
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        console.log(`⚔ Sword0.cardEffect: Bắt đầu với độ bền ${this.durability}`);
        
        // Thêm vũ khí cho character
        characterManager.addWeaponToCharacter(this.durability, this.name);
        
        const result = {
            score: 0, // Vũ khí không tăng điểm
            type: this.type,
            durability: this.durability,
            effect: `Character nhận vũ khí với độ bền ${this.durability}`
        };
        
        console.log(`⚔ Sword0.cardEffect: Kết quả:`, result);
        return result;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `Thẻ vũ khí cơ bản - Độ bền: ${this.durability}`,
            durability: this.durability
        };
    }
} 
