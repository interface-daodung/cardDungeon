// GameState.js - Quản lý trạng thái game
// Chức năng: Lưu trữ và quản lý tất cả trạng thái của game
class GameState {
    constructor() {
        this.score = 0; // Điểm số hiện tại
        this.moves = 0; // Số lượt di chuyển
        this.draggedCard = null; // Thẻ đang được kéo
        this.dragStartPos = null; // Vị trí bắt đầu kéo
        this.longPressTimer = null; // Timer cho long press
        this.longPressDelay = 500; // Thời gian delay cho long press (ms)
    }

    // Reset tất cả trạng thái về ban đầu
    reset() {
        this.score = 0; // Reset điểm số
        this.moves = 0; // Reset số lượt
        this.draggedCard = null; // Reset thẻ đang kéo
        this.dragStartPos = null; // Reset vị trí bắt đầu
        this.longPressTimer = null; // Reset timer
    }

    // Thêm điểm vào tổng điểm
    addScore(points) { 
        this.score += points; 
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
} 