export class Store {
    constructor(appReducer, initialState) {
        this.appReducer = appReducer
        this.state = appReducer(initialState, {})

        this.listeners = []
        // renderView(this)
    }
    getState() {
        return this.state
    }
    subscribe(callback) {
        this.listeners.push(callback)
        return () => {
            const index = this.listeners.length - 1
            this.listeners.splice(index, 1)
        }
    }
    dispatch(action) {
        this.setState((state) => this.appReducer(state, action))
    }
    setState(state) {
        this.state = {
            ...this.state,
            ...(typeof state === 'function' ? state(this.state) : state),
        }
        this.listeners.forEach((callback) => callback())
    }
}
