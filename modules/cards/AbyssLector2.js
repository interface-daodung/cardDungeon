// AbyssLector2.js - Thẻ quái vật Abyss Lector loại 2
// Chức năng: Quái vật Abyss Lector rất mạnh

class AbyssLector2 extends Card {
    constructor() {
        super(
            "Sứ Đồ Vực Sâu - Lưu Kích",
            "enemy", 
            "resources/abyssLector2.webp", 
            "Abyss Lector loại 2",
            "abyssLector2"
        );
        this.hp = Math.floor(Math.random() * 9) + 5; // HP từ 1-9
        this.shield = 1; // Shield của quái vật 
        this.score = Math.floor(Math.random() * 10) + 3; // Điểm từ 3-12
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        // Quái vật gây sát thương cho character
        characterManager.damageCharacterHP(this.hp);
        
        // Cộng điểm khi ăn enemy
        gameState.addScore(this.score);
        
        return {
            type: 'enemy',
            hp: this.hp,
            score: score,
            effect: `Character bị mất ${this.hp} HP, nhận ${score} điểm`
        };
    }

    /**
     * Hiệu ứng khi thẻ bị giết bởi vũ khí
     * @param {CharacterManager} characterManager - Manager quản lý character (optional)
     * @returns {Object|null} Thông tin kết quả hoặc null
     */
    killByWeaponEffect(characterManager = null) {
        // Chỉ có hiệu ứng khi shield = 1
        if (this.shield === 1) {
            // Tạo thẻ AbyssLector2 mới với HP ngẫu nhiên và shield = 0
            const newAbyssLector = new AbyssLector2();
            newAbyssLector.hp = Math.floor(Math.random() * 3) + 1; // HP từ 1-3
            newAbyssLector.shield = 0; // Không có shield
            
            return {
                type: 'enemy_killed_by_weapon',
                reward: {
                    type: 'abysslector',
                    card: newAbyssLector,
                    effect: `Tạo AbyssLector2 mới - HP: ${newAbyssLector.hp}`
                }
            };
        }
        
        // Nếu shield = 0 thì trả về null để tạo coin như bình thường
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
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Bậc thầy vực sâu với khả năng điều khiển lưu kích. Khi bị tiêu diệt, hắn sẽ tái sinh với sức mạnh giảm sút nhưng vẫn đáng sợ.</i>`,
            hp: this.hp
        };
    }
} 
