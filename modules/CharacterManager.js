// CharacterManager.js - Quản lý nhân vật Character (Warrior)
// Chức năng: Quản lý trạng thái và thuộc tính của nhân vật chính
// Bao gồm HP, weapon, healing effects và các thao tác liên quan

class CharacterManager {
    /**
     * Khởi tạo CharacterManager với trạng thái ban đầu
     * Character bắt đầu với 10 HP, không có weapon
     */
    constructor() {
        // ===== KHỞI TẠO TRẠNG THÁI BAN ĐẦU =====
        // Lấy giá trị mặc định từ Warrior class
        this.characterHP = Warrior.DEFAULT_HP; // HP ban đầu của Character từ Warrior
        this.elementCoin = Warrior.DEFAULT_ELEMENT_COIN; // Element coin mặc định từ Warrior
        this.characterWeaponObject = null; // Object vũ khí hiện tại
        this.recovery = 0; // Số lượt hồi phục còn lại từ thức ăn đặc biệt
        this.poisoned = 0; // Số lượt độc còn lại (0 = không bị độc)
        this.animationManager = null; // Sẽ được set sau khi AnimationManager được tạo

    }

    // ===== KHỞI TẠO VÀ RESET =====

    /**
     * Set AnimationManager để có thể gọi triggerGameOver
     * @param {AnimationManager} animationManager - AnimationManager instance
     */
    setAnimationManager(animationManager) {
        this.animationManager = animationManager;
    }

    /**
     * Reset trạng thái Character về ban đầu
     * được gọi khi restart game hoặc new game
     */
    reset() {
        this.characterHP = Warrior.DEFAULT_HP; // Reset HP về giá trị mặc định từ Warrior
        this.elementCoin = Warrior.DEFAULT_ELEMENT_COIN; // Reset elementCoin về giá trị mặc định từ Warrior
        this.characterWeaponObject = null; // Reset object vũ khí về null
        this.recovery = 0; // Reset hồi phục về 0
        this.poisoned = 0; // Reset độc về 0

    }

    // ===== QUẢN LÝ HP =====

    /**
     * Giảm HP của Character (do bị tấn công)
     * @param {number} damage - Lượng damage nhận vào
     * @returns {number} HP còn lại sau khi bị damage
     */
    damageCharacterHP(damage, delay) {
        const oldHP = this.characterHP;
        // Giới hạn HP từ 0 đến giá trị mặc định từ Warrior, không cho phép âm hoặc vượt quá
        this.characterHP = Math.max(0, Math.min(Warrior.DEFAULT_HP, this.characterHP - damage));

        // Hiển thị popup damage
        if (damage > 0 && this.animationManager) {
            this.animationManager.showHpChangePopup(-damage, delay);
        }

        // Kiểm tra game over nếu HP = 0
        if (this.characterHP === 0) {
            // Gọi triggerGameOver thông qua animationManager
            if (this.animationManager) {
                this.animationManager.triggerGameOver();
            }
        }

        return this.characterHP;
    }

    /**
     * Hồi phục HP cho Character
     * @param {number} amount - Lượng HP hồi phục
     * @returns {number} HP sau khi hồi phục
     */
    healCharacterHP(amount, delay) {
        // Giới hạn tối đa HP từ Warrior, không cho phép vượt quá
        this.characterHP = Math.min(Warrior.DEFAULT_HP, this.characterHP + amount);

        // Hiển thị heal popup
        if (this.animationManager) {
            this.animationManager.showHpChangePopup(amount, delay);
        }

        return this.characterHP;
    }

    /**
     * Lấy HP hiện tại của Character
     * @returns {number} HP hiện tại
     */
    getCharacterHP() {
        return this.characterHP;
    }

    // ===== QUẢN LÝ WEAPON =====

    /**
     * Thêm vũ khí cho Character
     * @param {Object} weaponObject - Object vũ khí cần thêm
     */
    addWeaponToCharacter(weaponObject) {
        if (this.getCharacterWeaponDurability() > weaponObject.durability) {
            this.animationManager.eventManager.gameState.addScore(weaponObject.durability);
        } else {
            this.animationManager.eventManager.gameState.addScore(this.getCharacterWeaponDurability());
            this.characterWeaponObject = weaponObject; // Gán vũ khí mới
        }

    }




    /**
     * Lấy độ bền vũ khí (alias cho getCharacterWeapon)
     * @returns {number} Độ bền vũ khí
     */
    getCharacterWeaponDurability() {
        return this.characterWeaponObject ? this.characterWeaponObject.durability : 0;
    }
    /**
     * Lấy tên vũ khí hiện tại
     * @returns {string} Tên vũ khí hoặc "None" nếu không có
     */
    getCharacterWeaponName() {
        return this.characterWeaponObject ? this.characterWeaponObject.name : "None";
    }

    /**
     * Lấy object vũ khí hiện tại
     * @returns {Object|null} Object vũ khí hoặc null nếu không có
     */
    getCharacterWeaponObject() {
        return this.characterWeaponObject;
    }



    /**
     * Bán vũ khí (reset độ bền vũ khí về 0)
     * @returns {number} Giá trị vũ khí đã bán
     */
    sellWeapon() {
        const durability = this.getCharacterWeaponDurability();

        // Gọi sellWeaponEffect nếu có
        if (this.characterWeaponObject && this.characterWeaponObject.sellWeaponEffect) {
            const sellEffect = this.characterWeaponObject.sellWeaponEffect(this, null);

            if (sellEffect && sellEffect.type === 'weapon_sold') {
                this.characterWeaponObject = null; // Reset object vũ khí
                return sellEffect.sellValue;
            }
        }

        // Bán theo độ bền mặc định
        this.characterWeaponObject = null; // Reset object vũ khí
        return durability;
    }

    /**
     * Kiểm tra xem Character có vũ khí không
     * @returns {boolean} True nếu có vũ khí
     */
    hasWeapon() {
        return this.getCharacterWeaponDurability() > 0;
    }

    // ===== QUẢN LÝ TRẠNG THÁI =====

    /**
     * Xử lý hồi phục từ thức ăn đặc biệt
     * Được gọi mỗi lượt di chuyển
     */
    processRecovery() {
        if (this.recovery > 0) {
            this.healCharacterHP(1, 100); // Hồi phục 1 HP
            this.recovery--; // Giảm số lượt hồi phục
            //this.animationManager?.showHpChangePopup(1, 100); // Hiển thị heal ngay lập tức
        }
    }

    /**
     * Xử lý độc từ thức ăn độc
     * Được gọi mỗi lượt di chuyển
     */
    processPoison() {
        if (this.poisoned > 0) {
            // Nếu HP = 1 thì không bị độc, để tránh HP = 0
            if (this.characterHP === 1) {
                this.poisoned = 0;
                return;
            }
            this.damageCharacterHP(1, 200); // Nhận 1 damage
            this.poisoned--; // Giảm số lượt độc
            //this.animationManager?.showHpChangePopup(-1, 200); // Hiển thị damage sau 200ms
        }
    }

    /**
     * Lấy số lượt độc còn lại
     * @returns {number} Số lượt độc
     */
    getPoisoned() {
        return this.poisoned;
    }

    /**
     * Set số lượt độc
     * @param {number} count - Số lượt độc mới
     */
    setPoisoned(count) {
        this.poisoned = count;
    }

    /**
     * Lấy số lượt hồi phục còn lại
     * @returns {number} Số lượt hồi phục
     */
    getRecovery() {
        return this.recovery;
    }

    /**
     * Set số lượt hồi phục
     * @param {number} count - Số lượt hồi phục mới
     */
    setRecovery(count) {
        this.recovery = count;
    }

    /**
     * Lấy element coin hiện tại
     * @returns {number} Element coin
     */
    getCharacterElementCoin() {
        return this.elementCoin;
    }



    // ===== HIỂN THỊ =====

    // ===== TIỆN ÍCH =====

    /**
     * Kiểm tra xem Character còn sống không
     * @returns {boolean} True nếu Character còn sống
     */
    isAlive() {
        return this.characterHP > 0;
    }
} 
