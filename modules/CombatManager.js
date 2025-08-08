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
            this.animationManager.updateCharacterDisplay(); // Cập nhật hiển thị dụng lực vu khốc
            
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
                this.animationManager.updateMonsterDisplay(monsterIndex); // Cập nhật HP monster
                this.animationManager.updateCharacterDisplay(); // Cập nhật hiển thị dụng lực vu khốc
                
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
} 
