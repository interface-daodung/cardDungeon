// Mavuika.js - Thẻ nhân vật Mavuika
// Chức năng: Nhân vật người chơi điều khiển

class Mavuika extends Card {
    // Giá trị mặc định cho Mavuika
    static DEFAULT_HP = 13;
    static DEFAULT_ELEMENT_COIN = 2;
    
    constructor() {
        super(
            "Mavuika", 
            "character", 
            "resources/mavuika.webp", 
            "mavuika"
        );
        this.hp = Mavuika.DEFAULT_HP; // HP ban đầu từ Mavuika
        this.elementCoin = Mavuika.DEFAULT_ELEMENT_COIN; // Element coin từ Mavuika
        this.weapon = 0; // Độ bền vũ khí
        this.weaponName = null; // Tên vũ khí
        this.storyText = "Mavuika, vị thần Pyro bí ẩn của Natlan, được biết đến với biệt danh 'Murata'. Là một trong những vị thần chiến binh mạnh mẽ nhất, cô sở hữu sức mạnh lửa hủy diệt và khả năng chiến đấu xuất chúng. Mavuika đại diện cho sự dũng cảm và nhiệt huyết, luôn sẵn sàng chiến đấu vì lý tưởng của mình. Với tính cách nóng nảy nhưng chính trực, cô là nguồn cảm hứng cho những chiến binh Natlan.";
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
        // Mavuika không bao giờ bị ăn
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        let description = `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}/13</span>`;
        
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
