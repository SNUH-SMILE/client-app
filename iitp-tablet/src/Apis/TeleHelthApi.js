import AuthorizationAxios from "../Utils/AuthorizationAxios";

class TeleHelthApi {

    constructor() {
    }

    async saveVideo(admissionId) {
        try {
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/teleHealth/teleArchiveDown',
                JSON.stringify({
                    admissionId : admissionId
                }),
                {headers: {'Content-Type': "application/json"}}
            )
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }

    async select(admissionId) {
        try {
            const response = await AuthorizationAxios.post(
            process.env.REACT_APP_BASE_URL + '/api/teleHealth/getTeleHealth',
                JSON.stringify({
                    admissionId : admissionId
                }),
                {headers: {'Content-Type': "application/json"}}
            )
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }
}
export default TeleHelthApi;