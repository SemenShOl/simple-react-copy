let state = {
    time: new Date(),
    lots: [
        {
            price: 16,
            name: 'Apple',
            description: 'Good apple',
        },
        {
            price: 32,
            name: 'Orange',
            description: 'Good Orange',
        },
    ],
}
function evaluate(virtualElement) {
    debugger
    if (typeof virtualElement.type === 'function') {
        virtualElement = virtualElement.type(virtualElement.props)
    }
    if (virtualElement.props && virtualElement.props.children) {
        virtualElement.props.children = virtualElement.props.children.map(
            (child) => {
                const result = evaluate(child)
                return result
            }
        )
    }
    return virtualElement
}

function App({ state }) {
    return {
        type: 'div',
        props: {
            className: 'app',
            children: [
                {
                    type: Header,
                },
                {
                    type: Clock,
                    props: { time: state.time },
                },
                {
                    type: Lots,
                    props: {
                        lots: state.lots,
                    },
                },
            ],
        },
    }
}

function Header() {
    return {
        type: 'header',
        props: {
            className: 'header',
            children: [
                {
                    type: Logo,
                },
                {
                    type: Paragraph,
                    props: { text: 'Привет' },
                },
            ],
        },
    }
}

function Clock(props) {
    return {
        type: 'div',
        props: {
            className: 'clock',
            children: [props.time.toLocaleTimeString()],
        },
    }
}

function Logo() {
    return {
        type: 'img',
        props: {
            src: 'logo.jpg',
            className: 'logo',
            width: '200px',
            height: '200px',
        },
    }
}

function Paragraph({ text }) {
    return {
        type: 'p',
        props: {
            children: [text],
        },
    }
}

function Lots({ lots }) {
    if (!lots) {
        return 'Loading...'
    }

    return {
        type: 'ul',
        props: {
            className: 'lotsList',
            children: lots.map((lot) => ({
                type: Lot,
                props: { lot },
            })),
        },
    }
}

function Lot({ lot }) {
    return {
        type: 'li',
        props: {
            className: 'lot',
            children: [
                {
                    type: 'h2',
                    props: {
                        children: [lot.name],
                    },
                },
                {
                    type: 'h3',
                    props: {
                        children: [lot.price],
                    },
                },
                {
                    type: 'p',
                    props: {
                        children: [lot.description],
                    },
                },
            ],
        },
    }
}

console.log(evaluate(App({ state })))
