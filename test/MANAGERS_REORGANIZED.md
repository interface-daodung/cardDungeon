# Sắp xếp lại các Manager theo logic

## Đã hoàn thành sắp xếp theo logic:

### 1. CardManager ✅
**Cấu trúc mới:**
- **KHỞI TẠO VÀ TẠO THẺ**
  - `createCards()` - Tạo bộ thẻ ban đầu
  - `createRandomCard()` - Tạo thẻ ngẫu nhiên
  - `createCard()` - Tạo thẻ theo loại

- **QUẢN LÝ THẺ**
  - `updateCard()` - Cập nhật thẻ
  - `getCard()` - Lấy thẻ
  - `getAllCards()` - Lấy tất cả thẻ
  - `setAllCards()` - Cập nhật toàn bộ thẻ

- **TÌM KIẾM THẺ**
  - `findCharacterIndex()` - Tìm vị trí character
  - `findCardToMove()` - Tìm thẻ cần di chuyển

- **TIỆN ÍCH**
  - `isGameComplete()` - Kiểm tra game hoàn thành
  - `getAllCardTypes()` - Lấy danh sách loại thẻ
  - `getAllCardInfo()` - Lấy thông tin chi tiết thẻ

### 2. CharacterManager ✅
**Cấu trúc mới:**
- **KHỞI TẠO VÀ RESET**
  - `reset()` - Reset trạng thái

- **QUẢN LÝ HP**
  - `updateCharacterHP()` - Cập nhật HP (damage)
  - `healCharacterHP()` - Hồi phục HP
  - `getCharacterHP()` - Lấy HP hiện tại

- **QUẢN LÝ WEAPON**
  - `addWeaponToCharacter()` - Thêm vũ khí
  - `useWeapon()` - Sử dụng vũ khí
  - `getCharacterWeapon()` - Lấy độ bền vũ khí
  - `getCharacterWeaponName()` - Lấy tên vũ khí
  - `getCharacterWeaponObject()` - Lấy object vũ khí
  - `getWeaponDurability()` - Lấy độ bền vũ khí
  - `sellWeapon()` - Bán vũ khí
  - `hasWeapon()` - Kiểm tra có vũ khí

- **QUẢN LÝ TRẠNG THÁI**
  - `processRecovery()` - Xử lý hồi phục
  - `processPoison()` - Xử lý độc
  - `getPoisoned()` - Lấy số lượt độc
  - `setPoisoned()` - Set số lượt độc
  - `getRecovery()` - Lấy số lượt hồi phục
  - `setRecovery()` - Set số lượt hồi phục
  - `getCharacterElementCoin()` - Lấy element coin
  - `setCharacterElementCoin()` - Set element coin

- **HIỂN THỊ**
  - `showHpChangePopup()` - Hiển thị popup HP

- **TIỆN ÍCH**
  - `isAlive()` - Kiểm tra còn sống

### 3. UIManager ✅
**Cấu trúc mới:**
- **CẬP NHẬT UI**
  - `updateUI()` - Cập nhật toàn bộ UI
  - `updateScore()` - Cập nhật điểm số
  - `updateMoves()` - Cập nhật số lượt
  - `updateHighScore()` - Cập nhật high score
  - `updateCharacterDisplay()` - Cập nhật hiển thị character
  - `updateSellButtonVisibility()` - Cập nhật nút bán

- **DIALOG QUẢN LÝ**
  - `showCardInfo()` - Hiển thị thông tin thẻ
  - `hideCardInfo()` - Ẩn thông tin thẻ

- **DRAG & DROP HỖ TRỢ**
  - `showValidTargets()` - Hiển thị ô hợp lệ
  - `clearValidTargets()` - Xóa highlight
  - `isValidMove()` - Kiểm tra di chuyển hợp lệ

- **TIỆN ÍCH**
  - `getCardIndexFromElement()` - Lấy index từ element

### 4. GameState ✅
**Cấu trúc mới:**
- **KHỞI TẠO VÀ RESET**
  - `reset()` - Reset trạng thái

- **QUẢN LÝ SCORE & MOVES**
  - `addScore()` - Thêm điểm
  - `incrementMoves()` - Tăng lượt
  - `getScore()` - Lấy điểm
  - `getMoves()` - Lấy lượt

- **QUẢN LÝ DRAG STATE**
  - `setDraggedCard()` - Set thẻ đang kéo
  - `getDraggedCard()` - Lấy thẻ đang kéo
  - `clearDraggedCard()` - Xóa thẻ đang kéo
  - `setDragStartPos()` - Set vị trí bắt đầu
  - `getDragStartPos()` - Lấy vị trí bắt đầu
  - `clearDragStartPos()` - Xóa vị trí bắt đầu

- **QUẢN LÝ TOUCH STATE**
  - `setTouchStartTime()` - Set thời điểm touch
  - `getTouchStartTime()` - Lấy thời điểm touch
  - `clearTouchStartTime()` - Xóa thời điểm touch
  - `setTouchStartPos()` - Set vị trí touch
  - `getTouchStartPos()` - Lấy vị trí touch
  - `clearTouchStartPos()` - Xóa vị trí touch

- **QUẢN LÝ LONG PRESS**
  - `setLongPressTimer()` - Set timer
  - `getLongPressTimer()` - Lấy timer
  - `clearLongPressTimer()` - Xóa timer
  - `getLongPressDelay()` - Lấy delay

- **QUẢN LÝ HIGH SCORE**
  - `loadHighScore()` - Load high score
  - `saveHighScore()` - Save high score
  - `updateHighScore()` - Cập nhật high score
  - `getHighScore()` - Lấy high score

## Lợi ích của việc sắp xếp theo logic:

### 🎯 Dễ tìm kiếm:
- Các hàm liên quan được đặt gần nhau
- Nhóm chức năng rõ ràng
- Dễ dàng tìm hàm cần thiết

### 🔧 Dễ bảo trì:
- Cấu trúc logic theo chức năng
- Dễ thêm tính năng mới vào đúng nhóm
- Dễ sửa lỗi trong từng nhóm chức năng

### 📈 Dễ mở rộng:
- Thêm tính năng mới vào đúng nhóm
- Không ảnh hưởng đến các nhóm khác
- Cấu trúc nhất quán

### 🧹 Code sạch:
- Tách biệt rõ ràng các chức năng
- Giảm sự phụ thuộc giữa các nhóm
- Dễ đọc và hiểu

## Kết quả:
- ✅ **CardManager:** Đã sắp xếp theo logic
- ✅ **CharacterManager:** Đã sắp xếp theo logic
- ✅ **UIManager:** Đã sắp xếp theo logic
- ✅ **GameState:** Đã sắp xếp theo logic
- ⚠️ **CombatManager:** Đã sắp xếp trước đó
- ⚠️ **AnimationManager:** Cần sắp xếp theo logic
- ⚠️ **EventManager:** Cần sắp xếp theo logic

## Đề xuất tiếp theo:
1. Sắp xếp AnimationManager theo logic
2. Sắp xếp EventManager theo logic
3. Tạo documentation cho từng nhóm chức năng 