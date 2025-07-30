// WarriorCardGame.js - Class chính điều phối
// Chức năng: Điều phối tất cả các module và khởi tạo game

class WarriorCardGame {
    constructor() {
        // Khởi tạo tất cả các manager cần thiết
        this.gameState = new GameState(); // Quản lý trạng thái game
        this.cardManager = new CardManager(); // Quản lý thẻ
        this.warriorManager = new WarriorManager(); // Quản lý Warrior
        this.animationManager = new AnimationManager(this.cardManager, this.warriorManager); // Quản lý animation
        this.uiManager = new UIManager(this.gameState, this.warriorManager); // Quản lý giao diện
        this.combatManager = new CombatManager(this.warriorManager, this.cardManager, this.animationManager); // Quản lý chiến đấu
        this.eventManager = new EventManager(
            this.gameState, this.cardManager, this.warriorManager, 
            this.combatManager, this.animationManager, this.uiManager
        ); // Quản lý events

        // Set eventManager cho AnimationManager để có thể setup events sau combat
        this.animationManager.setEventManager(this.eventManager);

        // Khởi tạo game
        this.initializeGame();
    }

    // Khởi tạo game ban đầu
    initializeGame() {
        this.cardManager.createCards(); // Tạo bộ thẻ ban đầu
        this.animationManager.renderCards(); // Render thẻ lên màn hình
        this.uiManager.updateUI(); // Cập nhật giao diện
        this.eventManager.setupEventListeners(); // Setup các event listener
        this.eventManager.setupCardEvents(); // Setup events cho từng thẻ
    }
} 