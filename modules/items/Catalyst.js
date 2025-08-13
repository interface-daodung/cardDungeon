/**
 * Class Catalyst - Kế thừa từ Item
 * Vũ khí pháp khí trong game
 */
class Catalyst extends Item {
    static DEFAULT_DAMAGE = 8;
    static DEFAULT_COOLDOWN = 20;
    constructor(power = null, cooldown = null) {
        super(
            'Phôi pháp khí',
            'catalyst',
            'resources/item/catalyst.webp',
            power ?? Catalyst.DEFAULT_DAMAGE,
            cooldown ?? Catalyst.DEFAULT_COOLDOWN,
            `Catalyst is a magical weapon that deals ${power ?? Catalyst.DEFAULT_DAMAGE} damage with elemental effects.`
        );

        // Thuộc tính riêng của Catalyst
        this.isConsumable = false;
    }

    /**
     * Sử dụng vũ khí pháp khí
     * @param {Object} target - Mục tiêu tấn công
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        if (animationManager.characterManager.getCharacterWeaponDurability() > 0) {
            animationManager.eventManager.onSellWeapon();
        }
        this.cooldown = Catalyst.DEFAULT_COOLDOWN;

        const weaponTypes = ['Catalyst0', 'Catalyst1', 'Catalyst2'];
        const randomWeapon = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];

        const Weapon = animationManager.cardManager.cardFactory.createCard(randomWeapon);
        Weapon.durability = this.power;
        animationManager.characterManager.addWeaponToCharacter(Weapon);
        animationManager.startUseItemEffectAnimation(this.img);
        animationManager.updateCardStatus(animationManager.cardManager.findCharacterIndex());
    }


    /**
     * Nâng cấp item dựa trên level
     * @param {number} level - Level hiện tại của item
     */
    isUpgrade(level) {
        for (let levelUp = 0; levelUp < level; levelUp++) {
            if (levelUp % 2 === 0) {
                Catalyst.DEFAULT_DAMAGE += 1;
                this.power = Catalyst.DEFAULT_DAMAGE;

                // Cập nhật description
                this.description = `Catalyst is a magical weapon that deals ${this.power} damage with elemental effects.`;
            } else {
                // Giảm cooldown theo level
                Catalyst.DEFAULT_COOLDOWN -= 1;
                this.cooldown = Catalyst.DEFAULT_COOLDOWN;
            }
        }
    }
}
