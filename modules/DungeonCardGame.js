// DungeonCardGame.js - Class chính điều phối
// Chức năng: Điều phối tất cả các module và khởi tạo game

class DungeonCardGame {
    constructor(
        characterManager = null,
        gameState = null,
        cardManager = null,
        animationManager = null,
        uiManager = null,
        combatManager = null,
        eventManager = null
    ) {
        // Sử dụng các manager đã load hoặc tạo mới nếu không có
        this.characterManager = characterManager || new CharacterManager();
        this.gameState = gameState || new GameState();
        this.cardManager = cardManager || new CardManager();
        this.animationManager = animationManager || new AnimationManager(this.cardManager, this.characterManager);
        this.uiManager = uiManager || new UIManager(this.gameState, this.characterManager);
        this.combatManager = combatManager || new CombatManager(this.characterManager, this.cardManager, this.animationManager);
        this.eventManager = eventManager || new EventManager(
            this.gameState, this.cardManager, this.characterManager, 
            this.combatManager, this.animationManager, this.uiManager
        );

        // Setup dependencies nếu chưa được setup từ LoadingManager
        if (this.animationManager && typeof this.animationManager.setEventManager === 'function') {
            this.animationManager.setEventManager(this.eventManager);
        }
        
        if (this.characterManager && typeof this.characterManager.setAnimationManager === 'function') {
            this.characterManager.setAnimationManager(this.animationManager);
        }

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
        // ===== KIỂM TRA COIN UPGRADE NGAY LẬP TỨC SAU KHI TẠO GAME =====
        this.eventManager.checkCoinRowsAndColumns();
    }
} 
