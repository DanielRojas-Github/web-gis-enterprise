const ToastItem = ({
  notification,
  onClose,
}) => {
  const {
    id,
    message,
    type,
  } = notification

  return (
    <div
      className={`toast toast-${type}`}
    >
      <span>
        {message}
      </span>

      <button
        onClick={() => onClose(id)}
      >
        ✕
      </button>
    </div>
  )
}

export default ToastItem