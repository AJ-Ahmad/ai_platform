import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'

function MyCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    try {
      const response = await axios.get('/enrollments/my-courses')
      setCourses(response.data.enrollments)
      setError('')
    } catch (err) {
      setError('Error loading your courses')
      console.error('Error fetching enrolled courses:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading your courses...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-xl text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((enrollment) => (
            <Link
              key={enrollment.id}
              to={`/courses/${enrollment.course_id}`}
              className="card hover:shadow-xl transition-shadow duration-200"
            >
              {enrollment.thumbnail_url && (
                <img
                  src={enrollment.thumbnail_url}
                  alt={enrollment.title}
                  className="w-full h-48 object-cover rounded-t-lg -mt-6 -mx-6 mb-4"
                />
              )}
              
              <h3 className="text-xl font-semibold mb-2">{enrollment.title}</h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {enrollment.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  By {enrollment.teacher_name}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  Enrolled
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                Purchased on {new Date(enrollment.purchase_date).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses

