// Trap.js - Th? b?y
// Ch?c nang: Th? b?y gy h?i cho ngu?i choi

class Trap extends Card {
    constructor() {
        super(
            "Co Quan Phun Lửa",
            "trap",
            "resources/trap.webp",
            "trap"
        );
        this.damage = this.GetRandom(1, 7); // St thuong c?a b?y t? 1-7

        // Kh?i t?o thu?c tnh arrow v?i logic ng?u nhin
        this.initializeArrows();
    }

    /**
     * Kh?i t?o cc thu?c tnh arrow theo t? l? ng?u nhin
     */
    initializeArrows() {
        // Xc d?nh s? lu?ng arrow hi?n th?
        const random = Math.random() * 100;
        let arrowCount;

        if (random < 50) {
            arrowCount = 2; // 50% có 2 arrow
        } else if (random < 90) {
            arrowCount = 1; // 40% có 1 arrow
        } else {
            arrowCount = 3; // 10% có 3 arrow
        }


        // T?o m?ng cc hu?ng c th?
        const directions = ['arrowTop', 'arrowBottom', 'arrowLeft', 'arrowRight'];

        // Kh?i t?o t?t c? arrow = 0
        this.arrowTop = 0;
        this.arrowBottom = 0;
        this.arrowLeft = 0;
        this.arrowRight = 0;

        // Random ch?n arrowCount hu?ng d? set = 1
        for (let i = 0; i < arrowCount; i++) {
            const randomIndex = this.GetRandom(0, directions.length - 1);
            const direction = directions[randomIndex];
            this[direction] = 1;

            // Xóa hướng đã chọn để không bị trùng
            directions.splice(randomIndex, 1);
        }
    }

    /**
     * Tìm các thẻ liền kề bị chỉ bởi arrow của trap
     * @param {number} trapIndex - Index của trap
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @returns {Array} Mảng index của các thẻ bị chỉ
     */
    findAdjacentTargets(trapIndex, cardManager) {
        const targets = [];
        const trapPos = { row: Math.floor(trapIndex / 3), col: trapIndex % 3 };

        if (this.arrowTop && trapPos.row > 0) {
            const targetIndex = (trapPos.row - 1) * 3 + trapPos.col;
            if (cardManager.getCard(targetIndex)) {
                targets.push(targetIndex);
            }
        }
        if (this.arrowBottom && trapPos.row < 2) {
            const targetIndex = (trapPos.row + 1) * 3 + trapPos.col;
            if (cardManager.getCard(targetIndex)) {
                targets.push(targetIndex);
            }
        }
        if (this.arrowLeft && trapPos.col > 0) {
            const targetIndex = trapPos.row * 3 + (trapPos.col - 1);
            if (cardManager.getCard(targetIndex)) {
                targets.push(targetIndex);
            }
        }
        if (this.arrowRight && trapPos.col < 2) {
            const targetIndex = trapPos.row * 3 + (trapPos.col + 1);
            if (cardManager.getCard(targetIndex)) {
                targets.push(targetIndex);
            }
        }

        return targets;
    }

    /**
     * Xử lý damage cho thẻ bị chỉ bởi trap
     * @param {Card} targetCard - Thẻ bị chỉ
     * @param {HTMLElement} targetElement - Element của thẻ
     * @param {number} damage - Lượng damage
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @param {number} targetIndex - Index của thẻ
     * @param {AnimationManager} animationManager - Manager quản lý animation
     * @param {CharacterManager} characterManager - Manager quản lý character
     */
    processTrapDamageToCard(targetCard, targetElement, damage, cardManager, targetIndex, animationManager, characterManager) {
        if (targetCard.type === 'character') {
            characterManager.damageCharacterHP(damage);
        } else if (targetCard.takeDamageEffect) {
            targetCard.takeDamageEffect(targetElement, damage, 'trap', characterManager, cardManager);
            // Các xử lý hiển thị, update, death... giữ nguyên phía sau
        } else {
            // fallback cũ nếu chưa có takeDamageEffect

        }
    }

    /**
     * Xử lý khi enemy chết do trap damage
     * @param {number} enemyIndex - Index của enemy
     * @param {Card} enemyCard - Enemy card
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @param {AnimationManager} animationManager - Manager quản lý animation
     */
    // handleEnemyDeathByTrap(enemyIndex, enemyCard, cardManager, animationManager) {
    //     const enemyElement = document.querySelector(`[data-index="${enemyIndex}"]`);
    //     if (enemyElement) {
    //         enemyElement.classList.add('monster-dying');
    //     }

    //     if (typeof enemyCard.killByWeaponEffect === 'function') {
    //         const killResult = enemyCard.killByWeaponEffect(animationManager.characterManager, null);

    //         if (killResult && killResult.reward) {
    //             setTimeout(() => {
    //                 animationManager.createRewardCard(enemyIndex, killResult.reward, cardManager);
    //             }, 600);
    //         } else {
    //             setTimeout(() => {
    //                 animationManager.createDefaultCoin(enemyIndex, cardManager);
    //             }, 600);
    //         }
    //     } else {
    //         setTimeout(() => {
    //             animationManager.createDefaultCoin(enemyIndex, cardManager);
    //         }, 600);
    //     }
    // }

    /**
     * Hi?u ?ng khi th? b? an
     * @param {CharacterManager} characterManager - Manager qu?n l character
     * @param {GameState} gameState - Manager qu?n l game state
     * @param {CardManager} cardManager - Manager qu?n l th? (optional)
     * @returns {Object} Thng tin k?t qu?
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Ki?m tra xem character c b? ch? b?i arrow khng
        const characterIndex = cardManager ? cardManager.findCharacterIndex() : null;
        const isCharacterTargeted = this.isCharacterTargetedByArrow(characterIndex, cardManager);

        if (isCharacterTargeted) {
            // Character b? ch? b?i arrow - gy st thuong
            //characterManager.damageCharacterHP(this.damage);

            return {
                type: 'trap',
                damage: this.damage,
                message: `B? thuong ${this.damage} HP t? b?y!`,
                shouldTriggerAnimation: true,
                characterDamaged: true
            };
        } else {
            // Character khng b? ch? b?i arrow - khng gy st thuong
            return {
                type: 'trap',
                damage: 0,
                message: `B?y khng ho?t d?ng!`,
                shouldTriggerAnimation: true,
                characterDamaged: false
            };
        }
    }

    /**
     * Ki?m tra xem character c b? ch? b?i arrow khng
     * @param {number} characterIndex - Index c?a character
     * @param {CardManager} cardManager - Manager qu?n l th?
     * @returns {boolean} True n?u character b? ch? b?i arrow
     */
    isCharacterTargetedByArrow(characterIndex, cardManager) {
        if (characterIndex === null || !cardManager) return false;

        const characterPos = { row: Math.floor(characterIndex / 3), col: characterIndex % 3 };
        const trapPos = this.position;

        // Ki?m tra t?ng hu?ng arrow
        if (this.arrowTop && trapPos.row > characterPos.row && trapPos.col === characterPos.col) {
            return true; // Arrow ch? ln trn v character ? trn trap
        }
        if (this.arrowBottom && trapPos.row < characterPos.row && trapPos.col === characterPos.col) {
            return true; // Arrow ch? xu?ng du?i v character ? du?i trap
        }
        if (this.arrowLeft && trapPos.col > characterPos.col && trapPos.row === characterPos.row) {
            return true; // Arrow ch? sang tri v character ? bn tri trap
        }
        if (this.arrowRight && trapPos.col < characterPos.col && trapPos.row === characterPos.row) {
            return true; // Arrow ch? sang ph?i v character ? bn ph?i trap
        }

        return false;
    }

    /**
     * L?y thng tin hi?n th? cho dialog
     * @returns {Object} Thng tin d? hi?n th?
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
     * Xoay cc arrow theo chi?u kim d?ng h?
     * Top ? Right ? Bottom ? Left ? Top
     */
    transformationAgency() {
        const directions = [
            this.arrowTop,
            this.arrowRight,
            this.arrowBottom,
            this.arrowLeft
        ];

        // Xoay m?ng 1 bu?c v? bn ph?i (kim d?ng h?)
        const rotated = directions.map((_, i) => directions[(i + 3) % 4]);

        // Gn l?i vo cc thu?c tnh
        this.arrowTop = rotated[0];
        this.arrowRight = rotated[1];
        this.arrowBottom = rotated[2];
        this.arrowLeft = rotated[3];
    }
} 
