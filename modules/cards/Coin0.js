// Coin0.js - Thẻ coin loại 0
// Chức năng: Thẻ coin cho điểm số

class Coin0 extends Card {
    constructor() {
        super(
            "Mảnh Vỡ Nguyên Tố Băng", 
            "coin", 
            "resources/coin0.webp", 
            "Coin loại 0",
            "coin0"
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
            description: `<strong>${this.type}</strong> - Score: <span class="score-text">${this.score}</span><br><i>Mảnh vỡ nguyên tố băng chứa đựng sức mạnh của vùng đất lạnh giá. Khi thu thập đủ 3 mảnh, chúng sẽ hợp nhất thành một viên ngọc quý giá hơn.</i>`,
            score: this.score
        };
    }
    
    /**
     * Hiệu ứng khi coin được upgrade (3 coin liên tục)
     * Tạo thẻ CoinUp0 với score gấp đôi
     */
    upCoinEffect() {
        // console.log(`🎯 Coin0 upCoinEffect được gọi, score hiện tại: ${this.score}`);
        
        // Tạo thẻ CoinUp0 với score gấp đôi
        const coinUp0 = new CoinUp0();
        coinUp0.score = this.score * 2;
        // console.log(`🎯 Tạo CoinUp0 với score: ${coinUp0.score}`);
        
        return {
            type: 'coin_upgrade',
            newCard: coinUp0,
            effect: `Upgrade thành CoinUp0 với score ${coinUp0.score}`
        };
    }
} 
