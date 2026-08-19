import PropTypes from 'prop-types'

// Vista de un único blog en su propia página (ejercicio 5.25).
// - Usuario no autenticado: solo ve título, autor, url y likes (sin botones).
// - Usuario autenticado que no es el creador: ve el botón "like".
// - Usuario autenticado que es el creador: ve además el botón "remove" (5.27).
const BlogDetails = ({ blog, user, onLike, onDelete }) => {
  if (!blog) {
    return <div>Blog not found</div>
  }

  const isCreator = user && blog.user && blog.user.username === user.username

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}{' '}
        {user && <button onClick={onLike}>like</button>}
      </div>
      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>
      {isCreator && <button onClick={onDelete}>remove</button>}
    </div>
  )
}

BlogDetails.propTypes = {
  blog: PropTypes.object,
  user: PropTypes.object,
  onLike: PropTypes.func,
  onDelete: PropTypes.func
}

export default BlogDetails
