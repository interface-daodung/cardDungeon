// Narwhal.js - Thẻ quái vật Narwhal
// Chức năng: Quái vật Narwhal

class Narwhal extends Card {
    constructor() {
        super(
            "Thôn Tinh Kình Ngư", 
            "enemy", 
            "resources/narwhal.webp", 
            "boss Narwhal",
            "narwhal"
        );
        this.hp = Math.floor(Math.random() * 8) + 8; // HP từ 1-9
        this.score = Math.floor(Math.random() * 11) + 6; // Điểm khi tiêu diệt
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

    /**
     * Hiệu ứng khi thẻ bị tấn công bằng vũ khí nhưng còn HP
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {Array} cards - Mảng các thẻ trên bàn
     * @param {number} currentIndex - Vị trí hiện tại của thẻ
     * @returns {Object} Thông tin kết quả
     */
    attackByWeaponEffect(cards, currentIndex) {
        // Tìm vị trí khác không phải character để đổi chỗ
        const availablePositions = [];
        for (let i = 0; i < cards.length; i++) {
            if (i !== currentIndex && cards[i] && cards[i].type !== 'character') {
                availablePositions.push(i);
            }
        }
        
        if (availablePositions.length > 0) {
            // Chọn vị trí ngẫu nhiên để đổi chỗ
            const randomIndex = availablePositions[Math.floor(Math.random() * availablePositions.length)];
            
            // Đổi chỗ 2 thẻ
            const temp = cards[currentIndex];
            cards[currentIndex] = cards[randomIndex];
            cards[randomIndex] = temp;
            
            return {
                type: 'enemy_attacked_by_weapon',
                effect: `Narwhal đổi vị trí với thẻ khác!`,
                newPosition: randomIndex,
                oldPosition: currentIndex
            };
        }
        
        return null; // Không có vị trí nào để đổi
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Thôn Tinh Kình Ngư là quái vật biển khổng lồ với sừng dài. Khi bị tấn công, nó có thể đổi vị trí với các thẻ khác để tránh sát thương.</i>`,
            hp: this.hp
        };
    }
} 
