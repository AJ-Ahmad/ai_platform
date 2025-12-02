import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CourseCatalog from './pages/student/CourseCatalog'
import CourseDetails from './pages/student/CourseDetails'
import MyCourses from './pages/student/MyCourses'
import PaymentSuccess from './pages/student/PaymentSuccess'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import CreateCourse from './pages/teacher/CreateCourse'
import EditCourse from './pages/teacher/EditCourse'
import CourseEnrollments from './pages/teacher/CourseEnrollments'

function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Student Routes */}
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route 
          path="/my-courses" 
          element={
            <PrivateRoute requiredRole="student">
              <MyCourses />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/payment-success" 
          element={
            <PrivateRoute requiredRole="student">
              <PaymentSuccess />
            </PrivateRoute>
          } 
        />

        {/* Teacher Routes */}
        <Route 
          path="/teacher/dashboard" 
          element={
            <PrivateRoute requiredRole="teacher">
              <TeacherDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/teacher/courses/create" 
          element={
            <PrivateRoute requiredRole="teacher">
              <CreateCourse />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/teacher/courses/:id/edit" 
          element={
            <PrivateRoute requiredRole="teacher">
              <EditCourse />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/teacher/courses/:id/enrollments" 
          element={
            <PrivateRoute requiredRole="teacher">
              <CourseEnrollments />
            </PrivateRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App

