// Narwhal.js - Thẻ quái vật Narwhal
// Chức năng: Quái vật Narwhal

class Narwhal extends Card {
    constructor() {
        super(
            "Thôn Tinh Kình Ngư",
            "enemy",
            "resources/narwhal.webp",
            "narwhal"
        );
        this.hp = this.GetRandom(8, 16); // HP từ 8-15
        this.score = this.GetRandom(2, 18); // Điểm khi tiêu diệt
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager = null, gameState = null, cardManager = null) {
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
    attackByWeaponEffect(cards, currentIndex, cardManager, animationManager) {
        // Tìm vị trí khác không phải character để đổi chỗ
        const availablePositions = [];
        for (let i = 0; i < cards.length; i++) {
            console.log(`i=${i}, card=`, cards[i]);
            if (i !== currentIndex && cards[i] && cards[i].type !== 'character') {
                availablePositions.push(i);
            }
        }
        console.log(`  ------availablePositions --${availablePositions[0]}---------   `)
        if (availablePositions.length > 0) {
            // Chọn vị trí ngẫu nhiên để đổi chỗ
            const randomIndex = availablePositions[this.GetRandom(0, availablePositions.length - 1)];

            // Đổi chỗ 2 thẻ
            [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];

            // Cập nhật lại id và vị trí cho cả hai thẻ
            for (const i of [currentIndex, randomIndex]) {
                const card = cards[i];
                if (card) {
                    card.id = i;
                    card.position = {
                        row: Math.floor(i / 3),
                        col: i % 3
                    };
                }
            }

           // console.log(`  ------availablePositions --${!animationManager.flipCards}---------   `)

            console.log('Gọi flipCards với:', currentIndex, randomIndex, animationManager);
            cardManager.setAllCards(cards);

            // Thêm hiệu ứng flip cho cả 2 thẻ
            animationManager.flipCards(
                currentIndex,
                randomIndex,
                () => {
                    // Callback sau khi animation hoàn thành
                    animationManager.updateEntireGrid();
                    //this.setupCardEventsAfterCombat();
                    //animationManager.eventManager.setupCardEvents();
                }
            );

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
