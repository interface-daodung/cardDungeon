// script.js - Khởi tạo game
// File chính để khởi tạo và chạy game CardDungeon

// Đợi DOM load xong rồi mới khởi tạo game
document.addEventListener('DOMContentLoaded', () => {
    // Tạo instance game mới
    const game = new WarriorCardGame();
    
    // Lưu game vào window để có thể truy cập từ console (debug)
    window.warriorCardGame = game;
    
    console.log('🎮 CardDungeon Game đã được khởi tạo thành công!');
}); 