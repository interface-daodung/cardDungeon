// Trap.js - Thẻ bẫy
// Chức năng: Thẻ bẫy gây hại cho người chơi

class Trap extends Card {
    constructor() {
        super(
            "Cơ Quan Phun Lửa", 
            "trap", 
            "resources/trap.webp", 
            "Cơ Quan Phun Lửa"
        );
        this.damage = Math.floor(Math.random() * 7) + 10; // Sát thương của bẫy từ 1-7
        
        // Khởi tạo thuộc tính arrow với logic ngẫu nhiên
        this.initializeArrows();
    }
    
    /**
     * Khởi tạo các thuộc tính arrow theo tỷ lệ ngẫu nhiên
     */
    initializeArrows() {
        // Xác định số lượng arrow hiển thị
        const random = Math.random() * 100;
        let arrowCount;
        
        if (random < 50) {
            arrowCount = 2; // 50% có 2 arrow
        } else if (random < 75) {
            arrowCount = 3; // 25% có 3 arrow
        } else if (random < 95) {
            arrowCount = 1; // 20% có 1 arrow
        } else {
            arrowCount = 4; // 5% có 4 arrow
        }
        
        // Tạo mảng các hướng có thể
        const directions = ['arrowTop', 'arrowBottom', 'arrowLeft', 'arrowRight'];
        
        // Khởi tạo tất cả arrow = 0
        this.arrowTop = 0;
        this.arrowBottom = 0;
        this.arrowLeft = 0;
        this.arrowRight = 0;
        
        // Random chọn arrowCount hướng để set = 1
        for (let i = 0; i < arrowCount; i++) {
            const randomIndex = Math.floor(Math.random() * directions.length);
            const direction = directions[randomIndex];
            this[direction] = 1;
            
            // Xóa hướng đã chọn để tránh trùng lặp
            directions.splice(randomIndex, 1);
        }
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý thẻ (optional)
     * @returns {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager = null) {
        // Kiểm tra xem character có bị chỉ bởi arrow không
        const characterIndex = cardManager ? cardManager.findCharacterIndex() : null;
        const isCharacterTargeted = this.isCharacterTargetedByArrow(characterIndex, cardManager);
        
        if (isCharacterTargeted) {
            // Character bị chỉ bởi arrow - gây sát thương
            characterManager.updateCharacterHP(this.damage);
            
            return {
                type: 'trap',
                damage: this.damage,
                message: `Bị thương ${this.damage} HP từ bẫy!`,
                shouldTriggerAnimation: true,
                characterDamaged: true
            };
        } else {
            // Character không bị chỉ bởi arrow - không gây sát thương
            return {
                type: 'trap',
                damage: 0,
                message: `Bẫy không hoạt động!`,
                shouldTriggerAnimation: true,
                characterDamaged: false
            };
        }
    }
    
    /**
     * Kiểm tra xem character có bị chỉ bởi arrow không
     * @param {number} characterIndex - Index của character
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @returns {boolean} True nếu character bị chỉ bởi arrow
     */
    isCharacterTargetedByArrow(characterIndex, cardManager) {
        if (characterIndex === null || !cardManager) return false;
        
        const characterPos = { row: Math.floor(characterIndex / 3), col: characterIndex % 3 };
        const trapPos = this.position;
        
        // Kiểm tra từng hướng arrow
        if (this.arrowTop && trapPos.row > characterPos.row && trapPos.col === characterPos.col) {
            return true; // Arrow chỉ lên trên và character ở trên trap
        }
        if (this.arrowBottom && trapPos.row < characterPos.row && trapPos.col === characterPos.col) {
            return true; // Arrow chỉ xuống dưới và character ở dưới trap
        }
        if (this.arrowLeft && trapPos.col > characterPos.col && trapPos.row === characterPos.row) {
            return true; // Arrow chỉ sang trái và character ở bên trái trap
        }
        if (this.arrowRight && trapPos.col < characterPos.col && trapPos.row === characterPos.row) {
            return true; // Arrow chỉ sang phải và character ở bên phải trap
        }
        
        return false;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `Cơ Quan Phun Lửa - Gây ${this.damage} sát thương`,
            damage: this.damage
        };
    }
    
    /**
     * Xoay các arrow theo chiều kim đồng hồ
     * Top → Right → Bottom → Left → Top
     */
    transformationAgency() {
        const directions = [
            this.arrowTop,
            this.arrowRight,
            this.arrowBottom,
            this.arrowLeft
        ];

        // Xoay mảng 1 bước về bên phải (kim đồng hồ)
        const rotated = directions.map((_, i) => directions[(i + 3) % 4]);

        // Gán lại vào các thuộc tính
        this.arrowTop = rotated[0];
        this.arrowRight = rotated[1];
        this.arrowBottom = rotated[2];
        this.arrowLeft = rotated[3];
    }
} 