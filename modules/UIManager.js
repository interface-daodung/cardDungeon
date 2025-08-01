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

    /**
     * Cập nhật toàn bộ giao diện
     * Được gọi khi có thay đổi trong game state
     */
    updateUI() {
        console.log(`🔄 updateUI: Bắt đầu cập nhật UI`);
        this.updateScore(); // Cập nhật điểm số
        this.updateMoves(); // Cập nhật số lượt di chuyển
        this.updateHighScore(); // Cập nhật high score
        this.updateCharacterDisplay(); // Cập nhật hiển thị character
        this.updateSellButtonVisibility(); // Cập nhật hiển thị nút Sell
        console.log(`🔄 updateUI: Hoàn thành cập nhật UI`);
    }

    /**
     * Cập nhật hiển thị điểm số
     */
    updateScore() {
        const score = this.gameState.getScore();
        console.log(`📊 Updating score display: ${score}`);
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
     * Cập nhật hiển thị thông tin character (HP và weapon)
     * Được gọi khi character thay đổi stats
     */
    updateCharacterDisplay() {
        const characterElement = document.querySelector('.card.character');
        if (characterElement) {
            // ===== CẬP NHẬT HP DISPLAY =====
            const hpDisplay = characterElement.querySelector('.hp-display');
            if (hpDisplay) {
                hpDisplay.textContent = this.characterManager.getCharacterHP();
            }
            
                    // ===== CẬP NHẬT WEAPON DISPLAY =====
        let weaponDisplay = characterElement.querySelector('.weapon-display');
        const weaponDurability = this.characterManager.getCharacterWeapon();
        console.log(`🛡️ updateCharacterDisplay: Độ bền vũ khí hiện tại: ${weaponDurability}`);
        
        if (weaponDurability > 0) {
            // Tạo weapon display nếu chưa có
            if (!weaponDisplay) {
                console.log(`🛡️ Tạo weapon display mới`);
                weaponDisplay = document.createElement('div');
                weaponDisplay.className = 'weapon-display';
                characterElement.appendChild(weaponDisplay);
            }
            weaponDisplay.textContent = weaponDurability;
            console.log(`🛡️ Cập nhật weapon display: ${weaponDurability}`);
        } else if (weaponDisplay) {
            // Xóa weapon display nếu không có weapon
            console.log(`🛡️ Xóa weapon display`);
            weaponDisplay.remove();
        }
        }
    }

    /**
     * Hiển thị dialog thông tin thẻ
     * @param {number} cardIndex - Index của thẻ cần hiển thị thông tin
     * @param {CardManager} cardManager - Manager quản lý cards
     */
    showCardInfo(cardIndex, cardManager) {
        const card = cardManager.getCard(cardIndex);
        if (!card) return; // Thoát nếu không tìm thấy thẻ

        // ===== LẤY CÁC ELEMENT CỦA DIALOG =====
        const dialog = document.getElementById('card-info-dialog');
        const title = document.getElementById('card-info-title');
        const image = document.getElementById('card-info-img');
        const name = document.getElementById('card-info-name');
        const effect = document.getElementById('card-info-effect');

        // ===== CẬP NHẬT THÔNG TIN CHARACTER NẾU CẦN =====
        if (card.type === 'character') {
            card.updateFromCharacter(this.characterManager);
        }

        // ===== LẤY THÔNG TIN HIỂN THỊ TỪ CARD =====
        const displayInfo = card.getDisplayInfo();

        // ===== HIỂN THỊ THÔNG TIN =====
        title.textContent = 'Thông tin thẻ';
        name.textContent = displayInfo.name;
        effect.innerHTML = displayInfo.description; // Sử dụng innerHTML để render HTML tags
        image.src = displayInfo.image;
        image.alt = displayInfo.type;
        
        dialog.classList.add('show');
    }

    /**
     * Ẩn dialog thông tin thẻ
     */
    hideCardInfo() {
        const dialog = document.getElementById('card-info-dialog');
        dialog.classList.remove('show');
    }

    /**
     * Cập nhật hiển thị nút Sell dựa trên độ bền vũ khí
     */
    updateSellButtonVisibility() {
        const sellButton = document.getElementById('sell-weapon');
        const weaponDurability = this.characterManager.getWeaponDurability();
        
        console.log(`💰 updateSellButtonVisibility: Độ bền vũ khí: ${weaponDurability}`);
        
        if (weaponDurability > 0) {
            sellButton.style.display = 'inline-block';
            sellButton.textContent = `Sell Weapon (${weaponDurability})`;
            console.log(`💰 Hiển thị nút Sell Weapon với độ bền: ${weaponDurability}`);
        } else {
            sellButton.style.display = 'none';
            console.log(`💰 Ẩn nút Sell Weapon`);
        }
    }

    /**
     * Hiển thị các ô hợp lệ khi kéo character
     * @param {number} draggedCardIndex - Index của thẻ đang kéo
     * @param {CardManager} cardManager - Manager quản lý cards
     */
    showValidTargets(draggedCardIndex, cardManager) {
        if (draggedCardIndex === null) return; // Thoát nếu không có thẻ đang kéo
        
        const draggedCard = cardManager.getCard(draggedCardIndex);
        if (!draggedCard || draggedCard.type !== 'character') return; // Chỉ character mới có thể kéo
        
        // ===== TÌM VÀ HIGHLIGHT CÁC Ô HỢP LỆ =====
        cardManager.getAllCards().forEach((card, index) => {
            if (this.isValidMove(draggedCardIndex, index, cardManager)) {
                const cardElement = document.querySelector(`[data-index="${index}"]`);
                if (cardElement) {
                    cardElement.classList.add('valid-target'); // Thêm class highlight
                }
            }
        });
    }

    /**
     * Xóa highlight các ô hợp lệ
     */
    clearValidTargets() {
        document.querySelectorAll('.valid-target').forEach(element => {
            element.classList.remove('valid-target'); // Xóa class highlight
        });
    }

    /**
     * Kiểm tra xem việc di chuyển từ fromIndex đến toIndex có hợp lệ không
     * @param {number} fromIndex - Vị trí bắt đầu
     * @param {number} toIndex - Vị trí đích
     * @param {CardManager} cardManager - Manager quản lý cards
     * @returns {boolean} True nếu di chuyển hợp lệ
     */
    isValidMove(fromIndex, toIndex, cardManager) {
        if (fromIndex === null || toIndex === null) return false; // Kiểm tra index hợp lệ
        
        const targetCard = cardManager.getCard(toIndex);
        if (targetCard && targetCard.type === 'character') {
            return false; // Không thể di chuyển vào ô có character khác
        }
        
        // ===== TÍNH TOÁN VỊ TRÍ =====
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        // ===== KIỂM TRA LOẠI THẺ ĐÍCH =====
        if (targetCard && !['enemy', 'coin', 'food', 'weapon', 'trap', 'treasure', 'boom'].includes(targetCard.type)) {
            return false; // Chỉ có thể di chuyển vào các loại thẻ này (bao gồm treasure và boom)
        }
        
        // ===== KIỂM TRA KHOẢNG CÁCH =====
        const rowDiff = Math.abs(fromPos.row - toPos.row);
        const colDiff = Math.abs(fromPos.col - toPos.col);
        
        // Chỉ cho phép di chuyển 1 ô theo chiều ngang hoặc dọc
        const isValid = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
        
        return isValid;
    }

    /**
     * Lấy index của thẻ từ DOM element
     * @param {HTMLElement} element - DOM element của thẻ
     * @returns {number|null} Index của thẻ hoặc null
     */
    getCardIndexFromElement(element) {
        if (!element || !element.dataset.index) return null;
        return parseInt(element.dataset.index);
    }
} 