import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'

function EditCourse() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail_url: '',
    video_urls: ['']
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/courses/${id}`)
      const course = response.data.course
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price.toString(),
        thumbnail_url: course.thumbnail_url || '',
        video_urls: course.video_urls
      })
      setError('')
    } catch (err) {
      setError('Error loading course')
      console.error('Error fetching course:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleVideoUrlChange = (index, value) => {
    const newVideoUrls = [...formData.video_urls]
    newVideoUrls[index] = value
    setFormData({ ...formData, video_urls: newVideoUrls })
  }

  const addVideoUrl = () => {
    setFormData({
      ...formData,
      video_urls: [...formData.video_urls, '']
    })
  }

  const removeVideoUrl = (index) => {
    if (formData.video_urls.length === 1) {
      setError('At least one video URL is required')
      return
    }
    const newVideoUrls = formData.video_urls.filter((_, i) => i !== index)
    setFormData({ ...formData, video_urls: newVideoUrls })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.description || !formData.price) {
      setError('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.price) < 0) {
      setError('Price must be a positive number')
      return
    }

    const validVideoUrls = formData.video_urls.filter(url => url.trim() !== '')
    if (validVideoUrls.length === 0) {
      setError('At least one video URL is required')
      return
    }

    try {
      setSubmitting(true)
      await axios.put(`/courses/${id}`, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        thumbnail_url: formData.thumbnail_url || null,
        video_urls: validVideoUrls
      })

      navigate('/teacher/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating course')
      console.error('Error updating course:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading course...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Course Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="input-field"
            placeholder="Enter course title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows="5"
            className="input-field"
            placeholder="Describe what students will learn in this course"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (USD) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            className="input-field"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL (optional)
          </label>
          <input
            id="thumbnail_url"
            name="thumbnail_url"
            type="url"
            className="input-field"
            placeholder="https://example.com/thumbnail.jpg"
            value={formData.thumbnail_url}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URLs * (YouTube, Vimeo, etc.)
          </label>
          {formData.video_urls.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                className="input-field"
                placeholder="https://www.youtube.com/embed/..."
                value={url}
                onChange={(e) => handleVideoUrlChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeVideoUrl(index)}
                className="btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVideoUrl}
            className="btn-secondary mt-2"
          >
            Add Video URL
          </button>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCourse

