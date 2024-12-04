Khi ấn Start game - Nhấn Ok để chơi với Bot, Cancel để vào chế độ 2 người chơi

getElementById: Sử dụng để lấy các phần tử HTML bằng ID. Ví dụ:

board: Bảng trò chơi.
statusDisplay: Hiển thị trạng thái lượt chơi (ví dụ: "Player X's turn").
boardSizeInput: Chọn kích thước bảng.
startGameButton và restartButton: Nút bắt đầu và khởi động lại trò chơi.

createBoard để khởi tạo bảng dựa trên kích thước được chọn:
`gameBoard = Array(size).fill().map(() => Array(size).fill(""));`
Dùng vòng lặp nested loop để tạo các ô (<div>) trên bảng và gắn sự kiện click.
Mảng 2D gameBoard lưu trạng thái của từng ô trên bảng.
Cấu hình các ô trên bảng để có thể click được và linh hoạt với kích thước bảng khác nhau
board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

`handleCellClick()` để xử lý sự kiện click của ô trên bảng:
- Ô đã được đánh dấu chưa (gameBoard[row][col] !== "").
- Nếu ô đã được đánh dấu, thì không thể click vào ô đó.
- Nếu ô chưa được đánh dấu, thì đánh dấu ô đó bằng "X" hoặc "O"
- Kiểm tra game đã kết thúc chưa 

`gameBoard[row][col] = currentPlayer;`
`currentPlayer = currentPlayer === "X" ? "O" : "X";`
Cập nhật trạng thái 

BOT
- Dùng thuật toán Minimax cho bàn cờ nhỏ hoặc chọn ngẫu nhiên ô trống cho bàn cờ lớn

Minimax giúp bot đưa ra lựa chọn tối ưu bằng cách:
Giả lập các nước đi tiếp theo.
Gán điểm cho mỗi trạng thái:
- Thắng: Điểm cao hơn.
- Thua: Điểm thấp hơn.
- Hòa: Điểm bằng nhau.
Minimax đảm bảo bot chơi thông minh hơn, tăng tính thử thách trong chế độ chơi single.
Với bảng lớn, nước đi ngẫu nhiên được dùng để giảm thời gian xử lý.
Đảm bảo trò chơi hoạt động cho cả chế độ 2 người chơi và chế độ chơi với bot.

- checkWinner() để kiểm tra người thắng cuộc. Đảm bảo phát hiện người thắng hoặc hòa.
- startGameButton: Cho phép người chơi chọn kích thước bảng, chế độ chơi (bot hoặc hai người).
- restartButton: Khởi động lại trò chơi với cùng kích thước bảng.
- updateStatus: Hiển thị thông báo cho người chơi.
