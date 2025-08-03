// Treasure1.js - Thẻ kho báu loại 1
// Chức năng: Kho báu cho điểm số

class Treasure1 extends Card {
    constructor() {
        super(
            "Kho Báu Dưới Đáy Biển", 
            "treasure", 
            "resources/treasure1.webp", 
            "Kho Báu Dưới Đáy Biển",
            "treasure1"
        );
        this.score = 0; // Điểm số nhận được
        this.durability = 1; // Độ bền của kho báu
    }
    
    interactWithCharacter(characterManager, gameState, cardManager) {
        // Giảm độ bền của kho báu
        this.durability -= 1;

        if(this.durability <= 0) {
            // Tạo reward ngẫu nhiên với tỷ lệ
            const random = Math.random();
            let rewardType, rewardCard;
            
            if (random < 0.5) {
                // 50% - Coin
                rewardType = 'coin';
                rewardCard = cardManager.cardFactory.createDynamicCoin(characterManager);
            } else if (random < 0.85) {
                // 35% - Food0-2
                const foodTypes = ['Food0', 'Food1', 'Food2'];
                const randomFood = foodTypes[Math.floor(Math.random() * foodTypes.length)];
                rewardType = 'food';
                rewardCard = cardManager.cardFactory.createCard(randomFood);
            } else {
                // 15% - Weapon ngẫu nhiên
                const weaponTypes = ['Sword0', 'Sword1', 'Sword2', 'Sword3', 'Sword4', 'Sword5', 'Sword6', 'Catalyst0', 'Catalyst1', 'Catalyst2'];
                const randomWeapon = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
                rewardType = 'weapon';
                rewardCard = cardManager.cardFactory.createCard(randomWeapon);
            }
            
            return {
                type: 'treasure_killed_by_interact',
                reward: {
                    type: rewardType,
                    card: rewardCard,
                    effect: `Kho Báu Dưới Đáy Biển đã bị hỏng! Nhận được ${rewardType}`
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
            description: `<strong>${this.type}</strong> - Effect: <span class="effect-text">Random Reward</span><br><i>Kho Báu Dưới Đáy Biển chứa đựng những bí mật của đại dương. Khi mở ra có thể nhận được coin, thức ăn hoặc vũ khí ngẫu nhiên.</i>`,
            score: 0
        };
    }
} 
