import AuthorizationAxios from "../Utils/AuthorizationAxios";

class QnaApi {
    constructor(centerId, replyYn, searchGb, searchText, paginationObj) {
        this.centerId = centerId;
        this.replyYn = replyYn;
        this.searchGb = searchGb;
        this.searchText = searchText;
        this.currentPageNo = paginationObj.currentPageNo;
        this.recordCountPerPage = paginationObj.recordCountPerPage;
        this.pageSize = paginationObj.pageSize;
    }

    //문의사항 리스트 조회
    async select() {
        try {
            const response = await AuthorizationAxios.post(
                process.env.REACT_APP_BASE_URL + '/api/qna/list',
                JSON.stringify({
                    centerId: this.centerId.current.value,
                    replyYn: this.replyYn.current.value,
                    searchGb: this.searchGb.current.value,
                    searchText: this.searchText.current.value,
                    currentPageNo: this.currentPageNo,
                    recordCountPerPage: this.recordCountPerPage,
                    pageSize: this.pageSize,
                }),
                {headers: {'Content-Type': "application/json"}}
            );
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    //문의사항 상세조회
    async detail(questionSeq) {
        try {
            const response = await AuthorizationAxios.get(
                process.env.REACT_APP_BASE_URL + '/api/qna/info',
                {params: {questionSeq: questionSeq}}
            );
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    //문의사항 답변 저장
    async save(questionSeq, replyContent) {
        try {
            const response = await AuthorizationAxios.patch(
                process.env.REACT_APP_BASE_URL + '/api/qna/save/reply',
                JSON.stringify({
                    qnaListSearchVO: {
                        centerId: this.centerId.current.value,
                        replyYn: this.replyYn.current.value,
                        searchGb: this.searchGb.current.value,
                        searchText: this.searchText.current.value,
                        currentPageNo: this.currentPageNo,
                        recordCountPerPage: this.recordCountPerPage,
                        pageSize: this.pageSize,
                    },
                    questionSeq: questionSeq,
                    replyContent: replyContent,
                }),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    //문의사항 답변 삭제
    async delete(questionSeq) {
        try {
            const response = await AuthorizationAxios.delete(
                process.env.REACT_APP_BASE_URL + '/api/qna/save/reply',
                {
                    data: JSON.stringify({
                        qnaListSearchVO: {
                            centerId: this.centerId.current.value,
                            replyYn: this.replyYn.current.value,
                            searchGb: this.searchGb.current.value,
                            searchText: this.searchText.current.value,
                            currentPageNo: this.currentPageNo,
                            recordCountPerPage: this.recordCountPerPage,
                            pageSize: this.pageSize,
                        },
                        questionSeq: questionSeq,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

export default QnaApi