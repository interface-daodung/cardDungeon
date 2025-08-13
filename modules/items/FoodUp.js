/**
 * Class FoodUp - Kế thừa từ Item
 * Item nâng cấp thức ăn trong game
 */
class FoodUp extends Item {
    static DEFAULT_COOLDOWN = 20;
    static DEFAULT_HEALING_BOOST = 4;
    constructor(power = null, cooldown = null) {
        super(
            'Gia vị vạn năng',
            'foodUp',
            'resources/item/foodUp.webp',
            power ?? FoodUp.DEFAULT_HEALING_BOOST,
            cooldown ?? FoodUp.DEFAULT_COOLDOWN,
            `Food Up is a consumable item that enhances food healing by ${power ?? FoodUp.DEFAULT_HEALING_BOOST} points.`
        );

        // Thuộc tính riêng của FoodUp
        this.isConsumable = true;
        this.healingBoost = power; // Lượng tăng hồi máu
    }

    /**
     * Sử dụng item nâng cấp thức ăn
     * @param {Object} target - Đối tượng được nâng cấp
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        const cards = animationManager.cardManager.getAllCards();

        // Lấy các thẻ type 'enemy' vào biến EnemyCards
        const foodCards = cards.filter(card => card.type === 'food');

        // Nếu không có thẻ enemy thì return false
        if (foodCards.length === 0) {
            return false;
        }

        this.cooldown = FoodUp.DEFAULT_COOLDOWN;
        animationManager.startUseItemEffectAnimation(this.img);

        // Sử dụng EnemyCards đã lọc để forEach
        foodCards.forEach(card => {
            card.takeDamageEffect(document.querySelector(`[data-card-id="${card.id}"]`),
                -this.power,
                'foodUp',
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
                FoodUp.DEFAULT_HEALING_BOOST += 1;
                this.power = FoodUp.DEFAULT_HEALING_BOOST;

                // Cập nhật description
                this.description = `Food Up is a consumable item that enhances food healing by ${this.power} points.`;
            } else {
                // Giảm cooldown theo level
                FoodUp.DEFAULT_COOLDOWN -= 1;
                this.cooldown = FoodUp.DEFAULT_COOLDOWN;
            }
        }
    }
}
