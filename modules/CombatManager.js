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
            monster.hp = monsterHP - actualDamage; // Giảm HP monster
            
            // Giảm độ bền vu khốc
            const weaponObject = this.characterManager.getCharacterWeaponObject();
            if (weaponObject) {
                weaponObject.durability -= actualDamage;
            }
            
            // ===== GỌI attackWeaponEffect NẾU CÓ =====
            let weaponKillEffect = null;
            if (weaponObject && weaponObject.attackWeaponEffect) {
                const gameState = this.animationManager.eventManager ? this.animationManager.eventManager.gameState : null;
                weaponKillEffect = weaponObject.attackWeaponEffect(this.characterManager, gameState, actualDamage);
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
                const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
                if (monsterElement) {
                    monsterElement.classList.add('monster-dying');
                }
                
                    // ===== GỌI killByWeaponEffect NẾU CÓ =====
                // Lazy evaluation: chỉ tính toán gameState khi cần thiết
                const killEffect = monster.killByWeaponEffect ? 
                    monster.killByWeaponEffect(this.characterManager, null) : null;
                
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
                    }
                }, 600);
            } else {
                // ===== MONSTER CÒN SỐNG =====
                this.animationManager.updateMonsterDisplay(monsterIndex); // Cập nhật HP monster
                this.animationManager.updateCharacterDisplay(); // Cập nhật hiển thị dụng lực vu khốc
                
                // ===== GỌI attackByWeaponEffect NẾU CÓ =====
                if (monster.attackByWeaponEffect) {
                    const cards = this.cardManager.getAllCards();
                    const attackEffect = monster.attackByWeaponEffect(cards, monsterIndex);
                    
                    if (attackEffect && attackEffect.type === 'enemy_attacked_by_weapon') {
                        // Xử lý các loại hiệu ứng khác nhau
                        if (attackEffect.newPosition !== undefined) {
                            // Hiệu ứng độc biệt vị trí (Narwhal)
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
                        }
                    }
                }
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
     * @returns {boolean} True nếu character chết
     */
    checkGameOver() {
        return !this.characterManager.isAlive();
    }
} 
