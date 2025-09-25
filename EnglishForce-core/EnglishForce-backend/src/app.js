import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
// OAuth
import passport from 'passport';
// ***** routes *****
import authRoutes from "./routes/auth/authRoutes.js";
import authGoogleRoutes from './routes/auth/authGoogleRoutes.js';
import authFacebookRoutes from './routes/auth/authFacebookRoutes.js';
import AIRoutes from './routes/AIRoutes.js';
import userRoutes from "./routes/userRoutes.js"
// course
import courseRoutes from "./routes/course/courseRoutes.js"
import courseSectionRoutes from "./routes/course/courseSectionRoutes.js"
import paymentRoutes from "./routes/course/paymentRoutes.js"
import userCourseRoutes from './routes/course/userCourseRoutes.js';
import commentRoutes from './routes/course/commentRoutes.js';
import interactionRoutes from './routes/course/interactionRoutes.js';
// Stripe webhook
import stripeRoutes from "./routes/course/stripeRoutes.js"
// exam
import examRoutes from "./routes/exam/examRoutes.js"
import examAttemptRoutes from "./routes/exam/examAttemptRoutes.js"
import questionRoutes from './routes/exam/questionRoutes.js'
import answerRoutes from './routes/exam/answerRoutes.js'
import geminiRoutes from './routes/exam/geminiRoutes.js'
import examPartRoutes from './routes/exam/examPartRoutes.js'
// program
import programRoutes from './routes/program/programRoutes.js'
import unitRoutes from './routes/program/unitRoutes.js'
import lessonRoutes from './routes/program/lessonRoutes.js'
import exerciseRoutes from './routes/program/exerciseRoutes.js'
import exerciseAnswerRoutes from './routes/program/exerciseAnswerRoutes.js'
import userProcessRoutes from './routes/program/userProgressRoutes.js'
// cloudinary
import cloudinaryRoutes from './routes/cloudinary/cloudinaryRoutes.js';

import errorHandler from './middleware/error.js';

import logger from './middleware/logger.js'

const app = express()

app.use(logger);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(passport.initialize());



app.get("/api",(req,res)=> {
  res.send("Backend of The Last Water Bender is working. I'll teach you anything you want !")
})

// ***** WEBHOOK *****
// Payment Stripe webhook
app.use('/api/webhook',stripeRoutes);

// ***** API *****
app.use("/api/auth", authRoutes);
app.use('/api/auth_google',authGoogleRoutes); 
app.use('/api/auth_facebook',authFacebookRoutes) ;
app.use("/api/users",userRoutes);

app.use('/api/AI', AIRoutes) ;

// Course
app.use("/api/courses" , courseRoutes) ;
app.use("/api/course_sections" , courseSectionRoutes) ;
app.use('/api/payments', paymentRoutes);
app.use('/api/user-course', userCourseRoutes);
app.use('/api/comments', commentRoutes) ;
app.use('/api/interactions',interactionRoutes) ;
// Exam
app.use("/api/exams" , examRoutes) ;
app.use("/api/exam-parts" , examPartRoutes) ;
app.use("/api/exam-attempts", examAttemptRoutes) ;
app.use('/api/questions', questionRoutes) ;
app.use('/api/answers', answerRoutes) ;
app.use('/api/exams/gemini', geminiRoutes);
// Program
app.use('/api/programs', programRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/exercise-answers', exerciseAnswerRoutes);
app.use('/api/user-progresses', userProcessRoutes);

// Cloudinary
app.use('/api/cloudinary', cloudinaryRoutes);


// Middleware xử lý lỗi tập trung
app.use(errorHandler);

export default app;
