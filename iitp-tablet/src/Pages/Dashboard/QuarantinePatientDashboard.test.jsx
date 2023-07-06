import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../../Utils/AuthorizationAxios";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import AlertStore from "../../Providers/AlertContext";
import TitleStore from "../../Providers/TitleContext";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HcAlert from "../../component/HCAlert";
import QuarantinePatientDashboard from "./QuarantinePatientDashboard";
import Layouts from "../../Layouts/Layouts";
import {renderHook} from "@testing-library/react-hooks";
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import AdmissionDetail from "./AdmissionDetail";
import React from "react";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/patientDashboard/status/list',{
        'qantnDiv':'1',
        'centerId':''
    })
        .reply(200,{
            "code": "00",
            "message": "조회 성공",
            "result": {
                "header": {
                    "searchDateInfo": "6월 28일 20:15",
                    "dashboardTitle": "자택격리자 현황판",
                    "totalCount": 6,
                    "todayAdmissionCount": 0,
                    "todayDischargeCount": 1
                },
                "patientList": [
                    {
                        "admissionId": "0000000025",
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
                        "healthSignalVO": {
                            "signal1Yn": "Y",
                            "signal2Yn": "N"
                        },
                        "room": null,
                        "roomNm": null,
                        "age": 0,
                        "sex": "M",
                        "sexNm": "남",
                        "patientId": "P000000025",
                        "patientNm": "123"
                    },
                    {
                        "admissionId": "0000000027",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": null,
                        "roomNm": null,
                        "age": 0,
                        "sex": "M",
                        "sexNm": "남",
                        "patientId": "P000000027",
                        "patientNm": "2213123123123"
                    },
                    {
                        "admissionId": "0000000028",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": null,
                        "roomNm": null,
                        "age": 0,
                        "sex": "M",
                        "sexNm": "남",
                        "patientId": "P000000028",
                        "patientNm": "77712"
                    },
                    {
                        "admissionId": "0000000029",
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
                        "healthSignalVO": {
                            "signal1Yn": "Y",
                            "signal2Yn": "N"
                        },
                        "room": null,
                        "roomNm": null,
                        "age": 0,
                        "sex": "M",
                        "sexNm": "남",
                        "patientId": "P000000029",
                        "patientNm": "asdasdasda"
                    },
                    {
                        "admissionId": "0000000011",
                        "sbpResult": "130",
                        "dbpResult": "69",
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
                        "healthSignalVO": {
                            "signal1Yn": "Y",
                            "signal2Yn": "N"
                        },
                        "room": "01",
                        "roomNm": "1호실",
                        "age": 0,
                        "sex": "M",
                        "sexNm": "남",
                        "patientId": "P000000011",
                        "patientNm": "우02"
                    },
                    {
                        "admissionId": "0000000001",
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
                        "healthSignalVO": {
                            "signal1Yn": "N",
                            "signal2Yn": "Y"
                        },
                        "room": null,
                        "roomNm": null,
                        "age": 21,
                        "sex": "M",
                        "sexNm": "남",
                        "patientId": "P000000001",
                        "patientNm": "유라클"
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


describe('QuarantinePatientDashboard',()=>{

    // 자택격리자 대시보드 페이지 Mount 및 useEffect[] 테스트
    test('Mount QuarantinePatientDashboard And Effect is Succeed',async ()=>{
        renderHook(() => UseSetPageTitle())
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <QuarantinePatientDashboard/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(()=>{
            expect(screen.getByText('자택격리자 현황판')).toBeInTheDocument();
            expect(getByText('우02')).toBeInTheDocument();
        })
    })

    // 자택격리자 카드 클릭시 환자상세 페이지로 이동하는지
    test('Click QuarantinePatient Card then Move the page',async ()=>{
        renderHook(() => UseSetPageTitle())
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Layouts interval={0} setHide={()=> null}/>
                        <QuarantinePatientDashboard/>
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
            expect(screen.getByText('자택격리자 현황판')).toBeInTheDocument();
            expect(getByText('우02')).toBeInTheDocument();
        })
        const quarantine = getByText('우02');
        fireEvent.click(quarantine);

        await waitFor(()=>{
            expect(screen.getByText('환자상세')).toBeInTheDocument();
        })
    })
})