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

    // ===== KHỞI TẠO VÀ TẠO THẺ =====

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
        const Character = this.cardFactory.createCharacter();
        characterManager.setCharacterCard(Character);
        // Tạo 9 thẻ cho grid 3x3
        for (let i = 0; i < 9; i++) {
            if (i === centerIndex) {
                // Tạo thẻ Character ở giữa
                Character.id = i;
                Character.position = { row: Math.floor(i / 3), col: i % 3 };
                this.cards.push(Character);
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
     * Tạo thẻ theo loại cụ thể
     * @param {string} cardType - Loại thẻ cần tạo
     * @param {number} index - Vị trí cần tạo thẻ
     * @returns {Card} Thẻ mới được tạo
     */
    createCard(cardType, index) {
        const card = this.cardFactory.createCard(cardType);
        card.id = index;
        card.position = { row: Math.floor(index / 3), col: index % 3 };
        return card;
    }

    // ===== QUẢN LÝ THẺ =====

    /**
     * Cập nhật thẻ tại vị trí chỉ định
     * @param {number} index - Vị trí cần cập nhật
     * @param {Card} card - Thẻ mới
     */
    updateCard(index, card) {
        if (index >= 0 && index < this.cards.length) {
            this.cards[index] = card;
        }
    }

    /**
     * Lấy thẻ tại vị trí chỉ định
     * @param {number} index - Vị trí cần lấy thẻ
     * @returns {Card|null} Thẻ tại vị trí hoặc null nếu không tìm thấy
     */
    getCard(index) {
        if (index >= 0 && index < this.cards.length) {
            return this.cards[index];
        }
        return null;
    }

    /**
     * Lấy tất cả thẻ trong game
     * @returns {Array} Mảng chứa tất cả thẻ
     */
    getAllCards() {
        return this.cards;
    }

    /**
     * Cập nhật toàn bộ bộ thẻ
     * @param {Array} cards - Mảng thẻ mới
     */
    setAllCards(cards) {
        this.cards = cards;
    }

    // ===== TÌM KIẾM THẺ =====

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



} 
