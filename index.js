import { api } from './api.js'
import { render } from './render.js'
import { VDom } from './vdom.js'

/** @jsx VDom.createElement */
class Store {
    constructor(initialState) {
        this.state = initialState
        this.listeners = []
        renderView(this.state)
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
    setState(state) {
        this.state = {
            ...this.state,
            ...(typeof state === 'function' ? state(this.state) : state),
        }
        this.listeners.forEach((callback) => callback())
    }
}
const initialState = {
    time: new Date(),
    lots: [],
    counter: 10,
}
const store = new Store(initialState)
store.subscribe(() => renderView(store.getState()))
// store.subscribe(() => console.log('Rerender'))

api.get('/lots').then((data) => {
    store.setState((state) => ({ ...state, lots: data }))
    // renderView(store.getState())
})

setInterval(() => {
    store.setState((state) => ({ ...state, time: new Date() }))
    store.setState((state) => ({
        ...state,
        counter: state.counter + 2,
    }))
}, 1000)
//-----------------------------------------

function App({ state }) {
    return (
        <div className="app">
            <Header />
            <Clock time={state.time} />
            <Lots lots={state.lots} />
            <h1>{state.counter}</h1>
        </div>
    )
}

function Header() {
    return (
        <header className="header">
            <Logo />
        </header>
    )
}

function Logo() {
    return <img src="logo.jpg" className="logo" width="200" height="200" />
}

function Clock(props) {
    return <div className="clock">{props.time.toLocaleTimeString()}</div>
}
function Lots({ lots }) {
    if (!lots) {
        return 'Loading...'
    }
    return (
        <ul className="lotsList">
            {lots.map((lot) => (
                <Lot lot={lot} key={lot.id} />
            ))}
        </ul>
    )
}

function Lot({ lot }) {
    return (
        <li>
            <h2>{lot.name}</h2>
            <h3>{lot.price}</h3>
            <p>{lot.description}</p>
        </li>
    )
}

export function renderView(state) {
    render(document.getElementById('root'), <App state={state} />)
}
