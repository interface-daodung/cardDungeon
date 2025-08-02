// Catalyst1.js - Thẻ catalyst loại 1
// Chức năng: Thẻ catalyst cho điểm số

class Catalyst1 extends Card {
    constructor() {
        super(
            "Mảnh Chương Tế Lễ", 
            "weapon", 
            "resources/catalyst1.webp", 
            "Catalyst loại 1"
        );
        this.durability = Math.floor(Math.random() * 16) + 1; // Độ bền 1-16
        this.score = 3; // Điểm số nhận được
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
            description: `Pháp khí ghi chép lại lời Chúc Phúc Của Huyền Thiên. Độ bền: ${this.durability}`,
            durability: this.durability
        };
    }
} 
