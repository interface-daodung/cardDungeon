// CardFactory.js - Factory để tạo và quản lý các thẻ
// Chức năng: Tạo thẻ ngẫu nhiên và quản lý tất cả loại thẻ

class CardFactory {
    constructor() {
        this.cardClasses = {
            'Fatui0': Fatui0,
            'Fatui1': Fatui1,
            'Fatui2': Fatui2,
            'Fatui3': Fatui3,
            'Food0': Food0,
            'Food1': Food1,
            'Food2': Food2,
            'Food3': Food3,
            'Sword0': Sword0,
            'Sword1': Sword1,
            'Sword2': Sword2,
            'Sword3': Sword3,
            'Sword4': Sword4,
            'Sword5': Sword5,
            'Sword6': Sword6,
            'Coin': Coin0, // Placeholder cho Coin (sẽ được thay thế bằng Coin động)
            'Coin0': Coin0,
            'Coin1': Coin1,
            'Coin2': Coin2,
            'Coin3': Coin3,
            'Coin4': Coin4,
            'Coin5': Coin5,
            'Coin6': Coin6,
            'CoinUp0': CoinUp0,
            'CoinUp1': CoinUp1,
            'CoinUp2': CoinUp2,
            'CoinUp3': CoinUp3,
            'CoinUp4': CoinUp4,
            'CoinUp5': CoinUp5,
            'CoinUp6': CoinUp6,
            'Trap': Trap,
            'Poison': Poison,
            'Boom': Boom,
            'Quicksand': Quicksand,
            'Treasure0': Treasure0,
            'Treasure1': Treasure1,
            'Bribery': Bribery,
            'Catalyst0': Catalyst0,
            'Catalyst1': Catalyst1,
            'Catalyst2': Catalyst2,
            'Eremite0': Eremite0,
            'Eremite1': Eremite1,
            'AbyssLector0': AbyssLector0,
            'AbyssLector1': AbyssLector1,
            'AbyssLector2': AbyssLector2,
            'Apep': Apep,
            'Narwhal': Narwhal,
            'Operative': Operative,
            'Void': Void,
            'Dragon': Dragon // Thêm Dragon vào đây
        };

        // Hệ thống Category-based - Dễ quản lý và mở rộng
        this.cardCategories = {
            enemies: {
                weight: 30, // 30% tổng số thẻ
                cards: {
                    'Fatui0': 10, // 10% trong nhóm enemies (3.00% tổng)
                    'Fatui1': 10, // 10% trong nhóm enemies (3.00% tổng)
                    'Fatui2': 10, // 10% trong nhóm enemies (3.00% tổng)
                    'Fatui3': 9.9, // 9.9% trong nhóm enemies (2.97% tổng)
                    'Eremite0': 8, // 8.2% trong nhóm enemies (2.46% tổng)
                    'Eremite1': 8, // 8% trong nhóm enemies (2.40% tổng)
                    'AbyssLector0': 2.5, // 2.5% trong nhóm enemies (0.75% tổng)
                    'AbyssLector1': 2.5, // 2.5% trong nhóm enemies (0.75% tổng)
                    'AbyssLector2': 2.5, // 2.5% trong nhóm enemies (0.75% tổng)
                    'Apep': 12.5, // 12.5% trong nhóm enemies (3.75% tổng)
                    'Narwhal': 7.6, // 7.6% trong nhóm enemies (2.28% tổng)
                    'Operative': 10, // 10% trong nhóm enemies (3.00% tổng)
                    'Dragon': 6.5, // 6.5% trong nhóm enemies (1.95% tổng)
                }
            },
            food: {
                weight: 10, // 10% tổng số thẻ
                cards: {
                    'Food0': 20, // 20% trong nhóm food (2.00% tổng)
                    'Food1': 25, // 26% trong nhóm food (2.60% tổng)
                    'Food2': 25, // 25% trong nhóm food (2.50% tổng)
                    'Poison': 20, // 20% trong nhóm food (2.00% tổng)
                    'Quicksand': 10, // 10% trong nhóm food (1.00% tổng)
                }
            },
            weapons: {
                weight: 20, // 20% tổng số thẻ
                cards: {
                    'Sword0': 10, // 10% trong nhóm weapons (2.00% tổng)
                    'Sword1': 10, // 10% trong nhóm weapons (2.00% tổng)
                    'Sword2': 10, // 10% trong nhóm weapons (2.00% tổng)
                    'Sword3': 10, // 10% trong nhóm weapons (2.00% tổng)
                    'Sword4': 10, // 10% trong nhóm weapons (2.00% tổng)
                    'Sword5': 10, // 10% trong nhóm weapons (2.00% tổng)
                    'Sword6': 10, // 10% trong nhóm weapons (2.00% tổng)
                    'Catalyst0': 10, // 10% trong nhóm weapons (2.00% tổng)
                    'Catalyst1': 10, // 10% trong nhóm weapons (2.00% tổng)
                    'Catalyst2': 10, // 10% trong nhóm weapons (2.00% tổng)
                }
            },
            coins: {
                weight: 25, // 25% tổng số thẻ
                cards: {
                    'Coin': 100, // 100% trong nhóm coins (25.00% tổng)
                }
            },
            traps: {
                weight: 10, // 10% tổng số thẻ
                cards: {
                    'Trap': 90, // 90% trong nhóm traps (9.00% tổng)
                    'Boom': 10, // 10% trong nhóm traps (1.00% tổng)
                }
            },
            treasures: {
                weight: 5, // 5% tổng số thẻ
                cards: {
                    'Treasure0': 27, // 27.5% trong nhóm treasures (1.38% tổng)
                    'Treasure1': 40, // 40% trong nhóm treasures (2.00% tổng)
                    'Bribery': 33, // 33.1% trong nhóm treasures (1.66% tổng)
                }
            },
        };

        // Cache để tối ưu hiệu suất
        this._cachedCardWeights = null;
    }

    /**
     * Tính toán cardWeights từ categories (cache để tối ưu)
     * @returns {Object} cardWeights đã được tính toán
     */
    _calculateCardWeights() {
        if (this._cachedCardWeights) {
            return this._cachedCardWeights;
        }

        const cardWeights = {};

        for (const [categoryName, category] of Object.entries(this.cardCategories)) {
            const categoryWeight = category.weight;

            for (const [cardName, cardPercentage] of Object.entries(category.cards)) {
                // Tính trọng số thực tế = (tỷ lệ trong nhóm * trọng số nhóm) / 100
                const actualWeight = (cardPercentage * categoryWeight) / 100;
                cardWeights[cardName] = actualWeight;
            }
        }

        this._cachedCardWeights = cardWeights;
        return cardWeights;
    }

    /**
     * Tạo thẻ ngẫu nhiên
     * @param {CharacterManager} characterManager - Manager quản lý character (optional)
     * @returns {Card} Thẻ ngẫu nhiên
     */
    createRandomCard(characterManager = null) {
        const cardWeights = this._calculateCardWeights();
        const random = Math.random() * 100;
        let cumulativeWeight = 0;

        for (const [cardType, weight] of Object.entries(cardWeights)) {
            cumulativeWeight += weight;
            if (random <= cumulativeWeight) {
                // Nếu là Coin và có characterManager, tạo Coin động dựa trên elementCoin
                if (cardType === 'Coin' && characterManager) {
                    return this.createDynamicCoin(characterManager);
                }
                const card = new this.cardClasses[cardType]();
                return card;
            }
        }

        // Fallback về null nếu có lỗi
        return null;
    }

    /**
     * Tạo thẻ theo loại
     * @param {string} cardType - Loại thẻ
     * @returns {Card} Thẻ được tạo
     */
    createCard(cardType) {
        if (this.cardClasses[cardType]) {
            return new this.cardClasses[cardType]();
        }
        throw new Error(`Unknown card type: ${cardType}`);
    }

    /**
     * Tạo Coin động dựa trên elementCoin của Warrior
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @returns {Card} Thẻ Coin động
     */
    createDynamicCoin(characterManager) {
        // Lấy elementCoin từ Warrior
        const elementCoin = characterManager.getCharacterElementCoin();

        // Tạo Coin class tương ứng với elementCoin
        const coinClassName = `Coin${elementCoin}`;

        if (this.cardClasses[coinClassName]) {
            const coin = new this.cardClasses[coinClassName]();
            return coin;
        }

        // Fallback về Coin0 nếu không tìm thấy class tương ứng
        return new Coin0();
    }

    /**
     * Tạo CoinUp động dựa trên elementCoin của Character
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {number} score - Điểm cho CoinUp (optional)
     * @returns {Card} Thẻ CoinUp động
     */
    createDynamicCoinUp(characterManager, score = null) {
        // Lấy elementCoin từ Warrior
        const elementCoin = characterManager.getCharacterElementCoin();

        // Tạo CoinUp class tương ứng với elementCoin
        const coinUpClassName = `CoinUp${elementCoin}`;

        if (this.cardClasses[coinUpClassName]) {
            const coinUp = new this.cardClasses[coinUpClassName]();

            // Set điểm nếu được truyền vào
            if (score !== null) {
                coinUp.score = score;
            }

            return coinUp;
        }

        // Fallback về CoinUp0 nếu không tìm thấy class tương ứng
        const fallbackCoinUp = new CoinUp0();

        // Set điểm nếu được truyền vào
        if (score !== null) {
            fallbackCoinUp.score = score;
        }

        return fallbackCoinUp;
    }

    /** code cũ có thể xóa sau này 
     * Tạo Warrior
     * @returns {Warrior} Thẻ Warrior
     */
    // createWarrior() {
    //     return new Warrior();
    // }

    /**
     * Tạo Void card (chỉ được tạo bởi hàm cụ thể, không tạo ngẫu nhiên)
     * @returns {Void} Thẻ Void
     */
    createVoid() {
        return new Void();
    }

    /**
     * Tạo nhân vật dựa trên localStorage hoặc mặc định là Eula
     * @returns {Card} Thẻ nhân vật được tạo
     */
    createCharacter() {
        const nameId = localStorage.getItem('selectedCharacter');
        
        // Nếu null hoặc không tìm thấy, mặc định là eula
        if (!nameId) {
            return new Eula();
        }
        
        // Switch case để tạo nhân vật tương ứng
        switch (nameId) {
            case 'eula':
                return new Eula();
            case 'nahida':
                return new Nahida();
            case 'zhongli':
                return new Zhongli();
            case 'venti':
                return new Venti();
            case 'raiden':
                return new Raiden();
            case 'mavuika':
                return new Mavuika();
            case 'furina':
                return new Furina();
            default:
                // Fallback về Eula nếu không tìm thấy
                return new Eula();
        }
    }

    //--------------nhưng hàm có thể sau này xóa nếu ko dùng đến ---------------------------
    /**
     * Lấy danh sách tất cả loại thẻ
     * @returns {Array} Danh sách tên thẻ
     */
    getAllCardTypes() {
        return Object.keys(this.cardClasses);
    }

    /**
     * Thêm thẻ mới vào category
     * @param {string} categoryName - Tên category
     * @param {string} cardName - Tên thẻ
     * @param {number} percentage - Tỷ lệ trong category (0-100)
     */
    addCardToCategory(categoryName, cardName, percentage) {
        if (!this.cardCategories[categoryName]) {
            throw new Error(`Category '${categoryName}' không tồn tại`);
        }

        // Thêm thẻ vào category
        this.cardCategories[categoryName].cards[cardName] = percentage;

        // Reset cache để tính toán lại
        this._cachedCardWeights = null;
    }

    /**
     * Thêm category mới
     * @param {string} categoryName - Tên category
     * @param {number} weight - Trọng số của category (0-100)
     * @param {Object} cards - Object chứa các thẻ và tỷ lệ
     */
    addCategory(categoryName, weight, cards = {}) {
        this.cardCategories[categoryName] = {
            weight: weight,
            cards: cards
        };

        // Reset cache để tính toán lại
        this._cachedCardWeights = null;
    }

    /**
     * Cập nhật trọng số của category
     * @param {string} categoryName - Tên category
     * @param {number} newWeight - Trọng số mới
     */
    updateCategoryWeight(categoryName, newWeight) {
        if (!this.cardCategories[categoryName]) {
            throw new Error(`Category '${categoryName}' không tồn tại`);
        }

        this.cardCategories[categoryName].weight = newWeight;
        this._cachedCardWeights = null;
    }

    /**
     * Lấy thông tin chi tiết về categories
     * @returns {Object} Thông tin categories
     */
    getCategoryInfo() {
        return this.cardCategories;
    }

    /**
     * Lấy tổng trọng số của tất cả categories
     * @returns {number} Tổng trọng số
     */
    getTotalWeight() {
        return Object.values(this.cardCategories).reduce((total, category) => {
            return total + category.weight;
        }, 0);
    }

} 
