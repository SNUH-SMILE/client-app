import AuthorizationAxios from "../Utils/AuthorizationAxios";

class OpentokApi {
    constructor(){

    }
    async archive(sessionId,admissionId) {
        try {
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/teleHealth/getArchive',
                JSON.stringify({
                    sessionId : sessionId,
                    admissionId : admissionId

                }),
                {headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }

    async archiveStop(archive) {
        try {
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/teleHealth/ArchiveStop',
                JSON.stringify({
                    archiveId : archive
                }),
                {headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }

}

export default OpentokApi
