import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../../Utils/AuthorizationAxios";
import {renderHook} from "@testing-library/react-hooks";
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import {fireEvent, getByRole, render, screen, waitFor} from "@testing-library/react";
import AlertStore from "../../Providers/AlertContext";
import TitleStore from "../../Providers/TitleContext";
import {BrowserRouter} from "react-router-dom";
import Layouts from "../../Layouts/Layouts";
import HcAlert from "../../component/HCAlert";
import React from "react";
import AdmissionDetail from "./AdmissionDetail";
import userEvent from "@testing-library/user-event";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})

    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/patientDashboard/detail',
        {params:{admissionId:'A999999999'}}
        )
        .reply(200,{
            "code": "00",
            "message": "조회 완료",
            "result": {
                "admissionId": "A999999999",
                "headerVO": {
                    "healthSignalVO": {
                        "signal1Yn": null,
                        "signal2Yn": null
                    },
                    "admissionId": "A999999999",
                    "patientId": "P999999999",
                    "patientNm": "CenterTester",
                    "age": 0,
                    "birthDate": "2022-06-01",
                    "sex": "F",
                    "sexNm": "여성",
                    "cellPhone": "00012345678",
                    "qantnDiv": "2",
                    "centerId": "C001",
                    "centerNm": "테스트 생활치료센터",
                    "room": "01",
                    "roomNm": "1호실",
                    "admissionDate": "2022-06-09",
                    "dschgeSchdldDate": "2022-06-17",
                    "dschgeDate": null,
                    "dschgeYn": "N",
                    "recentResultInfo": {
                        "admissionId": "0000000010",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2021-12-07 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2021-12-07 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2021-12-07 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2021-12-07 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2021-12-07 16:00:00",
                        "spUnit": "%",
                        "sleepResult": null,
                        "sleepDt": null,
                        "sleepUnit": "시간",
                        "respiratoryRiskResult": null,
                        "respiratoryRiskResultDt": null,
                        "respiratoryRiskUnit": null,
                        "mentalRiskResult": null,
                        "mentalRiskResultDt": null,
                        "mentalRiskUnit": null
                    },
                    "dispNameDetailInfo": "여성 만 0세",
                    "dispLocationInfo": "테스트 생활치료센터 1호실",
                    "dispDschgeInfo": "재원",
                    "dispAdmissionPeriodInfo": "2022-06-09 ~ 2022-06-17",
                    "dispBirthDateInfo": "2022-06-01 (0/F)",
                    "dispCellPhoneInfo": "000-1234-5678"
                },
                "noticeVOList": [
                    {
                        "regId": "admin",
                        "regNm": "관리자",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 4,
                        "admissionId": "A999999790",
                        "notice": "알림내역001",
                        "readYn": "N"
                    },
                    {
                        "regId": "admin",
                        "regNm": "관리자",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 5,
                        "admissionId": "A999999790",
                        "notice": "알림내역002",
                        "readYn": "N"
                    },
                    {
                        "regId": "admin",
                        "regNm": "관리자",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 6,
                        "admissionId": "A999999790",
                        "notice": "알림내역003",
                        "readYn": "N"
                    },
                    {
                        "regId": "admin",
                        "regNm": "관리자",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 7,
                        "admissionId": "A999999790",
                        "notice": "알림내역004",
                        "readYn": "N"
                    },
                    {
                        "regId": "admin",
                        "regNm": "관리자",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 8,
                        "admissionId": "A999999790",
                        "notice": "알림내역005",
                        "readYn": "N"
                    },
                    {
                        "regId": "admin",
                        "regNm": "관리자",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 9,
                        "admissionId": "A999999790",
                        "notice": "신규 알림 저장 API TEST 001",
                        "readYn": "N"
                    },
                    {
                        "regId": "admin",
                        "regNm": "관리자",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 10,
                        "admissionId": "A999999790",
                        "notice": "신규 알림 저장 API TEST 002",
                        "readYn": "N"
                    },
                    {
                        "regId": "admin",
                        "regNm": "관리자",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 11,
                        "admissionId": "A999999790",
                        "notice": "신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST 002신규 알림 저장 API TEST",
                        "readYn": "N"
                    },
                    {
                        "regId": "test",
                        "regNm": "테스터",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 12,
                        "admissionId": "A999999790",
                        "notice": "12312312312",
                        "readYn": "N"
                    },
                    {
                        "regId": "test",
                        "regNm": "테스터",
                        "regDt": "2022-06-23 00:00:00",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 13,
                        "admissionId": "A999999790",
                        "notice": "213123123123123",
                        "readYn": "N"
                    },
                    {
                        "regId": "test",
                        "regNm": "테스터",
                        "regDt": "2022-06-23 15:02:52",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 14,
                        "admissionId": "A999999790",
                        "notice": "asdfsdafsadfasdfd",
                        "readYn": "N"
                    },
                    {
                        "regId": "test",
                        "regNm": "테스터",
                        "regDt": "2022-06-27 17:56:04",
                        "updId": null,
                        "updNm": null,
                        "updDt": null,
                        "noticeSeq": 15,
                        "admissionId": "A999999790",
                        "notice": "fdgdgdfgfdgdfg",
                        "readYn": "N"
                    }
                ]
            }
        })

    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/patientDashboard/detail',
        {params:{admissionId:'A888888888'}}
    )
        .reply(200,{
            "code": "00",
            "message": "조회 완료",
            "result": {
                "admissionId": "A888888888",
                "headerVO": {
                    "healthSignalVO": {
                        "signal1Yn": null,
                        "signal2Yn": null
                    },
                    "admissionId": "A888888888",
                    "patientId": "P888888888",
                    "patientNm": "123",
                    "age": 0,
                    "birthDate": "2022-06-01",
                    "sex": "M",
                    "sexNm": "남성",
                    "cellPhone": "123",
                    "qantnDiv": "1",
                    "centerId": "",
                    "centerNm": "",
                    "room": "",
                    "roomNm": "",
                    "admissionDate": "2022-06-01",
                    "dschgeSchdldDate": "2022-06-30",
                    "dschgeDate": null,
                    "dschgeYn": "N",
                    "recentResultInfo": {
                        "admissionId": "A888888888",
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
                        "sleepResult": null,
                        "sleepDt": null,
                        "sleepUnit": "시간",
                        "respiratoryRiskResult": null,
                        "respiratoryRiskResultDt": null,
                        "respiratoryRiskUnit": null,
                        "mentalRiskResult": null,
                        "mentalRiskResultDt": null,
                        "mentalRiskUnit": null
                    },
                    "dispNameDetailInfo": "남성 만 0세",
                    "dispLocationInfo": "자택격리자",
                    "dispDschgeInfo": "격리",
                    "dispAdmissionPeriodInfo": "2022-06-01 ~ 2022-06-30",
                    "dispBirthDateInfo": "2022-06-01 (0/M)",
                    "dispCellPhoneInfo": "123"
                },
                "noticeVOList": []
            }
        })

    mockAxios.onPut(process.env.REACT_APP_BASE_URL + '/api/patientDashboard/detail/notice',{
        admissionId:'A999999999',
        notice:'TESTNOTICE'
    })
        .reply(200,{
            code:'00',message:'저장 성공',
            result:[{
                "regId": "test",
                "regNm": "테스터",
                "regDt": "2022-06-29 11:10:33",
                "updId": null,
                "updNm": null,
                "updDt": null,
                "noticeSeq": 16,
                "admissionId": "A999999999",
                "notice": "TESTNOTICE",
                "readYn": "N"
            }]
        })
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
    localStorage.removeItem('admissionId')
});


describe('AdmissionDetail Page',()=>{
    // 환자(센터 입소자)상세 페이지 Mount 및 useEffect[] 테스트
    test('Mount CenterAdmissionDetail Page And Effect is Succeed',async ()=> {
        localStorage.setItem('admissionId','A999999999')
        renderHook(() => UseSetPageTitle())
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <AdmissionDetail/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(()=>{
            expect(screen.getByText('환자상세')).toBeInTheDocument();
            expect(screen.getByText('퇴소 / 전원관리')).toBeInTheDocument();
            expect(screen.getByText('재원')).toBeInTheDocument();
            expect(getByText('CenterTester')).toBeInTheDocument();
            expect(getByText('125')).toHaveStyle('color: #ff2020');
            expect(getByText('80')).toHaveStyle('color: #2094ff');
            expect(getByRole('noticeList')).toHaveTextContent('알림내역001');
        })
    })

    // 환자(자택격리자)상세 페이지 Mount 및 useEffect[] 테스트
    test('Mount QuarantineAdmissionDetail Page And Effect is Succeed',async ()=> {
        localStorage.setItem('admissionId','A888888888')
        renderHook(() => UseSetPageTitle())
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <AdmissionDetail/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(()=>{
            expect(screen.getByText('환자상세')).toBeInTheDocument();
            expect(screen.getByText('격리해제')).toBeInTheDocument();
            expect(screen.getByText('격리')).toBeInTheDocument();
        })
    })


    // 알림내용이 500자를 초과했을때
    test('NoticeText MaxLength Checked',async ()=> {
        localStorage.setItem('admissionId','A999999999')
        renderHook(() => UseSetPageTitle())
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <AdmissionDetail/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(()=>{
            expect(screen.getByText('환자상세')).toBeInTheDocument();
            expect(getByText('CenterTester')).toBeInTheDocument();
            expect(getByText('125')).toHaveStyle('color: #ff2020');
            expect(getByText('80')).toHaveStyle('color: #2094ff');
            expect(getByRole('noticeList')).toHaveTextContent('알림내역001');
        })

        const noticeText = getByRole('noticeText');
        userEvent.type(noticeText, '1................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................500')
        expect(noticeText).toHaveDisplayValue('1................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................500');
        userEvent.type(noticeText,'0')
        expect(noticeText).toHaveDisplayValue('1................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................500');
    })
    // 신규 알림 생성시 알림내용이 공백일때
    test('Create Notice With Null NoticeText',async ()=> {
        localStorage.setItem('admissionId','A999999999')
        renderHook(() => UseSetPageTitle())
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <AdmissionDetail/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(()=>{
            expect(screen.getByText('환자상세')).toBeInTheDocument();
            expect(getByText('CenterTester')).toBeInTheDocument();
            expect(getByText('125')).toHaveStyle('color: #ff2020');
            expect(getByText('80')).toHaveStyle('color: #2094ff');
            expect(getByRole('noticeList')).toHaveTextContent('알림내역001');
        })

        const noticeText = getByRole('noticeText');
        expect(noticeText).toHaveDisplayValue('');

        const noticeButton = getByText('알림 전송');
        fireEvent.click(noticeButton);

        await waitFor(()=>expect(getByText('알림 내용이 공백입니다.')).toBeInTheDocument())
    })

    // 신규 알림 생성
    test('Create Notice',async ()=> {
        localStorage.setItem('admissionId','A999999999')
        renderHook(() => UseSetPageTitle())
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <AdmissionDetail/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(()=>{
            expect(screen.getByText('환자상세')).toBeInTheDocument();
            expect(getByText('CenterTester')).toBeInTheDocument();
            expect(getByText('125')).toHaveStyle('color: #ff2020');
            expect(getByText('80')).toHaveStyle('color: #2094ff');
            expect(getByRole('noticeList')).toHaveTextContent('알림내역001');
        })

        const noticeText = getByRole('noticeText');
        userEvent.type(noticeText,'TESTNOTICE')
        expect(noticeText).toHaveDisplayValue('TESTNOTICE');

        const noticeButton = getByText('알림 전송');
        fireEvent.click(noticeButton);

        await waitFor(()=>expect(getByText('알림을 생성하시겠습니까?')).toBeInTheDocument())

        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);

        await waitFor(()=> {
            expect(getByText('저장 성공')).toBeInTheDocument();
            expect(getByRole('noticeList')).toHaveTextContent('TESTNOTICE');
        })
    })
})

//noticeText