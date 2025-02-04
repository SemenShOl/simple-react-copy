import { api } from './api.js'
import { render } from './render.js'
import { VDom } from './vdom.js'
import { Store } from './redux.js'
import { createContext, useContext } from './contex.js'
import { onRender, useState } from './hook.js'
// import { Link, Router, Route } from './router.js'
/** @jsx VDom.createElement */

export function renderView() {
    render(document.getElementById('root'), <App />)
}
//------------------------
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
        lots: [
            {
                id: 1,
                price: 16,
                name: 'Apple',
                description: 'Good apple',
                isActive: false,
            },
            {
                id: 2,
                price: 32,
                name: 'Orange',
                description: 'Good Orange',
                isActive: true,
            },
        ],
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

const MyContext = createContext()
const MyContext2 = createContext()
const RouterContext = createContext()

const store = new Store(combineReducer)
store.subscribe(() => renderView(store))

onRender.useStateRender = renderView
renderView()

// api.get('/lots').then((data) => {
//     store.dispatch({ type: SET_LOTS, payload: { lots: data } })
// })

// setInterval(() => {
//     store.dispatch({ type: SET_TIME, payload: { time: new Date() } })
//     store.dispatch({ type: SET_COUNTER, payload: { add: 2 } })
// }, 1000)
//-----------------------------------------

function Router({ children }) {
    const [location, setLocation] = useState()
    return (
        <RouterContext.Provider value={{ location, setLocation }}>
            {children}
        </RouterContext.Provider>
    )
}

function Link({ to, children }) {
    const { location, setLocation } = useContext(RouterContext)
    const onClick = (event) => {
        setLocation(to)
        event.preventDefault()
    }
    return <a onClick={onClick}>{children}</a>
}

function Route({ children, path }) {
    const { location } = useContext(RouterContext)
    if (path !== location) {
        return <div></div>
    }
    return <div>{children}</div>
}

//-----------------------------------------------------
function App() {
    return (
        <div className="app">
            <MyContext.Provider value={{ name: 'Semyon' }}>
                <Header />
            </MyContext.Provider>
            <Router>
                <ul className="links">
                    <Link to="/">main</Link>
                    <Link to="/info">info</Link>
                    <Link to="/setting">setting</Link>
                </ul>
                <div className="content">
                    <Route path="/">
                        <h1>main</h1>
                    </Route>
                    <Route path="/info">
                        <h1>info</h1>
                    </Route>
                    <Route path="/setting">
                        <h1>setting</h1>
                    </Route>
                </div>
            </Router>
            <Lots />
            <MyContext2.Provider value={{ time: 10 }}>
                <Clock />
            </MyContext2.Provider>
        </div>
    )
}

function Header() {
    const { name } = useContext(MyContext)
    return (
        <header className="header">
            <Logo />
            <h2>{name}</h2>
        </header>
    )
}
function Logo() {
    return <img src="logo.jpg" className="logo" width="200" height="200" />
}

function Clock() {
    const [time, setTime] = useState(10)
    return (
        <div>
            <h3>{time}</h3>
            <button onClick={() => setTime(time + 2)}>click</button>
        </div>
    )
}
function Lots() {
    const [lots, setLots] = useState([
        {
            id: 1,
            price: 16,
            name: 'Apple',
            description: 'Good apple',
            isActive: false,
        },
        {
            id: 2,
            price: 32,
            name: 'Orange',
            description: 'Good Orange',
            isActive: true,
        },
    ])
    // api.get('/lots').then((data) => {
    //     setLots(data)
    // })
    // if (!lots) {
    //     return 'Loading...'
    // }
    const onChangeLotStatus = (status, id) => {
        debugger
        const newLots = [...lots]
        const lot = newLots.find((lot) => lot.id === id)
        lot.isActive = status
        setLots(newLots)
    }
    return (
        <ul className="lotsList">
            {lots.map((lot) => (
                <Lot
                    lot={lot}
                    key={lot.id}
                    setLotStatus={(status) => onChangeLotStatus(status, lot.id)}
                />
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
