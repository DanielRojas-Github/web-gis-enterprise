import {
  useContext,
} from 'react'

import {
  NotificationContext,
} from '../NotificationContext'

import {
  NOTIFICATION_ACTIONS,
} from '../notificationActions'

export const useNotifications =
  () => {

    const {
      state,
      dispatch,
    } =
      useContext(
        NotificationContext
      )

    const addNotification =
      ({
        type,
        message,
      }) => {

        const id =
          crypto.randomUUID()

        dispatch({
          type:
            NOTIFICATION_ACTIONS
              .ADD_NOTIFICATION,

          payload: {
            id,
            type,
            message,
          },
        })

        setTimeout(() => {
          dispatch({
            type:
              NOTIFICATION_ACTIONS
                .REMOVE_NOTIFICATION,

            payload:
              id,
          })
        }, 4000)
      }

    return {
      notifications:
        state.notifications,

      addNotification,
    }
  }