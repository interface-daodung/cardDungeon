// Fatui1.js - Thẻ quái vật Fatui1
// Chức năng: Quái vật mạnh hơn với HP cao hơn

class Fatui1 extends Card {
    constructor() {
        super(
            "Fatui - Người Xử Lý Nợ Hỏa",
            "enemy",
            "resources/fatui1.webp",
            "fatui1"
        );
        this.hp = this.GetRandom(1, 9); // HP từ 1-9
        this.score = this.GetRandom(1, 9); // Điểm khi tiêu diệt
        this.repaymentReceipt = 0; // Số tiền nợ
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
     * Lấy danh sách các thẻ coin liền kề có nameId dài 5 ký tự
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @param {number} index - Vị trí của thẻ hiện tại
     * @returns {Array} Mảng các index của thẻ coin liền kề
     */
    getAdjacentCards(cardManager, index) {
        const adjacentCards = [];
        const row = Math.floor(index / 3);
        const col = index % 3;

        // Kiểm tra các vị trí liền kề
        const adjacentPositions = [
            { row: row - 1, col: col }, // Trên
            { row: row + 1, col: col }, // Dưới
            { row: row, col: col - 1 }, // Trái
            { row: row, col: col + 1 }  // Phải
        ];

        for (const pos of adjacentPositions) {
            // Kiểm tra vị trí hợp lệ (trong grid 3x3)
            if (pos.row >= 0 && pos.row < 3 && pos.col >= 0 && pos.col < 3) {
                const index = pos.row * 3 + pos.col;
                const card = cardManager.getCard(index);
                // Chỉ bao gồm coin có nameId dài 5 ký tự
                if (card && card.type === 'coin' && card.nameId.length === 5 && card.score !== 0) {
                    adjacentCards.push(index);
                }
            }
        }

        return adjacentCards;
    }

    /**
     * Hiệu ứng thu nợ - gây damage cho thẻ coin liền kề
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @param {number} index - Vị trí của thẻ hiện tại
     * @returns {Object|null} Thông tin kết quả thu nợ hoặc null
     */
    debtCollectionEffect(index, characterManager, cardManager) {
        // Lấy danh sách thẻ coin liền kề
        const adjacentCards = this.getAdjacentCards(cardManager, index);

        if (adjacentCards.length > 0) {
            // Tạo số nợ ngẫu nhiên từ 1-3
            const debt = this.GetRandom(1, 3);

            // Chọn ngẫu nhiên 1 thẻ từ danh sách liền kề
            const randomIndex = Math.floor(Math.random() * adjacentCards.length);
            const targetIndex = adjacentCards[randomIndex];

            // Gây damage cho thẻ được chọn
            let targetCardTakeDamageEffectResult = null;
            const targetCard = cardManager.getCard(targetIndex);
            if (targetCard && typeof targetCard.takeDamageEffect === 'function') {
                targetCardTakeDamageEffectResult = targetCard.takeDamageEffect(targetCard, debt, 'debt', characterManager, cardManager);
            }

            // Tăng repaymentReceipt
            this.repaymentReceipt += debt;

            console.log(`Fatui1 thu nợ: Gây ${debt} damage cho thẻ ở vị trí ${targetIndex}, tổng nợ: ${this.repaymentReceipt}`);

            return {
                targetIndex: targetIndex,
                debt: debt,
                targetCardTakeDamageEffectResult: targetCardTakeDamageEffectResult
            };
        }

        return null;
    }

    /**
     * Hiệu ứng khi bị giết bởi vũ khí
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @returns {Object|null} Thông tin kết quả hiệu ứng hoặc null
     */
    killByWeaponEffect(characterManager = null, cardManager = null) {
        let coinCard = null;
        if (this.repaymentReceipt > 9) {
            coinCard = cardManager.cardFactory.createDynamicCoinUp(characterManager, this.repaymentReceipt);
        } else {
            coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
        }

        coinCard.id = this.id;
        coinCard.position = {
            row: Math.floor(this.id / 3),
            col: this.id % 3
        };
        cardManager.updateCard(this.id, coinCard);

        return {
            type: 'enemy_killed_by_weapon',
            reward: {
                type: 'Coin',
                effect: `fatui bị giết! Nhận được repaymentReceipt`
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
            description: `<strong>${this.type}</strong> - HP: <span class="hp-text">${this.hp}</span><br><i>Người Xử Lý Nợ Hỏa là chiến binh tinh nhuệ của Fatui. Chuyên về các nhiệm vụ thu hồi nợ và sử dụng sức mạnh hỏa nguyên tố để đe dọa.</i>`,
            hp: this.hp
        };
    }
} 
