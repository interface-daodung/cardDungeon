// Bribery.js - Thẻ hối lộ
// Chức năng: Thẻ hối lộ cho điểm số

class Bribery extends Card {
    constructor() {
        super(
            "hối lộ", 
            "treasure", 
            "resources/bribery.webp", 
            "Hối lộ",
            "bribery"
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
                rewardType = 'food';
                rewardCard = cardManager.cardFactory.createCard('Poison');
            } else if (random < 0.9) {
                // 10% - Boom
                rewardType = 'boom';
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
        
        return null;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `<strong>${this.type}</strong> - Effect: <span class="effect-text">Bribery</span><br><i>Hối lộ là thẻ đặc biệt chứa đựng những phần thưởng bí mật. Khi tương tác, nó có thể mang lại thức ăn độc, bom nổ hoặc cát lún.</i>`,
            score: 0
        };
    }
} 
