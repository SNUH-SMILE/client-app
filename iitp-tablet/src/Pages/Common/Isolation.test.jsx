import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../../Utils/AuthorizationAxios";
import {fireEvent, getByRole, render, waitFor} from "@testing-library/react";
import AlertStore from "../../Providers/AlertContext";
import TitleStore from "../../Providers/TitleContext";
import {BrowserRouter} from "react-router-dom";
import HcAlert from "../../component/HCAlert";
import React from "react";
import Isolation from "./Isolation";
import userEvent from "@testing-library/user-event";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})

    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/admission/quarantine/list')
        .reply(200, {
            "code": "00",
            "message": "조회 성공",
            "result": {
                "paginationInfoVO": {
                    "currentPageNo": 1,
                    "recordCountPerPage": 15,
                    "pageSize": 10,
                    "totalRecordCount": 3,
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
                    "orderDir": "",
                    "patientId": "",
                    "patientNm": "",
                    "firstPageNo": 1,
                    "lastPageNo": 1
                },
                "admissionByQuarantineVOList": [
                    {
                        "admissionId": "9999999999",
                        "sbpResult": "190",
                        "dbpResult": "40",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "L",
                        "bpResultDt": "2022-06-13 17:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "147",
                        "prRiskGb": "H",
                        "prResultDt": "2022-06-13 16:00:00",
                        "prUnit": "BPM",
                        "btResult": "24",
                        "btRiskGb": "L",
                        "btResultDt": "2022-06-13 16:00:00",
                        "btUnit": "℃",
                        "st1Result": null,
                        "st2Result": null,
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": null,
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "99",
                        "spRiskGb": "",
                        "spResultDt": "2022-06-13 16:00:00",
                        "spUnit": "%",
                        "patientId": "P999999999",
                        "patientNm": "TestPatient",
                        "admissionDate": "2022-06-01",
                        "qantnDiv": "1",
                        "qantnDay": 26,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "0000000023",
                        "sbpResult": null,
                        "dbpResult": null,
                        "sbpRiskGb": "",
                        "dbpRiskGb": "",
                        "bpResultDt": null,
                        "bpUnit": "mmHg",
                        "prResult": null,
                        "prRiskGb": "",
                        "prResultDt": null,
                        "prUnit": "BPM",
                        "btResult": null,
                        "btRiskGb": "",
                        "btResultDt": null,
                        "btUnit": "℃",
                        "st1Result": null,
                        "st2Result": null,
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": null,
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": null,
                        "spRiskGb": "",
                        "spResultDt": null,
                        "spUnit": "%",
                        "patientId": "P000000023",
                        "patientNm": "신규격리자5",
                        "admissionDate": "2022-06-14",
                        "qantnDiv": "1",
                        "qantnDay": 13,
                        "qantnStatus": "2"
                    },

                ]
            }
        })
    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/admission/info',
        {params: {admissionId: '9999999999'}})
        .reply(200, {
            "code": "00",
            "message": "조회 성공",
            "result": {
                "regId": null,
                "regNm": null,
                "regDt": null,
                "updId": null,
                "updNm": null,
                "updDt": null,
                "admissionId": "9999999999",
                "patientId": "P999999999",
                "patientNm": "TestPatient",
                "birthDate": "20220101",
                "sex": "M",
                "cellPhone": "01012345678",
                "personCharge": "나",
                "admissionDate": "20220601",
                "dschgeSchdldDate": "20220703",
                "dschgeDate": null,
                "centerId": "C001",
                "room": "01",
                "qantnDiv": "1",
                "delYn": "N"
            },
        })
    mockAxios.onPut(process.env.REACT_APP_BASE_URL + '/api/admission/quarantine/save', {
        "admissionListSearchByQuarantineVO": {
            "patientId": "",
            "patientNm": "",
            "currentPageNo": 1,
            "recordCountPerPage": 15,
            "pageSize": 10,
            "orderBy": "",
            "orderDir": ""
        },
        "patientNm": "에러커넥트",
        "birthDate": "20220101",
        "sex": "M",
        "cellPhone": "01012345678",
        "admissionDate": "20220202",
        "dschgeSchdldDate": "20220303",
        "personCharge": "에러커넥트담당자"
    })
        .reply(200,{code:'99',message:'삐빅 에러입니다.'})
    mockAxios.onPut(process.env.REACT_APP_BASE_URL + '/api/admission/quarantine/save', {
        "admissionListSearchByQuarantineVO": {
            "patientId": "",
            "patientNm": "",
            "currentPageNo": 1,
            "recordCountPerPage": 15,
            "pageSize": 10,
            "orderBy": "",
            "orderDir": ""
        },
        "patientNm": "헬스커넥트",
        "birthDate": "20220101",
        "sex": "M",
        "cellPhone": "01012345678",
        "admissionDate": "20220202",
        "dschgeSchdldDate": "20220303",
        "personCharge": "헬스커넥트담당자"
    })
        .reply(200, {
            'code':'00','message':'등록 완료',
            'result':{
                "admissionId": "0000000031",
                "admissionListResponseByQuarantineVO": {
                    "paginationInfoVO": {
                        "currentPageNo": 1,
                        "recordCountPerPage": 15,
                        "pageSize": 10,
                        "totalRecordCount": 13,
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
                        "orderDir": "",
                        "patientId": "",
                        "patientNm": "",
                        "lastPageNo": 1,
                        "firstPageNo": 1
                    },
                    "admissionByQuarantineVOList": [
                        {
                            "admissionId": "5555555555",
                            "sbpResult": "190",
                            "dbpResult": "40",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "L",
                            "bpResultDt": "2022-06-13 17:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "120",
                            "prRiskGb": "H",
                            "prResultDt": "2022-06-13 16:00:00",
                            "prUnit": "BPM",
                            "btResult": "34",
                            "btRiskGb": "L",
                            "btResultDt": "2022-06-13 16:00:00",
                            "btUnit": "℃",
                            "st1Result": null,
                            "st2Result": null,
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": null,
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "94",
                            "spRiskGb": "",
                            "spResultDt": "2022-06-13 16:00:00",
                            "spUnit": "%",
                            "patientId": "P555555555",
                            "patientNm": "헬스커넥트",
                            "admissionDate": "2022-06-01",
                            "qantnDiv": "1",
                            "qantnDay": 26,
                            "qantnStatus": "1"
                        },
                    ]
                }
            },
        })

    mockAxios.onPatch(process.env.REACT_APP_BASE_URL + '/api/admission/quarantine/save')
        .reply(200, {
            "code": "00",
            "message": "수정 완료",
            "result": {
                "admissionId": "0000000028",
                "admissionListResponseByQuarantineVO": {
                    "paginationInfoVO": {
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
                        "orderDir": "",
                        "patientId": "",
                        "patientNm": "777",
                        "firstPageNo": 1,
                        "lastPageNo": 1
                    },
                    "admissionByQuarantineVOList": [
                        {
                            "admissionId": "9999999999",
                            "sbpResult": null,
                            "dbpResult": null,
                            "sbpRiskGb": "",
                            "dbpRiskGb": "",
                            "bpResultDt": null,
                            "bpUnit": "mmHg",
                            "prResult": null,
                            "prRiskGb": "",
                            "prResultDt": null,
                            "prUnit": "BPM",
                            "btResult": null,
                            "btRiskGb": "",
                            "btResultDt": null,
                            "btUnit": "℃",
                            "st1Result": null,
                            "st2Result": null,
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": null,
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": null,
                            "spRiskGb": "",
                            "spResultDt": null,
                            "spUnit": "%",
                            "patientId": "P999999999",
                            "patientNm": "UpdatePatient",
                            "admissionDate": "2022-07-07",
                            "qantnDiv": "1",
                            "qantnDay": -9,
                            "qantnStatus": "1"
                        }
                    ]
                }
            }
        })

    mockAxios.onPatch(process.env.REACT_APP_BASE_URL + '/api/admission/quarantine/discharge')
        .reply(200, {
            "code": "00",
            "message": "퇴소 처리 완료",
            "result": {
                "paginationInfoVO": {
                    "currentPageNo": 1,
                    "recordCountPerPage": 15,
                    "pageSize": 10,
                    "totalRecordCount": 3,
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
                    "orderDir": "",
                    "patientId": "",
                    "patientNm": "",
                    "firstPageNo": 1,
                    "lastPageNo": 1
                },
                "admissionByQuarantineVOList": [
                    {
                        "admissionId": "9999999999",
                        "sbpResult": "190",
                        "dbpResult": "40",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "L",
                        "bpResultDt": "2022-06-13 17:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "120",
                        "prRiskGb": "H",
                        "prResultDt": "2022-06-13 16:00:00",
                        "prUnit": "BPM",
                        "btResult": "34",
                        "btRiskGb": "L",
                        "btResultDt": "2022-06-13 16:00:00",
                        "btUnit": "℃",
                        "st1Result": null,
                        "st2Result": null,
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": null,
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "94",
                        "spRiskGb": "",
                        "spResultDt": "2022-06-13 16:00:00",
                        "spUnit": "%",
                        "patientId": "P999999999",
                        "patientNm": "TestPatient",
                        "admissionDate": "2022-06-01",
                        "qantnDiv": "1",
                        "qantnDay": 26,
                        "qantnStatus": "2"
                    },
                    {
                        "admissionId": "0000000023",
                        "sbpResult": null,
                        "dbpResult": null,
                        "sbpRiskGb": "",
                        "dbpRiskGb": "",
                        "bpResultDt": null,
                        "bpUnit": "mmHg",
                        "prResult": null,
                        "prRiskGb": "",
                        "prResultDt": null,
                        "prUnit": "BPM",
                        "btResult": null,
                        "btRiskGb": "",
                        "btResultDt": null,
                        "btUnit": "℃",
                        "st1Result": null,
                        "st2Result": null,
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": null,
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": null,
                        "spRiskGb": "",
                        "spResultDt": null,
                        "spUnit": "%",
                        "patientId": "P000000023",
                        "patientNm": "신규격리자5",
                        "admissionDate": "2022-06-14",
                        "qantnDiv": "1",
                        "qantnDay": 13,
                        "qantnStatus": "2"
                    },

                ]
            }
        })
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe('Isolation Page', () => {
    // 자택격리자 현황 페이지 Mount 및 useEffect[] 테스트
    test('Mount Isolation Page And Effect is Succeed', async () => {
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020')
            expect(getByText('40')).toHaveStyle('color:#2094ff')
            expect(getByText('147')).toHaveStyle('color:#ff2020')
            expect(getByText('24')).toHaveStyle('color:#2094ff')
            // expect(getByText('99')).toHaveStyle('color:#111111')
        })

    })

    // 신규 자택격리자 생성
    test('Create Isolation is Succeed', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020')
            expect(getByText('40')).toHaveStyle('color:#2094ff')
        })

        const createIsolationButton = getByText('신규');
        fireEvent.click(createIsolationButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('자택격리자 등록');
        })
        const patientNm = getByRole('patientNm')
        const birthDate = getByRole('birthDate')
        const sexM = getByRole('sexM')
        const cellPhone = getByRole('cellPhone')
        const personCharge = getByRole('personCharge')
        const admissionDate = getByRole('admissionDate')
        const dschgeSchdldDate = getByRole('dschgeSchdldDate')

        userEvent.type(patientNm, '헬스커넥트');
        userEvent.type(birthDate, '2022-01-01');
        userEvent.click(sexM);
        userEvent.type(cellPhone, '01012345678');
        userEvent.type(personCharge, '헬스커넥트담당자');
        userEvent.type(admissionDate, '2022-02-02');
        userEvent.type(dschgeSchdldDate, '2022-03-03');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        await waitFor(() => {
            const confirm = getByText('헬스커넥트를 생성하시겠습니까?');
            expect(confirm).toBeInTheDocument();
        })
        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            const alert = getByText('등록 완료');
            expect(alert).toBeInTheDocument();
            expect(getByText('헬스커넥트')).toBeInTheDocument();
        })
    })

    // 신규 자택격리자 생성 오류
    test('Create Isolation is Error', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020')
            expect(getByText('40')).toHaveStyle('color:#2094ff')
        })

        const createIsolationButton = getByText('신규');
        fireEvent.click(createIsolationButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('자택격리자 등록');
        })
        const patientNm = getByRole('patientNm')
        const birthDate = getByRole('birthDate')
        const sexM = getByRole('sexM')
        const cellPhone = getByRole('cellPhone')
        const personCharge = getByRole('personCharge')
        const admissionDate = getByRole('admissionDate')
        const dschgeSchdldDate = getByRole('dschgeSchdldDate')

        userEvent.type(patientNm, '에러커넥트');
        userEvent.type(birthDate, '2022-01-01');
        userEvent.click(sexM);
        userEvent.type(cellPhone, '01012345678');
        userEvent.type(personCharge, '에러커넥트담당자');
        userEvent.type(admissionDate, '2022-02-02');
        userEvent.type(dschgeSchdldDate, '2022-03-03');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        await waitFor(() => {
            const confirm = getByText('에러커넥트를 생성하시겠습니까?');
            expect(confirm).toBeInTheDocument();
        })
        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            const alert = getByText('삐빅 에러입니다.');
            expect(alert).toBeInTheDocument();
        })
    })

    // 자택격리자를 선택하지 않고 수정버튼을 눌렀을시
    test('Get DetailData with dont selected Isolation', async () => {
        const { getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020')
            expect(getByText('40')).toHaveStyle('color:#2094ff')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const alert = getByText('자택격리자를 선택해주세요.');
            expect(alert).toBeInTheDocument();
        })

    })

    // 자택격리자 상세정보 요청 및 모달이 화면에 표시되는지
    test('Get DetailData for Isolation', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020')
            expect(getByText('40')).toHaveStyle('color:#2094ff')
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })
        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog');
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('9999999999');
            expect(getByRole('patientId')).toHaveValue('P999999999');
            expect(getByRole('sexM')).toBeChecked();
        })

    })

    // 자택격리자 상세정보 수정시 이름이 공백일때
    test('Update Isolation with Null patientNm', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020');
            expect(getByText('40')).toHaveStyle('color:#2094ff');
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })
        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog');
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('9999999999');
            expect(getByRole('patientId')).toHaveValue('P999999999');
            expect(getByRole('sexM')).toBeChecked();
        })

        const patientNm = getByRole('patientNm')
        patientNm.value = '';
        expect(patientNm).toHaveValue('');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        const alert = getByText('이름이 공백입니다.');
        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        })

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(patientNm).toHaveFocus();
        })
    })

    // 자택격리자 상세정보 수정시 생일이 공백일때
    test('Update Isolation with Null BirthDay', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020');
            expect(getByText('40')).toHaveStyle('color:#2094ff');
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })
        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('9999999999');
            expect(getByRole('patientId')).toHaveValue('P999999999');
        })

        const birthDate = getByRole('birthDate')
        birthDate.value = '';
        expect(birthDate).toHaveValue('');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        const alert = getByText('생일이 공백입니다.');
        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        })

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(birthDate).toHaveFocus();
        })
    })

    // 자택격리자 상세정보 수정시 연락처가 공백일때
    test('Update Isolation with Null Cellphone', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020');
            expect(getByText('40')).toHaveStyle('color:#2094ff');
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('9999999999');
            expect(getByRole('patientId')).toHaveValue('P999999999');
        })

        const cellPhone = getByRole('cellPhone')
        cellPhone.value = '';
        expect(cellPhone).toHaveValue('');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        const alert = getByText('연락처가 공백입니다.');
        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        })

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(cellPhone).toHaveFocus();
        })
    })

    // 자택격리자 상세정보 수정시 담당자가 공백일때
    test('Update Isolation with Null personCharge', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020');
            expect(getByText('40')).toHaveStyle('color:#2094ff');
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('9999999999');
            expect(getByRole('patientId')).toHaveValue('P999999999');
        })

        const personCharge = getByRole('personCharge')
        personCharge.value = '';
        expect(personCharge).toHaveValue('');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        const alert = getByText('담당자 공백입니다.');
        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        })

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(personCharge).toHaveFocus();
        })
    })

    // 자택격리자 상세정보 수정시 시작일이 공백일때
    test('Update Isolation with Null admissionDate', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020');
            expect(getByText('40')).toHaveStyle('color:#2094ff');
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('9999999999');
            expect(getByRole('patientId')).toHaveValue('P999999999');
        })

        const admissionDate = getByRole('admissionDate')
        admissionDate.value = '';
        expect(admissionDate).toHaveValue('');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        const alert = getByText('시작일이 공백입니다.');
        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        })

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(admissionDate).toHaveFocus();
        })
    })

    // 자택격리자 상세정보 수정시 종료일이 공백일때
    test('Update Isolation with Null dschgeSchdldDate', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020');
            expect(getByText('40')).toHaveStyle('color:#2094ff');
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('9999999999');
            expect(getByRole('patientId')).toHaveValue('P999999999');
        })

        const dschgeSchdldDate = getByRole('dschgeSchdldDate')
        dschgeSchdldDate.value = '';
        expect(dschgeSchdldDate).toHaveValue('');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        const alert = getByText('종료예정일이 공백입니다.');
        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        })

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(dschgeSchdldDate).toHaveFocus();
        })
    })

    // 자택격리자 상세정보 수정시 종료일이 시작일보다 이전일때
    test('Update Isolation with DschgeSchdldDate is before AdmissionDate', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020');
            expect(getByText('40')).toHaveStyle('color:#2094ff');
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('9999999999');
            expect(getByRole('patientId')).toHaveValue('P999999999');
        })
        const admissionDate = getByRole('admissionDate')
        admissionDate.value = '2022-01-02';
        expect(admissionDate).toHaveValue('2022-01-02');

        const dschgeSchdldDate = getByRole('dschgeSchdldDate')
        dschgeSchdldDate.value = '2022-01-01';
        expect(dschgeSchdldDate).toHaveValue('2022-01-01');

        const modalButton = getByText('등록');
        fireEvent.click(modalButton);

        const alert = getByText('종료 예정일은 시작일 이후이어야 합니다.');
        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        })

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(dschgeSchdldDate).toHaveFocus();
        })
    })

    // 자택격리자 상세정보 수정
    test('Update Isolation is Succeed', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020');
            expect(getByText('40')).toHaveStyle('color:#2094ff');
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('9999999999');
            expect(getByRole('patientId')).toHaveValue('P999999999');
        })
        const patientNm = getByRole('patientNm')
        patientNm.value = 'UpdatePatient';
        expect(patientNm).toHaveValue('UpdatePatient');


        const modalButton = getByText('등록');
        fireEvent.click(modalButton);


        await waitFor(() => {
            const confirm = getByText('UpdatePatient를 수정하시겠습니까?');
            expect(confirm).toBeInTheDocument();
        })

        const confirm = getByText('UpdatePatient를 수정하시겠습니까?');
        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);
        expect(confirm).not.toBeInTheDocument();

        await waitFor(() => {
            const alert = getByText('수정 완료')
            expect(alert).toBeInTheDocument();
            expect(testRow.closest('tr')).toHaveTextContent('UpdatePatient')
        })

    })

    // 자택격리자 격리해제시 격리해제일이 공백일때
    test('Isolation discharged with Null dischargeDate', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020')
            expect(getByText('40')).toHaveStyle('color:#2094ff')
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
            expect(testRow.closest('tr')).toHaveTextContent('격리중')
        })

        const dischargedButton = getByText('격리중');
        fireEvent.click(dischargedButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('자택격리자 퇴소');
            expect(modal).toHaveTextContent('격리해제');
        })
        const dischargeInput = getByRole('dischargeInput');
        dischargeInput.value = '';
        expect(dischargeInput).toHaveValue('');

        const modalDischargeButton = getByRole('modalDischargeButton')
        fireEvent.click(modalDischargeButton);

        await waitFor(() => {
            const alert = getByText('격리해제일이 공백입니다.');
            expect(alert).toBeInTheDocument();
        })

    })

    // 자택격리자 격리해제
    test('Isolation discharged is Succeed', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Isolation/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TestPatient")).toBeInTheDocument();
            expect(getByText('190')).toHaveStyle('color:#ff2020')
            expect(getByText('40')).toHaveStyle('color:#2094ff')
        })

        const testRow = getByText('TestPatient');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
            expect(testRow.closest('tr')).toHaveTextContent('격리중')
        })

        const dischargedButton = getByText('격리중');
        fireEvent.click(dischargedButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('자택격리자 퇴소');
            expect(modal).toHaveTextContent('격리해제');
        })

        const modalDischargeButton = getByRole('modalDischargeButton')
        fireEvent.click(modalDischargeButton);

        const confirm = getByText('TestPatient 을 퇴소처리 하시겠습니까?');
        expect(confirm).toBeInTheDocument();

        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            const alert = getByText('퇴소 처리 완료');
            expect(alert).toBeInTheDocument();
            expect(testRow.closest('tr')).toHaveTextContent('격리해제')
        })
    })
})