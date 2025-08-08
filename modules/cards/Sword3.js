// Sword3.js - Thẻ vũ khí loại 3
// Chức năng: Vũ khí cho character

class Sword3 extends Card {
    constructor() {
        super(
            "Dao rọc giấy có lưỡi gãy", 
            "weapon", 
            "resources/sword3.webp", 
            "sword3"
        );
        this.durability = this.GetRandom(6, 12); // Độ bền 1-16
        this.blessed = 'Ocean';//⚓ 🌊 🐋 🐬 🪸 🐚
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
            description: `<strong>${this.type}</strong> - Durability: <span class="durability-text">${this.durability}</span><br><i>Dao rọc giấy với lưỡi gãy, nhưng được ban phước bởi sức mạnh của biển cả. Mặc dù hư hỏng nhưng vẫn có thể sử dụng trong tình huống nguy cấp.</i>`,
            durability: this.durability
        };
    }
} 
