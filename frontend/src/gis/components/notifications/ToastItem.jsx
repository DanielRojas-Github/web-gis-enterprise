import './ToastItem.css'

const ToastItem = ({
  notification,
  onClose,
}) => {
  return (
    <div
      className={`
        toast
        toast-${notification.type}
      `}
    >
      <span className="toast-message">
        {notification.message}
      </span>

      <button
        className="toast-close"
        onClick={() =>
          onClose(notification.id)
        }
      >
        ✕
      </button>
    </div>
  )
}

export default ToastItem