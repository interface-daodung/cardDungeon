// CardManager.js - Quản lý thẻ và tạo thẻ
// Chức năng: Tạo, quản lý và xử lý các thẻ trong game
class CardManager {
    constructor() {
        this.cards = []; // Mảng chứa tất cả thẻ trong game
        this.initializeCardImages(); // Khởi tạo danh sách hình ảnh thẻ
    }

    // Khởi tạo danh sách hình ảnh cho từng loại thẻ
    initializeCardImages() {
        // Hình ảnh cho quái vật Fatui (4 loại)
        this.fatuiImages = [
            'resources/Fatui0.webp', 'resources/Fatui1.webp',
            'resources/Fatui2.webp', 'resources/Fatui3.webp'
        ];
        
        // Hình ảnh cho tiền xu (7 loại)
        this.coinImages = [
            'resources/coin0.webp', 'resources/coin1.webp', 'resources/coin2.webp',
            'resources/coin3.webp', 'resources/coin4.webp', 'resources/coin5.webp', 'resources/coin6.webp'
        ];
        
        // Hình ảnh cho thức ăn (2 loại)
        this.foodImages = ['resources/food0.webp', 'resources/food1.webp'];
        
        // Hình ảnh cho vũ khí (3 loại)
        this.swordImages = ['resources/sword0.webp', 'resources/sword1.webp', 'resources/sword2.webp'];
        
        // Tổng hợp tất cả hình ảnh thẻ
        this.allCardImages = [...this.fatuiImages, ...this.coinImages, ...this.foodImages, ...this.swordImages];
    }

    // Tạo bộ thẻ ban đầu cho game (9 thẻ)
    createCards() {
        this.cards = []; // Reset mảng thẻ
        const centerIndex = 4; // Vị trí trung tâm (hàng 2, cột 2)
        
        // Tạo 9 thẻ cho lưới 3x3
        for (let i = 0; i < 9; i++) {
            if (i === centerIndex) {
                // Tạo thẻ Warrior ở vị trí trung tâm
                this.cards.push({
                    id: i, 
                    type: 'warrior', 
                    image: 'resources/Warrior.webp',
                    position: { row: Math.floor(i / 3), col: i % 3 } // Tính toán vị trí hàng, cột
                });
            } else {
                // Tạo thẻ ngẫu nhiên cho các vị trí khác
                const randomCardImage = this.getRandomCardImage(); // Lấy hình ảnh ngẫu nhiên
                const randomCardType = this.getCardType(randomCardImage); // Xác định loại thẻ
                
                this.cards.push({
                    id: i, 
                    type: randomCardType, 
                    image: randomCardImage,
                    position: { row: Math.floor(i / 3), col: i % 3 },
                    
                    // Thuộc tính đặc biệt cho từng loại thẻ
                    score: randomCardType === 'coin' ? this.getRandomScore('coin') : null, // Điểm cho tiền xu
                    hp: randomCardType === 'fatuice' ? Math.floor(Math.random() * 9) + 1 : null, // HP cho quái vật
                    heal: randomCardType === 'food' ? (randomCardImage === 'resources/food1.webp' ? 
                        this.getRandomHealAmountFood1() : this.getRandomHealAmount()) : null, // Hồi phục cho thức ăn
                    durability: randomCardType === 'sword' ? this.getRandomWeaponDurability() : null // Độ bền cho vũ khí
                });
            }
        }
        return this.cards;
    }

    // Lấy hình ảnh thẻ ngẫu nhiên từ danh sách
    getRandomCardImage() {
        const randomIndex = Math.floor(Math.random() * this.allCardImages.length);
        return this.allCardImages[randomIndex];
    }

    // Xác định loại thẻ dựa trên tên hình ảnh
    getCardType(imageName) {
        if (this.fatuiImages.includes(imageName)) return 'fatuice'; // Quái vật
        if (this.coinImages.includes(imageName)) return 'coin'; // Tiền xu
        if (this.foodImages.includes(imageName)) return 'food'; // Thức ăn
        if (this.swordImages.includes(imageName)) return 'sword'; // Vũ khí
        return 'fatuice'; // Mặc định là quái vật
    }

    // Tạo điểm số ngẫu nhiên cho thẻ
    getRandomScore(cardType) {
        if (cardType === 'coin' || cardType === 'fatuice') {
            return Math.floor(Math.random() * 9) + 1; // 1-9 điểm
        }
        return 0; // Các thẻ khác không có điểm
    }

    // Tạo lượng hồi phục ngẫu nhiên cho thức ăn thường
    getRandomHealAmount() {
        return Math.floor(Math.random() * 9) + 1; // 1-9 HP
    }

    // Tạo lượng hồi phục ngẫu nhiên cho thức ăn đặc biệt (food1)
    getRandomHealAmountFood1() {
        return Math.floor(Math.random() * 11) + 2; // 2-12 HP
    }

    // Tạo độ bền ngẫu nhiên cho vũ khí
    getRandomWeaponDurability() {
        return Math.floor(Math.random() * 9) + 1; // 1-9 độ bền
    }

    // Tìm vị trí của thẻ Warrior trong mảng thẻ
    findWarriorIndex() {
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].type === 'warrior') return i;
        }
        return null; // Không tìm thấy Warrior
    }

    // Tìm thẻ cần di chuyển khi Warrior di chuyển (hiệu ứng domino)
    findCardToMove(fromIndex, toIndex) {
        // Tính toán vị trí bắt đầu và kết thúc
        const fromPos = { row: Math.floor(fromIndex / 3), col: fromIndex % 3 };
        const toPos = { row: Math.floor(toIndex / 3), col: toIndex % 3 };
        
        // Xác định hướng di chuyển của Warrior
        let direction = '';
        if (toPos.row < fromPos.row) direction = 'up'; // Di chuyển lên
        else if (toPos.row > fromPos.row) direction = 'down'; // Di chuyển xuống
        else if (toPos.col < fromPos.col) direction = 'left'; // Di chuyển trái
        else if (toPos.col > fromPos.col) direction = 'right'; // Di chuyển phải
        
        // Tìm thẻ cần di chuyển theo hướng
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            // Chỉ di chuyển thẻ không phải Warrior và không phải thẻ đích
            if (card && (card.type === 'fatuice' || card.type === 'coin' || card.type === 'food' || card.type === 'sword') && i !== toIndex) {
                const cardPos = { row: Math.floor(i / 3), col: i % 3 };
                let shouldMove = false;
                
                // Kiểm tra xem thẻ có nên di chuyển theo hướng không
                switch (direction) {
                    case 'up': shouldMove = cardPos.row > fromPos.row && cardPos.col === fromPos.col; break; // Thẻ ở dưới cùng cột
                    case 'down': shouldMove = cardPos.row < fromPos.row && cardPos.col === fromPos.col; break; // Thẻ ở trên cùng cột
                    case 'left': shouldMove = cardPos.col > fromPos.col && cardPos.row === fromPos.row; break; // Thẻ ở phải cùng hàng
                    case 'right': shouldMove = cardPos.col < fromPos.col && cardPos.row === fromPos.row; break; // Thẻ ở trái cùng hàng
                }
                
                if (shouldMove) return { card, fromIndex: i }; // Trả về thẻ cần di chuyển
            }
        }
        return null; // Không có thẻ nào cần di chuyển
    }

    // Tạo thẻ ngẫu nhiên mới tại vị trí chỉ định
    createRandomCard(index) {
        const randomCardImage = this.getRandomCardImage(); // Lấy hình ảnh ngẫu nhiên
        const randomCardType = this.getCardType(randomCardImage); // Xác định loại thẻ
        return {
            id: index, 
            type: randomCardType, 
            image: randomCardImage,
            position: { row: Math.floor(index / 3), col: index % 3 }, // Tính toán vị trí
            score: randomCardType === 'coin' ? this.getRandomScore('coin') : null, // Điểm cho tiền xu
            hp: randomCardType === 'fatuice' ? Math.floor(Math.random() * 9) + 1 : null, // HP cho quái vật
            heal: randomCardType === 'food' ? (randomCardImage === 'resources/food1.webp' ? 
                this.getRandomHealAmountFood1() : this.getRandomHealAmount()) : null, // Hồi phục cho thức ăn
            durability: randomCardType === 'sword' ? this.getRandomWeaponDurability() : null // Độ bền cho vũ khí
        };
    }

    // Cập nhật thẻ tại vị trí chỉ định
    updateCard(index, card) {
        this.cards[index] = card;
    }

    // Lấy thẻ tại vị trí chỉ định
    getCard(index) {
        return this.cards[index];
    }

    // Lấy tất cả thẻ trong game
    getAllCards() {
        return this.cards;
    }

    // Kiểm tra xem game đã hoàn thành chưa (tất cả thẻ đều là Warrior)
    isGameComplete() {
        return this.cards.every(card => card.type === 'warrior');
    }
} 