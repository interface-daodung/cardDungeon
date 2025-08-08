// UIManager.js - Quản lý giao diện người dùng
// Chức năng: Cập nhật hiển thị, quản lý dialog, hiển thị thông tin thẻ
// Kết nối với GameState và CharacterManager để lấy dữ liệu hiển thị

class UIManager {
    /**
     * Khởi tạo UIManager
     * @param {GameState} gameState - Manager quản lý trạng thái game
     * @param {CharacterManager} characterManager - Manager quản lý character
     */
    constructor(gameState, characterManager) {
        this.gameState = gameState; // Quản lý score, moves, high score
        this.characterManager = characterManager; // Quản lý HP, weapon của character
    }

    // ===== CẬP NHẬT UI =====

    /**
     * Cập nhật toàn bộ giao diện
     * Được gọi khi có thay đổi trong game state
     */
    updateUI() {
        this.updateScore(); // Cập nhật điểm số
        this.updateMoves(); // Cập nhật số lượt di chuyển
        this.updateHighScore(); // Cập nhật high score
        this.updateSellButtonVisibility(); // Cập nhật hiển thị nút Sell
    }

    /**
     * Cập nhật hiển thị điểm số
     */
    updateScore() {
        const score = this.gameState.getScore();
        document.getElementById('score').textContent = score;
    }

    /**
     * Cập nhật hiển thị số lượt di chuyển
     */
    updateMoves() {
        document.getElementById('moves').textContent = this.gameState.getMoves();
    }

    /**
     * Cập nhật hiển thị high score
     */
    updateHighScore() {
        document.getElementById('high-score').textContent = this.gameState.getHighScore();
    }

    /**
     * Cập nhật hiển thị nút Sell Weapon
     * Chỉ hiển thị khi có vũ khí
     */
    updateSellButtonVisibility() {
        const sellButton = document.getElementById('sell-weapon');
        const weaponDurability = this.characterManager.getCharacterWeaponDurability();
        
        if (weaponDurability > 0) {
            sellButton.style.display = 'block'; // Hiển thị nút
        } else {
            sellButton.style.display = 'none'; // Ẩn nút
        }
    }

    // ===== DIALOG QUẢN LÝ =====

    /**
     * Hiển thị dialog thông tin thẻ
     * @param {number} cardIndex - Index của thẻ cần hiển thị thông tin
     * @param {CardManager} cardManager - Manager quản lý cards
     */
    showCardInfo(cardIndex, cardManager) {
        const card = cardManager.getCard(cardIndex);
        if (!card) return; // Thoát nếu không tìm thấy thẻ

        // ===== CẬP NHẬT THÔNG TIN CHARACTER NẾU CẦN =====
        if (card.type === 'character') {
            card.updateFromCharacter(this.characterManager);
        }

        // ===== LẤY THÔNG TIN HIỂN THỊ TỪ CARD =====
        const displayInfo = card.getDisplayInfo();

        // ===== LẤY CÁC ELEMENT CỦA DIALOG =====
        const dialog = document.getElementById('card-info-dialog');
        const title = document.getElementById('card-info-title');
        const name = document.getElementById('card-info-name');
        const effect = document.getElementById('card-info-effect');
        const image = document.getElementById('card-info-img');

        // ===== CẬP NHẬT NỘI DUNG DIALOG =====
        title.textContent = 'Thông tin thẻ';
        name.textContent = displayInfo.name || 'Unknown Card';
        effect.innerHTML = displayInfo.description || 'No description available'; // Sử dụng innerHTML để render HTML tags
        image.src = displayInfo.image;
        image.alt = displayInfo.nameId || 'Card';

        // ===== HIỂN THỊ DIALOG =====
        dialog.classList.add('show');
    }

    /**
     * Ẩn dialog thông tin thẻ
     */
    hideCardInfo() {
        const dialog = document.getElementById('card-info-dialog');
        dialog.classList.remove('show');
    }


} 