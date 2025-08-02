// CombatManager.js - Quản lý logic chiến đấu và tương tác
// Chức năng: Xử lý logic chiến đấu, tấn công và tương tác giữa Warrior và các thẻ khác
// Bao gồm tấn công từ xa, tấn công cận chiến, và xử lý ăn thẻ

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
     * Xử lý khi character ăn thẻ
     * @param {number} fromIndex - Vị trí character
     * @param {number} toIndex - Vị trí thẻ bị ăn
     * @returns {Object|boolean} Thông tin thẻ bị ăn hoặc false nếu không hợp lệ
     */
    processCardEating(fromIndex, toIndex) {
        // ===== LẤY THÔNG TIN THẺ BỊ ĂN =====
        const targetCard = this.cardManager.getCard(toIndex);
        if (!targetCard) {
            console.log(`❌ processCardEating: Không tìm thấy thẻ tại index ${toIndex}`);
            return false;
        }

        console.log(`🎯 processCardEating: Thẻ tại index ${toIndex} có type: ${targetCard.type}`);

        // ===== XỬ LÝ TẤN CÔNG MONSTER =====
        // Nếu có vũ khí và ăn enemy -> tấn công thay vì ăn
        if (this.characterManager.hasWeapon() && targetCard.type === 'enemy') {
            console.log(`⚔️ Tấn công enemy với vũ khí`);
            this.attackMonsterWithWeapon(fromIndex, toIndex);
            return true;
        }

        // ===== XỬ LÝ ĂN THẺ SỬ DỤNG cardEffect =====
        // Lấy gameState từ EventManager
        const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
        
        console.log(`🍽️ Gọi cardEffect cho thẻ type: ${targetCard.type}`);
        console.log(`🍽️ characterManager:`, this.characterManager);
        console.log(`🍽️ gameState:`, gameState);
        
        // Gọi cardEffect của thẻ
        const result = targetCard.cardEffect(this.characterManager, gameState, this.cardManager);
        
        console.log(`✅ cardEffect result:`, result);
        
        // ===== XỬ LÝ TRAP ANIMATION NẾU CẦN =====
        if (targetCard.nameId === 'trap' && result && result.shouldTriggerAnimation) {
            console.log(`🎯 Trap được kích hoạt, bắt đầu animation`);
            this.animationManager.startTrapActivationAnimation(toIndex, targetCard, this.cardManager);
        }
        
        // ===== TRẢ VỀ THÔNG TIN THẺ BỊ ĂN =====
        return result;
    }

    /**
     * Tấn công monster với vũ khí (có animation)
     * @param {number} characterIndex - Index của character
     * @param {number} monsterIndex - Index của monster
     * @returns {boolean} True nếu tấn công thành công
     */
    attackMonsterWithWeapon(characterIndex, monsterIndex) {
        // ===== LẤY THÔNG TIN MONSTER VÀ VŨ KHÍ =====
        const monster = this.cardManager.getCard(monsterIndex);
        const monsterHP = monster.hp || 0;
        const weaponDamage = this.characterManager.getCharacterWeapon();
        
        // ===== TÍNH TOÁN SÁT THƯƠNG =====
        const actualDamage = Math.min(weaponDamage, monsterHP);
        
        // ===== BẮT ĐẦU ANIMATION CHIẾN ĐẤU =====
        this.animationManager.startCombatAnimation(characterIndex, monsterIndex, actualDamage);
        
        // ===== XỬ LÝ KẾT QUẢ SAU 150ms =====
        setTimeout(() => {
            // ===== ÁP DỤNG SÁT THƯƠNG =====
            monster.hp = monsterHP - actualDamage; // Giảm HP monster
            
            // Giảm độ bền vũ khí
            const weaponObject = this.characterManager.getCharacterWeaponObject();
            if (weaponObject) {
                weaponObject.durability -= actualDamage;
            }
            
            // ===== GỌI attackWeaponEffect NẾU CÓ =====
            if (weaponObject && weaponObject.attackWeaponEffect) {
                const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
                const weaponEffect = weaponObject.attackWeaponEffect(this.characterManager, gameState, actualDamage);
                console.log(`⚔️ Weapon attack effect:`, weaponEffect);
            }
            
            // ===== CẬP NHẬT HIỂN THỊ =====
            this.animationManager.updateCharacterDisplay(); // Cập nhật hiển thị độ bền vũ khí
            
            // ===== CẬP NHẬT NÚT SELL WEAPON =====
            if (this.animationManager.eventManager && this.animationManager.eventManager.uiManager) {
                this.animationManager.eventManager.uiManager.updateSellButtonVisibility();
            }
            
            // ===== XỬ LÝ KHI MONSTER CHẾT =====
            if (monster.hp <= 0) {
                // Thêm hiệu ứng chết cho monster
                const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
                if (monsterElement) {
                    monsterElement.classList.add('monster-dying');
                }
                
                // ===== GỌI killByWeaponEffect NẾU CÓ =====
                const killEffect = monster.killByWeaponEffect ? monster.killByWeaponEffect(this.characterManager, this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null) : null;
                
                // ===== KIỂM TRA HIỆU ỨNG VŨ KHÍ KHI GIẾT QUÁI =====
                const weaponObject = this.characterManager.getCharacterWeaponObject();
                let weaponKillEffect = null;
                
                if (weaponObject && weaponObject.attackWeaponEffect) {
                    const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
                    weaponKillEffect = weaponObject.attackWeaponEffect(this.characterManager, gameState, actualDamage);
                    console.log(`⚔️ Weapon kill effect:`, weaponKillEffect);
                }
                
                // ===== TẠO THẺ MỚI SAU 600ms =====
                setTimeout(() => {
                    let newCard;
                    
                    // Ưu tiên hiệu ứng vũ khí nếu có
                    if (weaponKillEffect && weaponKillEffect.shouldCreateCoinUp) {
                        // Tạo CoinUp với điểm từ hiệu ứng vũ khí
                        newCard = this.createCoinUpWithScore(weaponKillEffect.coinUpScore);
                        console.log(`⚔️ Tạo CoinUp với ${weaponKillEffect.coinUpScore} điểm từ hiệu ứng vũ khí`);
                    } else if (killEffect && killEffect.type === 'enemy_killed_by_weapon') {
                        // Sử dụng hiệu ứng đặc biệt của monster
                        if (killEffect.reward.type === 'food3') {
                            // Tạo thẻ Food3
                            newCard = this.cardManager.cardFactory.createCard(killEffect.reward.cardName);
                        } else if (killEffect.reward.type === 'coin') {
                            // Tạo coin mặc định
                            newCard = this.cardManager.cardFactory.createDynamicCoin(this.characterManager);
                        } else if (killEffect.reward.type === 'abysslector') {
                            // Tạo AbyssLector mới
                            newCard = killEffect.reward.card;
                        }
                    } else {
                        // Tạo coin mặc định cho các enemy không có killByWeaponEffect
                        newCard = this.cardManager.cardFactory.createDynamicCoin(this.characterManager);
                    }
                    
                    if (newCard) {
                        newCard.id = monsterIndex;
                        newCard.position = { row: Math.floor(monsterIndex / 3), col: monsterIndex % 3 };
                        this.cardManager.updateCard(monsterIndex, newCard);
                        
                        // Warrior không di chuyển, chỉ render thẻ mới
                        this.animationManager.renderCardsWithAppearEffect(monsterIndex);
                        
                        // ===== KHÔNG TÍNH LƯỢT VÌ KHÔNG DI CHUYỂN =====
                        // KHÔNG incrementMoves() vì Warrior không di chuyển
                        
                        // ===== SETUP EVENTS LẠI CHO THẺ MỚI =====
                        // Để Warrior có thể di chuyển đến thẻ mới
                        this.setupCardEventsAfterCombat();
                        
                        // ===== CẬP NHẬT UI =====
                        if (this.animationManager.eventManager && this.animationManager.eventManager.uiManager) {
                            this.animationManager.eventManager.uiManager.updateUI();
                        }
                        
                        // ===== KIỂM TRA GAME OVER =====
                        if (this.checkGameOver()) {
                            this.animationManager.triggerGameOver();
                            return;
                        }
                    }
                }, 600);
            } else {
                // ===== MONSTER CÒN SỐNG =====
                this.animationManager.updateMonsterDisplay(monsterIndex); // Cập nhật HP monster
                this.animationManager.updateCharacterDisplay(); // Cập nhật hiển thị độ bền vũ khí
                
                // ===== GỌI attackByWeaponEffect NẾU CÓ =====
                if (monster.attackByWeaponEffect) {
                    const cards = this.cardManager.getAllCards();
                    const attackEffect = monster.attackByWeaponEffect(
                        this.characterManager, 
                        this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null,
                        cards,
                        monsterIndex
                    );
                    
                    if (attackEffect && attackEffect.type === 'enemy_attacked_by_weapon') {
                        // Xử lý các loại hiệu ứng khác nhau
                        if (attackEffect.newPosition !== undefined) {
                            // Hiệu ứng đổi vị trí (Narwhal)
                            this.cardManager.setAllCards(cards);
                            
                            // Thêm hiệu ứng flip cho cả 2 thẻ
                            this.animationManager.flipCards(
                                attackEffect.oldPosition, 
                                attackEffect.newPosition,
                                () => {
                                    // Callback sau khi animation hoàn thành
                                    this.animationManager.renderCards();
                                    this.setupCardEventsAfterCombat();
                                }
                            );
                            
                            // Hiển thị thông báo hiệu ứng
                            console.log(`🔄 ${attackEffect.effect}`);
                        }
                    }
                }
            }
        }, 150);
        
        return true;
    }

    // ===== CÁC HÀM HỖ TRỢ - TẠO THẺ VÀ SETUP =====

    /**
     * Tạo CoinUp với điểm động
     * @param {number} score - Điểm cho CoinUp
     * @returns {Card} CoinUp card với điểm đã set
     */
    createCoinUpWithScore(score) {
        const coinUp = this.cardManager.cardFactory.createDynamicCoinUp(this.characterManager, score);
        console.log(`💰 Tạo CoinUp động với ${score} điểm`);
        return coinUp;
    }

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
     * @returns {boolean} True nếu character chết
     */
    checkGameOver() {
        return !this.characterManager.isAlive();
    }

    // ===== CÁC HÀM KHÔNG ĐƯỢC SỬ DỤNG (COMMENT LẠI) =====

    /*
    // Hàm này không được sử dụng ở đâu cả - có thể xóa trong tương lai
    moveCharacterAfterCombat(fromIndex, toIndex) {
        // ===== TÍNH TOÁN VỊ TRÍ DI CHUYỂN =====
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        const moveX = (toPos.col - fromPos.col) * 100; // Di chuyển theo trục X
        const moveY = (toPos.row - fromPos.row) * 100; // Di chuyển theo trục Y
        
        // ===== LẤY CÁC ELEMENT CẦN THIẾT =====
        const characterElement = document.querySelector(`[data-index="${fromIndex}"]`);
        const targetElement = document.querySelector(`[data-index="${toIndex}"]`);
        
        if (!characterElement || !targetElement) return;
        
        // ===== THIẾT LẬP ANIMATION =====
        characterElement.style.setProperty('--dual-move-x', `${moveX}px`);
        characterElement.style.setProperty('--dual-move-y', `${moveY}px`);
        
        characterElement.classList.add('dual-moving'); // Animation di chuyển
        targetElement.classList.add('dual-eating'); // Animation ăn
        
        // ===== XỬ LÝ SAU KHI ANIMATION HOÀN THÀNH (400ms) =====
        setTimeout(() => {
            // ===== CẬP NHẬT VỊ TRÍ CHARACTER =====
            const newCards = [...this.cardManager.getAllCards()];
            const characterCard = newCards[fromIndex]; // Lấy instance của Card
            characterCard.position = { row: Math.floor(toIndex / 3), col: toIndex % 3 }; // Cập nhật vị trí
            newCards[toIndex] = characterCard; // Di chuyển instance
            newCards[fromIndex] = null; // Xóa character ở vị trí cũ
            
            // ===== TẠO THẺ MỚI Ở VỊ TRÍ CŨ CỦA CHARACTER =====
            const newCard = this.cardManager.createRandomCard(fromIndex);
            newCards[fromIndex] = newCard;
            
            this.cardManager.cards = newCards; // Cập nhật mảng cards
            
            // ===== RENDER LẠI VÀ SETUP EVENTS =====
            this.animationManager.updateCharacterDisplay(); // Cập nhật hiển thị character
            this.animationManager.renderCardsWithAppearEffect(fromIndex); // Render thẻ mới với hiệu ứng
            
            // ===== CẬP NHẬT UI =====
            if (this.animationManager.eventManager && this.animationManager.eventManager.uiManager) {
                this.animationManager.eventManager.uiManager.updateUI();
            }
            
            // ===== SETUP EVENTS LẠI CHO CÁC THẺ MỚI =====
            this.setupCardEventsAfterCombat();
        }, 400);
    }
    */
} 