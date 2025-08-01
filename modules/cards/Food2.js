// Food2.js - Thẻ thức ăn đặc biệt Pizza Nấm Rơm Nướng
// Chức năng: Hồi phục HP dần dần

class Food2 extends Card {
    constructor() {
        super(
            "Pizza Nấm Rơm Nướng", 
            "food", 
            "resources/food2.webp", 
            "Thức ăn hồi phục đặc biệt"
        );
        this.heal = Math.floor(Math.random() * 9) + 2; // Tổng hồi phục 2-10 HP
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        //  set số lượt hồi phục dần dần
        characterManager.setRecovery(this.heal); // Trừ 1 vì đã hồi phục ngay
        
        // Loại bỏ độc nếu có
        const currentPoison = characterManager.getPoisoned();
        if (currentPoison > 0) {
            characterManager.setPoisoned(0); // Loại bỏ độc
        }
        
        return {
            score: 0, // Food không tăng điểm
            type: this.type,
            heal: this.heal,
            effect: `Character hồi phục 1 HP ngay + ${this.heal - 1} HP dần dần và loại bỏ độc`
        };
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `${this.name} - HP: +${this.heal} (1 HP/move), loại bỏ độc`,
            heal: this.heal
        };
    }
} 
