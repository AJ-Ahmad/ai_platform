import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'

function CourseCatalog() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async (search = '') => {
    try {
      setLoading(true)
      const url = search ? `/courses?search=${search}` : '/courses'
      const response = await axios.get(url)
      setCourses(response.data.courses)
      setError('')
    } catch (err) {
      setError('Error loading courses')
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCourses(searchTerm)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading courses...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Course Catalog</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search courses..."
            className="input-field flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="card hover:shadow-xl transition-shadow duration-200"
            >
              {course.thumbnail_url && (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg -mt-6 -mx-6 mb-4"
                />
              )}
              
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-600">
                  ${course.price}
                </span>
                <span className="text-sm text-gray-500">
                  {course.enrollment_count} students
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                By {course.teacher_name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseCatalog

