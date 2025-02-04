export const onRender = {
    useStateRender: () => {},
}
let useStateIndex = 0
const globalState = {}
export function useState(initialState) {
    // debugger
    const currentStateIndex = useStateIndex
    if (!globalState[currentStateIndex]) {
        globalState[currentStateIndex] = initialState
    }
    const currentState = globalState[currentStateIndex]

    const setState = (newState) => {
        debugger
        globalState[currentStateIndex] = newState
        useStateIndex = 0

        // renderView()
        onRender.useStateRender()
    }
    useStateIndex++
    return [currentState, setState]
}
