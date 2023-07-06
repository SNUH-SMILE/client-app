import AuthorizationAxios from "../Utils/AuthorizationAxios";

class TreatmentCenterApi {
    /**
     * handledCloseIsolationExitModal
     * @param centerId                                 생활치료센터 ID
     * @param centerNm                                 생활치료센터명
     * @param centerLocation                           생활치료센터위치
     * @param hospitalCd                               생활치료센터 병원코드
     * @param treatmentCenterSearchId                  검색 생활치료센터 ID
     * @param treatmentCenterSearchNm                  검색 생활치료센터명
     * @param treatmentCenterSearchHospitalNm          검색 생활치료센터 병원병
     */
    constructor(
        centerId,
        centerNm,
        centerLocation,
        hospitalCd,
        treatmentCenterSearchId,
        treatmentCenterSearchNm,
        treatmentCenterSearchHospitalNm,
    ) {
        // 상세조회, 신규, 수정, 삭제
        this.centerId = centerId;
        this.centerNm = centerNm;
        this.centerLocation = centerLocation;
        this.hospitalCd = hospitalCd;

        // 검색
        this.treatmentCenterSearchId=treatmentCenterSearchId;
        this.treatmentCenterSearchNm=treatmentCenterSearchNm;
        this.treatmentCenterSearchHospitalNm=treatmentCenterSearchHospitalNm;

    }

    //생활치료센터 리스트 조회
    async select () {
        try{
            const response = await AuthorizationAxios.post(
                                                  process.env.REACT_APP_BASE_URL + '/api/treatmentCenter/list',
                                                      JSON.stringify({
                                                          centerId:this.treatmentCenterSearchId?this.treatmentCenterSearchId.current.value:'',
                                                          centerNm:this.treatmentCenterSearchNm?this.treatmentCenterSearchNm.current.value:'',
                                                          hospitalNm: this.treatmentCenterSearchHospitalNm?this.treatmentCenterSearchHospitalNm.current.value:''
                                                      }),
                                               {headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }


    //생활치료센터 상세조회
    async detail (selectCenterId){
        try{
            const response = await AuthorizationAxios.post(process.env.REACT_APP_BASE_URL + '/api/treatmentCenter/info',
                                                               JSON.stringify({
                                                                   centerId:selectCenterId,
                                                               }),
                                                       {headers: {'Content-Type': "application/json"}}
                );
            return response;
        }catch (e) {
            console.log(`TreatmentCenterApi Detail`);
            return false;
        }
    }

    //생활치료센터 신규 생성
    async insert (){
        try{
            const response = await AuthorizationAxios.put( process.env.REACT_APP_BASE_URL + '/api/treatmentCenter/save',
                JSON.stringify({
                    searchInfo:{
                        centerId:this.treatmentCenterSearchId.current.value,
                        centerNm:this.treatmentCenterSearchNm.current.value,
                        hospitalNm: this.treatmentCenterSearchHospitalNm.current.value
                    },
                    centerNm:this.centerNm.current.value,
                    centerLocation:this.centerLocation.current.value,
                    hospitalCd: this.hospitalCd.current.value,
                }),
                {headers: {'Content-Type': "application/json"}});
            return response;
        }catch (e) {
            console.log(`TreatmentCenterApi Insert`);
            return false;
        }
    }

    //생활치료센터 업데이트
    async update (){
        try{
            const response = await AuthorizationAxios.patch(process.env.REACT_APP_BASE_URL + '/api/treatmentCenter/save',
                                                              JSON.stringify({
                                                                  searchInfo:{
                                                                      centerId:this.treatmentCenterSearchId.current.value,
                                                                      centerNm:this.treatmentCenterSearchNm.current.value,
                                                                      hospitalNm: this.treatmentCenterSearchHospitalNm.current.value
                                                                  },
                                                                  centerId:this.centerId.current.value,
                                                                  centerNm:this.centerNm.current.value,
                                                                  centerLocation:this.centerLocation.current.value,
                                                                  hospitalCd: this.hospitalCd.current.value,
                                                              }),
                                                            {headers: {'Content-Type': "application/json"}});
            return response;
        }catch (e) {
            console.log(`TreatmentCenterApi Update`);
            return false;
        }
    }

    //생활치료센터 삭제
    async delete (){
        try{
            const response = await AuthorizationAxios.delete(process.env.REACT_APP_BASE_URL + '/api/treatmentCenter/save',
                                                          {
                                                                  data:JSON.stringify({
                                                                      searchInfo:{
                                                                          centerId:this.treatmentCenterSearchId.current.value,
                                                                          centerNm:this.treatmentCenterSearchNm.current.value,
                                                                          hospitalNm: this.treatmentCenterSearchHospitalNm.current.value
                                                                      },
                                                                      centerId:this.centerId.current.value
                                                                  }),
                                                                  headers: {'Content-Type': "application/json"}}
                );
            return response;
        }catch (e) {
            console.log(`TreatmentCenterApi Delete`);
            return false;
        }
    }
}

export default TreatmentCenterApi;