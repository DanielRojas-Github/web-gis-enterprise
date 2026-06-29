import {
  NOTIFICATION_ACTIONS,
}
from './notificationActions'

export const notificationReducer =
(
  state,
  action
) => {

  switch (action.type) {

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:

      return {
        ...state,
        notifications: [
          ...state.notifications,
          action.payload,
        ],
      }

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:

      return {
        ...state,
        notifications:
          state.notifications.filter(
            n =>
              n.id !==
              action.payload
          ),
      }

    case NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS:

      return {
        ...state,
        notifications: [],
      }

    default:
      return state
  }
}