// Card.js - Class co b?n cho t?t c? các th?
// Ch?c nang: Ð?nh nghia interface và thu?c tính chung cho t?t c? th?

class Card {
    /**
     * Kh?i t?o th? co b?n
     * @param {string} name - Tên th?
     * @param {string} type - Lo?i th? (enemy, food, sword, coin, character)
     * @param {string} image - Ðu?ng d?n hình ?nh
     * @param {string} description - Mô t? th?
     * @param {string} nameId - Tên c?a image file (không có extension)
     */
    constructor(name, type, image, description, nameId) {
        this.name = name;
        this.type = type;
        this.image = image;
        this.description = description;
        this.nameId = nameId; // Fix c?ng nameId thay vì tính toán
        this.id = null; // S? du?c set b?i CardManager
        this.position = null; // S? du?c set b?i CardManager
    }

    /**
     * Hi?u ?ng khi th? b? an
     * @param {CharacterManager} characterManager - Manager qu?n lý character
     * @param {GameState} gameState - Manager qu?n lý game state
     * @param {CardManager} cardManager - Manager qu?n lý th? (optional)
     * @returns {Object|null} Thông tin k?t qu? ho?c null
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Override trong các class con
        return null;
    }

    /**
     * Hi?u ?ng khi th? b? gi?t b?i vu khí
     * @param {CharacterManager} characterManager - Manager qu?n lý character (optional)
     * @returns {Object|null} Thông tin k?t qu? ho?c null
     */
    killByWeaponEffect(characterManager = null) {
        // Override trong các class enemy
        return null;
    }

    /**
     * L?y thông tin hi?n th? cho dialog
     * @returns {Object} Thông tin d? hi?n th?
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
