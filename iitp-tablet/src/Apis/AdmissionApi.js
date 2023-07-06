import AuthorizationAxios from "../Utils/AuthorizationAxios";

class AdmissionApi {
    
    constructor(
        searchAdmissionCenter,
        searchAdmissionId,
        searchAdmissionNm,
        activeStatus,
        searchAdmissionState,
        paginationObj,
        sortedOrderBy,
        sortedOrderDir,
    ) {
        //검색
        this.searchAdmissionCenter = searchAdmissionCenter
        this.searchAdmissionId = searchAdmissionId
        this.searchAdmissionNm = searchAdmissionNm
        this.searchAdmissionState = searchAdmissionState
        this.activeStatus = activeStatus
        this.pageSize=paginationObj.pageSize;
        this.currentPageNo=paginationObj.currentPageNo;
        this.recordCountPerPage=paginationObj.recordCountPerPage;
        this.sortedOrderBy=sortedOrderBy;
        this.sortedOrderDir=sortedOrderDir;
    }
    
    
    
    
    //생활치료센터 입소자 리스트 조회
    async select () {
        try{
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/admission/center/list',
                JSON.stringify({
                    centerId:this.searchAdmissionCenter.current.value,
                    patientId:this.searchAdmissionId.current.value,
                    patientNm: this.searchAdmissionNm.current.value,
                    qantnStatus: this.searchAdmissionState.current.value,
                    activeStatus: this.activeStatus,
                    currentPageNo:this.currentPageNo,
                    recordCountPerPage:this.recordCountPerPage,
                    pageSize:this.pageSize,
                    orderBy:this.sortedOrderBy,
                    orderDir:this.sortedOrderDir,
                }),
                {headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }

    //생활치료센터 입소자 상세정보 조회
    async detail (admissionId) {
        try{
            const response = await AuthorizationAxios.get(
                process.env.REACT_APP_BASE_URL + '/api/admission/info',
                {params:{admissionId:admissionId}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }

    //생활치료센터 입소자 상세정보 업데이트
    async create (saveData){
        try{
            const response = await AuthorizationAxios.put(process.env.REACT_APP_BASE_URL + '/api/admission/center/save',
                JSON.stringify({
                    admissionListSearchByCenterVO:{
                        centerId:this.searchAdmissionCenter.current.value,
                        patientId:this.searchAdmissionId.current.value,
                        patientNm: this.searchAdmissionNm.current.value,
                        currentPageNo:this.currentPageNo,
                        recordCountPerPage:this.recordCountPerPage,
                        pageSize:this.pageSize,
                        orderBy:this.sortedOrderBy,
                        orderDir:this.sortedOrderDir,
                    },
                    patientNm:saveData.patientNm.current.value,
                    birthDate:saveData.birthDate.current.value.replaceAll('-',''),
                    sex:saveData.sex,
                    cellPhone:saveData.cellPhone.current.value,
                    admissionDate:saveData.admissionDate.current.value.replaceAll('-',''),
                    dschgeSchdldDate:saveData.dschgeSchdldDate.current.value.replaceAll('-',''),
                    personCharge:saveData.personCharge.current.value,
                    centerId:saveData.centerId.current.value,
                    room:saveData.room.current.value,
                    searsAccount: saveData.searsAccount.current.value,
                }),
                {headers: {'Content-Type': "application/json"}});
            return response;
        }catch (e) {
            console.log(`AdmissionApi create`);
            return false;
        }
    }

    //생활치료센터 입소자 상세정보 업데이트
    async update (saveData){
        try{
            const response = await AuthorizationAxios.patch(process.env.REACT_APP_BASE_URL + '/api/admission/center/save',
                JSON.stringify({
                    admissionListSearchByCenterVO:{
                        centerId:this.searchAdmissionCenter.current.value,
                        patientId:this.searchAdmissionId.current.value,
                        patientNm: this.searchAdmissionNm.current.value,
                        currentPageNo:this.currentPageNo,
                        recordCountPerPage:this.recordCountPerPage,
                        pageSize:this.pageSize,
                        orderBy:this.sortedOrderBy,
                        orderDir:this.sortedOrderDir,
                    },
                    admissionId:saveData.admissionId.current.value,
                    patientId:saveData.patientId.current.value,
                    patientNm:saveData.patientNm.current.value,
                    birthDate:saveData.birthDate.current.value.replaceAll('-',''),
                    sex:saveData.sex,
                    cellPhone:saveData.cellPhone.current.value,
                    admissionDate:saveData.admissionDate.current.value.replaceAll('-',''),
                    dschgeSchdldDate:saveData.dschgeSchdldDate.current.value.replaceAll('-',''),
                    personCharge:saveData.personCharge.current.value,
                    centerId:saveData.centerId.current.value,
                    room:saveData.room.current.value,
                    searsAccount: saveData.searsAccount.current.value,
                    activeStatus:'1',
                    memo: null
                }),
                {headers: {'Content-Type': "application/json"}});
            return response;
        }catch (e) {
            console.log(`AdmissionApi Update`);
            return false;
        }
    }
    //생활치료센터 입소자 복구 처리
    async charge (admissionId,dischargeDate,quantLocation,centerId){
        try{
            const response = await AuthorizationAxios.patch(process.env.REACT_APP_BASE_URL + '/api/admission/center/charge',
                JSON.stringify({
                    admissionListSearchByCenterVO:{
                        centerId:centerId,
                        patientId:this.searchAdmissionId.current.value,
                        patientNm: this.searchAdmissionNm.current.value,
                        currentPageNo:this.currentPageNo,
                        recordCountPerPage:this.recordCountPerPage,
                        pageSize:this.pageSize,
                        orderBy:this.sortedOrderBy,
                        orderDir:this.sortedOrderDir,
                    },
                    admissionId:admissionId,
                    dschgeDate:dischargeDate.replaceAll('-',''),
                    quantLocation:quantLocation,
                }),
                {headers: {'Content-Type': "application/json"}});
            return response;
        }catch (e) {
            console.log(e);
            console.log(`AdmissionApi discharge`);
            return false;
        }
    }

    //생활치료센터 입소자 퇴실 처리
    async discharge (admissionId,dischargeDate,quantLocation,centerId){
        try{
            const response = await AuthorizationAxios.patch(process.env.REACT_APP_BASE_URL + '/api/admission/center/discharge',
                JSON.stringify({
                    admissionListSearchByCenterVO:{
                        centerId:centerId,
                        patientId:this.searchAdmissionId.current.value,
                        patientNm: this.searchAdmissionNm.current.value,
                        currentPageNo:this.currentPageNo,
                        recordCountPerPage:this.recordCountPerPage,
                        pageSize:this.pageSize,
                        orderBy:this.sortedOrderBy,
                        orderDir:this.sortedOrderDir,
                    },
                    admissionId:admissionId,
                    dschgeDate:dischargeDate.replaceAll('-',''),
                    quantLocation:quantLocation,
                }),
                {headers: {'Content-Type': "application/json"}});
            return response;
        }catch (e) {
            console.log(e);
            console.log(`AdmissionApi discharge`);
            return false;
        }
    }

    async logDetail (admissionId) {
        try{
            const response = await AuthorizationAxios.get(
                process.env.REACT_APP_BASE_URL + '/api/admission/logInfo',
                {params:{admissionId:admissionId}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }
}

export default AdmissionApi;