/** @jsx VDom.createElement */

export function evaluate(virtualNode) {
    //виртуальная нода - другой компонент
    // if (typeof virtualNode.type === 'function') {
    //     virtualNode = virtualNode.type(virtualNode.props)
    // }
    while (typeof virtualNode.type === 'function') {
        virtualNode = virtualNode.type(virtualNode.props)
    }

    //Преобразование children ноды
    const nodeChildren = virtualNode.props && virtualNode.props.children
    if (nodeChildren) {
        virtualNode.props.children = Array.isArray(nodeChildren)
            ? nodeChildren.map(evaluate)
            : evaluate(nodeChildren)
    }
    return virtualNode
}

export function sync(realNode, virtualNode) {
    // //debugger
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

    if (virtualNode?.props?.onClick && !realNode.onclick) {
        realNode.addEventListener('click', () => {
            virtualNode.props.onClick()
        })
    }
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
            // //debugger
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
    return isVirtualNodeText(virtualNode)
        ? document.createTextNode(virtualNode)
        : document.createElement(virtualNode.type)
}

function isVirtualNodeText(virtualNode) {
    const result = !Object.hasOwn(virtualNode, 'type')
    return result
}
