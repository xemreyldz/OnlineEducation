import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./Theme/ThemeContext"; // Tema bağlamı
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import InstructorPanel from "./pages/InstructorPanel/InstructorPanel";
import Dashboard from "./components/Dashboard/Dashboard";
import Course from "./components/Course/Course";
import InstructorProfile from "./pages/InstructorProfile/InstructorProfile";
import CreateCourse from "./pages/CreateCourse/CreateCourse";
import UploadImage from "./pages/ImageList/UploadImage";
import EditCourse from "./pages/EditCourse/EditCourse";
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import StudentProfile from "./pages/StudentProfile/StudentProfile";
import Notification from "./pages/Notification/Notification";
import Mystudents from "./components/Mystudents/Mystudents";
import Comments from "./components/Comments/Comments";
import StudentNotification from "./components/StudentNotification/StudentNotification";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";


function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        {/* Genel Sayfalar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload-images" element={<UploadImage />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/profile" element={<StudentProfile/>}/>
        <Route path="/student-notifications" element={<StudentNotification/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />



        {/* Instructor Panel Layout */}
        <Route path="/instructor-panel" element={<InstructorPanel />}>
          <Route index element={<Dashboard />} /> {/* Varsayılan içerik */}
          <Route path="courses" element={<Course />} />
          <Route path="notification" element={<Notification/>} />
          <Route path="mystudents" element={<Mystudents/>} />
          <Route path="comments" element={<Comments/>} />
          <Route path="profile" element={<InstructorProfile />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="edit-course/:courseID" element={<EditCourse />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
