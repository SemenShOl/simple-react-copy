import { sync, evaluate } from './sync.js'
export function render(domRoot, virtualDom) {
    const evaluatedVirtualDom = evaluate(virtualDom)
    const virtualDomRoot = {
        type: domRoot.tagName.toLowerCase(),
        props: {
            id: domRoot.id,
            children: [evaluatedVirtualDom],
        },
    }
    sync(domRoot, virtualDomRoot)
}
