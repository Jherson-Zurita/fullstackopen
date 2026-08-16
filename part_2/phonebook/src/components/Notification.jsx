const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const style = {
    color: type === 'error' ? '#d32f2f' : '#2e7d32',
    background: type === 'error' ? '#fdecea' : '#e8f5e9',
    border: `2px solid ${type === 'error' ? '#d32f2f' : '#2e7d32'}`,
    borderRadius: 4,
    padding: '10px 14px',
    marginBottom: 10,
    fontSize: 16
  }

  return <div style={style}>{message}</div>
}

export default Notification
