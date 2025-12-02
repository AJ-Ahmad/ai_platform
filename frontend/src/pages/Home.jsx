import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to MasterAIwithUS
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Learn from expert teachers and master new skills. Create and share your knowledge with students worldwide.
          </p>
          <div className="space-x-4">
            {!user ? (
              <>
                <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                  Get Started
                </Link>
                <Link to="/courses" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition inline-block">
                  Browse Courses
                </Link>
              </>
            ) : user.role === 'teacher' ? (
              <Link to="/teacher/dashboard" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/courses" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
                Browse Courses
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MasterAIwithUS?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Quality Courses</h3>
              <p className="text-gray-600">
                Learn from expert teachers with high-quality video content and comprehensive materials.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-semibold mb-2">Expert Teachers</h3>
              <p className="text-gray-600">
                Connect with experienced instructors who are passionate about sharing their knowledge.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">Learn at Your Pace</h3>
              <p className="text-gray-600">
                Access your courses anytime, anywhere. Learn at your own pace and on your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students and teachers on MasterAIwithUS
          </p>
          {!user && (
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

