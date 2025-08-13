/**
 * Class WeaponUp - Kế thừa từ Item
 * Item nâng cấp vũ khí trong game
 */
class WeaponUp extends Item {
    static DEFAULT_COOLDOWN = 22;
    static DEFAULT_ATTACK_BOOST = 8;
    constructor(power = null, cooldown = null) {
        super(
            'Nâng cấp vũ khí',
            'weaponUp',
            'resources/item/weaponUp.webp',
            power ?? WeaponUp.DEFAULT_ATTACK_BOOST,
            cooldown ?? WeaponUp.DEFAULT_COOLDOWN,
            `Weapon Up is a consumable item that upgrades weapon attack by ${power ?? WeaponUp.DEFAULT_ATTACK_BOOST} points.`
        );

        // Thuộc tính riêng của WeaponUp
        this.isConsumable = true;
    }

    /**
     * Sử dụng item nâng cấp vũ khí
     * @param {Object} target - Đối tượng được nâng cấp
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        const cards = animationManager.cardManager.getAllCards();

        // Lấy các thẻ type 'enemy' vào biến EnemyCards
        const weaponCards = cards.filter(card => card.type === 'weapon');

        // Nếu không có thẻ enemy thì return false
        if (weaponCards.length === 0) {
            return false;
        }

        this.cooldown = WeaponUp.DEFAULT_COOLDOWN;
        animationManager.startUseItemEffectAnimation(this.img);

        // Sử dụng EnemyCards đã lọc để forEach
        weaponCards.forEach(card => {
            card.takeDamageEffect(document.querySelector(`[data-card-id="${card.id}"]`),
                -this.power,
                'weaponUp',
                animationManager.characterManager,
                animationManager.cardManager
            );
        });

        return true;
    }

    /**
* Nâng cấp item dựa trên level
* @param {levelUp} level - Level hiện tại của item
*/
    isUpgrade(level) {
        for (let levelUp = 0; levelUp < level; levelUp++) {
            if (levelUp % 2 === 0) {
                WeaponUp.DEFAULT_ATTACK_BOOST += 1;
                this.power = WeaponUp.DEFAULT_ATTACK_BOOST;

                // Cập nhật description
                this.description = `Weapon Up is a consumable item that upgrades weapon attack by ${this.power} points.`;
            } else {
                WeaponUp.DEFAULT_COOLDOWN -= 1;
                this.cooldown = WeaponUp.DEFAULT_COOLDOWN;
            }
        }
    }
}
