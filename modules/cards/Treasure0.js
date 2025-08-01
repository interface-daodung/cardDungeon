// Treasure0.js - Thẻ kho báu loại 0
// Chức năng: Kho báu cho điểm số

class Treasure0 extends Card {
    constructor() {
        super(
            "Mỏ Vàng", 
            "treasure", 
            "resources/treasure0.webp", 
            "Mỏ Vàng"
        );
        this.score =  Math.floor(Math.random() * 9) + 1; // Điểm số nhận được từ 1-9
        this.durability = 5; // Độ bền của kho báu
    }


    interactWithCharacter(characterManager, gameState, cardManager) {
        // Giảm độ bền của kho báu
        this.durability -= 1;
        // Thêm điểm số
        gameState.addScore(this.score);
        
        if(this.durability <= 0) {
            // Tạo coin mới thay thế treasure
            const rewardCard = cardManager.cardFactory.createDynamicCoin(characterManager);
            
            return {
                type: 'treasure_killed_by_interact',
                reward: {
                    type: 'coin',
                    card: rewardCard,
                    effect: `Mỏ Vàng đã bị hỏng! Nhận được coin`
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
            description: `Mỏ Vàng tương tác Nhận ${this.score} điểm`,
            score: 0
        };
    }
} 
