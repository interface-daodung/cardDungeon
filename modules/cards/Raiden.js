// Raiden.js - Thẻ nhân vật Raiden
// Chức năng: Nhân vật người chơi điều khiển

class Raiden extends Card {
    // Giá trị mặc định cho Raiden
    static DEFAULT_HP = 11;
    static DEFAULT_ELEMENT_COIN = 3;
    
    constructor() {
        super(
            "Raiden", 
            "character", 
            "resources/raiden.webp", 
            "raiden"
        );
        this.hp = Raiden.DEFAULT_HP; // HP ban đầu từ Raiden
        this.elementCoin = Raiden.DEFAULT_ELEMENT_COIN; // Element coin từ Raiden
        this.weapon = 0; // Độ bền vũ khí
        this.weaponName = null; // Tên vũ khí
        this.storyText = "Raiden Shogun, vị thần Electro của Inazuma, còn được gọi là 'Baal' hay 'Beelzebul'. Là vị thần cai trị nghiêm khắc, cô đã áp dụng chính sách 'Vision Hunt Decree' để thu thập Vision của người dân. Với sức mạnh điện năng khổng lồ, Raiden có thể tạo ra những tia sét hủy diệt và điều khiển thời gian. Sau khi nhận ra sai lầm, cô đã thay đổi cách cai trị để bảo vệ Inazuma tốt hơn.";
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
        // Raiden không bao giờ bị ăn
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        let description = `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}/11</span>`;
        
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
