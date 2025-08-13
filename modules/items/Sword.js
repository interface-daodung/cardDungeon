/**
 * Class Sword - Kế thừa từ Item
 * Vũ khí kiếm trong game
 */
class Sword extends Item {
    static DEFAULT_DAMAGE = 8;
    static DEFAULT_COOLDOWN = 22;
    constructor(power = null, cooldown = null) {
        super(
            'Phôi kiếm',
            'sword',
            'resources/item/sword.webp',
            power ?? Sword.DEFAULT_DAMAGE,
            cooldown ?? Sword.DEFAULT_COOLDOWN,
            `Sword is a melee weapon that deals ${power ?? Sword.DEFAULT_DAMAGE} damage with balanced attack speed.`
        );

        // Thuộc tính riêng của Sword
        this.isConsumable = false;
    }

    /**
     * Sử dụng vũ khí kiếm
     * @param {Object} target - Mục tiêu tấn công
     * @returns {boolean} - True nếu sử dụng thành công
     */
    useItemEffect(animationManager) {
        if(animationManager.characterManager.getCharacterWeaponDurability() > 0) {
            animationManager.eventManager.onSellWeapon();
        }
        this.cooldown = Sword.DEFAULT_COOLDOWN;

        const weaponTypes = ['Sword0', 'Sword1', 'Sword2', 'Sword3', 'Sword4', 'Sword5', 'Sword6'];
        const randomWeapon = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
        
        const Weapon = animationManager.cardManager.cardFactory.createCard(randomWeapon);
        Weapon.durability = this.power;
        animationManager.characterManager.addWeaponToCharacter(Weapon);
        animationManager.startUseItemEffectAnimation(this.img);
        animationManager.updateCardStatus(animationManager.cardManager.findCharacterIndex());
    }

        /**
     * Nâng cấp item dựa trên level
     * @param {levelUp} level - Level hiện tại của item
     */
        isUpgrade(level) {
            for (let levelUp = 0; levelUp < level; levelUp++) {
                if (levelUp % 2 === 0) {
                    Sword.DEFAULT_DAMAGE += 1;
                    this.power = Sword.DEFAULT_DAMAGE;
                    
                    // Cập nhật description
                    this.description = `Sword is a melee weapon that deals ${this.power} damage with balanced attack speed.`;
                } else {
                    Sword.DEFAULT_COOLDOWN -= 1;
                    this.cooldown = Sword.DEFAULT_COOLDOWN;
                }
            }
        }

}
