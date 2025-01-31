export const VDom = {
    createElement(type, config, ...children) {
        const props = config || {}
        const key = props.key || null
        if (children.length > 1) {
            props.children = children
        } else {
            const child = children[0] || []
            props.children = Array.isArray(child) ? child : [child]
        }
        return {
            type,
            key,
            props,
        }
    },
}
