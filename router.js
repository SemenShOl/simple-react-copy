import { api } from './api.js'
import { render } from './render.js'
import { VDom } from './vdom.js'
import { Store } from './redux.js'
import { createContext, useContext } from './contex.js'
import { onRender, useState } from './hook.js'
/** @jsx VDom.createElement */

export function Router({ children }) {
    const [location, setLocation] = useState()
    return (
        <RouterContext.Provider value={{ location, setLocation }}>
            {children}
        </RouterContext.Provider>
    )
}

export function Link({ to, children }) {
    const { location, setLocation } = useContext(RouterContext)
    const onClick = (event) => {
        setLocation(to)
        event.preventDefault()
    }
    return <a onClick={onClick}>{children}</a>
}

export function Route({ children, path }) {
    const { location } = useContext(RouterContext)
    if (path !== location) {
        return <div></div>
    }
    return <div>{children}</div>
}
