// Catalyst2.js - Thẻ catalyst loại 2
// Chức năng: Thẻ catalyst cho điểm số

class Catalyst2 extends Card {
    constructor() {
        super(
            "Quản Đốc Vàng Ròng", 
            "weapon", 
            "resources/catalyst2.webp", 
            "catalyst2"
        );
        this.durability = this.GetRandom(6, 12); // Độ bền 1-16
        this.score = 4; // Điểm số nhận được
        this.blessed = 'Ocean';
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager = null, gameState = null, cardManager = null) {
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
            description: `<strong>${this.type}</strong> - Durability: <span class="durability-text">${this.durability}</span><br><i>Quản Đốc Vàng Ròng là thiết bị ma thuật lơ lửng có khả năng giám sát các dòng hải lưu. Được ban phước bởi sức mạnh của biển cả.</i>`,
            durability: this.durability
        };
    }
} 
