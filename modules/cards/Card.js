// Card.js - Class co ban cho tat ca cac thẻ
// Chuc nang: dinh nghia interface va thuoc tinh chung cho tat ca thẻ

// Mixin logic chung cho enemy
const patternLogicEnemy = {
    curse: false,
    takeDamageEffect(targetElement, damage, damageType = 'none', characterManager = null, cardManager = null) {
        this.hp = Math.max(0, this.hp - damage);

        characterManager.animationManager.startTakeDamageEffectAnimation(targetElement, this, damage, damageType, cardManager);
        if (damageType === 'none') {
            console.log("---------lỗi gì đó damageType = none----------")
        }
        if (this.nameId.startsWith('abyssLector')) {
            if (this.nameId === 'abyssLector0' && damageType === 'Ocean') {
                this.shield = 0;
            } else if (this.nameId === 'abyssLector1' && damageType === 'Mystic Heaven') {
                this.shield = 0;
            } else if (this.nameId === 'abyssLector2' && damageType === 'Forest') {
                this.shield = 0;
            }
        }

        if (this.hp === 0) {
            if (['boom', 'trap',].includes(damageType)) {
                console.log(`---------lỗi gì đó damageType = ${damageType}---------`)
            }
            // Chạy killByWeaponEffect nếu có

            if (typeof this.killByWeaponEffect === 'function') {

                this.killByWeaponEffect(characterManager, cardManager);


            } else {
                console.log(`--------this.getId------${this.id}------ Tạo coin theo mặc định nếu không có killByWeaponEffect--------------------`)
                // Tạo coin theo mặc định nếu không có killByWeaponEffect
                // Tạo coin ngay tại đây và thay thế thẻ
                const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
                coinCard.id = this.id;
                coinCard.position = {
                    row: Math.floor(this.id / 3),
                    col: this.id % 3
                };
                cardManager.updateCard(this.id, coinCard);
            }
        } else {
            if (this.nameId === 'dragon' && (damageType === 'Mystic Heaven' || damageType === 'trap')) {
                    this.curse = true;
                    console.log('dragon is curse------');
            }
            // HP chưa về 0, chạy attackByWeaponEffect nếu có
            if (['weapon', 'catalyst', 'Mystic Heaven', 'Ocean', 'Forest'].includes(damageType)) {
                if (damageType === 'Forest' && !['apep', 'dragon'].includes(this.nameId)) {
                    this.curse = true;
                }
                if (typeof this.attackByWeaponEffect === 'function') {
                    console.log(`  ------attackByWeaponEffect --${this.name}---------   `)
                    this.attackByWeaponEffect(cardManager.getAllCards(), this.id, cardManager, characterManager.animationManager);
                }
            }

        }



        return {
            damage: damage,
            damageType: damageType,
            message: `${this.name} nhận ${damage} damage ${damageType}`
        };
    },
};

// Mixin logic chung cho coin
const patternLogicCoin = {
    takeDamageEffect(targetElement, damage, damageType = 'none', characterManager = null, cardManager = null) {
        // Xử lý logic damage cho coin
        this.score = Math.max(0, this.score - damage);
        characterManager.animationManager.startTakeDamageEffectAnimation(targetElement, this, damage, damageType);
        if (this.score === 0) {
            if (['boom', 'trap',].includes(damageType)) {
                console.log(`---------damageType = ${damageType}---------`)
            }

            console.log(`--------this.getId------${this.id}------ Tạo void theo mặc định---------`)
            // Tạo void ngay tại đây và thay thế thẻ

            const voidCard = cardManager.cardFactory.createVoid();
            voidCard.id = this.id;
            voidCard.position = {
                row: Math.floor(this.id / 3),
                col: this.id % 3
            };
            cardManager.updateCard(this.id, voidCard);

        }
        /*
        else {
            // HP chưa về 0, chạy tinh năng nào đó trong tương lai nếu có
            if (['weapon', 'catalyst', 'Mystic Heaven', 'Ocean', 'Forest'].includes(damageType)) {
                //to do : 
            }
            
        }*/
        return {
            damage: damage,
            damageType: damageType,
            message: `${this.name} nhận ${damage} damage ${damageType}`
        };
    },
};

// Mixin logic chung cho food
const patternLogicFood = {
    takeDamageEffect(targetElement, damage, damageType = 'none', characterManager = null, cardManager = null) {
        console.log(`${this.name} bị đánh: Nhận ${damage} damage ${damageType}!`);

        // Xử lý logic damage cho food
        this.heal = Math.max(0, this.heal - damage);
        characterManager.animationManager.startTakeDamageEffectAnimation(targetElement, this, damage, damageType);
        // Xử lý đặc biệt cho poison
        if (this.nameId === 'poison' && this.poisonDuration !== undefined) {
            this.poisonDuration = Math.max(0, this.poisonDuration - damage);
        }
        if (this.heal === 0) {
            if (['boom', 'trap',].includes(damageType)) {
                console.log(`---------damageType = ${damageType}---------`)
            }

            console.log(`--------this.getId------${this.id}------ Tạo void theo mặc định---------`)
            // Tạo coin ngay tại đây và thay thế thẻ
            const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
            coinCard.id = this.id;
            coinCard.position = {
                row: Math.floor(this.id / 3),
                col: this.id % 3
            };
            cardManager.updateCard(this.id, coinCard);

        }
        return {
            damage: damage,
            damageType: damageType,
            message: `${this.name} nhận ${damage} damage ${damageType}`
        };
    },
};

// Mixin logic chung cho weapon
const patternLogicWeapon = {
    takeDamageEffect(targetElement, damage, damageType = 'none', characterManager = null, cardManager = null) {

        if (['Mystic Heaven', 'Ocean', 'Forest'].includes(this.blessed) && this.blessed === damageType) {

            // Xử lý logic damage cho weapon
            this.durability = Math.max(0, this.durability + damage);


        } else {
            // Xử lý logic damage cho weapon
            this.durability = Math.max(0, this.durability - damage);
        }



        characterManager.animationManager.startTakeDamageEffectAnimation(targetElement, this, damage, damageType);
        console.log(`${this.name} bị đánh: Nhận ${damage} damage ${damageType}!`);
        if (this.durability === 0) {
            if (['boom', 'trap'].includes(damageType)) {
                console.log(`---------damageType = ${damageType}---------`)
            }

            console.log(`--------this.getId------${this.id}------ Tạo coin theo mặc định---------`)
            // Tạo coin ngay tại đây và thay thế thẻ
            const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
            coinCard.id = this.id;
            coinCard.position = {
                row: Math.floor(this.id / 3),
                col: this.id % 3
            };
            cardManager.updateCard(this.id, coinCard);

        }

        return {
            damage: damage,
            damageType: damageType,
            message: `${this.name} nhận ${damage} damage ${damageType}`
        };
    },
};

// Mixin logic chung cho boom
const patternLogicBoom = {
    takeDamageEffect(targetElement, damage, damageType = 'none', characterManager = null, cardManager = null) {
        console.log(`${this.name} bị đánh: Nhận ${damage} damage ${damageType}!`);

        // Xử lý logic damage cho boom
        this.damage = Math.max(0, this.damage - damage);
        characterManager.animationManager.startTakeDamageEffectAnimation(targetElement, this, damage, damageType);

        if (this.damage === 0) {
            if (['boom', 'trap',].includes(damageType)) {
                console.log(`---------damageType = ${damageType}---------`)
            }

            console.log(`--------this.getId------${this.id}------ Tạo void theo mặc định---------`)
            // Tạo coin ngay tại đây và thay thế thẻ
            const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
            coinCard.id = this.id;
            coinCard.position = {
                row: Math.floor(this.id / 3),
                col: this.id % 3
            };
            cardManager.updateCard(this.id, coinCard);

        }

        return {
            damage: damage,
            damageType: damageType,
            message: `${this.name} nhận ${damage} damage ${damageType}`
        };
    },
};

// Mixin logic chung cho trap
const patternLogicTrap = {
    takeDamageEffect(targetElement, damage, damageType = 'none', characterManager = null, cardManager = null) {
        console.log(`${this.name} bị đánh: Nhận ${damage} damage ${damageType}!`);

        // Xử lý logic damage cho trap
        this.damage = Math.max(0, this.damage - damage);
        characterManager.animationManager.startTakeDamageEffectAnimation(targetElement, this, damage, damageType);

        if (this.damage === 0) {
            if (['boom', 'trap',].includes(damageType)) {
                console.log(`---------damageType = ${damageType}---------`)
            }

            console.log(`--------this.getId------${this.id}------ Tạo void theo mặc định---------`)
            // Tạo coin ngay tại đây và thay thế thẻ
            const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
            coinCard.id = this.id;
            coinCard.position = {
                row: Math.floor(this.id / 3),
                col: this.id % 3
            };
            cardManager.updateCard(this.id, coinCard);

        }

        return {
            damage: damage,
            damageType: damageType,
            message: `${this.name} nhận ${damage} damage ${damageType}`
        };
    },
};

// Mixin logic chung cho treasure
const patternLogicTreasure = {
    takeDamageEffect(targetElement, damage, damageType = 'none', characterManager = null, cardManager = null) {
        console.log(`${this.name} bị đánh: Nhận ${damage} damage ${damageType}!`);
        // Xử lý logic damage cho treasure
        //this.durability = Math.max(0, this.durability - damage);

        return {
            damage: damage,
            damageType: damageType,
            message: `${this.name} nhận ${damage} damage ${damageType}`
        };
    },
};

// Mixin logic chung cho character
const patternLogicCharacter = {
    takeDamageEffect(targetElement, damage, damageType = 'none', characterManager = null, cardManager = null) {
        console.log(`${this.name} bị đánh: Nhận ${damage} damage ${damageType}!`);

        // Xử lý logic damage cho character
        this.hp = Math.max(0, this.hp - damage);
        characterManager.animationManager.startTakeDamageEffectAnimation(targetElement, this, damage, damageType);
        return {
            damage: damage,
            damageType: damageType,
            message: `${this.name} nhận ${damage} damage ${damageType}`
        };
    },
};

// Class gốc
class Card {
    /**
     * Khoi tao thẻ co ban
     * @param {string} name - Ten thẻ
     * @param {string} type - Loai thẻ (enemy, food, sword, coin, character)
     * @param {string} image - Duong dan hinh anh
     * @param {string} nameId - Ten cua image file (khong co extension)
     */
    constructor(name, type, image, nameId) {
        this.name = name;
        this.type = type;
        this.image = image;
        this.nameId = nameId;
        this.description = 'Mô tả thẻ';
        this.id = null;
        this.position = null;

        if (type === "enemy") {
            Object.assign(this, patternLogicEnemy);
        } else if (type === "coin") {
            Object.assign(this, patternLogicCoin);
        } else if (type === "food") {
            Object.assign(this, patternLogicFood);
        } else if (type === "weapon") {
            Object.assign(this, patternLogicWeapon);
        } else if (type === "boom") {
            Object.assign(this, patternLogicBoom);
        } else if (type === "trap") {
            Object.assign(this, patternLogicTrap);
        } else if (type === "treasure") {
            Object.assign(this, patternLogicTreasure);
        } else if (type === "character") {
            Object.assign(this, patternLogicCharacter);
        }
    }

    /**
     * Hieu ung khi thẻ bị an
     * @param {CharacterManager} characterManager - Manager quan ly character
     * @param {GameState} gameState - Manager quan ly game state
     * @param {CardManager} cardManager - Manager quan ly thẻ (optional)
     * @returns {Object|null} Thong tin ket qua hoac null
     */
    cardEffect(characterManager = null, gameState = null, cardManager = null) {
        // Override trong cac class con
        return null;
    }

    /**
     * Hieu ung khi thẻ nhận damage
     * @param {number} damage - So damage nhan duoc
     * @param {string} damageType - Loai damage (physical, debt, elemental, etc.)
     * @param {CharacterManager} characterManager - Manager quan ly character (optional)
     * @param {CardManager} cardManager - Manager quan ly thẻ (optional)
     * @returns {Object|null} Thong tin ket qua hoac null
     */
    takeDamageEffect(targetElement, damage, damageType = 'none', characterManager = null, cardManager = null) {
        // Hàm mặc định - không làm gì
        console.log(`${this.name} nhận ${damage} damage ${damageType} (mặc định)`);
        return {
            damage: damage,
            damageType: damageType,
            message: `${this.name} nhận ${damage} damage ${damageType}`
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
            nameId: this.nameId,
            description: this.description
        };
    }

    /**
     * Lấy vị trí index của thẻ trong CardManager.cards
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @returns {number|null} Index của thẻ trong mảng cards hoặc null nếu không tìm thấy
     */
    // getIndex(cardManager) {
    //     if (!cardManager || !cardManager.cards) {
    //         return null;
    //     }

    //     for (let i = 0; i < cardManager.cards.length; i++) {
    //         if (cardManager.cards[i].id === this.id) {
    //             return i;
    //         }
    //     }

    //     return null;
    // }

    /**
     * Ham tien ich tinh so ngau nhien trong khoang
     * @param {number} min - So nho nhat (bao gom)
     * @param {number} max - So lon nhat (bao gom)
     * @returns {number} So ngau nhien trong khoang [min, max]
     */
    GetRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

} 
