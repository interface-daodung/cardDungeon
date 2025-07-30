// WarriorManager.js - Quản lý Warrior
// Chức năng: Quản lý trạng thái và thuộc tính của nhân vật Warrior
class WarriorManager {
    constructor() {
        this.warriorHP = 10; // HP ban đầu của Warrior (tối đa 10)
        this.healFood1 = 0; // Số lượt hồi phục còn lại từ thức ăn đặc biệt
        this.warriorWeapon = 0; // Độ bền vũ khí hiện tại
    }

    // Reset trạng thái Warrior về ban đầu
    reset() {
        this.warriorHP = 10; // Reset HP về 10
        this.healFood1 = 0; // Reset hồi phục về 0
        this.warriorWeapon = 0; // Reset vũ khí về 0
    }

    // Cập nhật HP của Warrior (giảm do bị tấn công)
    updateWarriorHP(damage) {
        this.warriorHP = Math.max(0, Math.min(10, this.warriorHP - damage)); // Giới hạn HP từ 0-10
        return this.warriorHP;
    }

    // Hồi phục HP cho Warrior
    healWarriorHP(amount) {
        this.warriorHP = Math.min(10, this.warriorHP + amount); // Giới hạn tối đa 10 HP
        return this.warriorHP;
    }

    // Xử lý hồi phục từ thức ăn đặc biệt (food1) - hồi phục dần dần
    processFood1Healing() {
        if (this.healFood1 > 0) {
            this.healWarriorHP(1); // Hồi phục 1 HP
            this.healFood1--; // Giảm số lượt hồi phục
            return true; // Hồi phục thành công
        }
        return false; // Không còn lượt hồi phục
    }

    // Thêm vũ khí cho Warrior
    addWeaponToWarrior(durability) {
        this.warriorWeapon = durability; // Set độ bền vũ khí
        return this.warriorWeapon;
    }

    // Sử dụng vũ khí (giảm độ bền)
    useWeapon() {
        if (this.warriorWeapon > 0) {
            this.warriorWeapon--; // Giảm độ bền
            return this.warriorWeapon; // Trả về độ bền còn lại
        }
        return 0; // Hết độ bền
    }

    // Lấy HP hiện tại của Warrior
    getWarriorHP() { 
        return this.warriorHP; 
    }
    
    // Lấy độ bền vũ khí hiện tại
    getWarriorWeapon() { 
        return this.warriorWeapon; 
    }
    
    // Lấy số lượt hồi phục còn lại từ thức ăn đặc biệt
    getHealFood1() { 
        return this.healFood1; 
    }
    
    // Set số lượt hồi phục từ thức ăn đặc biệt
    setHealFood1(count) { 
        this.healFood1 = count; 
    }
    
    // Kiểm tra Warrior còn sống không
    isAlive() { 
        return this.warriorHP > 0; 
    }
    
    // Kiểm tra Warrior có vũ khí không
    hasWeapon() { 
        return this.warriorWeapon > 0; 
    }

    // Xử lý khi Warrior ăn thẻ (tiêu thụ thẻ)
    processCardConsumption(cardType, cardData) {
        switch (cardType) {
            case 'fatuice':
                // Ăn quái vật -> bị mất HP
                this.updateWarriorHP(cardData.hp || 0);
                break;
            case 'food':
                // Ăn thức ăn -> hồi phục HP
                if (cardData.image === 'resources/food1.webp') {
                    // Thức ăn đặc biệt - hồi phục dần dần
                    this.setHealFood1(cardData.heal || 0);
                    this.healWarriorHP(1); // Hồi phục ngay 1 HP
                    this.healFood1--; // Giảm số lượt
                } else {
                    // Thức ăn thường - hồi phục ngay lập tức
                    this.healWarriorHP(cardData.heal || 0);
                }
                break;
            case 'sword':
                // Ăn vũ khí -> nhận vũ khí mới
                this.addWeaponToWarrior(cardData.durability || 0);
                break;
        }
    }
} 