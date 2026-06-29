import {
  useNotifications,
}
from '@/store/notifications/hooks/useNotifications'

export default function ToastContainer() {

  const {
    notifications,
  } =
    useNotifications()

  return (
    <div
      className="toast-container"
    >

      {notifications.map(
        notification => (

          <div
            key={
              notification.id
            }
            className={`
              toast
              ${notification.type}
            `}
          >
            {
              notification.message
            }
          </div>
        )
      )}

    </div>
  )
}