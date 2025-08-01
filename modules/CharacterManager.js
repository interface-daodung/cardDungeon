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
        this.characterWeapon = 0; // độ bền vũ khí hiện tại (0 = không có vũ khí)
        this.characterWeaponName = null; // Tên vũ khí hiện tại
        this.elementCoin = Warrior.DEFAULT_ELEMENT_COIN; // Element coin mặc định từ Warrior
        this.poisoned = 0; // Số lượt độc còn lại (0 = không bị độc)
        
        console.log(`CharacterManager constructor: elementCoin=${this.elementCoin}, Warrior.DEFAULT_ELEMENT_COIN=${Warrior.DEFAULT_ELEMENT_COIN}`);
    }

    /**
     * Reset trạng thái Character về ban đầu
     * được gọi khi restart game hoặc new game
     */
    reset() {
        this.characterHP = Warrior.DEFAULT_HP; // Reset HP về giá trị mặc định từ Warrior
        this.recovery = 0; // Reset hồi phục về 0
        this.characterWeapon = 0; // Reset vũ khí về 0
        this.characterWeaponName = null; // Reset tên vũ khí về null
        this.elementCoin = Warrior.DEFAULT_ELEMENT_COIN; // Reset elementCoin về giá trị mặc định từ Warrior
        this.poisoned = 0; // Reset độc về 0
    }

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
        if (amount > 0) {
            this.showHpChangePopup(amount);
        }
        
        return this.characterHP;
    }

    /**
     * Xử lý hồi phục từ thức ăn đặc biệt - hồi phục dần dần
     * Sẽ hồi phục 1 HP mỗi lượt cho đến khi hết
     * @returns {boolean} True nếu hồi phục thành công, false nếu hết lượt
     */
    processRecovery() {
        if (this.recovery > 0) {
            this.characterHP = Math.min(Warrior.DEFAULT_HP, this.characterHP + 1);
            this.showHpChangePopup(1, 100); // Hiển thị heal ngay lập tức
            this.recovery--; // Giảm số lượt hồi phục
            return true; // Hồi phục thành công
        }
        return false; // Không còn lượt hồi phục
    }

    /**
     * Xử lý độc - giảm 1 HP mỗi lượt
     * được gọi khi tăng move
     * @returns {boolean} True nếu bị độc, false nếu không còn độc
     */
    processPoison() {
        if (this.poisoned > 0) {
            // Nếu HP = 1 thì không giảm HP và reset poisoned về 0
            if (this.characterHP === 1) {
                this.poisoned = 0;
                return false; // Không còn độc
            }
            
            this.characterHP = Math.max(0, this.characterHP - 1);
            this.showHpChangePopup(-1, 200); // Hiển thị damage sau 200ms
            this.poisoned--; // Giảm số lượt độc
            return true; // Bị độc
        }
        return false; // Không còn độc
    }

    /**
     * Thêm vũ khí cho Character
     * @param {number} durability - độ bền của vũ khí mới
     * @param {string} weaponName - Tên của vũ khí mới
     * @returns {number} độ bền vũ khí hiện tại
     */
    addWeaponToCharacter(durability, weaponName = null) {
        console.log(`⚔ addWeaponToCharacter: Thêm vũ khí với độ bền ${durability}, tên: ${weaponName}`);
        this.characterWeapon = durability; // Set độ bền vũ khí (thay thế vũ khí cũ)
        this.characterWeaponName = weaponName; // Set tên vũ khí
        console.log(`⚔ addWeaponToCharacter: độ bền vũ khí hiện tại: ${this.characterWeapon}, tên: ${this.characterWeaponName}`);
        return this.characterWeapon;
    }

    /**
     * Sử dụng vũ khí (giảm độ bền)
     * được gọi khi Character tấn công
     * @returns {number} độ bền còn lại sau khi sử dụng
     */
    useWeapon() {
        if (this.characterWeapon > 0) {
            this.characterWeapon--; // Giảm độ bền
            return this.characterWeapon; // Trả về độ bền còn lại
        }
        return 0; // Hết độ bền
    }

    // ===== GETTER METHODS =====
    /**
     * Lấy HP hiện tại của Character
     * @returns {number} HP hiện tại
     */
    getCharacterHP() { 
        return this.characterHP; 
    }
    
    /**
     * Lấy độ bền vũ khí hiện tại
     * @returns {number} độ bền vũ khí (0 = không có vũ khí)
     */
    getCharacterWeapon() { 
        return this.characterWeapon; 
    }

    /**
     * Lấy tên vũ khí hiện tại
     * @returns {string|null} Tên vũ khí (null = không có vũ khí)
     */
    getCharacterWeaponName() { 
        return this.characterWeaponName; 
    }

    /**
     * Lấy elementCoin từ CharacterManager
     * @returns {number} Element coin hiện tại
     */
    getCharacterElementCoin() {
        // Lấy elementCoin từ CharacterManager
        // Giá trị mặc định được lấy từ Warrior.DEFAULT_ELEMENT_COIN
        const elementCoin = this.elementCoin || 0;
        console.log(`getCharacterElementCoin() called, returning: ${elementCoin}`);
        return elementCoin;
    }

    /**
     * Lấy số lượt độc còn lại
     * @returns {number} Số lượt độc còn lại
     */
    getPoisoned() {
        return this.poisoned;
    }

    /**
     * Set số lượt độc
     * @param {number} count - Số lượt độc mới
     */
    setPoisoned(count) {
        this.poisoned = Math.max(0, count); // Không cho phép âm
    }

    /**
     * Lấy số lượt hồi phục còn lại
     * @returns {number} Số lượt hồi phục còn lại
     */
    getRecovery() { 
        return this.recovery; 
    }
    
    /**
     * Set số lượt hồi phục
     * @param {number} count - Số lượt hồi phục
     */
    setRecovery(count) { 
        this.recovery = count; 
    }

    /**
     * Set elementCoin cho Warrior
     * @param {number} elementCoin - Giá trị elementCoin mới
     */
    setCharacterElementCoin(elementCoin) {
        this.elementCoin = elementCoin;
    }



    /**
     * Lấy độ bền vũ khí (alias cho getCharacterWeapon)
     * @returns {number} độ bền vũ khí
     */
    getWeaponDurability() {
        return this.characterWeapon;
    }
    
    /**
     * Bán vũ khí (reset độ bền vũ khí về 0)
     * @returns {number} độ bền đã bán
     */
    sellWeapon() {
        const durability = this.characterWeapon;
        this.characterWeapon = 0; // Reset về 0
        this.characterWeaponName = null; // Reset tên vũ khí
        return durability; // Trả về độ bền đã bán
    }
    
    // ===== STATUS CHECK METHODS =====
    /**
     * Kiểm tra Character còn sống không
     * @returns {boolean} True nếu HP > 0
     */
    isAlive() { 
        return this.characterHP > 0; 
    }
    
    /**
     * Kiểm tra Character có vũ khí không
     * @returns {boolean} True nếu có vũ khí (durability > 0)
     */
    hasWeapon() { 
        return this.characterWeapon > 0; 
    }

} 