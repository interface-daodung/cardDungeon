// AnimationManager.js - Quản lý tất cả animation và hiển thị trong game
// Chức năng: Render cards, tạo effects, quản lý visual feedback
// Kết nối với CardManager và CharacterManager để lấy dữ liệu hiển thị

class AnimationManager {
    /**
     * Khởi tạo AnimationManager
     * @param {CardManager} cardManager - Manager quản lý cards
     * @param {CharacterManager} characterManager - Manager quản lý character
     */
    constructor(cardManager, characterManager) {
        // ===== KHỞI TẠO DEPENDENCIES =====
        this.cardManager = cardManager; // Quản lý dữ liệu cards
        this.characterManager = characterManager; // Quản lý dữ liệu character
        this.eventManager = null; // Sẽ được set từ DungeonCardGame để setup events sau combat
        
        // ===== ANIMATION STATE TRACKING =====
        this.isAnimating = false; // Trạng thái đang có animation hay không
        this.animationCount = 0; // Số lượng animation đang chạy
    }

    /**
     * Thiết lập EventManager để có thể setup events sau combat
     * @param {EventManager} eventManager - Manager quản lý events
     */
    setEventManager(eventManager) {
        this.eventManager = eventManager;
    }

    /**
     * Bắt đầu animation - tăng counter và set trạng thái
     */
    startAnimation() {
        this.animationCount++;
        this.isAnimating = true;
        console.log(`🎬 Animation started. Count: ${this.animationCount}`);
    }

    /**
     * Kết thúc animation - giảm counter và cập nhật trạng thái
     */
    endAnimation() {
        this.animationCount = Math.max(0, this.animationCount - 1);
        this.isAnimating = this.animationCount > 0;
        console.log(`🎬 Animation ended. Count: ${this.animationCount}`);
    }

    /**
     * Kiểm tra xem có đang có animation hay không
     * @returns {boolean} True nếu đang có animation
     */
    isCurrentlyAnimating() {
        return this.isAnimating;
    }

    /**
     * Force reset animation state
     * Sử dụng khi cần reset hoàn toàn trạng thái animation
     */
    forceResetAnimationState() {
        this.animationCount = 0;
        this.isAnimating = false;
        console.log(`🎬 Force reset animation state`);
    }

    /**
     * Thêm hiệu ứng flip cho 2 thẻ khi đổi vị trí
     * @param {number} index1 - Index của thẻ thứ nhất
     * @param {number} index2 - Index của thẻ thứ hai
     * @param {Function} callback - Callback được gọi sau khi animation hoàn thành
     */
    flipCards(index1, index2, callback = null) {
        this.startAnimation();
        
        const card1Element = document.querySelector(`[data-index="${index1}"]`);
        const card2Element = document.querySelector(`[data-index="${index2}"]`);
        
        if (card1Element && card2Element) {
            // Thêm class flip cho cả 2 thẻ
            card1Element.classList.add('flipping');
            card2Element.classList.add('flipping');
            
            // Xóa class và gọi callback sau khi animation hoàn thành
            setTimeout(() => {
                card1Element.classList.remove('flipping');
                card2Element.classList.remove('flipping');
                
                this.endAnimation();
                
                if (callback) {
                    callback();
                }
            }, 600);
        } else {
            this.endAnimation();
            if (callback) {
                callback();
            }
        }
    }

    /**
     * Hiển thị thông báo cho người chơi
     * @param {string} message - Nội dung thông báo
     */
    showMessage(message) {
        console.log(`📢 ${message}`);
        // Có thể thêm logic hiển thị UI message ở đây nếu cần
    }

    /**
     * Tạo damage popup khi character bị damage
     * @param {HTMLElement} element - Element để hiển thị popup
     * @param {number} damage - Lượng damage
     */
    createDamagePopup(element, damage) {
        const popup = document.createElement('div');
        popup.className = 'damage-popup';
        popup.textContent = `-${damage}`;
        popup.style.color = 'red';
        popup.style.fontWeight = 'bold';
        popup.style.position = 'absolute';
        popup.style.zIndex = '1000';
        
        element.appendChild(popup);
        
        // Animation popup
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    /**
     * Trigger game over
     */
    triggerGameOver() {
        console.log('💀 Game Over triggered');
        // Có thể thêm logic game over UI ở đây
    }

    /**
     * Render thẻ với hiệu ứng appear
     * @param {number} index - Index của thẻ cần render
     */
    renderCardsWithAppearEffect(index) {
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        if (cardElement) {
            cardElement.classList.add('appearing');
            setTimeout(() => {
                cardElement.classList.remove('appearing');
            }, 300);
        }
        this.renderCards();
    }

    /**
     * Render tất cả cards lên màn hình (không có effect đặc biệt)
     * Sử dụng khi khởi tạo game hoặc reset game
     */
    renderCards() {
        // ===== RESET ANIMATION STATE =====
        this.animationCount = 0;
        this.isAnimating = false;
        console.log(`🎬 Reset animation state for new game`);
        
        // ===== CLEAR GRID =====
        const grid = document.getElementById('cards-grid');
        grid.innerHTML = ''; // Xóa tất cả cards cũ
        
        // ===== RENDER EACH CARD =====
        this.cardManager.getAllCards().forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            grid.appendChild(cardElement);
        });
    }

    /**
     * Render cards với hiệu ứng xuất hiện cho card mới
     * @param {number} newCardIndex - Index của card mới được thêm vào
     */
    renderCardsWithAppearEffect(newCardIndex) {
        // ===== BẮT �?ẦU ANIMATION TRACKING =====
        this.startAnimation();
        
        // ===== CLEAR GRID =====
        const grid = document.getElementById('cards-grid');
        grid.innerHTML = ''; // Xóa tất cả cards cũ
        
        // ===== RENDER WITH APPEAR EFFECT =====
        this.cardManager.getAllCards().forEach((card, index) => {
            if (card) { // Kiểm tra card có tồn tại không
                const cardElement = this.createCardElement(card, index);
                if (index === newCardIndex) {
                    // Thêm class 'appearing' cho card mới để tạo hiệu ứng
                    cardElement.classList.add('appearing');
                }
                grid.appendChild(cardElement);
            }
        });
        
        // ===== KẾT THÚC ANIMATION SAU KHI APPEAR EFFECT HOÀN THÀNH =====
        setTimeout(() => {
            this.endAnimation();
        }, 1); // Th�?i gian của appear effect (giảm từ 500ms xuống 300ms)
    }

    /**
     * Tạo DOM element cho một card
     * @param {Object} card - Dữ liệu card
     * @param {number} index - Index của card trong grid
     * @returns {HTMLElement} Card element đã được tạo
     */
    createCardElement(card, index) {
        // ===== TẠO CARD CONTAINER =====
        const cardElement = document.createElement('div');
        
         
        cardElement.className = `card ${card.type}`;
        cardElement.dataset.index = index; // Lưu index để truy xuất sau
        cardElement.dataset.cardId = card.id; // Lưu ID card
        cardElement.dataset.type = card.type; // Lưu loại card
        
        // ===== TẠO CARD IMAGE =====
        const imageElement = document.createElement('img');
        imageElement.className = 'card-image';
        imageElement.src = card.image; // Set source image
        imageElement.alt = card.type; // Alt text cho accessibility
        imageElement.draggable = card.type === 'character'; // Chỉ character mới có thể drag
        
        cardElement.appendChild(imageElement);

        // ===== THÊM DISPLAY THEO LOẠI CARD =====
        // Coin card - hiển thị điểm số (trừ thẻ Void)
        if (card.type === 'coin' && card.nameId !== 'void') {
            const scoreDisplay = document.createElement('div');
            scoreDisplay.className = 'score-display';
            scoreDisplay.textContent = card.score || 0; // Hiển thị điểm, mặc định 0
            cardElement.appendChild(scoreDisplay);
        }

        // Food card - hiển thị lượng hồi máu
        if (card.type === 'food') {
            const healDisplay = document.createElement('div');
            healDisplay.className = 'heal-display';
            healDisplay.textContent = card.heal || 0; // Hiển thị heal, mặc định 0
            cardElement.appendChild(healDisplay);
        }

        // Sword card - hiển thị độ b�?n
        if (card.type === 'weapon') {
            const durabilityDisplay = document.createElement('div');
            durabilityDisplay.className = 'durability-display';
            durabilityDisplay.textContent = card.durability || 0; // Hiển thị durability, mặc định 0
            cardElement.appendChild(durabilityDisplay);
        }

        // Treasure card - hiển thị durability và score
        if (card.nameId === 'treasure0') {
            // Hiển thị durability ở góc trên bên phải (nếu có)
            if (card.durability) {
                const durabilityDisplay = document.createElement('div');
                durabilityDisplay.className = 'durability-display';
                durabilityDisplay.textContent = card.durability;
                cardElement.appendChild(durabilityDisplay);
            }
            
            // Hiển thị score ở góc dưới bên phải
            const scoreDisplay = document.createElement('div');
            scoreDisplay.className = 'score-display';
            scoreDisplay.textContent = card.score || 0;
            cardElement.appendChild(scoreDisplay);
        }

        // Boom card - hiển thị damage và countdown
        if (card.type === 'boom') {
            // Hiển thị damage ở góc dưới bên phải
            const damageDisplay = document.createElement('div');
            damageDisplay.className = 'damage-display';
            damageDisplay.textContent = card.damage || 0;
            cardElement.appendChild(damageDisplay);
            
            // Hiển thị countdown ở góc trên bên phải
            const countdownDisplay = document.createElement('div');
            countdownDisplay.className = 'countdown-display';
            countdownDisplay.textContent = card.countdown || 0;
            cardElement.appendChild(countdownDisplay);
        }

        // Character card - hiển thị HP và weapon
        if (card.type === 'character') {
            // Hiển thị HP hiện tại
            const hpDisplay = document.createElement('div');
            hpDisplay.className = 'hp-display';
            hpDisplay.textContent = this.characterManager.getCharacterHP();
            cardElement.appendChild(hpDisplay);
            
            // Hiển thị weapon nếu có
            if (this.characterManager.getCharacterWeapon() > 0) {
                const weaponDisplay = document.createElement('div');
                weaponDisplay.className = 'weapon-display';
                weaponDisplay.textContent = this.characterManager.getCharacterWeapon();
                cardElement.appendChild(weaponDisplay);
            }
        } 
        // Enemy card - hiển thị HP
        else if (card.type === 'enemy') {
            const hpDisplay = document.createElement('div');
            hpDisplay.className = 'hp-display';
            const currentHP = card.hp || 0; // Sử dụng HP từ Card instance
            hpDisplay.textContent = currentHP;
            cardElement.appendChild(hpDisplay);
            
            // ===== THÊM SHIELD STYLING CHO ABYSSLECTOR CARDS =====
            if (card.nameId === 'abyssLector0') {
                if (card.shield === 1) {
                    cardElement.classList.add('shield-active-red');
                } else if (card.shield === 0) {
                    cardElement.classList.remove('shield-active-red');
                }
            } else if (card.nameId === 'abyssLector1') {
                if (card.shield === 1) {
                    cardElement.classList.add('shield-active-purple');
                } else if (card.shield === 0) {
                    cardElement.classList.remove('shield-active-purple');
                }
            } else if (card.nameId === 'abyssLector2') {
                if (card.shield === 1) {
                    cardElement.classList.add('shield-active-blue');
                } else if (card.shield === 0) {
                    cardElement.classList.remove('shield-active-blue');
                }
            }
        }

        return cardElement;
    }

    /**
     * Cập nhật hiển thị character (HP và weapon)
     * �?ược g�?i khi character thay đổi stats
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
            if (this.characterManager.getCharacterWeapon() > 0) {
                // Tạo weapon display nếu chưa có
                if (!weaponDisplay) {
                    weaponDisplay = document.createElement('div');
                    weaponDisplay.className = 'weapon-display';
                    characterElement.appendChild(weaponDisplay);
                }
                weaponDisplay.textContent = this.characterManager.getCharacterWeapon();
            } else if (weaponDisplay) {
                // Xóa weapon display nếu không có weapon
                weaponDisplay.remove();
            }
        }
    }

    /**
     * Cập nhật hiển thị monster HP
     * @param {number} monsterIndex - Index của monster cần cập nhật
     */
    updateMonsterDisplay(monsterIndex) {
        const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
        if (monsterElement && this.cardManager.getCard(monsterIndex)) {
            const monster = this.cardManager.getCard(monsterIndex);
            const hpDisplay = monsterElement.querySelector('.hp-display');
            if (hpDisplay) {
                hpDisplay.textContent = monster.hp || 0; // Hiển thị HP, mặc định 0
            }
            
            // ===== CẬP NHẬT SHIELD STATE CHO ABYSSLECTOR CARDS =====
            if (monster.nameId === 'abyssLector0') {
                if (monster.shield === 1) {
                    monsterElement.classList.add('shield-active-red');
                } else if (monster.shield === 0) {
                    monsterElement.classList.remove('shield-active-red');
                }
            } else if (monster.nameId === 'abyssLector1') {
                if (monster.shield === 1) {
                    monsterElement.classList.add('shield-active-purple');
                } else if (monster.shield === 0) {
                    monsterElement.classList.remove('shield-active-purple');
                }
            } else if (monster.nameId === 'abyssLector2') {
                if (monster.shield === 1) {
                    monsterElement.classList.add('shield-active-blue');
                } else if (monster.shield === 0) {
                    monsterElement.classList.remove('shield-active-blue');
                }
            }
        }
    }

    /**
     * Cập nhật hiển thị boom countdown
     * @param {number} boomIndex - Index của boom card cần cập nhật
     */
    updateBoomDisplay(boomIndex) {
        const boomElement = document.querySelector(`[data-index="${boomIndex}"]`);
        if (boomElement && this.cardManager.getCard(boomIndex)) {
            const boom = this.cardManager.getCard(boomIndex);
            const countdownDisplay = boomElement.querySelector('.countdown-display');
            if (countdownDisplay && boom.countdown !== undefined) {
                countdownDisplay.textContent = boom.countdown;
            }
        }
    }

    /**
     * Cập nhật hiển thị treasure durability
     * @param {number} treasureIndex - Index của treasure cần cập nhật
     */
    updateTreasureDisplay(treasureIndex) {
        const treasureElement = document.querySelector(`[data-index="${treasureIndex}"]`);
        if (treasureElement && this.cardManager.getCard(treasureIndex)) {
            const treasure = this.cardManager.getCard(treasureIndex);
            const durabilityDisplay = treasureElement.querySelector('.durability-display');
            if (durabilityDisplay && treasure.durability !== undefined) {
                durabilityDisplay.textContent = treasure.durability;
            }
        }
    }

    /**
     * Bắt đầu animation tương tác với treasure
     * @param {number} characterIndex - Index của character
     * @param {number} treasureIndex - Index của treasure
     */
    startTreasureInteractionAnimation(characterIndex, treasureIndex) {
        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.startAnimation();
        
        // ===== TÌM CÁC ELEMENT =====
        const characterElement = document.querySelector(`[data-index="${characterIndex}"]`);
        const treasureElement = document.querySelector(`[data-index="${treasureIndex}"]`);
        
        // ===== ANIMATION CHO CHARACTER (INTERACTING) =====
        if (characterElement) {
            characterElement.classList.add('treasure-interacting'); // Sử dụng class treasure-interacting cho character
            setTimeout(() => {
                characterElement.classList.remove('treasure-interacting'); // Xóa class sau 200ms
                this.endAnimation(); // Kết thúc animation
            }, 200);
        } else {
            // Nếu không có character element, kết thúc animation ngay
            setTimeout(() => {
                this.endAnimation();
            }, 200);
        }
        
        // ===== ANIMATION CHO TREASURE (BEING INTERACTED) =====
        if (treasureElement) {
            treasureElement.classList.add('treasure-being-interacted'); // Sử dụng class treasure-being-interacted cho treasure
            setTimeout(() => {
                treasureElement.classList.remove('treasure-being-interacted'); // Xóa class sau 200ms
            }, 200);
        }
    }

    /**
     * Bắt đầu animation boom explosion cho tất cả thẻ bị ảnh hưởng
     * @param {Array} affectedCardIndexes - Mảng các index của thẻ bị ảnh hưởng
     * @param {number} boomIndex - Index của boom card
     */
    startBoomExplosionAnimation(affectedCardIndexes, boomIndex) {
        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.startAnimation();
        
        // ===== ANIMATION CHO BOOM CARD =====
        const boomElement = document.querySelector(`[data-index="${boomIndex}"]`);
        if (boomElement) {
            boomElement.classList.add('boom-exploding');
            setTimeout(() => {
                boomElement.classList.remove('boom-exploding');
            }, 500);
        }
        
        // ===== ANIMATION CHO TẤT CẢ THẺ BỊ ẢNH HƯỞNG =====
        affectedCardIndexes.forEach((cardIndex) => {
            const cardElement = document.querySelector(`[data-index="${cardIndex}"]`);
            if (cardElement) {
                cardElement.classList.add('boom-exploding');
                setTimeout(() => {
                    cardElement.classList.remove('boom-exploding');
                }, 500);
            }
        });
        
        // ===== KẾT THÚC ANIMATION SAU KHI TẤT CẢ HOÀN THÀNH =====
        setTimeout(() => {
            this.endAnimation();
        }, 500);
    }



    /**
     * Tạo popup hiển thị damage
     * @param {HTMLElement} element - Element để thêm popup vào
     * @param {number} damage - Số damage cần hiển thị
     */
    createDamagePopup(element, damage) {
        // ===== KIỂM TRA VÀ XỬ LÝ DAMAGE =====
        const validDamage = damage || 0; // Đảm bảo damage không undefined
        console.log(`💥 Damage popup: original=${damage}, valid=${validDamage}`);
        
        // ===== CHỈ HIỂN THỊ POPUP NẾU DAMAGE > 0 =====
        if (validDamage <= 0) {
            console.log(`💥 B�? qua damage popup vì damage <= 0`);
            return;
        }
        
        // ===== TẠO POPUP ELEMENT =====
        const popup = document.createElement('div');
        popup.className = 'damage-popup';
        popup.textContent = `-${validDamage}`; // Hiển thị damage với dấu trừ
        
        // ===== THÊM VÀO ELEMENT =====
        element.appendChild(popup);
        
        // ===== TỰ XÓA SAU 800ms =====
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 800);
    }



    /**
     * Bắt đầu animation chiến đấu
     * @param {number} characterIndex - Index của character
     * @param {number} monsterIndex - Index của monster
     * @param {number} damage - Damage gây ra
     */
    startCombatAnimation(characterIndex, monsterIndex, damage) {
        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.startAnimation();
        
        // ===== TÌM CÁC ELEMENT =====
        const characterElement = document.querySelector(`[data-index="${characterIndex}"]`);
        const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
        
        // ===== ANIMATION CHO CHARACTER (ATTACKING) =====
        if (characterElement) {
            characterElement.classList.add('combat-attacking'); // Thêm class attacking
            setTimeout(() => {
                characterElement.classList.remove('combat-attacking'); // Xóa class sau 200ms
                this.endAnimation(); // Kết thúc animation
            }, 200);
        } else {
            // Nếu không có character element, kết thúc animation ngay
            setTimeout(() => {
                this.endAnimation();
            }, 200);
        }
        
        // ===== ANIMATION CHO MONSTER (DEFENDING) =====
        if (monsterElement) {
            monsterElement.classList.add('combat-defending'); // Thêm class defending
            this.createDamagePopup(monsterElement, damage); // Tạo damage popup
            setTimeout(() => {
                monsterElement.classList.remove('combat-defending'); // Xóa class sau 200ms
            }, 200);
        }
    }

    /**
     * Hiển thị message tạm thời trên màn hình
     * @param {string} message - Nội dung message
     */
    showMessage(message) {
        const grid = document.getElementById('cards-grid');
        
        // ===== TẠO MESSAGE ELEMENT =====
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = message;
        
        // ===== STYLING CHO MESSAGE =====
        messageElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            font-size: 1.1rem;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        `;
        
        // ===== THÊM VÀO GRID =====
        grid.appendChild(messageElement);
        
        // ===== TỰ XÓA SAU 2 GIÂY =====
        setTimeout(() => {
            messageElement.remove();
        }, 2000);
    }

    /**
     * Bắt đầu animation game over
     * Tất cả cards sẽ co lại và biến mất
     */
    triggerGameOver() {
        // ===== BẮT ĐẦU ANIMATION TRACKING =====
        this.startAnimation();
        
        const cards = document.querySelectorAll('.card');
        console.log(`Found ${cards.length} cards to animate`);
        
        // ===== KIỂM TRA CÓ CARDS KHÔNG =====
        if (cards.length === 0) {
            console.warn('No cards found to animate');
            this.showGameOverDialog(); // Hiển thị dialog ngay nếu không có cards
            this.endAnimation(); // Kết thúc animation
            return;
        }
        
        // ===== ANIMATE TỪNG CARD =====
        let animatedCount = 0;
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('shrinking'); // Thêm class shrinking
                animatedCount++;
                console.log(`Animating card ${index} (${animatedCount}/${cards.length})`);
                
                if (animatedCount === cards.length) {
                    console.log('All cards animated successfully');
                }
            }, index * 100); // Delay 150ms giữa mỗi card
        });

        // ===== TÍNH THỜI GIAN TỔNG =====
        const totalAnimationTime = cards.length * 100 + 1000 ; // Thêm 1.5s cho animation hoàn thành
        console.log(`Game over dialog will show in ${totalAnimationTime}ms`);
        
        // ===== HIỂN THỊ DIALOG SAU KHI ANIMATION XONG =====
        setTimeout(() => {
            this.showGameOverDialog();
            this.endAnimation(); // Kết thúc animation
        }, totalAnimationTime);
    }

    /**
     * Hiển thị dialog game over
     * Ẩn tất cả cards và hiển thị dialog
     */
    showGameOverDialog() {
        this.forceHideAllCards(); // Ẩn tất cả cards
        
        const dialog = document.getElementById('game-over-dialog');
        dialog.classList.add('show'); // Hiển thị dialog
    }

    /**
     * Buộc ẩn tất cả cards
     * Sử dụng khi cần ẩn cards ngay lập tức
     */
    forceHideAllCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.display = 'none'; // Ẩn card ngay lập tức
        });
        console.log('Force hidden all cards');
    }

    /**
     * Ẩn dialog game over
     * Được gọi khi restart game
     */
    hideGameOverDialog() {
        const dialog = document.getElementById('game-over-dialog');
        dialog.classList.remove('show'); // Ẩn dialog
        
        // ===== FORCE RESET ANIMATION STATE =====
        this.forceResetAnimationState();
    }
} 