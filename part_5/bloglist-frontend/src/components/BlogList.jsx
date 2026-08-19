import Blog from './Blog'
import PropTypes from 'prop-types'

// Lista de blogs ordenada por número de likes, de mayor a menor (ejercicio 5.10).
// Cada entrada usa el componente Blog, que puede expandirse para ver sus detalles.
const BlogList = ({ blogs, user, onLike, onDelete }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLike={() => onLike(blog)}
          onDelete={() => onDelete(blog)}
        />
      ))}
    </div>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default BlogList
