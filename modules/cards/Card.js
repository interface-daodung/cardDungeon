// Card.js - Class co ban cho tat ca cac thẻ
// Chuc nang: dinh nghia interface va thuoc tinh chung cho tat ca thẻ

class Card {
    /**
     * Khoi tao thẻ co ban
     * @param {string} name - Ten thẻ
     * @param {string} type - Loai thẻ (enemy, food, sword, coin, character)
     * @param {string} image - Duong dan hinh anh
     * @param {string} description - Mo ta thẻ
     * @param {string} nameId - Ten cua image file (khong co extension)
     */
    constructor(name, type, image, description, nameId) {
        this.name = name;
        this.type = type;
        this.image = image;
        this.description = description;
        this.nameId = nameId; // Fix cung nameId thay và tính toán
        this.id = null; // So duoc set boi CardManager
        this.position = null; // So duoc set boi CardManager
    }

    /**
     * Hieu ung khi thẻ bị an
     * @param {CharacterManager} characterManager - Manager quan ly character
     * @param {GameState} gameState - Manager quan ly game state
     * @param {CardManager} cardManager - Manager quan ly thẻ (optional)
     * @returns {Object|null} Thong tin ket qua hoac null
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Override trong cac class con
        return null;
    }

    /**
     * Hieu ung khi thẻ bị giết bởi vu kho
     * @param {CharacterManager} characterManager - Manager quan ly character (optional)
     * @returns {Object|null} Thong tin ket qua hoac null
     */
    killByWeaponEffect(characterManager = null) {
        // Override trong cac class enemy
        return null;
    }

    /**
     * Hieu ung khi thẻ nhận damage
     * @param {CharacterManager} characterManager - Manager quan ly character
     * @param {number} damage - So damage nhan duoc
     * @param {string} damageType - Loai damage (physical, elemental, etc.)
     * @param {GameState} gameState - Manager quan ly game state (optional)
     * @returns {Object|null} Thong tin ket qua hoac null
     */
    takeDamageEffect(characterManager, damage, damageType = 'physical', gameState = null) {
        // Override trong cac class con de xu ly damage
        return {
            damage: damage,
            damageType: damageType,
            absorbed: false,
            reflected: false,
            resisted: false,
            critical: false,
            message: `${this.name} nhan ${damage} damage ${damageType}`
        };
    }

    /**
     * Lay thong tin hien thi cho dialog
     * @returns {Object} Thong tin de hien thi
     */
    getDisplayInfo() {
        return {
            name: this.name,
            type: this.type,
            image: this.image,
            description: this.description,
            nameId: this.nameId
        };
    }
    
} 
