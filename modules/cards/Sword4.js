// Sword4.js - Thẻ vũ khí loại 4
// Chức năng: Vũ khí cho character

class Sword4 extends Card {
    constructor() {
        super(
            "Quyền Trượng Thủy Thần", 
            "weapon", 
            "resources/sword4.webp", 
            "sword4"
        );
        this.durability = this.GetRandom(8, 12); // Độ bền 1-16

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
     * Hiệu ứng khi vũ khí được bán
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns {Object} Thông tin kết quả
     */
    sellWeaponEffect(characterManager, gameState) {

        return {
            type: 'weapon_sold',
            sellValue: this.durability * 2,
            effect: `Character được bán vũ khí với giá ${this.durability * 2}`
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
            description: `<strong>${this.type}</strong> - Durability: <span class="durability-text">${this.durability}</span><br><i>Quyền Trượng Thủy Thần là vũ khí quý hiếm được chế tạo từ kim loại quý. Có thể bán với giá cao gấp đôi độ bền hiện tại.</i>`,
            durability: this.durability
        };
    }
} 
