import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../../Utils/AuthorizationAxios";
import {fireEvent, render, waitFor} from "@testing-library/react";
import AlertStore from "../../Providers/AlertContext";
import TitleStore from "../../Providers/TitleContext";
import {BrowserRouter} from "react-router-dom";
import HcAlert from "../../component/HCAlert";
import Qna from "./Qna";
import userEvent from "@testing-library/user-event";
import {BsCheckLg} from "react-icons/bs";
import React from "react";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})
    // 문의사항 리스트 조회
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/qna/list',
        {
            "centerId": "",
            "replyYn": "",
            "searchGb": "patientId",
            "searchText": "",
            "currentPageNo": 1,
            "recordCountPerPage": 15,
            "pageSize": 10
        }
    )
        .reply(200, {
            code: '00', message: '조회성공',
            result: {
                paginationInfoVO: {
                    centerId: "",
                    currentPageNo: 1,
                    firstPageNo: 1,
                    firstPageNoOnPageList: 1,
                    lastPageNo: 4,
                    lastPageNoOnPageList: 4,
                    nextPageExists: true,
                    nextPageNo: 2,
                    nextPaginationExists: false,
                    offsetCount: 0,
                    orderBy: "",
                    orderDir: null,
                    pageSize: 10,
                    prevPageExists: false,
                    prevPageNo: -1,
                    prevPaginationExists: false,
                    recordCountPerPage: 15,
                    replyYn: "",
                    searchGb: "patientId",
                    searchText: "",
                    totalPageCount: 4,
                    totalRecordCount: 46,
                },
                qnaVOList: [
                    {
                        "questionSeq": 777,
                        "centerId": "C001",
                        "patientId": "P777777777",
                        "patientNm": "Test환자0",
                        "questionType": "03",
                        "questionTypeNm": "기기 사용법",
                        "questionContent": "TesterQuestion",
                        "regDt": "2022-06-16 09:49:49",
                        "replyId": null,
                        "replyNm": null,
                        "replyYn": "N",
                        "replyContent": null,
                        "replyDt": null
                    },
                    {
                        "questionSeq": 999,
                        "centerId": "C002",
                        "patientId": "P999999999",
                        "patientNm": "Test환자",
                        "questionType": "01",
                        "questionTypeNm": "일반",
                        "questionContent": "Test문의내역",
                        "regDt": "2022-06-16 10:13:40",
                        "replyId": "test",
                        "replyNm": "테스터",
                        "replyYn": "Y",
                        "replyContent": "BeforeReplyContent",
                        "replyDt": "2022-06-17 13:47:20"
                    },
                    {
                        "questionSeq": 888,
                        "centerId": "C002",
                        "patientId": "P888888888",
                        "patientNm": "Test환자2",
                        "questionType": "01",
                        "questionTypeNm": "일반",
                        "questionContent": "Test문의내역2",
                        "regDt": "2022-06-16 10:13:40",
                        "replyId": null,
                        "replyNm": null,
                        "replyYn": "N",
                        "replyContent": null,
                        "replyDt": null
                    },
                ],
            }

        })

    // 문의사항 리스트 조회
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/qna/list',
        {
            "centerId": "",
            "replyYn": "",
            "searchGb": "patientId",
            "searchText": "P999999999",
            "currentPageNo": 1,
            "recordCountPerPage": 15,
            "pageSize": 10
        }
    )
        .reply(200, {
            code: '00', message: '조회성공',
            result: {
                paginationInfoVO: {
                    "currentPageNo": 1,
                    "recordCountPerPage": 15,
                    "pageSize": 10,
                    "totalRecordCount": 1,
                    "totalPageCount": 1,
                    "firstPageNoOnPageList": 1,
                    "lastPageNoOnPageList": 1,
                    "offsetCount": 0,
                    "prevPageExists": false,
                    "prevPaginationExists": false,
                    "nextPageExists": false,
                    "nextPaginationExists": false,
                    "prevPageNo": -1,
                    "nextPageNo": -1,
                    "orderBy": "",
                    "orderDir": null,
                    "centerId": "",
                    "replyYn": "",
                    "searchGb": "patientId",
                    "searchText": "P999999999",
                    "lastPageNo": 1,
                    "firstPageNo": 1
                },
                qnaVOList: [
                    {
                        "questionSeq": 999,
                        "centerId": "C002",
                        "patientId": "P999999999",
                        "patientNm": "Test환자",
                        "questionType": "01",
                        "questionTypeNm": "일반",
                        "questionContent": "Test문의내역",
                        "regDt": "2022-06-16 10:13:40",
                        "replyId": "test",
                        "replyNm": "테스터",
                        "replyYn": "Y",
                        "replyContent": "BeforeReplyContent",
                        "replyDt": "2022-06-17 13:47:20"
                    },

                ],
            }

        })


    // 문의사항 상세 조회
    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/qna/info', {params: {questionSeq: 999}})
        .reply(200, {
            code: '00', message: '조회 성공',
            result: {
                "questionSeq": 999,
                "centerId": "C002",
                "patientId": "P999999999",
                "patientNm": "Test환자",
                "questionType": "01",
                "questionTypeNm": "일반",
                "questionContent": "Test문의내역",
                "regDt": "2022-06-16 10:13:40",
                "replyId": "test",
                "replyNm": "테스터",
                "replyYn": "Y",
                "replyContent": "BeforeReplyContent",
                "replyDt": "2022-06-17 13:47:20"
            }
        })
    // 문의사항 상세 조회
    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/qna/info', {params: {questionSeq: 888}})
        .reply(200, {
            code: '00', message: '조회 성공',
            result: {
                "questionSeq": 888,
                "centerId": "C002",
                "patientId": "P888888888",
                "patientNm": "Test환자2",
                "questionType": "01",
                "questionTypeNm": "일반",
                "questionContent": "Test문의내역2",
                "regDt": "2022-06-16 10:13:40",
                "replyId": null,
                "replyNm": null,
                "replyYn": "N",
                "replyContent": null,
                "replyDt": null
            },
        })
    // 문의사항 상세 조회
    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/qna/info', {params:{questionSeq: 777}})
        .reply(200, {
            code: '00', message: '조회 성공',
            result: {
                "questionSeq": 777,
                "centerId": "C001",
                "patientId": "P777777777",
                "patientNm": "Test환자0",
                "questionType": "03",
                "questionTypeNm": "기기 사용법",
                "questionContent": "TesterQuestion",
                "regDt": "2022-06-16 09:49:49",
                "replyId": null,
                "replyNm": null,
                "replyYn": "N",
                "replyContent": null,
                "replyDt": null
            }
        })

    //문의사항 답변 저장
    mockAxios.onPatch(process.env.REACT_APP_BASE_URL + '/api/qna/save/reply')
        .reply(200,{
            code:'00', message:'저장 성공',
            result:{
                'paginationInfoVO': {
                    "currentPageNo": 1,
                    "recordCountPerPage": 15,
                    "pageSize": 10,
                    "totalRecordCount": 1,
                    "totalPageCount": 1,
                    "firstPageNoOnPageList": 1,
                    "lastPageNoOnPageList": 1,
                    "offsetCount": 0,
                    "prevPageExists": false,
                    "prevPaginationExists": false,
                    "nextPageExists": false,
                    "nextPaginationExists": false,
                    "prevPageNo": -1,
                    "nextPageNo": -1,
                    "orderBy": "",
                    "orderDir": null,
                    "centerId": "",
                    "replyYn": "",
                    "searchGb": "patientId",
                    "searchText": "P999999999",
                    "lastPageNo": 1,
                    "firstPageNo": 1
                },
                "qnaVOList": [
                    {
                        "questionSeq": 777,
                        "centerId": "C001",
                        "patientId": "P777777777",
                        "patientNm": "Test환자0",
                        "questionType": "03",
                        "questionTypeNm": "기기 사용법",
                        "questionContent": "TesterQuestion",
                        "regDt": "2022-06-16 09:49:49",
                        "replyId": "test",
                        "replyNm": "테스터",
                        "replyYn": "Y",
                        "replyContent": "TestReplyContent",
                        "replyDt": "2022-06-17 13:47:20"
                    },
                    {
                        "questionSeq": 999,
                        "centerId": "C002",
                        "patientId": "P999999999",
                        "patientNm": "Test환자",
                        "questionType": "01",
                        "questionTypeNm": "일반",
                        "questionContent": "Test문의내역",
                        "regDt": "2022-06-16 10:13:40",
                        "replyId": null,
                        "replyNm": null,
                        "replyYn": "N",
                        "replyContent": null,
                        "replyDt": null
                    },
                    {
                        "questionSeq": 888,
                        "centerId": "C002",
                        "patientId": "P888888888",
                        "patientNm": "Test환자2",
                        "questionType": "01",
                        "questionTypeNm": "일반",
                        "questionContent": "Test문의내역2",
                        "regDt": "2022-06-16 10:13:40",
                        "replyId": null,
                        "replyNm": null,
                        "replyYn": "N",
                        "replyContent": null,
                        "replyDt": null
                    }
                ]
            }
        })
    //문의사항 답변 저장
    mockAxios.onDelete(process.env.REACT_APP_BASE_URL + '/api/qna/save/reply')
        .reply(200,{
            code:'00', message:'삭제 성공',
            result:{
                'paginationInfoVO': {
                    "currentPageNo": 1,
                    "recordCountPerPage": 15,
                    "pageSize": 10,
                    "totalRecordCount": 1,
                    "totalPageCount": 1,
                    "firstPageNoOnPageList": 1,
                    "lastPageNoOnPageList": 1,
                    "offsetCount": 0,
                    "prevPageExists": false,
                    "prevPaginationExists": false,
                    "nextPageExists": false,
                    "nextPaginationExists": false,
                    "prevPageNo": -1,
                    "nextPageNo": -1,
                    "orderBy": "",
                    "orderDir": null,
                    "centerId": "",
                    "replyYn": "",
                    "searchGb": "patientId",
                    "searchText": "P999999999",
                    "lastPageNo": 1,
                    "firstPageNo": 1
                },
                "qnaVOList": [
                    {
                        "questionSeq": 777,
                        "centerId": "C001",
                        "patientId": "P777777777",
                        "patientNm": "Test환자0",
                        "questionType": "03",
                        "questionTypeNm": "기기 사용법",
                        "questionContent": "TesterQuestion",
                        "regDt": "2022-06-16 09:49:49",
                        "replyId": "test",
                        "replyNm": "테스터",
                        "replyYn": "Y",
                        "replyContent": "TestReplyContent",
                        "replyDt": "2022-06-17 13:47:20"
                    },
                    {
                        "questionSeq": 888,
                        "centerId": "C002",
                        "patientId": "P888888888",
                        "patientNm": "Test환자2",
                        "questionType": "01",
                        "questionTypeNm": "일반",
                        "questionContent": "Test문의내역2",
                        "regDt": "2022-06-16 10:13:40",
                        "replyId": null,
                        "replyNm": null,
                        "replyYn": "N",
                        "replyContent": null,
                        "replyDt": null
                    }
                ]
            }
        })
    // 사용자 정보 조회
    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/user/info/token')
        .reply(200, {
            "code": "00",
            "message": "사용자 정보 조회 완료",
            "result": {
                "regId": "admin",
                "regNm": null,
                "regDt": "2021-11-22 15:56:10",
                "updId": "test",
                "updNm": null,
                "updDt": "2022-06-11 16:16:25",
                "userId": "test",
                "password": "1234",
                "userNm": "테스터",
                "delYn": "N",
                "mainCenterId": "C001",
                "mainCenterNm": "테스트 생활치료센터",
                "remark": "123123123681111111",
                "rememberYn": "N",
                "userTreatmentCenterVOList": [
                    {
                        "regId": "test",
                        "regNm": "테스터",
                        "regDt": null,
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "userId": "test",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "mainYn": "Y"
                    },
                    {
                        "regId": "test",
                        "regNm": "테스터",
                        "regDt": null,
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "userId": "test",
                        "centerId": "C002",
                        "centerNm": "테스트 생활치료센터1",
                        "mainYn": "N"
                    }
                ]
            }
        })


});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe('QnaPage', () => {
    // 문의사항 페이지 Mount 및 useEffect[] 테스트
    test('Mount QnaPage And Effect is Succeed', async () => {
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Qna/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("Test환자")).toBeInTheDocument();
            expect(getByText("Test문의내역")).toBeInTheDocument();
        })
    })


    // 환자Id로 검색
    test('Search Qna With PatientID', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Qna/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("Test환자")).toBeInTheDocument();
            expect(getByText("Test문의내역")).toBeInTheDocument();
            expect(getByText("Test환자2")).toBeInTheDocument();
            expect(getByText("Test문의내역2")).toBeInTheDocument();
        })

        const searchInput = getByRole('searchInput');
        userEvent.type(searchInput, 'P999999999');
        expect(searchInput).toHaveValue('P999999999');

        const searchButton = getByText('검색');
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(() => getByText("Test환자2")).toThrow();
            expect(() => getByText("Test문의내역2")).toThrow();
        })
    })

    // 문의사항 상세조회 및 Modal 오픈
    test('Get Qna Detail And Show QnaSave Modal', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Qna/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("Test환자")).toBeInTheDocument();
            expect(getByText("Test문의내역")).toBeInTheDocument();
        })

        const testRow = getByText("Test환자");

        fireEvent.click(testRow);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('Test환자(P999999999)');
            expect(() => modal.getByText("삭제")).toThrow();
            expect(modal).toHaveTextContent('등록')
        })
    })

    // 문의사항 상세조회 Modal에서 답변을 입력하지 않고 등록버튼 누를시 Alert가 표현되는지
    test('Set QnaReply With Null ReplyContent', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Qna/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("Test환자2")).toBeInTheDocument();
            expect(getByText("Test문의내역2")).toBeInTheDocument();
        })

        const testRow = getByText("Test환자2");

        fireEvent.click(testRow);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('Test환자2(P888888888)');
            expect(() => modal.getByText("삭제")).toThrow();
            expect(modal).toHaveTextContent('등록')
        })

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        const alert = getByText('답변내용이 공백입니다.');
        await waitFor(()=>{
            expect(alert).toBeInTheDocument();
        })

    })


    // 문의사항 답변등록
    test('Set QnaReply is succeed', async () => {
        const { getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Qna/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("Test환자0")).toBeInTheDocument();
            expect(getByText("TesterQuestion")).toBeInTheDocument();
        })

        const testRow = getByText("TesterQuestion");

        fireEvent.click(testRow);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('Test환자0(P777777777)');
            expect(() => modal.getByText("삭제")).toThrow();
            expect(modal).toHaveTextContent('등록')
        })
        const replyContent = getByRole('replyContent');
        userEvent.type(replyContent,'TestReplyContent');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);


        const confirm = getByText('답변을 저장하시겠습니까?');
        await waitFor(()=>{
            expect(confirm).toBeInTheDocument();
        })
        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);

        await waitFor(()=>{
            expect(confirm).not.toBeInTheDocument();

            expect(() => getByRole('dialog')).toThrow();
        })

        const alert = getByText('저장 성공')
        expect(alert).toBeInTheDocument();

        const checkIcon = getByRole('replyCheckIcon')
        expect(testRow.closest('tr')).toContainElement(checkIcon);

    })


    // 문의사항 답변 수정
    test('Update QnaReply is succeed', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Qna/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("Test환자")).toBeInTheDocument();
            expect(getByText("Test문의내역")).toBeInTheDocument();
        })

        const testRow = getByText("Test환자");

        fireEvent.click(testRow);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('Test환자(P999999999)');
            // expect(() => modal.getByText("삭제")).toThrow();
            expect(modal).toHaveTextContent('수정')
            expect(modal).toHaveTextContent('삭제')
        })

        const replyContent = getByRole('replyContent');
        userEvent.type(replyContent,'UpdateReplyContent');

        const modalButton = getByText('수정');
        fireEvent.click(modalButton);

        const confirm = getByText('답변을 저장하시겠습니까?');
        await waitFor(()=>{
            expect(confirm).toBeInTheDocument();
        })
        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);

        await waitFor(()=>{
            expect(confirm).not.toBeInTheDocument();

            expect(() => getByRole('dialog')).toThrow();
        })

        const alert = getByText('저장 성공')
        expect(alert).toBeInTheDocument();
    })


    // 문의사항 답변 삭제
    test('Delete QnaReply is succeed', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Qna/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("Test환자")).toBeInTheDocument();
            expect(getByText("Test문의내역")).toBeInTheDocument();
        })

        const testRow = getByText("Test환자");

        fireEvent.click(testRow);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('Test환자(P999999999)');
            expect(modal).toHaveTextContent('수정')
            expect(modal).toHaveTextContent('삭제')
        })

        const replyContent = getByRole('replyContent');
        userEvent.type(replyContent,'UpdateReplyContent');

        const modalButton = getByText('삭제');
        fireEvent.click(modalButton);

        const confirm = getByText('답변을 삭제하시겠습니까?');
        await waitFor(()=>{
            expect(confirm).toBeInTheDocument();
        })
        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);

        await waitFor(()=>{
            expect(confirm).not.toBeInTheDocument();

            expect(() => getByRole('dialog')).toThrow();
        })

        const alert = getByText('삭제 성공')
        expect(alert).toBeInTheDocument();
    })



})