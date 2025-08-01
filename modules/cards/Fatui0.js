// Fatui0.js - Thẻ quái vật Fatui0
// Chức năng: Quái vật cơ bản với HP ngẫu nhiên

class Fatui0 extends Card {
    constructor() {
        super(
            "Fatui - Thuật Sĩ Cicin Lôi", 
            "enemy", 
            "resources/fatui0.webp", 
            "Quái vật Fatui cơ bản"
        );
        this.hp = Math.floor(Math.random() * 9) + 1; // HP từ 1-9
        this.score = Math.floor(Math.random() * 9) + 1; // Điểm khi tiêu diệt
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        console.log(`👹 Fatui0.cardEffect: HP của quái vật = ${this.hp}`);
        
        // Character bị mất HP bằng với HP của quái vật
        characterManager.updateCharacterHP(this.hp);
        
        // Cộng điểm khi ăn enemy
        gameState.addScore(this.score);
        
        const result = {
            score: this.score,
            type: this.type,
            hp: this.hp,
            effect: `Character bị mất ${this.hp} HP, nhận ${this.score} điểm`
        };
        
        console.log(`👹 Fatui0.cardEffect: Kết quả =`, result);
        return result;
    }

    /**
     * Hiệu ứng khi thẻ bị giết bởi vũ khí
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    killByWeaponEffect(characterManager, gameState) {
        // Fatui0 khi bị giết bởi vũ khí sẽ tạo ra coin (mặc định)
        return {
            type: 'enemy_killed_by_weapon',
            reward: {
                type: 'coin',
                effect: `Fatui0 bị giết! Nhận được coin`
            }
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
            description: `Quái vật thông thường - HP: ${this.hp}`,
            hp: this.hp
        };
    }
} 
