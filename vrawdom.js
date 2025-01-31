const VRawDom = {
    createElement(type, config, ...children) {
        const props = config || {}
        const key = props.key || null
        props.children = Array.isArray(children) ? children : [children]
        return {
            type,
            key,
            props,
        }
    },
}
