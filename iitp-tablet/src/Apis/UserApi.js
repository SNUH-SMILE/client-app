import AuthorizationAxios from "../Utils/AuthorizationAxios";

export default class UserApi {

    constructor(
        userId,
        userPw,
        userNm,
        remark,
        userTreatmentCenterVOList,
        userSearchId,
        userSearchNm,
        userSearchTreatmentCenter,
        lvl
    ) {
        //상세 정보
        this.userId = userId;
        this.password = userPw;
        this.userNm = userNm;
        this.remark = remark;
        this.mainCenter = {...userTreatmentCenterVOList.find(value => value.mainYn === 'Y')}
        this.userTreatmentCenterVOList = userTreatmentCenterVOList;
        this.lvl = lvl;

        //검색 정보
        this.userSearchId = userSearchId;
        this.userSearchNm = userSearchNm;
        this.userSearchTreatmentCenter = userSearchTreatmentCenter.centerId;
    }
    async select () {
        try{
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/user/list',
                JSON.stringify({
                    userId:this.userSearchId.current.value,
                    userNm:this.userSearchNm.current.value,
                    centerId:this.userSearchTreatmentCenter,
                }),
                {headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }

    async detail (userId) {
        try{
            const response = await AuthorizationAxios.get(
                process.env.REACT_APP_BASE_URL + '/api/user/info',
                {params: {userId: userId}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }

    async save () {
        try{
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/user/save',
                JSON.stringify({
                    userSearchVO:{
                        userId:this.userSearchId.current.value,
                        userNm:this.userSearchNm.current.value,
                        centerId:this.userSearchTreatmentCenter,
                    },
                    userVO:{
                        userId: this.userId.current.value,
                        password: this.password.current.value,
                        userNm: this.userNm.current.value,
                        remark: this.remark.current.value,
                        mainCenterId:this.mainCenter.centerId,
                        mainCenterNm:this.mainCenter.centerNm,
                        userTreatmentCenterVOList:this.userTreatmentCenterVOList,
                        lvl:this.lvl.current.value,
                    }
                }),
                {headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }


    async delete () {
        try{
            const response = await AuthorizationAxios.delete(
                process.env.REACT_APP_BASE_URL + '/api/user/save',
                {data:JSON.stringify({
                    userSearchVO:{
                        userId:this.userSearchId.current.value,
                        userNm:this.userSearchNm.current.value,
                        centerId:this.userSearchTreatmentCenter,
                    },
                    userVO:{userId: this.userId.current.value},
                }),
                headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }
}