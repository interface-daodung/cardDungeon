// Sword0.js - Thẻ vũ khí cơ bản
// Chức năng: Cung cấp vũ khí với độ bền thấp

class Sword0 extends Card {
    constructor() {
        super(
            "Thiên Không Kiếm", 
            "weapon", 
            "resources/sword0.webp", 
            "sword0"
        );
        this.durability = this.GetRandom(8, 16); // Độ bền 1-16
    }

    /**
     * Hiệu ứng khi thẻ bị ăn
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns
     * @param {CardManager} cardManager - Manager quản lý thẻ {Object} Thông tin kết quả
     */
    cardEffect(characterManager, gameState, cardManager) {
        
        // Thêm vũ khí cho character
        characterManager.addWeaponToCharacter(this);
        
        const result = {
            score: 0, // Vũ khí không tăng điểm
            type: this.type,
            durability: this.durability,
            effect: `Character nhận vũ khí với độ bền ${this.durability}`
        };
        
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
        // ⚔️ Sword0 attackWeaponEffect: Kích hoạt hiệu ứng tạo CoinUp khi giết quái
        // Tạo CoinUp với điểm ngẫu nhiên từ 1-9, nhân 2
        const coinUpScore = this.GetRandom(1, 9) * 2;
        
        return {
            type: 'weapon_attack_effect',
            shouldCreateCoinUp: true,
            coinUpScore: coinUpScore,
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
            description: `<strong>${this.type}</strong> - Durability: <span class="durability-text">${this.durability}</span><br><i>Thiên Không Kiếm toát ra lời chúc phúc của thần gió. Khi sử dụng để tiêu diệt quái vật, nó sẽ tạo ra những mảnh vỡ nguyên tố quý giá.</i>`,
            durability: this.durability
        };
    }
} 
