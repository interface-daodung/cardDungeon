// Sword5.js - Thẻ vũ khí loại 5
// Chức năng: Vũ khí cho character

class Sword5 extends Card {
    constructor() {
        super(
            "Kiếm Hút Máu", 
            "weapon", 
            "resources/sword5.webp", 
            "Vũ khí loại 5"
        );
        this.durability = Math.floor(Math.random() * 16) + 1; // Độ bền 1-16
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
        console.log(`⚔️ Sword5 attackWeaponEffect: Kích hoạt hiệu ứng hút máu với damage ${damageDealt}`);
        
        // Hồi phục HP bằng lượng damage gây ra
        const oldHP = characterManager.getCharacterHP();
        characterManager.healCharacterHP(damageDealt);
        const newHP = characterManager.getCharacterHP();
        
        console.log(`⚔️ Sword5 attackWeaponEffect: HP ${oldHP} -> ${newHP} (hồi ${damageDealt} HP)`);
        
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
            description: `Vũ khí cấp 5 - Độ bền ${this.durability} - Hồi phục HP bằng lượng damage gây ra`,
            durability: this.durability
        };
    }
} 
