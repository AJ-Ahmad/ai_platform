import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from '../../api/axios'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [courseId, setCourseId] = useState(null)

  useEffect(() => {
    if (sessionId) {
      verifyPayment()
    }
  }, [sessionId])

  const verifyPayment = async () => {
    try {
      const response = await axios.get(`/payments/verify-session/${sessionId}`)
      setSuccess(response.data.success)
      setCourseId(response.data.course_id)
    } catch (error) {
      console.error('Error verifying payment:', error)
      setSuccess(false)
    } finally {
      setVerifying(false)
    }
  }

  if (verifying) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Verifying payment...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="card text-center">
        {success ? (
          <>
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Congratulations! You have successfully enrolled in the course.
            </p>
            <div className="space-x-4">
              {courseId && (
                <Link to={`/courses/${courseId}`} className="btn-primary">
                  Go to Course
                </Link>
              )}
              <Link to="/my-courses" className="btn-secondary">
                View My Courses
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">✗</div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            <div className="space-x-4">
              <Link to="/courses" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentSuccess

