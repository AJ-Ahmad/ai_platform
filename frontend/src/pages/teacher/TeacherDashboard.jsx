import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'

function TeacherDashboard() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    try {
      const response = await axios.get('/courses/my-courses/list')
      setCourses(response.data.courses)
      setError('')
    } catch (err) {
      setError('Error loading your courses')
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      setDeleteLoading(courseId)
      await axios.delete(`/courses/${courseId}`)
      setCourses(courses.filter(c => c.id !== courseId))
      setError('')
    } catch (err) {
      setError('Error deleting course')
      console.error('Error deleting course:', err)
    } finally {
      setDeleteLoading(null)
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link to="/teacher/courses/create" className="btn-primary">
          Create New Course
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-xl text-gray-600 mb-4">You haven't created any courses yet.</p>
          <Link to="/teacher/courses/create" className="btn-primary">
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="card">
              <div className="flex flex-col md:flex-row gap-6">
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                  />
                )}
                
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold">${course.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="font-semibold">{course.enrollment_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Videos</p>
                      <p className="font-semibold">{course.video_urls?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-semibold">
                        {new Date(course.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn-secondary"
                    >
                      View
                    </Link>
                    <Link
                      to={`/teacher/courses/${course.id}/edit`}
                      className="btn-primary"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/teacher/courses/${course.id}/enrollments`}
                      className="btn-secondary"
                    >
                      View Enrollments
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      disabled={deleteLoading === course.id}
                      className="btn-danger disabled:opacity-50"
                    >
                      {deleteLoading === course.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeacherDashboard

