/**
 * Class ItemFactory - Factory pattern để tạo các loại item khác nhau
 * Sử dụng Singleton pattern - chỉ có một instance duy nhất
 */
class ItemFactory {
    // Static instance để implement singleton
    static instance = null;

    constructor() {
        // Kiểm tra nếu đã có instance thì trả về instance cũ
        if (ItemFactory.instance) {
            return ItemFactory.instance;
        }

        // Map các nameId với class tương ứng
        this.itemClasses = new Map();
        this.initializeItemClasses();
        
        // Lưu instance vào static property
        ItemFactory.instance = this;
    }

    /**
     * Lấy instance duy nhất của ItemFactory (Singleton)
     * @returns {ItemFactory} Instance duy nhất
     */
    static getInstance() {
        if (!ItemFactory.instance) {
            ItemFactory.instance = new ItemFactory();
        }
        return ItemFactory.instance;
    }

    /**
     * Khởi tạo map các nameId với class tương ứng
     */
    initializeItemClasses() {
        this.itemClasses.set('healingPotion', HealingPotion);
        this.itemClasses.set('Cooldown', Cooldown);
        this.itemClasses.set('repair', Repair);
        this.itemClasses.set('WeaponUp', WeaponUp);
        this.itemClasses.set('blackHole', BlackHole);
        this.itemClasses.set('infuseDendro', InfuseDendro);
        this.itemClasses.set('resCryo', ResCryo);
        this.itemClasses.set('resPyro', ResPyro);
        this.itemClasses.set('foodUp', FoodUp);
        this.itemClasses.set('key', Key);
        this.itemClasses.set('teleportation', Teleportation);
        this.itemClasses.set('bow', Bow);
        this.itemClasses.set('sword', Sword);
        this.itemClasses.set('catalyst', Catalyst);
        this.itemClasses.set('damage', Damage);
    }

    /**
     * Tạo item mới theo nameId
     * @param {string} nameId - ID của item cần tạo
     * @param {number} power - Sức mạnh của item (optional)
     * @param {number} cooldown - Thời gian cooldown (optional)
     * @returns {Item} - Instance của item class tương ứng
     */
    createItem(nameId, power = null, cooldown = null) {
        const ItemClass = this.itemClasses.get(nameId);
        
        if (!ItemClass) {
            throw new Error(`Không tìm thấy item class cho nameId: ${nameId}`);
        }

        const item = new ItemClass(power, cooldown);
        
        // Kiểm tra nếu có level trong localStorage thì gọi hàm isUpgrade
        const level = localStorage.getItem(`${nameId}Level`);
        if (level !== null && item.isUpgrade) {
            item.isUpgrade(parseInt(level));
        }

        return item;
    }

    /**
     * Lấy danh sách tất cả các item class có sẵn
     * @returns {Array} - Mảng các object chứa thông tin item class
     */
    getItemClassList() {
        const itemList = [];
        
        this.itemClasses.forEach((ItemClass, nameId) => {
            // Tạo instance mẫu để lấy thông tin
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

    /**
     * Lấy danh sách nameId có sẵn
     * @returns {Array} - Mảng các nameId
     */
    getAvailableNameIds() {
        return Array.from(this.itemClasses.keys());
    }

    /**
     * Kiểm tra nameId có tồn tại không
     * @param {string} nameId - ID cần kiểm tra
     * @returns {boolean} - True nếu tồn tại
     */
    hasItemClass(nameId) {
        return this.itemClasses.has(nameId);
    }

    /**
     * Lấy số lượng item class có sẵn
     * @returns {number} - Số lượng item class
     */
    getItemClassCount() {
        return this.itemClasses.size;
    }

    // ===== STATIC METHODS - Sử dụng trực tiếp không cần new =====

    /**
     * Tạo item mới theo nameId (Static method)
     * @param {string} nameId - ID của item cần tạo
     * @param {number} power - Sức mạnh của item (optional)
     * @param {number} cooldown - Thời gian cooldown (optional)
     * @returns {Item} - Instance của item class tương ứng
     */
    static createItem(nameId, power = null, cooldown = null) {
        return ItemFactory.getInstance().createItem(nameId, power, cooldown);
    }

    /**
     * Lấy danh sách tất cả các item class có sẵn (Static method)
     * @returns {Array} - Mảng các object chứa thông tin item class
     */
    static getItemClassList() {
        return ItemFactory.getInstance().getItemClassList();
    }

    /**
     * Lấy danh sách nameId có sẵn (Static method)
     * @returns {Array} - Mảng các nameId
     */
    static getAvailableNameIds() {
        return ItemFactory.getInstance().getAvailableNameIds();
    }

    /**
     * Kiểm tra nameId có tồn tại không (Static method)
     * @param {string} nameId - ID cần kiểm tra
     * @returns {boolean} - True nếu tồn tại
     */
    static hasItemClass(nameId) {
        return ItemFactory.getInstance().hasItemClass(nameId);
    }

    /**
     * Lấy số lượng item class có sẵn (Static method)
     * @returns {number} - Số lượng item class
     */
    static getItemClassCount() {
        return ItemFactory.getInstance().getItemClassCount();
    }
}
