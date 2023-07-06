import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../../Utils/AuthorizationAxios";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import AlertStore from "../../Providers/AlertContext";
import TitleStore from "../../Providers/TitleContext";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HcAlert from "../../component/HCAlert";
import Layouts from "../../Layouts/Layouts";
import {renderHook} from "@testing-library/react-hooks";
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import AdmissionDetail from "./AdmissionDetail";
import React from "react";
import CenterAdmissionBoard from "./CenterAdmissionBoard";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/patientDashboard/status/list',{
        'qantnDiv':'2',
        'centerId':'C001'
    })
        .reply(200,{
            "code": "00",
            "message": "조회 성공",
            "result": {
                "header": {
                    "searchDateInfo": "6월 29일 09:24",
                    "dashboardTitle": "테스트 생활치료센터 현황판",
                    "totalCount": 205,
                    "todayAdmissionCount": 0,
                    "todayDischargeCount": 0
                },
                "patientList": [
                    {
                        "admissionId": "0000000001",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "01",
                        "roomNm": "1호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000001",
                        "patientNm": "Test입소자1"
                    },
                    {
                        "admissionId": "0000000002",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "02",
                        "roomNm": "2호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000002",
                        "patientNm": "Test입소자2"
                    },
                    {
                        "admissionId": "0000000003",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "03",
                        "roomNm": "3호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000003",
                        "patientNm": "Test입소자3"
                    },
                    {
                        "admissionId": "0000000004",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "04",
                        "roomNm": "4호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000004",
                        "patientNm": "Test입소자4"
                    },
                    {
                        "admissionId": "0000000005",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "05",
                        "roomNm": "5호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000005",
                        "patientNm": "Test입소자5"
                    },
                    {
                        "admissionId": "0000000006",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "06",
                        "roomNm": "6호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000006",
                        "patientNm": "Test입소자6"
                    },
                    {
                        "admissionId": "0000000007",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "07",
                        "roomNm": "7호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000007",
                        "patientNm": "Test입소자7"
                    },
                    {
                        "admissionId": "0000000008",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "08",
                        "roomNm": "8호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000008",
                        "patientNm": "Test입소자8"
                    },
                    {
                        "admissionId": "0000000009",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "09",
                        "roomNm": "9호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000009",
                        "patientNm": "Test입소자9"
                    },
                    {
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "10",
                        "roomNm": "10호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000010",
                        "patientNm": "Test입소자10"
                    },
                    {
                        "admissionId": "0000000011",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": "11",
                        "roomNm": "11호실",
                        "age": 0,
                        "sex": "F",
                        "sexNm": "여",
                        "patientId": "P000000011",
                        "patientNm": "Test입소자11"
                    },
                ]
            }
        })

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

    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/patientDashboard/detail')
        .reply(200,{
            code:'00',message:'조회 완료',
            result:{
                admissionId:'',
                headerVO:{},
                noticeVOList:[]
            }
        })
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe('CenterAdmissionBoard',()=>{

    // 생활치료센터 대시보드 페이지 Mount 및 useEffect[] 테스트
    test('Mount CenterAdmissionBoard And Effect is Succeed',async ()=>{
        renderHook(() => UseSetPageTitle())
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <CenterAdmissionBoard/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(()=>{
            expect(screen.getByText('테스트 생활치료센터 현황판')).toBeInTheDocument();
            expect(getByText('Test입소자1')).toBeInTheDocument();
        })
    })

    // 생활치료센터 입소자 카드 호실별로 색상이 다른지
    test('CenterAdmission Card is Different color for Room',async ()=>{
        renderHook(() => UseSetPageTitle())
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <CenterAdmissionBoard/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(()=>{
            expect(screen.getByText('테스트 생활치료센터 현황판')).toBeInTheDocument();
            expect(getByText('Test입소자1')).toBeInTheDocument();
            expect(getByText('1호실')).toBeInTheDocument()
        })
        const palette = ['#228be6', '#90d094', '#f1b244', '#e85564', '#735fc9', '#ad7922', '#ffcf00', '#2822ad', '#ad2222', '#f06595'];
        const centerRoom1 = getByText('1호실');
        const centerRoom2 = getByText('2호실');
        const centerRoom3 = getByText('3호실');
        const centerRoom4 = getByText('4호실');
        const centerRoom5 = getByText('5호실');
        const centerRoom6 = getByText('6호실');
        const centerRoom7 = getByText('7호실');
        const centerRoom8 = getByText('8호실');
        const centerRoom9 = getByText('9호실');
        const centerRoom10 = getByText('10호실');
        const centerRoom11 = getByText('11호실');

        expect(centerRoom1.closest('div')).toHaveStyle('background:'+palette[0])
        expect(centerRoom2.closest('div')).toHaveStyle('background:'+palette[1])
        expect(centerRoom3.closest('div')).toHaveStyle('background:'+palette[2])
        expect(centerRoom4.closest('div')).toHaveStyle('background:'+palette[3])
        expect(centerRoom5.closest('div')).toHaveStyle('background:'+palette[4])
        expect(centerRoom6.closest('div')).toHaveStyle('background:'+palette[5])
        expect(centerRoom7.closest('div')).toHaveStyle('background:'+palette[6])
        expect(centerRoom8.closest('div')).toHaveStyle('background:'+palette[7])
        expect(centerRoom9.closest('div')).toHaveStyle('background:'+palette[8])
        expect(centerRoom10.closest('div')).toHaveStyle('background:'+palette[9])
        expect(centerRoom11.closest('div')).toHaveStyle('background:'+palette[0])

    })

    // 생활치료센터 입소자 카드 클릭시 환자상세 페이지로 이동하는지
    test('Click CenterAdmissionBoard Card then Move the page',async ()=>{
        renderHook(() => UseSetPageTitle())
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <CenterAdmissionBoard/>
                        <Routes>
                            <Route exact path={'/'} element={null}/>
                            <Route exact path={'/admission/detail'} element={<AdmissionDetail/>}/>
                        </Routes>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(()=>{
            expect(screen.getByText('테스트 생활치료센터 현황판')).toBeInTheDocument();
            expect(getByText('Test입소자1')).toBeInTheDocument();
        })
        const quarantine = getByText('Test입소자1');
        fireEvent.click(quarantine);

        await waitFor(()=>{
            expect(screen.getByText('환자상세')).toBeInTheDocument();
        })
    })
})