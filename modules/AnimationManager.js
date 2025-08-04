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
        
        // ===== ANIMATION QUEUE SYSTEM =====
        this.animationQueue = []; // Hàng đợi các animation
        this.isProcessingQueue = false; // Trạng thái đang xử lý hàng đợi
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
            id: Date.now() + Math.random(), // ID duy nhất
            function: animationFunction,
            name: animationName,
            priority: priority,
            timestamp: Date.now()
        };
        
        // Thêm vào hàng đợi và sắp xếp theo priority
        this.animationQueue.push(animationTask);
        this.animationQueue.sort((a, b) => a.priority - b.priority);
        
        // Bắt đầu xử lý hàng đợi nếu chưa đang xử lý
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
                // Thực hiện animation
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
                // Bắt đầu animation tracking
                this.startAnimation();
                
                // Thực hiện animation function
                const result = animationTask.function();
                
                // Nếu animation function trả về Promise
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
                    // Nếu animation function không trả về Promise, đợi một khoảng thời gian
                    setTimeout(() => {
                        this.endAnimation();
                        resolve();
                    }, 100); // Default delay
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
     */
    getQueueInfo() {
        return {
            queueSize: this.animationQueue.length,
            isProcessing: this.isProcessingQueue,
            isAnimating: this.isAnimating,
            animationCount: this.animationCount,
            queueItems: this.animationQueue.map(item => ({
                name: item.name,
                priority: item.priority,
                timestamp: item.timestamp
            }))
        };
    }

    // ===== HELPER FUNCTIONS FOR ANIMATION QUEUE =====

    /**
     * Thêm animation đơn giản vào hàng đợi
     * @param {Function} animationFunction - Hàm animation
     * @param {string} name - Tên animation
     * @param {number} priority - Độ ưu tiên
     */
    queueSimpleAnimation(animationFunction, name, priority = 5) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                animationFunction();
                setTimeout(resolve, 100); // Default delay
            });
        }, name, priority);
    }

    /**
     * Thêm animation với timeout vào hàng đợi
     * @param {Function} animationFunction - Hàm animation
     * @param {string} name - Tên animation
     * @param {number} timeout - Thời gian chờ (ms)
     * @param {number} priority - Độ ưu tiên
     */
    queueTimedAnimation(animationFunction, name, timeout = 600, priority = 5) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                animationFunction();
                setTimeout(resolve, timeout);
            });
        }, name, priority);
    }

    /**
     * Thêm animation với callback vào hàng đợi
     * @param {Function} animationFunction - Hàm animation
     * @param {string} name - Tên animation
     * @param {Function} callback - Callback sau khi hoàn thành
     * @param {number} priority - Độ ưu tiên
     */
    queueCallbackAnimation(animationFunction, name, callback = null, priority = 5) {
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                animationFunction();
                if (callback) {
                    callback();
                }
                setTimeout(resolve, 100);
            });
        }, name, priority);
    }

    // ===== CÁC HÀM ANIMATION CƠ BẢN =====

    /**
     * Thêm hiệu ứng flip cho 2 thẻ khi đổi vị trí
     * @param {number} index1 - Index của thẻ thứ nhất
     * @param {number} index2 - Index của thẻ thứ hai
     * @param {Function} callback - Callback được gọi sau khi animation hoàn thành
     */
    flipCards(index1, index2, callback = null) {
        // Thêm vào hàng đợi với priority cao (ưu tiên flip cards)
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const card1Element = document.querySelector(`[data-index="${index1}"]`);
                const card2Element = document.querySelector(`[data-index="${index2}"]`);
                
                if (card1Element && card2Element) {
                    // Thêm class flip cho cả 2 thẻ
                    card1Element.classList.add('flipping');
                    card2Element.classList.add('flipping');
                    
                    // Xóa class và resolve sau khi animation hoàn thành
                    setTimeout(() => {
                        card1Element.classList.remove('flipping');
                        card2Element.classList.remove('flipping');
                        
                        if (callback) {
                            callback();
                        }
                        resolve();
                    }, 600);
                } else {
                    if (callback) {
                        callback();
                    }
                    resolve();
                }
            });
        }, `Flip Cards (${index1} ↔ ${index2})`, 2);
    }


    // ===== CÁC HÀM ANIMATION ĐẶC BIỆT =====
    
    /**
     * Hiệu ứng khi trap được kích hoạt
     * @param {number} trapIndex - Index của trap card
     * @param {Card} trapCard - Trap card instance
     * @param {CardManager} cardManager - Manager quản lý thẻ
     */
    startTrapActivationAnimation(trapIndex, trapCard, cardManager) {
        // Thêm vào hàng đợi với priority trung bình
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const trapElement = document.querySelector(`[data-index="${trapIndex}"]`);
                if (!trapElement) {
                    resolve();
                    return;
                }
                
                // Thêm class animation cho trap
                trapElement.classList.add('trap-activating');
                
                // Tìm các thẻ liền kề bị chỉ bởi arrow
                const adjacentTargets = this.findAdjacentTargets(trapIndex, trapCard, cardManager);
                
                // Thêm animation cho các thẻ bị chỉ
                adjacentTargets.forEach(targetIndex => {
                    const targetElement = document.querySelector(`[data-index="${targetIndex}"]`);
                    if (targetElement) {
                        targetElement.classList.add('trap-targeted');
                        
                        const targetCard = cardManager.getCard(targetIndex);
                        if (targetCard) {
                            setTimeout(() => {
                                this.processTrapDamageToCard(targetCard, targetElement, trapCard.damage, cardManager, targetIndex);
                            }, 300);
                        }
                    }
                });
                
                // Xóa class animation và resolve
                setTimeout(() => {
                    trapElement.classList.remove('trap-activating');
                    adjacentTargets.forEach(targetIndex => {
                        const targetElement = document.querySelector(`[data-index="${targetIndex}"]`);
                        if (targetElement) {
                            targetElement.classList.remove('trap-targeted');
                        }
                    });
                    
                    // Setup lại events sau khi animation hoàn thành
                    setTimeout(() => {
                        if (this.eventManager) {
                            this.eventManager.setupCardEvents();
                        }
                    }, 100);
                    
                    resolve();
                }, 600);
            });
        }, `Trap Activation (${trapIndex})`, 4);
    }
    
    /**
     * Xử lý damage cho thẻ bị chỉ bởi trap (giống boom class)
     * @param {Card} targetCard - Thẻ bị chỉ
     * @param {HTMLElement} targetElement - Element của thẻ
     * @param {number} damage - Lượng damage
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @param {number} targetIndex - Index của thẻ
     */
    processTrapDamageToCard(targetCard, targetElement, damage, cardManager, targetIndex) {
        // Tạo damage popup
        //this.createDamagePopup(targetElement, damage);
        
        // Xử lý theo loại thẻ (giống boom class)
        if (targetCard.type === 'character') {
            // Character nhận damage
            this.characterManager.damageCharacterHP(damage);
            // console.log(`🎯 Character nhận ${damage} damage từ trap`);
            // Game over được xử lý trong damageCharacterHP khi HP = 0
        } else if (targetCard.type === 'enemy' && targetCard.hp !== undefined && targetCard.hp > 0) {
            // Enemy nhận damage
            const originalHP = targetCard.hp;
            // console.log(`🎯 Enemy ${targetCard.nameId} tại index ${targetIndex}: HP ban đầu = ${originalHP}, damage = ${damage}`);
            targetCard.hp -= damage;
            console.log(`🎯 Enemy ${targetCard.nameId} sau damage: HP = ${targetCard.hp}`);
            // Tạo damage popup ngay lập tức
            this.createDamagePopup(targetElement, damage);
            // Cập nhật hiển thị enemy
            this.updateMonsterDisplay(targetIndex);
            
            if (targetCard.hp <= 0) {
                targetCard.hp = 0;
                // console.log(`🎯 Enemy ${targetCard.nameId} HP = 0, sẽ chết!`);
                this.handleEnemyDeathByTrap(targetIndex, targetCard, cardManager);
            } else {
                // HP chưa về 0, chạy attackByWeaponEffect nếu có
                // if (typeof targetCard.attackByWeaponEffect === 'function') {
                //     // console.log(`🎯 Enemy ${targetCard.nameId} bị damage bởi trap, chạy attackByWeaponEffect`);
                //     targetCard.attackByWeaponEffect(this.characterManager, this.eventManager ? this.eventManager.gameState : null);
                // }
            }
        } else if (targetCard.type === 'food' && targetCard.heal !== undefined && targetCard.heal > 0) {
            // Food nhận damage
            const originalHeal = targetCard.heal;

            targetCard.heal -= damage;
            this.createDamagePopup(targetElement, damage);
            if (targetCard.nameId === 'poison') {
                targetCard.poisonDuration -= damage;
            }
            // console.log(`🎯 Food ${targetCard.nameId} sau damage: heal = ${targetCard.heal}`);
            
            if (targetCard.heal <= 0) {
                targetCard.heal = 0;
                if (targetCard.nameId === 'poison') {
                    targetCard.poisonDuration = 0;
                }
                // console.log(`🎯 Food ${targetCard.nameId} heal = 0, tạo thẻ void!`);
                this.createVoidCard(targetIndex, cardManager);
            }
        } else if (targetCard.type === 'coin' && targetCard.score !== undefined && targetCard.score > 0) {
            // Coin nhận damage
            const originalScore = targetCard.score;
            // console.log(`🎯 Coin ${targetCard.nameId} tại index ${targetIndex}: score ban đầu = ${originalScore}, damage = ${damage}`);
            targetCard.score -= damage;
            // console.log(`🎯 Coin ${targetCard.nameId} sau damage: score = ${targetCard.score}`);
            this.createDamagePopup(targetElement, damage);

            if (targetCard.score <= 0) {
                targetCard.score = 0;
                // console.log(`🎯 Coin ${targetCard.nameId} score = 0, tạo thẻ void!`);
                this.createVoidCard(targetIndex, cardManager);
            }
        } else if ((targetCard.type === 'weapon') && targetCard.durability !== undefined && targetCard.durability > 0) {
            // Weapon nhận damage
            const originalDurability = targetCard.durability;
            // console.log(`🎯 Weapon ${targetCard.nameId} tại index ${targetIndex}: durability ban đầu = ${originalDurability}, damage = ${damage}`);
            targetCard.durability -= damage;
            // console.log(`🎯 Weapon ${targetCard.nameId} sau damage: durability = ${targetCard.durability}`);
            this.createDamagePopup(targetElement, damage);

            if (targetCard.durability <= 0) {
                targetCard.durability = 0;
                // console.log(`🎯 Weapon ${targetCard.nameId} durability = 0, tạo thẻ void!`);
                this.createVoidCard(targetIndex, cardManager);
            }
        } else if (targetCard.type === 'boom') {
            // Boom nhận damage - kích hoạt ngay lập tức
            // console.log(`🎯 Boom nhận ${damage} damage từ trap, kích hoạt ngay lập tức`);
            targetCard.damage -= damage;
            //targetCard.damage = Math.max(0, targetCard.damage - damage);
            this.createDamagePopup(targetElement, damage);

            if (targetCard.damage <= 0) {
                targetCard.damage = 0;
                // console.log(`🎯 Trap damage = 0, tạo void thay thế!`);
                this.createCoinFromTrap(targetIndex, cardManager);
            } else {
                // Cập nhật hiển thị damage của boom
                this.updateBoomDisplay(targetIndex);
            }
        } else if (targetCard.nameId === 'trap') {
            // Trap nhận damage - giảm damage và tạo void khi damage = 0
            //const originalDamage = targetCard.damage;
            // console.log(`🎯 Trap nhận ${damage} damage từ trap, damage hiện tại: ${targetCard.damage}`);
            targetCard.damage -= damage;
            //targetCard.damage = Math.max(0, targetCard.damage - damage);
            this.createDamagePopup(targetElement, damage);

            if (targetCard.damage <= 0) {
                targetCard.damage = 0;
                // console.log(`🎯 Trap damage = 0, tạo void thay thế!`);
                this.createCoinFromTrap(targetIndex, cardManager);
            } else {
                // Cập nhật hiển thị damage của trap
                this.updateTrapDamageDisplay(targetIndex);
            }
        } else {
            // Các thẻ khác chỉ hiển thị damage popup
            // console.log(`🎯 Thẻ ${targetCard.type} nhận ${damage} damage từ trap`);
        }
    }
    
    /**
     * Xử lý khi enemy chết do trap damage (giống boom class)
     * @param {number} enemyIndex - Index của enemy
     * @param {Card} enemyCard - Enemy card
     * @param {CardManager} cardManager - Manager quản lý thẻ
     */
    handleEnemyDeathByTrap(enemyIndex, enemyCard, cardManager) {
        // Thêm hiệu ứng chết cho enemy
        const enemyElement = document.querySelector(`[data-index="${enemyIndex}"]`);
        if (enemyElement) {
            enemyElement.classList.add('monster-dying');
        }
        
        // Chạy killByWeaponEffect nếu có (giống boom class)
        if (typeof enemyCard.killByWeaponEffect === 'function') {
            // console.log(`🎯 Enemy ${enemyCard.nameId} bị giết bởi trap, chạy killByWeaponEffect`);
            // Lazy evaluation: chỉ truyền null cho gameState vì không được sử dụng
            const killResult = enemyCard.killByWeaponEffect(this.characterManager, null);
            // console.log(`🎯 Kill result:`, killResult);
            
            // Xử lý kết quả từ killByWeaponEffect
            if (killResult && killResult.reward) {
                setTimeout(() => {
                    if (killResult.reward.type === 'coin') {
                        // Tạo coin mặc định
                        const coinCard = cardManager.cardFactory.createDynamicCoin(this.characterManager);
                        coinCard.id = enemyIndex;
                        coinCard.position = { 
                            row: Math.floor(enemyIndex / 3), 
                            col: enemyIndex % 3 
                        };
                        // console.log(`🎯 Tạo coin từ killByWeaponEffect: ${coinCard.nameId} tại index ${enemyIndex}`);
                        cardManager.updateCard(enemyIndex, coinCard);
                        this.renderCardsWithAppearEffect(enemyIndex);
                        
                        // Setup lại events cho thẻ mới với delay
                        setTimeout(() => {
                            if (this.eventManager) {
                                // console.log(`🎯 Setup events cho coin mới tại index ${enemyIndex}`);
                                this.eventManager.setupCardEvents();
                            }
                        }, 200);
                    } else if (killResult.reward.type === 'food3') {
                        // Tạo Food3 card
                        const foodCard = cardManager.cardFactory.createCard('Food3');
                        foodCard.id = enemyIndex;
                        foodCard.position = { 
                            row: Math.floor(enemyIndex / 3), 
                            col: enemyIndex % 3 
                        };
                        // console.log(`🎯 Tạo Food3 từ killByWeaponEffect: ${foodCard.nameId} tại index ${enemyIndex}`);
                        cardManager.updateCard(enemyIndex, foodCard);
                        this.renderCardsWithAppearEffect(enemyIndex);
                        
                        // Setup lại events cho thẻ mới với delay
                        setTimeout(() => {
                            if (this.eventManager) {
                                // console.log(`🎯 Setup events cho food mới tại index ${enemyIndex}`);
                                this.eventManager.setupCardEvents();
                            }
                        }, 200);
                    } else if (killResult.reward.type === 'abysslector') {
                        // Tạo AbyssLector card từ reward
                        const abyssLectorCard = killResult.reward.card;
                        abyssLectorCard.id = enemyIndex;
                        abyssLectorCard.position = { 
                            row: Math.floor(enemyIndex / 3), 
                            col: enemyIndex % 3 
                        };
                        // console.log(`🎯 Tạo AbyssLector từ killByWeaponEffect: ${abyssLectorCard.nameId} tại index ${enemyIndex}`);
                        cardManager.updateCard(enemyIndex, abyssLectorCard);
                        this.renderCardsWithAppearEffect(enemyIndex);
                        
                        // Setup lại events cho thẻ mới với delay
                        setTimeout(() => {
                            if (this.eventManager) {
                                // console.log(`🎯 Setup events cho abysslector mới tại index ${enemyIndex}`);
                                this.eventManager.setupCardEvents();
                            }
                        }, 200);
                    } else {
                        // Xử lý các loại reward khác chưa được định nghĩa
                        // console.log(`🎯 Reward type chưa được xử lý: ${killResult.reward.type}`);
                        // Tạo coin mặc định cho các loại reward chưa xử lý
                        const coinCard = cardManager.cardFactory.createDynamicCoin(this.characterManager);
                        coinCard.id = enemyIndex;
                        coinCard.position = { 
                            row: Math.floor(enemyIndex / 3), 
                            col: enemyIndex % 3 
                        };
                        // console.log(`🎯 Tạo coin mặc định cho reward type chưa xử lý: ${coinCard.nameId} tại index ${enemyIndex}`);
                        cardManager.updateCard(enemyIndex, coinCard);
                        this.renderCardsWithAppearEffect(enemyIndex);
                        
                        // Setup lại events cho thẻ mới với delay
                        setTimeout(() => {
                            if (this.eventManager) {
                                // console.log(`🎯 Setup events cho coin mặc định tại index ${enemyIndex}`);
                                this.eventManager.setupCardEvents();
                            }
                        }, 200);
                    }
                }, 600);
            } else {
                // Tạo coin mặc định nếu không có reward
                setTimeout(() => {
                    const coinCard = cardManager.cardFactory.createDynamicCoin(this.characterManager);
                    coinCard.id = enemyIndex;
                    coinCard.position = { 
                        row: Math.floor(enemyIndex / 3), 
                        col: enemyIndex % 3 
                    };
                    // console.log(`🎯 Tạo coin mặc định: ${coinCard.nameId} tại index ${enemyIndex}`);
                    cardManager.updateCard(enemyIndex, coinCard);
                    this.renderCardsWithAppearEffect(enemyIndex);
                    
                    // Setup lại events cho thẻ mới với delay
                    setTimeout(() => {
                        if (this.eventManager) {
                            // console.log(`🎯 Setup events cho coin mặc định tại index ${enemyIndex}`);
                            this.eventManager.setupCardEvents();
                        }
                    }, 200);
                }, 600);
            }
        } else {
            // Tạo coin theo mặc định nếu không có killByWeaponEffect
            // console.log(`🎯 Enemy ${enemyCard.nameId} bị giết bởi trap, tạo coin mặc định`);
            setTimeout(() => {
                const coinCard = cardManager.cardFactory.createDynamicCoin(this.characterManager);
                coinCard.id = enemyIndex;
                coinCard.position = { 
                    row: Math.floor(enemyIndex / 3), 
                    col: enemyIndex % 3 
                };
                // console.log(`🎯 Tạo coin mới: ${coinCard.nameId} tại index ${enemyIndex}`);
                cardManager.updateCard(enemyIndex, coinCard);
                this.renderCardsWithAppearEffect(enemyIndex);
                
                // Setup lại events cho thẻ mới với delay
                setTimeout(() => {
                    if (this.eventManager) {
                        // console.log(`🎯 Setup events cho coin mới tại index ${enemyIndex}`);
                        this.eventManager.setupCardEvents();
                    }
                }, 200);
            }, 600);
        }
    }
    
    /**
     * Tạo thẻ void thay thế thẻ bị hủy
     * @param {number} cardIndex - Index của thẻ
     * @param {CardManager} cardManager - Manager quản lý thẻ
     */
    createVoidCard(cardIndex, cardManager) {
        const voidCard = cardManager.cardFactory.createVoid();
        voidCard.id = cardIndex;
        voidCard.position = { 
            row: Math.floor(cardIndex / 3), 
            col: cardIndex % 3 
        };
        // console.log(`🎯 Tạo void thay thế: ${voidCard.nameId} tại index ${cardIndex}`);
        cardManager.updateCard(cardIndex, voidCard);
        this.renderCardsWithAppearEffect(cardIndex);
        // Events được setup trong renderCardsWithAppearEffect
    }
    
    /**
     * Tạo coin từ trap khi damage = 0
     * @param {number} trapIndex - Index của trap
     * @param {CardManager} cardManager - Manager quản lý thẻ
     */
    createCoinFromTrap(trapIndex, cardManager) {
        const coinCard = cardManager.cardFactory.createDynamicCoin(this.characterManager);
        coinCard.id = trapIndex;
        coinCard.position = { 
            row: Math.floor(trapIndex / 3), 
            col: trapIndex % 3 
        };
        // console.log(`🎯 Tạo coin từ trap: ${coinCard.nameId} tại index ${trapIndex}`);
        cardManager.updateCard(trapIndex, coinCard);
        this.renderCardsWithAppearEffect(trapIndex);
        // Events được setup trong renderCardsWithAppearEffect
    }
    
    /**
     * Cập nhật hiển thị damage của trap
     * @param {number} trapIndex - Index của trap
     */
    updateTrapDamageDisplay(trapIndex) {
        const trapElement = document.querySelector(`[data-index="${trapIndex}"]`);
        if (trapElement) {
            const damageDisplay = trapElement.querySelector('.damage-display');
            if (damageDisplay) {
                const trapCard = this.cardManager.getCard(trapIndex);
                if (trapCard && trapCard.damage !== undefined) {
                    damageDisplay.textContent = trapCard.damage;
                    // console.log(`🎯 Cập nhật trap damage display: ${trapCard.damage}`);
                }
            }
        }
    }
    

    
    /**
     * Tìm các thẻ liền kề bị chỉ bởi arrow của trap
     * @param {number} trapIndex - Index của trap
     * @param {Card} trapCard - Trap card instance
     * @param {CardManager} cardManager - Manager quản lý thẻ
     * @returns {Array} Mảng index của các thẻ bị chỉ
     */
    findAdjacentTargets(trapIndex, trapCard, cardManager) {
        const targets = [];
        const trapPos = { row: Math.floor(trapIndex / 3), col: trapIndex % 3 };
        
        // Kiểm tra từng hướng arrow
        if (trapCard.arrowTop && trapPos.row > 0) {
            const targetIndex = (trapPos.row - 1) * 3 + trapPos.col;
            if (cardManager.getCard(targetIndex)) {
                targets.push(targetIndex);
            }
        }
        if (trapCard.arrowBottom && trapPos.row < 2) {
            const targetIndex = (trapPos.row + 1) * 3 + trapPos.col;
            if (cardManager.getCard(targetIndex)) {
                targets.push(targetIndex);
            }
        }
        if (trapCard.arrowLeft && trapPos.col > 0) {
            const targetIndex = trapPos.row * 3 + (trapPos.col - 1);
            if (cardManager.getCard(targetIndex)) {
                targets.push(targetIndex);
            }
        }
        if (trapCard.arrowRight && trapPos.col < 2) {
            const targetIndex = trapPos.row * 3 + (trapPos.col + 1);
            if (cardManager.getCard(targetIndex)) {
                targets.push(targetIndex);
            }
        }
        
        return targets;
    }



    /**
     * Render tất cả cards lên màn hình (không có effect đặc biệt)
     * Sử dụng khi khởi tạo game hoặc reset game
     */
    renderCards() {
        // ===== RESET ANIMATION STATE =====
        this.animationCount = 0;
        this.isAnimating = false;
        // console.log(`🎬 Reset animation state for new game`);
        
        // ===== CLEAR GRID =====
        const grid = document.getElementById('cards-grid');
        grid.innerHTML = ''; // Xóa tất cả cards cũ
        
        // ===== RENDER EACH CARD =====
        this.cardManager.getAllCards().forEach((card, index) => {
            if (card) {
                const cardElement = this.createOrUpdateCardElement(card, index, false);
                grid.appendChild(cardElement);
            }
        });
    }

    /**
     * Cập nhật toàn bộ grid một cách an toàn
     * Giữ nguyên events và tránh mất thẻ
     */
    updateEntireGrid() {
        const grid = document.getElementById('cards-grid');
        if (!grid) {
            return;
        }

        // ===== LẤY DỮ LIỆU CARDS HIỆN TẠI =====
        const allCards = this.cardManager.getAllCards();
        
        // ===== CẬP NHẬT TỪNG CARD ELEMENT =====
        allCards.forEach((card, index) => {
            if (card) {
                const existingElement = document.querySelector(`[data-index="${index}"]`);
                
                                        if (existingElement) {
                            // Cập nhật card element hiện có
                            this.createOrUpdateCardElement(card, index, true, existingElement);
                        } else {
                            // Tạo card element mới nếu chưa có
                            const newElement = this.createOrUpdateCardElement(card, index, false);
                    
                    // Tìm vị trí đúng trong grid
                    const targetPosition = this.getGridPosition(index);
                    if (targetPosition !== null) {
                        grid.insertBefore(newElement, targetPosition);
                    } else {
                        grid.appendChild(newElement);
                    }
                }
            }
        });

        // ===== SETUP EVENTS CHỈ CHO CARD MỚI (NẾU CÓ) =====
        // Events không bị xóa khi cập nhật card content, chỉ cần setup cho card mới
        if (this.eventManager) {
            // Chỉ setup events cho card mới được tạo
            allCards.forEach((card, index) => {
                if (card) {
                    const existingElement = document.querySelector(`[data-index="${index}"]`);
                    // Chỉ setup cho card mới (không có events) hoặc card được tạo lại
                    if (existingElement && !existingElement._clickHandler) {
                        this.eventManager.setupCardEventsForIndex(index);
                    }
                }
            });
        }
    }



    /**
     * Render card với hiệu ứng xuất hiện (có thể cập nhật toàn bộ grid nếu cần)
     * @param {number} newCardIndex - Index của thẻ cần render
     */
    renderCardsWithAppearEffect(newCardIndex) {
        // Thêm vào hàng đợi với priority thấp (render cards)
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                // ===== KIỂM TRA XEM CÓ CẦN CẬP NHẬT TOÀN BỘ GRID KHÔNG =====
                // const grid = document.getElementById('cards-grid');
                // const allCards = this.cardManager.getAllCards();
                // const gridChildren = Array.from(grid.children);
                
                // // Nếu số lượng cards trong data khác với số lượng elements trong grid
                // const dataCardCount = allCards.filter(card => card !== null).length;
                // const gridElementCount = gridChildren.length;
                
                // if (dataCardCount !== gridElementCount) {
                //     // Cập nhật toàn bộ grid nếu có sự không đồng bộ
                //     // Gọi trực tiếp thay vì qua queue để tránh deadlock
                //     this.updateEntireGrid();
                //     resolve();
                //     return;
                // }
                
                // ===== LẤY CARD CẦN CẬP NHẬT =====
                const card = this.cardManager.getCard(newCardIndex);
                if (!card) {
                    resolve();
                    return;
                }
                
                // ===== TÌM CARD ELEMENT HIỆN TẠI =====
                const existingCardElement = document.querySelector(`[data-index="${newCardIndex}"]`);
                
                if (existingCardElement) {
                    // ===== CẬP NHẬT CARD ELEMENT HIỆN CÓ =====
                    this.createOrUpdateCardElement(card, newCardIndex, true, existingCardElement);
                    
                    // ===== THÊM HIỆU ỨNG APPEARING =====
                    existingCardElement.classList.add('appearing');
                    
                    // ===== XÓA CLASS SAU KHI ANIMATION HOÀN THÀNH =====
                    setTimeout(() => {
                        existingCardElement.classList.remove('appearing');
                    }, 200); // Giảm từ 500ms xuống 200ms để game nhanh hơn
                } else {
                    // ===== TẠO CARD ELEMENT MỚI NẾU CHƯA CÓ =====
                    const grid = document.getElementById('cards-grid');
                    const cardElement = this.createOrUpdateCardElement(card, newCardIndex, false);
                    cardElement.classList.add('appearing');
                    
                    // Tìm vị trí đúng trong grid
                    const targetPosition = this.getGridPosition(newCardIndex);
                    if (targetPosition !== null) {
                        grid.insertBefore(cardElement, targetPosition);
                    } else {
                        grid.appendChild(cardElement);
                    }
                    
                    // ===== XÓA CLASS SAU KHI ANIMATION HOÀN THÀNH =====
                    setTimeout(() => {
                        cardElement.classList.remove('appearing');
                    }, 200); // Giảm từ 500ms xuống 200ms để game nhanh hơn
                }
                
                // ===== SETUP EVENTS CHO CARD MỚI =====
                if (this.eventManager) {
                    this.eventManager.setupCardEventsForIndex(newCardIndex);
                }
                
                // Resolve sau khi appear effect hoàn thành
                setTimeout(resolve, 200); // Giảm từ 500ms xuống 200ms để game nhanh hơn
            });
        }, `Render Cards with Appear Effect (${newCardIndex})`, 7);
    }

    /**
     * Render nhiều cards với hiệu ứng xuất hiện cùng lúc
     * @param {Array} newCardIndexes - Mảng các index của thẻ mới cần render
     */
    renderListCardsWithAppearEffect(newCardIndexes) {
        // Thêm vào hàng đợi với priority thấp (render effect)
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const grid = document.getElementById('cards-grid');
                
                // ===== LẤY TẤT CẢ CARD ELEMENTS VÀ TẠO MỚI NẾU CẦN =====
                const cardElements = [];
                newCardIndexes.forEach(index => {
                    let cardElement = document.querySelector(`[data-index="${index}"]`);
                    
                    if (!cardElement) {
                        // ===== TẠO CARD ELEMENT MỚI NẾU CHƯA CÓ =====
                        const card = this.cardManager.getCard(index);
                        if (card) {
                            cardElement = this.createOrUpdateCardElement(card, index, false);
                            cardElement.classList.add('appearing');
                            
                            // Tìm vị trí đúng trong grid
                            const targetPosition = this.getGridPosition(index);
                            if (targetPosition !== null) {
                                grid.insertBefore(cardElement, targetPosition);
                            } else {
                                grid.appendChild(cardElement);
                            }
                        }
                    } else {
                        // ===== CẬP NHẬT CARD ELEMENT HIỆN CÓ =====
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
                
                // ===== XÓA CLASS SAU KHI ANIMATION HOÀN THÀNH =====
                setTimeout(() => {
                    cardElements.forEach(cardElement => {
                        cardElement.classList.remove('appearing');
                    });
                }, 200); // Giảm từ 500ms xuống 200ms để game nhanh hơn
                
                // ===== SETUP EVENTS CHO CÁC CARD MỚI =====
                if (this.eventManager) {
                    newCardIndexes.forEach(index => {
                        this.eventManager.setupCardEventsForIndex(index);
                    });
                }
                
                // Resolve sau khi appear effect hoàn thành
                setTimeout(resolve, 200); // Giảm từ 500ms xuống 200ms để game nhanh hơn
            });
        }, `Render List Cards with Appear Effect (${newCardIndexes.join(', ')})`, 3);
    }

    /**
     * Tạo hoặc cập nhật card element
     * @param {Object} card - Dữ liệu card
     * @param {number} index - Index của card trong grid
     * @param {boolean} isUpdate - True nếu cập nhật element hiện có, False nếu tạo mới
     * @param {HTMLElement} existingElement - Element hiện có (chỉ cần khi isUpdate = true)
     * @returns {HTMLElement} Card element đã được tạo hoặc cập nhật
     */
    createOrUpdateCardElement(card, index, isUpdate = false, existingElement = null) {
        let cardElement;
        
        if (isUpdate && existingElement) {
            // ===== CẬP NHẬT ELEMENT HIỆN CÓ =====
            cardElement = existingElement;
            
            // ===== CẬP NHẬT CARD IMAGE =====
            const imageElement = cardElement.querySelector('.card-image');
            if (imageElement) {
                imageElement.src = card.image;
                imageElement.alt = card.type;
            }
            
            // ===== XÓA TẤT CẢ ANIMATION STYLES =====
            this.clearAnimationStyles(cardElement);
            
            // ===== XÓA TẤT CẢ DISPLAY ELEMENTS CŨ =====
            // Giữ lại card-image, xóa tất cả elements khác
            const cardImage = cardElement.querySelector('.card-image');
            cardElement.innerHTML = '';
            if (cardImage) {
                cardElement.appendChild(cardImage);
            }
        } else {
            // ===== TẠO ELEMENT MỚI =====
            cardElement = document.createElement('div');
            
            // ===== TẠO CARD IMAGE =====
            const imageElement = document.createElement('img');
            imageElement.className = 'card-image';
            imageElement.src = card.image;
            imageElement.alt = card.type;
            cardElement.appendChild(imageElement);
        }
        
        // ===== CẬP NHẬT CLASS VÀ DATASET =====
        cardElement.className = `card ${card.type}`;
        cardElement.dataset.index = index;
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.type = card.type;

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

        // Sword card - hiển thị độ bền
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
            if (this.characterManager.getCharacterWeaponDurability() > 0) {
                const weaponDisplay = document.createElement('div');
                weaponDisplay.className = 'weapon-display';
                weaponDisplay.textContent = this.characterManager.getCharacterWeaponDurability();
                cardElement.appendChild(weaponDisplay);
            }
        } 
        // Enemy card - hiển thị HP
        else if (card.type === 'enemy') {
            const hpDisplay = document.createElement('div');
            hpDisplay.className = 'hp-display';

            // ===== THÊM COWARDLY STYLING CHO OPERATIVE CARDS =====
            if (card.nameId === 'operative') {
                // Kiểm tra cowardlyEffect và thêm class nếu cần
                if (card.cowardlyEffect && typeof card.cowardlyEffect === 'function') {
                    const isCowardly = card.cowardlyEffect(this.characterManager);
                    if (isCowardly) {
                        cardElement.classList.add('cowardly');
                    } else {
                        cardElement.classList.remove('cowardly');
                    }
                }
            }
            
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
        // Trap card - hiển thị damage và mũi tên theo thuộc tính
        else if (card.nameId === 'trap') {
            // Hiển thị damage ở góc dưới bên phải
            const damageDisplay = document.createElement('div');
            damageDisplay.className = 'damage-display';
            damageDisplay.textContent = card.damage || 0;
            cardElement.appendChild(damageDisplay);
            
            // Tạo mũi tên theo thuộc tính arrow của card
            const arrowConfigs = [
                { position: 'top-center', property: 'arrowTop' },
                { position: 'bottom-center', property: 'arrowBottom' },
                { position: 'left-center', property: 'arrowLeft' },
                { position: 'right-center', property: 'arrowRight' }
            ];
            
            arrowConfigs.forEach(({ position, property }) => {
                // Chỉ tạo arrow nếu thuộc tính = 1
                if (card[property] === 1) {
                    const arrowElement = document.createElement('div');
                    arrowElement.className = `trap-arrow ${position}`;
                    arrowElement.innerHTML = '➤'; // Unicode arrow symbol
                    cardElement.appendChild(arrowElement);
                }
            });
        }

        return cardElement;
    }



    /**
     * Tìm vị trí của một card trong grid để chèn vào đúng vị trí
     * @param {number} cardIndex - Index của card cần tìm vị trí
     * @returns {HTMLElement | null} Element của vị trí cần chèn hoặc null nếu không tìm thấy
     */
    getGridPosition(cardIndex) {
        const grid = document.getElementById('cards-grid');
        if (!grid) return null;

        // Tính toán vị trí trong grid dựa trên index
        const row = Math.floor(cardIndex / 3);
        const col = cardIndex % 3;
        
        // Tìm element ở vị trí tương ứng trong grid
        const gridChildren = Array.from(grid.children);
        const targetPosition = row * 3 + col;
        
        if (targetPosition < gridChildren.length) {
            return gridChildren[targetPosition];
        }
        
        // Nếu không tìm thấy, trả về null để append vào cuối
        return null;
    }

    /**
     * Cập nhật hiển thị character (HP và weapon)
     *?ược g?i khi character thay đổi stats
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
            if (this.characterManager.getCharacterWeaponDurability() > 0) {
            // Tạo weapon display nếu chưa có
            if (!weaponDisplay) {
                weaponDisplay = document.createElement('div');
                weaponDisplay.className = 'weapon-display';
                characterElement.appendChild(weaponDisplay);
            }
            weaponDisplay.textContent = this.characterManager.getCharacterWeaponDurability();
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
            // ===== CẬP NHẬT COWARDLY STATE CHO OPERATIVE CARDS =====
            if (monster.nameId === 'operative') {
                // Kiểm tra cowardlyEffect và cập nhật class nếu cần
                if (monster.cowardlyEffect && typeof monster.cowardlyEffect === 'function') {
                    const isCowardly = monster.cowardlyEffect(this.characterManager);
                    if (isCowardly) {
                        monsterElement.classList.add('cowardly');
                    } else {
                        monsterElement.classList.remove('cowardly');
                    }
                }
            }
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
     * Cập nhật hiển thị boom countdown và damage
     * @param {number} boomIndex - Index của boom card cần cập nhật
     */
    updateBoomDisplay(boomIndex) {
        const boomElement = document.querySelector(`[data-index="${boomIndex}"]`);
        if (boomElement && this.cardManager.getCard(boomIndex)) {
            const boom = this.cardManager.getCard(boomIndex);
            
            // Cập nhật countdown display
            const countdownDisplay = boomElement.querySelector('.countdown-display');
            if (countdownDisplay && boom.countdown !== undefined) {
                countdownDisplay.textContent = boom.countdown;
            }
            
            // Cập nhật damage display
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

    /**
     * Bắt đầu animation tương tác với treasure
     * @param {number} characterIndex - Index của character
     * @param {number} treasureIndex - Index của treasure
     */
    startTreasureInteractionAnimation(characterIndex, treasureIndex) {
        // Thêm vào hàng đợi với priority trung bình
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                // ===== TÌM CÁC ELEMENT =====
                const characterElement = document.querySelector(`[data-index="${characterIndex}"]`);
                const treasureElement = document.querySelector(`[data-index="${treasureIndex}"]`);
                
                // ===== ANIMATION CHO CHARACTER (INTERACTING) =====
                if (characterElement) {
                    characterElement.classList.add('treasure-interacting');
                    setTimeout(() => {
                        characterElement.classList.remove('treasure-interacting');
                    }, 200);
                }
                
                // ===== ANIMATION CHO TREASURE (BEING INTERACTED) =====
                if (treasureElement) {
                    treasureElement.classList.add('treasure-being-interacted');
                    setTimeout(() => {
                        treasureElement.classList.remove('treasure-being-interacted');
                    }, 200);
                }
                
                // Resolve sau khi animation hoàn thành
                setTimeout(resolve, 300); // Tăng từ 200ms lên 300ms để khớp với CSS combatShake duration
            });
        }, `Treasure Interaction (${characterIndex} → ${treasureIndex})`, 4);
    }

    /**
     * Bắt đầu animation boom explosion cho tất cả thẻ bị ảnh hưởng
     * @param {Array} affectedCardIndexes - Mảng các index của thẻ bị ảnh hưởng
     * @param {number} boomIndex - Index của boom card
     */
    startBoomExplosionAnimation(affectedCardIndexes, boomIndex) {
        // Thêm vào hàng đợi với priority thấp (boom explosion)
        this.queueAnimation(() => {
            return new Promise((resolve) => {
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
                
                // Resolve sau khi animation hoàn thành
                setTimeout(resolve, 500);
            });
        }, `Boom Explosion (${boomIndex})`, 6);
    }



    /**
     * Tạo popup hiển thị damage
     * @param {HTMLElement} element - Element để thêm popup vào
     * @param {number} damage - Số damage cần hiển thị
     */
    createDamagePopup(element, damage) {
        // ===== KIỂM TRA VÀ XỬ LÝ DAMAGE =====
        const validDamage = damage || 0; // Đảm bảo damage không undefined
        // console.log(`💥 Damage popup: original=${damage}, valid=${validDamage}`);
        
        // ===== CHỈ HIỂN THỊ POPUP NẾU DAMAGE > 0 =====
        if (validDamage <= 0) {
            // console.log(`💥 B? qua damage popup vì damage <= 0`);
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
        // Thêm vào hàng đợi với priority cao (combat animation)
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                // ===== TÌM CÁC ELEMENT =====
                const characterElement = document.querySelector(`[data-index="${characterIndex}"]`);
                const monsterElement = document.querySelector(`[data-index="${monsterIndex}"]`);
                
                // ===== ANIMATION CHO CHARACTER (ATTACKING) =====
                if (characterElement) {
                    characterElement.classList.add('combat-attacking');
                    setTimeout(() => {
                        characterElement.classList.remove('combat-attacking');
                    }, 300);
                }
                
                // ===== ANIMATION CHO MONSTER (DEFENDING) =====
                if (monsterElement) {
                    monsterElement.classList.add('combat-defending');
                    this.createDamagePopup(monsterElement, damage);
                    setTimeout(() => {
                        monsterElement.classList.remove('combat-defending');
                    }, 300);
                }
                
                // Resolve sau khi animation hoàn thành
                setTimeout(resolve, 300); // Tăng từ 200ms lên 300ms để khớp với CSS combatShake duration
            });
        }, `Combat Animation (${characterIndex} → ${monsterIndex})`, 3);
    }



    /**
     * Bắt đầu animation game over
     * Tất cả cards sẽ co lại và biến mất
     */
    triggerGameOver() {
        // Thêm vào hàng đợi với priority cao nhất (game over)
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                const cards = document.querySelectorAll('.card');
                console.log(`Found ${cards.length} cards to animate`);
                
                // ===== KIỂM TRA CÓ CARDS KHÔNG =====
                if (cards.length === 0) {
                    console.warn('No cards found to animate');
                    this.showGameOverDialog();
                    resolve();
                    return;
                }
                
                // ===== ANIMATE TỪNG CARD =====
                let animatedCount = 0;
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('shrinking');
                        animatedCount++;
                        console.log(`Animating card ${index} (${animatedCount}/${cards.length})`);
                        
                        if (animatedCount === cards.length) {
                            console.log('All cards animated successfully');
                        }
                    }, index * 100);
                });

                // ===== TÍNH THỜI GIAN TỔNG =====
                const totalAnimationTime = cards.length * 100 + 1000;
                console.log(`Game over dialog will show in ${totalAnimationTime}ms`);
                
                // ===== HIỂN THỊ DIALOG SAU KHI ANIMATION XONG =====
                setTimeout(() => {
                    this.showGameOverDialog();
                    resolve();
                }, totalAnimationTime);
            });
        }, 'Game Over Animation', 1);
    }

    /**
     * Hiển thị dialog game over
     * Ẩn tất cả cards và hiển thị dialog
     */
    showGameOverDialog() {
        // Đợi animation shrinking hoàn thành trước khi ẩn cards
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
        cards.forEach((card, index) => {
            console.log(`Card ${index} before hiding: classes = ${card.classList.toString()}`);
            card.style.display = 'none'; // Ẩn card ngay lập tức
            console.log(`Card ${index} after hiding: classes = ${card.classList.toString()}`);
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
    }

    /**
     * Bắt đầu animation di chuyển character
     * @param {number} fromIndex - Index xuất phát
     * @param {number} toIndex - Index đích
     * @param {Object} cardToMove - Thông tin thẻ bị đẩy (nếu có)
     * @param {Function} onComplete - Callback khi animation hoàn thành
     */
    startMoveCharacterAnimation(fromIndex, toIndex, cardToMove, onComplete) {
        // Thêm vào hàng đợi với priority cao (move character)
        this.queueAnimation(() => {
            return new Promise((resolve) => {
                // ===== TÍNH TOÁN VỊ TRÍ DI CHUYỂN =====
                const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
                const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
                
                // ===== LẤY CÁC ELEMENT CẦN THIẾT =====
                const characterElement = document.querySelector(`[data-index="${fromIndex}"]`);
                const targetElement = document.querySelector(`[data-index="${toIndex}"]`);
                
                if (!characterElement || !targetElement) {
                    resolve();
                    return;
                }
                
                // ===== TÍNH TOÁN KHOẢNG CÁCH DI CHUYỂN =====
                const moveDistance = this.calculateMoveDistance(fromPos.col, toPos.col, fromPos.row, toPos.row);
                const moveX = moveDistance.x;
                const moveY = moveDistance.y;
                
                // ===== THIẾT LẬP ANIMATION =====
                characterElement.style.setProperty('--dual-move-x', `${moveX}px`);
                characterElement.style.setProperty('--dual-move-y', `${moveY}px`);
                
                characterElement.classList.add('dual-moving'); // Animation di chuyển
                targetElement.classList.add('dual-eating'); // Animation ăn
                
                // ===== ANIMATION CHO THẺ BỊ ĐẨY (DOMINO) =====
                if (cardToMove) {
                    const cardToMoveElement = document.querySelector(`[data-index="${cardToMove.fromIndex}"]`);
                    if (cardToMoveElement) {
                        const cardToMovePos = { 
                            row: Math.floor(cardToMove.fromIndex / 3), 
                            col: cardToMove.fromIndex % 3 
                        };
                        
                        // Tính toán khoảng cách di chuyển ngược cho thẻ bị đẩy
                        const reverseMoveDistance = this.calculateMoveDistance(
                            cardToMovePos.col, fromPos.col, 
                            cardToMovePos.row, fromPos.row
                        );
                        const reverseMoveX = reverseMoveDistance.x;
                        const reverseMoveY = reverseMoveDistance.y;
                        
                        cardToMoveElement.style.setProperty('--dual-reverse-x', `${reverseMoveX}px`);
                        cardToMoveElement.style.setProperty('--dual-reverse-y', `${reverseMoveY}px`);
                        cardToMoveElement.classList.add('dual-reverse'); // Animation đẩy ngược
                    }
                }
                
                // ===== XỬ LÝ SAU KHI ANIMATION HOÀN THÀNH =====
                setTimeout(() => {
                    // ===== XÓA TẤT CẢ CSS CUSTOM PROPERTIES SAU ANIMATION =====
                    const allElements = [characterElement, targetElement];
                    if (cardToMove) {
                        const cardToMoveElement = document.querySelector(`[data-index="${cardToMove.fromIndex}"]`);
                        if (cardToMoveElement) {
                            allElements.push(cardToMoveElement);
                        }
                    }
                    
                    // Xóa chỉ các class và style liên quan đến dual movement
                    allElements.forEach(element => {
                        this.clearDualMovementStyles(element);
                    });
                    
                    // Gọi callback nếu có
                    if (onComplete) {
                        onComplete();
                    }
                    
                    resolve();
                }, 500); // Giảm từ 800ms xuống 500ms để game nhanh hơn
            });
        }, `Move Character (${fromIndex} → ${toIndex})`, 2);
    }

    /**
     * Debug: Kiểm tra và reset trạng thái animation nếu cần
     * @returns {Object} Thông tin trạng thái hiện tại
     */


    /**
     * Tính toán khoảng cách di chuyển dựa trên chiều rộng thẻ thực tế
     * @param {number} fromCol - Cột bắt đầu
     * @param {number} toCol - Cột đích
     * @param {number} fromRow - Hàng bắt đầu
     * @param {number} toRow - Hàng đích
     * @returns {Object} Khoảng cách di chuyển {x, y}
     */
    calculateMoveDistance(fromCol, toCol, fromRow, toRow) {
        const cardWidth = this.getCardWidth();
        const cardHeight = cardWidth * (16/9); // Tỷ lệ 9:16 từ CSS
        
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
            return 100; // Fallback nếu không tìm thấy grid
        }
        const gridWidth = gridElement.offsetWidth;
        const gap = 4; // Gap giữa các thẻ (từ CSS)
        const numColumns = 3; // Grid có 3 cột
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
        
        // Xóa chỉ các CSS custom properties liên quan đến dual movement
        element.style.removeProperty('--dual-move-x');
        element.style.removeProperty('--dual-move-y');
        element.style.removeProperty('--dual-reverse-x');
        element.style.removeProperty('--dual-reverse-y');
        
        // Xóa chỉ các classes liên quan đến dual movement
        element.classList.remove('dual-moving');
        element.classList.remove('dual-reverse');
        element.classList.remove('dual-eating');
    }

    /**
     * Xóa tất cả CSS styles và animation classes khỏi element
     * @param {HTMLElement} element - Element cần xóa CSS
     */
    clearAnimationStyles(element) {
        if (!element) return;
        
        // Xóa toàn bộ inline styles (bao gồm tất cả custom properties)
        element.removeAttribute('style');
        
        // Xóa toàn bộ classes và chỉ giữ lại class cơ bản
        element.className = '';
    }

}