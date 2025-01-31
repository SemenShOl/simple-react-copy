import { sync, evaluate } from './sync.js'
export function render(domRoot, virtualDom) {
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
