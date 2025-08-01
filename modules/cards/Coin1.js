// Coin1.js - Thẻ coin loại 1
// Chức năng: Thẻ coin cho điểm số

class Coin1 extends Card {
    constructor() {
        super(
            "Mảnh Vỡ Nguyên Tố Thủy", 
            "coin", 
            "resources/coin1.webp", 
            "Coin loại 1"
        );
        this.score = Math.floor(Math.random() * 9) + 1; // Điểm từ 1-9
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        // Thêm điểm số
        gameState.addScore(this.score);
        
        return {
            type: 'coin',
            score: this.score,
            message: `Nhận được ${this.score} điểm!`
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
            description: `Cộng Hưởng Nguyên Tố: Thủy Giao Thoa - Nhận ${this.score} điểm`,
            score: this.score
        };
    }
} 
