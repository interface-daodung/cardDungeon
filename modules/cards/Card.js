// Card.js - Class co b?n cho t?t c? c�c th?
// Ch?c nang: �?nh nghia interface v� thu?c t�nh chung cho t?t c? th?

class Card {
    /**
     * Kh?i t?o th? co b?n
     * @param {string} name - T�n th?
     * @param {string} type - Lo?i th? (enemy, food, sword, coin, character)
     * @param {string} image - �u?ng d?n h�nh ?nh
     * @param {string} description - M� t? th?
     * @param {string} nameId - T�n c?a image file (kh�ng c� extension)
     */
    constructor(name, type, image, description, nameId) {
        this.name = name;
        this.type = type;
        this.image = image;
        this.description = description;
        this.nameId = nameId; // Fix c?ng nameId thay v� t�nh to�n
        this.id = null; // S? du?c set b?i CardManager
        this.position = null; // S? du?c set b?i CardManager
    }

    /**
     * Hi?u ?ng khi th? b? an
     * @param {CharacterManager} characterManager - Manager qu?n l� character
     * @param {GameState} gameState - Manager qu?n l� game state
     * @param {CardManager} cardManager - Manager qu?n l� th? (optional)
     * @returns {Object|null} Th�ng tin k?t qu? ho?c null
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Override trong c�c class con
        return null;
    }

    /**
     * Hi?u ?ng khi th? b? gi?t b?i vu kh�
     * @param {CharacterManager} characterManager - Manager qu?n l� character (optional)
     * @returns {Object|null} Th�ng tin k?t qu? ho?c null
     */
    killByWeaponEffect(characterManager = null) {
        // Override trong c�c class enemy
        return null;
    }

    /**
     * L?y th�ng tin hi?n th? cho dialog
     * @returns {Object} Th�ng tin d? hi?n th?
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
