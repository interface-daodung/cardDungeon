// CoinUp6.js - Thẻ coin tăng điểm loại 6
// Chức năng: Thẻ coin tăng điểm số

class CoinUp6 extends Card {
    constructor() {
        super(
            "Cộng Hưởng Nguyên Tố: Thảo Sinh Sôi", 
            "coin", 
            "resources/coinUp6.webp", 
            "coinUp6"
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
    cardEffect(characterManager = null, gameState = null, cardManager = null) {
        // Thêm điểm số 
        gameState.addScore(this.score,3);
        
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
            description: `<strong>${this.type}</strong> - Score: <span class="score-text">${this.score}</span><br><i>Cộng Hưởng Nguyên Tố: Thảo Sinh Sôi là mảnh vỡ nguyên tố thảo đã được nâng cấp. Chứa đựng sức mạnh sinh sôi và phát triển.</i>`,
            score: this.score
        };
    }
} 
