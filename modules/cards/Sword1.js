// Sword1.js - Thẻ vũ khí mạnh
// Chức năng: Cung cấp vũ khí với độ bền cao

class Sword1 extends Card {
    constructor() {
        super(
            "Tây Phong Kiếm", 
            "weapon", 
            "resources/sword1.webp", 
            "Vũ khí mạnh",
            "sword1"
        );
        this.durability = Math.floor(Math.random() * 8) + 10; // Độ bền 10-18

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
            effect: `Character nhận vũ khí mạnh với độ bền ${this.durability}`
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
            description: `<strong>${this.type}</strong> - Durability: <span class="durability-text">${this.durability}</span><br><i>Tây Phong Kiếm là vũ khí nghi thức của Đội Kỵ Sĩ Tây Phong. Sắc bén và nhẹ nhàng, nó là biểu tượng của sự dũng cảm và danh dự.</i>`,
            durability: this.durability
        };
    }
} 
