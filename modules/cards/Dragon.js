// Dragon.js - Thẻ quái vật Dragon
// Chức năng: Quái vật rồng bị nguyền rủa

class Dragon extends Card {
    constructor() {
        super(
            "Ác Long Bị Nguyền Rủa", // name
            "enemy", // type
            "resources/dragon.webp", // image
            "dragon" // nameId
        );
        this.hp = this.GetRandom(8, 16); // HP từ 8-15
        this.score = this.GetRandom(6, 12); // Điểm khi tiêu diệt
        //this.curse = false;
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager = null, gameState = null, cardManager = null) {
        // Character bị mất HP bằng với HP của quái vật
        characterManager.damageCharacterHP(this.hp);

        // Cộng điểm khi ăn enemy
        gameState.addScore(this.score);

        return {
            score: this.score,
            type: this.type,
            hp: this.hp,
            effect: `Character bị mất ${this.hp} HP, nhận ${this.score} điểm`
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
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Ác Long cổ đại bị nguyền rủa bởi Huyền Thiên, vĩnh viễn chìm trong đau đớn và thù hận, không bao giờ được siêu thoát.</i>`,
            hp: this.hp
        };
    }
}