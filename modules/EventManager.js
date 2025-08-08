// EventManager.js - Quản lý tất cả events và tương tác người dùng
// Chức năng: Xử lý click, touch, long press, và các tương tác khác
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
        this.gameState = gameState; // Quản lý score, moves 
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
                // ===== SETUP CLICK EVENTS CHO TẤT CẢ CARDS =====
                this.setupClickEvents(cardElement, index);
                this.setupLongPressEvents(cardElement, index); // Long press cho thông tin thẻ
            }
        });
    }

    /**
     * Xóa tất cả events cũ của card element
     * @param {HTMLElement} cardElement - DOM element của card
     */
    // removeCardEvents(cardElement) {
    //     // Xóa click handler
    //     if (cardElement._clickHandler) {
    //         cardElement.removeEventListener('click', cardElement._clickHandler);
    //         delete cardElement._clickHandler;
    //     }

    //     // Xóa touch handlers
    //     if (cardElement._touchStartHandler) {
    //         cardElement.removeEventListener('touchstart', cardElement._touchStartHandler);
    //         delete cardElement._touchStartHandler;
    //     }

    //     if (cardElement._touchEndHandler) {
    //         cardElement.removeEventListener('touchend', cardElement._touchEndHandler);
    //         delete cardElement._touchEndHandler;
    //     }

    //     // Xóa mouse handlers
    //     if (cardElement._mouseDownHandler) {
    //         cardElement.removeEventListener('mousedown', cardElement._mouseDownHandler);
    //         delete cardElement._mouseDownHandler;
    //     }

    //     if (cardElement._mouseUpHandler) {
    //         cardElement.removeEventListener('mouseup', cardElement._mouseUpHandler);
    //         delete cardElement._mouseUpHandler;
    //     }

    //     if (cardElement._mouseLeaveHandler) {
    //         cardElement.removeEventListener('mouseleave', cardElement._mouseLeaveHandler);
    //         delete cardElement._mouseLeaveHandler;
    //     }
    // }

    /**
     * Setup events cho một card cụ thể
     * @param {number} index - Index của card
     */
    // setupCardEventsForIndex(index) {
    //     const cardElement = document.querySelector(`[data-index="${index}"]`);
    //     if (cardElement) {
    //         const card = this.cardManager.getCard(index);
    //         if (card) {
    //             this.setupClickEvents(cardElement, index);
    //             this.setupLongPressEvents(cardElement, index);
    //         }
    //     }
    // }

    /**
     * Setup click events cho tất cả cards
     * @param {HTMLElement} cardElement - DOM element của card
     * @param {number} index - Index của card
     */
    setupClickEvents(cardElement, index) {
        // Xóa events cũ trước khi thêm mới
        // có thể ko cần 
        //this.removeCardEvents(cardElement);

        // Mouse click events
        const clickHandler = (e) => {
            this.handleCardClick(e, index);
        };
        cardElement.addEventListener('click', clickHandler);
        cardElement._clickHandler = clickHandler;

        // Touch events cho mobile
        const touchStartHandler = (e) => {
            e.preventDefault();
            this.handleTouchStart(e, index);
        };
        cardElement.addEventListener('touchstart', touchStartHandler);
        cardElement._touchStartHandler = touchStartHandler;

        const touchEndHandler = (e) => {
            e.preventDefault();
            this.handleTouchEnd(e, index);
        };
        cardElement.addEventListener('touchend', touchEndHandler);
        cardElement._touchEndHandler = touchEndHandler;
    }

    /**
     * Setup long press events cho cards
     * @param {HTMLElement} cardElement - DOM element của card
     * @param {number} index - Index của card
     */
    setupLongPressEvents(cardElement, index) {
        // ===== SETUP LONG PRESS CHO TẤT CẢ CARDS (BAO GỒM CHARACTER) =====
        // Mouse events cho long press
        const mouseDownHandler = (e) => {
            this.handleLongPressStart(e, index);
        };
        cardElement.addEventListener('mousedown', mouseDownHandler);
        cardElement._mouseDownHandler = mouseDownHandler;

        const mouseUpHandler = (e) => {
            this.handleLongPressEnd(e);
        };
        cardElement.addEventListener('mouseup', mouseUpHandler);
        cardElement._mouseUpHandler = mouseUpHandler;

        const mouseLeaveHandler = (e) => {
            this.handleLongPressCancel(e);
        };
        cardElement.addEventListener('mouseleave', mouseLeaveHandler);
        cardElement._mouseLeaveHandler = mouseLeaveHandler;

        // Touch events cho long press (sử dụng cùng touch handler với click)
        // Long press sẽ được xử lý trong handleTouchEnd
    }

    /**
     * Xử lý click vào card (không phải character)
     * @param {Event} e - Click event
     * @param {number} index - Index của card
     */
    handleCardClick(e, index) {
        console.log('CardClick thanh cong', e, index);
        // ===== KIỂM TRA ANIMATION STATE =====
        if (this.animationManager.isCurrentlyAnimating()) {
            return;
        }

        const cardElement = e.target.closest('.card');
        if (!cardElement) return;

        const cardType = cardElement.dataset.type;
        const characterIndex = this.cardManager.findCharacterIndex();
        // ===== XỬ LÝ CLICK VÀO CHARACTER =====
        if (cardType === 'character') {
            this.animationManager.showCharacterArrows(cardElement);
            return;
        }

        // ===== XỬ LÝ CLICK VÀO CÁC LOẠI CARD KHÁC =====
        if (cardType === 'enemy' || cardType === 'coin' || cardType === 'food' || cardType === 'weapon' || cardType === 'trap') {

            if (characterIndex !== null && this.combatManager.isValidMove(characterIndex, index)) {
                this.moveCharacter(characterIndex, index); // Di chuyển character đến card
            }
        }
        // ===== XỬ LÝ CLICK VÀO TREASURE (CHỈ TƯƠNG TÁC KHI Ở BÊN CẠNH) =====
        else if (cardType === 'treasure') {

            if (characterIndex !== null && this.combatManager.isValidMove(characterIndex, index)) {
                this.interactWithTreasure(index);
            }
            // Không thể tương tác với treasure từ xa

        }
        // ===== XỬ LÝ CLICK VÀO BOOM (CHỈ TƯƠNG TÁC KHI Ở BÊN CẠNH) =====
        else if (cardType === 'boom') {

            if (characterIndex !== null && this.combatManager.isValidMove(characterIndex, index)) {
                this.interactWithBoom(index);
            }
            // Không thể tương tác với boom từ xa

        }
    }

    /**
     * Xử lý touch start cho mobile
     * @param {Event} e - Touch event
     * @param {number} index - Index của card
     */
    handleTouchStart(e, index) {
        e.preventDefault();

        // ===== LƯU THÔNG TIN TOUCH =====
        this.gameState.setTouchStartTime(Date.now());
        this.gameState.setTouchStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }

    /**
     * Xử lý touch end cho mobile
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

        // ===== KIỂM TRA NULL SAFETY =====
        if (!touchStartTime || !touchStartPos) {
            // Nếu không có thông tin touch start, bỏ qua
            this.gameState.clearTouchStartTime();
            this.gameState.clearTouchStartPos();
            return;
        }

        // ===== TÍNH KHOẢNG CÁCH DI CHUYỂN =====
        const distance = Math.sqrt(
            Math.pow(touchEndPos.x - touchStartPos.x, 2) +
            Math.pow(touchEndPos.y - touchStartPos.y, 2)
        );

        const touchDuration = touchEndTime - touchStartTime;

        // ===== XỬ LÝ LONG PRESS =====
        if (touchDuration >= this.gameState.getLongPressDelay()) {
            // Long press - hiển thị thông tin card
            this.uiManager.showCardInfo(index, this.cardManager);
        }
        // ===== XỬ LÝ TAP =====
        else if (touchDuration < 300 && distance < 10) {
            // Tap - thực hiện hành động click
            // ===== KIỂM TRA ANIMATION STATE =====
            // if (this.animationManager.isCurrentlyAnimating()) {
            //     return;
            // }

            // Xử lý như click
            this.handleCardClick(e, index);
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
            return;
        }

        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.animationManager.startAnimation();

        // ===== XỬ LÝ ĂN THẺ =====
        const eatingResult = this.combatManager.processCardEating(fromIndex, toIndex);

        if (eatingResult === true) {
            // onMoveCompleted() sẽ được gọi sau khi tạo thẻ mới trong attackMonsterWithWeapon
            this.animationManager.endAnimation();
            return;
        }

        // ===== TÌM THẺ CẦN DI CHUYỂN (DOMINO EFFECT) =====
        const cardToMove = this.combatManager.findCardToMove(fromIndex, toIndex);

        // ===== GỌI ANIMATION MANAGER ĐỂ THỰC HIỆN ANIMATION =====
        this.animationManager.startMoveCharacterAnimation(fromIndex, toIndex, cardToMove, () => {
            // ===== CALLBACK SAU KHI ANIMATION HOÀN THÀNH =====
            const newCards = [...this.cardManager.getAllCards()];

            // ===== LƯU THÔNG TIN THẺ BỊ ĂN TRƯỚC KHI XÓA =====
            const targetCard = newCards[toIndex];

            // ===== CẬP NHẬT VỊ TRÍ CHARACTER =====
            const characterCard = newCards[fromIndex];
            characterCard.id = toIndex;
            characterCard.position = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
            newCards[toIndex] = characterCard;
            newCards[fromIndex] = null;

            // ===== XỬ LÝ THẺ BỊ ĐẨY =====
            if (cardToMove) {
                const pushedCard = cardToMove.card;
                pushedCard.id = fromIndex;
                pushedCard.position = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
                newCards[fromIndex] = pushedCard;

                // Tạo thẻ mới ở vị trí cũ của thẻ bị đẩy
                const newCard = this.cardManager.createRandomCard(cardToMove.fromIndex);
                newCard.id = cardToMove.fromIndex;
                newCard.position = { row: Math.floor(cardToMove.fromIndex / 3), col: cardToMove.fromIndex % 3 };
                newCards[cardToMove.fromIndex] = newCard;
            } else {
                // Tạo thẻ mới ở vị trí cũ của character
                const newCard = this.cardManager.createRandomCard(fromIndex);
                newCard.id = fromIndex;
                newCard.position = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
                newCards[fromIndex] = newCard;
            }

            // ===== CẬP NHẬT DỮ LIỆU =====
            this.cardManager.cards = newCards;

            // ===== CẬP NHẬT HIỂN THỊ =====
            //this.animationManager.updateCharacterDisplay();

            // ===== CẬP NHẬT CÁC THẺ THAY ĐỔI =====
            // Character và card bị đẩy: cập nhật bằng updateEntireGrid (không có hiệu ứng)
            // Thẻ mới: cập nhật bằng renderCardsWithAppearEffect (có hiệu ứng xuất hiện)

            // Cập nhật tất cả thẻ (character, card bị đẩy, thẻ mới) bằng updateEntireGrid
            this.animationManager.updateEntireGrid();

            // Thêm hiệu ứng xuất hiện cho thẻ mới
            if (cardToMove) {
                // Thẻ mới được tạo ở vị trí cũ của thẻ bị đẩy
                this.animationManager.renderCardsWithAppearEffect(cardToMove.fromIndex);
            } else {
                // Thẻ mới được tạo ở vị trí cũ của character
                this.animationManager.renderCardsWithAppearEffect(fromIndex);
            }

            this.uiManager.updateUI();

            // ===== SETUP EVENTS LẠI CHO CÁC THẺ MỚI =====
            this.setupCardEvents();

            // ===== XỬ LÝ QUICKSAND SHUFFLE SAU KHI ĂN THẺ =====
            if (targetCard && targetCard.nameId === 'quicksand') {
                setTimeout(() => {
                    this.performQuicksandShuffleWithFlipEffect();
                }, 100);
            }

            // ===== GỌI HÀM XỬ LÝ SAU KHI TĂNG MOVE =====
            this.onMoveCompleted();

            // ===== KẾT THÚC ANIMATION =====
            this.animationManager.endAnimation();
        });
    }

    /**
     * Hàm được gọi khi move hoàn thành thành công
     * Chứa tất cả logic cần chạy sau mỗi move
     */
    onMoveCompleted() {
        // ===== GIẢM COUNTDOWN CỦA TẤT CẢ BOOM CARDS =====
        this.decreaseBoomCountdown();
        // ===== TĂNG MOVES KHI WARRIOR DI CHUYỂN =====
        this.gameState.incrementMoves();
        // ===== XỬ LÝ HỒI PHỤC VÀ ĐỘC =====
        this.characterManager.processRecovery(); // Xử lý hồi phục trước 
        this.characterManager.processPoison(); // Xử lý độc sau 
        this.processCurse();
        // ===== KIỂM TRA COIN UPGRADE NGAY LẬP TỨC SAU KHI MOVE =====
        this.checkCoinRowsAndColumns();
        // ===== XOAY ARROW CỦA TẤT CẢ TRAP CARDS =====
        this.animationManager.transformAllTrapArrows();
        // ===== XỬ LÝ THU NỢ CỦA FATUI1 =====
        this.processDebtCollection();
        // ===== CẬP NHẬT UI =====
        this.uiManager.updateUI();
    }
    /**
     * Xử lý Curse của tất cả cards
     *  
     */
    processCurse() {


        const allCards = this.cardManager.getAllCards();

        allCards.forEach((card, index) => {
            if (card && card.curse === true && typeof card.takeDamageEffect === 'function') {
                // Chạy hiệu ứng  
                let damage = 1
                if(card.hp < 2){
                    //damage = 0;
                    card.curse = false;
                    return;
                }
                card.takeDamageEffect(document.querySelector(`[data-card-id="${card.id}"]`), damage,'curse', this.characterManager, this.cardManager) 
            }
        });

    }
    /**
     * Kiểm tra hàng và cột có 3 thẻ coin liên tục
     */
    checkCoinRowsAndColumns() {
        const allCards = this.cardManager.getAllCards();
        let foundUpgrade = false;

        for (let i = 0; i < 3; i++) {
            // Kiểm tra hàng i
            const rowCards = [allCards[i * 3], allCards[i * 3 + 1], allCards[i * 3 + 2]];
            if (this.isCoinLine(rowCards)) {
                this.processCoinUpgrade('row', i, rowCards);
                foundUpgrade = true;
            }

            // Kiểm tra cột i
            const colCards = [allCards[i], allCards[i + 3], allCards[i + 6]];
            if (this.isCoinLine(colCards)) {
                this.processCoinUpgrade('column', i, colCards);
                foundUpgrade = true;
            }
        }

        return foundUpgrade;
    }

    /**
     * Xử lý thu nợ của tất cả Fatui1 cards
     * Tìm tất cả Fatui1 và chạy debtCollectionEffect
     */
    processDebtCollection() {
        const allCards = this.cardManager.getAllCards();

        allCards.forEach((card, index) => {
            if (card && card.nameId === 'fatui1' && typeof card.debtCollectionEffect === 'function') {
                // Chạy hiệu ứng thu nợ cho Fatui1
                const debtCollectionEffectResult = card.debtCollectionEffect(index, this.characterManager, this.cardManager);
                if (debtCollectionEffectResult) {
                    // Bắt đầu animation thu nợ thông qua AnimationManager
                    this.animationManager.startDebtCollectionAnimation(index, debtCollectionEffectResult);
                }
            }
        });
    }

    /**
     * Kiểm tra xem mảng thẻ có 3 thẻ coin cùng nameId liên tục không
     * @param {Array} cards - Mảng 3 thẻ (hàng hoặc cột)
     * @returns {boolean} True nếu có 3 coin cùng nameId liên tục
     */
    isCoinLine(cards) {
        // Kiểm tra xem có 3 thẻ không null
        if (!cards || cards.length !== 3) {
            return false;
        }

        // Kiểm tra xem có 3 coin không
        const coins = cards.filter(card =>
            card &&
            card.type === 'coin' &&
            card.nameId !== 'void'
        );

        if (coins.length !== 3) {
            return false;
        }

        // Kiểm tra xem 3 coin có cùng nameId không
        const firstCoinNameId = coins[0].nameId;
        const allSameNameId = coins.every(coin => coin.nameId === firstCoinNameId);

        return allSameNameId;
    }

    /**
     * Xử lý upgrade coin (hàng hoặc cột)
     * @param {string} direction - 'row' hoặc 'column'
     * @param {number} index - Số hàng hoặc cột
     * @param {Array} cards - Mảng 3 thẻ trong hàng/cột
     */
    processCoinUpgrade(direction, index, cards) {
        const firstCoin = cards.find(card => card && card.type === 'coin');
        const upgradedCardIndexes = []; // Lưu danh sách các thẻ được upgrade

        for (let i = 0; i < 3; i++) {
            let cardIndex;
            if (direction === 'row') {
                cardIndex = index * 3 + i; // Tính theo hàng
            } else {
                cardIndex = i * 3 + index; // Tính theo cột
            }

            const card = cards[i];

            if (card && typeof card.upCoinEffect === 'function') {
                const result = card.upCoinEffect();

                if (result && result.type === 'coin_upgrade' && result.newCard) {
                    // Thay thế thẻ hiện tại bằng thẻ mới
                    result.newCard.id = cardIndex;
                    if (direction === 'row') {
                        result.newCard.position = { row: index, col: i };
                    } else {
                        result.newCard.position = { row: i, col: index };
                    }
                    this.cardManager.updateCard(cardIndex, result.newCard);

                    // Thêm vào danh sách thẻ cần render
                    upgradedCardIndexes.push(cardIndex);
                }
            }
        }

        // Render tất cả thẻ được upgrade cùng lúc với hiệu ứng mượt mà
        if (upgradedCardIndexes.length > 0) {
            // Sử dụng upgradedCardIndexes để đảm bảo không mất thẻ
            this.animationManager.renderListCardsWithAppearEffect(upgradedCardIndexes);
        }

        // Setup lại events sau khi thay thế
        setTimeout(() => {
            // code này có thể ko cần thiết 
            this.setupCardEvents();

            // Kiểm tra lại coin upgrade ngay lập tức sau khi tạo thẻ mới
            //this.checkCoinRowsAndColumns();
        }, 100); // Giảm delay từ 300ms xuống 100ms
    }

    /**
     * Thực hiện shuffle logic cho Quicksand với flip card effect
     */
    performQuicksandShuffleWithFlipEffect() {
        // Lấy tất cả thẻ hiện tại (đã có thẻ mới được tạo từ moveCharacter)
        const allCards = this.cardManager.getAllCards();

        // Tạo mảng các vị trí để đổi chỗ ngẫu nhiên
        const positions = Array.from({ length: allCards.length }, (_, i) => i);

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
                // Cập nhật id và vị trí của thẻ
                allCards[i].id = positions[i];
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
                //this.uiManager.updateSellButtonVisibility();
                this.setupCardEvents();

                // Game over được xử lý trong damageCharacterHP khi HP = 0
            }, 600); // Thời gian flip animation
        }, 50); // Delay nhỏ để bắt đầu flip trước
    }

    /**
     * Xử lý tương tác với treasure từ xa
     * @param {number} treasureIndex - Index của treasure card
     */
    interactWithTreasure(treasureIndex) {
        // ===== KIỂM TRA ANIMATION STATE ===== /có thể xóa 
        if (this.animationManager.isCurrentlyAnimating()) {
            //🎬 Bỏ qua tương tác vì đang có animation
            return;
        }
        //có thể xóa 
        const treasureCard = this.cardManager.getCard(treasureIndex);
        if (!treasureCard || treasureCard.type !== 'treasure') {
            // console.log(`❌ Không phải treasure card tại index ${treasureIndex}`);
            return;
        }

        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.animationManager.startAnimation();

        // ===== TÌM CHARACTER INDEX =====
        const characterIndex = this.cardManager.findCharacterIndex();

        // ===== BẮT ĐẦU ANIMATION =====
        this.animationManager.startTreasureInteractionAnimation(characterIndex, treasureIndex);

        // ===== GỌI HÀM TƯƠNG TÁC =====
        const interactResult = treasureCard.interactWithCharacter(this.characterManager, this.gameState, this.cardManager);

        // ===== XỬ LÝ KHI TREASURE ĐƯỢC TƯƠNG TÁC =====
        if (interactResult) {
            // ===== XỬ LÝ KHI TREASURE HẾT DURABILITY =====
            if (interactResult.type === 'treasure_killed_by_interact') {
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

            // ===== CẬP NHẬT CHARACTER DISPLAY =====
            this.animationManager.updateCharacterDisplay();

            // ===== CẬP NHẬT TREASURE DISPLAY =====
            if (interactResult.type === 'treasure_interact') {
                this.animationManager.updateTreasureDisplay(treasureIndex);
            }
            // ===== GỌI HÀM XỬ LÝ SAU KHI TĂNG MOVE =====
            this.onMoveCompleted();

        }

        // ===== KẾT THÚC ANIMATION =====
        this.animationManager.endAnimation();
    }

    /**
     * Xử lý tương tác với boom từ xa
     * @param {number} boomIndex - Index của boom card
     */
    interactWithBoom(boomIndex) {
        // ===== KIỂM TRA ANIMATION STATE ===== // có thể cân nhắc bỏ phần code này  vì check 1 lần rồi 
        if (this.animationManager.isCurrentlyAnimating()) {
            //🎬 Bỏ qua tương tác vì đang có animation
            return;
        }
        // có thể cân nhắc bỏ phần code này 
        const boomCard = this.cardManager.getCard(boomIndex);
        if (!boomCard || boomCard.type !== 'boom') {
            // console.log(`❌ Không phải boom card tại index ${boomIndex}`);
            return;
        }

        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.animationManager.startAnimation();

        // ===== TÌM CHARACTER INDEX =====
        const characterIndex = this.cardManager.findCharacterIndex();

        // ===== GỌI HÀM TƯƠNG TÁC =====
        const interactResult = boomCard.interactWithCharacter(this.characterManager, this.gameState, this.cardManager, boomIndex);

        if (interactResult) {
            // ===== XỬ LÝ KHI BOOM ĐỔI VỊ TRÍ =====
            if (interactResult.type === 'boom_interact') {
                // Sử dụng vị trí mới sau khi đổi chỗ
                const newCharacterIndex = interactResult.boomPosition; // Character giờ ở vị trí cũ của boom
                const newBoomIndex = interactResult.characterPosition; // Boom giờ ở vị trí cũ của character

                // Thực hiện flip animation cho cả character và boom
                setTimeout(() => {
                    this.animationManager.flipCards(newCharacterIndex, newBoomIndex, () => {
                        // Sau khi flip xong, render lại cards
                        this.animationManager.renderCards();
                        this.setupCardEvents();

                        // ===== CẬP NHẬT CHARACTER DISPLAY =====
                        this.animationManager.updateCharacterDisplay();

                        // ===== GỌI HÀM XỬ LÝ SAU KHI TĂNG MOVE =====
                        this.onMoveCompleted();

                        // ===== KẾT THÚC ANIMATION =====
                        this.animationManager.endAnimation();
                    });
                }, 400);
            }
        }
    }

    /**
     * Xử lý khi click New Game
     */
    onNewGame() {
        this.gameState.reset(); // Reset score, moves
        this.characterManager.reset(); // Reset HP, weapon
        this.cardManager.createCards(this.characterManager); // Tạo cards mới với characterManager
        this.animationManager.renderCards(); // Render cards
        this.uiManager.updateUI(); // Cập nhật UI
        this.setupCardEvents(); // Setup events

        // ===== KIỂM TRA COIN UPGRADE NGAY LẬP TỨC SAU KHI MOVE =====
        this.checkCoinRowsAndColumns();
    }



    /**
     * Xử lý khi click Sell Weapon
     */
    onSellWeapon() {
        const weaponDurability = this.characterManager.getCharacterWeaponDurability();
        if (weaponDurability > 0) {
            // Bán vũ khí và nhận điểm
            const sellValue = this.characterManager.sellWeapon();
            this.gameState.addScore(sellValue);
            this.animationManager.updateCharacterDisplay();
            this.uiManager.updateUI();
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
            // const characterIndex = this.cardManager.findCharacterIndex();
            // if (characterIndex !== null && explosionResult.adjacentCards.includes(characterIndex)) {
            //     const characterElement = document.querySelector(`[data-index="${characterIndex}"]`);
            //     if (characterElement) {
            //         this.animationManager.createDamagePopup(characterElement, explosionResult.damage);
            //     }
            // }

            // Hiển thị damage popup cho các thẻ khác bị ảnh hưởng (trừ character)
            if (explosionResult.affectedNonCharacterCards) {
                explosionResult.affectedNonCharacterCards.forEach(affectedCard => {
                    const cardElement = document.querySelector(`[data-index="${affectedCard.index}"]`);
                    if (cardElement) {
                        this.animationManager.createDamagePopup(cardElement, affectedCard.damage);
                    }
                });
            }

            // Thay thế boom bằng thẻ mới sau khi animation hoàn thành
            setTimeout(() => {
                this.cardManager.updateCard(boomIndex, explosionResult.newCard);

                // Sử dụng renderListCardsWithAppearEffect để đảm bảo không mất thẻ
                this.animationManager.renderListCardsWithAppearEffect([boomIndex]);

                this.setupCardEvents();

                // Cập nhật UI
                this.uiManager.updateUI();
            }, 500); // Đợi animation hoàn thành
        }
    }

    /**
     * Xử lý khi restart từ game over dialog
     */
    onRestartFromGameOver() {
        this.animationManager.hideGameOverDialog(); // Ẩn dialog
        this.onNewGame(); // Bắt đầu game mới
    }


} 