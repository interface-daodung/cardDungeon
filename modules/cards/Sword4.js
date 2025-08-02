// Sword4.js - Thẻ vũ khí loại 4
// Chức năng: Vũ khí cho character

class Sword4 extends Card {
    constructor() {
        super(
            "Quyền Trượng Thủy Thần", 
            "weapon", 
            "resources/sword4.webp", 
            "Quyền Trượng Thủy Thần"
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
     * Hiệu ứng khi vũ khí được bán
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns {Object} Thông tin kết quả
     */
    sellWeaponEffect(characterManager, gameState) {
        console.log(`💰 Sword4 sellWeaponEffect: Kích hoạt hiệu ứng bán gấp đôi`);
        
        // Lấy độ bền còn lại
        const currentDurability = this.durability;
        const doubleDurability = currentDurability * 2;
        
        console.log(`💰 Sword4 sellWeaponEffect: Độ bền ${currentDurability} -> Nhận ${doubleDurability} coin`);
        
        return {
            type: 'weapon_sell_effect',
            effect: `Bán vũ khí với giá gấp đôi (${currentDurability} -> ${doubleDurability})`,
            originalDurability: currentDurability,
            sellValue: doubleDurability
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
            description: `Vũ khí này có vẻ rất đáng tiền - Độ bền ${this.durability} - Bán với giá gấp đôi`,
            durability: this.durability
        };
    }
} 
