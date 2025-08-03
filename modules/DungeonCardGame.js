// DungeonCardGame.js - Class chính điều phối
// Chức năng: Điều phối tất cả các module và khởi tạo game

class DungeonCardGame {
    constructor() {
        // Khởi tạo tất cả các manager cần thiết
        this.characterManager = new CharacterManager(); // Quản lý Character (tạo trước)
        this.gameState = new GameState(this.characterManager); // Quản lý trạng thái game với CharacterManager
        this.cardManager = new CardManager(); // Quản lý thẻ
        this.animationManager = new AnimationManager(this.cardManager, this.characterManager); // Quản lý animation
        this.uiManager = new UIManager(this.gameState, this.characterManager); // Quản lý giao diện
        this.combatManager = new CombatManager(this.characterManager, this.cardManager, this.animationManager); // Quản lý chiến đấu
        this.eventManager = new EventManager(
            this.gameState, this.cardManager, this.characterManager, 
            this.combatManager, this.animationManager, this.uiManager
        ); // Quản lý events

        // Set eventManager cho AnimationManager để có thể setup events sau combat
        this.animationManager.setEventManager(this.eventManager);
        
        // Set animationManager cho CharacterManager để có thể gọi triggerGameOver
        this.characterManager.setAnimationManager(this.animationManager);

        // Khởi tạo game
        this.initializeGame();
    }

    // Khởi tạo game ban đầu
    initializeGame() {
        this.cardManager.createCards(this.characterManager); // Tạo bộ thẻ ban đầu
        this.animationManager.renderCards(); // Render thẻ lên màn hình
        this.uiManager.updateUI(); // Cập nhật giao diện
        this.eventManager.setupEventListeners(); // Setup các event listener
        this.eventManager.setupCardEvents(); // Setup events cho từng thẻ
        
        // ===== KIỂM TRA COIN UPGRADE NGAY LẬP TỨC SAU KHI MOVE =====
        this.checkCoinRowsAndColumns();
    }
} 
