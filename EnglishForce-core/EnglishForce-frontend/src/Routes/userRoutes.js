import { Route } from 'react-router-dom';
import UserLayout from '../Layouts/UserLayout';

import OAuthLoginSuccess from '../Pages/user/OAuth/OAuthLoginSuccess'; // OAuth

import HomePage from '../Pages/user/Home';
import LoginPage from '../Pages/user/Login';
import RegisterPage from '../Pages/user/Register';
import ProfilePage from '../Pages/user/Profile/Profile';
import TestPage from '../Pages/user/Test';

// ***** Course feature *****
import CoursesPage from '../Pages/user/Course/Course';
import CourseOverview from '../Pages/user/Course/CourseOverview';
import CourseDetail from '../Pages/user/Course/CourseDetail';
import CourseUser from '../Pages/user/Course/CourseUser';
// User Payment
import Cart from '../Pages/user/Payment/Cart';
import CheckoutForm from '../Pages/user/Payment/checkPage';
import VocabQuizPage from '../Pages/user/Vocab/VocabQuizPage';
import VocabQuizTakingPage from '../Pages/user/Vocab/VocabQuizTakingPage';

// ***** Exam feature *****
import ExamPage from '../Pages/user/Exam/Exam';
import ExamDetailPage from '../Pages/user/Exam/ExamDetail';
import ExamStartPage from '../Pages/user/Exam/ExamStart';
import ExamResultPage from '../Pages/user/Exam/ExamResult';


// ***** Program feature *****
import ProgramPage from '../Pages/user/Program/Program';
import ProgramDetailPage from '../Pages/user/Program/ProgramDetail';
import UnitDetailPage from '../Pages/user/Program/UnitDetail';
import LessonStartPage from '../Pages/user/Program/LessonStart';

// ***** FlashCard feature *****




export const UserRoutes = () => (
  <>
    <Route path="/" element={<UserLayout isHomePage={true}><HomePage /></UserLayout>} />
    <Route path="/login" element={<UserLayout><LoginPage /></UserLayout>} />
    <Route path="/register" element={<UserLayout><RegisterPage /></UserLayout>} />
    <Route path="/profile" element={<UserLayout><ProfilePage /></UserLayout>} />
    <Route path="/test" element={<UserLayout><TestPage /></UserLayout>} />

    {/* course feature */}
    <Route path="/courses" element={<UserLayout><CoursesPage /></UserLayout>} />
    <Route path="/courses/overview/:publicId" element={<UserLayout><CourseOverview /></UserLayout>} />
    <Route path="/courses/:publicId" element={<UserLayout><CourseDetail /></UserLayout>} />
    <Route path="/courses-user" element={<UserLayout><CourseUser /></UserLayout>} />

    <Route path="/payment" element={<UserLayout><CheckoutForm /></UserLayout>} />
    <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />

    {/* vocab quiz */}
    <Route path="/vocab-quiz" element={<UserLayout><VocabQuizPage /></UserLayout>} />
    <Route path="/vocab-quiz/taking" element={<UserLayout><VocabQuizTakingPage /></UserLayout>} />

    {/* exam feature  */}
    <Route path="/exams" element={<UserLayout><ExamPage /></UserLayout>} />
    <Route path="/exams/:publicId" element={<UserLayout><ExamDetailPage /></UserLayout>} />
    <Route path="/exams/:publicId/start" element={<UserLayout><ExamStartPage /></UserLayout>} />
    <Route path="/exams/:publicId/result/:attemptPublicId" element={<UserLayout><ExamResultPage /></UserLayout>} />

    {/* program feature  */}
    <Route path="/programs" element={<UserLayout><ProgramPage /></UserLayout>} />
    <Route path="/programs/:programPublicId" element={<UserLayout><ProgramDetailPage /></UserLayout>} />
    <Route path="/units/:unitPublicId" element={<UserLayout><UnitDetailPage /></UserLayout>} />
    <Route path="/units/:unitPublicId/lessons/:lessonPublicId/start" element={<UserLayout><LessonStartPage /></UserLayout>} />

    {/* OAuth  */}
    <Route path="/login/success" element={<UserLayout><OAuthLoginSuccess /></UserLayout>} />

    {/* flashcard feature */}
    
    
    
  </>
);
