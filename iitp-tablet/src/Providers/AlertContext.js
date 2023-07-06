import React, {createContext, useReducer} from "react";
import {alertReducer, alertInitialState} from "./AlertReducer";

export const AlertContext = createContext({});

/**
 * Alert
 */
const AlertStore = ({children}) => {
    const [state, dispatch] = useReducer(alertReducer, alertInitialState);
    return(
        <AlertContext.Provider value={[state,dispatch]}>
            {children}
        </AlertContext.Provider>
    )
}

export default AlertStore;