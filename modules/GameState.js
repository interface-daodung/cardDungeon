// GameState.js - Quản lý trạng thái game
// Chức năng: Lưu trữ và quản lý tất cả trạng thái của game
class GameState {
    constructor() {
        this.score = 0; // Điểm số hiện tại
        this.moves = 0; // Số lượt di chuyển
        this.highScore = this.loadHighScore(); // High score từ localStorage
        this.draggedCard = null; // Thẻ đang được kéo
        this.dragStartPos = null; // Vị trí bắt đầu kéo
        this.longPressTimer = null; // Timer cho long press
        this.longPressDelay = 1500; // Thời gian delay cho long press (1.5 giây)
        this.touchStartTime = null; // Thời điểm bắt đầu touch
        this.touchStartPos = null; // Vị trí bắt đầu touch
    }

    // Reset tất cả trạng thái về ban đầu
    reset() {
        this.score = 0; // Reset điểm số
        this.moves = 0; // Reset số lượt
        this.draggedCard = null; // Reset thẻ đang kéo
        this.dragStartPos = null; // Reset vị trí bắt đầu
        this.longPressTimer = null; // Reset timer
        this.touchStartTime = null; // Reset touch start time
        this.touchStartPos = null; // Reset touch start position
        // Không reset high score
    }

    // Thêm điểm vào tổng điểm
    addScore(points) { 
        this.score += points; 
        this.updateHighScore(); // Cập nhật high score khi score thay đổi
    }
    
    // Tăng số lượt di chuyển
    incrementMoves() { 
        this.moves++; 
    }
    
    // Lấy điểm số hiện tại
    getScore() { 
        return this.score; 
    }
    
    // Lấy số lượt di chuyển
    getMoves() { 
        return this.moves; 
    }
    
    // Lấy high score
    getHighScore() {
        return this.highScore;
    }
    
    // Set thẻ đang được kéo
    setDraggedCard(index) { 
        this.draggedCard = index; 
    }
    
    // Lấy thẻ đang được kéo
    getDraggedCard() { 
        return this.draggedCard; 
    }
    
    // Xóa thẻ đang được kéo
    clearDraggedCard() { 
        this.draggedCard = null; 
    }
    
    // Set vị trí bắt đầu kéo
    setDragStartPos(pos) { 
        this.dragStartPos = pos; 
    }
    
    // Lấy vị trí bắt đầu kéo
    getDragStartPos() { 
        return this.dragStartPos; 
    }
    
    // Xóa vị trí bắt đầu kéo
    clearDragStartPos() { 
        this.dragStartPos = null; 
    }
    
    // Set timer cho long press
    setLongPressTimer(timer) { 
        this.longPressTimer = timer; 
    }
    
    // Lấy timer hiện tại
    getLongPressTimer() { 
        return this.longPressTimer; 
    }
    
    // Xóa timer và dừng long press
    clearLongPressTimer() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }
    
    // Lấy thời gian delay cho long press
    getLongPressDelay() { 
        return this.longPressDelay; 
    }
    
    // Touch tracking methods
    setTouchStartTime(time) {
        this.touchStartTime = time;
    }
    
    getTouchStartTime() {
        return this.touchStartTime;
    }
    
    clearTouchStartTime() {
        this.touchStartTime = null;
    }
    
    setTouchStartPos(pos) {
        this.touchStartPos = pos;
    }
    
    getTouchStartPos() {
        return this.touchStartPos;
    }
    
    clearTouchStartPos() {
        this.touchStartPos = null;
    }
    
    // Load high score từ localStorage
    loadHighScore() {
        const saved = localStorage.getItem('cardDungeonHighScore');
        return saved ? parseInt(saved) : 0;
    }
    
    // Save high score vào localStorage
    saveHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem('cardDungeonHighScore', score.toString());
        }
    }
    
    // Update high score nếu score hiện tại cao hơn
    updateHighScore() {
        this.saveHighScore(this.score);
    }
} 