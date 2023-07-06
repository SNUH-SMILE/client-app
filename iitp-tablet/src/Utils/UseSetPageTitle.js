import {useCallback, useContext, useEffect} from "react";
import {TitleContext} from "../Providers/TitleContext";

/**
 * 헤더에 현재 페이지 타이틀 Mount 될때 표시
 * @param pageTitle 표시할 타이틀명  String
 * @param mode 헤더타입이 대쉬보드인지 String
 * @param data 대쉬보드시 헤더로 전달할 데이터 Object
 */
function UseSetPageTitle(pageTitle, mode='Common') {
    const context = useContext(TitleContext);
    const {setTitle, setMode} = context;
    useEffect(()=>{
        setTitle(pageTitle);
        setMode(mode);
    },[pageTitle]);
}

export default UseSetPageTitle;