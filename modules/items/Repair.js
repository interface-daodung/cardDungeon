/**
 * Class Repair - Kế thừa từ Item
 * Item sửa chữa trong game
 */
class Repair extends Item {
    static DEFAULT_COOLDOWN = 22;
    static DEFAULT_REPAIR_AMOUNT = 6;
    constructor(power = null, cooldown = null) { 
        super(
            'Sửa chữa',  
            'repair',  
            'resources/item/repair.webp',  
            power ?? Repair.DEFAULT_REPAIR_AMOUNT,          
            cooldown ?? Repair.DEFAULT_COOLDOWN,      
            `Repair is a consumable item that repairs equipment for ${power ?? Repair.DEFAULT_REPAIR_AMOUNT} durability.`
        );
        
        // Thuộc tính riêng của Repair
        this.isConsumable = true;
    }

    /**
     * Sử dụng item sửa chữa
     * @param {Object} target - Đối tượng được sửa chữa
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        if(animationManager.characterManager.getCharacterWeaponDurability() > 0) {
            this.cooldown = Repair.DEFAULT_COOLDOWN;
            animationManager.characterManager.getCharacterWeaponObject().durability += this.repairAmount;
            animationManager.startUseItemEffectAnimation(this.img);
            animationManager.updateCardStatus(animationManager.cardManager.findCharacterIndex());
        } else {
            return false;
        }
        return true;
    }

        /**
     * Nâng cấp item dựa trên level
     * @param {levelUp} level - Level hiện tại của item
     */
        isUpgrade(level) {
            for (let levelUp = 0; levelUp < level; levelUp++) {
                if (levelUp % 2 === 0) {
                    Repair.DEFAULT_REPAIR_AMOUNT += 1;
                    this.power = Repair.DEFAULT_REPAIR_AMOUNT;
                    
                    // Cập nhật description
                    this.description = `Repair is a consumable item that repairs equipment for ${this.power} durability.`;
                } else {
                    Repair.DEFAULT_COOLDOWN -= 1;
                    this.cooldown = Repair.DEFAULT_COOLDOWN;
                }
            }
        }
}
