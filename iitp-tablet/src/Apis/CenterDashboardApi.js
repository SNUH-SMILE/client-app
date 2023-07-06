import AuthorizationAxios from "../Utils/AuthorizationAxios";

class CenterDashboardApi {
    // constructor(qantnDiv, centerId) {
    constructor() {
        // this.qantnDiv = qantnDiv;
        // this.centerId = centerId;
    }

    async select (qantnDiv, centerId) {
        try{
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/patientDashboard/status/list',
                JSON.stringify({
                    qantnDiv:qantnDiv,
                    centerId:centerId,
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


export default CenterDashboardApi;