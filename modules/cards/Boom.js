// Boom.js - Thẻ bom
// Chức năng: Thẻ bom gây hại cho người chơi

class Boom extends Card {
    constructor() {
        super(
            "Bom nổ", 
            "boom", 
            "resources/boom.webp", 
            "Bom nổ"
        );
        this.damage = Math.floor(Math.random() * 9) + 10; // Sát thương của bom
        this.countdown = 5; // Đếm ngược
    }



    /**
     * Tương tác với character (tương tự treasure)
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý cards
     * @param {number} boomIndex - Index của boom card
     * @returns {Object} Thông tin kết quả
     */
    interactWithCharacter(characterManager, gameState, cardManager, boomIndex) {
        // Tìm vị trí character
        const characterIndex = cardManager.findCharacterIndex();
        
        if (characterIndex !== null && boomIndex !== null) {
            // Lấy toàn bộ mảng cards hiện tại
            const cards = cardManager.getAllCards();
            
            // Đổi vị trí character và boom trong mảng
            const temp = cards[characterIndex];
            cards[characterIndex] = cards[boomIndex];
            cards[boomIndex] = temp;
            
            // Cập nhật id và position cho cả hai cards
            if (cards[characterIndex]) {
                cards[characterIndex].id = characterIndex;
                cards[characterIndex].position = { row: Math.floor(characterIndex / 3), col: characterIndex % 3 };
            }
            if (cards[boomIndex]) {
                cards[boomIndex].id = boomIndex;
                cards[boomIndex].position = { row: Math.floor(boomIndex / 3), col: boomIndex % 3 };
            }
            
            // Cập nhật toàn bộ mảng cards
            cardManager.setAllCards(cards);
            
            return {
                type: 'boom_interact',
                effect: `Boom đổi vị trí với character!`,
                characterPosition: boomIndex,
                boomPosition: characterIndex
            };
        }
        
        return {
            type: 'boom_interact',
            effect: `Tương tác với Boom!`
        };
    }

    /**
     * Hiệu ứng khi boom nổ (countdown = 0)
     * @param {CharacterManager} characterManager - Manager quản lý character
     * @param {GameState} gameState - Manager quản lý game state
     * @param {CardManager} cardManager - Manager quản lý cards
     * @param {number} boomIndex - Index của boom card
     * @param {AnimationManager} animationManager - Manager quản lý animation (optional)
     * @returns {Object} Thông tin kết quả
     */
    explodeEffect(characterManager, gameState, cardManager, boomIndex, animationManager = null) {
        // Cập nhật vị trí character trước khi kiểm tra
        const cards = cardManager.getAllCards();
        let characterIndex = null;
        
        // Tìm character trong mảng cards hiện tại
        for (let i = 0; i < cards.length; i++) {
            if (cards[i] && cards[i].type === 'character') {
                characterIndex = i;
                break;
            }
        }
        
        console.log(`💥 Character thực tế tại index: ${characterIndex}`);
        
        // Tìm các thẻ liền kề (trên, dưới, trái, phải)
        const adjacentCards = this.getAdjacentCards(cardManager, boomIndex);
        console.log(`💥 Boom tại index ${boomIndex}: adjacentCards =`, adjacentCards);
        
        // Gây damage cho character nếu character ở gần
        if (characterIndex !== null && adjacentCards.includes(characterIndex)) {
            console.log(`💥 Character ở gần boom! Gây ${this.damage} damage`);
            characterManager.updateCharacterHP(this.damage);
            
            // Kiểm tra game over sau khi gây damage
            if (characterManager.getCharacterHP() <= 0) {
                console.log(`💀 Character HP = 0 do boom, triggering game over!`);
                // Trigger game over thông qua animationManager nếu có
                if (animationManager) {
                    animationManager.triggerGameOver();
                }
            }
        } else {
            console.log(`💥 Character không ở gần boom hoặc không tồn tại`);
        }
        
        // Gây damage cho các thẻ khác (không phải character)
        const affectedNonCharacterCards = [];
        for (const cardIndex of adjacentCards) {
            if (cardIndex !== characterIndex) {
                const card = cardManager.getCard(cardIndex);
                if (card) {
                    // Gây damage cho enemy cards
                    if (card.type === 'enemy' && card.hp !== undefined && card.hp > 0) {
                        const originalHP = card.hp;
                        console.log(`💥 Enemy ${card.nameId} tại index ${cardIndex}: HP ban đầu = ${originalHP}, damage = ${this.damage}`);
                        card.hp -= this.damage;
                        console.log(`💥 Enemy ${card.nameId} sau damage: HP = ${card.hp}`);
                        
                        if (card.hp <= 0) {
                            card.hp = 0; // Đảm bảo HP không âm
                            console.log(`💥 Enemy ${card.nameId} HP = 0, sẽ chết!`);
                            
                            // Chạy killByWeaponEffect nếu có
                            if (typeof card.killByWeaponEffect === 'function') {
                                console.log(`💥 Enemy ${card.nameId} bị giết bởi boom, chạy killByWeaponEffect`);
                                const killResult = card.killByWeaponEffect(characterManager, gameState);
                                console.log(`💥 Kill result:`, killResult);
                                
                                // Xử lý kết quả từ killByWeaponEffect
                                if (killResult && killResult.reward) {
                                    if (killResult.reward.type === 'coin') {
                                        // Tạo coin mặc định
                                        const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
                                        coinCard.id = cardIndex;
                                        coinCard.position = { 
                                            row: Math.floor(cardIndex / 3), 
                                            col: cardIndex % 3 
                                        };
                                        console.log(`💥 Tạo coin từ killByWeaponEffect: ${coinCard.nameId} tại index ${cardIndex}`);
                                        cardManager.updateCard(cardIndex, coinCard);
                                    } else if (killResult.reward.type === 'food3') {
                                        // Tạo Food3 card
                                        const foodCard = cardManager.cardFactory.createCard('Food3');
                                        foodCard.id = cardIndex;
                                        foodCard.position = { 
                                            row: Math.floor(cardIndex / 3), 
                                            col: cardIndex % 3 
                                        };
                                        console.log(`💥 Tạo Food3 từ killByWeaponEffect: ${foodCard.nameId} tại index ${cardIndex}`);
                                        cardManager.updateCard(cardIndex, foodCard);
                                    }
                                } else {
                                    // Tạo coin mặc định nếu không có reward
                                    const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
                                    coinCard.id = cardIndex;
                                    coinCard.position = { 
                                        row: Math.floor(cardIndex / 3), 
                                        col: cardIndex % 3 
                                    };
                                    console.log(`💥 Tạo coin mặc định: ${coinCard.nameId} tại index ${cardIndex}`);
                                    cardManager.updateCard(cardIndex, coinCard);
                                }
                            } else {
                                // Tạo coin theo mặc định nếu không có killByWeaponEffect
                                console.log(`💥 Enemy ${card.nameId} bị giết bởi boom, tạo coin mặc định`);
                                // Tạo coin ngay tại đây và thay thế thẻ
                                const coinCard = cardManager.cardFactory.createDynamicCoin(characterManager);
                                coinCard.id = cardIndex;
                                coinCard.position = { 
                                    row: Math.floor(cardIndex / 3), 
                                    col: cardIndex % 3 
                                };
                                console.log(`💥 Tạo coin mới: ${coinCard.nameId} tại index ${cardIndex}`);
                                cardManager.updateCard(cardIndex, coinCard);
                                console.log(`💥 Đã thay thế enemy bằng coin trong cardManager`);
                            }
                        } else {
                            // HP chưa về 0, chạy attackByWeaponEffect nếu có
                            if (typeof card.attackByWeaponEffect === 'function') {
                                console.log(`💥 Enemy ${card.nameId} bị damage bởi boom, chạy attackByWeaponEffect`);
                                card.attackByWeaponEffect(characterManager, gameState);
                            }
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'enemy',
                            damage: this.damage,
                            remainingHP: card.hp,
                            wasKilled: originalHP > 0 && card.hp === 0
                        });
                    }
                    // Gây damage cho food cards (Food0-3)
                    else if (card.type === 'food' && card.heal !== undefined && card.heal > 0) {
                        const originalHeal = card.heal;
                        console.log(`💥 Food ${card.nameId} tại index ${cardIndex}: heal ban đầu = ${originalHeal}, damage = ${this.damage}`);
                        card.heal -= this.damage;
                        console.log(`💥 Food ${card.nameId} sau damage: heal = ${card.heal}`);
                        
                        if (card.heal <= 0) {
                            card.heal = 0; // Đảm bảo heal không âm
                            console.log(`💥 Food ${card.nameId} heal = 0, tạo thẻ void!`);
                            
                            // Tạo thẻ void thay thế
                            const voidCard = cardManager.cardFactory.createVoid();
                            voidCard.id = cardIndex;
                            voidCard.position = { 
                                row: Math.floor(cardIndex / 3), 
                                col: cardIndex % 3 
                            };
                            console.log(`💥 Tạo void thay thế food: ${voidCard.nameId} tại index ${cardIndex}`);
                            cardManager.updateCard(cardIndex, voidCard);
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'food',
                            damage: this.damage,
                            remainingHeal: card.heal,
                            wasKilled: originalHeal > 0 && card.heal === 0
                        });
                    }
                    // Gây damage cho poison cards
                    else if (card.type === 'poison' && card.poisonDuration !== undefined && card.poisonDuration > 0) {
                        const originalPoisonDuration = card.poisonDuration;
                        const originalHeal = card.heal;
                        console.log(`💥 Poison ${card.nameId} tại index ${cardIndex}: poisonDuration ban đầu = ${originalPoisonDuration}, heal = ${originalHeal}, damage = ${this.damage}`);
                        
                        card.poisonDuration -= this.damage;
                        card.heal -= this.damage;
                        console.log(`💥 Poison ${card.nameId} sau damage: poisonDuration = ${card.poisonDuration}, heal = ${card.heal}`);
                        
                        if (card.poisonDuration <= 0 || card.heal <= 0) {
                            card.poisonDuration = Math.max(0, card.poisonDuration);
                            card.heal = Math.max(0, card.heal);
                            console.log(`💥 Poison ${card.nameId} poisonDuration hoặc heal = 0, tạo thẻ void!`);
                            
                            // Tạo thẻ void thay thế
                            const voidCard = cardManager.cardFactory.createVoid();
                            voidCard.id = cardIndex;
                            voidCard.position = { 
                                row: Math.floor(cardIndex / 3), 
                                col: cardIndex % 3 
                            };
                            console.log(`💥 Tạo void thay thế poison: ${voidCard.nameId} tại index ${cardIndex}`);
                            cardManager.updateCard(cardIndex, voidCard);
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'poison',
                            damage: this.damage,
                            remainingPoisonDuration: card.poisonDuration,
                            remainingHeal: card.heal,
                            wasKilled: (originalPoisonDuration > 0 && card.poisonDuration === 0) || (originalHeal > 0 && card.heal === 0)
                        });
                    }
                    // Gây damage cho coin cards
                    else if (card.type === 'coin' && card.score !== undefined && card.score > 0) {
                        const originalScore = card.score;
                        console.log(`💥 Coin ${card.nameId} tại index ${cardIndex}: score ban đầu = ${originalScore}, damage = ${this.damage}`);
                        card.score -= this.damage;
                        console.log(`💥 Coin ${card.nameId} sau damage: score = ${card.score}`);
                        
                        if (card.score <= 0) {
                            card.score = 0; // Đảm bảo score không âm
                            console.log(`💥 Coin ${card.nameId} score = 0, tạo thẻ void!`);
                            
                            // Tạo thẻ void thay thế
                            const voidCard = cardManager.cardFactory.createVoid();
                            voidCard.id = cardIndex;
                            voidCard.position = { 
                                row: Math.floor(cardIndex / 3), 
                                col: cardIndex % 3 
                            };
                            console.log(`💥 Tạo void thay thế coin: ${voidCard.nameId} tại index ${cardIndex}`);
                            cardManager.updateCard(cardIndex, voidCard);
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'coin',
                            damage: this.damage,
                            remainingScore: card.score,
                            wasKilled: originalScore > 0 && card.score === 0
                        });
                    }
                    // Gây damage cho weapon cards (Sword, Catalyst)
                    else if ((card.type === 'weapon' || card.type === 'sword') && card.durability !== undefined && card.durability > 0) {
                        const originalDurability = card.durability;
                        console.log(`💥 Weapon ${card.nameId} tại index ${cardIndex}: durability ban đầu = ${originalDurability}, damage = ${this.damage}`);
                        card.durability -= this.damage;
                        console.log(`💥 Weapon ${card.nameId} sau damage: durability = ${card.durability}`);
                        
                        if (card.durability <= 0) {
                            card.durability = 0; // Đảm bảo durability không âm
                            console.log(`💥 Weapon ${card.nameId} durability = 0, tạo thẻ void!`);
                            
                            // Tạo thẻ void thay thế
                            const voidCard = cardManager.cardFactory.createVoid();
                            voidCard.id = cardIndex;
                            voidCard.position = { 
                                row: Math.floor(cardIndex / 3), 
                                col: cardIndex % 3 
                            };
                            console.log(`💥 Tạo void thay thế weapon: ${voidCard.nameId} tại index ${cardIndex}`);
                            cardManager.updateCard(cardIndex, voidCard);
                        }
                        
                        affectedNonCharacterCards.push({
                            index: cardIndex,
                            type: 'weapon',
                            damage: this.damage,
                            remainingDurability: card.durability,
                            wasKilled: originalDurability > 0 && card.durability === 0
                        });
                    }
                    // Có thể thêm logic cho các loại thẻ khác ở đây
                }
            }
        }
        
        // Tạo thẻ ngẫu nhiên thay thế boom
        const newCard = cardManager.cardFactory.createRandomCard(characterManager);
        newCard.id = boomIndex;
        newCard.position = { row: Math.floor(boomIndex / 3), col: boomIndex % 3 };
        
        return {
            type: 'boom_exploded',
            effect: `Boom nổ! Gây ${this.damage} damage cho các thẻ liền kề!`,
            damage: this.damage,
            adjacentCards: adjacentCards,
            affectedNonCharacterCards: affectedNonCharacterCards,
            newCard: newCard,
            boomIndex: boomIndex
        };
    }

    /**
     * Lấy danh sách các thẻ liền kề
     * @param {CardManager} cardManager - Manager quản lý cards
     * @param {number} boomIndex - Index của boom card
     * @returns {Array} Mảng các index của thẻ liền kề
     */
    getAdjacentCards(cardManager, boomIndex) {
        const adjacentCards = [];
        const boomRow = Math.floor(boomIndex / 3);
        const boomCol = boomIndex % 3;
        
        console.log(`💥 Boom position: row=${boomRow}, col=${boomCol}`);
        
        // Kiểm tra các vị trí liền kề
        const adjacentPositions = [
            { row: boomRow - 1, col: boomCol }, // Trên
            { row: boomRow + 1, col: boomCol }, // Dưới
            { row: boomRow, col: boomCol - 1 }, // Trái
            { row: boomRow, col: boomCol + 1 }  // Phải
        ];
        
        for (const pos of adjacentPositions) {
            // Kiểm tra vị trí hợp lệ (trong grid 3x3)
            if (pos.row >= 0 && pos.row < 3 && pos.col >= 0 && pos.col < 3) {
                const index = pos.row * 3 + pos.col;
                const card = cardManager.getCard(index);
                console.log(`💥 Checking position (${pos.row}, ${pos.col}) = index ${index}, card type: ${card ? card.type : 'null'}`);
                if (card && card.type !== 'boom') { // Không bao gồm boom khác
                    adjacentCards.push(index);
                    console.log(`💥 Added ${card.type} at index ${index} to adjacent cards`);
                }
            } else {
                console.log(`💥 Position (${pos.row}, ${pos.col}) is out of bounds`);
            }
        }
        
        console.log(`💥 Final adjacent cards:`, adjacentCards);
        return adjacentCards;
    }

    /**
     * Lấy thông tin hiển thị cho dialog
     * @returns {Object} Thông tin để hiển thị
     */
    getDisplayInfo() {
        const baseInfo = super.getDisplayInfo();
        return {
            ...baseInfo,
            description: `Nổ Định Hướng Có Kiểm Soát - Gây ${this.damage} sát thương`,
            damage: this.damage
        };
    }
} 
