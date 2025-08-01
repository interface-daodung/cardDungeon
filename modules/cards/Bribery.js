// Bribery.js - Thẻ hối lộ
// Chức năng: Thẻ hối lộ cho điểm số

class Bribery extends Card {
    constructor() {
        super(
            "hối lộ", 
            "treasure", 
            "resources/bribery.webp", 
            "Hối lộ"
        ); 
        this.score = 0; // Điểm số nhận được
        this.durability = 1; // Độ bền của hối lộ
    }
    interactWithCharacter(characterManager, gameState, cardManager) {
        // Giảm độ bền của hối lộ
        this.durability -= 1;

        if(this.durability <= 0) {
            // Tạo reward ngẫu nhiên với tỷ lệ
            const random = Math.random();
            let rewardType, rewardCard;
            
            if (random < 0.8) {
                // 80% - Poison
                rewardType = 'trap';
                rewardCard = cardManager.cardFactory.createCard('Poison');
            } else if (random < 0.9) {
                // 10% - Boom
                rewardType = 'trap';
                rewardCard = cardManager.cardFactory.createCard('Boom');
            } else {
                // 10% - Quicksand
                rewardType = 'trap';
                rewardCard = cardManager.cardFactory.createCard('Quicksand');
            }
            
            return {
                type: 'treasure_killed_by_interact',
                reward: {
                    type: rewardType,
                    card: rewardCard,
                    effect: `Hối lộ đã bị phát hiện! Nhận được ${rewardType}`
                }
            };
        }
        
        return {
            type: 'treasure_interact',
            score: this.score,
            message: `Nhận được ${this.score} điểm! (Durability: ${this.durability})`
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
            description: `Hối lộ thể lấy ra điều bất ngờ`,
            score: 0
        };
    }
} 
