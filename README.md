# Card Game - Game Thẻ Bài

Một ứng dụng web game thẻ bài với thiết kế responsive, tối ưu cho cả mobile và PC.

## Tính năng

- **Thiết kế Responsive**: Tối ưu cho cả mobile và desktop
- **Giao diện Mobile-first**: Dễ sử dụng trên điện thoại
- **Game thẻ bài cơ bản**: Với bộ bài 52 lá
- **AI đơn giản**: Đối thủ máy tính
- **Hiệu ứng đẹp**: Animation và visual effects
- **Phím tắt**: Hỗ trợ điều khiển bằng bàn phím

## Cách chơi

1. **Bắt đầu**: Mỗi người chơi được chia 5 lá bài
2. **Lượt chơi**: 
   - Nhấn "Draw Card" để rút bài
   - Chọn bài trong tay để đánh
   - Nhấn "End Turn" để kết thúc lượt
3. **Điều khiển**:
   - Click chuột để chọn bài
   - Phím tắt: D (Draw), E (End Turn), N (New Game)

## Cấu trúc dự án

```
CardDungeon/
├── index.html      # File HTML chính
├── styles.css      # CSS với thiết kế responsive
├── script.js       # Logic game JavaScript
└── README.md       # Hướng dẫn này
```

## Tính năng thiết kế

### Mobile-First Design
- Giao diện tối ưu cho màn hình nhỏ
- Touch-friendly buttons và controls
- Responsive layout tự động điều chỉnh

### Responsive Breakpoints
- **Mobile**: < 768px - Tối ưu cho điện thoại
- **Tablet**: 768px - 1024px - Kích thước trung bình
- **Desktop**: > 1024px - Màn hình lớn

### Visual Effects
- Gradient backgrounds
- Glass morphism effects
- Smooth animations
- Card hover effects
- Loading animations

## Cách chạy

1. Mở file `index.html` trong trình duyệt web
2. Hoặc sử dụng local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   ```

## Phát triển tiếp

Để thêm tính năng mới:

1. **Thêm luật chơi**: Chỉnh sửa logic trong `script.js`
2. **Thay đổi giao diện**: Cập nhật CSS trong `styles.css`
3. **Thêm âm thanh**: Tích hợp audio files
4. **Multiplayer**: Kết nối backend server

## Tương thích

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## License

MIT License - Tự do sử dụng và phát triển. 