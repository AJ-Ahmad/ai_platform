import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

function CourseDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCourseDetails()
    if (user && user.role === 'student') {
      checkEnrollment()
    }
  }, [id, user])

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/courses/${id}`)
      setCourse(response.data.course)
      setError('')
    } catch (err) {
      setError('Error loading course details')
      console.error('Error fetching course:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const response = await axios.get(`/enrollments/check/${id}`)
      setIsEnrolled(response.data.enrolled)
    } catch (err) {
      console.error('Error checking enrollment:', err)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.role !== 'student') {
      setError('Only students can purchase courses')
      return
    }

    try {
      setPurchasing(true)
      const response = await axios.post('/payments/create-checkout-session', {
        courseId: id
      })

      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error initiating purchase')
      console.error('Purchase error:', err)
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading course...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        {course.thumbnail_url && (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">Taught by {course.teacher_name}</p>
            <p className="text-sm text-gray-500">{course.enrollment_count} students enrolled</p>
          </div>
          <div className="text-3xl font-bold text-primary-600">
            ${course.price}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">About this course</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{course.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Course Content</h2>
          <p className="text-gray-600 mb-2">{course.video_urls.length} video(s)</p>
          
          {isEnrolled ? (
            <div className="space-y-3">
              {course.video_urls.map((url, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Video {index + 1}</p>
                  <div className="aspect-video">
                    <iframe
                      src={url}
                      title={`Video ${index + 1}`}
                      className="w-full h-full rounded"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                Enroll in this course to access {course.video_urls.length} video(s)
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {isEnrolled ? (
            <div className="bg-green-50 border border-green-400 text-green-700 px-6 py-3 rounded-lg">
              You are enrolled in this course
            </div>
          ) : (
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="btn-primary text-lg px-8 py-3 disabled:opacity-50"
            >
              {purchasing ? 'Processing...' : `Enroll Now - $${course.price}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseDetails

