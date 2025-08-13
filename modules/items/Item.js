/**
 * Class Item - Class cơ bản cho tất cả các item trong game
 * Chỉ dùng làm class mẫu, không dùng trực tiếp
 */
class Item {
    constructor(name, nameId, img, power, cooldown, description) {
        this.name = name;
        this.nameId = nameId;
        this.img = img;
        this.power = power;
        this.cooldown = cooldown;
        this.description = description;
    }

    // Các phương thức cơ bản sẽ được thêm sau
    /**
     * Lấy thông tin hiển thị
     */
    getDisplayInfo() {
        return {
            name: this.name,
            nameId: this.nameId,
            img: this.img,
            power: this.power,
            cooldown: this.cooldown,
            description: this.description
        };
    }
}
