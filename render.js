import { evaluate } from './evaluate.js'
import { sync, evaluate } from './vdom.js'
export function renderView(state) {
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
