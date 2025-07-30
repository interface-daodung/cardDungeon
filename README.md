# CardDungeon - Game Thẻ Bài Chiến Đấu

Một game thẻ bài chiến đấu với thiết kế responsive, tối ưu cho cả mobile và PC. Người chơi điều khiển một Warrior ở giữa bàn chơi 3x3, chiến đấu với các quái vật Fatui và thu thập vật phẩm.

## 🎮 Mô tả Game

CardDungeon là một game thẻ bài chiến đấu với cơ chế đơn giản nhưng thú vị:
- **Warrior** (Chiến binh) ở giữa bàn chơi với HP và vũ khí
- **Fatui** (Quái vật) xung quanh với HP khác nhau
- **Coin** (Đồng xu) để tăng điểm
- **Food** (Thức ăn) để hồi máu
- **Sword** (Kiếm) để tăng sát thương

## 🎯 Cách Chơi

### Mục Tiêu
- Tiêu diệt tất cả quái vật Fatui xung quanh
- Thu thập càng nhiều điểm càng tốt
- Giữ Warrior sống sót

### Cơ Chế Chơi
1. **Di Chuyển**: Kéo thả Warrior đến ô trống để di chuyển
2. **Tấn Công**: Di chuyển Warrior vào ô có quái vật để tấn công
3. **Thu Thập**: Di chuyển vào ô có vật phẩm để thu thập
4. **Hồi Máu**: Ăn Food để tăng HP
5. **Vũ Khí**: Thu thập Sword để tăng sát thương

### Điều Khiển
- **Desktop**: Click chuột để chọn và kéo thả
- **Mobile**: Chạm và giữ để kéo thả
- **Long Press**: Giữ lâu để xem thông tin thẻ

## 🎨 Tính Năng

### Gameplay
- ✅ **Chiến đấu turn-based** với hệ thống HP
- ✅ **Hệ thống vũ khí** với độ bền
- ✅ **Thu thập vật phẩm** (Coin, Food, Sword)
- ✅ **Hồi máu** với Food
- ✅ **Tăng điểm** với Coin
- ✅ **Tăng sát thương** với Sword

### Giao Diện
- ✅ **Responsive Design** - Tối ưu cho mọi thiết bị
- ✅ **Mobile-First** - Dễ sử dụng trên điện thoại
- ✅ **Touch Controls** - Hỗ trợ chạm và kéo thả
- ✅ **Visual Effects** - Animation mượt mà
- ✅ **Card Info Dialog** - Xem thông tin thẻ

### Hiệu Ứng
- ✅ **Combat Animation** - Hiệu ứng chiến đấu
- ✅ **Damage Popup** - Hiển thị sát thương
- ✅ **Card Movement** - Animation di chuyển
- ✅ **Death Animation** - Hiệu ứng chết
- ✅ **Heal Effect** - Hiệu ứng hồi máu

## 🏗️ Cấu Trúc Dự Án

```
CardDungeon/
├── index.html              # Giao diện HTML chính
├── script.js               # File khởi tạo game (chỉ 5 dòng)
├── styles.css              # CSS với responsive design
├── README.md               # Tài liệu hướng dẫn
├── favicon.ico             # Icon website
├── modules/                # Thư mục chứa các class riêng biệt
│   ├── CardManager.js      # Quản lý thẻ và tạo thẻ
│   ├── GameState.js        # Quản lý trạng thái game
│   ├── WarriorManager.js   # Quản lý Warrior
│   ├── AnimationManager.js # Quản lý animation
│   ├── UIManager.js        # Quản lý giao diện
│   ├── CombatManager.js    # Quản lý chiến đấu
│   ├── EventManager.js     # Quản lý events
│   └── WarriorCardGame.js  # Class chính điều phối
└── resources/              # Thư mục tài nguyên
    ├── Warrior.png         # Hình ảnh Warrior
    ├── Fatui0-3.png       # Hình ảnh quái vật
    ├── coin0-6.png        # Hình ảnh đồng xu
    ├── food0-1.png        # Hình ảnh thức ăn
    ├── sword0-2.png       # Hình ảnh kiếm
    ├── bomb.png           # Hình ảnh bom
    ├── bow0-2.png         # Hình ảnh cung
    ├── poison0.png        # Hình ảnh độc
    └── treasure*.png      # Hình ảnh kho báu
```

## 💻 Kiến Trúc Code (Modular)

### 🎯 **CardManager.js** - Quản Lý Thẻ
```javascript
// Chức năng chính:
- createCards()           # Tạo bộ thẻ ban đầu 3x3
- getRandomCardImage()    # Lấy hình ảnh thẻ ngẫu nhiên
- findWarriorIndex()      # Tìm vị trí Warrior
- findCardToMove()        # Tìm thẻ cần di chuyển (hiệu ứng domino)
- createRandomCard()      # Tạo thẻ mới ngẫu nhiên
```

### 🎮 **GameState.js** - Quản Lý Trạng Thái
```javascript
// Chức năng chính:
- score, moves            # Điểm số và số lượt
- draggedCard            # Thẻ đang được kéo
- dragStartPos           # Vị trí bắt đầu kéo
- longPressTimer         # Timer cho long press
```

### ⚔️ **WarriorManager.js** - Quản Lý Warrior
```javascript
// Chức năng chính:
- warriorHP              # HP của Warrior (0-10)
- warriorWeapon          # Độ bền vũ khí
- healFood1              # Số lượt hồi phục từ thức ăn đặc biệt
- processCardConsumption() # Xử lý khi ăn thẻ
```

### 🎨 **AnimationManager.js** - Quản Lý Animation
```javascript
// Chức năng chính:
- renderCards()          # Render thẻ lên màn hình
- createCardElement()    # Tạo element HTML cho thẻ
- startCombatAnimation() # Animation chiến đấu
- createDamagePopup()    # Hiển thị sát thương
- triggerGameOver()      # Hiệu ứng game over
```

### 🖥️ **UIManager.js** - Quản Lý Giao Diện
```javascript
// Chức năng chính:
- updateUI()             # Cập nhật giao diện
- showCardInfo()         # Hiển thị thông tin thẻ
- showValidTargets()     # Hiển thị ô có thể di chuyển
- isValidMove()          # Kiểm tra nước đi hợp lệ
```

### ⚔️ **CombatManager.js** - Quản Lý Chiến Đấu
```javascript
// Chức năng chính:
- attackMonsterWithWeapon() # Tấn công monster bằng vũ khí
- attackMonsterFromDistance() # Tấn công từ xa
- processCardEating()     # Xử lý khi ăn thẻ
- moveWarriorAfterCombat() # Di chuyển Warrior sau combat
```

### 🎮 **EventManager.js** - Quản Lý Events
```javascript
// Chức năng chính:
- setupCardEvents()       # Setup events cho thẻ
- handleDragStart()       # Xử lý bắt đầu kéo
- handleDrop()           # Xử lý thả thẻ
- moveWarrior()          # Di chuyển Warrior
- handleLongPress()      # Xử lý long press
```

### 🎯 **WarriorCardGame.js** - Class Chính
```javascript
// Chức năng chính:
- Khởi tạo tất cả managers
- Điều phối các module
- initializeGame()       # Khởi tạo game
```

## 🚀 Cách Chạy

### Phương Pháp 1: Mở Trực Tiếp
1. Tải xuống toàn bộ thư mục `CardDungeon`
2. Mở file `index.html` trong trình duyệt web
3. Bắt đầu chơi ngay!

### Phương Pháp 2: Local Server (Khuyến Nghị)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```
Sau đó truy cập `http://localhost:8000`

## 🎮 Hướng Dẫn Chơi Chi Tiết

### Bước 1: Khởi Động
- Game tự động tạo bàn chơi 3x3
- Warrior ở giữa với 10 HP
- Quái vật Fatui xung quanh với HP ngẫu nhiên

### Bước 2: Di Chuyển
- **Click/Kéo** Warrior đến ô trống
- **Chạm/Giữ** trên mobile để kéo thả
- Chỉ có thể di chuyển đến ô trống

### Bước 3: Chiến Đấu
- Di chuyển Warrior vào ô có quái vật
- Tự động tấn công với sát thương cơ bản
- Sử dụng vũ khí để tăng sát thương

### Bước 4: Thu Thập
- **Coin**: Tăng điểm số
- **Food**: Hồi máu Warrior
- **Sword**: Tăng sát thương

### Bước 5: Chiến Thắng
- Tiêu diệt tất cả quái vật
- Thu thập càng nhiều điểm càng tốt
- Giữ Warrior sống sót

## 🔧 Phát Triển Tiếp

### Thêm Tính Năng Mới
1. **Thêm loại thẻ mới**:
   ```javascript
   // Trong CardManager.js
   this.newCardImages = ['resources/newcard.png'];
   this.allCardImages = [...this.allCardImages, ...this.newCardImages];
   ```

2. **Thêm hiệu ứng mới**:
   ```css
   /* Trong styles.css */
   @keyframes newEffect {
       /* Animation code */
   }
   ```

3. **Thêm âm thanh**:
   ```javascript
   // Thêm audio elements vào HTML
   const audio = new Audio('sound.mp3');
   audio.play();
   ```

### Tối Ưu Hóa
- **Performance**: Lazy loading images
- **Accessibility**: ARIA labels
- **SEO**: Meta tags
- **PWA**: Service worker

## 📱 Tương Thích

### Trình Duyệt
- ✅ Chrome/Chromium (Khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

### Thiết Bị
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)
- ✅ Landscape mode

## 🎨 Thiết Kế

### Color Scheme
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Cards**: White with shadow
- **Text**: White with shadow
- **Buttons**: Bootstrap blue/red

### Typography
- **Font**: Arial, sans-serif
- **Headers**: Bold with shadow
- **Body**: Regular weight

### Layout
- **Grid**: CSS Grid 3x3
- **Flexbox**: Header và controls
- **Responsive**: Mobile-first approach

## 📊 Thống Kê Game

### Cơ Chế Điểm
- **Coin**: +1 điểm mỗi đồng
- **Fatui**: +2 điểm mỗi quái vật

### Hệ Thống HP
- **Warrior**: 10 HP ban đầu
- **Fatui**: 1-9 HP ngẫu nhiên
- **Heal**: 1-3 HP từ Food

### Vũ Khí
- **Durability**: 1-3 lượt sử dụng
- **Damage**: +1 sát thương
- **Stacking**: Có thể tích lũy

## 🤝 Đóng Góp

1. **Fork** repository
2. **Tạo branch** mới (`git checkout -b feature/AmazingFeature`)
3. **Commit** thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. **Push** lên branch (`git push origin feature/AmazingFeature`)
5. **Tạo Pull Request**

## 📄 License

MIT License - Tự do sử dụng và phát triển.

## 🙏 Tác Giả

CardDungeon được phát triển với ❤️ bằng HTML, CSS và JavaScript thuần, sử dụng kiến trúc modular để dễ bảo trì và mở rộng.

---

**Chúc bạn chơi game vui vẻ! 🎮** 