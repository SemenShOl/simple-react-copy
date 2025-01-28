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
let count = 0

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

//-----------------------------------------

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
            width: '200',
            height: '200',
        },
    }
}

function Clock(props) {
    return {
        type: 'div',
        props: {
            className: 'clock',
            children: props.time.toLocaleTimeString(),
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
                        children: lot.name,
                    },
                },
                {
                    type: 'h3',
                    props: {
                        children: lot.price,
                    },
                },
                {
                    type: 'p',
                    props: {
                        children: lot.description,
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
    // debugger
    const evaluatedVirtualDom = evaluate(virtualDom)
    console.log(evaluatedVirtualDom)
    const virtualDomRoot = {
        type: domRoot.tagName.toLowerCase(),
        props: {
            id: domRoot.id,
            children: [evaluatedVirtualDom],
        },
    }
    sync(domRoot, virtualDomRoot)
}

function evaluate(virtualNode) {
    //виртуальная нода - другой компонент
    if (typeof virtualNode.type === 'function') {
        virtualNode = virtualNode.type(virtualNode.props)
    }

    //Преобразование children ноды
    const nodeChildren = virtualNode.props && virtualNode.props.children
    if (nodeChildren) {
        virtualNode.props.children = Array.isArray(nodeChildren)
            ? nodeChildren.map(evaluate)
            : [evaluate(nodeChildren)]
    }
    return virtualNode
}

function sync(realNode, virtualNode) {
    // if()
    //Синхронизация аттрибутов
    if (virtualNode.props) {
        Object.entries(virtualNode.props).forEach(([name, value]) => {
            if (
                name !== 'children' &&
                name !== 'key' &&
                realNode[name] !== value
            )
                realNode[name] = value
        })
    }
    if (virtualNode.key) realNode.dataset.key = virtualNode.key
    if (isVirtualNodeText(virtualNode) && virtualNode != realNode.nodeValue) {
        realNode.nodeValue = virtualNode
        return realNode
    }

    //ADD
    const realChildren = realNode.childNodes
    const virtualChildren =
        (virtualNode.props && virtualNode.props.children) || []

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

        //REMOVE
        else if (realChild && !virtualChild) {
            realNode.remove(realChild)
        }

        //REPLACE
        else if (
            !virtualChild.type ||
            realChild.tagName !== virtualChild.type.toUpperCase()
        ) {
            debugger
            const newChild = createNodeByVirtualNode(virtualChild)
            sync(newChild, virtualChild)
            realChild.replaceWith(newChild)
        }

        //UPDATE
        else if (realChild.tagName.toLowerCase() === virtualChild.type) {
            sync(realChild, virtualChild)
        }
    }
}

function createNodeByVirtualNode(virtualNode) {
    // return virtualNode.nodeType !== Node.TEXT_NODE
    // ? document.createElement(virtualNode.tagName)
    // : document.createTextNode(virtualNode.nodeValue)
    return isVirtualNodeText(virtualNode)
        ? document.createTextNode(virtualNode)
        : document.createElement(virtualNode.type)
}

function isVirtualNodeText(virtualNode) {
    const result = !Object.hasOwn(virtualNode, 'type')
    return result
}
