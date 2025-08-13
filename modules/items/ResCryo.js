/**
 * Class ResCryo - Kế thừa từ Item
 * Item kháng nguyên tố Cryo trong game
 */
class ResCryo extends Item {
    constructor(power = null, cooldown = null) { 
        super(
            'Resistance Cryo',  
            'resCryo',  
            'resources/item/resCryo.webp',  
            power ?? 20,          
            cooldown ?? 25,      
            `Resistance Cryo is a consumable item that provides ${power ?? 20}% Cryo resistance.`
        );
        
        // Thuộc tính riêng của ResCryo
        this.isConsumable = true;
        this.resistanceAmount = power; // Lượng kháng nguyên tố
        this.elementType = 'Cryo';
    }

    /**
     * Sử dụng item kháng nguyên tố Cryo
     * @param {Object} target - Đối tượng được kháng nguyên tố
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        return false;
    }
}
