// Sword6.js - Thẻ vũ khí loại 6
// Chức năng: Vũ khí cho character

class Sword6 extends Card {
    constructor() {
        super(
            "Kiếm Tế Lễ", 
            "weapon", 
            "resources/sword6.webp", 
            "sword6"
        );
        this.durability = this.GetRandom(6, 12); // Độ bền 1-16
        this.blessed = 'Mystic Heaven';//✨ 🔆 🌀 👁️ 
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
            description: `<strong>${this.type}</strong> - Durability: <span class="durability-text">${this.durability}</span><br><i>Kiếm Tế Lễ là vũ khí thiêng liêng được sử dụng trong các nghi lễ cổ xưa. Nó mang theo chúc phúc của Huyền Thiên và sức mạnh bảo vệ.</i>`,
            durability: this.durability
        };
    }
} 
