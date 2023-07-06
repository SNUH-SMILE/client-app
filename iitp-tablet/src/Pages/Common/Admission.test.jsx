import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../../Utils/AuthorizationAxios";
import {fireEvent, render, waitFor} from "@testing-library/react";
import AlertStore from "../../Providers/AlertContext";
import TitleStore from "../../Providers/TitleContext";
import {BrowserRouter} from "react-router-dom";
import HcAlert from "../../component/HCAlert";
import React from "react";
import Admission from "./Admission";
import userEvent from "@testing-library/user-event";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})

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

    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/comCd/detail/list', {comCd: 'CD005', useYn: 'Y'})
        .reply(200, {
            "code": "00",
            "message": null,
            "result": [
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "01",
                    "detailCdNm": "1호실",
                    "sortSeq": 0,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "02",
                    "detailCdNm": "2호실",
                    "sortSeq": 1,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "03",
                    "detailCdNm": "3호실",
                    "sortSeq": 2,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "04",
                    "detailCdNm": "4호실",
                    "sortSeq": 3,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "05",
                    "detailCdNm": "5호실",
                    "sortSeq": 4,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "06",
                    "detailCdNm": "6호실",
                    "sortSeq": 5,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "07",
                    "detailCdNm": "7호실",
                    "sortSeq": 6,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "08",
                    "detailCdNm": "8호실",
                    "sortSeq": 7,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "09",
                    "detailCdNm": "9호실",
                    "sortSeq": 8,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "10",
                    "detailCdNm": "10호실",
                    "sortSeq": 9,
                    "useYn": "Y",
                    "property1": "C001",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:21:17",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:21:17",
                    "cudFlag": null,
                    "comCd": "CD005",
                    "detailCd": "11",
                    "detailCdNm": "11호실",
                    "sortSeq": 9,
                    "useYn": "Y",
                    "property1": "C002",
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                }
            ]
        })

    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/admission/center/list', {
        "centerId": "C001",
        "patientId": "",
        "patientNm": "",
        "currentPageNo": 1,
        "recordCountPerPage": 15,
        "pageSize": 10,
        "orderBy": "",
        "orderDir": ""
    })
        .reply(200, {
            "code": "00",
            "message": "조회 성공",
            "result": {
                "paginationInfoVO": {
                    "currentPageNo": 1,
                    "recordCountPerPage": 15,
                    "pageSize": 10,
                    "totalRecordCount": 210,
                    "totalPageCount": 14,
                    "firstPageNoOnPageList": 1,
                    "lastPageNoOnPageList": 10,
                    "offsetCount": 0,
                    "prevPageExists": false,
                    "prevPaginationExists": false,
                    "nextPageExists": true,
                    "nextPaginationExists": true,
                    "prevPageNo": -1,
                    "nextPageNo": 2,
                    "orderBy": "",
                    "orderDir": "",
                    "centerId": "C001",
                    "patientId": "",
                    "patientNm": "",
                    "firstPageNo": 1,
                    "lastPageNo": 14
                },
                "admissionByCenterVOList": [
                    {
                        "admissionId": "A999999999",
                        "sbpResult": "5000",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "19",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "TESTERId",
                        "patientNm": "TESTERNm",
                        "admissionDate": "2022-06-20",
                        "room": "04",
                        "roomNm": "4호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999729",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST081",
                        "patientNm": "추가61",
                        "admissionDate": "2022-06-20",
                        "room": "01",
                        "roomNm": "1호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999728",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST082",
                        "patientNm": "추가62",
                        "admissionDate": "2022-06-20",
                        "room": "02",
                        "roomNm": "2호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999727",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST083",
                        "patientNm": "추가63",
                        "admissionDate": "2022-06-20",
                        "room": "09",
                        "roomNm": "9호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999726",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST084",
                        "patientNm": "추가64",
                        "admissionDate": "2022-06-20",
                        "room": "08",
                        "roomNm": "8호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999725",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST085",
                        "patientNm": "추가65",
                        "admissionDate": "2022-06-20",
                        "room": "07",
                        "roomNm": "7호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999724",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST086",
                        "patientNm": "추가66",
                        "admissionDate": "2022-06-20",
                        "room": "06",
                        "roomNm": "6호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999723",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST087",
                        "patientNm": "추가67",
                        "admissionDate": "2022-06-20",
                        "room": "05",
                        "roomNm": "5호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999722",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST088",
                        "patientNm": "추가68",
                        "admissionDate": "2022-06-20",
                        "room": "04",
                        "roomNm": "4호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999721",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST089",
                        "patientNm": "추가69",
                        "admissionDate": "2022-06-20",
                        "room": "03",
                        "roomNm": "3호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999730",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST080",
                        "patientNm": "추가60",
                        "admissionDate": "2022-06-20",
                        "room": "02",
                        "roomNm": "2호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999731",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST079",
                        "patientNm": "추가59",
                        "admissionDate": "2022-06-20",
                        "room": "03",
                        "roomNm": "3호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999732",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST078",
                        "patientNm": "추가58",
                        "admissionDate": "2022-06-20",
                        "room": "04",
                        "roomNm": "4호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999741",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST069",
                        "patientNm": "추가49",
                        "admissionDate": "2022-06-20",
                        "room": "03",
                        "roomNm": "3호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    },
                    {
                        "admissionId": "A999999740",
                        "sbpResult": "125",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "80",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "SHYTEST070",
                        "patientNm": "추가50",
                        "admissionDate": "2022-06-20",
                        "room": "02",
                        "roomNm": "2호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
                        "qantnStatus": "1"
                    }
                ]
            }
        })


    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/admission/center/list', {
        "centerId": "C001",
        "patientId": "",
        "patientNm": "",
        "currentPageNo": 11,
        "recordCountPerPage": 15,
        "pageSize": 10,
        "orderBy": "",
        "orderDir": ""
    })
        .reply(200, {
            "code": "00",
            "message": "조회 성공",
            "result": {
                "paginationInfoVO": {
                    "currentPageNo": 11,
                    "recordCountPerPage": 15,
                    "pageSize": 10,
                    "totalRecordCount": 214,
                    "totalPageCount": 15,
                    "firstPageNoOnPageList": 11,
                    "lastPageNoOnPageList": 15,
                    "offsetCount": 150,
                    "prevPageExists": true,
                    "prevPaginationExists": true,
                    "nextPageExists": true,
                    "nextPaginationExists": false,
                    "prevPageNo": 10,
                    "nextPageNo": 12,
                    "orderBy": "",
                    "orderDir": "",
                    "centerId": "C001",
                    "patientId": "",
                    "patientNm": "",
                    "firstPageNo": 1,
                    "lastPageNo": 15
                },
                "admissionByCenterVOList": []
            }
        })

    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/admission/info', {params: {admissionId: 'A999999999'}})
        .reply(200, {
            "code": "00",
            "message": "입소내역 조회 성공",
            "result": {
                "regId": null,
                "regNm": null,
                "regDt": null,
                "updId": null,
                "updNm": null,
                "updDt": null,
                "admissionId": "A999999999",
                "patientId": "TESTERId",
                "patientNm": "TESTERNm",
                "birthDate": "19890205",
                "sex": "M",
                "cellPhone": "01099880062",
                "personCharge": "홍길동",
                "admissionDate": "20220620",
                "dschgeSchdldDate": "20220704",
                "dschgeDate": null,
                "centerId": "C001",
                "room": "02",
                "qantnDiv": "2",
                "delYn": "N"
            }
        })

    mockAxios.onPatch(process.env.REACT_APP_BASE_URL + '/api/admission/center/save')
        .reply(200, {
            "code": "00",
            "message": "수정 완료",
            "result": {
                "admissionId": "A999999742",
                "admissionListResponseByCenterVO": {
                    "paginationInfoVO": {
                        "currentPageNo": 1,
                        "recordCountPerPage": 15,
                        "pageSize": 10,
                        "totalRecordCount": 210,
                        "totalPageCount": 14,
                        "firstPageNoOnPageList": 1,
                        "lastPageNoOnPageList": 10,
                        "offsetCount": 0,
                        "prevPageExists": false,
                        "prevPaginationExists": false,
                        "nextPageExists": true,
                        "nextPaginationExists": true,
                        "prevPageNo": -1,
                        "nextPageNo": 2,
                        "orderBy": "",
                        "orderDir": "",
                        "centerId": "C001",
                        "patientId": "",
                        "patientNm": "",
                        "firstPageNo": 1,
                        "lastPageNo": 14
                    },
                    "admissionByCenterVOList": [
                        {
                            "admissionId": "A999999999",
                            "sbpResult": "5000",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "19",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "TESTERId",
                            "patientNm": "UpdatePatient",
                            "admissionDate": "2022-06-20",
                            "room": "04",
                            "roomNm": "4호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999729",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST081",
                            "patientNm": "추가61",
                            "admissionDate": "2022-06-20",
                            "room": "01",
                            "roomNm": "1호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999728",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST082",
                            "patientNm": "추가62",
                            "admissionDate": "2022-06-20",
                            "room": "02",
                            "roomNm": "2호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999727",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST083",
                            "patientNm": "추가63",
                            "admissionDate": "2022-06-20",
                            "room": "09",
                            "roomNm": "9호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999726",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST084",
                            "patientNm": "추가64",
                            "admissionDate": "2022-06-20",
                            "room": "08",
                            "roomNm": "8호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999725",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST085",
                            "patientNm": "추가65",
                            "admissionDate": "2022-06-20",
                            "room": "07",
                            "roomNm": "7호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999724",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST086",
                            "patientNm": "추가66",
                            "admissionDate": "2022-06-20",
                            "room": "06",
                            "roomNm": "6호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999723",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST087",
                            "patientNm": "추가67",
                            "admissionDate": "2022-06-20",
                            "room": "05",
                            "roomNm": "5호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999722",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST088",
                            "patientNm": "추가68",
                            "admissionDate": "2022-06-20",
                            "room": "04",
                            "roomNm": "4호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999721",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST089",
                            "patientNm": "추가69",
                            "admissionDate": "2022-06-20",
                            "room": "03",
                            "roomNm": "3호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999730",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST080",
                            "patientNm": "추가60",
                            "admissionDate": "2022-06-20",
                            "room": "02",
                            "roomNm": "2호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999731",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST079",
                            "patientNm": "추가59",
                            "admissionDate": "2022-06-20",
                            "room": "03",
                            "roomNm": "3호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999732",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST078",
                            "patientNm": "추가58",
                            "admissionDate": "2022-06-20",
                            "room": "04",
                            "roomNm": "4호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999741",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST069",
                            "patientNm": "추가49",
                            "admissionDate": "2022-06-20",
                            "room": "03",
                            "roomNm": "3호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999740",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST070",
                            "patientNm": "추가50",
                            "admissionDate": "2022-06-20",
                            "room": "02",
                            "roomNm": "2호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        }
                    ]
                }
            }
        })

    mockAxios.onPut(process.env.REACT_APP_BASE_URL + '/api/admission/center/save', {
        "admissionListSearchByCenterVO": {
            "centerId": "C001",
            "patientId": "",
            "patientNm": "",
            "currentPageNo": 1,
            "recordCountPerPage": 15,
            "pageSize": 10,
            "orderBy": "",
            "orderDir": ""
        },
        "patientNm": "헬스커넥트",
        "birthDate": "20220106",
        "sex": "M",
        "cellPhone": "01012345678",
        "admissionDate": "20220202",
        "dschgeSchdldDate": "20220303",
        "personCharge": "헬스커넥트담당자",
        "centerId": "C001",
        "room": "01"
    })
        .reply(200, {
            "code": "00",
            "message": "등록 완료",
            "result": {
                "admissionId": "0000000035",
                "admissionListResponseByCenterVO": {
                    "paginationInfoVO": {
                        "currentPageNo": 1,
                        "recordCountPerPage": 15,
                        "pageSize": 10,
                        "totalRecordCount": 214,
                        "totalPageCount": 15,
                        "firstPageNoOnPageList": 1,
                        "lastPageNoOnPageList": 10,
                        "offsetCount": 0,
                        "prevPageExists": false,
                        "prevPaginationExists": false,
                        "nextPageExists": true,
                        "nextPaginationExists": true,
                        "prevPageNo": -1,
                        "nextPageNo": 2,
                        "orderBy": "",
                        "orderDir": "",
                        "centerId": "C001",
                        "patientId": "",
                        "patientNm": "",
                        "firstPageNo": 1,
                        "lastPageNo": 15
                    },
                    "admissionByCenterVOList": [
                        {
                            "admissionId": "A999999741",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "TEST0001",
                            "patientNm": "헬스커넥트",
                            "birthDate": "20220106",
                            "sex": "M",
                            "cellPhone": "01012345678",
                            "admissionDate": "20220202",
                            "dschgeSchdldDate": "20220303",
                            "personCharge": "헬스커넥트담당자",
                            "centerId": "C001",
                            "room": "01",
                            "roomNm": "1호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999728",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST082",
                            "patientNm": "추가62",
                            "admissionDate": "2022-06-20",
                            "room": "02",
                            "roomNm": "2호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999727",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST083",
                            "patientNm": "추가63",
                            "admissionDate": "2022-06-20",
                            "room": "09",
                            "roomNm": "9호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999726",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST084",
                            "patientNm": "추가64",
                            "admissionDate": "2022-06-20",
                            "room": "08",
                            "roomNm": "8호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999725",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST085",
                            "patientNm": "추가65",
                            "admissionDate": "2022-06-20",
                            "room": "07",
                            "roomNm": "7호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999724",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST086",
                            "patientNm": "추가66",
                            "admissionDate": "2022-06-20",
                            "room": "06",
                            "roomNm": "6호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999723",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST087",
                            "patientNm": "추가67",
                            "admissionDate": "2022-06-20",
                            "room": "05",
                            "roomNm": "5호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999722",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST088",
                            "patientNm": "추가68",
                            "admissionDate": "2022-06-20",
                            "room": "04",
                            "roomNm": "4호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999721",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST089",
                            "patientNm": "추가69",
                            "admissionDate": "2022-06-20",
                            "room": "03",
                            "roomNm": "3호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999720",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST090",
                            "patientNm": "추가70",
                            "admissionDate": "2022-06-20",
                            "room": "02",
                            "roomNm": "2호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999729",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST081",
                            "patientNm": "추가61",
                            "admissionDate": "2022-06-20",
                            "room": "01",
                            "roomNm": "1호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999730",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST080",
                            "patientNm": "추가60",
                            "admissionDate": "2022-06-20",
                            "room": "02",
                            "roomNm": "2호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999731",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST079",
                            "patientNm": "추가59",
                            "admissionDate": "2022-06-20",
                            "room": "03",
                            "roomNm": "3호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999740",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST070",
                            "patientNm": "추가50",
                            "admissionDate": "2022-06-20",
                            "room": "02",
                            "roomNm": "2호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        },
                        {
                            "admissionId": "A999999739",
                            "sbpResult": "125",
                            "dbpResult": "90",
                            "sbpRiskGb": "H",
                            "dbpRiskGb": "",
                            "bpResultDt": "2022-06-20 16:00:00",
                            "bpUnit": "mmHg",
                            "prResult": "81",
                            "prRiskGb": "",
                            "prResultDt": "2022-06-20 15:00:00",
                            "prUnit": "BPM",
                            "btResult": "37",
                            "btRiskGb": "",
                            "btResultDt": "2022-06-20 18:00:00",
                            "btUnit": "℃",
                            "st1Result": "190",
                            "st2Result": "20",
                            "st1RiskGb": "",
                            "st2RiskGb": "",
                            "stResultDt": "2022-06-20 14:00:00",
                            "stUnit": "Step",
                            "rrResult": "",
                            "rrRiskGb": "",
                            "rrResultDt": null,
                            "rrUnit": "",
                            "spResult": "80",
                            "spRiskGb": "L",
                            "spResultDt": "2022-06-20 16:00:00",
                            "spUnit": "%",
                            "centerId": "C001",
                            "centerNm": "테스트 생활치료센터",
                            "patientId": "SHYTEST071",
                            "patientNm": "추가51",
                            "admissionDate": "2022-06-20",
                            "room": "01",
                            "roomNm": "1호실",
                            "qantnDiv": "2",
                            "qantnDay": 8,
                            "qantnStatus": "1"
                        }
                    ]
                }
            }
        })

    mockAxios.onPatch(process.env.REACT_APP_BASE_URL + '/api/admission/center/discharge')
        .reply(200,{
            "code": "00",
            "message": "퇴소 처리 완료",
            "result": {
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
                    "nextPageNo": 2,
                    "orderBy": "",
                    "orderDir": "",
                    "centerId": "C001",
                    "patientId": "",
                    "patientNm": "",
                    "firstPageNo": 1,
                    "lastPageNo": 1
                },
                "admissionByCenterVOList": [
                    {
                        "admissionId": "A999999999",
                        "sbpResult": "5000",
                        "dbpResult": "90",
                        "sbpRiskGb": "H",
                        "dbpRiskGb": "",
                        "bpResultDt": "2022-06-20 16:00:00",
                        "bpUnit": "mmHg",
                        "prResult": "81",
                        "prRiskGb": "",
                        "prResultDt": "2022-06-20 15:00:00",
                        "prUnit": "BPM",
                        "btResult": "37",
                        "btRiskGb": "",
                        "btResultDt": "2022-06-20 18:00:00",
                        "btUnit": "℃",
                        "st1Result": "190",
                        "st2Result": "20",
                        "st1RiskGb": "",
                        "st2RiskGb": "",
                        "stResultDt": "2022-06-20 14:00:00",
                        "stUnit": "Step",
                        "rrResult": "",
                        "rrRiskGb": "",
                        "rrResultDt": null,
                        "rrUnit": "",
                        "spResult": "19",
                        "spRiskGb": "L",
                        "spResultDt": "2022-06-20 16:00:00",
                        "spUnit": "%",
                        "centerId": "C001",
                        "centerNm": "테스트 생활치료센터",
                        "patientId": "TESTERId",
                        "patientNm": "TESTERNm",
                        "admissionDate": "2022-06-20",
                        "room": "04",
                        "roomNm": "4호실",
                        "qantnDiv": "2",
                        "qantnDay": 8,
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


describe('Admission Page', () => {

    // 입소자 현황 페이지 Mount 및 useEffect[] 테스트
    test('Mount Admission Page And Effect is Succeed', async () => {
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })

    })

    // 입소자 상세정보 요청 및 모달이 화면에 표시되는지
    test('Get Detail Data Admission', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })
        const testRow = getByText('TESTERNm');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('A999999999');
            expect(getByRole('patientId')).toHaveValue('TESTERId');
        })

    })

    // 신규 입소자 생성
    test('Create Admission is Succeed', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })

        const createAdmissionButton = getByText('신규');
        fireEvent.click(createAdmissionButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('생활치료센터 입소자 수정');
        })
        const patientNm = getByRole('patientNm')
        const birthDate = getByRole('birthDate')
        const sexM = getByRole('sexM')
        const cellPhone = getByRole('cellPhone')
        const personCharge = getByRole('personCharge')
        const admissionDate = getByRole('admissionDate')
        const dschgeSchdldDate = getByRole('dschgeSchdldDate')
        const centerId = getByRole('centerId')
        const room = getByRole('room')

        userEvent.type(patientNm, '헬스커넥트');
        userEvent.type(birthDate, '2022-01-06');
        userEvent.click(sexM);
        userEvent.type(cellPhone, '01012345678');
        userEvent.type(personCharge, '헬스커넥트담당자');
        userEvent.type(admissionDate, '2022-02-02');
        userEvent.type(dschgeSchdldDate, '2022-03-03');
        userEvent.selectOptions(centerId,'C001');
        userEvent.selectOptions(room,'01');

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

    // 입소자를 선택하지 않고 수정버튼을 눌렀을시
    test('Get DetailData with dont selected Admission', async () => {
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const alert = getByText('입소자를 선택해주세요');
            expect(alert).toBeInTheDocument();
        })

    })

    // 입소자 상세정보 수정시 이름이 공백일때
    test('Update Admission with Null patientNm', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })
        const testRow = getByText('TESTERNm');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('A999999999');
            expect(getByRole('patientId')).toHaveValue('TESTERId');
        })

        const patientNm = getByRole('patientNm')
        userEvent.clear(patientNm);
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

    // 입소자 상세정보 수정시 생일이 공백일때
    test('Update Admission with Null BirthDay', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })
        const testRow = getByText('TESTERNm');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('A999999999');
            expect(getByRole('patientId')).toHaveValue('TESTERId');
        })

        const birthDate = getByRole('birthDate')
        userEvent.clear(birthDate);
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

    // 입소자 상세정보 수정시 연락처가 공백일때
    test('Update Admission with Null Cellphone', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })
        const testRow = getByText('TESTERNm');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('A999999999');
            expect(getByRole('patientId')).toHaveValue('TESTERId');
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

    // 입소자 상세정보 수정시 담당자가 공백일때
    test('Update Admission with Null personCharge', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })
        const testRow = getByText('TESTERNm');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('A999999999');
            expect(getByRole('patientId')).toHaveValue('TESTERId');
        })


        const personCharge = getByRole('personCharge')
        userEvent.clear(personCharge);
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

    // 입소자 상세정보 수정시 시작일이 공백일때
    test('Update Admission with Null admissionDate', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })
        const testRow = getByText('TESTERNm');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('A999999999');
            expect(getByRole('patientId')).toHaveValue('TESTERId');
        })

        const admissionDate = getByRole('admissionDate')
        userEvent.clear(admissionDate);
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

    // 입소자 상세정보 수정시 종료일이 공백일때
    test('Update Admission with Null dschgeSchdldDate', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })
        const testRow = getByText('TESTERNm');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('A999999999');
            expect(getByRole('patientId')).toHaveValue('TESTERId');
        })

        const dschgeSchdldDate = getByRole('dschgeSchdldDate')
        userEvent.clear(dschgeSchdldDate);
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

    // 입소자 상세정보 수정시 종료일이 시작일보다 이전일때
    test('Update Admission with DschgeSchdldDate is before AdmissionDate', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })
        const testRow = getByText('TESTERNm');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('A999999999');
            expect(getByRole('patientId')).toHaveValue('TESTERId');
        })

        const admissionDate = getByRole('admissionDate')
        userEvent.clear(admissionDate);
        userEvent.type(admissionDate, '2022-01-02');
        expect(admissionDate).toHaveValue('2022-01-02');

        const dschgeSchdldDate = getByRole('dschgeSchdldDate')
        userEvent.clear(dschgeSchdldDate);
        userEvent.type(dschgeSchdldDate, '2022-01-01');
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

    // 입소자 상세정보 수정
    test('Update Admission is Succeed', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })
        const testRow = getByText('TESTERNm');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
        })

        const updateButton = getByText('수정');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(getByRole('admissionId')).toHaveValue('A999999999');
            expect(getByRole('patientId')).toHaveValue('TESTERId');
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

    // 입소자 퇴소
    test('Admission discharged is Succeed', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })

        const testRow = getByText('TESTERId');
        fireEvent.click(testRow);

        await waitFor(() => {
            expect(testRow.closest('tr')).toHaveClass('active')
            expect(testRow.closest('tr')).toHaveTextContent('재원중')
        })

        const dischargedButton = testRow.closest('tr').querySelector('button');
        expect(dischargedButton).toHaveTextContent('재원중')
        fireEvent.click(dischargedButton);

        await waitFor(() => {
            const modal = getByRole('dialog')
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('생활치료센터 입소자 퇴소');
            expect(modal).toHaveTextContent('퇴소');
        })

        const modalDischargeButton = getByRole('modalDischargeButton')
        fireEvent.click(modalDischargeButton);

        const confirm = getByText('TESTERNm 을 퇴소처리 하시겠습니까?');
        expect(confirm).toBeInTheDocument();
        //
        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);
        //
        await waitFor(() => {
            const alert = getByText('퇴소 처리 완료');
            expect(alert).toBeInTheDocument();
            expect(testRow.closest('tr')).toHaveTextContent('퇴실')
        })
    })
})


describe('Pageination Test with AdmissionPage', () => {

    // 페이지네이션 > 버튼 테스트
    test('Pageination nextIcon', async () => {
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })

        const nextPageIcon = getByRole('nextPageIcon');
        fireEvent.click(nextPageIcon);

        await waitFor(()=>{
            const targetPageNum = document.querySelector('li.active');
            expect(targetPageNum).toHaveTextContent('11')
        })

    })
    // 페이지네이션 < 버튼 테스트
    test('Pageination prevIcon', async () => {
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Admission/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("TESTERId")).toBeInTheDocument();
            expect(getByText("TESTERNm")).toBeInTheDocument();
            expect(getByText('5000')).toHaveStyle('color:#ff2020')
            expect(getByText('19')).toHaveStyle('color:#2094ff')
        })

        const nextPageIcon = getByRole('nextPageIcon');
        fireEvent.click(nextPageIcon);

        await waitFor(()=>{
            const targetPageNum = document.querySelector('li.active');
            expect(targetPageNum).toHaveTextContent('11')
        })

        const prevPageIcon = getByRole('prevPageIcon');
        fireEvent.click(prevPageIcon);

        await waitFor(()=>{
            const targetPageNum = document.querySelector('li.active');
            expect(targetPageNum).toHaveTextContent('1')
        })

    })
})