/**
 * Class Key - Kế thừa từ Item
 * Chìa khóa mở khóa trong game
 */
class Key extends Item {
    constructor(power = null, cooldown = null) { 
        super(
            'Key',  
            'key',  
            'resources/item/key.webp',  
            power ?? 1,          
            cooldown ?? 0,      
            `Key is a special item that can unlock doors and chests.`
        );
        
        // Thuộc tính riêng của Key
        this.isConsumable = false;
        this.canUnlock = true; // Có thể mở khóa
    }

    /**
     * Sử dụng chìa khóa
     * @param {Object} target - Đối tượng cần mở khóa
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        return false;
    }
}
