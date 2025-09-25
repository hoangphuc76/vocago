import { addUserCourses } from "../../services/userCourse.service.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function handlePaymentIntentSucceeded(event) {
  const paymentIntent = event.data.object;
  // Đã thêm các thông tin tương ứng vào metadata khi tạo PaymentIntent
  const userId = paymentIntent.metadata.userId;
  const courseIds = paymentIntent.metadata.courseIds ? paymentIntent.metadata.courseIds.split(',') : [];

  try {
    // Cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
    await addUserCourses(userId, courseIds);
    console.log(`Order ${userId}  ${courseIds} has been updated to 'paid'.`);
  } catch (dbError) {
    console.error('Database update failed:', dbError);
    return res.status(500).send('Database update failed');
  }
}

export const stripeController = async (req, res) => {
    // const sig = req.headers['stripe-signature'];
    const event = req.body;
  
    // try {
    //   event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    // } catch (err) {
    //   console.error('Webhook signature verification failed.', err.message);
    //   return res.status(400).send(`Webhook Error: ${err.message}`);
    // }
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Then define and call a method to handle the successful payment intent.
        handlePaymentIntentSucceeded(event);
        console.log("Hey we are")
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a response to acknowledge receipt of the event
    res.json({received: true});
};




