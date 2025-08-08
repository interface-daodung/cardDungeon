// Sword5.js - Thẻ vũ khí loại 5
// Chức năng: Vũ khí cho character

class Sword5 extends Card {
    constructor() {
        super(
            "Kiếm Hút Máu", 
            "weapon", 
            "resources/sword5.webp", 
            "sword5"
        );
        this.durability = this.GetRandom(6, 16); // Độ bền 1-16
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @returns {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        // Thêm vũ khí cho character (truyền object để có thể gọi attackWeaponEffect)
        characterManager.addWeaponToCharacter(this);
        
        return {
            score: 0, // Vũ khí không tăng điểm
            type: this.type,
            durability: this.durability,
            effect: `Character nhận vũ khí với độ bền ${this.durability}`
        };
    }

    /**
     * Hiệu ứng khi vũ khí được sử dụng để tấn công
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {number} damageDealt - Lượng damage đã gây ra
     * @returns {Object} Thông tin kết quả
     */
    attackWeaponEffect(characterManager, gameState, damageDealt) {
        
        // Hồi phục HP bằng lượng damage gây ra
        const oldHP = characterManager.getCharacterHP();
        characterManager.healCharacterHP(damageDealt);
        const newHP = characterManager.getCharacterHP();
        
        
        return {
            type: 'weapon_attack_effect',
            effect: `Hồi phục ${damageDealt} HP sau khi tấn công`,
            hpGained: newHP - oldHP,
            damageDealt: damageDealt
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
            description: `<strong>${this.type}</strong> - Durability: <span class="durability-text">${this.durability}</span><br><i>Kiếm Hút Máu là vũ khí ma thuật có khả năng hấp thụ sinh lực từ kẻ địch. Mỗi khi gây sát thương, nó sẽ hồi phục HP cho người sử dụng.</i>`,
            durability: this.durability
        };
    }
} 
