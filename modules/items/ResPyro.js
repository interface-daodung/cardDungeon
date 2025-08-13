/**
 * Class ResPyro - Kế thừa từ Item
 * Item kháng nguyên tố Pyro trong game
 */
class ResPyro extends Item {
    constructor(power = null, cooldown = null) { 
        super(
            'Resistance Pyro',  
            'resPyro',  
            'resources/item/resPyro.webp',  
            power ?? 20,          
            cooldown ?? 25,      
            `Resistance Pyro is a consumable item that provides ${power ?? 20}% Pyro resistance.`
        );
        
        // Thuộc tính riêng của ResPyro
        this.isConsumable = true;
        this.resistanceAmount = power; // Lượng kháng nguyên tố
        this.elementType = 'Pyro';
    }

    /**
     * Sử dụng item kháng nguyên tố Pyro
     * @param {Object} target - Đối tượng được kháng nguyên tố
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        return false;
    }
}
