const api = {
    get(url) {
        if (url === '/lots') {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([
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
                    ])
                }, 1500)
            })
        }
    },
}

let state = {
    time: new Date(),
    lots: null,
}

renderView(state)

setInterval(() => {
    state = {
        ...state,
        time: new Date(),
    }
    renderView(state)
}, 1000)

api.get('/lots').then((data) => {
    state = {
        ...state,
        lots: data,
    }
    renderView(state)
})

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
                    props: { lots: state.lots },
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
            ],
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

function Clock(props) {
    return {
        type: 'div',
        props: {
            className: 'clock',
            children: [props.time.toLocaleTimeString()],
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

function renderView(state) {
    render(document.getElementById('root'), App({ state }))
}
function render(domRoot, virtualDom) {
    const virtualDomRoot = {
        type: domRoot.tagName.toLowerCase(),
        props: {
            id: domRoot.id,
            children: [virtualDom],
        },
    }
    sync(domRoot, virtualDomRoot)
}

function evaluate(virtualElement) {
    if (typeof virtualElement.type === 'function') {
        return virtualElement.type(virtualElement.props)
    } else if (typeof virtualElement.type === 'string') {
        if (virtualElement.props.children) {
            virtualElement.props.children = virtualElement.props.children.map(
                (child) => {
                    return evaluate(child)
                }
            )
        }
    } else {
        return virtualElement
    }
}
function sync(realNode, virtualNode) {
    if (virtualNode.attributes) {
        Array.from(virtualNode.attributes).forEach((attr) => {
            realNode[attr.name] = attr.value
        })
    }

    if (virtualNode.nodeValue !== realNode.nodeValue) {
        realNode.nodeValue = virtualNode.nodeValue
        return
    }
    //ADD
    const realChildren = realNode.childNodes
    const virtualChildren = virtualNode.childNodes
    for (
        let i = 0;
        i < Math.max(virtualChildren.length, realChildren.length);
        i++
    ) {
        const virtualChild = virtualChildren[i]
        let realChild = realChildren[i]

        //ADD
        if (!realChild && virtualChild) {
            realChild = createNodeByVirtualNode(virtualChild)
            sync(realChild, virtualChild)
            realNode.append(realChild)
        }
        //REPLACE
        else if (realChild.tagName !== virtualChild.tagName) {
            realChild = createNodeByVirtualNode(virtualChild)
            sync(realChild, virtualChild)
            realNode.remove(virtualChild)
            realNode.append(realChild)
        }

        //UPDATE
        else if (realChild.tagName === virtualChild.tagName) {
            sync(realChild, virtualChild)
        }

        //REMOVE
        else if (realChild && !virtualChild) {
            realNode.remove(realChild)
        }
    }
}

function createNodeByVirtualNode(virtualNode) {
    return virtualNode.nodeType !== Node.TEXT_NODE
        ? document.createElement(virtualNode.tagName)
        : document.createTextNode(virtualNode.nodeValue)
}
