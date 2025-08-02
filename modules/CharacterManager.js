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
        this.recovery = 0; // Số lượt hồi phục còn lại từ thức ăn đặc biệt
        this.characterWeaponObject = null; // Object vũ khí hiện tại
        this.elementCoin = Warrior.DEFAULT_ELEMENT_COIN; // Element coin mặc định từ Warrior
        this.poisoned = 0; // Số lượt độc còn lại (0 = không bị độc)
        
        console.log(`CharacterManager constructor: elementCoin=${this.elementCoin}, Warrior.DEFAULT_ELEMENT_COIN=${Warrior.DEFAULT_ELEMENT_COIN}`);
    }

    // ===== KHỞI TẠO VÀ RESET =====

    /**
     * Reset trạng thái Character về ban đầu
     * được gọi khi restart game hoặc new game
     */
    reset() {
        this.characterHP = Warrior.DEFAULT_HP; // Reset HP về giá trị mặc định từ Warrior
        this.recovery = 0; // Reset hồi phục về 0
        this.characterWeaponObject = null; // Reset object vũ khí về null
        this.elementCoin = Warrior.DEFAULT_ELEMENT_COIN; // Reset elementCoin về giá trị mặc định từ Warrior
        this.poisoned = 0; // Reset độc về 0
    }

    // ===== QUẢN LÝ HP =====

    /**
     * Cập nhật HP của Character (giảm do bị tấn công)
     * @param {number} damage - Lượng damage nhận vào
     * @returns {number} HP còn lại sau khi bị damage
     */
    updateCharacterHP(damage) {
        const oldHP = this.characterHP;
        // Giới hạn HP từ 0 đến giá trị mặc định từ Warrior, không cho phép âm hoặc vượt quá
        this.characterHP = Math.max(0, Math.min(Warrior.DEFAULT_HP, this.characterHP - damage));
        
        // Hiển thị popup damage
        if (damage > 0) {
            this.showHpChangePopup(-damage, 0);
        }
        
        return this.characterHP;
    }

    /**
     * Hồi phục HP cho Character
     * @param {number} amount - Lượng HP hồi phục
     * @returns {number} HP sau khi hồi phục
     */
    healCharacterHP(amount) {
        // Giới hạn tối đa HP từ Warrior, không cho phép vượt quá
        this.characterHP = Math.min(Warrior.DEFAULT_HP, this.characterHP + amount);
        
        // Hiển thị heal popup
        this.showHpChangePopup(amount);
        
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
        console.log(`⚔ addWeaponToCharacter: Thêm vũ khí với độ bền ${weaponObject.durability}, tên: ${weaponObject.name}`);
        this.characterWeaponObject = weaponObject; // Gán vũ khí mới
        console.log(`⚔ addWeaponToCharacter: độ bền vũ khí hiện tại: ${weaponObject.durability}, tên: ${weaponObject.name}`);
    }

    /**
     * Sử dụng vũ khí (giảm độ bền)
     * @returns {number} Độ bền còn lại của vũ khí
     */
    useWeapon() {
        if (this.characterWeaponObject && this.characterWeaponObject.durability > 0) {
            this.characterWeaponObject.durability--;
            return this.characterWeaponObject.durability;
        }
        return 0;
    }

    /**
     * Lấy độ bền vũ khí hiện tại
     * @returns {number} Độ bền vũ khí (0 nếu không có vũ khí)
     */
    getCharacterWeapon() { 
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
     * Lấy độ bền vũ khí (alias cho getCharacterWeapon)
     * @returns {number} Độ bền vũ khí
     */
    getWeaponDurability() {
        return this.getCharacterWeapon();
    }

    /**
     * Bán vũ khí (reset độ bền vũ khí về 0)
     * @returns {number} Giá trị vũ khí đã bán
     */
    sellWeapon() {
        const durability = this.getCharacterWeapon();
        
        // Gọi sellWeaponEffect nếu có
        if (this.characterWeaponObject && this.characterWeaponObject.sellWeaponEffect) {
            const gameState = null; // Có thể cần truyền gameState từ bên ngoài
            const sellEffect = this.characterWeaponObject.sellWeaponEffect(this, gameState);
            console.log(`💰 sellWeapon: sellEffect =`, sellEffect);
            
            if (sellEffect && sellEffect.sellValue !== undefined) {
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
        return this.getCharacterWeapon() > 0;
    }

    // ===== QUẢN LÝ TRẠNG THÁI =====

    /**
     * Xử lý hồi phục từ thức ăn đặc biệt
     * Được gọi mỗi lượt di chuyển
     */
    processRecovery() {
        if (this.recovery > 0) {
            this.healCharacterHP(1); // Hồi phục 1 HP
            this.recovery--; // Giảm số lượt hồi phục
            this.showHpChangePopup(1, 100); // Hiển thị heal ngay lập tức
        }
    }

    /**
     * Xử lý độc từ thức ăn độc
     * Được gọi mỗi lượt di chuyển
     */
    processPoison() {
        if (this.poisoned > 0) {
            this.updateCharacterHP(1); // Nhận 1 damage
            this.poisoned--; // Giảm số lượt độc
            this.showHpChangePopup(-1, 200); // Hiển thị damage sau 200ms
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

    /**
     * Set element coin
     * @param {number} elementCoin - Element coin mới
     */
    setCharacterElementCoin(elementCoin) {
        this.elementCoin = elementCoin;
    }

    // ===== HIỂN THỊ =====

    /**
     * Hiển thị popup khi HP thay đổi
     * @param {number} change - Lượng HP thay đổi (dương = heal, âm = damage)
     * @param {number} delay - Delay trước khi hiển thị (ms)
     */
    showHpChangePopup(change, delay = 0) {
        const characterElement = document.querySelector('.card.character');
        if (!characterElement) return;
        
        setTimeout(() => {
            // Tạo popup mới
            const popup = document.createElement('div');
            popup.className = 'hp-change-popup';
            
            if (change > 0) {
                // Heal
                popup.textContent = `+${change}`;
                popup.style.color = '#27ae60'; // Màu xanh lá
            } else {
                // Damage
                popup.textContent = `${change}`; // đã có dấu âm
                popup.style.color = '#e74c3c'; // Màu đỏ
            }
            
            popup.style.fontWeight = 'bold';
            popup.style.position = 'absolute';
            popup.style.zIndex = '1000';
            
            characterElement.appendChild(popup);
            
            // Tự động xóa sau 800ms
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 800);
        }, delay);
    }

    // ===== TIỆN ÍCH =====

    /**
     * Kiểm tra xem Character còn sống không
     * @returns {boolean} True nếu Character còn sống
     */
    isAlive() { 
        return this.characterHP > 0; 
    }
} 