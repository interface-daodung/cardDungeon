/** cái này có thể xóa rồi 
 * Index file cho module items
 * Export tất cả các class liên quan đến item
 */

// Import các class
import { Item } from './Item.js';
import { ItemFactory } from './ItemFactory.js';
import { HealingPotion } from './HealingPotion.js';
import { Cooldown } from './Cooldown.js';
import { Repair } from './Repair.js';
import { WeaponUp } from './WeaponUp.js';
import { BlackHole } from './BlackHole.js';
import { InfuseDendro } from './InfuseDendro.js';
import { ResCryo } from './ResCryo.js';
import { ResPyro } from './ResPyro.js';
import { FoodUp } from './FoodUp.js';
import { Key } from './Key.js';
import { Teleportation } from './Teleportation.js';
import { Bow } from './Bow.js';
import { Sword } from './Sword.js';
import { Catalyst } from './Catalyst.js';
import { Damage } from './Damage.js';

// Export các class
export { 
    Item, 
    ItemFactory, 
    HealingPotion,
    Cooldown,
    Repair,
    WeaponUp,
    BlackHole,
    InfuseDendro,
    ResCryo,
    ResPyro,
    FoodUp,
    Key,
    Teleportation,
    Bow,
    Sword,
    Catalyst,
    Damage
};

// Export mặc định
export default {
    Item,
    ItemFactory,
    HealingPotion,
    Cooldown,
    Repair,
    WeaponUp,
    BlackHole,
    InfuseDendro,
    ResCryo,
    ResPyro,
    FoodUp,
    Key,
    Teleportation,
    Bow,
    Sword,
    Catalyst,
    Damage
};

// Nếu sử dụng CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Item: require('./Item.js'),
        ItemFactory: require('./ItemFactory.js'),
        HealingPotion: require('./HealingPotion.js'),
        Cooldown: require('./Cooldown.js'),
        Repair: require('./Repair.js'),
        WeaponUp: require('./WeaponUp.js'),
        BlackHole: require('./BlackHole.js'),
        InfuseDendro: require('./InfuseDendro.js'),
        ResCryo: require('./ResCryo.js'),
        ResPyro: require('./ResPyro.js'),
        FoodUp: require('./FoodUp.js'),
        Key: require('./Key.js'),
        Teleportation: require('./Teleportation.js'),
        Bow: require('./Bow.js'),
        Sword: require('./Sword.js'),
        Catalyst: require('./Catalyst.js'),
        Damage: require('./Damage.js')
    };
}
