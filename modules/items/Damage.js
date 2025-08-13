/**
 * Class Damage - Kế thừa từ Item
 * Item tăng sát thương trong game
 */
class Damage extends Item {
    static DEFAULT_DAMAGE_BOOST = 4;
    static DEFAULT_COOLDOWN = 20;
    constructor(power = null, cooldown = null) {
        super(
            'Vuốt hung thú viễn cổ',
            'damage',
            'resources/item/damage.webp',
            power ?? Damage.DEFAULT_DAMAGE_BOOST,
            cooldown ?? Damage.DEFAULT_COOLDOWN,
            `Damage Boost is a consumable item that increases damage by ${power ?? Damage.DEFAULT_DAMAGE_BOOST} points.`
        );

        // Thuộc tính riêng của Damage
        this.isConsumable = true;
        this.damageBoost = power; // Lượng tăng sát thương
    }

    /**
     * Sử dụng item tăng sát thương
     * @param {Object} target - Đối tượng được tăng sát thương
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        const cards = animationManager.cardManager.getAllCards();

        // Lấy các thẻ type 'enemy' vào biến EnemyCards
        const EnemyCards = cards.filter(card => card.type === 'enemy');

        // Nếu không có thẻ enemy thì return false
        if (EnemyCards.length === 0) {
            return false;
        }

        this.cooldown = Damage.DEFAULT_COOLDOWN;
        animationManager.startUseItemEffectAnimation(this.img);

        // Sử dụng EnemyCards đã lọc để forEach
        EnemyCards.forEach(card => {
            card.takeDamageEffect(document.querySelector(`[data-card-id="${card.id}"]`),
                this.power,
                'item',
                animationManager.characterManager,
                animationManager.cardManager
            );
        });

        return true;
    }


    /**
     * Nâng cấp item dựa trên level
     * @param {number} level - Level hiện tại của item
     */
    isUpgrade(level) {
        for (let levelUp = 0; levelUp < level; levelUp++) {
            if (levelUp % 2 === 0) {
                Damage.DEFAULT_DAMAGE_BOOST += 1;
                this.power = Damage.DEFAULT_DAMAGE_BOOST;

                // Cập nhật description
                this.description = `Damage Boost is a consumable item that increases damage by ${this.power} points.`;
            } else {
                // Giảm cooldown theo level
                Damage.DEFAULT_COOLDOWN -= 1;
                this.cooldown = Damage.DEFAULT_COOLDOWN;
            }
        }
    }
}
