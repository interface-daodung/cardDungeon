// CardManager.js - Quản lý tất cả thẻ trong game
// Chức năng: Quản lý mảng cards và tương tác với CardFactory
// Tối ưu hóa để làm việc hiệu quả với hệ thống Card classes mới

class CardManager {
    /**
     * Khởi tạo CardManager
     * Quản lý mảng cards và CardFactory
     */
    constructor() {
        this.cards = []; // Mảng chứa tất cả thẻ trong game (9 thẻ cho grid 3x3)
        this.cardFactory = new CardFactory(); // Factory để tạo thẻ
        this.characterManager = null; // Reference đến CharacterManager
    }

    /**
     * Tạo bộ thẻ ban đầu cho game (9 thẻ cho grid 3x3)
     * Character ở giữa, các thẻ khác random xung quanh
     * @param {CharacterManager} characterManager - Manager quản lý character (optional)
     * @returns {Array} Mảng chứa tất cả thẻ đã tạo
     */
    createCards(characterManager = null) {
        this.characterManager = characterManager; // Lưu reference đến CharacterManager
        this.cards = []; // Reset mảng thẻ
        const centerIndex = 4; // Vị trí trung tâm (hàng 2, cột 2) - index 4
        
        // Tạo 9 thẻ cho grid 3x3
        for (let i = 0; i < 9; i++) {
            if (i === centerIndex) {
                // Tạo thẻ Character ở giữa
                const warrior = this.cardFactory.createWarrior();
                warrior.id = i;
                warrior.position = { row: Math.floor(i / 3), col: i % 3 };
                this.cards.push(warrior);
            } else {
                // Tạo thẻ ngẫu nhiên cho các vị trí khác
                const card = this.cardFactory.createRandomCard(this.characterManager);
                card.id = i;
                card.position = { row: Math.floor(i / 3), col: i % 3 };
                this.cards.push(card);
            }
        }
        return this.cards;
    }

    /**
     * Tìm vị trí của thẻ Character trong mảng thẻ
     * @returns {number|null} Index của Character hoặc null nếu không tìm thấy
     */
    findCharacterIndex() {
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i] && this.cards[i].type === 'character') return i;
        }
        return null;
    }

    /**
     * Tìm thẻ cần di chuyển khi Warrior di chuyển (hiệu ứng domino)
     * Khi Warrior di chuyển, thẻ phía sau sẽ bị đẩy theo
     * @param {number} fromIndex - Vị trí bắt đầu của Warrior
     * @param {number} toIndex - Vị trí đích của Warrior
     * @returns {Object|null} Thông tin thẻ cần di chuyển hoặc null
     */
    findCardToMove(fromIndex, toIndex) {
        // Tính toán vị trí
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        // Xác định hướng di chuyển
        let direction = '';
        if (toPos.row < fromPos.row) direction = 'up';
        else if (toPos.row > fromPos.row) direction = 'down';
        else if (toPos.col < fromPos.col) direction = 'left';
        else if (toPos.col > fromPos.col) direction = 'right';
        
        // Tìm thẻ cần di chuyển theo hướng
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            if (card && card.type !== 'character' && i !== toIndex) {
                const cardPos = { row: Math.floor(i / 3), col: i % 3 };
                let shouldMove = false;
                
                // Kiểm tra xem thẻ có nên di chuyển theo hướng không
                switch (direction) {
                    case 'up': shouldMove = cardPos.row > fromPos.row && cardPos.col === fromPos.col; break;
                    case 'down': shouldMove = cardPos.row < fromPos.row && cardPos.col === fromPos.col; break;
                    case 'left': shouldMove = cardPos.col > fromPos.col && cardPos.row === fromPos.row; break;
                    case 'right': shouldMove = cardPos.col < fromPos.col && cardPos.row === fromPos.row; break;
                }
                
                if (shouldMove) return { card, fromIndex: i };
            }
        }
        return null;
    }

    /**
     * Tạo thẻ ngẫu nhiên mới tại vị trí chỉ định
     * @param {number} index - Vị trí cần tạo thẻ mới
     * @returns {Card} Thẻ mới được tạo
     */
    createRandomCard(index) {
        const card = this.cardFactory.createRandomCard(this.characterManager);
        card.id = index;
        card.position = { row: Math.floor(index / 3), col: index % 3 };
        return card;
    }

    /**
     * Tạo thẻ theo loại tại vị trí chỉ định
     * @param {string} cardType - Loại thẻ cần tạo
     * @param {number} index - Vị trí cần tạo thẻ mới
     * @returns {Card} Thẻ mới được tạo
     */
    createCard(cardType, index) {
        const card = this.cardFactory.createCard(cardType);
        card.id = index;
        card.position = { row: Math.floor(index / 3), col: index % 3 };
        return card;
    }

    /**
     * Cập nhật thẻ tại vị trí chỉ định
     * @param {number} index - Vị trí cần cập nhật
     * @param {Card} card - Thẻ mới
     */
    updateCard(index, card) {
        this.cards[index] = card;
    }

    /**
     * Lấy thẻ tại vị trí chỉ định
     * @param {number} index - Vị trí cần lấy thẻ
     * @returns {Card|null} Thẻ tại vị trí đó hoặc null
     */
    getCard(index) {
        return this.cards[index] || null;
    }

    /**
     * Lấy tất cả thẻ trong game
     * @returns {Array} Mảng chứa tất cả thẻ
     */
    getAllCards() {
        return this.cards;
    }

    /**
     * Kiểm tra xem game đã hoàn thành chưa (tất cả thẻ đều là Character)
     * @returns {boolean} True nếu tất cả thẻ đều là Character
     */
    isGameComplete() {
        return this.cards.every(card => card && card.type === 'character');
    }

    /**
     * Lấy thông tin tất cả loại thẻ có sẵn
     * @returns {Object} Thông tin tất cả loại thẻ
     */
    getAllCardTypes() {
        return this.cardFactory.getAllCardTypes();
    }

    /**
     * Lấy thông tin hiển thị cho tất cả loại thẻ
     * @returns {Object} Thông tin hiển thị tất cả loại thẻ
     */
    getAllCardInfo() {
        return this.cardFactory.getAllCardInfo();
    }

    /**
     * Cập nhật tất cả thẻ trong game
     * @param {Array} cards - Mảng chứa tất cả thẻ mới
     */
    setAllCards(cards) {
        this.cards = cards;
    }
} 