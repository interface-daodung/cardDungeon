/**
 * Class Cooldown - Kế thừa từ Item
 * Item giảm cooldown trong game
 */
class Cooldown extends Item {
    static DEFAULT_COOLDOWN_REDUCTION = 3;
    static DEFAULT_COOLDOWN = 28;
    constructor(power = null, cooldown = null) {
        super(
            'Tinh linh thời gian',
            'cooldown',
            'resources/item/cooldown.webp',
            power ?? Cooldown.DEFAULT_COOLDOWN_REDUCTION,
            cooldown ?? Cooldown.DEFAULT_COOLDOWN,
            `Cooldown is a consumable item that reduces cooldown by ${power ?? Cooldown.DEFAULT_COOLDOWN_REDUCTION} seconds.`
        );

        // Thuộc tính riêng của Cooldown
        this.isConsumable = true;
        this.cooldownReduction = power; // Lượng giảm cooldown
    }

    /**
     * Sử dụng item giảm cooldown
     * @param {Object} target - Đối tượng được giảm cooldown
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        const equipments = animationManager.eventManager.gameState.getEquipments();

        // Kiểm tra xem có equipment nào có cooldown > 0 không
        const hasCooldownEquipments = equipments.some(equipment => equipment.cooldown > 0);
        if (!hasCooldownEquipments) {
            return false; // Tất cả equipment đều có cooldown = 0, return false
        }

        animationManager.startUseItemEffectAnimation(this.img);
        animationManager.eventManager.gameState.CooldownReduction(this.power);
        this.cooldown = Cooldown.DEFAULT_COOLDOWN;
        animationManager.eventManager.uiManager.updateUI();
        return true;
    }


    /**
     * Nâng cấp item dựa trên level
     * @param {number} level - Level hiện tại của item
     */
    isUpgrade(level) {
        for (let levelUp = 0; levelUp < level; levelUp++) {
            if (levelUp % 2 === 0) {
                Cooldown.DEFAULT_COOLDOWN_REDUCTION += 1;
                this.power = Cooldown.DEFAULT_COOLDOWN_REDUCTION;

                // Cập nhật description
                this.description = `Cooldown is a consumable item that reduces cooldown by ${this.power} seconds.`;
            } else {
                // Giảm cooldown theo level
                Cooldown.DEFAULT_COOLDOWN -= 1;
                this.cooldown = Cooldown.DEFAULT_COOLDOWN;
            }
        }
    }
}
