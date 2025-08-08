// Coin5.js - Thẻ coin loại 5
// Chức năng: Thẻ coin cho điểm số

class Coin5 extends Card {
    constructor() {
        super(
            "Mảnh Vỡ Nguyên Tố Phong", 
            "coin", 
            "resources/coin5.webp", 
            "coin5"
        );
        this.score = this.GetRandom(1, 9); // Điểm từ 1-9
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
            description: `<strong>${this.type}</strong> - Score: <span class="score-text">${this.score}</span><br><i>Mảnh vỡ nguyên tố phong chứa đựng sức mạnh của gió tự do. Khi thu thập đủ 3 mảnh, chúng sẽ hợp nhất thành một viên ngọc quý giá hơn.</i>`,
            score: this.score
        };
    }
    
    /**
     * Hiệu ứng khi coin được upgrade (3 coin liên tục)
     * Tạo thẻ CoinUp5 với score gấp đôi
     */
    upCoinEffect() {
        // Tạo thẻ CoinUp5 với score gấp đôi
        const coinUp5 = new CoinUp5();
        coinUp5.score = this.score * 2;
        
        return {
            type: 'coin_upgrade',
            newCard: coinUp5,
            effect: `Upgrade thành CoinUp5 với score ${coinUp5.score}`
        };
    }
} 
