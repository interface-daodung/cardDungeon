// Sword2.js - Thẻ vũ khí loại 2
// Chức năng: Vũ khí cho character

class Sword2 extends Card {
    constructor() {
        super(
            "Kiếm Gỗ", 
            "weapon", 
            "resources/sword2.webp", 
            "Vũ khí loại 2",
            "sword2"
        );
        this.durability = Math.floor(Math.random() * 16) + 1; // Độ bền 1-16
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
            description: `<strong>${this.type}</strong> - Durability: <span class="durability-text">${this.durability}</span><br><i>Kiếm Gỗ được chế tạo từ gỗ thiêng của rừng già. Mặc dù đơn giản nhưng nó mang theo chúc phúc của thiên nhiên và sức mạnh bảo vệ.</i>`,
            durability: this.durability
        };
    }
} 
