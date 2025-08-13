/**
 * Class InfuseDendro - Kế thừa từ Item
 * Item truyền nguyên tố Dendro trong game
 */
class InfuseDendro extends Item {
    static DEFAULT_COOLDOWN = 28;
    static DEFAULT_ELEMENT_DURATION = 1;
    constructor(power = null, cooldown = null) {
        super(
            'Đầu Độc',
            'infuseDendro',
            'resources/item/infuseDendro.webp',
            power ?? InfuseDendro.DEFAULT_ELEMENT_DURATION,
            cooldown ?? InfuseDendro.DEFAULT_COOLDOWN,
            `Infuse Dendro is a consumable item that infuses Dendro element for ${power ?? InfuseDendro.DEFAULT_ELEMENT_DURATION} seconds.`
        );

        // Thuộc tính riêng của InfuseDendro
        this.isConsumable = true;
        this.elementDuration = power; // Thời gian duy trì nguyên tố
        this.elementType = 'Dendro';
    }

    /**
     * Sử dụng item truyền nguyên tố Dendro
     * @param {Object} target - Đối tượng được truyền nguyên tố
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

        this.cooldown = InfuseDendro.DEFAULT_COOLDOWN;
        animationManager.startUseItemEffectAnimation(this.img);

        // Sử dụng EnemyCards đã lọc để forEach
        EnemyCards.forEach(card => {
            card.takeDamageEffect(document.querySelector(`[data-card-id="${card.id}"]`),
                this.power,
                'Forest',
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

            // Giảm cooldown theo level
            InfuseDendro.DEFAULT_COOLDOWN -= 1;
            this.cooldown = InfuseDendro.DEFAULT_COOLDOWN;

        }
    }
}
