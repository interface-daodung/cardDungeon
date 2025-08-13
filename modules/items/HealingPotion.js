/**
 * Class HealingPotion - Kế thừa từ Item
 * Thuốc hồi máu trong game
 */
class HealingPotion extends Item {
    static DEFAULT_HEAL_AMOUNT = 4;
    static DEFAULT_COOLDOWN = 16;
    constructor(power = null, cooldown = null) {
        super(
            'Thuốc hồi máu',
            'healingPotion',
            'resources/item/healingPotion.webp',
            power ?? HealingPotion.DEFAULT_HEAL_AMOUNT,          // Nếu power null hoặc undefined thì = 6
            cooldown ?? HealingPotion.DEFAULT_COOLDOWN,      // Nếu cooldown null hoặc undefined thì = 10
            `Healing Potion is a consumable item that heals the target for ${power ?? HealingPotion.DEFAULT_HEAL_AMOUNT} HP.`
        );

        // Thuộc tính riêng của HealingPotion
        this.isConsumable = true;
        this.healAmount = power; // Lượng máu hồi
    }

    /**
     * Sử dụng thuốc hồi máu
     * @param {Object} animationManager - Đối tượng được hồi máu
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        // tạm thời để như này 10 hp để test 
        if (animationManager.characterManager.getCharacterHP() === 10) {
            return false;
        }
        animationManager.characterManager.healCharacterHP(this.power);
        this.cooldown = HealingPotion.DEFAULT_COOLDOWN;
        animationManager.startUseItemEffectAnimation(this.img);
        animationManager.updateCardStatus(animationManager.cardManager.findCharacterIndex());
        return true;
    }

    /**
     * Nâng cấp item dựa trên level
     * @param {number} level - Level hiện tại của item
     */
    isUpgrade(level) {
        for (let levelUp = 0; levelUp < level; levelUp++) {
            if (levelUp % 2 === 0) {
                HealingPotion.DEFAULT_HEAL_AMOUNT += 1;
                this.power = HealingPotion.DEFAULT_HEAL_AMOUNT;

                // Cập nhật description
                this.description = `Healing Potion is a consumable item that heals the target for ${this.power} HP.`;
            } else {
                // Giảm cooldown theo level
                HealingPotion.DEFAULT_COOLDOWN -= 1;
                this.cooldown = HealingPotion.DEFAULT_COOLDOWN;
            }
        }
    }

}
