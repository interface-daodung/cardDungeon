/**
 * Class Teleportation - Kế thừa từ Item
 * Item dịch chuyển tức thời trong game
 */
class Teleportation extends Item {
    constructor(power = null, cooldown = null) { 
        super(
            'Teleportation',  
            'teleportation',  
            'resources/item/teleportation.webp',  
            power ?? 20,          
            cooldown ?? 35,      
            `Teleportation is a consumable item that allows instant movement within ${power ?? 20} range.`
        );
        
        // Thuộc tính riêng của Teleportation
        this.isConsumable = true;
        this.teleportRange = power; // Phạm vi dịch chuyển
    }

    /**
     * Sử dụng item dịch chuyển
     * @param {Object} target - Điểm đến
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        return false;
    }
}
