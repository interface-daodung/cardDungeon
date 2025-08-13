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
        this.cardManager = cardManager;
        this.characterManager = characterManager;
        this.eventManager = null;

        // ===== ANIMATION STATE TRACKING =====
        this.isAnimating = false;
        this.animationCount = 0;

        // ===== ANIMATION QUEUE SYSTEM =====
        this.animationQueue = [];
        this.isProcessingQueue = false;

        // ===== ANIMATION CONSTANTS =====
        this.ANIMATION_DURATIONS = {
            FLIP: 600,
            TRAP: 600,
            TREASURE: 300,
            BOOM: 500,
            COMBAT: 300,
            MOVE: 500,
            GAME_OVER: 800,
            APPEAR: 200
        };

        this.ANIMATION_PRIORITIES = {
            GAME_OVER: 1,
            MOVE: 2,
            FLIP: 4,
            COMBAT: 3,
            TRAP: 4,
            TREASURE: 4,
            BOOM: 6,
            RENDER: 7
        };
    }

    // ===== CÁC HÀM QUẢN LÝ ANIMATION STATE =====

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
    }

    /**
     * Kết thúc animation - giảm counter và cập nhật trạng thái
     */
    endAnimation() {
        this.animationCount = Math.max(0, this.animationCount - 1);
        this.isAnimating = this.animationCount > 0;
    }

    /**
     * Kiểm tra xem có đang có animation hay không
     * @returns {boolean} True nếu đang có animation
     */
    isCurrentlyAnimating() {
        return this.isAnimating;
    }

    /**
     * Kiểm tra xem có đang bận animation hay không (bao gồm cả hàng đợi)
     * @returns {boolean} True nếu đang có animation hoặc hàng đợi không rỗng
     */
    isAnimationBusy() {
        return this.isAnimating || this.animationQueue.length > 0 || this.isProcessingQueue;
    }

    // ===== ANIMATION QUEUE SYSTEM =====

    /**
     * Thêm animation vào hàng đợi
     * @param {Function} animationFunction - Hàm animation cần thực hiện
     * @param {string} animationName - Tên animation để debug
     * @param {number} priority - Độ ưu tiên (số càng nhỏ càng ưu tiên cao)
     */
    queueAnimation(animationFunction, animationName = 'Unknown', priority = 5) {
        const animationTask = {
            id: Date.now() + Math.random(),
            function: animationFunction,
            name: animationName,
            priority: priority,
            timestamp: Date.now()
        };

        this.animationQueue.push(animationTask);
        this.animationQueue.sort((a, b) => a.priority - b.priority);

        if (!this.isProcessingQueue) {
            this.processAnimationQueue();
        }
    }

    /**
     * Xử lý hàng đợi animation tuần tự
     */
    async processAnimationQueue() {
        if (this.isProcessingQueue || this.animationQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.animationQueue.length > 0) {
            const animationTask = this.animationQueue.shift();

            try {
                await this.executeAnimation(animationTask);
            } catch (error) {
                console.error(`🎬 Error in animation: ${animationTask.name}`, error);
            }
        }

        this.isProcessingQueue = false;
    }

    /**
     * Thực hiện một animation cụ thể
     * @param {Object} animationTask - Task animation cần thực hiện
     */
    async executeAnimation(animationTask) {
        return new Promise((resolve, reject) => {
            try {
                this.startAnimation();

                const result = animationTask.function();

                if (result && typeof result.then === 'function') {
                    result.then(() => {
                        this.endAnimation();
                        resolve();
                    }).catch((error) => {
                        console.error(`🎬 Animation error in ${animationTask.name}:`, error);
                        this.endAnimation();
                        reject(error);
                    });
                } else {
                    setTimeout(() => {
                        this.endAnimation();
                        resolve();
                    }, 100);
                }

            } catch (error) {
                console.error(`🎬 Animation execution error in ${animationTask.name}:`, error);
                this.endAnimation();
                reject(error);
            }
        });
    }

    /**
     * Xóa tất cả animation trong hàng đợi
     */
    clearAnimationQueue() {
        this.animationQueue = [];
    }

    /**
     * Lấy thông tin về hàng đợi animation
     * @returns {Object} Thông tin về hàng đợi
     * có thể xóa 
     */
    // getQueueInfo() {
    //     return {
    //         queueSize: this.animationQueue.length,
    //         isProcessing: this.isProcessingQueue,
    //         isAnimating: this.isAnimating,
    //         animationCount: this.animationCount,
    //         queueItems: this.animationQueue.map(item => ({
    //             name: item.name,
    //             priority: item.priority,
    //             timestamp: item.timestamp
    //         }))
    //     };
    // }

    // ===== HELPER FUNCTIONS =====

    /**
     * Tạo animation loop với requestAnimationFrame
     * @param {Function} animateFunction - Hàm animation
     * @param {number} duration - Thời gian animation (ms)
     * @param {Function} easingFunction - Hàm easing
     * @param {Function} onComplete - Callback khi hoàn thành
     * @param {string} animationKey - Key để lưu vào window
     * @returns {Object} Cleanup function
     */
    createAnimationLoop(animateFunction, duration, easingFunction, onComplete, animationKey) {
        const startTime = performance.now();
        let animationId = null;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFunction ? easingFunction(progress) : progress;

            animateFunction(easedProgress, progress);

            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            } else {
                if (onComplete) onComplete();
            }
        };

        animationId = requestAnimationFrame(animate);

        const cleanup = () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };

        if (animationKey) {
            window[animationKey] = { cancel: cleanup, animationId };
        }

        return cleanup;
    }

    /**
     * Easing functions
     */
    static EASING = {
        easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
        easeInOutBack: (t) => {
            const c1 = 1.70158;
            const c2 = c1 * 1.525;
            return t < 0.5
                ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
                : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
        },
        easeOutBounce: (t) => {
            const n1 = 7.5625;
            const d1 = 2.75;
            if (t < 1 / d1) return n1 * t * t;
            if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
            if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        },
        easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
        easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInBack: (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return c3 * t * t * t - c1 * t * t;
        }
    };

    /**
     * Hủy tất cả animation đang chạy
     */
    cancelAllRunningAnimations() {
        const animationKeys = [
            'currentGameOverAnimation',
            'currentFlipAnimation',
            'currentTrapAnimation',
            'currentTreasureAnimation',
            'currentBoomAnimation',
            'currentCombatAnimation',
            'currentMoveAnimation'
        ];

        animationKeys.forEach(key => {
            if (window[key] && window[key].cancel) {
                console.log(`🎬 Cancelling ${key}`);
                window[key].cancel();
                delete window[key];
            }
        });
    }

    /**
     * Xóa toàn bộ cards grid
     */
    clearCardsGrid() {
        const grid = document.getElementById('cards-grid');
        if (grid) {
            console.log('🎬 Clearing cards grid');
            grid.innerHTML = '';
        }
    }

    /**
     * Trộn mảng theo thuật toán Fisher-Yates shuffle
     * @param {Array} array - Mảng cần trộn
     * @returns {Array} Mảng đã được trộn
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // ===== CÁC HÀM ANIMATION CƠ BẢN =====

    /**
     * Thêm hiệu ứng flip cho 2 thẻ khi đổi vị trí
     * @param {number} index1 - Index của thẻ thứ nhất
     * @param {number} index2 - Index của thẻ thứ hai
     * @param {Function} callback - Callback được gọi sau khi animation hoàn thành
     */
    flipCards(index1, index2, callback = null) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const card1Element = document.querySelector(`[data-index="${index1}"]`);
                const card2Element = document.querySelector(`[data-index="${index2}"]`);

                if (!card1Element || !card2Element) {
                    if (callback) callback();
                    resolve();
                    return;
                }

                card1Element.classList.add('flipping');
                card2Element.classList.add('flipping');

                this.createAnimationLoop(
                    (easedProgress) => {
                        const rotation = easedProgress * 180;
                        card1Element.style.transform = `rotateY(${rotation}deg)`;
                        card2Element.style.transform = `rotateY(${rotation}deg)`;
                    },
                    this.ANIMATION_DURATIONS.FLIP,
                    AnimationManager.EASING.easeInOutCubic,
                    () => {
                        card1Element.classList.remove('flipping');
                        card2Element.classList.remove('flipping');
                        card1Element.style.transform = '';
                        card2Element.style.transform = '';
                        if (callback) callback();
                        resolve();
                    },
                    'currentFlipAnimation'
                );
            });
        }, `Flip Cards (${index1} ↔ ${index2})`, this.ANIMATION_PRIORITIES.FLIP);
    }

    /**
     * Hiệu ứng khi trap được kích hoạt
     * @param {number} trapIndex - Index của trap card
     * @param {Card} trapCard - Trap card instance
     * @param {CardManager} cardManager - Manager quản lý thẻ
     */
    startTrapActivationAnimation(trapIndex, trapCard, cardManager) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const trapElement = document.querySelector(`[data-index="${trapIndex}"]`);
                if (!trapElement) {
                    resolve();
                    return;
                }

                const damageDelay = 300;
                let damageProcessed = false;

                trapElement.classList.add('trap-activating');

                const adjacentTargets = trapCard.findAdjacentTargets(trapIndex, cardManager);
                adjacentTargets.forEach(targetIndex => {
                    const targetElement = document.querySelector(`[data-index="${targetIndex}"]`);
                    if (targetElement) {
                        targetElement.classList.add('trap-targeted');
                    }
                });

                this.createAnimationLoop(
                    (easedProgress, progress) => {
                        const pulseScale = 1 + (easedProgress * 0.2);
                        trapElement.style.transform = `scale(${pulseScale})`;

                        if (progress >= damageDelay / this.ANIMATION_DURATIONS.TRAP && !damageProcessed) {
                            damageProcessed = true;
                            adjacentTargets.forEach(targetIndex => {
                                const targetElement = document.querySelector(`[data-index="${targetIndex}"]`);
                                const targetCard = cardManager.getCard(targetIndex);
                                if (targetElement && targetCard) {
                                    console.log('processTrapDamageToCard targetCard.score----------------------------------------', targetCard.score);
                                    trapCard.processTrapDamageToCard(targetCard, targetElement, trapCard.damage, cardManager, targetIndex, this, this.characterManager);
                                }
                            });
                        }
                    },
                    this.ANIMATION_DURATIONS.TRAP,
                    AnimationManager.EASING.easeInOutSine,
                    () => {
                        trapElement.classList.remove('trap-activating');
                        trapElement.style.transform = '';

                        adjacentTargets.forEach(targetIndex => {
                            const targetElement = document.querySelector(`[data-index="${targetIndex}"]`);
                            if (targetElement) {
                                targetElement.classList.remove('trap-targeted');
                            }
                        });

                        setTimeout(() => {
                            if (this.eventManager) {
                                this.eventManager.setupCardEvents();
                            }
                        }, 100);

                        resolve();
                    },
                    'currentTrapAnimation'
                );
            });
        }, `Trap Activation (${trapIndex})`, this.ANIMATION_PRIORITIES.TRAP);
    }


    /**
     * Tạo popup hiển thị damage
     * @param {HTMLElement} element - Element để thêm popup vào
     * @param {number} damage - Số damage cần hiển thị
     */
    createDamagePopup(element, damage, card = null, cardManager = null) {
        const validDamage = damage || 0;
        if (validDamage <= 0) return;

        const popup = document.createElement('div');
        popup.className = 'damage-popup';
        popup.textContent = `-${validDamage}`;

        //element.appendChild(popup);
        if (element && element.appendChild) {
            element.appendChild(popup);
        } else {
            console.log(` card-------lỗi fallback----------${card}`)
            document.querySelector(`[data-card-id="${card.id}"]`).appendChild(popup);
        }
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 800);
    }

    /**
     * Bắt đầu animation take damage effect
     * @param {HTMLElement} cardElement - Element của card
     * @param {Card} card - Card instance
     * @param {string} damageType - Loại damage (trap, boom, etc.)
     */
    startTakeDamageEffectAnimation(cardElement, card, damage, damageType, cardManager) {
        // Chạy hàm createDamagePopup trực tiếp, không thêm vào hàng đợi

        this.createDamagePopup(cardElement, damage, card, cardManager);
        if(damageType=='curse'){
            console.log(` card--curse---------------${card}------`);
            if (cardElement && cardElement?.classList.add) {
                cardElement.style.setProperty('border-color', '#00AA00', 'important'); // xanh lá đậm
                cardElement.style.setProperty('box-shadow', '0 0 15px rgba(0, 170, 0, 0.8)', 'important');

                cardElement.classList.add('combat-attacking');
            } else {
                // thường thì không fallback
                console.log(` card--------curse---------${card}--------fallback`)
                document.querySelector(`[data-card-id="${card.id}"]`).classList.add('combat-attacking');
            }

            setTimeout(() => {
                if (cardElement) {
                    cardElement.classList.remove('combat-attacking');
                    this.updateCardStatus(card.id);
                } else {
                    console.log(` card---curse---${card}--------fallback remove lỗi ?????????`);
                }

            }, 300);
        } else if (damageType === 'foodUp' || damageType === 'weaponUp') {
            console.log(` card--curse---------------${card}------`);
            if (cardElement && cardElement?.classList.add) {
                cardElement.style.setProperty('border-color', '#00AA00', 'important'); // xanh lá đậm
                cardElement.style.setProperty('box-shadow', '0 0 15px rgba(107, 209, 107, 0.8)', 'important');

                cardElement.classList.add('combat-attacking');
            } else {
                // thường thì không fallback
                console.log(` card--------curse---------${card}--------fallback`)
                document.querySelector(`[data-card-id="${card.id}"]`).classList.add('combat-attacking');
            }

            setTimeout(() => {
                if (cardElement) {
                    cardElement.classList.remove('combat-attacking');
                    this.updateCardStatus(card.id);
                } else {
                    console.log(` card---curse---${card}--------fallback remove lỗi ?????????`);
                }

            }, 300);
        } else if (['Mystic Heaven', 'Ocean', 'Forest', 'item' ].includes(damageType)) {

            console.log(` card-----------------${card}--------not fallback`);
            if (cardElement && cardElement?.classList.add) {
                cardElement.classList.add('combat-attacking');
            } else {
                // thường thì không fallback
                console.log(` card-----------------${card}--------fallback`)
                document.querySelector(`[data-card-id="${card.id}"]`).classList.add('combat-attacking');
            }

            setTimeout(() => {
                if (cardElement) {
                    cardElement.classList.remove('combat-attacking');
                    this.updateCardStatus(card.id);
                } else {
                    console.log(` card------${card}--------fallback remove lỗi ?????????`);
                }

            }, 300);
        }
    }

    /**
     * Bắt đầu animation game over
     */
    triggerGameOver() {
        console.log('🎬 Game Over triggered - Clearing all animation queue');
        this.clearAnimationQueue();
        this.cancelAllRunningAnimations();

        this.animationCount = 0;
        this.isAnimating = false;
        this.isProcessingQueue = false;

        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const cards = document.querySelectorAll('.card');
                console.log(`Found ${cards.length} cards to animate`);

                if (cards.length === 0) {
                    console.warn('No cards found to animate');
                    this.showGameOverDialog();
                    this.clearCardsGrid();
                    resolve();
                    return;
                }

                const staggerDelay = 80;
                const startTime = performance.now();
                let currentCardIndex = 0;
                let completedCards = 0;

                const cardsArray = Array.from(cards);
                const shuffledCards = this.shuffleArray(cardsArray);

                this.createAnimationLoop(
                    (easedProgress, progress) => {
                        const elapsed = progress * (this.ANIMATION_DURATIONS.GAME_OVER + (shuffledCards.length - 1) * staggerDelay);
                        const currentTimeForCard = elapsed - (currentCardIndex * staggerDelay);
                        const cardProgress = Math.min(currentTimeForCard / this.ANIMATION_DURATIONS.GAME_OVER, 1);

                        if (currentCardIndex < shuffledCards.length && cardProgress >= 0) {
                            const card = shuffledCards[currentCardIndex];
                            if (card) {
                                const scale = 1 - (easedProgress * 0.8);
                                const opacity = 1 - easedProgress;

                                card.style.transform = `scale(${scale})`;
                                card.style.opacity = opacity;

                                if (!card.classList.contains('shrinking')) {
                                    card.classList.add('shrinking');
                                }

                                if (cardProgress >= 1) {
                                    completedCards++;
                                    currentCardIndex++;
                                }
                            }
                        }
                    },
                    this.ANIMATION_DURATIONS.GAME_OVER + (shuffledCards.length - 1) * staggerDelay,
                    AnimationManager.EASING.easeInBack,
                    () => {
                        setTimeout(() => {
                            this.showGameOverDialog();
                            this.clearCardsGrid();
                            resolve();
                        }, 500);
                    },
                    'currentGameOverAnimation'
                );
            });
        }, 'Game Over Animation', this.ANIMATION_PRIORITIES.GAME_OVER);
    }

    /**
     * Hiển thị dialog game over
     */
    showGameOverDialog() {
        const dialog = document.getElementById('game-over-dialog');
        dialog.classList.add('show');
    }

    /**
     * Ẩn dialog game over
     */
    hideGameOverDialog() {
        const dialog = document.getElementById('game-over-dialog');
        dialog.classList.remove('show');
    }

    // ===== CÁC HÀM RENDER VÀ UPDATE =====

    /**
     * Render tất cả cards lên màn hình
     */
    renderCards() {
        this.animationCount = 0;
        this.isAnimating = false;

        const grid = document.getElementById('cards-grid');
        grid.innerHTML = '';

        this.cardManager.getAllCards().forEach((card, index) => {
            if (card) {
                const cardElement = this.createOrUpdateCardElement(card, index, false);
                grid.appendChild(cardElement);
            }
        });
    }

    /**
     * Render card với hiệu ứng xuất hiện
     * @param {number} newCardIndex - Index của thẻ cần render
     */
    renderCardsWithAppearEffect(newCardIndex) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const card = this.cardManager.getCard(newCardIndex);
                if (!card) {
                    resolve();
                    return;
                }

                const existingCardElement = document.querySelector(`[data-index="${newCardIndex}"]`);

                if (existingCardElement) {
                    this.createOrUpdateCardElement(card, newCardIndex, true, existingCardElement);
                    existingCardElement.classList.add('appearing');

                    setTimeout(() => {
                        existingCardElement.classList.remove('appearing');
                    }, this.ANIMATION_DURATIONS.APPEAR);
                } else {
                     // code này có thể ko bao giờ chạy 
                            console.warn('renderListCardsWithAppearEffect-----------')
                    console.log(`-------- thẻ dc tạo mới ----------`)
                    const grid = document.getElementById('cards-grid');
                    const cardElement = this.createOrUpdateCardElement(card, newCardIndex, false);
                    cardElement.classList.add('appearing');

                    const targetPosition = Array.from(grid.children)[newCardIndex];
                    if (targetPosition !== undefined) {
                        grid.insertBefore(cardElement, targetPosition);
                    } else {
                        grid.appendChild(cardElement);
                    }

                    setTimeout(() => {
                        cardElement.classList.remove('appearing');
                    }, this.ANIMATION_DURATIONS.APPEAR);
                }

                if (this.eventManager) {
                    // code này có thể ko bao giờ chạy 
                           // console.warn('renderCardsWithAppearEffect-----------')
                    //this.eventManager.setupCardEventsForIndex(newCardIndex);
                }

                setTimeout(resolve, this.ANIMATION_DURATIONS.APPEAR);
            });
        }, `Render Cards with Appear Effect (${newCardIndex})`, this.ANIMATION_PRIORITIES.RENDER);
    }

    /**
     * Cập nhật toàn bộ grid một cách an toàn
     */
    updateEntireGrid() {
        const grid = document.getElementById('cards-grid');
        if (!grid) return;

        const allCards = this.cardManager.getAllCards();

        allCards.forEach((card, index) => {
            if (card) {
                const existingElement = document.querySelector(`[data-index="${index}"]`);

                if (existingElement) {
                    this.createOrUpdateCardElement(card, index, true, existingElement);
                } else {
                    // code này có thể ko bao giờ xảy ra 
                    console.log(`hàm này dc goiiiiiiiiiiiiiiiiiittttttttttttttttiiiiiiiii`);
                    const newElement = this.createOrUpdateCardElement(card, index, false);
                    const targetPosition = Array.from(grid.children)[index];
                    if (targetPosition !== null) {
                        grid.insertBefore(newElement, targetPosition);
                    } else {
                        grid.appendChild(newElement);
                    }
                }
            }
        });
        // thêm _clickHandler nếu thiếu 
        if (this.eventManager) {
            allCards.forEach((card, index) => {
                if (card) {
                    const existingElement = document.querySelector(`[data-index="${index}"]`);
                    if (existingElement && !existingElement._clickHandler) {
                        console.warn(`hàm này dc setupCardEventsForIndex---------------`);
                        //this.eventManager.setupCardEventsForIndex(index);
                    }
                }
            });
        }
    }

    /**
     * Tạo hoặc cập nhật card element
     * @param {Object} card - Dữ liệu card
     * @param {number} index - Index của card trong grid
     * @param {boolean} isUpdate - True nếu cập nhật element hiện có
     * @param {HTMLElement} existingElement - Element hiện có
     * @returns {HTMLElement} Card element đã được tạo hoặc cập nhật
     */
    createOrUpdateCardElement(card, index, isUpdate = false, existingElement = null) {
        let cardElement;

        if (isUpdate && existingElement) {
            cardElement = existingElement;

            const imageElement = cardElement.querySelector('.card-image');
            if (imageElement) {
                imageElement.src = card.image;
                imageElement.alt = card.type;
            }

            this.clearAnimationStyles(cardElement);

            const cardImage = cardElement.querySelector('.card-image');
            cardElement.innerHTML = '';
            if (cardImage) {
                cardElement.appendChild(cardImage);
            }
        } else {
            cardElement = document.createElement('div');
            
            const imageElement = document.createElement('img');
            imageElement.className = 'card-image';
            imageElement.src = card.image;
            imageElement.alt = card.type;
            cardElement.appendChild(imageElement);
        }

        cardElement.className = `card ${card.type}`;
        cardElement.dataset.index = index;
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.type = card.type;

        this.addCardDisplayElements(cardElement, card);

        return cardElement;
    }

    /**
     * Thêm các element hiển thị cho card
     * @param {HTMLElement} cardElement - Element của card
     * @param {Object} card - Dữ liệu card
     */
    addCardDisplayElements(cardElement, card) {
        // Coin card
        if (card.type === 'coin' && card.nameId !== 'void') {
            const scoreDisplay = document.createElement('div');
            scoreDisplay.className = 'score-display';
            scoreDisplay.textContent = card.score || 0;
            cardElement.appendChild(scoreDisplay);
        }

        // Food card
        if (card.type === 'food') {
            const healDisplay = document.createElement('div');
            healDisplay.className = 'heal-display';
            healDisplay.textContent = card.heal || 0;
            cardElement.appendChild(healDisplay);
        }

        // Weapon card
        if (card.type === 'weapon') {
            const durabilityDisplay = document.createElement('div');
            durabilityDisplay.className = 'durability-display';
            durabilityDisplay.textContent = card.durability || 0;
            cardElement.appendChild(durabilityDisplay);
        }

        // Treasure card
        if (card.nameId === 'treasure0') {
            if (card.durability) {
                const durabilityDisplay = document.createElement('div');
                durabilityDisplay.className = 'durability-display';
                durabilityDisplay.textContent = card.durability;
                cardElement.appendChild(durabilityDisplay);
            }

            const scoreDisplay = document.createElement('div');
            scoreDisplay.className = 'score-display';
            scoreDisplay.textContent = card.score || 0;
            cardElement.appendChild(scoreDisplay);
        }

        // Boom card
        if (card.type === 'boom') {
            const damageDisplay = document.createElement('div');
            damageDisplay.className = 'damage-display';
            damageDisplay.textContent = card.damage || 0;
            cardElement.appendChild(damageDisplay);

            const countdownDisplay = document.createElement('div');
            countdownDisplay.className = 'countdown-display';
            countdownDisplay.textContent = card.countdown || 0;
            cardElement.appendChild(countdownDisplay);
        }

        // Character card
        if (card.type === 'character') {
            const hpDisplay = document.createElement('div');
            hpDisplay.className = 'hp-display';
            hpDisplay.textContent = this.characterManager.getCharacterHP();
            cardElement.appendChild(hpDisplay);

            if (this.characterManager.hasWeapon()) {
                const weaponDisplay = document.createElement('div');
                weaponDisplay.className = 'weapon-display';
                weaponDisplay.textContent = this.characterManager.getCharacterWeaponDurability();
                cardElement.appendChild(weaponDisplay);

                // Tạo ảnh nhỏ và thêm vào góc dưới bên phải
                const badgeElement = document.createElement('img');
                badgeElement.className = 'card-badge';
                badgeElement.src = `resources/badge/${this.characterManager.getCharacterWeaponObject().nameId}.webp`; // thay bằng đường dẫn ảnh thực tế
                badgeElement.alt = 'badge';
                cardElement.appendChild(badgeElement);


            }
        }
        // Enemy card
        else if (card.type === 'enemy') {
            const hpDisplay = document.createElement('div');
            hpDisplay.className = 'hp-display';
            this.addEnemySpecialStyling(cardElement, card);
            hpDisplay.textContent = card.hp || 0;
            cardElement.appendChild(hpDisplay);
        }
        // Trap card
        else if (card.nameId === 'trap') {
            const damageDisplay = document.createElement('div');
            damageDisplay.className = 'damage-display';
            damageDisplay.textContent = card.damage || 0;
            cardElement.appendChild(damageDisplay);

            this.addTrapArrows(cardElement, card);
        }
    }

    /**
     * Thêm styling đặc biệt cho enemy cards
     * @param {HTMLElement} cardElement - Element của card
     * @param {Object} card - Dữ liệu card
     */
    addEnemySpecialStyling(cardElement, card) {
        if (card.nameId === 'operative') {
            if (card.cowardlyEffect && typeof card.cowardlyEffect === 'function') {
                const isCowardly = card.cowardlyEffect(this.characterManager);
                if (isCowardly) {
                    cardElement.classList.add('cowardly');
                } else {
                    cardElement.classList.remove('cowardly');
                }
            }
        }

        if (card.nameId === 'fatui1') {
            if (card.repaymentReceipt > 0) {
                const repaymentReceiptDisplay = document.createElement('div');
                repaymentReceiptDisplay.className = 'repayment-receipt-display';
                repaymentReceiptDisplay.textContent = card.repaymentReceipt;
                cardElement.appendChild(repaymentReceiptDisplay);
            }
        }

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

    /**
     * Thêm mũi tên cho trap cards
     * @param {HTMLElement} cardElement - Element của card
     * @param {Object} card - Dữ liệu card
     */
    addTrapArrows(cardElement, card) {
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


    /**
     * Xóa tất cả CSS styles và animation classes khỏi element
     * @param {HTMLElement} element - Element cần xóa CSS
     */
    clearAnimationStyles(element) {
        if (!element) return;
        element.removeAttribute('style');
        element.className = '';
    }

    // ===== CÁC HÀM UPDATE DISPLAY =====

    /** hàm cũ 
     * Cập nhật hiển thị character (HP và weapon)
     */
    // updateCharacterDisplay() {
    //     const characterElement = document.querySelector('.card.character');
    //     if (characterElement) {
    //         const hpDisplay = characterElement.querySelector('.hp-display');
    //         if (hpDisplay) {
    //             hpDisplay.textContent = this.characterManager.getCharacterHP();
    //         }

    //         let weaponDisplay = characterElement.querySelector('.weapon-display');
    //         if (this.characterManager.getCharacterWeaponDurability() > 0) {
    //             if (!weaponDisplay) {
    //                 weaponDisplay = document.createElement('div');
    //                 weaponDisplay.className = 'weapon-display';
    //                 characterElement.appendChild(weaponDisplay);
    //             }
    //             weaponDisplay.textContent = this.characterManager.getCharacterWeaponDurability();
    //         } else if (weaponDisplay) {
    //             weaponDisplay.remove();
    //         }
    //     }
    // }

    /**
     * Cập nhật hiển thị monster HP code cũ 
     * @param {number} monsterIndex - Index của monster cần cập nhật
     * đã lỗi thời cần sớm xóa và thay đổi
     */
    // updateMonsterDisplay(monsterIndex) {
    //     const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
    //     if (monsterElement && this.cardManager.getCard(monsterIndex)) {
    //         const monster = this.cardManager.getCard(monsterIndex);

    //         this.addEnemySpecialStyling(monsterElement, monster);

    //         const hpDisplay = monsterElement.querySelector('.hp-display');
    //         if (hpDisplay) {
    //             hpDisplay.textContent = monster.hp || 0;
    //         }

    //     }
    // }

    /**
     * Cập nhật hiển thị boom countdown và damage
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

            const damageDisplay = boomElement.querySelector('.damage-display');
            if (damageDisplay && boom.damage !== undefined) {
                damageDisplay.textContent = boom.damage;
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


    // ===== CÁC HÀM ANIMATION BỔ SUNG =====

    /**
     * Bắt đầu animation di chuyển character
     * @param {number} fromIndex - Index xuất phát
     * @param {number} toIndex - Index đích
     * @param {Object} cardToMove - Thông tin thẻ bị đẩy
     * @param {Function} onComplete - Callback khi hoàn thành
     */
    startMoveCharacterAnimation(fromIndex, toIndex, cardToMove, onComplete) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
                const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };

                const characterElement = document.querySelector(`[data-index="${fromIndex}"]`);
                const targetElement = document.querySelector(`[data-index="${toIndex}"]`);

                if (!characterElement || !targetElement) {
                    resolve();
                    return;
                }

                const moveDistance = this.calculateMoveDistance(fromPos.col, toPos.col, fromPos.row, toPos.row);
                const moveX = moveDistance.x;
                const moveY = moveDistance.y;

                characterElement.style.setProperty('--dual-move-x', `${moveX}px`);
                characterElement.style.setProperty('--dual-move-y', `${moveY}px`);

                characterElement.classList.add('dual-moving');
                targetElement.classList.add('dual-eating');

                if (cardToMove) {
                    const cardToMoveElement = document.querySelector(`[data-index="${cardToMove.fromIndex}"]`);
                    if (cardToMoveElement) {
                        const cardToMovePos = {
                            row: Math.floor(cardToMove.fromIndex / 3),
                            col: cardToMove.fromIndex % 3
                        };

                        const reverseMoveDistance = this.calculateMoveDistance(
                            cardToMovePos.col, fromPos.col,
                            cardToMovePos.row, fromPos.row
                        );
                        const reverseMoveX = reverseMoveDistance.x;
                        const reverseMoveY = reverseMoveDistance.y;

                        cardToMoveElement.style.setProperty('--dual-reverse-x', `${reverseMoveX}px`);
                        cardToMoveElement.style.setProperty('--dual-reverse-y', `${reverseMoveY}px`);
                        cardToMoveElement.classList.add('dual-reverse');
                    }
                }

                this.createAnimationLoop(
                    (easedProgress) => {
                        characterElement.style.transform = `translate(${moveX * easedProgress}px, ${moveY * easedProgress}px)`;
                    },
                    this.ANIMATION_DURATIONS.MOVE,
                    AnimationManager.EASING.easeInOutQuad,
                    () => {
                        this.cleanupMoveAnimation(characterElement, targetElement, cardToMove, onComplete);
                        resolve();
                    },
                    'currentMoveAnimation'
                );
            });
        }, `Move Character (${fromIndex} → ${toIndex})`, this.ANIMATION_PRIORITIES.MOVE);
    }

    /**
     * Cleanup function cho move animation
     * @param {HTMLElement} characterElement - Character element
     * @param {HTMLElement} targetElement - Target element
     * @param {Object} cardToMove - Card to move info
     * @param {Function} onComplete - Completion callback
     */
    cleanupMoveAnimation(characterElement, targetElement, cardToMove, onComplete) {
        const allElements = [characterElement, targetElement];
        if (cardToMove) {
            const cardToMoveElement = document.querySelector(`[data-index="${cardToMove.fromIndex}"]`);
            if (cardToMoveElement) {
                allElements.push(cardToMoveElement);
            }
        }

        allElements.forEach(element => {
            this.clearDualMovementStyles(element);
            element.style.transform = '';
        });

        if (onComplete) {
            onComplete();
        }

        if (window.currentMoveAnimation) {
            delete window.currentMoveAnimation;
        }
    }

    /**
     * Tính toán khoảng cách di chuyển
     * @param {number} fromCol - Cột bắt đầu
     * @param {number} toCol - Cột đích
     * @param {number} fromRow - Hàng bắt đầu
     * @param {number} toRow - Hàng đích
     * @returns {Object} Khoảng cách di chuyển {x, y}
     */
    calculateMoveDistance(fromCol, toCol, fromRow, toRow) {
        const cardWidth = this.getCardWidth();
        const cardHeight = cardWidth * (12 / 7);

        return {
            x: (toCol - fromCol) * cardWidth,
            y: (toRow - fromRow) * cardHeight
        };
    }

    /**
     * Lấy chiều rộng thẻ bài động
     * @returns {number} Chiều rộng thẻ bài
     */
    getCardWidth() {
        const gridElement = document.querySelector('.cards-grid');
        if (!gridElement) {
            return 100;
        }
        const gridWidth = gridElement.offsetWidth;
        const gap = 4;
        const numColumns = 3;
        const totalGapWidth = gap * (numColumns - 1);
        const cardWidth = (gridWidth - totalGapWidth) / numColumns;
        return Math.round(cardWidth);
    }

    /**
     * Xóa chỉ các CSS styles và classes liên quan đến dual movement
     * @param {HTMLElement} element - Element cần xóa dual movement styles
     */
    clearDualMovementStyles(element) {
        if (!element) return;

        element.style.removeProperty('--dual-move-x');
        element.style.removeProperty('--dual-move-y');
        element.style.removeProperty('--dual-reverse-x');
        element.style.removeProperty('--dual-reverse-y');

        element.classList.remove('dual-moving');
        element.classList.remove('dual-reverse');
        element.classList.remove('dual-eating');
    }

    /**
     * Bắt đầu animation tương tác với treasure
     * @param {number} characterIndex - Index của character
     * @param {number} treasureIndex - Index của treasure
     */
    startTreasureInteractionAnimation(characterIndex, treasureIndex) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const characterElement = document.querySelector(`[data-index="${characterIndex}"]`);
                const treasureElement = document.querySelector(`[data-index="${treasureIndex}"]`);

                if (!characterElement || !treasureElement) {
                    resolve();
                    return;
                }

                characterElement.classList.add('treasure-interacting');
                treasureElement.classList.add('treasure-being-interacted');

                this.createAnimationLoop(
                    (easedProgress) => {
                        const shakeIntensity = (1 - easedProgress) * 5;
                        const shakeX = Math.sin(easedProgress * Math.PI * 8) * shakeIntensity;
                        characterElement.style.transform = `translateX(${shakeX}px)`;

                        const glowIntensity = easedProgress * 0.3;
                        treasureElement.style.filter = `brightness(${1 + glowIntensity})`;
                    },
                    this.ANIMATION_DURATIONS.TREASURE,
                    AnimationManager.EASING.easeInOutBack,
                    () => {
                        characterElement.classList.remove('treasure-interacting');
                        treasureElement.classList.remove('treasure-being-interacted');
                        characterElement.style.transform = '';
                        treasureElement.style.filter = '';
                        resolve();
                    },
                    'currentTreasureAnimation'
                );
            });
        }, `Treasure Interaction (${characterIndex} → ${treasureIndex})`, this.ANIMATION_PRIORITIES.TREASURE);
    }

    /**
     * Bắt đầu animation boom explosion
     * @param {Array} affectedCardIndexes - Mảng các index của thẻ bị ảnh hưởng
     * @param {number} boomIndex - Index của boom card
     */
    startBoomExplosionAnimation(affectedCardIndexes, boomIndex) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const allElements = [];

                const boomElement = document.querySelector(`[data-index="${boomIndex}"]`);
                if (boomElement) {
                    allElements.push(boomElement);
                    boomElement.classList.add('boom-exploding');
                }

                affectedCardIndexes.forEach((cardIndex) => {
                    const cardElement = document.querySelector(`[data-index="${cardIndex}"]`);
                    if (cardElement) {
                        allElements.push(cardElement);
                        cardElement.classList.add('boom-exploding');
                    }
                });

                if (allElements.length === 0) {
                    resolve();
                    return;
                }

                this.createAnimationLoop(
                    (easedProgress) => {
                        allElements.forEach((element, index) => {
                            const delay = index * 50;
                            const delayedProgress = Math.max(0, easedProgress - (delay / this.ANIMATION_DURATIONS.BOOM));

                            const scale = 1 + (delayedProgress * 0.5);
                            element.style.transform = `scale(${scale})`;

                            const shakeIntensity = (1 - delayedProgress) * 8;
                            const shakeX = Math.sin(easedProgress * Math.PI * 12) * shakeIntensity;
                            const shakeY = Math.cos(easedProgress * Math.PI * 12) * shakeIntensity;
                            element.style.transform += ` translate(${shakeX}px, ${shakeY}px)`;
                        });
                    },
                    this.ANIMATION_DURATIONS.BOOM,
                    AnimationManager.EASING.easeOutBounce,
                    () => {
                        allElements.forEach(element => {
                            element.classList.remove('boom-exploding');
                            element.style.transform = '';
                        });
                        resolve();
                    },
                    'currentBoomAnimation'
                );
            });
        }, `Boom Explosion (${boomIndex})`, this.ANIMATION_PRIORITIES.BOOM);
    }

    /**
     * Bắt đầu animation chiến đấu
     * @param {number} characterIndex - Index của character
     * @param {number} monsterIndex - Index của monster
     * @param {number} damage - Damage gây ra
     */
    startCombatAnimation(characterIndex, monsterIndex, damage) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const characterElement = document.querySelector(`[data-index="${characterIndex}"]`);
                const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);

                if (!characterElement || !monsterElement) {
                    resolve();
                    return;
                }

                let damageShown = false;

                characterElement.classList.add('combat-attacking');
                monsterElement.classList.add('combat-defending');

                this.createAnimationLoop(
                    (easedProgress, progress) => {
                        const lungeDistance = easedProgress * 15;
                        characterElement.style.transform = `translateX(${lungeDistance}px)`;

                        const shakeIntensity = (1 - easedProgress) * 6;
                        const shakeX = Math.sin(progress * Math.PI * 10) * shakeIntensity;
                        const shakeY = Math.cos(progress * Math.PI * 10) * shakeIntensity;
                        monsterElement.style.transform = `translate(${shakeX}px, ${shakeY}px)`;

                        if (progress >= 0.5 && !damageShown) {
                            damageShown = true;
                            //this.createDamagePopup(monsterElement, damage);
                        }
                    },
                    this.ANIMATION_DURATIONS.COMBAT,
                    AnimationManager.EASING.easeInOutQuart,
                    () => {
                        characterElement.classList.remove('combat-attacking');
                        monsterElement.classList.remove('combat-defending');
                        characterElement.style.transform = '';
                        monsterElement.style.transform = '';
                        resolve();
                    },
                    'currentCombatAnimation'
                );
            });
        }, `Combat Animation (${characterIndex} → ${monsterIndex})`, this.ANIMATION_PRIORITIES.COMBAT);
    }

    /**
     * Render nhiều cards với hiệu ứng xuất hiện cùng lúc
     * @param {Array} newCardIndexes - Mảng các index của thẻ mới cần render
     */
    renderListCardsWithAppearEffect(newCardIndexes) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const grid = document.getElementById('cards-grid');
                const cardElements = [];

                newCardIndexes.forEach(index => {
                    let cardElement = document.querySelector(`[data-index="${index}"]`);

                    if (!cardElement) {
                        const card = this.cardManager.getCard(index);
                        if (card) {
                            // code này có thể ko bao giờ chạy 
                            console.warn('renderListCardsWithAppearEffect-----------')
                            cardElement = this.createOrUpdateCardElement(card, index, false);
                            cardElement.classList.add('appearing');

                            const targetPosition = Array.from(grid.children)[cardIndex];
                            if (targetPosition !== null) {
                                grid.insertBefore(cardElement, targetPosition);
                            } else {
                                grid.appendChild(cardElement);
                            }
                        }
                    } else {
                        const card = this.cardManager.getCard(index);
                        if (card) {
                            this.createOrUpdateCardElement(card, index, true, cardElement);
                            cardElement.classList.add('appearing');
                        }
                    }

                    if (cardElement) {
                        cardElements.push(cardElement);
                    }
                });

                if (cardElements.length === 0) {
                    resolve();
                    return;
                }

                setTimeout(() => {
                    cardElements.forEach(cardElement => {
                        cardElement.classList.remove('appearing');
                    });
                }, this.ANIMATION_DURATIONS.APPEAR);

                if (this.eventManager) {
                    newCardIndexes.forEach(index => {
                        // code này có thể ko bao giờ xảy ra 
                        //console.warn('setupCardEventsForIndex-----------')
                        //this.eventManager.setupCardEventsForIndex(index);
                    });
                }

                setTimeout(resolve, this.ANIMATION_DURATIONS.APPEAR);
            });
        }, `Render List Cards with Appear Effect (${newCardIndexes.join(', ')})`, this.ANIMATION_PRIORITIES.RENDER);
    }

    /**
     * Hiển thị popup khi HP thay đổi
     * @param {number} change - Lượng HP thay đổi (dương = heal, âm = damage)
     * @param {number} delay - Delay trước khi hiển thị (ms)
     */
    showHpChangePopup(change, delay = 0) {
        const characterElement = document.querySelector('.card.character');
        if (!characterElement) return;

        setTimeout(() => {
            // Tạo popup mới
            const popup = document.createElement('div');
            popup.className = 'hp-change-popup';

            if (change > 0) {
                // Heal
                popup.textContent = `+${change}`;
                popup.style.color = '#27ae60'; // Màu xanh lá
            } else {
                // Damage
                popup.textContent = `${change}`; // đã có dấu âm
                popup.style.color = '#e74c3c'; // Màu đỏ
            }

            popup.style.fontWeight = 'bold';
            popup.style.position = 'absolute';
            popup.style.zIndex = '1000';

            characterElement.appendChild(popup);

            // Tự động xóa sau 800ms
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 800);
        }, delay);
    }

    /**
     * Hiển thị 4 mũi tên 4 hướng cho character khi click
     * @param {HTMLElement} cardElement - DOM element của character card
     */
    showCharacterArrows(cardElement) {
        // Xóa các mũi tên cũ nếu có
        const existingArrows = cardElement.querySelectorAll('.character-arrow');
        existingArrows.forEach(arrow => arrow.remove());

        // Tạo 4 mũi tên 4 hướng
        const arrowConfigs = [
            { position: 'top-center', symbol: '➤' },
            { position: 'bottom-center', symbol: '➤' },
            { position: 'left-center', symbol: '➤' },
            { position: 'right-center', symbol: '➤' }
        ];

        arrowConfigs.forEach(({ position, symbol }) => {
            const arrowElement = document.createElement('div');
            arrowElement.className = `character-arrow ${position}`;
            arrowElement.innerHTML = symbol;
            cardElement.appendChild(arrowElement);
        });

        // Tự động ẩn mũi tên sau 1 giây
        setTimeout(() => {
            const arrows = cardElement.querySelectorAll('.character-arrow');
            arrows.forEach(arrow => arrow.remove());
        }, 1000);
    }

    /**
     * Xoay arrow của tất cả trap cards
     * Chức năng: Xoay arrow của các trap cards và cập nhật hiển thị
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
     * Bắt đầu animation thu nợ
     * @param {number} fatui1Index - Index của thẻ Fatui1
     * @param {Object} debtCollectionEffectResult - Kết quả từ debtCollectionEffect
     */
    startDebtCollectionAnimation(fatui1Index, debtCollectionEffectResult) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                // Lấy element của thẻ bị thu nợ
                const targetCardElement = document.querySelector(`[data-index="${debtCollectionEffectResult.targetIndex}"]`);
                // Lấy element của thẻ Fatui1
                const fatui1Element = document.querySelector(`[data-index="${fatui1Index}"]`);

                if (targetCardElement && fatui1Element && debtCollectionEffectResult.targetCardTakeDamageEffectResult) {
                    // Thêm class animation cho cả hai thẻ
                    fatui1Element.classList.add('debt-collection');
                    targetCardElement.classList.add('debt-collection');

                    // Tạo animation coin bay về phía Fatui1
                    this.createCoinFlyingAnimation(targetCardElement, fatui1Element, debtCollectionEffectResult.targetCardTakeDamageEffectResult.damage);

                    // Xóa class animation sau khi hoàn thành
                    setTimeout(() => {
                        fatui1Element.classList.remove('debt-collection');
                        targetCardElement.classList.remove('debt-collection');

                        // Cập nhật hiển thị thẻ
                        const targetCard = this.cardManager.getCard(debtCollectionEffectResult.targetIndex);
                        const fatui1Card = this.cardManager.getCard(fatui1Index);
                        if (targetCard) {
                            this.createOrUpdateCardElement(targetCard, debtCollectionEffectResult.targetIndex, true, targetCardElement);
                            this.createOrUpdateCardElement(fatui1Card, fatui1Index, true, fatui1Element);
                        }

                        // Hiển thị popup damage
                        this.createDamagePopup(targetCardElement, debtCollectionEffectResult.targetCardTakeDamageEffectResult.damage);

                        resolve();
                    }, 500); // Thời gian animation
                } else {
                    resolve();
                }
            });
        }, `Debt Collection Animation (${fatui1Index} → ${debtCollectionEffectResult.targetIndex})`, this.ANIMATION_PRIORITIES.TRAP);
    }

    /**
     * Tạo animation coin bay về phía Fatui1
     * @param {HTMLElement} fromElement - Element nguồn (coin)
     * @param {HTMLElement} toElement - Element đích (Fatui1)
     * @param {number} damage - Số lượng damage
     */
    createCoinFlyingAnimation(fromElement, toElement, damage) {
        const coinCount = damage; // Tối đa 3 coin

        for (let i = 0; i < coinCount; i++) {
            setTimeout(() => {
                this.createSingleCoinAnimation(fromElement, toElement, i);
            }, i * 200); // Delay giữa các coin
        }
    }

    /**
     * Tạo animation cho một coin
     * @param {HTMLElement} fromElement - Element nguồn
     * @param {HTMLElement} toElement - Element đích
     * @param {number} index - Index của coin
     */
    createSingleCoinAnimation(fromElement, toElement, index) {
        // Tạo element coin
        const coin = document.createElement('div');
        coin.className = 'flying-coin';
        coin.textContent = '🪙';
        coin.style.position = 'absolute';
        coin.style.zIndex = '1000';
        coin.style.fontSize = '30px';
        coin.style.pointerEvents = 'none';


        // Lấy vị trí của các element
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        const cardsGrid = document.getElementById('cards-grid');
        const gridRect = cardsGrid ? cardsGrid.getBoundingClientRect() : { left: 0, top: 0 };

        // Vị trí bắt đầu (giữa thẻ nguồn) - trừ offset của cards-grid
        const startX = fromRect.left + fromRect.width / 2 - gridRect.left;
        const startY = fromRect.top + fromRect.height / 2 - gridRect.top;

        // Vị trí kết thúc (giữa thẻ đích) - trừ offset của cards-grid
        const endX = toRect.left + toRect.width / 2 - gridRect.left;
        const endY = toRect.top + toRect.height / 2 - gridRect.top;

        // Thêm vào cards-grid
        if (cardsGrid) {
            cardsGrid.appendChild(coin);
        } else {
            // Fallback nếu không tìm thấy cards-grid
            document.body.appendChild(coin);
        }

        // Animation với RAF
        let startTime = null;
        const duration = 800; // 800ms

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            // Tính vị trí hiện tại theo đường thẳng
            const currentX = startX + (endX - startX) * easeOut;
            const currentY = startY + (endY - startY) * easeOut;

            // Cập nhật vị trí
            coin.style.left = `${currentX - 20}px`;
            coin.style.top = `${currentY - 20}px`;

            // Xoay coin
            coin.style.transform = `rotate(${progress * 360}deg)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Hoàn thành animation
                if (cardsGrid && cardsGrid.contains(coin)) {
                    cardsGrid.removeChild(coin);
                } else if (document.body.contains(coin)) {
                    document.body.removeChild(coin);
                }
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Cập nhật hiển thị cho một thẻ cụ thể tại vị trí index
     * @param {number} index - Index của thẻ cần cập nhật
     */
    updateCardStatus(index) {
        const card = this.cardManager.getCard(index);
        if (!card) {
            console.warn(`🎬 Card not found at index ${index}`);
            return;
        }

        const existingElement = document.querySelector(`[data-index="${index}"]`);
        
        if (existingElement) {
            // Cập nhật element hiện có
            this.createOrUpdateCardElement(card, index, true, existingElement);

            
        } else {
            console.warn(`🎬 Card element not found at index ${index}`);
        }

        // Setup events nếu cần
        if (this.eventManager) {
            // Có thể cần setup lại events cho thẻ này
            // this.eventManager.setupCardEventsForIndex(index);
        }
    }


    /**
     * Tạo hiệu ứng nổi cho healing potion
     * Hiệu ứng: Ảnh xuất hiện ở giữa game-main, từ 20px tăng lên 300px rồi biến mất trong 0.5s
     */
    startUseItemEffectAnimation(image) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                // Tìm container game-main
                const gameMain = document.querySelector('.game-main');
                if (!gameMain) {
                    console.warn('🎬 Game main container not found');
                    resolve();
                    return;
                }

                // Tạo element ảnh healing potion
                const potionImage = document.createElement('img');
                potionImage.src = image;
                potionImage.style.cssText = `
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 20px;
                    height: 20px;
                    opacity: 0.8;
                    z-index: 1000;
                    pointer-events: none;
                    transition: none;
                `;

                // Thêm ảnh vào game-main
                gameMain.appendChild(potionImage);

                // Tạo animation với requestAnimationFrame
                const startTime = performance.now();
                const duration = 500; // 0.5s
                const startSize = 20;
                const endSize = 300;

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function để tạo hiệu ứng mượt mà
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    
                    // Tính kích thước hiện tại
                    const currentSize = startSize + (endSize - startSize) * easeOut;
                    
                    // Cập nhật kích thước và opacity
                    potionImage.style.width = `${currentSize}px`;
                    potionImage.style.height = `${currentSize}px`;
                    potionImage.style.opacity = 0.8 * (1 - progress);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Hoàn thành animation, xóa ảnh
                        if (potionImage.parentNode) {
                            potionImage.parentNode.removeChild(potionImage);
                        }
                        resolve();
                    }
                };

                // Bắt đầu animation
                requestAnimationFrame(animate);
            });
        }, 'Healing Potion Float Effect', 3); // Priority 3 (cao hơn các animation thông thường)
    }

}