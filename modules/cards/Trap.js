// Trap.js - Th? b?y
// Ch?c nang: Th? b?y g�y h?i cho ngu?i choi

class Trap extends Card {
    constructor() {
        super(
            "Co Quan Phun Lửa", 
            "trap", 
            "resources/trap.webp", 
            "Co Quan Phun Lửa",
            "trap"
        );
        this.damage = Math.floor(Math.random() * 7) + 1; // S�t thuong c?a b?y t? 1-7
        
        // Kh?i t?o thu?c t�nh arrow v?i logic ng?u nhi�n
        this.initializeArrows();
    }
    
    /**
     * Kh?i t?o c�c thu?c t�nh arrow theo t? l? ng?u nhi�n
     */
    initializeArrows() {
        // X�c d?nh s? lu?ng arrow hi?n th?
        const random = Math.random() * 100;
        let arrowCount;
        
        if (random < 50) {
            arrowCount = 2; // 50% c� 2 arrow
        } else if (random < 75) {
            arrowCount = 3; // 25% c� 3 arrow
        } else if (random < 99) {
            arrowCount = 1; // 24% c� 1 arrow
        } else {
            arrowCount = 4; // 1% c� 4 arrow
        }
        
        // T?o m?ng c�c hu?ng c� th?
        const directions = ['arrowTop', 'arrowBottom', 'arrowLeft', 'arrowRight'];
        
        // Kh?i t?o t?t c? arrow = 0
        this.arrowTop = 0;
        this.arrowBottom = 0;
        this.arrowLeft = 0;
        this.arrowRight = 0;
        
        // Random ch?n arrowCount hu?ng d? set = 1
        for (let i = 0; i < arrowCount; i++) {
            const randomIndex = Math.floor(Math.random() * directions.length);
            const direction = directions[randomIndex];
            this[direction] = 1;
            
            // X�a hu?ng d� ch?n d? tr�nh tr�ng l?p
            directions.splice(randomIndex, 1);
        }
    }

    /**
     * Hi?u ?ng khi th? b? an
     * @param {CharacterManager} characterManager - Manager qu?n l� character
     * @param {GameState} gameState - Manager qu?n l� game state
     * @param {CardManager} cardManager - Manager qu?n l� th? (optional)
     * @returns {Object} Th�ng tin k?t qu?
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Ki?m tra xem character c� b? ch? b?i arrow kh�ng
        const characterIndex = cardManager ? cardManager.findCharacterIndex() : null;
        const isCharacterTargeted = this.isCharacterTargetedByArrow(characterIndex, cardManager);
        
        if (isCharacterTargeted) {
            // Character b? ch? b?i arrow - g�y s�t thuong
            //characterManager.damageCharacterHP(this.damage);
            
            return {
                type: 'trap',
                damage: this.damage,
                message: `B? thuong ${this.damage} HP t? b?y!`,
                shouldTriggerAnimation: true,
                characterDamaged: true
            };
        } else {
            // Character kh�ng b? ch? b?i arrow - kh�ng g�y s�t thuong
            return {
                type: 'trap',
                damage: 0,
                message: `B?y kh�ng ho?t d?ng!`,
                shouldTriggerAnimation: true,
                characterDamaged: false
            };
        }
    }
    
    /**
     * Ki?m tra xem character c� b? ch? b?i arrow kh�ng
     * @param {number} characterIndex - Index c?a character
     * @param {CardManager} cardManager - Manager qu?n l� th?
     * @returns {boolean} True n?u character b? ch? b?i arrow
     */
    isCharacterTargetedByArrow(characterIndex, cardManager) {
        if (characterIndex === null || !cardManager) return false;
        
        const characterPos = { row: Math.floor(characterIndex / 3), col: characterIndex % 3 };
        const trapPos = this.position;
        
        // Ki?m tra t?ng hu?ng arrow
        if (this.arrowTop && trapPos.row > characterPos.row && trapPos.col === characterPos.col) {
            return true; // Arrow ch? l�n tr�n v� character ? tr�n trap
        }
        if (this.arrowBottom && trapPos.row < characterPos.row && trapPos.col === characterPos.col) {
            return true; // Arrow ch? xu?ng du?i v� character ? du?i trap
        }
        if (this.arrowLeft && trapPos.col > characterPos.col && trapPos.row === characterPos.row) {
            return true; // Arrow ch? sang tr�i v� character ? b�n tr�i trap
        }
        if (this.arrowRight && trapPos.col < characterPos.col && trapPos.row === characterPos.row) {
            return true; // Arrow ch? sang ph?i v� character ? b�n ph?i trap
        }
        
        return false;
    }

    /**
     * L?y th�ng tin hi?n th? cho dialog
     * @returns {Object} Th�ng tin d? hi?n th?
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `<strong>${this.type}</strong> - Damage: <span class="damage-text">${this.damage}</span><br><i>Cơ Quan Phun Lửa là bẫy nguy hiểm được chế tạo từ thuốc nổ. Khi kích hoạt, nó sẽ phun lửa gây sát thương cho kẻ địch.</i>`,
            damage: this.damage
        };
    }
    
    /**
     * Xoay c�c arrow theo chi?u kim d?ng h?
     * Top ? Right ? Bottom ? Left ? Top
     */
    transformationAgency() {
        const directions = [
            this.arrowTop,
            this.arrowRight,
            this.arrowBottom,
            this.arrowLeft
        ];

        // Xoay m?ng 1 bu?c v? b�n ph?i (kim d?ng h?)
        const rotated = directions.map((_, i) => directions[(i + 3) % 4]);

        // G�n l?i v�o c�c thu?c t�nh
        this.arrowTop = rotated[0];
        this.arrowRight = rotated[1];
        this.arrowBottom = rotated[2];
        this.arrowLeft = rotated[3];
    }
} 
