// CombatManager.js - Quản lý logic chiến đấu và tương tác
// Chức năng: Xử lý logic chiến đấu, tấn công và tương tác giữa Warrior và các thẻ khác
// Bao gồm tấn công từ xa, tấn công cần chiến, và xử lý an thẻ

class CombatManager {
    /**
     * Khởi tạo CombatManager
     * @param {CharacterManager} characterManager - Quản lý trạng thái Character
     * @param {CardManager} cardManager - Quản lý thẻ
     * @param {AnimationManager} animationManager - Quản lý animation
     */
    constructor(characterManager, cardManager, animationManager) {
        this.characterManager = characterManager; // Quản lý trạng thái Character (HP, weapon)
        this.cardManager = cardManager; // Quản lý thẻ (lấy thông tin monster, coin, etc.)
        this.animationManager = animationManager; // Quản lý animation (hiệu ứng combat, render)
    }

    // ===== CÁC HÀM CHÍNH - XỬ LÝ COMBAT =====

    /**
     * Xử lý khi character an thẻ
     * @param {number} fromIndex - Vị trí character
     * @param {number} toIndex - Vị trí thẻ bị an
     * @returns {Object|boolean} Thông tin thẻ bị an hoặc false nếu không hợp lệ
     */
    processCardEating(fromIndex, toIndex) {
        // ===== LẤY THÔNG TIN THẺ BỊ AN =====
        const targetCard = this.cardManager.getCard(toIndex);
        if (!targetCard) {
            return false;
        }


        // ===== XỬ LÝ TẤN CÔNG MONSTER =====
        // Nếu có vu khốc và an enemy -> tấn công thay và an
        if (this.characterManager.hasWeapon() && targetCard.type === 'enemy') {
            this.attackMonsterWithWeapon(fromIndex, toIndex);
            return true;
        }

        // ===== XỬ LÝ AN THẺ SỬ DỤNG cardEffect =====
        // Lấy gameState từ EventManager
        const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
        
        
        // Gọi cardEffect của thẻ
        const result = targetCard.cardEffect(this.characterManager, gameState, this.cardManager);
        
        
        // ===== XỬ LÝ ANIMATION TRAP NẾU CẦN =====
        if (targetCard.nameId === 'trap' && result && result.shouldTriggerAnimation) {
            this.animationManager.startTrapActivationAnimation(toIndex, targetCard, this.cardManager);
        }
        
        // // ===== XỬ LÝ QUICKSAND SHUFFLE SAU KHI ĂN THẺ =====
        // if (targetCard && targetCard.nameId === 'quicksand') {
        //         this.animationManager.eventManager.performQuicksandShuffleWithFlipEffect();
        // }
        
        // ===== TRẢ VỀ THÔNG TIN THẺ BỊ AN =====
        return result;
    }

    /**
     * Tấn công monster với vu khốc (có animation)
     * @param {number} characterIndex - Index của character
     * @param {number} monsterIndex - Index của monster
     * @returns {boolean} True nếu tấn công thành công
     */
    attackMonsterWithWeapon(characterIndex, monsterIndex) {
        // ===== LẤY THÔNG TIN MONSTER VÀ VU KHỐC =====
        const monster = this.cardManager.getCard(monsterIndex);
        const monsterHP = monster.hp || 0;
        const weaponDamage = this.characterManager.getCharacterWeaponDurability();
        
        // ===== TÍNH TOÁN SÁT THƯƠNG =====
        const actualDamage = Math.min(weaponDamage, monsterHP);
        
        // ===== BẮT ĐẦU ANIMATION CHIẾN ĐẤU =====
        this.animationManager.startCombatAnimation(characterIndex, monsterIndex, actualDamage);
        
        // ===== XỬ LÝ KẾT QUẢ SAU 150ms =====
        setTimeout(() => {
            // ===== ÁP DỤNG SÁT THƯƠNG =====
            // Giảm độ bền vu khốc
            const weaponObject = this.characterManager.getCharacterWeaponObject();
            if (weaponObject) {
                weaponObject.durability -= actualDamage;
            }
            const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
            // Áp dụng hiệu ứng sát thương
            if (monster.takeDamageEffect) {
                monster.takeDamageEffect(monsterElement, actualDamage, weaponObject?.blessed || 'weapon', this.characterManager, this.cardManager);
            } else {
                monster.hp = monsterHP - actualDamage;
            }         
            // ===== GỌI attackWeaponEffect NẾU CÓ =====
            let weaponKillEffect = null;
            if (weaponObject && weaponObject.attackWeaponEffect) {
                const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
                weaponKillEffect = weaponObject.attackWeaponEffect(this.characterManager, gameState, actualDamage);
            }

            // ===== XỬ LÝ CATALYST WEAPON - TẤN CÔNG NHIỀU THẺ CÙNG HƯỚNG =====
            if (weaponObject && weaponObject.nameId) {
                // Kiểm tra xem có phải là catalyst không (bỏ 1 ký tự cuối của nameId)
                const weaponNameId = weaponObject.nameId;
                const isCatalyst = weaponNameId.startsWith('catalyst');
                
                if (isCatalyst) {
                    // Tính toán hướng từ character đến monster
                    const characterPos = { row: Math.floor(characterIndex / 3), col: characterIndex % 3 };
                    const monsterPos = { row: Math.floor(monsterIndex / 3), col: monsterIndex % 3 };
                    
                    // Xác định hướng tấn công
                    let direction = '';
                    if (monsterPos.row < characterPos.row) direction = 'up';
                    else if (monsterPos.row > characterPos.row) direction = 'down';
                    else if (monsterPos.col < characterPos.col) direction = 'left';
                    else if (monsterPos.col > characterPos.col) direction = 'right';
                    
                    // Tìm tất cả thẻ trong cùng hướng tấn công
                    const cardsInDirection = [];
                    for (let i = 0; i < this.cardManager.cards.length; i++) {
                        const card = this.cardManager.cards[i];
                        if (card && card.type !== 'character' && i !== monsterIndex) {
                            const cardPos = { row: Math.floor(i / 3), col: i % 3 };
                            let inDirection = false;
                            
                            // Kiểm tra xem thẻ có nằm trong hướng tấn công không
                            switch (direction) {
                                case 'up': 
                                    inDirection = cardPos.row < characterPos.row && cardPos.col === characterPos.col; 
                                    break;
                                case 'down': 
                                    inDirection = cardPos.row > characterPos.row && cardPos.col === characterPos.col; 
                                    break;
                                case 'left': 
                                    inDirection = cardPos.col < characterPos.col && cardPos.row === characterPos.row; 
                                    break;
                                case 'right': 
                                    inDirection = cardPos.col > characterPos.col && cardPos.row === characterPos.row; 
                                    break;
                            }
                            
                            if (inDirection) {
                                cardsInDirection.push({ card, index: i });
                            }
                        }
                    }
                    
                    // Tấn công tất cả thẻ trong hướng
                    cardsInDirection.forEach(({ card, index }) => {
                        if (card.takeDamageEffect) {
                            const cardElement = document.querySelector(`[data-index="${index}"]`);
                            card.takeDamageEffect(cardElement, actualDamage, weaponObject?.blessed || 'catalyst', this.characterManager, this.cardManager);
                        }
                    });
                }
            }
            
            // ===== CẬP NHẬT HIỂN THỊ =====
            this.animationManager.updateCardStatus(characterIndex); // Cập nhật hiển thị dụng lực vu khốc
            
            // ===== CẬP NHẬT NÚT SELL WEAPON =====
            if (this.animationManager.eventManager && this.animationManager.eventManager.uiManager) {
                this.animationManager.eventManager.uiManager.updateSellButtonVisibility();
            }
            
            // ===== XỬ LÝ KHI MONSTER CHẾT =====
            if (monster.hp <= 0) {
                // Thêm hiệu ứng chết cho monster
                
                if (monsterElement) {
                    monsterElement.classList.add('monster-dying');
                }
                
                    // ===== GỌI killByWeaponEffect NẾU CÓ =====
                // Lazy evaluation: chỉ tính toán gameState khi cần thiết
                
                
                // // ===== KIỂM TRA HIỆU ỨNG VU KHỐC KHI GIẾT QUÁI =====
                // const weaponObject = this.characterManager.getCharacterWeaponObject();
                
                // if (weaponObject && weaponObject.attackWeaponEffect) {
                //     const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
                //     weaponKillEffect = weaponObject.attackWeaponEffect(this.characterManager, gameState, actualDamage);
                //     // console.log(`?? Weapon kill effect:`, weaponKillEffect);
                // }
                
                // ===== Tạo thẻ mới sau 600ms =====
                setTimeout(() => {
                    let newCard;
                    
                    // Uu tiên hiệu ứng vu khốc nếu có
                    if (weaponKillEffect && weaponKillEffect.shouldCreateCoinUp) {
                        // Tạo CoinUp với điểm từ hiệu ứng vu khốc
                        newCard = this.cardManager.cardFactory.createDynamicCoinUp(this.characterManager, weaponKillEffect.coinUpScore);
                        
                        newCard.id = monsterIndex;
                        newCard.position = { row: Math.floor(monsterIndex / 3), col: monsterIndex % 3 };
                        this.cardManager.updateCard(monsterIndex, newCard);
                    } 
                    //  else {
                    //     // Sử dụng hiệu ứng đặc biệt của monster
                    //     const killEffect = monster.killByWeaponEffect ? 
                    // monster.killByWeaponEffect(this.characterManager, this.cardManager) : null;
                        
                    // }  
                    
                    
                        
                        
                        // Warrior không di chuyển, chỉ render thẻ mới
                        this.animationManager.renderCardsWithAppearEffect(monsterIndex);
                        
                        // ===== KHÔNG TÍNH LUẬT VÀ KHÔNG DI CHUYỂN =====
                        // KHÔNG incrementMoves() và Warrior không di chuyển
                        
                        // ===== SETUP EVENTS LẠI CHO THẺ MỚI =====
                        // Để Warrior có thể di chuyển đến thẻ mới
                        this.setupCardEventsAfterCombat();
                        
                        // ===== Cập nhật UI =====
                        if (this.animationManager.eventManager && this.animationManager.eventManager.uiManager) {
                            this.animationManager.eventManager.uiManager.updateUI();
                        }
                        
                        // ===== GỌI onMoveCompleted SAU KHI TẠO THẺ MỚI =====
                        if (this.animationManager.eventManager) {
                            this.animationManager.eventManager.onMoveCompleted();
                        }
                        
                        // ===== KIỂM TRA GAME OVER =====
                        // if (this.checkGameOver()) {
                        //     this.animationManager.triggerGameOver();
                        //     return;
                        // }
                    
                }, 600);
            } else {
                // ===== MONSTER CÒN SỐNG =====
                this.animationManager.updateCardStatus(monsterIndex);
                this.animationManager.updateCardStatus(characterIndex);// Cập nhật hiển thị dụng lực vu khốc
                
                // ===== GỌI attackByWeaponEffect NẾU CÓ =====
                //if (monster.attackByWeaponEffect) {
                    //const cards = this.cardManager.getAllCards();
                    //monster.attackByWeaponEffect(cards, monsterIndex, cardManager, animationManager);
                    
                    // if (attackEffect && attackEffect.type === 'enemy_attacked_by_weapon') {
                    //     // Xử lý các loại hiệu ứng khác nhau
                    //     if (attackEffect.newPosition !== undefined) {
                    //         // Hiệu ứng độc biệt vị trí (Narwhal)
                    //         this.cardManager.setAllCards(cards);
                            
                    //         // Thêm hiệu ứng flip cho cả 2 thẻ
                    //         this.animationManager.flipCards(
                    //             attackEffect.oldPosition, 
                    //             attackEffect.newPosition,
                    //             () => {
                    //                 // Callback sau khi animation hoàn thành
                    //                 this.animationManager.renderCards();
                    //                 this.setupCardEventsAfterCombat();
                    //             }
                    //         );
                            
                    //         // Hiển thị thông báo hiệu ứng
                    //     }
                    // }
              //  }
            }
        }, 150);
        
        return true;
    }

    // ===== CÁC HÀM HỖ TRỢ - TẠO THẺ VÀ SETUP =====

    /**
     * Setup events lại cho các thẻ sau combat
     * Được gọi sau khi tạo thẻ mới để đảm bảo events hoạt động
     */
    setupCardEventsAfterCombat() {
        // Gọi setupCardEvents từ EventManager thông qua AnimationManager
        if (this.animationManager.eventManager) {
            this.animationManager.eventManager.setupCardEvents();
        }
    }

    // ===== CÁC HÀM KIỂM TRA TRẠNG THÁI =====

    /**
     * Kiểm tra game over
     */
    checkGameOver() {
        if (!this.characterManager.isAlive()) {
            this.animationManager.triggerGameOver();
        }
    }

    /**
     * Kiểm tra xem có thể di chuyển từ vị trí này đến vị trí kia không
     * @param {number} fromIndex - Vị trí bắt đầu
     * @param {number} toIndex - Vị trí đích
     * @returns {boolean} True nếu có thể di chuyển
     */
    isValidMove(fromIndex, toIndex) {
        // ===== KIỂM TRA VỊ TRÍ HỢP LỆ =====
        if (fromIndex === toIndex) return false; // Không thể di chuyển đến chính mình
        
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        // ===== KIỂM TRA KHOẢNG CÁCH =====
        const rowDiff = Math.abs(fromPos.row - toPos.row);
        const colDiff = Math.abs(fromPos.col - toPos.col);
        
        // Chỉ cho phép di chuyển 1 ô theo chiều ngang hoặc dọc
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            return true;
        }
        
        return false;
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
        for (let i = 0; i < this.cardManager.cards.length; i++) {
            const card = this.cardManager.cards[i];
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

    // ===== EQUIPMENT ITEM EFFECTS =====

    /**
     * Xử lý hiệu ứng khi sử dụng equipment item
     * @param {string} nameId - ID của item được sử dụng
     */
    processUseItemEffect(nameId) {
        console.log(`Sử dụng equipment item: ${nameId}`);
        
        // TODO: Thêm logic xử lý hiệu ứng item
        // Ví dụ: sử dụng healing potion, weapon upgrade, v.v.
        
        // Lấy item từ GameState equipments
        const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
        if (gameState) {
            const equipments = gameState.getEquipments();
            const item = equipments.find(eq => eq.nameId === nameId);
            
            if (item) {
                console.log(`Tìm thấy item: ${item.name} (${item.constructor.name})`);
                if(item.cooldown === 0){
                    const useResult = item.useItemEffect(this.animationManager);
                    
                    // Kiểm tra kết quả sử dụng item
                    if (useResult === false) {
                        // Hiển thị thông báo "chưa đủ điều kiện kích hoạt"
                        this.showItemActivationMessage("Chưa đủ điều kiện kích hoạt item!");
                        return;
                    }

                    // sửa ở đây 
                    this.animationManager.eventManager.uiManager.updateUI();
                }else{
                    console.log(`item chưa sẵn sàng`);
                }
                
            } else {
                console.warn(`Không tìm thấy item với nameId: ${nameId}`);
            }
        }
    }

    /**
     * Hiển thị thông báo khi item không thể kích hoạt
     * @param {string} message - Nội dung thông báo
     */
    showItemActivationMessage(message) {
        // Tạo element thông báo
        const notification = document.createElement('div');
        notification.className = 'item-activation-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ff6b6b;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: fadeInOut 0.5s ease-in-out;
        `;

        // Thêm CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;

        // Thêm vào DOM
        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Tự động xóa sau 2 giây
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 500);
    }

    // ===== QUICKSAND SHUFFLE EFFECT =====

    /**
     * Thực hiện shuffle logic cho Quicksand với flip card effect
     */
    ShuffleWithFlipEffect() {
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
        // setTimeout(() => {
            // Cập nhật tất cả thẻ
            this.cardManager.setAllCards(shuffledCards);

            // Xóa class flip sau khi animation hoàn thành
            setTimeout(() => {
                // Render lại toàn bộ grid với vị trí mới
                this.animationManager.updateEntireGrid();

                // Cập nhật UI
                this.animationManager.eventManager.uiManager.updateUI();
                // this.animationManager.eventManager.setupCardEvents();

                // Game over được xử lý trong damageCharacterHP khi HP = 0
            }, 600); // Thời gian flip animation
        // }, 10); // Delay nhỏ để bắt đầu flip trước
    }
}
