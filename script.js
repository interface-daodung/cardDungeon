// script.js - File khởi tạo chính của game CardDungeon
// Chức năng: Khởi tạo và chạy game khi trang web được load
// Đây là entry point chính của ứng dụng

// Đợi DOM load xong rồi mới khởi tạo game
// Đảm bảo tất cả HTML elements đã sẵn sàng trước khi tạo game
document.addEventListener('DOMContentLoaded', async () => {
    // ===== KHỞI TẠO LOADING MANAGER =====
    const loadingManager = new LoadingManager();
    
    try {
        // Bắt đầu quá trình loading thực sự - Load tài nguyên game
        await loadingManager.realLoad();
        
        // ===== KHỞI TẠO GAME =====
        // Tạo instance game mới với tất cả manager được khởi tạo
        const game = new DungeonCardGame();
        
        // ===== DEBUG & DEVELOPMENT =====
        // Lưu game vào window để có thể truy cập từ console (debug)
        // Cho phép developer inspect game state trong browser console
        //window.dungeonCardGame = game;
        
        // ===== LOG SUCCESS =====
        // Thông báo game đã khởi tạo thành công
        console.log('🎮 CardDungeon Game đã được khởi tạo thành công!');
        // console.log('💡 Tip: Gõ "dungeonCardGame" trong console để inspect game state');
        
    } catch (error) {
        // Hiển thị lỗi nếu có
        loadingManager.showError('Không thể khởi tạo game: ' + error.message);
        console.error('❌ Lỗi khởi tạo game:', error);
    }
}); 