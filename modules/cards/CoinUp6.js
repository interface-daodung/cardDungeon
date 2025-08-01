// CoinUp6.js - Thẻ coin tăng điểm loại 6
// Chức năng: Thẻ coin tăng điểm số

class CoinUp6 extends Card {
    constructor() {
        super(
            "Cộng Hưởng Nguyên Tố: Thảo Sinh Sôi", 
            "coinUp", 
            "resources/coinUp6.webp", 
            "Coin tăng điểm loại 6"
        );
        this.score = 0; // Điểm số mặc định (có thể được override)
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
            type: 'coinUp',
            score: this.score,
            message: `Nhận được ${this.score} điểm từ coin tăng!`
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
            description: `Coin tăng điểm lớn - Nhận ${this.score} điểm`,
            score: this.score
        };
    }
} 
