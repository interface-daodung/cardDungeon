# EventManager - Phân tích và sắp xếp lại

## Các nhóm chức năng chính:

### 1. SETUP EVENTS
- `setupEventListeners()` - Setup events chính (buttons, dialogs, keyboard)
- `setupCardEvents()` - Setup events cho tất cả cards
- `setupDragEvents()` - Setup drag events cho character
- `setupClickEvents()` - Setup click events cho character
- `setupClickEventsForAll()` - Setup click events cho tất cả cards
- `setupDropEvents()` - Setup drop events cho tất cả cards
- `setupLongPressEvents()` - Setup long press events

### 2. HANDLE EVENTS
- `handleCharacterClick()` - Xử lý click character
- `handleCardClick()` - Xử lý click card
- `handleDragStart()` - Xử lý bắt đầu drag
- `handleDragEnd()` - Xử lý kết thúc drag
- `handleDragOver()` - Xử lý drag over
- `handleDrop()` - Xử lý drop
- `handleTouchStart()` - Xử lý touch start
- `handleTouchMove()` - Xử lý touch move
- `handleTouchEnd()` - Xử lý touch end
- `handleLongPressStart()` - Xử lý long press start
- `handleLongPressEnd()` - Xử lý long press end
- `handleLongPressCancel()` - Xử lý long press cancel

### 3. GAME LOGIC
- `moveCharacter()` - Di chuyển character
- `onMoveCompleted()` - Xử lý sau khi di chuyển
- `checkCoinRowsAndColumns()` - Kiểm tra hàng/cột coin
- `debugPrintBoard()` - Debug in bảng
- `isCoinRow()` - Kiểm tra hàng coin
- `isCoinColumn()` - Kiểm tra cột coin
- `processCoinRow()` - Xử lý hàng coin
- `processCoinColumn()` - Xử lý cột coin
- `transformAllTrapArrows()` - Biến đổi mũi tên trap
- `performQuicksandShuffleWithFlipEffect()` - Xử lý quicksand shuffle
- `interactWithTreasure()` - Tương tác với treasure
- `interactWithBoom()` - Tương tác với boom
- `handleBoomExplosion()` - Xử lý boom explosion

### 4. UI ACTIONS
- `onNewGame()` - Bắt đầu game mới
- `onSellWeapon()` - Bán vũ khí
- `updateSellButtonVisibility()` - Cập nhật hiển thị nút bán
- `onRestartFromGameOver()` - Restart từ game over

### 5. UTILITY
- `decreaseBoomCountdown()` - Giảm countdown boom

## Các hàm cần kiểm tra thêm:

### Có thể không được sử dụng:
- `debugPrintBoard()` - Có thể chỉ dùng để debug
- `decreaseBoomCountdown()` - Cần kiểm tra xem có được gọi không

### Cần kiểm tra:
- `handleLongPressCancel()` - Có thể không được sử dụng
- `handleTouchMove()` - Có thể không được sử dụng

## Kết quả phân tích:
- ✅ Hầu hết các hàm đều được sử dụng
- ✅ Cấu trúc hiện tại khá tốt
- ⚠️ Cần kiểm tra thêm một số hàm utility

## Đề xuất sắp xếp:
1. Nhóm theo chức năng rõ ràng
2. Đặt các hàm setup events ở đầu
3. Nhóm các hàm handle events theo loại
4. Đặt game logic ở giữa
5. Đặt UI actions ở cuối
6. Comment các hàm debug không cần thiết 