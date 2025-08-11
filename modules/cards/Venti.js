// Venti.js - Thẻ nhân vật Venti
// Chức năng: Nhân vật người chơi điều khiển

class Venti extends Card {
    // Giá trị mặc định cho Venti
    static DEFAULT_HP = 9;
    static DEFAULT_ELEMENT_COIN = 5;
    
    constructor() {
        super(
            "Venti", 
            "character", 
            "resources/venti.webp", 
            "venti"
        );
        this.hp = Venti.DEFAULT_HP; // HP ban đầu từ Venti
        this.elementCoin = Venti.DEFAULT_ELEMENT_COIN; // Element coin từ Venti
        this.weapon = 0; // Độ bền vũ khí
        this.weaponName = null; // Tên vũ khí
        this.storyText = "Venti, vị thần Anemo tự do của Mondstadt, còn được gọi là 'Barbatos'. Là một trong những vị thần nguyên thủy, Venti có khả năng điều khiển gió và tạo ra những cơn bão mạnh mẽ. Dù có sức mạnh khổng lồ, ông lại chọn cách sống như một thi sĩ lang thang, thích uống rượu và sáng tác thơ ca. Venti đại diện cho tự do và giấc mơ, luôn bảo vệ Mondstadt khỏi những mối đe dọa bên ngoài.";
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
        // Venti không bao giờ bị ăn
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        let description = `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}/9</span>`;
        
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
