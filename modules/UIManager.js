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
        this.updateEquipments(); // Cập nhật số lượt di chuyển
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
     * Cập nhật hiển thị equipments
     */
    updateEquipments() {
        const equipments = this.gameState.getEquipments();
        console.log('Equipments:', equipments);
        
        const equipmentsContainer = document.getElementById('equipments');
        if (!equipmentsContainer) {
            console.error('Không tìm thấy element equipments');
            return;
        }

        // Lấy các element item hiện có
        const existingItems = equipmentsContainer.querySelectorAll('.item');
        
        if (!equipments || equipments.length === 0) {
            // Ẩn tất cả items hiện có
            existingItems.forEach(item => {
                item.style.display = 'none';
            });
            return;
        }

        // Cập nhật hoặc tạo mới items theo số lượng equipments
        equipments.forEach((item, index) => {
            let itemDiv = existingItems[index];
            console.log(`Cập nhật item và element ${item.name} (${item.constructor.name})`);
            if (!itemDiv) {
                console.log(`Tạo mới item và element---------lỗi rồi sao mất element`);
            }

            // Hiển thị item
            itemDiv.style.display = 'flex';
            
            // Cập nhật thuộc tính
            itemDiv.dataset.nameId = item.nameId;
            //itemDiv.dataset.index = index;// không dc dùng .dataset.index vì nó làm mất element
            
            // Logic cho cooldown
            let imgClass = '';
            let countDisplay = 'none';
            let countText = '';
            
            if (item.cooldown === 0) {
                // Nếu cooldown = 0: ẩn itemCount, không thêm class darken
                countDisplay = 'none';
                countText = '';
                imgClass = ''; // Không có class darken
            } else {
                // Nếu cooldown != 0: hiển thị itemCount, thêm class darken
                countDisplay = 'block';
                countText = item.cooldown;
                imgClass = 'darken';
            }

            // Cập nhật ảnh
            const imgElement = itemDiv.querySelector('img');
            if (imgElement) {
                imgElement.src = item.img;
                imgElement.alt = item.name;
                imgElement.className = imgClass;
            }

            // Cập nhật item count
            const countElement = itemDiv.querySelector('.item-count');
            if (countElement) {
                countElement.textContent = countText;
                countElement.style.display = countDisplay;
            }
        });

        // Ẩn các items thừa
        for (let i = equipments.length; i < existingItems.length; i++) {
            if (existingItems[i]) {
                existingItems[i].style.display = 'none';
            }
        }

        console.log(`Đã cập nhật ${equipments.length} equipments`);
    }

    /**
     * Xử lý khi click vào equipment item
     * @param {Item} item - Item được click
     * @param {number} index - Index của item
     */
    onEquipmentClick(item, index) {
        console.log(`Click vào equipment: ${item.name} (${item.constructor.name})`);
        // Có thể thêm logic xử lý click ở đây
        // Ví dụ: hiển thị thông tin item, sử dụng item, v.v.
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