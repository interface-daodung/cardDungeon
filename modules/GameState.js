// GameState.js - Quản lý trạng thái tổng thể của game
// Chức năng: Lưu trữ và quản lý tất cả trạng thái của game
// Bao gồm score, moves, high score, drag state, touch state

class GameState {
    /**
     * Khởi tạo GameState với các trạng thái ban đầu
     * Quản lý tất cả state cần thiết cho game
     */
    constructor(characterManager = null) {
        // ===== GAME STATISTICS =====
        this.score = 0; // Điểm số hiện tại
        this.moves = 0; // Số lượt di chuyển
        this.highScore = this.loadHighScore(); // High score từ localStorage
        
        // ===== CHARACTER MANAGER REFERENCE =====
        this.characterManager = characterManager; // Reference đến CharacterManager để xử lý độc
        
        // ===== DRAG & DROP STATE =====
        this.draggedCard = null; // Thẻ đang được kéo (index)
        this.dragStartPos = null; // Vị trí bắt đầu kéo (x, y)
        
        // ===== LONG PRESS STATE =====
        this.longPressTimer = null; // Timer cho long press
        this.longPressDelay = 1000; // Thời gian delay cho long press (2.0 giây)
        
        // ===== TOUCH STATE =====
        this.touchStartTime = null; // Thời điểm bắt đầu touch
        this.touchStartPos = null; // Vị trí bắt đầu touch
    }

    // ===== KHỞI TẠO VÀ RESET =====

    /**
     * Reset tất cả trạng thái và ban đầu
     * Được gọi khi restart game hoặc new game
     */
    reset() {
        // ===== RESET GAME STATISTICS =====
        this.score = 0; // Reset điểm số
        this.moves = 0; // Reset số lượt
        
        // ===== RESET DRAG STATE =====
        this.draggedCard = null; // Reset thẻ đang kéo
        this.dragStartPos = null; // Reset vị trí bắt đầu
        
        // ===== RESET LONG PRESS STATE =====
        this.longPressTimer = null; // Reset timer
        
        // ===== RESET TOUCH STATE =====
        this.touchStartTime = null; // Reset touch start time
        this.touchStartPos = null; // Reset touch start position
        
        // Lưu ý: Không reset high score - giữ lại thành tích cao nhất
    }

    // ===== QUẢN LÝ SCORE & MOVES =====

    /**
     * Thêm điểm vào tổng điểm
     * @param {number} points - Số điểm cần thêm
     */
    addScore(points) { 
        // Đảm bảo points là số hợp lệ
        const validPoints = points || 0;
        // console.log(`💰 Adding score: points=${points}, validPoints=${validPoints}, currentScore=${this.score}`);
        this.score += validPoints; 
        // console.log(`💰 New score: ${this.score}`);
        this.updateHighScore(); // Cập nhật high score khi score thay đổi
    }
    
    /**
     * Tăng số lượt di chuyển
     */
    incrementMoves() { 
        this.moves++; 
        
        // ===== XỬ LÝ ĐỘC VÀ HỒI PHỤC KHI TĂNG MOVE =====
        if (this.characterManager) {
            this.characterManager.processRecovery(); // Xử lý hồi phục trước 
            this.characterManager.processPoison(); // Xử lý độc sau 
            
        }
    }
    
    /**
     * Lấy điểm số hiện tại
     * @returns {number} Điểm số hiện tại
     */
    getScore() { 
        return this.score; 
    }
    
    /**
     * Lấy số lượt di chuyển
     * @returns {number} Số lượt di chuyển
     */
    getMoves() { 
        return this.moves; 
    }

    // ===== QUẢN LÝ DRAG STATE =====

    /**
     * Set thẻ đang được kéo
     * @param {number} index - Index của thẻ đang kéo
     */
    setDraggedCard(index) { 
        this.draggedCard = index; 
    }
    
    /**
     * Lấy thẻ đang được kéo
     * @returns {number|null} Index của thẻ đang kéo hoặc null
     */
    getDraggedCard() { 
        return this.draggedCard; 
    }
    
    /**
     * Xóa thẻ đang được kéo
     */
    clearDraggedCard() { 
        this.draggedCard = null; 
    }
    
    /**
     * Set vị trí bắt đầu kéo
     * @param {Object} pos - Vị trí bắt đầu (x, y)
     */
    setDragStartPos(pos) { 
        this.dragStartPos = pos; 
    }
    
    /**
     * Lấy vị trí bắt đầu kéo
     * @returns {Object|null} Vị trí bắt đầu hoặc null
     */
    getDragStartPos() { 
        return this.dragStartPos; 
    }
    
    /**
     * Xóa vị trí bắt đầu kéo
     */
    clearDragStartPos() { 
        this.dragStartPos = null; 
    }

    // ===== QUẢN LÝ TOUCH STATE =====

    /**
     * Set thời điểm bắt đầu touch
     * @param {number} time - Thời điểm bắt đầu touch
     */
    setTouchStartTime(time) {
        this.touchStartTime = time;
    }
    
    /**
     * Lấy thời điểm bắt đầu touch
     * @returns {number|null} Thời điểm bắt đầu touch hoặc null
     */
    getTouchStartTime() {
        return this.touchStartTime;
    }
    
    /**
     * Xóa thời điểm bắt đầu touch
     */
    clearTouchStartTime() {
        this.touchStartTime = null;
    }
    
    /**
     * Set vị trí bắt đầu touch
     * @param {Object} pos - Vị trí bắt đầu touch (x, y)
     */
    setTouchStartPos(pos) {
        this.touchStartPos = pos;
    }
    
    /**
     * Lấy vị trí bắt đầu touch
     * @returns {Object|null} Vị trí bắt đầu touch hoặc null
     */
    getTouchStartPos() {
        return this.touchStartPos;
    }
    
    /**
     * Xóa vị trí bắt đầu touch
     */
    clearTouchStartPos() {
        this.touchStartPos = null;
    }

    // ===== QUẢN LÝ LONG PRESS =====

    /**
     * Set timer cho long press
     * @param {number} timer - Timer ID
     */
    setLongPressTimer(timer) { 
        this.longPressTimer = timer; 
    }
    
    /**
     * Lấy timer cho long press
     * @returns {number|null} Timer ID hoặc null
     */
    getLongPressTimer() { 
        return this.longPressTimer; 
    }
    
    /**
     * Xóa timer cho long press
     */
    clearLongPressTimer() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }
    
    /**
     * Lấy thời gian delay cho long press
     * @returns {number} Thời gian delay (ms)
     */
    getLongPressDelay() { 
        return this.longPressDelay; 
    }

    // ===== QUẢN LÝ HIGH SCORE =====

    /**
     * Load high score từ localStorage
     * @returns {number} High score hoặc 0 nếu chưa có
     */
    loadHighScore() {
        const saved = localStorage.getItem('cardDungeonHighScore');
        return saved ? parseInt(saved) : 0;
    }

    /**
     * Save high score vào localStorage
     * @param {number} score - Điểm số cần lưu
     */
    saveHighScore(score) {
        localStorage.setItem('cardDungeonHighScore', score.toString());
    }

    /**
     * Cập nhật high score nếu điểm hiện tại cao hơn
     */
    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore(this.highScore);
        }
    }

    /**
     * Lấy high score
     * @returns {number} High score
     */
    getHighScore() {
        return this.highScore;
    }
} 