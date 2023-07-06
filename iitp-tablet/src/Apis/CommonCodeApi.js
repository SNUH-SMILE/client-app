import AuthorizationAxios from "../Utils/AuthorizationAxios";

class CommonCodeApi {
    constructor(
        searchComCd,
        searchComCdNm,
        searchUseYn,
        searchComCdDetail,
        detailUseYn,
    ) {

        // 공통코드 구분

        //공통코드 구분 검색
        this.searchComCd = searchComCd;
        this.searchComCdNm = searchComCdNm;
        this.searchUseYn = searchUseYn;

        // 공통코드

        // 공통코드 검색
        this.searchComCdDetail = searchComCdDetail;
        this.detailUseYn = detailUseYn;
    }

    //공통코드 구분 리스트 조회
    async select () {
        try{
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/comCd/list',
                JSON.stringify({
                    comCd:this.searchComCd.current.value,
                    comCdNm:this.searchComCdNm.current.value,
                    useYn: this.searchUseYn.current.value
                }),
                {headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }

    //공통코드 구분 리스트 신규 생성 및 업데이트
    async save (data) {
        try{
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/comCd/save',
                JSON.stringify({
                    ComCdSearchVO:{
                        comCd:this.searchComCd.current.value,
                        comCdNm:this.searchComCdNm.current.value,
                        useYn: this.searchUseYn.current.value
                    },
                    comCdVOList: data

                }),
                {headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }
    //공통코드 상세 리스트 조회
    async selectDetail (comCd) {
        try{
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/comCd/detail/list',
                JSON.stringify({
                    comCd:comCd,
                    useYn: this.detailUseYn.current.value
                }),
                {headers: {'Content-Type': "application/json"}}
            );
            return response;
        }catch (e) {
            console.log(e);
            return false;
        }
    }
    //공통코드 상세 리스트 신규 생성 및 업데이트
    async saveDetail(data) {
        try{
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/comCd/detail/save',
                JSON.stringify({
                    comCdDetailSearchVO:{
                        comCd:this.searchComCdDetail.current,
                        detailCd:'',
                        useYn: this.searchComCdDetail.current.value
                    },
                    comCdDetailVOList: data

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

export default CommonCodeApi;