
export const drawState = {

    type: 'polyline',

    points: [],

    listeners: [],

    setType(type) {

        this.type = type

        this.listeners.forEach(
            listener => listener()
        )
    },

    setPoints(points) {


        this.points = points


        this.listeners.forEach(
            listener => listener()
        )
    },

    clear() {

        this.points = []

        this.listeners.forEach(
            listener => listener()
        )
    },

    subscribe(listener) {

        this.listeners.push(listener)

        return () => {


            this.listeners =
                this.listeners.filter(
                    l => l !== listener
                )
        }
    },
}
