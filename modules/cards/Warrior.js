// Warrior.js - Thẻ nhân vật chính
// Chức năng: Nhân vật người chơi điều khiển

class Warrior extends Card {
    // Giá trị mặc định cho Warrior
    static DEFAULT_HP = 10;
    static DEFAULT_ELEMENT_COIN = 1;
    
    constructor() {
        super(
            "Kamisato Ayato", 
            "character", 
            "resources/warrior.webp", 
            "Nhân vật chính"
        );
        this.hp = Warrior.DEFAULT_HP; // HP ban đầu từ Warrior
        this.weapon = 0; // Độ bền vũ khí
        this.weaponName = null; // Tên vũ khí
        this.elementCoin = Warrior.DEFAULT_ELEMENT_COIN; // Element coin từ Warrior
    }

    /**
     * Hiệu ứng khi thẻ bị ăn (không bao giờ xảy ra)
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        // Warrior không bao giờ bị ăn
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        let description = `<strong>Warrior</strong> - HP: <span class="hp-text">${this.hp}/10</span>`;
        
        // Thêm thông tin vũ khí nếu có
        if (this.weapon > 0 && this.weaponName) {
            description += `<br><strong>${this.weaponName}</strong> - Độ bền: <span class="durability-text">${this.weapon}</span>`;
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
        this.weapon = characterManager.getCharacterWeapon();
        this.weaponName = characterManager.getCharacterWeaponName();
        this.elementCoin = characterManager.getCharacterElementCoin();
        this.recovery = characterManager.getRecovery();
        this.poisoned = characterManager.getPoisoned();
    }
} 
