// Nahida.js - Thẻ nhân vật Nahida
// Chức năng: Nhân vật người chơi điều khiển

class Nahida extends Card {
    // Giá trị mặc định cho Nahida
    static DEFAULT_HP = 8;
    static DEFAULT_ELEMENT_COIN = 6;
    
    constructor() {
        super(
            "Nahida", 
            "character", 
            "resources/nahida.webp", 
            "nahida"
        );
        this.hp = Nahida.DEFAULT_HP; // HP ban đầu từ Nahida
        this.elementCoin = Nahida.DEFAULT_ELEMENT_COIN; // Element coin từ Nahida
        this.weapon = 0; // Độ bền vũ khí
        this.weaponName = null; // Tên vũ khí
        this.storyText = "Nahida, vị thần Dendro trẻ tuổi của Sumeru, còn được gọi là 'Lesser Lord Kusanali'. Dù bị giam cầm trong 500 năm, cô vẫn giữ được sự tò mò và lòng tốt thuần khiết. Với khả năng điều khiển tri thức và sức mạnh nguyên tố Dendro, Nahida có thể tạo ra những ảo ảnh phức tạp và điều khiển các yếu tố tự nhiên. Cô đại diện cho sự khôn ngoan và hy vọng của Sumeru.";
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
        // Nahida không bao giờ bị ăn
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        let description = `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}/8</span>`;
        
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
