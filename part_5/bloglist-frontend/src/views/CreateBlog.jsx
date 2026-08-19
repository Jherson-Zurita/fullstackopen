import { useRef } from 'react'
import PropTypes from 'prop-types'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'

// El formulario está envuelto en Togglable (ejercicio 5.5): se muestra/oculta con un botón,
// y se oculta automáticamente después de crear un blog exitosamente.
const CreateBlog = ({ createBlog }) => {
  const blogFormRef = useRef()

  const handleCreate = async (blogObject) => {
    await createBlog(blogObject)
    if (blogFormRef.current) {
      blogFormRef.current.toggleVisibility()
    }
  }

  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreate} />
      </Togglable>
    </div>
  )
}

CreateBlog.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default CreateBlog
