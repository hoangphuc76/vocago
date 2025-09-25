import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
dotenv.config({
  path: `.env.${env}`
});
// Load biến môi trường ngay từ đầu


// Tôi hiểu rằng bạn đã gọi dotenv.config() trong server.js trước khi import app.js, nhưng vẫn gặp lỗi OAuth2Strategy requires a clientID option. Điều này có thể gây bối rối, nhưng nguyên nhân sâu xa liên quan đến cách JavaScript xử lý các module ES6.

// ⚠️ Nguyên nhân: Hoisting của ES Modules
// Trong ES Modules, các câu lệnh import được hoisted – tức là chúng được xử lý trước khi bất kỳ mã nào khác trong file được thực thi. Điều này có nghĩa là khi bạn viết:
// import authGoogleRoutes from './routes/auth/authGoogleRoutes.js';
// Toàn bộ nội dung của authGoogleRoutes.js sẽ được thực thi ngay lập tức, trước khi các dòng mã tiếp theo trong app.js (hoặc server.js) được chạy. Nếu trong authGoogleRoutes.js bạn có đoạn mã như:
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   // ...
// }));
// Thì process.env.GOOGLE_CLIENT_ID sẽ là undefined nếu dotenv.config() chưa được gọi trước đó.


// Giải pháp: Tạo file cấu hình riêng để load biến môi trường
// Để đảm bảo rằng các biến môi trường được load trước khi bất kỳ module nào khác sử dụng chúng, 
// bạn có thể tạo một file riêng để cấu hình dotenv và import nó đầu tiên trong ứng dụng của bạn.