// Furina.js - Thẻ nhân vật Furina
// Chức năng: Nhân vật người chơi điều khiển

class Furina extends Card {
    // Giá trị mặc định cho Furina
    static DEFAULT_HP = 10;
    static DEFAULT_ELEMENT_COIN = 1;
    
    constructor() {
        super(
            "Furina", 
            "character", 
            "resources/furina.webp", 
            "furina"
        );
        this.hp = Furina.DEFAULT_HP; // HP ban đầu từ Furina
        this.elementCoin = Furina.DEFAULT_ELEMENT_COIN; // Element coin từ Furina
        this.weapon = 0; // Độ bền vũ khí
        this.weaponName = null; // Tên vũ khí
        this.storyText = "Furina, vị thần Hydro của Fontaine, còn được gọi là 'Focalors'. Là một vị thần trẻ tuổi và kiêu hãnh, cô luôn xuất hiện với phong thái tự tin và quyến rũ. Furina sở hữu khả năng điều khiển nước và tạo ra những ảo ảnh phức tạp. Dù bề ngoài có vẻ hời hợt, cô thực sự quan tâm sâu sắc đến người dân Fontaine và luôn tìm cách bảo vệ họ khỏi những mối đe dọa ẩn giấu.";
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
        // Furina không bao giờ bị ăn
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        let description = `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}/10</span>`;
        
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
