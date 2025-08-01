// Void.js - Thẻ void không có tác dụng
// Chức năng: Thẻ trống không có tác dụng gì, chỉ được tạo bởi hàm cụ thể

class Void extends Card {
    constructor() {
        super(
            "Trống", 
            "coin", // Phân loại là coin nhưng không cộng điểm
            "resources/void.webp", 
            "Thẻ trống không có tác dụng"
        );
        this.score = 0; // Không cộng điểm
    }

    /**
     * Hiệu ứng khi thẻ bị ăn (không có tác dụng gì)
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @returns {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        console.log(`🕳️ Void.cardEffect: Thẻ trống không có tác dụng`);
        
        const result = {
            score: 0, // Không cộng điểm
            type: this.type,
            effect: `Thẻ trống không có tác dụng`
        };
        
        console.log(`🕳️ Void.cardEffect: Kết quả:`, result);
        return result;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `Thẻ trống không có tác dụng - Không cộng điểm`,
            score: 0
        };
    }
} 