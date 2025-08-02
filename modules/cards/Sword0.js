// Sword0.js - Thẻ vũ khí cơ bản
// Chức năng: Cung cấp vũ khí với độ bền thấp

class Sword0 extends Card {
    constructor() {
        super(
            "Thiên Không Kiếm", 
            "weapon", 
            "resources/sword0.webp", 
            "Vũ khí cơ bản"
        );
        this.durability = Math.floor(Math.random() * 16) + 1; // Độ bền 1-16
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        console.log(`⚔ Sword0.cardEffect: Bắt đầu với độ bền ${this.durability}`);
        
        // Thêm vũ khí cho character
        characterManager.addWeaponToCharacter(this);
        
        const result = {
            score: 0, // Vũ khí không tăng điểm
            type: this.type,
            durability: this.durability,
            effect: `Character nhận vũ khí với độ bền ${this.durability}`
        };
        
        console.log(`⚔ Sword0.cardEffect: Kết quả:`, result);
        return result;
    }

    /**
     * Hiệu ứng khi vũ khí được sử dụng để tấn công
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {number} damageDealt - Lượng damage đã gây ra
     * @returns {Object} Thông tin kết quả
     */
    attackWeaponEffect(characterManager, gameState, damageDealt) {
        console.log(`⚔️ Sword0 attackWeaponEffect: Kích hoạt hiệu ứng tạo CoinUp khi giết quái`);
        
        // Lấy elementCoin từ CharacterManager
        
        // Tính điểm cho CoinUp: (Math.floor(Math.random() * 9) + 1) * 2
        const randomScore = Math.floor(Math.random() * 9) + 1;
        const finalScore = randomScore * 2;
        
        console.log(`⚔️ Sword0 attackWeaponEffect: Tạo CoinUp${elementCoin} với điểm ${finalScore} (random: ${randomScore} * 2)`);
        
        return {
            type: 'weapon_attack_effect',
            effect: `Tạo CoinUp${elementCoin} với ${finalScore} điểm khi giết quái`,
            shouldCreateCoinUp: true,
            coinUpScore: finalScore,
        };
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `Lưỡi kiếm toát ra lời chúc phúc của thần gió, chứa đựng sức mạnh của bầu trời và ngàn ngọn gió. - Độ bền: ${this.durability} - Tạo CoinUp khi giết quái`,
            durability: this.durability
        };
    }
} 
