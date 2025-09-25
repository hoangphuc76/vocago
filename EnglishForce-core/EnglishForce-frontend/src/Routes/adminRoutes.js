import { Route } from 'react-router-dom';
import AdminLayout from '../Layouts/AdminLayout';
import ProtectedRoute from '../Layouts/ProtectedRoute';

import AdminHome from '../Pages/admin/HomeAdmin';
import UserAdmin from '../Pages/admin/User/UserAdmin';

// Course feature
import CourseAdmin from '../Pages/admin/Course/CourseAdmin';
import DetailCourseAdmin from '../Pages/admin/Course/DetailCourseAdmin';
import CreateCourseAdmin from '../Pages/admin/Course/CreateCourseAdmin';
import CourseSectionAdmin from '../Pages/admin/Course/CourseSectionAdmin';
import EditSectionAdmin from '../Pages/admin/Course/EditSectionAdmin';
import EditCourseAdmin from '../Pages/admin/Course/EditCourseAdmin';
import CommentAdmin from '../Pages/admin/Comment/CommentAdmin';

// Exam feature
import ExamAttemptAdmin from '../Pages/admin/ExamAttempt/ExamAttemptAdmin';
import ExamAdmin from "../Pages/admin/Exam/ExamAdmin" ;
import DetailExamAdmin from '../Pages/admin/Exam/DetailExamAdmin';
import CreateExam from '../Pages/admin/Exam/CreateExam';
import EditExamAdmin from '../Pages/admin/Exam/EditExamAdmin';
import ExamQuestionAdmin from '../Pages/admin/Exam/ExamQuestionAdmin' ;
import EditQuestionAdmin from '../Pages/admin/Exam/EditQuestionAdmin';
import QuestionAnswerAdmin from '../Pages/admin/Exam/QuestionAnswerAdmin';
import ExamPartAdmin from '../Pages/admin/Exam/ExamPartAdmin';
import PartDetailAdmin from '../Pages/admin/Exam/DetailPartAdmin';
import EditPartAdmin from '../Pages/admin/Exam/EditPartAdmin';

// Program feature 
import ProgramAdmin from '../Pages/admin/Program/ProgramAdmin';
import CreateProgramAdmin from '../Pages/admin/Program/CreateProgramAdmin';
import DetailProgramAdmin from '../Pages/admin/Program/DetailProgramAdmin';
import EditProgramAdmin from '../Pages/admin/Program/EditProgramAdmin';
import DetailUnitAdmin from '../Pages/admin/Program/DetailUnitAdmin';
import EditUnitAdmin from '../Pages/admin/Program/EditUnitAdmin';
import DetailLessonAdmin from '../Pages/admin/Program/DetailLessonAdmin';
import DetailExerciseAdmin from '../Pages/admin/Program/DetailExerciseAdmin';
import EditExerciseAdmin from '../Pages/admin/Program/EditExercise';
import EditExerciseAnswerAdmin from '../Pages/admin/Program/EditExerciseAnswerAdmin';

// AI feature 
import AIAdmin from '../Pages/admin/AI/AIAdmin';
export const AdminRoutes = () => (
  <Route element={<ProtectedRoute />}>
    <Route path="/admin" element={<AdminLayout><AdminHome /></AdminLayout>} />
    <Route path="/admin/users" element={<AdminLayout><UserAdmin /></AdminLayout>} />

    {/* Course feature */}
    <Route path="/admin/courses" element={<AdminLayout><CourseAdmin /></AdminLayout>} />
    <Route path="/admin/courses/create" element={<AdminLayout><CreateCourseAdmin /></AdminLayout>} />
    <Route path="/admin/courses/:publicId" element={<AdminLayout><DetailCourseAdmin /></AdminLayout>} />
    <Route path="/admin/courses/edit/:publicId" element={<AdminLayout><EditCourseAdmin /></AdminLayout>} />
    <Route path="/admin/courses/sections/:publicId" element={<AdminLayout><CourseSectionAdmin /></AdminLayout>} />
    <Route path="/admin/courses/sections/:publicId/edit" element={<AdminLayout><EditSectionAdmin /></AdminLayout>} />
    <Route path="/admin/comments" element={<AdminLayout><CommentAdmin /></AdminLayout>} />

    {/* Exam feature  */} 
    <Route path="/admin/exam-attempts" element={<AdminLayout><ExamAttemptAdmin /></AdminLayout>} />
    <Route path="/admin/exams" element={<AdminLayout><ExamAdmin /></AdminLayout>} />
    <Route path="/admin/exams/:publicId" element={<AdminLayout><DetailExamAdmin /></AdminLayout>} />
    <Route path="/admin/exams/create" element={<AdminLayout><CreateExam /></AdminLayout>} />
    <Route path="/admin/exams/edit/:publicId" element={<AdminLayout><EditExamAdmin /></AdminLayout>} />
    <Route path="/admin/exams/:publicId/parts" element={<AdminLayout><ExamPartAdmin /></AdminLayout>} />
    <Route path="/admin/exams/:publicId/parts/:partPublicId" element={<AdminLayout><PartDetailAdmin /></AdminLayout>} />
    <Route path="/admin/exams/:publicId/parts/:partPublicId/edit" element={<AdminLayout><EditPartAdmin /></AdminLayout>} />

    <Route path="/admin/exams/:publicId/parts/:partPublicId/questions" element={<AdminLayout><ExamQuestionAdmin /></AdminLayout>} />
    <Route path="/admin/exams/questions/:questionPublicId/edit" element={<AdminLayout><EditQuestionAdmin /></AdminLayout>} />
    <Route path="/admin/exams/questions/:questionPublicId/answer" element={<AdminLayout><QuestionAnswerAdmin /></AdminLayout>} />

    {/* Program feature  */}
    <Route path="/admin/programs" element={<AdminLayout><ProgramAdmin /></AdminLayout>} />
    <Route path="/admin/programs/create" element={<AdminLayout><CreateProgramAdmin /></AdminLayout>} />
    <Route path="/admin/programs/:publicProgramId" element={<AdminLayout><DetailProgramAdmin /></AdminLayout>} />
    <Route path="/admin/programs/:publicProgramId/edit" element={<AdminLayout><EditProgramAdmin /></AdminLayout>} />
    <Route path="/admin/programs/:publicProgramId/units/:unitPublicId" element={<AdminLayout><DetailUnitAdmin /></AdminLayout>} />
    <Route path="/admin/units/:unitPublicId/edit" element={<AdminLayout><EditUnitAdmin /></AdminLayout>} />
    <Route path="/admin/lessons/:lessonPublicId" element={<AdminLayout><DetailLessonAdmin /></AdminLayout>} />
    <Route path="/admin/lessons/:lessonPublicId/exercises/:exercisePublicId" element={<AdminLayout><DetailExerciseAdmin /></AdminLayout>} />
    <Route path="/admin/exercises/:exercisePublicId/edit" element={<AdminLayout><EditExerciseAdmin /></AdminLayout>} />
    <Route path="/admin/exercises/:exercisePublicId/answer/:answerPublicId" element={<AdminLayout><EditExerciseAnswerAdmin /></AdminLayout>} />

    {/* AI  */}
    <Route path="/admin/ai" element={<AdminLayout><AIAdmin /></AdminLayout>} />

  </Route>
);
