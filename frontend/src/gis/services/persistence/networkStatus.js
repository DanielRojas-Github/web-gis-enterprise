class NetworkStatus {

  constructor() {

    this.listeners = []

    window.addEventListener(
      'online',
      () => this.notify(true)
    )

    window.addEventListener(
      'offline',
      () => this.notify(false)
    )

  }

  isOnline() {

    return navigator.onLine

  }

  subscribe(listener) {

    this.listeners.push(listener)

    return () => {

      this.listeners =
        this.listeners.filter(
          l => l !== listener
        )

    }

  }

  notify(status) {

    console.log(

      'NETWORK',

      status
        ? 'ONLINE'
        : 'OFFLINE'

    )

    this.listeners.forEach(

      listener => listener(status)

    )

  }
  unsubscribe(listener) {

  this.listeners =
    this.listeners.filter(
      item => item !== listener
    )

}
}

export const networkStatus =
  new NetworkStatus()