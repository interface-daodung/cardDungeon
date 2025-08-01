// Card.js - Class cơ bản cho tất cả các thẻ
// Chức năng: Định nghĩa interface và thuộc tính chung cho tất cả thẻ

class Card {
    /**
     * Khởi tạo thẻ cơ bản
     * @param {string} name - Tên thẻ
     * @param {string} type - Loại thẻ (enemy, food, sword, coin, character)
     * @param {string} image - Đường dẫn hình ảnh
     * @param {string} description - Mô tả thẻ
     */
    constructor(name, type, image, description) {
        this.name = name;
        this.type = type;
        this.image = image;
        this.description = description;
        this.nameId = this.extractNameId(image); // Tên của image file
        this.id = null; // Sẽ được set bởi CardManager
        this.position = null; // Sẽ được set bởi CardManager
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý thẻ (optional)
     * @returns {Object|null} Thông tin kết quả hoặc null
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Override trong các class con
        return null;
    }

    /**
     * Hiệu ứng khi thẻ bị giết bởi vũ khí
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns {Object|null} Thông tin kết quả hoặc null
     */
    killByWeaponEffect(characterManager, gameState) {
        // Override trong các class enemy
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        return {
            name: this.name,
            type: this.type,
            image: this.image,
            description: this.description,
            nameId: this.nameId
        };
    }

    /**
     * Trích xuất nameId từ đường dẫn image
     * @param {string} image - Đường dẫn image
     * @returns {string} Tên của image file (không có extension)
     */
    extractNameId(image) {
        // Lấy tên file từ đường dẫn
        const fileName = image.split('/').pop();
        // Loại bỏ extension (.webp, .png, etc.)
        return fileName.split('.')[0];
    }

    /**
     * Clone thẻ này
     * @returns {Card} Bản sao của thẻ
     */
    clone() {
        const cloned = new this.constructor();
        Object.assign(cloned, this);
        return cloned;
    }
} 