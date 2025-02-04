import { api } from './api.js'
import { render } from './render.js'
import { VDom } from './vdom.js'
import { Store } from './redux.js'

/** @jsx VDom.createElement */
export function renderView(store) {
    const state = store.getState()
    const setLotStatus = (status, id) => {
        store.dispatch({
            type: SET_LOT_STATE,
            payload: { status, id },
        })
    }

    const setActiveRoute = (activeRoute) => {
        store.dispatch({
            type: SET_ROUTE,
            payload: { activeRoute },
        })
    }

    render(
        document.getElementById('root'),
        <App
            state={state}
            setLotStatus={setLotStatus}
            setActiveRoute={setActiveRoute}
        />
    )
}

const SET_TIME = 'SET_TIME'
const SET_LOTS = 'SET_LOTS'
const SET_COUNTER = 'SET_COUNTER'
const SET_LOT_STATE = 'SET_LOT_STATE'
const SET_ROUTE = 'SET_ROUTE'
const initialState = {
    clock: {
        time: new Date(),
    },
    auction: {
        lots: [],
        counter: 10,
    },
    router: {
        activeRoute: '/',
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
        case SET_LOT_STATE:
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

const routerReducer = (state, action) => {
    switch (action.type) {
        case SET_ROUTE:
            return { ...state, activeRoute: action.payload.activeRoute }
        default:
            return state
    }
}

const combineReducer = (state = initialState, action) => {
    return {
        clock: clockReducer(state.clock, action),
        auction: auctionReducer(state.auction, action),
        router: routerReducer(state.router, action),
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

function App({ state, setLotStatus, setActiveRoute }) {
    return (
        <div className="app">
            <Router
                activeRoute={state.router.activeRoute}
                setActiveRoute={setActiveRoute}
            />
            {/* <Header />
            <Clock time={state.clock.time} />
            <Lots setLotStatus={setLotStatus} lots={state.auction.lots} />
            <h1>{state.auction.counter}</h1> */}
        </div>
    )
}

function Router({ activeRoute, setActiveRoute }) {
    const onClick = (event, route) => {
        setActiveRoute(route)
        event.preventDefault()
    }
    const renderActiveRoute = () => {
        if (activeRoute === '/info') return <h1>info</h1>

        if (activeRoute === '/setting') return <h1>setting</h1>

        return <h1>main</h1>
    }
    return (
        <div className="router">
            <ul className="links">
                <Link to="/" navigate={setActiveRoute}>
                    main
                </Link>
                <Link to="/info" navigate={setActiveRoute}>
                    info
                </Link>
                <Link to="/setting" navigate={setActiveRoute}>
                    setting
                </Link>
            </ul>
            <div className="content">
                <Route activeRoute={activeRoute} path="/">
                    <h1>main</h1>
                </Route>
                <Route activeRoute={activeRoute} path="/info">
                    <h1>info</h1>
                </Route>
                <Route activeRoute={activeRoute} path="/setting">
                    <h1>setting</h1>
                </Route>
            </div>
        </div>
    )
}

function Link({ to, navigate, children }) {
    const onClick = (event) => {
        navigate(to)
        event.preventDefault()
    }
    return <a onClick={onClick}>{children}</a>
}

function Route({ children, path, activeRoute }) {
    if (path !== activeRoute) {
        return <div></div>
    }
    return <div>{children}</div>
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
    return (
        <li className={lotClass}>
            <h2>{lot.name}</h2>
            <h3>{lot.price}</h3>
            <p>{lot.description}</p>
            <ActionButton
                isActive={lot.isActive}
                onTurnOff={() => setLotStatus(false, lot.id)}
                onTurnOn={() => setLotStatus(true, lot.id)}
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
