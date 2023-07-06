import AuthorizationAxios from "../Utils/AuthorizationAxios";
import {useNavigate} from "react-router-dom";

//공통코드 조회
async function commonCode(comCd) {
    try {
        return await AuthorizationAxios.post(
            process.env.REACT_APP_BASE_URL + '/api/comCd/detail/list',
            JSON.stringify({
                comCd: comCd,
                useYn: 'Y'
            }),
            {headers: {'Content-Type': "application/json"}}
        );

    } catch (e) {
        console.log('commonCode',e);
        return false;
    }
}

export async function getLonginUserInfo () {
    try{
        const response = await AuthorizationAxios.get(process.env.REACT_APP_BASE_URL + '/api/user/info/token',);
        return response;
    }catch (e) {
        console.log(e);
        return false;
    }
}


export default commonCode ;