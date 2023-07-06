import AuthorizationAxios from "../Utils/AuthorizationAxios";

const AuthenticationApi = {
    // 생활치료센터 조회
    logOut : async function (){
        try{
            const response = await AuthorizationAxios.get(process.env.REACT_APP_BASE_URL + '/api/userLogout');
            return response;
        }catch (e) {
            console.log(`AuthenticationApi logOut`);
            return false;
        }
    }
}

export default AuthenticationApi;