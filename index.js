import { api } from './api.js'
import { render } from './render.js'
import { VDom } from './vdom.js'

/** @jsx VDom.createElement */

const SET_TIME = 'SET_TIME'
const SET_LOTS = 'SET_LOTS'
const SET_COUNTER = 'SET_COUNTER'
// const initialState = {
//     time: new Date(),
// }
const initialState = {
    clock: {
        time: new Date(),
    },
    auction: {
        lots: [],
        counter: 10,
    },
}

const clockReducer = (state, action) => {
    switch (action.type) {
        case SET_TIME:
            return { ...state, time: action.payload.time }
        default:
            return state
    }
}

const auctionReducer = (state, action) => {
    switch (action.type) {
        case SET_LOTS:
            return { ...state, lots: action.payload.lots }
        case SET_COUNTER:
            return { ...state, counter: action.payload.add + state.counter }
        default:
            return state
    }
}

const combineReducer = (state = initialState, action) => {
    debugger
    return {
        clock: clockReducer(state.clock, action),
        auction: auctionReducer(state.auction, action),
    }
}
class Store {
    constructor(appReducer, initialState) {
        this.appReducer = appReducer
        this.state = appReducer(initialState, {})

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

//-----------------------------------------
const store = new Store(combineReducer)

store.subscribe(() => renderView(store.getState()))

api.get('/lots').then((data) => {
    store.dispatch({ type: SET_LOTS, payload: { lots: data } })
})

setInterval(() => {
    store.dispatch({ type: SET_TIME, payload: { time: new Date() } })
    store.dispatch({ type: SET_COUNTER, payload: { add: 2 } })
}, 1000)
//-----------------------------------------

function App({ state }) {
    debugger
    return (
        <div className="app">
            <Header />
            <Clock time={state.clock.time} />
            <Lots lots={state.auction.lots} />
            <h1>{state.auction.counter}</h1>
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
