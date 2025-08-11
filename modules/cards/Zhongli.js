// Zhongli.js - Thẻ nhân vật Zhongli
// Chức năng: Nhân vật người chơi điều khiển

class Zhongli extends Card {
    // Giá trị mặc định cho Zhongli
    static DEFAULT_HP = 15;
    static DEFAULT_ELEMENT_COIN = 4;
    
    constructor() {
        super(
            "Zhongli", 
            "character", 
            "resources/zhongli.webp", 
            "zhongli"
        );
        this.hp = Zhongli.DEFAULT_HP; // HP ban đầu từ Zhongli
        this.elementCoin = Zhongli.DEFAULT_ELEMENT_COIN; // Element coin từ Zhongli
        this.weapon = 0; // Độ bền vũ khí
        this.weaponName = null; // Tên vũ khí
        this.storyText = "Zhongli, vị thần Geo cổ đại của Liyue, còn được gọi là 'Morax' hay 'Rex Lapis'. Với 6000 năm tuổi, ông là một trong những vị thần mạnh mẽ nhất Teyvat. Zhongli sở hữu khả năng điều khiển đá và kim loại, có thể tạo ra những lá chắn bất khả xâm phạm và điều khiển địa hình. Sau khi từ bỏ ngai vàng, ông sống như một người bình thường, sử dụng kiến thức uyên thâm để giúp đỡ người dân Liyue.";
        this.effectText = "đang cập nhật";
    }

    /**
     * Hiệu ứng khi thẻ bị ăn (không bao giờ xảy ra)
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        // Zhongli không bao giờ bị ăn
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        let description = `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}/15</span>`;
        
        // Thêm thông tin vũ khí nếu có
        if (this.weapon > 0 && this.weaponName) {
            description += `<br><strong>${this.weaponName}</strong> - Durability: <span class="durability-text">${this.weapon}</span>`;
        }
        
        // Thêm thông tin recovery nếu có
        if (this.recovery > 0) {
            description += `<br> <strong>Recovery</strong><span class="recovery-icon">💚</span>: <span class="recovery-text">${this.recovery} lượt</span>`;
        }
        
        // Thêm thông tin poisoned nếu có
        if (this.poisoned > 0) {
            description += `<br> <strong>Poisoned</strong><span class="poison-icon">☠</span>: <span class="poison-text">${this.poisoned} lượt</span>`;
        }
        
        return {
            ...baseInfo,
            description: description,
            hp: this.hp,
            weapon: this.weapon,
            weaponName: this.weaponName,
            recovery: this.recovery,
            poisoned: this.poisoned
        };
    }

    /**
     * Cập nhật thông tin từ CharacterManager
     * @param {CharacterManager} characterManager - Manager quản lý character
     */
    updateFromCharacter(characterManager) {
        this.hp = characterManager.getCharacterHP();
        this.weapon = characterManager.getCharacterWeaponDurability();
        this.weaponName = characterManager.getCharacterWeaponName();
        this.elementCoin = characterManager.getCharacterElementCoin();
        this.recovery = characterManager.getRecovery();
        this.poisoned = characterManager.getPoisoned();
    }
}
