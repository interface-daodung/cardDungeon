// Operative.js - Thẻ quái vật Operative
// Chức năng: Quái vật Operative

class Operative extends Card {
    constructor() {
        super(
            "Fatui - Đặc Vụ Băng",
            "enemy",
            "resources/operative.webp",
            "operative"
        );
        this.hp = this.GetRandom(1, 9); // HP từ 1-9
        this.score = this.GetRandom(1, 9); // Điểm khi tiêu diệt
        this.keepHp = 0;
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
            score: this.score,
            effect: `Character bị mất ${this.hp} HP, nhận ${this.score} điểm`
        };
    }

    cowardlyEffect(characterManager) {
        // Nếu character có vũ khí -> Operative sợ hãi (cowardly = true)
        if (characterManager.getCharacterWeaponDurability() > 0) {
            // Lưu HP hiện tại nếu chưa lưu
            if (this.keepHp === 0) {
                this.keepHp = this.hp;
            }
            // Set HP = 0 để hiển thị sợ hãi
            this.hp = 0;
            return true; // cowardly = true
        } else {
            // Nếu character không có vũ khí -> Operative mạnh dạn (cowardly = false)
            // Khôi phục HP từ keepHp nếu có
            if (this.keepHp > 0) {
                this.hp = this.keepHp;
                this.keepHp = 0; // Reset keepHp
            }
            return false; // cowardly = false
        }
    }
    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Đặc Vụ này là chiến binh hèn nhát, chỉ xuất hiện khi đối thủ đã kiệt sức hoặc tay không tấc sắt, chuyên đánh lén và trốn chạy.</i>`,
            hp: this.hp
        };
    }
} 
