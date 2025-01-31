import { api } from './api.js'
import { render } from './render.js'
import { VDom } from './vdom.js'

let state = {
    time: new Date(),
    lots: null,
}

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
    return VDom.createElement(
        'div',
        { className: 'app' },
        VDom.createElement(Header, {}),
        VDom.createElement(Clock, { time: state.time }),
        VDom.createElement(Lots, { lots: state.lots })
    )
}

function Header() {
    return VDom.createElement(
        'header',
        { className: 'header' },
        VDom.createElement(Logo, {})
    )
}

function Logo() {
    return VDom.createElement('img', {
        src: 'logo.jpg',
        className: 'logo',
        width: '200',
        height: '200',
    })
}

function Clock(props) {
    return VDom.createElement(
        'div',
        {
            className: 'clock',
        },
        props.time.toLocaleTimeString()
    )
}
function Lots({ lots }) {
    if (!lots) {
        return 'Loading...'
    }

    return VDom.createElement(
        'ul',
        {
            className: 'lotsList',
        },
        ...lots.map((lot) =>
            VDom.createElement(Lot, {
                lot,
            })
        )
    )
}

function Lot({ lot }) {
    return VDom.createElement(
        'li',
        {
            className: 'lot',
        },
        VDom.createElement('h2', {}, lot.name),
        VDom.createElement('h3', {}, lot.price),
        VDom.createElement('p', {}, lot.description)
    )
}

export function renderView(state) {
    render(document.getElementById('root'), App({ state }))
}
