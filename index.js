import { api } from './api.js'
import { render } from './render.js'
import { VDom } from './vdom.js'

/** @jsx VDom.createElement */

let state = {
    time: new Date(),
    lots: [],
}
renderView(state)

api.get('/lots').then((data) => {
    state = {
        ...state,
        lots: data,
    }
    renderView(state)
})

setInterval(() => {
    state = {
        ...state,
        time: new Date(),
    }
    renderView(state)
}, 1000)
//-----------------------------------------

function App({ state }) {
    // return
    return (
        <div className="app">
            <Header />
            <Clock time={state.time} />
            <Lots lots={state.lots} />
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
    // render(document.getElementById('root'), App({ state }))
    render(document.getElementById('root'), <App state={state} />)
}
