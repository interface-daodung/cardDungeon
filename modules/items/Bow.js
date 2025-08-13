/**
 * Class Bow - Kế thừa từ Item
 * Vũ khí cung trong game
 */
class Bow extends Item {
    constructor(power = null, cooldown = null) { 
        super(
            'Bow',  
            'bow',  
            'resources/item/bow.webp',  
            power ?? 25,          
            cooldown ?? 8,      
            `Bow is a ranged weapon that deals ${power ?? 25} damage with fast attack speed.`
        );
        
        // Thuộc tính riêng của Bow
        this.isConsumable = false;
        this.weaponType = 'ranged';
        this.attackSpeed = 'fast';
        this.damage = power; // Sát thương
    }

    /**
     * Sử dụng vũ khí cung
     * @param {Object} target - Mục tiêu tấn công
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        return false;
    }
}
