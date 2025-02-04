import { VDom } from './vdom.js'

const contextMap = new Map()

export function createContext() {
    const contextId = Symbol('context')
    return {
        id: contextId,
        Provider: ContextWrapper.bind({ id: contextId }),
    }
}

function ContextWrapper({ children, value }) {
    contextMap.set(this.id, value)
    return VDom.createElement('div', {}, children)
}

export function useContext(context) {
    if (!context) return
    return contextMap.get(context.id)
}
