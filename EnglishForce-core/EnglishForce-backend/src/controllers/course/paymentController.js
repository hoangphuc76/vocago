import Stripe from 'stripe';
import * as userCourseService from "../../services/userCourse.service.js";
import * as courseService from "../../services/course.service.js";
import * as userService from '../../services/user.service.js';
import moment from "moment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { courseIds } = req.body;
    var amount = await courseService.getTotalPriceByCourseIds(courseIds) ;
    amount = Math.round(amount * 100);
    const userId = req.user.id;

    if (!userId || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ error: 'Missing userId or invalid list of courseIds.' });
    }

    // Xử lý đơn hàng miễn phí
    if (amount === 0) {
      try {
        const results = [];
        for (const courseId of courseIds) {
          // Kiểm tra xem user đã đăng ký khóa học này chưa
          const existing = await userCourseService.getUserCourse(userId, courseId);
          if (!existing) {
            const newRecord = await userCourseService.createUserCourse(userId, courseId);
            results.push({ courseId, status: 'enrolled', record: newRecord });
          } else {
            results.push({ courseId, status: 'already enrolled' });
          }
        }
        return res.status(200).json({ freeOrder: true, results });
      } catch (error) {
        console.error('Lỗi khi xử lý đơn hàng miễn phí:', error);
        return res.status(500).json({ error: 'Lỗi khi xử lý đơn hàng miễn phí.' });
      }
    }

    const user = await userService.getUserById(userId);
    let stripeCustomerId = user.stripe_customer_id;
    // Nếu chưa có thì tạo mới customer trên Stripe và lưu lại
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username || `User_${userId}`,
        metadata: { userId: String(userId) },
      });
      stripeCustomerId = customer.id;

      // Cập nhật vào DB
      await userService.updateUser(userId, { stripe_customer_id: stripeCustomerId });
    }

    // Tạo PaymentIntent cho đơn hàng có giá trị
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      metadata: { userId: String(userId), courseIds: courseIds.join(',') }, // Lưu thông tin bổ sung
    });



    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Lỗi khi tạo PaymentIntent:', error);
    res.status(400).json({ error: error.message, note: "Không thể tạo Payment Intent" });
  }
};




export const setStripeStatsController = async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({
      limit: 100, // Lấy nhiều dữ liệu hơn để có biểu đồ chi tiết
    });

    // Nhóm doanh thu theo ngày
    const revenueByDay = {};

    payments.data.forEach(payment => {
      if (payment.status === "succeeded") {
        // Convert timestamp thành ngày (YYYY-MM-DD)
        const date = moment(payment.created * 1000).format("YYYY-MM-DD");

        // Cộng dồn doanh thu theo ngày
        revenueByDay[date] = (revenueByDay[date] || 0) + payment.amount;
      }
    });

    // Chuyển đổi object thành array để frontend dễ sử dụng
    const formattedData = Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue: revenue / 100, // Stripe trả về số cent, cần chia 100 để ra đơn vị tiền tệ
    }));


    const customers = await stripe.customers.list({
      limit: 100,
    });

    // Nhóm số lượng khách hàng theo ngày
    const customersByDay = {};

    customers.data.forEach(customer => {
      const date = moment(customer.created * 1000).format("YYYY-MM-DD");
      customersByDay[date] = (customersByDay[date] || 0) + 1;
    });

    // Chuyển dữ liệu thành array để frontend dễ xử lý
    const formattedCustomers = Object.entries(customersByDay).map(([date, count]) => ({
      date,
      count,
    }));
    res.json({revenueByDay:formattedData,
      customersByDay:formattedCustomers,
    });
  } catch (error) {
    console.error("Error fetching Stripe revenue stats:", error);
    res.status(500).json({ error: "Failed to fetch revenue data from Stripe" });
  }
};