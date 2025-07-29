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
├── index.html          # Giao diện HTML chính
├── script.js           # Logic game JavaScript
├── styles.css          # CSS với responsive design
├── README.md           # Tài liệu hướng dẫn
├── favicon.ico         # Icon website
└── resources/          # Thư mục tài nguyên
    ├── Warrior.png     # Hình ảnh Warrior
    ├── Fatui0-3.png   # Hình ảnh quái vật
    ├── coin0-6.png    # Hình ảnh đồng xu
    ├── food0-1.png    # Hình ảnh thức ăn
    ├── sword0-2.png   # Hình ảnh kiếm
    ├── bomb.png       # Hình ảnh bom
    ├── bow0-2.png     # Hình ảnh cung
    ├── poison0.png    # Hình ảnh độc
    └── treasure*.png  # Hình ảnh kho báu
```

## 💻 Cấu Trúc Code

### JavaScript (script.js)
```javascript
class WarriorCardGame {
    // Game State
    - cards[]: Mảng các thẻ trên bàn
    - score: Điểm số
    - moves: Số lượt di chuyển
    - warriorHP: HP của Warrior
    - warriorWeapon: Vũ khí của Warrior
    
    // Core Methods
    - initializeGame(): Khởi tạo game
    - createCards(): Tạo bàn chơi 3x3
    - renderCards(): Hiển thị các thẻ
    - moveWarriorDual(): Di chuyển Warrior
    - attackMonsterWithWeapon(): Tấn công quái vật
    - checkGameOver(): Kiểm tra kết thúc game
}
```

### CSS (styles.css)
- **Mobile-First Design**: Responsive breakpoints
- **Glass Morphism**: Hiệu ứng trong suốt
- **Smooth Animations**: Transition và keyframes
- **Touch-Friendly**: Tối ưu cho mobile

### HTML (index.html)
- **Semantic Structure**: Header, Main, Controls
- **Bootstrap Integration**: UI components
- **Dialog System**: Card info và game over

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
   // Trong script.js
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

CardDungeon được phát triển với ❤️ bằng HTML, CSS và JavaScript thuần.

---

**Chúc bạn chơi game vui vẻ! 🎮** 