import axios from "axios";
class TokenStatusInfo {
    token = localStorage.getItem('Authorization');
}
const TokenMethod ={
    // 토큰 상태확인
    Status: async function () {
        try {
            const response =
                await axios
                    .post(
                        process.env.REACT_APP_BASE_URL + '/api/tokenStatus',
                        JSON.stringify({...new TokenStatusInfo}),
                        {
                            headers: {
                                'Content-Type': "application/json"
                            }
                        }
                    )
            return response;
        }catch (e) {
            console.log(e)
        }
    },

    // 토큰 재발급
    Reissue: async function () {
        try {
            await axios
                .post(
                    process.env.REACT_APP_BASE_URL + '/api/tokenReissue',
                    JSON.stringify({...new TokenStatusInfo}),
                    {
                        headers: {
                            'Content-Type': "application/json"
                        }
                    })
                .then(({data}) => {
                    localStorage.setItem('Authorization', data.result);
                });
        }catch (e) {
            console.log(e)
        }
    }
}

export default TokenMethod;