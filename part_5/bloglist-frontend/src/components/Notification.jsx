import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const baseStyle = {
    borderRadius: 5,
    padding: '10px 14px',
    marginBottom: 10,
    fontSize: 16,
    border: '2px solid'
  }

  const style =
    type === 'error'
      ? { ...baseStyle, color: '#d32f2f', background: '#fdecea', borderColor: '#d32f2f' }
      : { ...baseStyle, color: '#2e7d32', background: '#e8f5e9', borderColor: '#2e7d32' }

  return (
    <div className="notification" style={style}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error'])
}

export default Notification
