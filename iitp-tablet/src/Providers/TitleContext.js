import {createContext, useState} from "react";

export const TitleContext = createContext({});

/**
 * 헤더에 현재 페이지 타이틀 Context
 */
const TitleStore = ({children}) => {
    const [ title, setTitle ] = useState('');
    const [ mode, setMode ] = useState('');
    const [ dashBoardData, setDashBoardData ] = useState({})
    const [ dashBoardFunc, setDashBoardFunc ] = useState(null)
    return(
        <TitleContext.Provider value={{
            title, setTitle,
            mode, setMode,
            dashBoardData, setDashBoardData,
            dashBoardFunc, setDashBoardFunc
            }}>
            {children}
        </TitleContext.Provider>
    )
}

export default TitleStore;