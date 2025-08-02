// EventManager.js - Quản lý tất cả events và tương tác người dùng
// Chức năng: Xử lý click, drag & drop, touch, long press, và các tương tác khác
// Kết nối tất cả manager với nhau thông qua events

class EventManager {
    /**
     * Khởi tạo EventManager
     * @param {GameState} gameState - Quản lý trạng thái game
     * @param {CardManager} cardManager - Quản lý cards
     * @param {CharacterManager} characterManager - Quản lý character
     * @param {CombatManager} combatManager - Quản lý combat
     * @param {AnimationManager} animationManager - Quản lý animation
     * @param {UIManager} uiManager - Quản lý UI
     */
    constructor(gameState, cardManager, characterManager, combatManager, animationManager, uiManager) {
        this.gameState = gameState; // Quản lý score, moves, drag state
        this.cardManager = cardManager; // Quản lý dữ liệu cards
        this.characterManager = characterManager; // Quản lý HP, weapon
        this.combatManager = combatManager; // Quản lý logic combat
        this.animationManager = animationManager; // Quản lý animation
        this.uiManager = uiManager; // Quản lý UI updates
    }

    /**
     * Setup các event listener chính cho game
     * Bao gồm buttons, dialogs, keyboard events
     */
    setupEventListeners() {
        // ===== BUTTON EVENTS =====
        document.getElementById('new-game').addEventListener('click', () => {
            this.onNewGame();
        });

        document.getElementById('sell-weapon').addEventListener('click', () => {
            this.onSellWeapon();
        });

        // ===== DIALOG EVENTS =====
        document.getElementById('close-card-info').addEventListener('click', () => {
            this.uiManager.hideCardInfo();
        });

        document.getElementById('card-info-dialog').addEventListener('click', (e) => {
            if (e.target.id === 'card-info-dialog') {
                this.uiManager.hideCardInfo(); // Đóng dialog khi click bên ngoài
            }
        });

        document.getElementById('restart-game').addEventListener('click', () => {
            this.onRestartFromGameOver();
        });

        // ===== KEYBOARD EVENTS =====
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.uiManager.hideCardInfo(); // Đóng dialog với ESC
            }
        });
    }

    /**
     * Setup events cho tất cả cards
     * Mỗi card có các events khác nhau tùy theo loại
     */
    setupCardEvents() {
        this.cardManager.getAllCards().forEach((card, index) => {
            const cardElement = document.querySelector(`[data-index="${index}"]`);
            if (cardElement) {
                if (card.type === 'character') {
                    // ===== CHARACTER CARD EVENTS =====
                    this.setupDragEvents(cardElement, index); // Chỉ character có thể drag
                    this.setupClickEvents(cardElement, index); // Click events riêng cho character
                } else {
                    // ===== OTHER CARDS EVENTS =====
                    this.setupClickEventsForAll(cardElement, index); // Click events cho tất cả cards
                }
                this.setupDropEvents(cardElement, index); // Drop events cho tất cả cards
                this.setupLongPressEvents(cardElement, index); // Long press cho thông tin thẻ
            }
        });
    }

    /**
     * Setup drag events cho character
     * @param {HTMLElement} cardElement - DOM element của card
     * @param {number} index - Index của card
     */
    setupDragEvents(cardElement, index) {
        // ===== DRAG EVENTS =====
        cardElement.addEventListener('dragstart', (e) => {
            this.handleDragStart(e, index);
        });

        cardElement.addEventListener('dragend', (e) => {
            this.handleDragEnd(e);
        });

        // ===== TOUCH EVENTS =====
        cardElement.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e, index);
        });

        cardElement.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        });

        cardElement.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e, index);
        });

        // ===== MOUSE EVENTS CHO CHARACTER (CHỈ DRAG, KHÔNG LONG PRESS) =====
        if (cardElement.dataset.type === 'character') {
            cardElement.addEventListener('mousedown', (e) => {
                // Chỉ xử lý drag cho character, không long press
                this.handleDragStart(e, index);
            });

            cardElement.addEventListener('mouseup', (e) => {
                this.handleDragEnd(e);
            });

            cardElement.addEventListener('mouseleave', (e) => {
                this.handleDragEnd(e);
            });
        }
    }

    /**
     * Setup click events cho character
     * @param {HTMLElement} cardElement - DOM element của card
     * @param {number} index - Index của card
     */
    setupClickEvents(cardElement, index) {
        cardElement.addEventListener('click', (e) => {
            this.handleCharacterClick(e, index);
        });
    }

    /**
     * Setup click events cho tất cả cards (không phải character)
     * @param {HTMLElement} cardElement - DOM element của card
     * @param {number} index - Index của card
     */
    setupClickEventsForAll(cardElement, index) {
        cardElement.addEventListener('click', (e) => {
            this.handleCardClick(e, index);
        });
    }

    /**
     * Setup drop events cho tất cả cards
     * @param {HTMLElement} cardElement - DOM element của card
     * @param {number} index - Index của card
     */
    setupDropEvents(cardElement, index) {
        cardElement.addEventListener('dragover', (e) => {
            this.handleDragOver(e);
        });

        cardElement.addEventListener('drop', (e) => {
            this.handleDrop(e);
        });
    }

    /**
     * Setup long press events cho cards
     * @param {HTMLElement} cardElement - DOM element của card
     * @param {number} index - Index của card
     */
    setupLongPressEvents(cardElement, index) {
        // ===== SETUP LONG PRESS CHO TẤT CẢ CARDS (BAO GỒM CHARACTER) =====
        // Mouse events cho long press
        cardElement.addEventListener('mousedown', (e) => {
            this.handleLongPressStart(e, index);
        });

        cardElement.addEventListener('mouseup', (e) => {
            this.handleLongPressEnd(e);
        });

        cardElement.addEventListener('mouseleave', (e) => {
            this.handleLongPressCancel(e);
        });

        // Touch events cho long press
        cardElement.addEventListener('touchstart', (e) => {
            this.handleLongPressStart(e, index);
        });

        cardElement.addEventListener('touchend', (e) => {
            this.handleLongPressEnd(e);
        });

        cardElement.addEventListener('touchcancel', (e) => {
            this.handleLongPressCancel(e);
        });
    }

    /**
     * Xử lý click vào character
     * @param {Event} e - Click event
     * @param {number} index - Index của character
     */
    handleCharacterClick(e, index) {
        // Removed hint functionality - có thể thêm hint sau này
    }

    /**
     * Xử lý click vào card (không phải character)
     * @param {Event} e - Click event
     * @param {number} index - Index của card
     */
    handleCardClick(e, index) {
        // ===== KIỂM TRA ANIMATION STATE =====
        if (this.animationManager.isCurrentlyAnimating()) {
            console.log(`🎬 Bỏ qua click vì đang có animation`);
            return;
        }

        const cardElement = e.target.closest('.card');
        if (!cardElement) return;
        
        const cardType = cardElement.dataset.type;
        
        // ===== KIỂM TRA LOẠI CARD =====
        if (cardType === 'character') {
            return; // Không xử lý click vào character
        }
        
        // ===== XỬ LÝ CLICK VÀO CÁC LOẠI CARD KHÁC =====
        if (cardType === 'enemy' || cardType === 'coin' || cardType === 'food' || cardType === 'weapon' || cardType === 'trap') {
            const characterIndex = this.cardManager.findCharacterIndex();
            if (characterIndex !== null && this.uiManager.isValidMove(characterIndex, index, this.cardManager)) {
                this.moveCharacter(characterIndex, index); // Di chuyển character đến card
            }
        }
        // ===== XỬ LÝ CLICK VÀO TREASURE (CHỈ TƯƠNG TÁC KHI Ở BÊN CẠNH) =====
        else if (cardType === 'treasure') {
            const characterIndex = this.cardManager.findCharacterIndex();
            if (characterIndex !== null && this.uiManager.isValidMove(characterIndex, index, this.cardManager)) {
                this.interactWithTreasure(index);
            } else {
                console.log(`💎 Không thể tương tác với treasure từ xa. Cần di chuyển đến vị trí bên cạnh.`);
            }
        }
        // ===== XỬ LÝ CLICK VÀO BOOM (CHỈ TƯƠNG TÁC KHI Ở BÊN CẠNH) =====
        else if (cardType === 'boom') {
            const characterIndex = this.cardManager.findCharacterIndex();
            if (characterIndex !== null && this.uiManager.isValidMove(characterIndex, index, this.cardManager)) {
                this.interactWithBoom(index);
            } else {
                console.log(`💥 Không thể tương tác với boom từ xa. Cần di chuyển đến vị trí bên cạnh.`);
            }
        }
        else if (cardElement.classList.contains('valid-target')) {
            // ===== XỬ LÝ CLICK VÀO TARGET HỢP LỆ =====
            const characterIndex = this.cardManager.findCharacterIndex();
            if (characterIndex !== null && this.uiManager.isValidMove(characterIndex, index, this.cardManager)) {
                this.moveCharacter(characterIndex, index);
                this.uiManager.clearValidTargets(); // Xóa highlight
            }
        }
    }

    /**
     * Xử lý bắt đầu drag
     * @param {Event} e - Drag event
     * @param {number} index - Index của card đang drag
     */
    handleDragStart(e, index) {
        if (this.cardManager.getCard(index).type !== 'character') {
            e.preventDefault(); // Chỉ character mới có thể drag
            return;
        }
        
        // ===== THIẾT LẬP DRAG STATE =====
        this.gameState.setDraggedCard(index);
        this.gameState.setDragStartPos({ row: Math.floor(index / 3), col: index % 3 });
        e.target.closest('.card').classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    /**
     * Xử lý kết thúc drag
     * @param {Event} e - Drag event
     */
    handleDragEnd(e) {
        e.target.closest('.card').classList.remove('dragging');
        this.uiManager.clearValidTargets(); // Xóa highlight
        this.gameState.clearDraggedCard(); // Reset drag state
        this.gameState.clearDragStartPos();
    }

    /**
     * Xử lý drag over
     * @param {Event} e - Drag event
     */
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    /**
     * Xử lý drop
     * @param {Event} e - Drop event
     */
    handleDrop(e) {
        e.preventDefault();
        
        // ===== KIỂM TRA ANIMATION STATE =====
        if (this.animationManager.isCurrentlyAnimating()) {
            console.log(`🎬 Bỏ qua drop vì đang có animation`);
            return;
        }
        
        const targetCard = e.target.closest('.card');
        if (!targetCard) return;
        
        const targetIndex = this.uiManager.getCardIndexFromElement(targetCard);
        
        const draggedCardIndex = this.gameState.getDraggedCard();
        if (draggedCardIndex !== null && this.cardManager.getCard(draggedCardIndex).type === 'character') {
            if (targetIndex !== null && this.uiManager.isValidMove(draggedCardIndex, targetIndex, this.cardManager)) {
                this.moveCharacter(draggedCardIndex, targetIndex); // Di chuyển character
            }
        }
    }

    /**
     * Xử lý touch start
     * @param {Event} e - Touch event
     * @param {number} index - Index của card
     */
    handleTouchStart(e, index) {
        e.preventDefault();
        
        // ===== LƯU THÔNG TIN TOUCH =====
        this.gameState.setTouchStartTime(Date.now());
        this.gameState.setTouchStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        
        // ===== KHÔNG GỌI LONG PRESS Ở ĐÂY NỮA =====
        // Long press sẽ được xử lý bởi setupLongPressEvents riêng biệt
    }

    /**
     * Xử lý touch move
     * @param {Event} e - Touch event
     */
    handleTouchMove(e) {
        e.preventDefault();
        // Không làm gì - chỉ để ngăn scroll
    }

    /**
     * Xử lý touch end
     * @param {Event} e - Touch event
     * @param {number} index - Index của card
     */
    handleTouchEnd(e, index) {
        e.preventDefault();
        
        // ===== TÍNH TOÁN THÔNG TIN TOUCH =====
        const touchEndTime = Date.now();
        const touchStartTime = this.gameState.getTouchStartTime();
        const touchStartPos = this.gameState.getTouchStartPos();
        const touchEndPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        
        // ===== TÍNH KHOẢNG CÁCH DI CHUYỂN =====
        const distance = Math.sqrt(
            Math.pow(touchEndPos.x - touchStartPos.x, 2) + 
            Math.pow(touchEndPos.y - touchStartPos.y, 2)
        );
        
        // ===== KHÔNG GỌI LONG PRESS END Ở ĐÂY NỮA =====
        // Long press end sẽ được xử lý bởi setupLongPressEvents riêng biệt
        
        // ===== XỬ LÝ TAP =====
        // Nếu là tap (thời gian ngắn và khoảng cách nhỏ)
        if (touchEndTime - touchStartTime < 300 && distance < 10) {
            // ===== KIỂM TRA ANIMATION STATE =====
            if (this.animationManager.isCurrentlyAnimating()) {
                console.log(`🎬 Bỏ qua tap vì đang có animation`);
                return;
            }
            
            // Xử lý như click
            if (this.cardManager.getCard(index).type === 'character') {
                this.handleCharacterClick(e, index);
            } else {
                this.handleCardClick(e, index);
            }
        }
        
        // ===== CLEANUP =====
        this.gameState.clearTouchStartTime();
        this.gameState.clearTouchStartPos();
    }

    /**
     * Xử lý bắt đầu long press
     * @param {Event} e - Mouse/Touch event
     * @param {number} index - Index của card
     */
    handleLongPressStart(e, index) {
        e.preventDefault();
        
        // ===== LƯU THỜI ĐIỂM BẮT ĐẦU =====
        this.gameState.setTouchStartTime(Date.now());
        
        // ===== BẮT ĐẦU TIMER =====
        // Chỉ bắt đầu timer nếu chưa có timer nào
        if (!this.gameState.getLongPressTimer()) {
            const timer = setTimeout(() => {
                console.log(`📋 Long press triggered for card ${index}`);
                this.uiManager.showCardInfo(index, this.cardManager); // Hiển thị thông tin thẻ
            }, this.gameState.getLongPressDelay());
            this.gameState.setLongPressTimer(timer);
        }
    }

    /**
     * Xử lý kết thúc long press
     * @param {Event} e - Mouse/Touch event
     */
    handleLongPressEnd(e) {
        // ===== CLEAR TIMER =====
        // Clear timer nếu thời gian < long press delay
        const touchStartTime = this.gameState.getTouchStartTime();
        const currentTime = Date.now();
        
        if (touchStartTime && (currentTime - touchStartTime) < this.gameState.getLongPressDelay()) {
            console.log(`📋 Long press cancelled - time: ${currentTime - touchStartTime}ms`);
            this.gameState.clearLongPressTimer();
        }
        
        // ===== CLEANUP =====
        this.gameState.clearTouchStartTime();
    }

    /**
     * Xử lý hủy long press
     * @param {Event} e - Mouse/Touch event
     */
    handleLongPressCancel(e) {
        console.log(`📋 Long press cancelled`);
        this.gameState.clearLongPressTimer();
        this.gameState.clearTouchStartTime();
    }

    /**
     * Di chuyển character từ vị trí này sang vị trí khác
     * @param {number} fromIndex - Vị trí bắt đầu
     * @param {number} toIndex - Vị trí đích
     */
    moveCharacter(fromIndex, toIndex) {
        // ===== KIỂM TRA ANIMATION STATE =====
        if (this.animationManager.isCurrentlyAnimating()) {
            console.log(`🎬 Bỏ qua input vì đang có animation`);
            return;
        }

        // ===== KIỂM TRA TÍNH HỢP LỆ =====
        if (!this.uiManager.isValidMove(fromIndex, toIndex, this.cardManager)) return;
        
        if (this.cardManager.getCard(toIndex).type === 'character') {
            console.warn('Attempted to eat character card - prevented');
            return;
        }

        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.animationManager.startAnimation();

        // ===== XỬ LÝ ĂN THẺ =====
        console.log(`🎯 moveCharacter: Bắt đầu xử lý ăn thẻ từ ${fromIndex} đến ${toIndex}`);
        const eatingResult = this.combatManager.processCardEating(fromIndex, toIndex);
        
        // ===== TĂNG MOVES KHI WARRIOR DI CHUYỂN =====
        this.gameState.incrementMoves();
        
        // ===== GỌI HÀM XỬ LÝ SAU KHI TĂNG MOVE =====
        this.onMoveCompleted();
        
        if (eatingResult === true) {
            console.log(`⚔️ Đã xử lý combat (tấn công từ xa) - không cần làm gì thêm`);
            
            // ===== GIẢM COUNTDOWN CỦA TẤT CẢ BOOM CARDS (SAU KHI TẤN CÔNG TỪ XA) =====
            this.decreaseBoomCountdown();
            
            this.animationManager.endAnimation(); // Kết thúc animation
            return;
        }

        if (eatingResult) {
            // ===== CẬP NHẬT SCORE =====
            console.log(`🎯 Eating result:`, eatingResult);
            console.log(`🎯 Score from eatingResult:`, eatingResult.score);
            console.log(`🎯 Card type:`, eatingResult.type);
            
            // ===== XỬ LÝ SHUFFLE EFFECT CHO QUICKSAND =====
            if (eatingResult.shuffleEffect) {
                console.log(`🔄 Quicksand shuffle effect triggered`);
                // Shuffle sẽ được xử lý sau khi thẻ đã bị ăn hoàn toàn
            }
            
            // ===== HIỂN THỊ DAMAGE NẾU ĂN ENEMY =====
            // Damage popup giờ được xử lý trong CharacterManager.updateCharacterHP()
            
            // ===== CẬP NHẬT UI SAU KHI ĂN THẺ =====
            console.log(`🔄 Cập nhật UI sau khi ăn thẻ`);
            this.animationManager.updateCharacterDisplay();
            this.uiManager.updateSellButtonVisibility();
        }

        // ===== TÌM THẺ CẦN DI CHUYỂN (DOMINO EFFECT) =====
        const cardToMove = this.cardManager.findCardToMove(fromIndex, toIndex);
        
        // ===== TÍNH TOÁN VỊ TRÍ DI CHUYỂN =====
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        const moveX = (toPos.col - fromPos.col) * 100;
        const moveY = (toPos.row - fromPos.row) * 100;
        
        // ===== LẤY CÁC ELEMENT CẦN THIẾT =====
        const characterElement = document.querySelector(`[data-index="${fromIndex}"]`);
        const targetElement = document.querySelector(`[data-index="${toIndex}"]`);
        
        if (!characterElement || !targetElement) return;
        
        // ===== THIẾT LẬP ANIMATION =====
        characterElement.style.setProperty('--dual-move-x', `${moveX}px`);
        characterElement.style.setProperty('--dual-move-y', `${moveY}px`);
        
        characterElement.classList.add('dual-moving'); // Animation di chuyển
        targetElement.classList.add('dual-eating'); // Animation ăn
        
        // ===== ANIMATION CHO THẺ BỊ ĐẨY (DOMINO) =====
        if (cardToMove) {
            const cardToMoveElement = document.querySelector(`[data-index="${cardToMove.fromIndex}"]`);
            if (cardToMoveElement) {
                const reverseMoveX = (fromPos.col - Math.floor(cardToMove.fromIndex % 3)) * 100;
                const reverseMoveY = (fromPos.row - Math.floor(cardToMove.fromIndex / 3)) * 100;
                
                cardToMoveElement.style.setProperty('--dual-reverse-x', `${reverseMoveX}px`);
                cardToMoveElement.style.setProperty('--dual-reverse-y', `${reverseMoveY}px`);
                cardToMoveElement.classList.add('dual-reverse'); // Animation đẩy ngược
            }
        }
        
        // ===== XỬ LÝ SAU KHI ANIMATION HOÀN THÀNH =====
        setTimeout(() => {
            const newCards = [...this.cardManager.getAllCards()];
            
            // ===== LƯU THÔNG TIN THẺ BỊ ĂN TRƯỚC KHI XÓA =====
            const targetCard = newCards[toIndex];
            
            // ===== CẬP NHẬT VỊ TRÍ CHARACTER =====
            const characterCard = newCards[fromIndex]; // Lấy instance của Card
            characterCard.position = { row: Math.floor(toIndex / 3), col: toIndex % 3 }; // Cập nhật vị trí
            newCards[toIndex] = characterCard; // Di chuyển instance
            newCards[fromIndex] = null; // Xóa character ở vị trí cũ
            
            // ===== XỬ LÝ THẺ BỊ ĐẨY =====
            if (cardToMove) {
                const pushedCard = cardToMove.card; // Lấy instance của Card
                pushedCard.position = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 }; // Cập nhật vị trí
                newCards[fromIndex] = pushedCard; // Di chuyển instance
                
                // Tạo thẻ mới ở vị trí cũ của thẻ bị đẩy
                const newCard = this.cardManager.createRandomCard(cardToMove.fromIndex);
                newCards[cardToMove.fromIndex] = newCard;
            } else {
                // Tạo thẻ mới ở vị trí cũ của character
                const newCard = this.cardManager.createRandomCard(fromIndex);
                newCards[fromIndex] = newCard;
            }
            
            // ===== CẬP NHẬT DỮ LIỆU =====
            this.cardManager.cards = newCards;
            
            // ===== CẬP NHẬT HIỂN THỊ =====
            this.animationManager.updateCharacterDisplay();
            
            const newCardIndex = cardToMove ? cardToMove.fromIndex : fromIndex;
            this.animationManager.renderCardsWithAppearEffect(newCardIndex);
            this.uiManager.updateUI();
            
            // ===== SETUP EVENTS LẠI CHO CÁC THẺ MỚI =====
            this.setupCardEvents();
            
            // ===== KIỂM TRA GAME COMPLETE =====
            if (this.cardManager.isGameComplete()) {
                this.animationManager.showMessage("Congratulations! You've eaten all cards!");
            }
            
            // ===== XỬ LÝ QUICKSAND SHUFFLE SAU KHI ĂN THẺ =====
            console.log(`🔍 Checking targetCard:`, targetCard);
            if (targetCard && targetCard.nameId === 'quicksand') {
                console.log(`🔄 Quicksand shuffle triggered!`);
                
                // Thực hiện shuffle sau khi thẻ đã bị ăn và thẻ mới đã được tạo
                setTimeout(() => {
                    this.performQuicksandShuffleWithFlipEffect();
                }, 100); // Chờ 100ms để đảm bảo thẻ đã được xử lý xong
            }
            
            // ===== KIỂM TRA COIN UPGRADE NGAY LẬP TỨC SAU KHI MOVE =====
            this.checkCoinRowsAndColumns();
            
            // ===== KẾT THÚC ANIMATION =====
            this.animationManager.endAnimation();
        }, 300); // Giảm từ 400ms xuống 300ms để responsive hơn
    }

    /**
     * Hàm được gọi khi move hoàn thành thành công
     * Chứa tất cả logic cần chạy sau mỗi move
     */
    onMoveCompleted() {
        console.log(`🎯 onMoveCompleted: Bắt đầu xử lý sau khi move hoàn thành`);
        
        // ===== GIẢM COUNTDOWN CỦA TẤT CẢ BOOM CARDS =====
        this.decreaseBoomCountdown();
        
        // ===== XOAY ARROW CỦA TẤT CẢ TRAP CARDS =====
        this.transformAllTrapArrows();
        
        // ===== CẬP NHẬT UI =====
        this.uiManager.updateUI();
        
        // ===== KIỂM TRA GAME OVER =====
        if (this.combatManager.checkGameOver()) {
            this.animationManager.triggerGameOver();
            return;
        }
        
        // ===== LƯU Ý: COIN UPGRADE ĐÃ ĐƯỢC XỬ LÝ TRONG moveCharacter() =====
        // Không cần gọi checkCoinRowsAndColumns() ở đây nữa vì đã được gọi ngay sau animation
        
        console.log(`🎯 onMoveCompleted: Hoàn thành xử lý sau khi move`);
    }
    
    /**
     * Kiểm tra hàng và cột có 3 thẻ coin liên tục
     */
    checkCoinRowsAndColumns() {
        console.log(`🎯 Bắt đầu kiểm tra hàng/cột coin liên tục`);
        
        const allCards = this.cardManager.getAllCards();
        let foundUpgrade = false;
        
        // Debug: In ra toàn bộ board
        this.debugPrintBoard(allCards);
        
        // Kiểm tra 3 hàng
        for (let row = 0; row < 3; row++) {
            const rowCards = [
                allCards[row * 3],     // Cột 0
                allCards[row * 3 + 1], // Cột 1
                allCards[row * 3 + 2]  // Cột 2
            ];
            
            if (this.isCoinRow(rowCards)) {
                const firstCoin = rowCards.find(card => card && card.type === 'coin');
                console.log(`🎯 Tìm thấy hàng ${row} có 3 coin ${firstCoin.nameId} liên tục!`);
                this.processCoinRow(row, rowCards);
                foundUpgrade = true;
            }
        }
        
        // Kiểm tra 3 cột
        for (let col = 0; col < 3; col++) {
            const colCards = [
                allCards[col],         // Hàng 0
                allCards[col + 3],     // Hàng 1
                allCards[col + 6]      // Hàng 2
            ];
            
            if (this.isCoinColumn(colCards)) {
                const firstCoin = colCards.find(card => card && card.type === 'coin');
                console.log(`🎯 Tìm thấy cột ${col} có 3 coin ${firstCoin.nameId} liên tục!`);
                this.processCoinColumn(col, colCards);
                foundUpgrade = true;
            }
        }
        
        if (!foundUpgrade) {
            console.log(`🎯 Không tìm thấy hàng/cột nào có 3 coin cùng nameId`);
        }
    }
    
    /**
     * Debug: In ra toàn bộ board để kiểm tra
     * @param {Array} allCards - Tất cả thẻ trên board
     */
    debugPrintBoard(allCards) {
        console.log(`🎯 Debug Board:`);
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                const card = allCards[row * 3 + col];
                if (card) {
                    rowStr += `[${card.nameId || 'null'}] `;
                } else {
                    rowStr += `[null] `;
                }
            }
            console.log(`🎯 Hàng ${row}: ${rowStr}`);
        }
    }
    
    /**
     * Kiểm tra xem hàng có 3 thẻ coin cùng nameId liên tục không
     * @param {Array} rowCards - Mảng 3 thẻ trong hàng
     * @returns {boolean} True nếu có 3 coin cùng nameId liên tục
     */
    isCoinRow(rowCards) {
        // Kiểm tra xem có 3 thẻ không null
        if (!rowCards || rowCards.length !== 3) {
            console.log(`🎯 isCoinRow: Không đủ 3 thẻ`);
            return false;
        }
        
        // Kiểm tra xem có 3 coin không
        const coins = rowCards.filter(card => 
            card && 
            card.type === 'coin' && 
            card.nameId !== 'void'
        );
        
        if (coins.length !== 3) {
            console.log(`🎯 isCoinRow: Chỉ có ${coins.length} coin thay vì 3`);
            return false;
        }
        
        // Kiểm tra xem 3 coin có cùng nameId không
        const firstCoinNameId = coins[0].nameId;
        const allSameNameId = coins.every(coin => coin.nameId === firstCoinNameId);
        
        console.log(`🎯 isCoinRow: ${coins.length} coins, nameId: ${firstCoinNameId}, same: ${allSameNameId}`);
        
        return allSameNameId;
    }
    
    /**
     * Kiểm tra xem cột có 3 thẻ coin cùng nameId liên tục không
     * @param {Array} colCards - Mảng 3 thẻ trong cột
     * @returns {boolean} True nếu có 3 coin cùng nameId liên tục
     */
    isCoinColumn(colCards) {
        // Kiểm tra xem có 3 thẻ không null
        if (!colCards || colCards.length !== 3) {
            console.log(`🎯 isCoinColumn: Không đủ 3 thẻ`);
            return false;
        }
        
        // Kiểm tra xem có 3 coin không
        const coins = colCards.filter(card => 
            card && 
            card.type === 'coin' && 
            card.nameId !== 'void'
        );
        
        if (coins.length !== 3) {
            console.log(`🎯 isCoinColumn: Chỉ có ${coins.length} coin thay vì 3`);
            return false;
        }
        
        // Kiểm tra xem 3 coin có cùng nameId không
        const firstCoinNameId = coins[0].nameId;
        const allSameNameId = coins.every(coin => coin.nameId === firstCoinNameId);
        
        console.log(`🎯 isCoinColumn: ${coins.length} coins, nameId: ${firstCoinNameId}, same: ${allSameNameId}`);
        
        return allSameNameId;
    }
    
    /**
     * Xử lý hàng có 3 coin liên tục
     * @param {number} row - Số hàng
     * @param {Array} rowCards - Mảng 3 thẻ trong hàng
     */
    processCoinRow(row, rowCards) {
        const firstCoin = rowCards.find(card => card && card.type === 'coin');
        console.log(`🎯 Xử lý hàng ${row} có 3 coin ${firstCoin.nameId} liên tục`);
        
        for (let col = 0; col < 3; col++) {
            const cardIndex = row * 3 + col;
            const card = rowCards[col];
            
            if (card && typeof card.upCoinEffect === 'function') {
                console.log(`🎯 Gọi upCoinEffect cho ${card.nameId} tại index ${cardIndex}`);
                const result = card.upCoinEffect();
                
                if (result && result.type === 'coin_upgrade' && result.newCard) {
                    // Thay thế thẻ hiện tại bằng thẻ mới
                    result.newCard.id = cardIndex;
                    result.newCard.position = { row: row, col: col };
                    this.cardManager.updateCard(cardIndex, result.newCard);
                    
                    // Render thẻ mới với hiệu ứng
                    this.animationManager.renderCardsWithAppearEffect(cardIndex);
                    
                    console.log(`🎯 Đã thay thế ${card.nameId} bằng ${result.newCard.nameId} tại index ${cardIndex}`);
                }
            }
        }
        
        // Setup lại events sau khi thay thế
        setTimeout(() => {
            this.setupCardEvents();
            
            // Kiểm tra lại coin upgrade ngay lập tức sau khi tạo thẻ mới
            this.checkCoinRowsAndColumns();
        }, 100); // Giảm delay từ 300ms xuống 100ms
    }
    
    /**
     * Xử lý cột có 3 coin liên tục
     * @param {number} col - Số cột
     * @param {Array} colCards - Mảng 3 thẻ trong cột
     */
    processCoinColumn(col, colCards) {
        const firstCoin = colCards.find(card => card && card.type === 'coin');
        console.log(`🎯 Xử lý cột ${col} có 3 coin ${firstCoin.nameId} liên tục`);
        
        for (let row = 0; row < 3; row++) {
            const cardIndex = row * 3 + col;
            const card = colCards[row];
            
            if (card && typeof card.upCoinEffect === 'function') {
                console.log(`🎯 Gọi upCoinEffect cho ${card.nameId} tại index ${cardIndex}`);
                const result = card.upCoinEffect();
                
                if (result && result.type === 'coin_upgrade' && result.newCard) {
                    // Thay thế thẻ hiện tại bằng thẻ mới
                    result.newCard.id = cardIndex;
                    result.newCard.position = { row: row, col: col };
                    this.cardManager.updateCard(cardIndex, result.newCard);
                    
                    // Render thẻ mới với hiệu ứng
                    this.animationManager.renderCardsWithAppearEffect(cardIndex);
                    
                    console.log(`🎯 Đã thay thế ${card.nameId} bằng ${result.newCard.nameId} tại index ${cardIndex}`);
                }
            }
        }
        
        // Setup lại events sau khi thay thế
        setTimeout(() => {
            this.setupCardEvents();
            
            // Kiểm tra lại coin upgrade ngay lập tức sau khi tạo thẻ mới
            this.checkCoinRowsAndColumns();
        }, 100); // Giảm delay từ 300ms xuống 100ms
    }
    
    /**
     * Xoay arrow của tất cả trap cards sau mỗi move
     */
    transformAllTrapArrows() {
        const allCards = this.cardManager.getAllCards();
        
        allCards.forEach((card, index) => {
            if (card && card.nameId === 'trap' && typeof card.transformationAgency === 'function') {
                // Gọi hàm xoay arrow của trap card
                card.transformationAgency();
                
                // Cập nhật hiển thị của trap card
                const cardElement = document.querySelector(`[data-index="${index}"]`);
                if (cardElement) {
                    // Xóa tất cả arrow cũ
                    const oldArrows = cardElement.querySelectorAll('.trap-arrow');
                    oldArrows.forEach(arrow => arrow.remove());
                    
                    // Tạo lại arrow mới theo thuộc tính đã xoay
                    const arrowConfigs = [
                        { position: 'top-center', property: 'arrowTop' },
                        { position: 'bottom-center', property: 'arrowBottom' },
                        { position: 'left-center', property: 'arrowLeft' },
                        { position: 'right-center', property: 'arrowRight' }
                    ];
                    
                    arrowConfigs.forEach(({ position, property }) => {
                        if (card[property] === 1) {
                            const arrowElement = document.createElement('div');
                            arrowElement.className = `trap-arrow ${position}`;
                            arrowElement.innerHTML = '➤';
                            cardElement.appendChild(arrowElement);
                        }
                    });
                }
            }
        });
    }
    
    /**
     * Thực hiện shuffle logic cho Quicksand với flip card effect
     */
    performQuicksandShuffleWithFlipEffect() {
        // Lấy tất cả thẻ hiện tại (đã có thẻ mới được tạo từ moveCharacter)
        const allCards = this.cardManager.getAllCards();
        
        // Tạo mảng các vị trí để đổi chỗ ngẫu nhiên
        const positions = Array.from({length: allCards.length}, (_, i) => i);
        
        // Đổi chỗ tất cả thẻ ngẫu nhiên kể cả character (Fisher-Yates shuffle)
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        // Thực hiện đổi chỗ với hiệu ứng flip card
        const shuffledCards = [];
        for (let i = 0; i < allCards.length; i++) {
            if (allCards[i]) {
                shuffledCards[positions[i]] = allCards[i];
                // Cập nhật vị trí của thẻ
                allCards[i].position = { 
                    row: Math.floor(positions[i] / 3), 
                    col: positions[i] % 3 
                };
            }
        }
        
        // Cập nhật tất cả thẻ
        this.cardManager.setAllCards(shuffledCards);
        
        // Thực hiện flip card effect cho toàn bộ thẻ cùng lúc
        const allCardElements = document.querySelectorAll('.card');
        
        // Thêm class flip cho tất cả thẻ
        allCardElements.forEach(element => {
            element.classList.add('flipping');
        });
        
        // Đổi vị trí sau khi bắt đầu flip
        setTimeout(() => {
            // Cập nhật tất cả thẻ
            this.cardManager.setAllCards(shuffledCards);
            
            // Xóa class flip sau khi animation hoàn thành
            setTimeout(() => {
                // Render lại toàn bộ grid với vị trí mới
                this.animationManager.renderCards();
                
                // Cập nhật UI
                this.uiManager.updateUI();
                this.animationManager.updateCharacterDisplay();
                this.uiManager.updateSellButtonVisibility();
                this.setupCardEvents();
                
                // Kiểm tra game over sau khi shuffle
                if (this.combatManager.checkGameOver()) {
                    this.animationManager.triggerGameOver();
                }
            }, 600); // Thời gian flip animation
        }, 50); // Delay nhỏ để bắt đầu flip trước
    }

    /**
     * Xử lý tương tác với treasure từ xa
     * @param {number} treasureIndex - Index của treasure card
     */
    interactWithTreasure(treasureIndex) {
        // ===== KIỂM TRA ANIMATION STATE =====
        if (this.animationManager.isCurrentlyAnimating()) {
            console.log(`🎬 Bỏ qua tương tác vì đang có animation`);
            return;
        }

        const treasureCard = this.cardManager.getCard(treasureIndex);
        if (!treasureCard || treasureCard.type !== 'treasure') {
            console.log(`❌ Không phải treasure card tại index ${treasureIndex}`);
            return;
        }

        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.animationManager.startAnimation();

        console.log(`💎 Tương tác với treasure tại index ${treasureIndex}`);
        
        // ===== TÌM CHARACTER INDEX =====
        const characterIndex = this.cardManager.findCharacterIndex();
        
        // ===== BẮT ĐẦU ANIMATION =====
        this.animationManager.startTreasureInteractionAnimation(characterIndex, treasureIndex);
        
        // ===== GỌI HÀM TƯƠNG TÁC =====
        const interactResult = treasureCard.interactWithCharacter(this.characterManager, this.gameState, this.cardManager);
        
        // ===== TĂNG MOVES =====
        this.gameState.incrementMoves();
        
        // ===== GỌI HÀM XỬ LÝ SAU KHI TĂNG MOVE =====
        this.onMoveCompleted();
        
        if (interactResult) {
            console.log(`💎 Interact result:`, interactResult);
            
            // ===== XỬ LÝ KHI TREASURE HẾT DURABILITY =====
            if (interactResult.type === 'treasure_killed_by_interact') {
                console.log(`💎 Treasure hết durability, tạo reward mới`);
                
                // Sử dụng reward card từ treasure
                setTimeout(() => {
                    const rewardCard = interactResult.reward.card;
                    if (rewardCard) {
                        rewardCard.id = treasureIndex;
                        rewardCard.position = { row: Math.floor(treasureIndex / 3), col: treasureIndex % 3 };
                        this.cardManager.updateCard(treasureIndex, rewardCard);
                        this.animationManager.renderCardsWithAppearEffect(treasureIndex);
                        this.setupCardEvents();
                    }
                }, 400);
            }
            
            // ===== CẬP NHẬT UI =====
            this.uiManager.updateUI();
            this.animationManager.updateCharacterDisplay();
            
            // ===== CẬP NHẬT TREASURE DISPLAY =====
            if (interactResult.type === 'treasure_interact') {
                this.animationManager.updateTreasureDisplay(treasureIndex);
            }
        }

        // ===== KẾT THÚC ANIMATION =====
        this.animationManager.endAnimation();
    }

    /**
     * Xử lý tương tác với boom từ xa
     * @param {number} boomIndex - Index của boom card
     */
    interactWithBoom(boomIndex) {
        // ===== KIỂM TRA ANIMATION STATE =====
        if (this.animationManager.isCurrentlyAnimating()) {
            console.log(`🎬 Bỏ qua tương tác boom vì đang có animation`);
            return;
        }

        const boomCard = this.cardManager.getCard(boomIndex);
        if (!boomCard || boomCard.type !== 'boom') {
            console.log(`❌ Không phải boom card tại index ${boomIndex}`);
            return;
        }

        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.animationManager.startAnimation();

        console.log(`💥 Tương tác với boom tại index ${boomIndex}`);
        
        // ===== TÌM CHARACTER INDEX =====
        const characterIndex = this.cardManager.findCharacterIndex();
        
        // ===== GỌI HÀM TƯƠNG TÁC =====
        const interactResult = boomCard.interactWithCharacter(this.characterManager, this.gameState, this.cardManager, boomIndex);
        
        // ===== TĂNG MOVES =====
        this.gameState.incrementMoves();
        
        // ===== GỌI HÀM XỬ LÝ SAU KHI TĂNG MOVE =====
        this.onMoveCompleted();
        
        if (interactResult) {
            console.log(`💥 Interact result:`, interactResult);
            
            // ===== XỬ LÝ KHI BOOM ĐỔI VỊ TRÍ =====
            if (interactResult.type === 'boom_interact') {
                console.log(`💥 Boom đổi vị trí với character`);
                
                // Sử dụng vị trí mới sau khi đổi chỗ
                const newCharacterIndex = interactResult.boomPosition; // Character giờ ở vị trí cũ của boom
                const newBoomIndex = interactResult.characterPosition; // Boom giờ ở vị trí cũ của character
                
                // Thực hiện flip animation cho cả character và boom
                setTimeout(() => {
                    this.animationManager.flipCards(newCharacterIndex, newBoomIndex, () => {
                        // Sau khi flip xong, render lại cards
                        this.animationManager.renderCards();
                        this.setupCardEvents();
                    });
                }, 400);
            }
        }
        
        // ===== GIẢM COUNTDOWN CỦA TẤT CẢ BOOM CARDS (SAU KHI MOVE HOÀN THÀNH) =====
        this.decreaseBoomCountdown();
    }

    /**
     * Xử lý khi click New Game
     */
    onNewGame() {
        // ===== FORCE RESET ANIMATION STATE =====
        this.animationManager.forceResetAnimationState();
        
        this.gameState.reset(); // Reset score, moves
        this.characterManager.reset(); // Reset HP, weapon
        this.cardManager.createCards(this.characterManager); // Tạo cards mới với characterManager
        this.animationManager.renderCards(); // Render cards
        this.uiManager.updateUI(); // Cập nhật UI
        this.setupCardEvents(); // Setup events
    }



    /**
     * Xử lý khi click Sell Weapon
     */
    onSellWeapon() {
        const weaponDurability = this.characterManager.getWeaponDurability();
        console.log(`⚔️ Selling weapon: durability=${weaponDurability}`);
        if (weaponDurability > 0) {
            // Bán vũ khí và nhận điểm
            const sellValue = this.characterManager.sellWeapon();
            this.gameState.addScore(sellValue);
            console.log(`💰 Bán vũ khí với giá trị: ${sellValue}`);
            this.uiManager.updateUI();
            this.updateSellButtonVisibility(); // Cập nhật hiển thị nút Sell
        }
    }

    /**
     * Cập nhật hiển thị nút Sell dựa trên độ bền vũ khí
     */
    updateSellButtonVisibility() {
        const sellButton = document.getElementById('sell-weapon');
        const weaponDurability = this.characterManager.getWeaponDurability();
        
        if (weaponDurability > 0) {
            sellButton.style.display = 'inline-block';
        } else {
            sellButton.style.display = 'none';
        }
    }

    /**
     * Giảm countdown của tất cả boom cards và xử lý nổ
     */
    decreaseBoomCountdown() {
        const cards = this.cardManager.getAllCards();
        const explodingBooms = [];
        
        // Giảm countdown của tất cả boom cards
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card && card.type === 'boom') {
                card.countdown -= 1;
                console.log(`💥 Boom tại index ${i}: countdown = ${card.countdown}`);
                
                // Cập nhật hiển thị countdown
                this.animationManager.updateBoomDisplay(i);
                
                // Kiểm tra nếu countdown = 0
                if (card.countdown <= 0) {
                    explodingBooms.push({
                        card: card,
                        index: i
                    });
                }
            }
        }
        
        // Xử lý các boom nổ
        if (explodingBooms.length > 0) {
            console.log(`💥 Có ${explodingBooms.length} boom sắp nổ!`);
            
            // Xử lý từng boom nổ
            explodingBooms.forEach((boomData, index) => {
                setTimeout(() => {
                    this.handleBoomExplosion(boomData.card, boomData.index);
                }, index * 200); // Delay 200ms giữa các boom
            });
        }
    }

    /**
     * Xử lý khi boom nổ
     * @param {Boom} boomCard - Boom card sắp nổ
     * @param {number} boomIndex - Index của boom card
     */
    handleBoomExplosion(boomCard, boomIndex) {
        console.log(`💥 Boom nổ tại index ${boomIndex}!`);
        
        // Gọi hàm explodeEffect của boom
        const explosionResult = boomCard.explodeEffect(
            this.characterManager, 
            this.gameState, 
            this.cardManager, 
            boomIndex,
            this.animationManager
        );
        
        if (explosionResult && explosionResult.type === 'boom_exploded') {
            // Tạo danh sách tất cả thẻ bị ảnh hưởng (bao gồm boom và các thẻ liền kề)
            const allAffectedCards = [boomIndex, ...explosionResult.adjacentCards];
            
            // Bắt đầu animation boom explosion
            this.animationManager.startBoomExplosionAnimation(allAffectedCards, boomIndex);
            
            // Hiển thị damage popup cho character nếu bị ảnh hưởng
            const characterIndex = this.cardManager.findCharacterIndex();
            if (characterIndex !== null && explosionResult.adjacentCards.includes(characterIndex)) {
                const characterElement = document.querySelector(`[data-index="${characterIndex}"]`);
                if (characterElement) {
                    this.animationManager.createDamagePopup(characterElement, explosionResult.damage);
                }
            }
            
            // Hiển thị damage popup cho các thẻ khác bị ảnh hưởng (trừ character)
            if (explosionResult.affectedNonCharacterCards) {
                explosionResult.affectedNonCharacterCards.forEach(affectedCard => {
                    const cardElement = document.querySelector(`[data-index="${affectedCard.index}"]`);
                    if (cardElement) {
                        this.animationManager.createDamagePopup(cardElement, affectedCard.damage);
                    }
                });
            }
            
            // Xử lý render lại các thẻ bị thay thế (coin mới được tạo)
            if (explosionResult.affectedNonCharacterCards) {
                explosionResult.affectedNonCharacterCards.forEach(affectedCard => {
                    if (affectedCard.wasKilled) {
                        // Render lại thẻ đã được thay thế bằng coin
                        this.animationManager.renderCardsWithAppearEffect(affectedCard.index);
                    }
                });
            }
            
            // Thay thế boom bằng thẻ mới sau khi animation hoàn thành
            setTimeout(() => {
                this.cardManager.updateCard(boomIndex, explosionResult.newCard);
                
                // Render lại cards với hiệu ứng xuất hiện
                this.animationManager.renderCardsWithAppearEffect(boomIndex);
                this.setupCardEvents();
                
                // Cập nhật UI
                this.uiManager.updateUI();
                
                console.log(`💥 ${explosionResult.effect}`);
            }, 500); // Đợi animation hoàn thành
        }
    }

    /**
     * Xử lý khi restart từ game over dialog
     */
    onRestartFromGameOver() {
        // ===== FORCE RESET ANIMATION STATE =====
        this.animationManager.forceResetAnimationState();
        
        this.animationManager.hideGameOverDialog(); // Ẩn dialog
        this.onNewGame(); // Bắt đầu game mới
    }
} 