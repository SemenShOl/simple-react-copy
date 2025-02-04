const Inner = () => {
    console.log(this.name)
}
function Outer() {
    console.log(this.name)
    Inner()
}

const obj = {
    name: 'Semyon',
    Outer() {
        console.log(this.name)
        return () => console.log(this.name)
    },
}
obj.Outer()()

// let isStateInitialized = false

const renderView = () => {
    console.log('render view')
    Comp()
    Comp2()
}
const store = {
    state: {},
    dispatch(action) {
        Object.keys(this.state).forEach((key) => {
            if (key == action.type) {
                this.state[key] = action.payload
            }
        })
        renderView()
    },
}
let useStateId = 0
const HookFactory = {
    create() {
        useStateId + 2
        const localStateId = useStateId
        return useState.bind({ localStateId, isStateInitialized: false })
    },
}
const stateHooks = new Map()
function useState(initialValue) {
    const innerFunction = new Error().stack
        .split('\n')[2]
        .trim()
        .match(/at (\w+)/)?.[1]
    const setState = (newState) => {
        debugger
        store.dispatch({
            type: localStateId,
            payload: newState,
        })
    }
    if (!stateHooks[innerFunction]) {
        // function
        // stateHooks[innerFunction].isStateInitialized = true
        stateHooks[innerFunction] = {
            localStateId: Symbol(),
        }
        store.state[localStateId] = initialValue
        return [initialValue, setState]
    }
    const currentState = store.state[innerFunction]
    return [currentState, setState]
}
function Comp() {
    const [counter, setCounter] = useState(0)
    useState(0)
    const btn = document.querySelector('.btn')
    btn.onclick = () => setCounter(counter + 1)
    console.log(counter)
}

// function Comp2() {
//     // const [name, setName] = useState('Semyon')
//     useState('Semyon')
//     // console.log(name)
// }
renderView()
