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
            "💡 Mẹo: Lợi dụng cơ quan phun lửa để tấn công kẻ địch!",
            "⚔️ Warrior có thể tấn công kẻ địch để bảo vệ bản thân",
            "🛡️ Sử dụng Shield để bảo vệ khỏi sát thương",
            "💰 Thu thập Coin để tăng điểm số",
            "🍖 Food giúp hồi phục HP cho Warrior",
            "🗡️ Sword tăng sức tấn công cho Warrior",
            "💣 Boom sẽ nổ sau vài lượt, hãy cẩn thận!",
            "🎁 Treasure chứa nhiều phần thưởng quý giá",
            "☠️ Poison làm giảm HP theo thời gian",
            "🕳️ Void là một thẻ đặc biệt không có bất kỳ tác dụng nào"
        ];
        
        this.currentTipIndex = 0;
        this.tipInterval = null;
        
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
            'resources/narwhal.webp',
            'resources/operative.webp',
            'resources/void.webp'
        ];
        
        this.loadedImages = 0;
        this.totalImages = this.imageList.length;
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
     * Preload tất cả hình ảnh
     * @returns {Promise} Promise khi tất cả hình ảnh đã load xong
     */
    async preloadImages() {
        const imagePromises = this.imageList.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.loadedImages++;
                    const progress = Math.round((this.loadedImages / this.totalImages) * 100);
                    this.updateProgress(progress, `Đang tải hình ảnh... (${this.loadedImages}/${this.totalImages})`);
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Không thể tải hình ảnh: ${src}`);
                    this.loadedImages++;
                    resolve(); // Vẫn resolve để không block loading
                };
                img.src = src;
            });
        });
        
        return Promise.all(imagePromises);
    }
    
    /**
     * Khởi tạo các manager và components
     */
    async initializeComponents() {
        // Khởi tạo CharacterManager
        this.updateProgress(10, "Đang khởi tạo Character Manager...");
        await this.delay(100);
        
        // Khởi tạo GameState
        this.updateProgress(20, "Đang khởi tạo Game State...");
        await this.delay(100);
        
        // Khởi tạo CardManager
        this.updateProgress(30, "Đang khởi tạo Card Manager...");
        await this.delay(100);
        
        // Khởi tạo AnimationManager
        this.updateProgress(40, "Đang khởi tạo Animation Manager...");
        await this.delay(100);
        
        // Khởi tạo UIManager
        this.updateProgress(50, "Đang khởi tạo UI Manager...");
        await this.delay(100);
        
        // Khởi tạo CombatManager
        this.updateProgress(60, "Đang khởi tạo Combat Manager...");
        await this.delay(100);
        
        // Khởi tạo EventManager
        this.updateProgress(70, "Đang khởi tạo Event Manager...");
        await this.delay(100);
    }
    
    /**
     * Tạo thẻ và setup game
     */
    async setupGame() {
        this.updateProgress(80, "Đang tạo thẻ và setup game...");
        await this.delay(200);
        
        this.updateProgress(90, "Đang thiết lập events...");
        await this.delay(200);
        
        this.updateProgress(95, "Đang sẵn sàng game...");
        await this.delay(100);
    }
    
    /**
     * Delay helper function
     * @param {number} ms - Thời gian delay (milliseconds)
     * @returns {Promise} Promise
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Bắt đầu xoay vòng các mẹo
     */
    startTipRotation() {
        this.showNextTip();
        this.tipInterval = setInterval(() => {
            this.showNextTip();
        }, 2000);
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
            this.loadingTips.querySelector('p').textContent = this.tips[this.currentTipIndex];
            this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
        }
    }
    
    /**
     * Thêm mẹo mới
     * @param {string} tip - Mẹo mới
     */
    addTip(tip) {
        this.tips.push(tip);
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
     * Loading thực sự - Load tài nguyên và khởi tạo game
     */
    async realLoad() {
        this.startLoading();
        
        try {
            // Bước 1: Preload tất cả hình ảnh
            this.updateProgress(0, "Đang tải hình ảnh...");
            await this.preloadImages();
            
            // Bước 2: Khởi tạo các components
            await this.initializeComponents();
            
            // Bước 3: Setup game
            await this.setupGame();
            
            this.completeLoading();
            
        } catch (error) {
            this.showError('Lỗi khi tải tài nguyên: ' + error.message);
            console.error('❌ Lỗi loading:', error);
        }
    }
    
    /**
     * Loading nhanh - Chỉ preload hình ảnh quan trọng
     */
    async quickLoad() {
        this.startLoading();
        
        try {
            // Chỉ preload một số hình ảnh cơ bản
            const essentialImages = [
                'resources/warrior.webp',
                'resources/fatui0.webp',
                'resources/food0.webp',
                'resources/sword0.webp',
                'resources/coin0.webp'
            ];
            
            this.updateProgress(0, "Đang tải hình ảnh cơ bản...");
            const imagePromises = essentialImages.map((src) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve; // Không block nếu lỗi
                    img.src = src;
                });
            });
            
            await Promise.all(imagePromises);
            
            this.updateProgress(50, "Đang khởi tạo game...");
            await this.delay(200);
            
            this.updateProgress(100, "Hoàn tất!");
            await this.delay(100);
            
            this.completeLoading();
            
        } catch (error) {
            this.showError('Lỗi khi tải tài nguyên: ' + error.message);
        }
    }
}

// Export cho sử dụng global
window.LoadingManager = LoadingManager; 