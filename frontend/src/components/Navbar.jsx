import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              MasterAIwithUS
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/courses" className="text-gray-700 hover:text-primary-600 transition">
                  Courses
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/courses" className="text-gray-700 hover:text-primary-600 transition">
                  Courses
                </Link>
                
                {user.role === 'student' && (
                  <Link to="/my-courses" className="text-gray-700 hover:text-primary-600 transition">
                    My Courses
                  </Link>
                )}
                
                {user.role === 'teacher' && (
                  <>
                    <Link to="/teacher/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                      Dashboard
                    </Link>
                    <Link to="/teacher/courses/create" className="btn-primary">
                      Create Course
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">{user.name}</span>
                  <button onClick={handleLogout} className="btn-secondary">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

