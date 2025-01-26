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

function App({ state }) {
    const app = document.createElement('div')
    app.className = 'app'

    app.append(Header())
    app.append(
        Clock({
            time: state.time,
        })
    )
    app.append(Lots({ lots: state.lots }))
    return app
}

function Header() {
    const header = document.createElement('header')
    header.className = 'header'
    header.append(Logo())

    return header
}

function Logo() {
    const logo = document.createElement('img')
    logo.src = 'logo.jpg'
    logo.className = 'logo'
    logo.setAttribute('width', 200)
    logo.setAttribute('height', 200)
    return logo
}

function Clock(props) {
    const clock = document.createElement('div')
    clock.className = 'clock'
    clock.textContent = props.time.toLocaleTimeString()
    return clock
}
function Lots({ lots }) {
    if (!lots) {
        return 'Loading...'
    }
    const lotsList = document.createElement('ul')
    lotsList.className = 'lotsList'

    lots.forEach((lot) => {
        const lotElement = Lot({ lot })
        lotsList.append(lotElement)
    })
    return lotsList
}

function Lot({ lot }) {
    const lotElement = document.createElement('li')
    lotElement.className = 'lot'

    const lotName = document.createElement('h2')
    lotName.textContent = lot.name

    const lotPrice = document.createElement('h3')
    lotPrice.textContent = lot.price

    const lotDescription = document.createElement('p')
    lotDescription.textContent = lot.description

    lotElement.append(lotName)
    lotElement.append(lotPrice)
    lotElement.append(lotDescription)

    return lotElement
}

renderView(state)

setInterval(() => {
    state = {
        ...state,
        time: new Date(),
    }
    // debugger
    renderView(state)
}, 1000)

api.get('/lots').then((data) => {
    state = {
        ...state,
        lots: data,
    }
    debugger
    renderView(state)
})

function renderView(state) {
    render(document.getElementById('root'), App({ state }))
}
function render(domRoot, virtualDom) {
    const virtualDomRoot = document.createElement(domRoot.tagName)
    virtualDomRoot.id = domRoot.id
    virtualDomRoot.append(virtualDom)

    // domRoot.innerHTML = ''
    // domRoot.append(virtualDom)
    sync(domRoot, virtualDomRoot)
}

function sync(realNode, virtualNode) {
    // const realNode = document.createElement('div')
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
