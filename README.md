# CardDungeon - Game Thẻ Bài Chiến Đấu

Một game thẻ bài chiến đấu với thiết kế responsive, tối ưu cho cả mobile và PC. Người chơi điều khiển một Warrior ở giữa bàn chơi 3x3, chiến đấu với các quái vật và thu thập vật phẩm.

## 🎮 Mô tả Game

CardDungeon là một game thẻ bài chiến đấu với cơ chế đơn giản nhưng thú vị:
- **Warrior** (Chiến binh) ở giữa bàn chơi với HP và vũ khí
- **Enemy** (Quái vật) xung quanh với HP khác nhau
- **Coin** (Đồng xu) để tăng điểm
- **Food** (Thức ăn) để hồi máu
- **Weapon** (Vũ khí) để tăng sát thương
- **Boom** (Bom) với countdown và explosion effect
- **Treasure** (Kho báu) với durability và interaction
- **Void** (Thẻ trống) không có tác dụng

## 🎯 Cách Chơi

### Mục Tiêu
- Tiêu diệt tất cả quái vật xung quanh
- Thu thập càng nhiều điểm càng tốt
- Giữ Warrior sống sót
- Tương tác với Treasure để nhận phần thưởng
- Tránh Boom explosion hoặc sử dụng chúng chiến lược

### Cơ Chế Chơi
1. **Di Chuyển**: Kéo thả Warrior đến ô trống để di chuyển
2. **Tấn Công**: Di chuyển Warrior vào ô có quái vật để tấn công
3. **Thu Thập**: Di chuyển vào ô có vật phẩm để thu thập
4. **Hồi Máu**: Ăn Food để tăng HP
5. **Vũ Khí**: Thu thập Weapon để tăng sát thương
6. **Tương Tác**: Click vào Treasure để nhận phần thưởng
7. **Boom**: Tránh hoặc sử dụng Boom explosion chiến lược

### Điều Khiển
- **Desktop**: Click chuột để chọn và kéo thả
- **Mobile**: Chạm và giữ để kéo thả
- **Long Press**: Giữ lâu để xem thông tin thẻ
- **New Game**: Bắt đầu game mới
- **Sell Weapon**: Bán vũ khí để lấy điểm (chỉ hiện khi có vũ khí)

## 🎨 Tính Năng

### Gameplay
- ✅ **Chiến đấu turn-based** với hệ thống HP
- ✅ **Hệ thống vũ khí** với độ bền
- ✅ **Thu thập vật phẩm** (Coin, Food, Weapon)
- ✅ **Hồi máu** với Food
- ✅ **Tăng điểm** với Coin
- ✅ **Tăng sát thương** với Weapon
- ✅ **Bán vũ khí** để lấy điểm
- ✅ **Boom cards** với countdown và explosion
- ✅ **Treasure interaction** với durability
- ✅ **Void cards** không có tác dụng
- ✅ **Tấn công từ xa** khi có vũ khí
- ✅ **Domino effect** khi di chuyển
- ✅ **Quicksand shuffle** effect

### Giao Diện
- ✅ **Responsive Design** - Tối ưu cho mọi thiết bị
- ✅ **Mobile-First** - Dễ sử dụng trên điện thoại
- ✅ **Touch Controls** - Hỗ trợ chạm và kéo thả
- ✅ **Visual Effects** - Animation mượt mà
- ✅ **Card Info Dialog** - Xem thông tin thẻ
- ✅ **Damage Popup** - Hiển thị sát thương
- ✅ **Boom Countdown Display** - Hiển thị countdown
- ✅ **Boom Damage Display** - Hiển thị damage

### Hiệu Ứng
- ✅ **Combat Animation** - Hiệu ứng chiến đấu
- ✅ **Damage Popup** - Hiển thị sát thương
- ✅ **Card Movement** - Animation di chuyển
- ✅ **Death Animation** - Hiệu ứng chết
- ✅ **Heal Effect** - Hiệu ứng hồi máu
- ✅ **Boom Explosion** - Hiệu ứng nổ với shake
- ✅ **Flip Card** - Hiệu ứng lật thẻ
- ✅ **Shuffle Animation** - Hiệu ứng xáo trộn
- ✅ **Appear Effect** - Hiệu ứng xuất hiện

## 📁 Cấu Trúc Dự Án

```
CardDungeon/
├── index.html              # Giao diện HTML chính
├── script.js               # File khởi tạo game
├── styles.css              # CSS với responsive design
├── README.md               # Tài liệu hướng dẫn
├── favicon.ico             # Icon website
├── modules/                # Thư mục chứa các class riêng biệt
│   ├── cards/              # Hệ thống thẻ (OOP)
│   │   ├── Card.js         # Class cơ bản cho tất cả thẻ
│   │   ├── Fatui0-3.js     # Quái vật Fatui
│   │   ├── Eremite0-1.js   # Quái vật Eremite
│   │   ├── AbyssLector0-2.js # Boss AbyssLector
│   │   ├── Apep.js         # Boss Apep
│   │   ├── Narwhal.js      # Boss Narwhal
│   │   ├── Operative.js    # Boss Operative
│   │   ├── Food0-3.js      # Thức ăn hồi phục
│   │   ├── Poison.js       # Thẻ độc
│   │   ├── Quicksand.js    # Thẻ cát lún
│   │   ├── Sword0-6.js     # Vũ khí kiếm
│   │   ├── Catalyst0-2.js  # Vũ khí pháp khí
│   │   ├── Coin0-6.js      # Đồng xu cơ bản
│   │   ├── CoinUp0-6.js    # Đồng xu nâng cấp
│   │   ├── Treasure0-1.js  # Kho báu
│   │   ├── Bribery.js      # Thẻ hối lộ
│   │   ├── Trap.js         # Thẻ bẫy
│   │   ├── Boom.js         # Thẻ bom
│   │   ├── Void.js         # Thẻ trống
│   │   ├── Warrior.js      # Nhân vật chính
│   │   └── CardFactory.js  # Factory tạo và quản lý thẻ
│   ├── CardManager.js      # Quản lý thẻ và tạo thẻ
│   ├── GameState.js        # Quản lý trạng thái game
│   ├── CharacterManager.js # Quản lý Character
│   ├── AnimationManager.js # Quản lý animation
│   ├── UIManager.js        # Quản lý giao diện
│   ├── CombatManager.js    # Quản lý chiến đấu
│   ├── EventManager.js     # Quản lý events
│   └── DungeonCardGame.js  # Class chính điều phối
└── resources/              # Thư mục tài nguyên
    ├── warrior.webp        # Hình ảnh Warrior
    ├── fatui0-3.webp       # Hình ảnh quái vật Fatui
    ├── eremite0-1.webp     # Hình ảnh quái vật Eremite
    ├── abyssLector0-2.webp # Hình ảnh boss AbyssLector
    ├── apep.webp           # Hình ảnh boss Apep
    ├── narwhal.webp        # Hình ảnh boss Narwhal
    ├── operative.webp      # Hình ảnh boss Operative
    ├── coin0-6.webp        # Hình ảnh đồng xu
    ├── coinUp0-6.webp      # Hình ảnh đồng xu nâng cấp
    ├── food0-3.webp        # Hình ảnh thức ăn
    ├── poison.webp         # Hình ảnh độc
    ├── quicksand.webp      # Hình ảnh cát lún
    ├── sword0-6.webp       # Hình ảnh kiếm
    ├── catalyst0-2.webp    # Hình ảnh pháp khí
    ├── treasure0-1.webp    # Hình ảnh kho báu
    ├── bribery.webp        # Hình ảnh hối lộ
    ├── trap.webp           # Hình ảnh bẫy
    ├── boom.webp           # Hình ảnh bom
    ├── void.webp           # Hình ảnh thẻ trống
    └── warrior.webp        # Hình ảnh nhân vật chính
```

## 💻 Kiến Trúc Code (Modular)

### 🃏 **Hệ Thống Thẻ** (modules/cards/)
```javascript
// Card.js - Class cơ bản cho tất cả thẻ
- cardEffect()            # Hiệu ứng khi thẻ bị ăn
- getDisplayInfo()        # Thông tin hiển thị cho dialog
- clone()                 # Tạo bản sao thẻ

// Boom.js - Thẻ bom với countdown
- countdown               # Đếm ngược
- damage                 # Sát thương explosion
- explodeEffect()         # Hiệu ứng nổ
- interactWithCharacter() # Tương tác với character

// Treasure.js - Kho báu với durability
- durability              # Độ bền
- interactWithCharacter() # Tương tác với character

// Void.js - Thẻ trống
- score = 0              # Không cộng điểm
- Không hiển thị score display

// CardFactory.js - Factory tạo và quản lý thẻ
- createRandomCard()      # Tạo thẻ ngẫu nhiên
- createCard(type)        # Tạo thẻ theo loại
- createVoid()           # Tạo thẻ Void
- getAllCardTypes()       # Lấy danh sách tất cả loại thẻ
```

### 🎯 **CardManager.js** - Quản Lý Thẻ
```javascript
// Chức năng chính:
- createCards()           # Tạo bộ thẻ ban đầu 3x3
- findCharacterIndex()    # Tìm vị trí Character
- findCardToMove()        # Tìm thẻ cần di chuyển (hiệu ứng domino)
- createRandomCard()      # Tạo thẻ mới ngẫu nhiên
- updateCard()            # Cập nhật thẻ tại vị trí
- setAllCards()           # Cập nhật toàn bộ bộ thẻ
```

### 🎮 **GameState.js** - Quản Lý Trạng Thái
```javascript
// Chức năng chính:
- score, moves            # Điểm số và số lượt
- draggedCard            # Thẻ đang được kéo
- dragStartPos           # Vị trí bắt đầu kéo
- longPressTimer         # Timer cho long press
- touchStartTime         # Thời gian bắt đầu touch
```

### ⚔️ **CharacterManager.js** - Quản Lý Character
```javascript
// Chức năng chính:
- characterHP            # HP của Character (0-10)
- characterWeapon        # Độ bền vũ khí
- characterElementCoin   # Element coin cho dynamic coin
- recovery              # Số lượt hồi phục từ thức ăn đặc biệt
- poisoned              # Số lượt độc còn lại
- sellWeapon()          # Bán vũ khí để lấy điểm
- updateCharacterHP()    # Cập nhật HP character
- getCharacterHP()       # Lấy HP hiện tại
- getCharacterWeapon()   # Lấy weapon hiện tại
```

### 🎨 **AnimationManager.js** - Quản Lý Animation
```javascript
// Chức năng chính:
- renderCards()          # Render thẻ lên màn hình
- createCardElement()    # Tạo element HTML cho thẻ
- startCombatAnimation() # Animation chiến đấu
- createDamagePopup()    # Hiển thị sát thương
- triggerGameOver()      # Hiệu ứng game over
- startBoomExplosionAnimation() # Animation boom explosion
- flipCards()            # Animation lật thẻ
- updateBoomDisplay()    # Cập nhật hiển thị boom countdown
- updateCharacterDisplay() # Cập nhật hiển thị character
```

### 🖥️ **UIManager.js** - Quản Lý Giao Diện
```javascript
// Chức năng chính:
- updateUI()             # Cập nhật giao diện
- showCardInfo()         # Hiển thị thông tin thẻ
- showValidTargets()     # Hiển thị ô có thể di chuyển
- isValidMove()          # Kiểm tra nước đi hợp lệ
- updateSellButtonVisibility() # Cập nhật hiển thị nút bán vũ khí
```

### ⚔️ **CombatManager.js** - Quản Lý Chiến Đấu
```javascript
// Chức năng chính:
- attackMonsterWithWeapon() # Tấn công monster bằng vũ khí
- attackMonsterFromDistance() # Tấn công từ xa
- processCardEating()     # Xử lý khi ăn thẻ
- moveWarriorAfterCombat() # Di chuyển Warrior sau combat
- checkGameOver()         # Kiểm tra game over
```

### 🎮 **EventManager.js** - Quản Lý Events
```javascript
// Chức năng chính:
- setupCardEvents()       # Setup events cho thẻ
- handleDragStart()       # Xử lý bắt đầu kéo
- handleDrop()           # Xử lý thả thẻ
- moveCharacter()         # Di chuyển Character
- handleLongPress()      # Xử lý long press
- interactWithTreasure() # Tương tác với treasure
- interactWithBoom()     # Tương tác với boom
- decreaseBoomCountdown() # Giảm countdown boom
- handleBoomExplosion()  # Xử lý boom explosion
```

### 🎯 **DungeonCardGame.js** - Class Chính
```javascript
// Chức năng chính:
- Khởi tạo tất cả managers
- Điều phối các module
- initializeGame()       # Khởi tạo game
- onNewGame()           # Bắt đầu game mới
- onSellWeapon()        # Bán vũ khí
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
- Quái vật xung quanh với HP ngẫu nhiên
- Boom cards với countdown 5

### Bước 2: Di Chuyển
- **Click/Kéo** Warrior đến ô trống
- **Chạm/Giữ** trên mobile để kéo thả
- Chỉ có thể di chuyển đến ô trống
- **Domino effect** khi di chuyển

### Bước 3: Chiến Đấu
- Di chuyển Warrior vào ô có quái vật
- Tự động tấn công với sát thương cơ bản
- Sử dụng vũ khí để tăng sát thương
- **Tấn công từ xa** khi có vũ khí

### Bước 4: Thu Thập & Tương Tác
- **Coin**: Tăng điểm số
- **Food**: Hồi máu Warrior
- **Weapon**: Tăng sát thương
- **Treasure**: Click để tương tác và nhận phần thưởng
- **Boom**: Tránh hoặc sử dụng chiến lược

### Bước 5: Boom Mechanics
- **Countdown**: Giảm 1 sau mỗi move
- **Explosion**: Khi countdown = 0, gây damage cho thẻ liền kề
- **Interaction**: Click để đổi vị trí với character
- **Damage**: Gây damage cho enemy, food, coin, weapon

### Bước 6: Chiến Thắng
- Tiêu diệt tất cả quái vật
- Thu thập càng nhiều điểm càng tốt
- Giữ Warrior sống sót
- Tương tác với treasure để nhận phần thưởng

## 🎨 Tính Năng Mới

### 🧨 **Boom Cards**
- **Countdown**: 5 lượt trước khi nổ
- **Damage**: 10-18 sát thương ngẫu nhiên
- **Explosion**: Gây damage cho thẻ liền kề
- **Interaction**: Đổi vị trí với character
- **Display**: Hiển thị damage và countdown

### 💎 **Treasure Cards**
- **Durability**: Số lần có thể tương tác
- **Interaction**: Click để nhận phần thưởng
- **Rewards**: Coin, Food, Weapon tùy theo loại
- **Display**: Hiển thị durability và score

### 🕳️ **Void Cards**
- **Không có tác dụng**: Không cộng điểm
- **Không hiển thị score**: CSS ẩn score display
- **Chỉ tạo bởi hàm cụ thể**: Không xuất hiện ngẫu nhiên
- **Thay thế thẻ bị hủy**: Từ Boom explosion

### ⚔️ **Tấn Công Từ Xa**
- **Khi có vũ khí**: Có thể tấn công enemy từ xa
- **Không di chuyển**: Character không đổi vị trí
- **Giảm weapon durability**: Mỗi lần tấn công
- **Vẫn tính move**: Tăng số lượt di chuyển

### 🔄 **Domino Effect**
- **Khi di chuyển**: Thẻ khác bị đẩy theo
- **Animation**: Hiệu ứng đẩy mượt mà
- **Logic**: Tìm thẻ cần di chuyển tự động

### 🌊 **Quicksand Shuffle**
- **Khi ăn Quicksand**: Xáo trộn toàn bộ bàn chơi
- **Animation**: Flip card effect
- **Random**: Vị trí mới ngẫu nhiên

## 🔧 Phát Triển Tiếp

### Thêm Tính Năng Mới
1. **Thêm loại thẻ mới**:
   ```javascript
   // Trong CardFactory.js
   this.cardClasses['NewCard'] = NewCard;
   this.cardWeights['NewCard'] = 5;
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
- **Boom**: Red border và shake effect
- **Void**: Không có màu đặc biệt

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
- **Coin**: +1-6 điểm mỗi đồng (tùy loại)
- **Enemy**: +1-9 điểm mỗi quái vật
- **Treasure**: +1-5 điểm mỗi kho báu
- **Void**: 0 điểm

### Hệ Thống HP
- **Warrior**: 10 HP ban đầu
- **Enemy**: 1-9 HP ngẫu nhiên
- **Heal**: 1-3 HP từ Food
- **Boom Damage**: 10-18 sát thương

### Vũ Khí
- **Durability**: 1-16 lượt sử dụng (tùy loại)
- **Damage**: +1 sát thương
- **Stacking**: Có thể tích lũy
- **Sell**: Bán để lấy điểm

### Boom Mechanics
- **Countdown**: 5 lượt ban đầu
- **Damage**: 10-18 sát thương
- **Range**: 4 ô liền kề (trên, dưới, trái, phải)
- **Interaction**: Đổi vị trí với character

## 🤝 Đóng Góp

1. **Fork** repository
2. **Tạo branch** mới (`git checkout -b feature/AmazingFeature`)
3. **Commit** thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. **Push** lên branch (`git push origin feature/AmazingFeature`)
5. **Tạo Pull Request**

## 📄 License

MIT License - Tự do sử dụng và phát triển.

## 👨‍💻 Tác Giả

CardDungeon được phát triển với ❤️ bằng HTML, CSS và JavaScript thuần, sử dụng kiến trúc modular để dễ bảo trì và mở rộng.

---

**Chúc bạn chơi game vui vẻ! 🎮** 