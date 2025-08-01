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
            'Warrior': Warrior,
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
            'Void': Void
        };

        this.cardWeights = {
            // Enemy cards (Fatui, Eremite, AbyssLector, Boss) - Tổng: 40
            'Fatui0': 5, // 5% xuất hiện
            'Fatui1': 5, // 5% xuất hiện
            'Fatui2': 5, // 5% xuất hiện
            'Fatui3': 5, // 5% xuất hiện
            'Eremite0': 3, // 3% xuất hiện
            'Eremite1': 3, // 3% xuất hiện
            'AbyssLector0': 1, // 1% xuất hiện
            'AbyssLector1': 1, // 1% xuất hiện
            'AbyssLector2': 1, // 1% xuất hiện
            'Apep': 5, // 5% xuất hiện
            'Narwhal': 2, // 2% xuất hiện
            'Operative': 4, // 4% xuất hiện
            
            // Food cards - Tổng: 10
            'Food0': 2, // 2% xuất hiện
            'Food1': 2, // 2% xuất hiện
            'Food2': 2, // 2% xuất hiện
            'Poison': 3, // 3% xuất hiện
            'Quicksand': 1, // 1% xuất hiện
            
            // Weapon cards - Tổng: 10
            'Sword0': 1, // 1% xuất hiện
            'Sword1': 1, // 1% xuất hiện
            'Sword2': 1, // 1% xuất hiện
            'Sword3': 1, // 1% xuất hiện
            'Sword4': 1, // 1% xuất hiện
            'Sword5': 1, // 1% xuất hiện
            'Sword6': 1, // 1% xuất hiện
            'Catalyst0': 1, // 1% xuất hiện
            'Catalyst1': 1, // 1% xuất hiện
            'Catalyst2': 1, // 1% xuất hiện
            
            // Coin cards - Tổng: 25
            'Coin': 25, // 25% xuất hiện (sẽ được thay thế bằng Coin${elementCoin})
            
            // Trap cards - Tổng: 10
            'Trap': 9, // 9% xuất hiện
            'Boom': 1, // 1% xuất hiện
            
            // Treasure cards - Tổng: 5
            'Treasure0': 1, // 1% xuất hiện
            'Treasure1': 2, // 2% xuất hiện
            'Bribery': 2, // 2% xuất hiện
        };
    }

    /**
     * Tạo thẻ ngẫu nhiên
     * @param {CharacterManager} characterManager - Manager quản lý character (optional)
     * @returns {Card} Thẻ ngẫu nhiên
     */
    createRandomCard(characterManager = null) {
        console.log(`🎲 [DEBUG] CardFactory.createRandomCard called`);
        const random = Math.random() * 100;
        let cumulativeWeight = 0;
        
        for (const [cardType, weight] of Object.entries(this.cardWeights)) {
            cumulativeWeight += weight;
            if (random <= cumulativeWeight) {
                console.log(`🎲 [DEBUG] Selected card type: ${cardType}, weight=${weight}, random=${random}`);
                // Nếu là Coin và có characterManager, tạo Coin động dựa trên elementCoin
                if (cardType === 'Coin' && characterManager) {
                    console.log(`🪙 [DEBUG] Creating dynamic coin`);
                    return this.createDynamicCoin(characterManager);
                }
                const card = new this.cardClasses[cardType]();
                console.log(`🎲 [DEBUG] Created card: type=${card.type}, image=${card.image}`);
                return card;
            }
        }
        
        // Fallback về Fatui0 nếu có lỗi
        console.log(`🎲 [DEBUG] Fallback to Fatui0`);
        return new Fatui0();
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
        
        console.log(`🎯 [DEBUG] Creating dynamic coin: elementCoin=${elementCoin}, className=${coinClassName}`);
        console.log(`🎯 [DEBUG] Available coin classes:`, Object.keys(this.cardClasses).filter(key => key.startsWith('Coin')));
        
        if (this.cardClasses[coinClassName]) {
            console.log(`✅ [DEBUG] Successfully created ${coinClassName}`);
            const coin = new this.cardClasses[coinClassName]();
            console.log(`🖼�? [DEBUG] Created coin: image=${coin.image}, score=${coin.score}, type=${coin.type}`);
            return coin;
        }
        
        // Fallback v�? Coin0 nếu không tìm thấy class tương ứng
        console.log(`⚠�? [DEBUG] Fallback to Coin0 - ${coinClassName} not found`);
        const fallbackCoin = new Coin0();
        console.log(`🖼�? [DEBUG] Fallback coin: image=${fallbackCoin.image}, score=${fallbackCoin.score}, type=${fallbackCoin.type}`);
        return fallbackCoin;
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
     * Tạo Coin động dựa trên elementCoin
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @returns {Card} Thẻ Coin động
     */
    createCoinByElement(characterManager) {
        return this.createDynamicCoin(characterManager);
    }

    /**
     * Tạo Warrior
     * @returns {Warrior} Thẻ Warrior
     */
    createWarrior() {
        return new Warrior();
    }

    /**
     * Tạo Void card (chỉ được tạo bởi hàm cụ thể, không tạo ngẫu nhiên)
     * @returns {Void} Thẻ Void
     */
    createVoid() {
        return new Void();
    }

    /**
     * Lấy danh sách tất cả loại thẻ
     * @returns {Array} Danh sách tên thẻ
     */
    getAllCardTypes() {
        return Object.keys(this.cardClasses);
    }

    /**
     * Lấy thông tin hiển thị cho tất cả thẻ
     * @returns {Object} Thông tin tất cả thẻ
     */
    getAllCardInfo() {
        const info = {};
        for (const [cardType, CardClass] of Object.entries(this.cardClasses)) {
            const card = new CardClass();
            info[cardType] = card.getDisplayInfo();
        }
        return info;
    }
} 
