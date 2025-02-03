import { api } from './api.js'
import { render } from './render.js'
import { VDom } from './vdom.js'

/** @jsx VDom.createElement */

const SET_TIME = 'SET_TIME'
const SET_LOTS = 'SET_LOTS'
const SET_COUNTER = 'SET_COUNTER'
const SET_LOT_STATE = 'SET_LOT_STATE'
// const initialState = {
//     time: new Date(),
// }
const initialState = {
    clock: {
        time: new Date(),
    },
    auction: {
        lots: [
            // {
            //     id: 1,
            //     price: 16,
            //     name: 'Apple',
            //     description: 'Good apple',
            //     isActive: false,
            // },
            // {
            //     id: 2,
            //     price: 32,
            //     name: 'Orange',
            //     description: 'Good Orange',
            //     isActive: true,
            // },
        ],
        counter: 10,
    },
}
const setLotStatus = (status, id) => {
    // debugger
    store.dispatch({
        type: SET_LOT_STATE,
        payload: { status, id },
    })
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
        case SET_LOT_STATE:
            debugger
            return {
                ...state,
                lots: state.lots.map((lot) =>
                    lot.id === action.payload.id
                        ? { ...lot, isActive: action.payload.status }
                        : lot
                ),
            }
        case SET_COUNTER:
            return { ...state, counter: action.payload.add + state.counter }
        default:
            return state
    }
}

const combineReducer = (state = initialState, action) => {
    // debugger
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
        renderView(this)
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
store.subscribe(() => renderView(store))

api.get('/lots').then((data) => {
    store.dispatch({ type: SET_LOTS, payload: { lots: data } })
})

setInterval(() => {
    store.dispatch({ type: SET_TIME, payload: { time: new Date() } })
    store.dispatch({ type: SET_COUNTER, payload: { add: 2 } })
}, 1000)
//-----------------------------------------

function App({ state, setLotStatus }) {
    return (
        <div className="app">
            <Header />
            <Clock time={state.clock.time} />
            <Lots setLotStatus={setLotStatus} lots={state.auction.lots} />
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
function Lots({ lots, setLotStatus }) {
    if (!lots) {
        return 'Loading...'
    }
    return (
        <ul className="lotsList">
            {lots.map((lot) => (
                <Lot setLotStatus={setLotStatus} lot={lot} key={lot.id} />
            ))}
        </ul>
    )
}

function Lot({ lot, setLotStatus }) {
    const lotClass = 'lot ' + (lot.isActive ? 'active' : '')
    debugger
    return (
        <li className={lotClass}>
            <h2>{lot.name}</h2>
            <h3>{lot.price}</h3>
            <p>{lot.description}</p>
            <ActionButton
                isActive={lot.isActive}
                onTurnOff={() => setLotStatus(false, lot.id)}
                onTurnOn={() => setLotStatus(true, lot.id)}
                // onTurnOff={() => console.log('onTurnOff')}
                // onTurnOn={() => console.log('onTurnOn')}
            />
        </li>
    )
}

function ActionButton({ isActive, onTurnOff, onTurnOn }) {
    return isActive ? (
        <button onClick={onTurnOff}>Отключить</button>
    ) : (
        <button onClick={onTurnOn}>Включить</button>
    )
}

export function renderView(store) {
    const state = store.getState()
    render(
        document.getElementById('root'),
        <App state={state} setLotStatus={setLotStatus} />
    )
}
