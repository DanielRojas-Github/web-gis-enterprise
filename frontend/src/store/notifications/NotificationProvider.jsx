import {
  useReducer,
} from 'react'

import {
  NotificationContext,
} from './NotificationContext'

import {
  notificationReducer,
} from './notificationReducer'

import {
  notificationInitialState,
} from './notificationInitialState'

export default function NotificationProvider({
  children,
}) {

  const [state, dispatch] =
    useReducer(
      notificationReducer,
      notificationInitialState
    )

  return (
    <NotificationContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}