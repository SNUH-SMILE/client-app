import axios from "axios";

const AuthorizationAxios = axios.create({
  baseURL:process.env.REACT_APP_BASE_URL
})



// 요청전에 LocalStorage 에 담겨 있는 토큰 헤더에 세팅
AuthorizationAxios.interceptors.request.use(
    function (config) {
        config.headers={'Authorization':`Bearer ${localStorage.getItem('Authorization')}`,...config.headers}
      return config;
    },
    error => {
        console.log('Request',error)
    }
)

AuthorizationAxios.interceptors.response.use(

    (response) => {

        // console.log('response',response);
        return response;
    },
    (error => {
        console.log('ResponseError',error)
        if(error.response.status === 500 || error.response.status === 400){
            window.location='/error';
        }
    })

)

export default AuthorizationAxios;
