/**
 * LoadingManager.js - Real Resource Loading
 * Quản lý màn hình loading và thực sự load tài nguyên game
 */
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressFill = document.getElementById('progress-fill');
        this.loadingText = document.getElementById('loading-text');
        this.loadingTips = document.getElementById('loading-tips');
        
        this.currentProgress = 0;
        this.totalSteps = 0;
        this.currentStep = 0;
        this.isLoading = false;
        
        this.tips = [
            "💡 Mẹo: Ghép các thẻ cùng loại để tạo ra thẻ mạnh hơn!",
            "⚔️ Warrior có thể tấn công kẻ địch để bảo vệ bản thân",
            "🛡️ Sử dụng Shield để bảo vệ khỏi sát thương",
            "💰 Thu thập Coin để tăng điểm số",
            "🍖 Food giúp hồi phục HP cho Warrior",
            "🗡️ Sword tăng sức tấn công cho Warrior",
            "💣 Boom sẽ nổ sau vài lượt, hãy cẩn thận!",
            "🎁 Treasure chứa nhiều phần thưởng quý giá",
            "☠️ Poison làm giảm HP theo thời gian",
            "🕳️ Void sẽ nuốt chửng thẻ xung quanh",
            "🔮 Catalyst có thể biến đổi thẻ thành loại khác",
            "🏴‍☠️ Eremite là kẻ địch mạnh, hãy cẩn thận!",
            "🌊 Abyss Lector có sức mạnh đặc biệt",
            "🐋 Narwhal có thể tấn công từ xa",
            "🕵️ Operative có khả năng ẩn nấp",
            "🎯 Ghép 3 thẻ cùng loại để tạo ra thẻ mạnh hơn",
            "⚡ Sử dụng Trap để bẫy kẻ địch",
            "🌪️ Quicksand có thể làm chậm kẻ địch",
            "💎 Bribery có thể mua chuộc kẻ địch",
            "🌟 Ghép 5 thẻ cùng loại để tạo ra thẻ hiếm!"
        ];
        
        this.currentTipIndex = 0;
        this.tipInterval = null;
        this.lastTipIndex = -1; // Để tránh hiển thị cùng tip liên tiếp
        
        // Danh sách hình ảnh cần preload
        this.imageList = [
            'resources/warrior.webp',
            'resources/fatui0.webp',
            'resources/fatui1.webp',
            'resources/fatui2.webp',
            'resources/fatui3.webp',
            'resources/food0.webp',
            'resources/food1.webp',
            'resources/food2.webp',
            'resources/food3.webp',
            'resources/sword0.webp',
            'resources/sword1.webp',
            'resources/sword2.webp',
            'resources/sword3.webp',
            'resources/sword4.webp',
            'resources/sword5.webp',
            'resources/sword6.webp',
            'resources/coin0.webp',
            'resources/coin1.webp',
            'resources/coin2.webp',
            'resources/coin3.webp',
            'resources/coin4.webp',
            'resources/coin5.webp',
            'resources/coin6.webp',
            'resources/coinUp0.webp',
            'resources/coinUp1.webp',
            'resources/coinUp2.webp',
            'resources/coinUp3.webp',
            'resources/coinUp4.webp',
            'resources/coinUp5.webp',
            'resources/coinUp6.webp',
            'resources/trap.webp',
            'resources/poison.webp',
            'resources/boom.webp',
            'resources/quicksand.webp',
            'resources/treasure0.webp',
            'resources/treasure1.webp',
            'resources/bribery.webp',
            'resources/catalyst0.webp',
            'resources/catalyst1.webp',
            'resources/catalyst2.webp',
            'resources/eremite0.webp',
            'resources/eremite1.webp',
            'resources/abyssLector0.webp',
            'resources/abyssLector1.webp',
            'resources/abyssLector2.webp',
            'resources/apep.webp',
            'resources/dragon.webp',
            'resources/narwhal.webp',
            'resources/operative.webp',
            'resources/void.webp'
        ];
        
        this.loadedImages = 0;
        this.totalImages = this.imageList.length;
        
        // Danh sách scripts cần load
        this.scriptList = [
            // Card classes
            "modules/cards/Card.js",
            "modules/cards/Fatui0.js",
            "modules/cards/Fatui1.js",
            "modules/cards/Fatui2.js",
            "modules/cards/Fatui3.js",
            "modules/cards/Food0.js",
            "modules/cards/Food1.js",
            "modules/cards/Food2.js",
            "modules/cards/Food3.js",
            "modules/cards/Sword0.js",
            "modules/cards/Sword1.js",
            "modules/cards/Sword2.js",
            "modules/cards/Sword3.js",
            "modules/cards/Sword4.js",
            "modules/cards/Sword5.js",
            "modules/cards/Sword6.js",
            "modules/cards/Coin0.js",
            "modules/cards/Coin1.js",
            "modules/cards/Coin2.js",
            "modules/cards/Coin3.js",
            "modules/cards/Coin4.js",
            "modules/cards/Coin5.js",
            "modules/cards/Coin6.js",
            "modules/cards/CoinUp0.js",
            "modules/cards/CoinUp1.js",
            "modules/cards/CoinUp2.js",
            "modules/cards/CoinUp3.js",
            "modules/cards/CoinUp4.js",
            "modules/cards/CoinUp5.js",
            "modules/cards/CoinUp6.js",
            "modules/cards/Warrior.js",
            "modules/cards/Trap.js",
            "modules/cards/Poison.js",
            "modules/cards/Boom.js",
            "modules/cards/Quicksand.js",
            "modules/cards/Treasure0.js",
            "modules/cards/Treasure1.js",
            "modules/cards/Bribery.js",
            "modules/cards/Catalyst0.js",
            "modules/cards/Catalyst1.js",
            "modules/cards/Catalyst2.js",
            "modules/cards/Eremite0.js",
            "modules/cards/Eremite1.js",
            "modules/cards/AbyssLector0.js",
            "modules/cards/AbyssLector1.js",
            "modules/cards/AbyssLector2.js",
            "modules/cards/Apep.js",
            "modules/cards/Dragon.js",
            "modules/cards/Narwhal.js",
            "modules/cards/Operative.js",
            "modules/cards/Void.js",
            "modules/cards/CardFactory.js",
            
            // Manager classes
            "modules/CardManager.js",
            "modules/GameState.js",
            "modules/CharacterManager.js",
            "modules/AnimationManager.js",
            "modules/UIManager.js",
            "modules/CombatManager.js",
            "modules/EventManager.js",
            "modules/DungeonCardGame.js"
        ];
        
        this.loadedScripts = 0;
        this.totalScripts = this.scriptList.length;
    }
    
    /**
     * Bắt đầu quá trình loading thực sự
     */
    startLoading() {
        this.isLoading = true;
        this.currentProgress = 0;
        this.currentStep = 0;
        this.updateProgress(0, "Đang khởi tạo game...");
        this.startTipRotation();
    }
    
    /**
     * Cập nhật tiến độ loading
     * @param {number} progress - Tiến độ từ 0-100
     * @param {string} text - Text hiển thị
     */
    updateProgress(progress, text) {
        this.currentProgress = progress;
        this.progressFill.style.width = `${progress}%`;
        this.loadingText.textContent = text;
    }
    
    /**
     * Load scripts tuần tự
     * @returns {Promise} Promise khi tất cả scripts đã load xong
     */
    async loadScriptsSequentially() {
        return new Promise((resolve, reject) => {
            let index = 0;
            
            const loadNext = () => {
                if (index >= this.scriptList.length) {
                    resolve();
                    return;
                }
                
                const script = document.createElement("script");
                script.src = this.scriptList[index];
                
                script.onload = () => {
                    this.loadedScripts++;
                    const progress = Math.round((this.loadedScripts / this.totalScripts) * 50); // Scripts chiếm 50% progress
                    this.updateProgress(progress, `Đang tải scripts... (${this.loadedScripts}/${this.totalScripts})`);
                    index++;
                    loadNext();
                };
                
                script.onerror = () => {
                    console.error(`❌ Failed to load script: ${this.scriptList[index]}`);
                    this.loadedScripts++;
                    index++;
                    loadNext(); // Tiếp tục load script tiếp theo
                };
                
                document.head.appendChild(script);
            };
            
            loadNext();
        });
    }
    
    /**
     * Preload tất cả hình ảnh vào cache của trình duyệt
     * @returns {Promise} Promise khi tất cả hình ảnh đã load xong
     */
    async preloadImages() {
        const imagePromises = this.imageList.map((src) => {
            return new Promise((resolve) => {
                // Tạo Image object để preload vào cache
                const preloadImg = new Image();
                
                preloadImg.onload = () => {
                    this.loadedImages++;
                    const progress = 50 + Math.round((this.loadedImages / this.totalImages) * 30); // Images chiếm 30% progress (50-80%)
                    this.updateProgress(progress, `Đang tải hình ảnh... (${this.loadedImages}/${this.totalImages})`);
                    
                    // Log để debug
                    console.log(`✅ Preloaded: ${src}`);
                    
                    resolve();
                };
                
                preloadImg.onerror = () => {
                    console.warn(`❌ Không thể preload hình ảnh: ${src}`);
                    this.loadedImages++;
                    resolve(); // Vẫn resolve để không block loading
                };
                
                // Gán src để trigger load vào cache
                preloadImg.src = src;
            });
        });
        
        return Promise.all(imagePromises);
    }
    
    /**
     * Khởi tạo các manager và components
     */
    async initializeComponents() {
        try {
            // Khởi tạo CharacterManager (không cần dependencies)
            this.updateProgress(80, "Đang khởi tạo Character Manager...");
            if (typeof CharacterManager !== 'undefined') {
                window.characterManager = new CharacterManager();
                console.log("✅ CharacterManager initialized");
            } else {
                throw new Error("CharacterManager not loaded");
            }
            
            // Khởi tạo GameState với CharacterManager
            this.updateProgress(82, "Đang khởi tạo Game State...");
            if (typeof GameState !== 'undefined') {
                window.gameState = new GameState(window.characterManager);
                console.log("✅ GameState initialized");
            } else {
                throw new Error("GameState not loaded");
            }
            
            // Khởi tạo CardManager (không cần dependencies)
            this.updateProgress(84, "Đang khởi tạo Card Manager...");
            if (typeof CardManager !== 'undefined') {
                window.cardManager = new CardManager();
                console.log("✅ CardManager initialized");
            } else {
                throw new Error("CardManager not loaded");
            }
            
            // Khởi tạo AnimationManager với CardManager và CharacterManager
            this.updateProgress(86, "Đang khởi tạo Animation Manager...");
            if (typeof AnimationManager !== 'undefined') {
                window.animationManager = new AnimationManager(window.cardManager, window.characterManager);
                console.log("✅ AnimationManager initialized");
            } else {
                throw new Error("AnimationManager not loaded");
            }
            
            // Khởi tạo UIManager với GameState và CharacterManager
            this.updateProgress(88, "Đang khởi tạo UI Manager...");
            if (typeof UIManager !== 'undefined') {
                window.uiManager = new UIManager(window.gameState, window.characterManager);
                console.log("✅ UIManager initialized");
            } else {
                throw new Error("UIManager not loaded");
            }
            
            // Khởi tạo CombatManager với CharacterManager, CardManager và AnimationManager
            this.updateProgress(90, "Đang khởi tạo Combat Manager...");
            if (typeof CombatManager !== 'undefined') {
                window.combatManager = new CombatManager(window.characterManager, window.cardManager, window.animationManager);
                console.log("✅ CombatManager initialized");
            } else {
                throw new Error("CombatManager not loaded");
            }
            
            // Khởi tạo EventManager với tất cả dependencies
            this.updateProgress(92, "Đang khởi tạo Event Manager...");
            if (typeof EventManager !== 'undefined') {
                window.eventManager = new EventManager(
                    window.gameState, 
                    window.cardManager, 
                    window.characterManager, 
                    window.combatManager, 
                    window.animationManager, 
                    window.uiManager
                );
                console.log("✅ EventManager initialized");
            } else {
                throw new Error("EventManager not loaded");
            }
            
            // Setup các dependencies giữa các manager
            this.updateProgress(94, "Đang thiết lập dependencies...");
            
            // Set eventManager cho AnimationManager để có thể setup events sau combat
            if (window.animationManager && typeof window.animationManager.setEventManager === 'function') {
                window.animationManager.setEventManager(window.eventManager);
                console.log("✅ AnimationManager -> EventManager dependency set");
            }
            
            // Set animationManager cho CharacterManager để có thể gọi triggerGameOver
            if (window.characterManager && typeof window.characterManager.setAnimationManager === 'function') {
                window.characterManager.setAnimationManager(window.animationManager);
                console.log("✅ CharacterManager -> AnimationManager dependency set");
            }
            
        } catch (error) {
            console.error("❌ Error initializing components:", error);
            throw error;
        }
    }
    
    /**
     * Setup các manager và chuẩn bị cho game
     */
    async setupGame() {
        try {
            this.updateProgress(95, "Đang thiết lập các manager...");
            
            // Kiểm tra tất cả manager đã được khởi tạo
            if (!window.characterManager || !window.gameState || !window.cardManager || 
                !window.animationManager || !window.uiManager || !window.combatManager || 
                !window.eventManager) {
                throw new Error("Một số manager chưa được khởi tạo");
            }
            
            this.updateProgress(98, "Đang chuẩn bị game...");
            
            // Log thành công
            console.log("✅ Tất cả managers đã được khởi tạo thành công");
            console.log("✅ Sẵn sàng tạo game instance");
            
            this.updateProgress(99, "Đang sẵn sàng game...");
            
        } catch (error) {
            console.error("❌ Error setting up managers:", error);
            throw error;
        }
    }
    
    /**
     * Bắt đầu xoay vòng các mẹo
     */
    startTipRotation() {
        this.showNextTip();
        this.tipInterval = setInterval(() => {
            this.showNextTip();
        }, 1000);
    }
    
    /**
     * Dừng xoay vòng các mẹo
     */
    stopTipRotation() {
        if (this.tipInterval) {
            clearInterval(this.tipInterval);
            this.tipInterval = null;
        }
    }
    
    /**
     * Hiển thị mẹo tiếp theo
     */
    showNextTip() {
        if (this.loadingTips && this.loadingTips.querySelector('p')) {
            // Chọn tip ngẫu nhiên, tránh hiển thị cùng tip liên tiếp
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * this.tips.length);
            } while (randomIndex === this.lastTipIndex && this.tips.length > 1);
            
            this.lastTipIndex = randomIndex;
            this.loadingTips.querySelector('p').textContent = this.tips[randomIndex];
        }
    }
    
    /**
     * Hoàn thành loading và ẩn màn hình
     */
    completeLoading() {
        this.isLoading = false;
        this.stopTipRotation();
        this.updateProgress(100, "Hoàn tất! Đang khởi động game...");
        
        setTimeout(() => {
            this.loadingScreen.classList.add('fade-out');
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 300);
        }, 300);
    }
    
    /**
     * Hiển thị lỗi loading
     * @param {string} errorMessage - Thông báo lỗi
     */
    showError(errorMessage) {
        this.isLoading = false;
        this.stopTipRotation();
        this.loadingText.textContent = `Lỗi: ${errorMessage}`;
        this.loadingText.style.color = '#ff6b6b';
        
        // Thêm nút thử lại
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Thử Lại';
        retryButton.className = 'btn btn-primary mt-3';
        retryButton.onclick = () => {
            location.reload();
        };
        
        if (this.loadingTips) {
            this.loadingTips.innerHTML = '';
            this.loadingTips.appendChild(retryButton);
        }
    }
    
    /**
     * Hiển thị lại màn hình loading
     */
    show() {
        this.loadingScreen.style.display = 'flex';
        this.loadingScreen.classList.remove('fade-out');
    }
    
    /**
     * Ẩn màn hình loading
     */
    hide() {
        this.loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 300);
    }
    
    /**
     * Loading thực sự - Load scripts, tài nguyên và khởi tạo game
     */
    async realLoad() {
        this.startLoading();
        
        try {
            // Bước 1: Load tất cả scripts tuần tự
            this.updateProgress(0, "Đang tải scripts...");
            await this.loadScriptsSequentially();
            
            // Bước 2: Preload tất cả hình ảnh
            this.updateProgress(50, "Đang tải hình ảnh...");
            await this.preloadImages();
            
            // Bước 3: Khởi tạo các components
            await this.initializeComponents();
            
            // Bước 4: Setup game
            await this.setupGame();
            
            this.completeLoading();
            
        } catch (error) {
            this.showError('Lỗi khi tải tài nguyên: ' + error.message);
            console.error('❌ Lỗi loading:', error);
        }
    }
}

// Export cho sử dụng global
window.LoadingManager = LoadingManager; 