import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const navStyle = {
  background: '#e8eaf6',
  padding: '10px 16px',
  marginBottom: 20,
  display: 'flex',
  alignItems: 'center',
  gap: 14
}

const linkStyle = {
  color: '#1a237e',
  textDecoration: 'none',
  fontWeight: 500
}

const Navigation = ({ user, onLogout }) => {
  return (
    <nav style={navStyle}>
      <Link style={linkStyle} to="/">
        blogs
      </Link>
      {user && (
        <Link style={linkStyle} to="/blogs/new">
          create new blog
        </Link>
      )}
      <Link style={linkStyle} to="/users">
        users
      </Link>
      <span style={{ marginLeft: 'auto' }}>
        {user ? (
          <>
            {user.name} logged in{' '}
            <button onClick={onLogout}>logout</button>
          </>
        ) : (
          <Link style={linkStyle} to="/login">
            login
          </Link>
        )}
      </span>
    </nav>
  )
}

Navigation.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired
}

export default Navigation
