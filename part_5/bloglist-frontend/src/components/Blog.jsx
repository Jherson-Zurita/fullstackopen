import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

// Componente Blog "compacto/expandible" usado en la lista de la Parte 5b/5c
// (ejercicios 5.7-5.15): título+autor siempre visibles, url/likes/usuario y
// el botón de eliminar solo aparecen al expandir los detalles.
const Blog = ({ blog, user, onLike, onDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const isCreator = user && blog.user && blog.user.username === user.username

  const toggleDetails = () => setDetailsVisible(!detailsVisible)

  return (
    <div style={blogStyle} className="blog">
      <div className="blogSummary">
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}{' '}
        <button onClick={toggleDetails}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>

      {detailsVisible && (
        <div className="blogDetails">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            {onLike && <button onClick={onLike}>like</button>}
          </div>
          <div>{blog.user ? blog.user.name : 'unknown'}</div>
          {isCreator && onDelete && <button onClick={onDelete}>remove</button>}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object,
  onLike: PropTypes.func,
  onDelete: PropTypes.func
}

export default Blog
