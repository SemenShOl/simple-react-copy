import { api } from './api.js'
import { renderView } from './render.js'
let state = {
    time: new Date(),
    lots: null,
}

renderView(state)

api.get('/lots').then((data) => {
    state = {
        ...state,
        lots: data,
    }
    renderView(state)
})

//-----------------------------------------

function App({ state }) {
    return VDom.createElement(
        'div',
        { className: 'app' },
        VDom.createElement(Header, {}),
        VDom.createElement(Clock, { time: state.time }),
        VDom.createElement(Lots, { lots: state.lots })
    )
    // return {
    //     type: 'div',
    //     props: {
    //         className: 'app',
    //         children: [
    //             {
    //                 type: Header,
    //             },
    //             {
    //                 type: Clock,
    //                 props: { time: state.time },
    //             },
    //             {
    //                 type: Lots,
    //                 props: { lots: state.lots },
    //             },
    //         ],
    //     },
    // }
}

function Header() {
    return VDom.createElement(
        'header',
        { className: 'header' },
        VDom.createElement(Logo, {})
    )
    // return {
    //     type: 'header',
    //     props: {
    //         className: 'header',
    //         children: [
    //             {
    //                 type: Logo,
    //             },
    //         ],
    //     },
    // }
}

function Logo() {
    return VDom.createElement('img', {
        src: 'logo.jpg',
        className: 'logo',
        width: '200',
        height: '200',
    })
    // return {
    //     type: 'img',
    //     props: {
    //         src: 'logo.jpg',
    //         className: 'logo',
    //         width: '200',
    //         height: '200',
    //     },
    // }
}

function Clock(props) {
    return VDom.createElement(
        'div',
        {
            className: 'clock',
        },
        props.time.toLocaleTimeString()
    )
    // return {
    //     type: 'div',
    //     props: {
    //         className: 'clock',
    //         children: props.time.toLocaleTimeString(),
    //     },
    // }
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
    // return {
    //     type: 'ul',
    //     props: {
    //         className: 'lotsList',
    //         children: lots.map((lot) => ({
    //             type: Lot,
    //             props: { lot },
    //         })),
    //     },
    // }
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
    // return {
    //     type: 'li',
    //     props: {
    //         className: 'lot',
    //         children: [
    //             {
    //                 type: 'h2',
    //                 props: {
    //                     children: lot.name,
    //                 },
    //             },
    //             {
    //                 type: 'h3',
    //                 props: {
    //                     children: lot.price,
    //                 },
    //             },
    //             {
    //                 type: 'p',
    //                 props: {
    //                     children: lot.description,
    //                 },
    //             },
    //         ],
    //     },
    // }
}

function renderView(state) {
    render(document.getElementById('root'), App({ state }))
}
function render(domRoot, virtualDom) {
    // debugger
    console.log('virtualDom:', virtualDom)

    const evaluatedVirtualDom = evaluate(virtualDom)
    console.log('evaluatedVirtualDom:', evaluatedVirtualDom)
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
            // debugger
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
