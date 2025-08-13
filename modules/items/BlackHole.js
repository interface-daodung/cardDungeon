/**
 * Class BlackHole - Kế thừa từ Item
 * Item hút kẻ địch trong game
 */
class BlackHole extends Item {
    static DEFAULT_COOLDOWN = 32;

    constructor(power = null, cooldown = null) {
        super(
            'Black Hole',
            'blackHole',
            'resources/item/blackHole.webp',
            power ?? 0,
            cooldown ?? BlackHole.DEFAULT_COOLDOWN,
            `Black Hole is a consumable item that pulls enemies within ${power ?? 15} range.`
        );

        // Thuộc tính riêng của BlackHole
        this.isConsumable = false;
    }

    /**
     * Sử dụng item hút kẻ địch
     * @param {Object} target - Đối tượng mục tiêu
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        animationManager.startUseItemEffectAnimation(this.img);
        animationManager.eventManager.combatManager.ShuffleWithFlipEffect();
        this.cooldown = BlackHole.DEFAULT_COOLDOWN;
        animationManager.eventManager.uiManager.updateUI();
        return true;
    }
    /**
* Nâng cấp item dựa trên level
* @param {number} level - Level hiện tại của item
*/
    isUpgrade(level) {
        for (let levelUp = 0; levelUp < level; levelUp++) {
            // Giảm cooldown theo level
            BlackHole.DEFAULT_COOLDOWN -= 1;
            this.cooldown = BlackHole.DEFAULT_COOLDOWN;

        }
    }
}
