// Sword1.js - Thẻ vũ khí mạnh
// Chức năng: Cung cấp vũ khí với độ bền cao

class Sword1 extends Card {
    constructor() {
        super(
            "Tây Phong Kiếm", 
            "weapon", 
            "resources/sword1.webp", 
            "sword1"
        );
        this.durability = this.GetRandom(8, 10); // Độ bền 8-10

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
        
        return {
            score: 0, // Vũ khí không tăng điểm
            type: this.type,
            durability: this.durability,
            effect: `Character nhận vũ khí mạnh với độ bền ${this.durability}`
        };
    }

    /**
     * Hiệu ứng khi bán vũ khí
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @returns {Object} Thông tin kết quả bán vũ khí
     */
    sellWeaponEffect(characterManager, gameState) {
        // Heal HP bằng độ bền của vũ khí
        const healAmount = this.durability;
        characterManager.healCharacterHP(healAmount, 0); // Heal ngay lập tức
        
        return {
            type: 'weapon_sold',
            healAmount: healAmount,
            effect: `Character được heal ${healAmount} HP từ phước lành của Tây Phong Kiếm`,
            sellValue: this.durability
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
            description: `<strong>${this.type}</strong> - Durability: <span class="durability-text">${this.durability}</span><br><i>Tây Phong Kiếm, biểu tượng danh dự của kỵ sĩ. Dâng lên Giáo Hội Tây Phong, người trao có thể nhận lại một phước lành làm dịu đi vết thương.</i>`,            durability: this.durability
        };
    }
} 
