// Items Bundle - JavaScript thuần không sử dụng ES6 modules

// Base Item class
class Item {
    constructor(power = 0, cooldown = 0) {
        this.name = 'Base Item';
        this.img = 'resources/item/chest.webp';
        this.power = power;
        this.cooldown = cooldown;
        this.description = 'Một item cơ bản';
        this.isConsumable = false;
    }
}

// HealingPotion class
class HealingPotion extends Item {
    constructor(power = 50, cooldown = 30) {
        super(power, cooldown);
        this.name = 'Thuốc Hồi Máu';
        this.img = 'resources/item/healingPotion.webp';
        this.description = 'Khôi phục máu cho nhân vật';
        this.isConsumable = true;
    }
}

// Cooldown class
class Cooldown extends Item {
    constructor(power = 20, cooldown = 15) {
        super(power, cooldown);
        this.name = 'Giảm Cooldown';
        this.img = 'resources/item/Cooldown.webp';
        this.description = 'Giảm thời gian cooldown của kỹ năng';
        this.isConsumable = true;
    }
}

// Repair class
class Repair extends Item {
    constructor(power = 30, cooldown = 45) {
        super(power, cooldown);
        this.name = 'Sửa Chữa';
        this.img = 'resources/item/repair.webp';
        this.description = 'Sửa chữa vũ khí bị hỏng';
        this.isConsumable = true;
    }
}

// WeaponUp class
class WeaponUp extends Item {
    constructor(power = 40, cooldown = 60) {
        super(power, cooldown);
        this.name = 'Nâng Cấp Vũ Khí';
        this.img = 'resources/item/weaponUp.webp';
        this.description = 'Tăng sức mạnh vũ khí';
        this.isConsumable = true;
    }
}

// BlackHole class
class BlackHole extends Item {
    constructor(power = 100, cooldown = 120) {
        super(power, cooldown);
        this.name = 'Hố Đen';
        this.img = 'resources/item/blackHole.webp';
        this.description = 'Tạo hố đen hút kẻ địch';
        this.isConsumable = true;
    }
}

// InfuseDendro class
class InfuseDendro extends Item {
    constructor(power = 35, cooldown = 25) {
        super(power, cooldown);
        this.name = 'Truyền Dendro';
        this.img = 'resources/item/infuseDendro.webp';
        this.description = 'Truyền nguyên tố Dendro vào vũ khí';
        this.isConsumable = true;
    }
}

// ResCryo class
class ResCryo extends Item {
    constructor(power = 25, cooldown = 20) {
        super(power, cooldown);
        this.name = 'Kháng Cryo';
        this.img = 'resources/item/resCryo.webp';
        this.description = 'Tăng kháng nguyên tố Cryo';
        this.isConsumable = true;
    }
}

// ResPyro class
class ResPyro extends Item {
    constructor(power = 25, cooldown = 20) {
        super(power, cooldown);
        this.name = 'Kháng Pyro';
        this.img = 'resources/item/resPyro.webp';
        this.description = 'Tăng kháng nguyên tố Pyro';
        this.isConsumable = true;
    }
}

// FoodUp class
class FoodUp extends Item {
    constructor(power = 30, cooldown = 40) {
        super(power, cooldown);
        this.name = 'Tăng Thức Ăn';
        this.img = 'resources/item/foodUp.webp';
        this.description = 'Tăng hiệu quả của thức ăn';
        this.isConsumable = true;
    }
}

// Key class
class Key extends Item {
    constructor(power = 0, cooldown = 0) {
        super(power, cooldown);
        this.name = 'Chìa Khóa';
        this.img = 'resources/item/key.webp';
        this.description = 'Mở khóa các cánh cửa bí mật';
        this.isConsumable = false;
    }
}

// Teleportation class
class Teleportation extends Item {
    constructor(power = 0, cooldown = 90) {
        super(power, cooldown);
        this.name = 'Dịch Chuyển';
        this.img = 'resources/item/teleportation.webp';
        this.description = 'Dịch chuyển đến vị trí khác';
        this.isConsumable = true;
    }
}

// Bow class
class Bow extends Item {
    constructor(power = 45, cooldown = 8) {
        super(power, cooldown);
        this.name = 'Cung Tên';
        this.img = 'resources/item/bow.webp';
        this.description = 'Vũ khí tầm xa, bắn mũi tên';
        this.isConsumable = false;
    }
}

// Sword class
class Sword extends Item {
    constructor(power = 60, cooldown = 5) {
        super(power, cooldown);
        this.name = 'Kiếm';
        this.img = 'resources/item/sword.webp';
        this.description = 'Vũ khí cận chiến mạnh mẽ';
        this.isConsumable = false;
    }
}

// Catalyst class
class Catalyst extends Item {
    constructor(power = 55, cooldown = 10) {
        super(power, cooldown);
        this.name = 'Pháp Khí';
        this.img = 'resources/item/catalyst.webp';
        this.description = 'Vũ khí phép thuật';
        this.isConsumable = false;
    }
}

// Damage class
class Damage extends Item {
    constructor(power = 80, cooldown = 15) {
        super(power, cooldown);
        this.name = 'Tăng Sát Thương';
        this.img = 'resources/item/damage.webp';
        this.description = 'Tăng sát thương gây ra';
        this.isConsumable = true;
    }
}

// ItemFactory class
class ItemFactory {
    constructor() {
        this.itemClasses = new Map();
        this.initializeItemClasses();
    }

    initializeItemClasses() {
        this.itemClasses.set('healingPotion', HealingPotion);
        this.itemClasses.set('damage', Damage);
        this.itemClasses.set('infuseDendro', InfuseDendro);
        this.itemClasses.set('repair', Repair);
        this.itemClasses.set('WeaponUp', WeaponUp);
        this.itemClasses.set('foodUp', FoodUp);
        this.itemClasses.set('blackHole', BlackHole);
        this.itemClasses.set('key', Key);
        this.itemClasses.set('teleportation', Teleportation);
        this.itemClasses.set('Cooldown', Cooldown);
        this.itemClasses.set('bow', Bow);
        this.itemClasses.set('sword', Sword);
        this.itemClasses.set('catalyst', Catalyst);
        this.itemClasses.set('resCryo', ResCryo);
        this.itemClasses.set('resPyro', ResPyro);
    }

    createItem(nameId, power = null, cooldown = null) {
        const ItemClass = this.itemClasses.get(nameId);
        
        if (!ItemClass) {
            throw new Error(`Không tìm thấy item class cho nameId: ${nameId}`);
        }

        return new ItemClass(power, cooldown);
    }

    getItemClassList() {
        const itemList = [];
        
        this.itemClasses.forEach((ItemClass, nameId) => {
            const sampleItem = new ItemClass();
            
            itemList.push({
                nameId: nameId,
                className: ItemClass.name,
                name: sampleItem.name,
                img: sampleItem.img,
                power: sampleItem.power,
                cooldown: sampleItem.cooldown,
                description: sampleItem.description,
                isConsumable: sampleItem.isConsumable || false
            });
        });

        return itemList;
    }

    getAvailableNameIds() {
        return Array.from(this.itemClasses.keys());
    }

    hasItemClass(nameId) {
        return this.itemClasses.has(nameId);
    }

    getItemClassCount() {
        return this.itemClasses.size;
    }
}

// Export to global scope
window.Item = Item;
window.ItemFactory = ItemFactory;
window.HealingPotion = HealingPotion;
window.Cooldown = Cooldown;
window.Repair = Repair;
window.WeaponUp = WeaponUp;
window.BlackHole = BlackHole;
window.InfuseDendro = InfuseDendro;
window.ResCryo = ResCryo;
window.ResPyro = ResPyro;
window.FoodUp = FoodUp;
window.Key = Key;
window.Teleportation = Teleportation;
window.Bow = Bow;
window.Sword = Sword;
window.Catalyst = Catalyst;
window.Damage = Damage;

