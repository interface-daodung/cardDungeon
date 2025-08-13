// CoinUp4.js - Thẻ coin tăng điểm loại 4
// Chức năng: Thẻ coin tăng điểm số

class CoinUp4 extends Card {
    constructor() {
        super(
            "Cộng Hưởng Nguyên Tố: Nham Kiên Cố", 
            "coin", 
            "resources/coinUp4.webp", 
            "coinUp4"
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
            description: `<strong>${this.type}</strong> - Score: <span class="score-text">${this.score}</span><br><i>Cộng Hưởng Nguyên Tố: Nham Kiên Cố là mảnh vỡ nguyên tố nham đã được nâng cấp. Chứa đựng sức mạnh kiên cố và bền vững.</i>`,
            score: this.score
        };
    }
} 
