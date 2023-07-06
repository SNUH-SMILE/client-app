import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../../Utils/AuthorizationAxios";
import {fireEvent, getByRole, render, waitFor} from "@testing-library/react";
import AlertStore from "../../Providers/AlertContext";
import TitleStore from "../../Providers/TitleContext";
import {BrowserRouter} from "react-router-dom";
import HcAlert from "../../component/HCAlert";
import CommonCode from "./CommonCode";
import userEvent from "@testing-library/user-event";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})

    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/comCd/list')
        .reply(200, {
            "code": "00",
            "message": null,
            "result": [
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:09:24",
                    "updId": "test",
                    "updNm": "테스터",
                    "updDt": "2022-06-08 11:20:00",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "comCdNm": "공통코드구분",
                    "comCdDiv": "SYS",
                    "useYn": "Y",
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:09:24",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:09:24",
                    "cudFlag": null,
                    "comCd": "CD002",
                    "comCdNm": "병원코드",
                    "comCdDiv": "COM",
                    "useYn": "Y",
                    "remark": null
                },
            ]
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/comCd/detail/list', {'comCd': 'CD001', 'useYn': ''})
        .reply(200, {
            "code": "00",
            "message": null,
            "result": [
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:10:48",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:10:48",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "detailCd": "SYS",
                    "detailCdNm": "시스템",
                    "sortSeq": 0,
                    "useYn": "Y",
                    "property1": null,
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:10:48",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:10:48",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "detailCd": "COM",
                    "detailCdNm": "공통",
                    "sortSeq": 1,
                    "useYn": "Y",
                    "property1": null,
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                }
            ]
        })


    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/comCd/detail/list', {'comCd': 'CD001', 'useYn': 'Y'})
        .reply(200, {
            "code": "00",
            "message": null,
            "result": [
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:10:48",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:10:48",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "detailCd": "SYS",
                    "detailCdNm": "시스템",
                    "sortSeq": 0,
                    "useYn": "Y",
                    "property1": null,
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:10:48",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:10:48",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "detailCd": "COM",
                    "detailCdNm": "공통",
                    "sortSeq": 1,
                    "useYn": "Y",
                    "property1": null,
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                }
            ]
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/comCd/save', {
        "ComCdSearchVO": {
            "comCd": "",
            "comCdNm": "",
            "useYn": ""
        },
        "comCdVOList": [{
            'header' : "C1",
            'comCd' : "",
            'comCdNm' : "TESTCOMCD",
            'comCdDiv' : "COM",
            'useYn' : "Y",
            'remark' : "",
            'cudFlag' : "C",
            'active' : true
        }]
    })
        .reply(200, {
            code: '00', message: '공통코드 저장 완료',
            result: [
                {
                    "regId": "test",
                    "regNm": "테스터",
                    "regDt": "2022-06-28 13:02:52",
                    "updId": "test",
                    "updNm": "테스터",
                    "updDt": "2022-06-28 13:02:52",
                    "cudFlag": null,
                    "comCd": "CD010",
                    "comCdNm": "TESTCOMCD",
                    "comCdDiv": "COM",
                    "useYn": "Y",
                    "remark": null,
                    "active": true
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:09:24",
                    "updId": "test",
                    "updNm": "테스터",
                    "updDt": "2022-06-27 20:45:20",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "comCdNm": "Update공통코드구분",
                    "comCdDiv": "SYS",
                    "useYn": "Y",
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:09:24",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:09:24",
                    "cudFlag": null,
                    "comCd": "CD002",
                    "comCdNm": "병원코드",
                    "comCdDiv": "COM",
                    "useYn": "Y",
                    "remark": null
                },
            ]
        })

    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/comCd/save', {
        "ComCdSearchVO": {
            "comCd": "",
            "comCdNm": "",
            "useYn":""
        },
        "comCdVOList": [{
            "cudFlag":"U",
            "comCd":"CD001",
            "comCdNm":"Update공통코드구분",
            "comCdDiv":"SYS",
            "useYn":"Y",
            "remark":null,
            "active": true,
            "regId": "admin",
            "regNm": "관리자",
            "regDt": "2021-11-22 15:09:24",
            "updId": "test",
            "updNm": "테스터",
            "updDt": "2022-06-08 11:20:00",
        }]
    })
        .reply(200, {
            code: '00', message: '공통코드 저장 완료',
            result: [
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:09:24",
                    "updId": "test",
                    "updNm": "테스터",
                    "updDt": "2022-06-27 20:45:20",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "comCdNm": "Update공통코드구분",
                    "comCdDiv": "SYS",
                    "useYn": "Y",
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:09:24",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:09:24",
                    "cudFlag": null,
                    "comCd": "CD002",
                    "comCdNm": "병원코드",
                    "comCdDiv": "COM",
                    "useYn": "Y",
                    "remark": null
                },
            ]
        })

    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/comCd/detail/save')
        .reply(200, {
            code: '00', message: '공통코드상세 저장 완료',
            result: [
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:10:48",
                    "updId": "test",
                    "updNm": "테스터",
                    "updDt": "2022-06-28 10:09:42",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "detailCd": "SYS",
                    "detailCdNm": "Update시스템",
                    "sortSeq": 0,
                    "useYn": "Y",
                    "property1": null,
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:10:48",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:10:48",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "detailCd": "COM",
                    "detailCdNm": "공통",
                    "sortSeq": 1,
                    "useYn": "Y",
                    "property1": null,
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                }
            ]
        })

    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/comCd/detail/save', {
        "ComCdSearchVO": {
            "comCd": "",
            "comCdNm": "",
            "useYn": ""
        },
        "comCdDetailVOList": [{
            'header' : "C1",
            'cudFlag' : "C",
            'comCd' : "CD001",
            'detailCd' : "TestDetailCd",
            'detailCdNm' : "TestDetailCdNm",
            'sortSeq' : "",
            'useYn' : "Y",
            'property1' : "",
            'property2' : "",
            'property3' : "",
            'property4' : "",
            'property5' : "",
            'remark' : "",
            'active' : true,
        }]
    })
        .reply(200, {
            code: '00', message: '공통코드상세 저장 완료',
            result: [
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:10:48",
                    "updId": "test",
                    "updNm": "테스터",
                    "updDt": "2022-06-28 10:09:42",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "detailCd": "SYS",
                    "detailCdNm": "시스템",
                    "sortSeq": 0,
                    "useYn": "Y",
                    "property1": null,
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "admin",
                    "regNm": "관리자",
                    "regDt": "2021-11-22 15:10:48",
                    "updId": "admin",
                    "updNm": "관리자",
                    "updDt": "2021-11-22 15:10:48",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "detailCd": "COM",
                    "detailCdNm": "공통",
                    "sortSeq": 1,
                    "useYn": "Y",
                    "property1": null,
                    "property2": null,
                    "property3": null,
                    "property4": null,
                    "property5": null,
                    "remark": null
                },
                {
                    "regId": "test",
                    "regNm": "테스터",
                    "regDt": "2022-06-28 16:13:59",
                    "updId": "test",
                    "updNm": "테스터",
                    "updDt": "2022-06-28 16:13:59",
                    "cudFlag": null,
                    "comCd": "CD001",
                    "detailCd": "TestDetailCd",
                    "detailCdNm": "TestDetailCdNm",
                    "sortSeq": 2,
                    "useYn": "Y",
                    "property1": "",
                    "property2": "",
                    "property3": "",
                    "property4": "",
                    "property5": "",
                    "remark": ""
                }
            ]
        })
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe('CommonCode Page', () => {

    // 공통코드 페이지 Mount 및 useEffect[] 테스트
    test('Mount CommonCodePage And Effect is Succeed', async () => {
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
    })

    // 신규 공통코드 추가 후 X 버튼 눌러서 삭제
    test('Create ComCd after Click X Button', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const comCdButton = getByRole('newComCd')
        fireEvent.click(comCdButton);

        const comCd = getByRole('comCd')
        const deleteRowIcon = getByRole('deleteRow')
        await waitFor(() => {
            expect(comCd).toContainElement(deleteRowIcon);
        })
        fireEvent.click(deleteRowIcon);
        await waitFor(() => {
            expect(comCd).not.toContainElement(deleteRowIcon);
        })
    })

    // 신규 또는 수정건이 없을때 저장버튼 누를시
    test('When there is no new or modified Line then click the Save button', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })

        const saveButton = getByRole('saveComCd');
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(getByText('신규 또는 수정건이 없습니다.')).toBeInTheDocument()
        })

    })

    // 신규 공통코드 추가시 코드명이 공백일때
    test('Create ComCd With Null CodeNm', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const comCdButton = getByRole('newComCd')
        fireEvent.click(comCdButton);

        const comCd = getByRole('comCd')
        const deleteRowIcon = getByRole('deleteRow')
        await waitFor(() => {
            expect(comCd).toContainElement(deleteRowIcon);
        })

        const saveButton = getByRole('saveComCd');
        fireEvent.click(saveButton);
        const newRow = deleteRowIcon.closest('tr');
        const comCdNm = newRow.querySelector('input[name="comCdNm"]');
        await waitFor(()=>{
            expect(getByText('[신규 1번]의 공통코드명이 누락되었습니다.')).toBeInTheDocument()
        })
        const alert = getByText('[신규 1번]의 공통코드명이 누락되었습니다.');
        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument()
        })
        expect(comCdNm).toHaveFocus();
    })

    // 신규 공통코드 추가시 업무구분을 선택하지 않았을때
    test('Create ComCd With Null ComCdDiv', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const comCdButton = getByRole('newComCd')
        fireEvent.click(comCdButton);

        const comCd = getByRole('comCd')
        const deleteRowIcon = getByRole('deleteRow')
        await waitFor(() => {
            expect(comCd).toContainElement(deleteRowIcon);
        })
        const newRow = deleteRowIcon.closest('tr');
        const comCdNm = newRow.querySelector('input[name="comCdNm"]');
        const comCdDiv = newRow.querySelector('select[name="comCdDiv"]');
        userEvent.type(comCdNm, 'TESTCOMCD');

        const saveButton = getByRole('saveComCd');
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(getByText('[신규 1번]의 업무구분을 선택하세요.')).toBeInTheDocument()
        })
        const alert = getByText('[신규 1번]의 업무구분을 선택하세요.');
        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument()
        })
        expect(comCdDiv).toHaveFocus();
    })

    // 신규 공통코드 추가
    test('Create ComCd', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const comCdButton = getByRole('newComCd')
        fireEvent.click(comCdButton);

        const comCd = getByRole('comCd')
        const deleteRowIcon = getByRole('deleteRow')
        await waitFor(() => {
            expect(comCd).toContainElement(deleteRowIcon);
        })
        const newRow = deleteRowIcon.closest('tr');
        const comCdNm = newRow.querySelector('input[name="comCdNm"]');
        const comCdDiv = newRow.querySelector('select[name="comCdDiv"]');
        userEvent.type(comCdNm, 'TESTCOMCD');
        userEvent.selectOptions(comCdDiv, 'COM')

        const saveButton = getByRole('saveComCd');
        fireEvent.click(saveButton);

        const confirm = getByText('생성 / 수정 하시겠습니까?')
        await waitFor(() => {
            expect(confirm).toBeInTheDocument();
        })
        const confirmButton = getByText('확인')
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(getByText('공통코드 저장 완료')).toBeInTheDocument();
            expect(comCd).toHaveTextContent('TESTCOMCD')
        })
    })

    // 공통코드 에디트 모드
    test('ComCd Editmode', async () => {
        const {getByText, getByRole, getByDisplayValue} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const Cd001 = getByText('CD001');
        const headerBox = Cd001.closest('tr').querySelector('input[name="header"]');
        fireEvent.click(headerBox);

        const comCdNm = getByDisplayValue('공통코드구분')
        const comCdDiv = getByDisplayValue('시스템')
        await waitFor(() => {
            expect(Cd001.closest('tr')).toContainElement(comCdNm);
            expect(Cd001.closest('tr')).toContainElement(comCdDiv);
        })
        fireEvent.click(headerBox);
        await waitFor(() => {
            expect(Cd001.closest('tr')).toHaveTextContent('공통코드구분')
            expect(Cd001.closest('tr')).toHaveTextContent('시스템')
        })
    })

    // 공통코드 수정
    test('Update ComCd', async () => {
        const {getByText, getByRole, getByDisplayValue} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const Cd001 = getByText('CD001');
        const headerBox = Cd001.closest('tr').querySelector('input[name="header"]');
        fireEvent.click(headerBox);

        const comCdNm = getByDisplayValue('공통코드구분')
        const comCdDiv = getByDisplayValue('시스템')
        await waitFor(() => {
            expect(Cd001.closest('tr')).toContainElement(comCdNm);
            expect(Cd001.closest('tr')).toContainElement(comCdDiv);
        })
        userEvent.clear(comCdNm);
        userEvent.type(comCdNm,'Update공통코드구분');
        expect(comCdNm).toHaveValue('Update공통코드구분');

        const saveComCd = getByRole('saveComCd')
        fireEvent.click(saveComCd);

        const confirm = getByText('생성 / 수정 하시겠습니까?');
        await waitFor(() => {
            expect(confirm).toBeInTheDocument()
        });

        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);

        const comCd = getByRole('comCd')
        await waitFor(() => {
            expect(confirm).not.toBeInTheDocument()
            expect(getByText('공통코드 저장 완료')).toBeInTheDocument()
            expect(comCd).toHaveTextContent('Update공통코드구분')
        })
    })

    // 상세코드 조회
    test('Get DetailCode', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })

        const testRow = getByText('CD001');
        fireEvent.click(testRow);

        const comCdDetail = getByRole('comCdDetail')
        await waitFor(() => {
            expect(comCdDetail).toHaveTextContent('SYS')
            expect(comCdDetail).toHaveTextContent('시스템')
            expect(comCdDetail).toHaveTextContent('COM')
            expect(comCdDetail).toHaveTextContent('공통')
        })

    })

    // 상위코드를 선택하지 않고 신규 상세코드 추가시
    test('Create ComCdDetail with dont Selected comCd', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const comCdDetailButton = getByRole('newComCdDetail')
        fireEvent.click(comCdDetailButton);

        const alert = getByText('상위 공통코드를 선택해주세요.')
        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        })
    })

    // 신규 상세코드 추가시 세부코드가 공백일때
    test('Create ComCdDetail With Null DetailCd', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const testRow = getByText('CD001');
        fireEvent.click(testRow);

        const comCdDetail = getByRole('comCdDetail')
        await waitFor(() => {
            expect(comCdDetail).toHaveTextContent('SYS')
            expect(comCdDetail).toHaveTextContent('시스템')
            expect(comCdDetail).toHaveTextContent('COM')
            expect(comCdDetail).toHaveTextContent('공통')
        })

        const comCdDetailButton = getByRole('newComCdDetail')
        fireEvent.click(comCdDetailButton);

        const deleteRowIcon = getByRole('deleteRow')
        await waitFor(() => {
            expect(comCdDetail).toContainElement(deleteRowIcon);
        })
        const newRow = deleteRowIcon.closest('tr');
        const detailCd = newRow.querySelector('input[name="detailCd"]')

        const saveComCdDetail = getByRole('saveComCdDetail');
        fireEvent.click(saveComCdDetail);

        await waitFor(()=>expect(getByText('[신규 1번]의 세부코드가 누락되었습니다.')).toBeInTheDocument())

        const alert = getByText('[신규 1번]의 세부코드가 누락되었습니다.');
        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(expect(alert).not.toBeInTheDocument);
        expect(detailCd).toHaveFocus();
    })

    // 신규 상세코드 추가
    test('Create ComCdDetail', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const testRow = getByText('CD001');
        fireEvent.click(testRow);

        const comCdDetail = getByRole('comCdDetail')
        await waitFor(() => {
            expect(comCdDetail).toHaveTextContent('SYS')
            expect(comCdDetail).toHaveTextContent('시스템')
            expect(comCdDetail).toHaveTextContent('COM')
            expect(comCdDetail).toHaveTextContent('공통')
        })

        const comCdDetailButton = getByRole('newComCdDetail')
        fireEvent.click(comCdDetailButton);

        const deleteRowIcon = getByRole('deleteRow')
        await waitFor(() => {
            expect(comCdDetail).toContainElement(deleteRowIcon);
        })
        const newRow = deleteRowIcon.closest('tr');

        const detailCd = newRow.querySelector('input[name="detailCd"]')
        userEvent.type(detailCd,'TestDetailCd')

        const detailCodeNm = newRow.querySelector('input[name="detailCdNm"]')
        userEvent.type(detailCodeNm,'TestDetailCdNm')

        const saveComCdDetail = getByRole('saveComCdDetail');
        fireEvent.click(saveComCdDetail);

        const confirm = getByText('생성 / 수정 하시겠습니까?');
        await waitFor(()=>expect(confirm).toBeInTheDocument());

        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton)

        //공통코드상세 저장 완료
        await waitFor(()=> {
            expect(getByText('공통코드상세 저장 완료')).toBeInTheDocument()
        })

        const alert = getByText('공통코드상세 저장 완료');
        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument();
        })

    })

    // 신규 상세코드 2개 추가 시 세부코드가 중복일때
    test('Create ComCdDetails With Duplicate DetailCd', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const testRow = getByText('CD001');
        fireEvent.click(testRow);

        const comCdDetail = getByRole('comCdDetail')
        await waitFor(() => {
            expect(comCdDetail).toHaveTextContent('SYS')
            expect(comCdDetail).toHaveTextContent('시스템')
            expect(comCdDetail).toHaveTextContent('COM')
            expect(comCdDetail).toHaveTextContent('공통')
        })

        const comCdDetailButton = getByRole('newComCdDetail')
        fireEvent.click(comCdDetailButton);
        fireEvent.click(comCdDetailButton);

        const detailCds = document.querySelectorAll('input[name="detailCd"]')
        userEvent.type(detailCds[0],'1');
        userEvent.type(detailCds[1],'1');

        const saveComCdDetail = getByRole('saveComCdDetail');
        fireEvent.click(saveComCdDetail);

        await waitFor(()=>expect(getByText('중복된 세부코드가 존재합니다.-[1]')).toBeInTheDocument())

        const alert = getByText('중복된 세부코드가 존재합니다.-[1]');
        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(expect(alert).not.toBeInTheDocument);
        expect(detailCds[0]).toHaveFocus();
    })

    // 신규 상세코드 추가시 세부코드명이 공백일때
    test('Create ComCdDetail With DetailCdNm', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const testRow = getByText('CD001');
        fireEvent.click(testRow);

        const comCdDetail = getByRole('comCdDetail')
        await waitFor(() => {
            expect(comCdDetail).toHaveTextContent('SYS')
            expect(comCdDetail).toHaveTextContent('시스템')
            expect(comCdDetail).toHaveTextContent('COM')
            expect(comCdDetail).toHaveTextContent('공통')
        })

        const comCdDetailButton = getByRole('newComCdDetail')
        fireEvent.click(comCdDetailButton);

        const deleteRowIcon = getByRole('deleteRow')
        await waitFor(() => {
            expect(comCdDetail).toContainElement(deleteRowIcon);
        })
        const newRow = deleteRowIcon.closest('tr');
        const detailCd = newRow.querySelector('input[name="detailCd"]')
        userEvent.type(detailCd,'TestDetailCd')
        const detailCodeNm = newRow.querySelector('input[name="detailCdNm"]')

        const saveComCdDetail = getByRole('saveComCdDetail');
        fireEvent.click(saveComCdDetail);

        await waitFor(()=>expect(getByText('[TestDetailCd]의 세부코드명이 누락되었습니다.')).toBeInTheDocument())

        const alert = getByText('[TestDetailCd]의 세부코드명이 누락되었습니다.');
        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(expect(alert).not.toBeInTheDocument);
        expect(detailCodeNm).toHaveFocus();
    })

    // 신규 상세코드 추가후 X 버튼을 눌러서 삭제
    test('Create ComCdDetail after Click X Button ', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const testRow = getByText('CD001');
        fireEvent.click(testRow);

        const comCdDetail = getByRole('comCdDetail')
        await waitFor(() => {
            expect(comCdDetail).toHaveTextContent('SYS')
            expect(comCdDetail).toHaveTextContent('시스템')
            expect(comCdDetail).toHaveTextContent('COM')
            expect(comCdDetail).toHaveTextContent('공통')
        })

        const comCdDetailButton = getByRole('newComCdDetail')
        fireEvent.click(comCdDetailButton);

        const deleteRowIcon = getByRole('deleteRow')
        await waitFor(() => expect(comCdDetail).toContainElement(deleteRowIcon))

        fireEvent.click(deleteRowIcon)
        await waitFor(() => expect(comCdDetail).not.toContainElement(deleteRowIcon))
    })

    // 상세코드 에디트 모드
    test('ComCdDetail EditMode', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const Cd001 = getByText('CD001');
        fireEvent.click(Cd001);
        await waitFor(() => expect(getByText('SYS')).toBeInTheDocument())

        const Cd001_SYS = getByText('SYS');
        const detailHeaderBox = Cd001_SYS.closest('tr').querySelector('input[name="header"]');
        userEvent.click(detailHeaderBox);

        expect(detailHeaderBox).toBeChecked();

        const comCdDetail = getByRole('comCdDetail')
        await waitFor(() => {
            expect(comCdDetail).toHaveTextContent('SYS')
            expect(comCdDetail).toHaveTextContent('시스템')
        })

        const comCdDetailNm = Cd001_SYS.closest('tr').querySelector('input[name="detailCdNm"]');
        comCdDetailNm.value = 'Edit';
        expect(comCdDetailNm).toHaveValue('Edit');

        userEvent.click(detailHeaderBox);

        await waitFor(() => {
            expect(comCdDetailNm).toHaveValue('시스템');
        })
    })

    // 상세코드 수정
    test('Update ComCdDetail', async () => {
        const {debug, getByText, getByRole, getByDisplayValue} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <CommonCode/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText('CD001')).toBeInTheDocument()
            expect(getByText('공통코드구분')).toBeInTheDocument()
            expect(getByText('CD002')).toBeInTheDocument()
            expect(getByText('병원코드')).toBeInTheDocument()
        })
        const Cd001 = getByText('CD001');
        fireEvent.click(Cd001);
        await waitFor(() => expect(getByText('SYS')).toBeInTheDocument())

        const Cd001_SYS = getByText('SYS');
        const detailHeaderBox = Cd001_SYS.closest('tr').querySelector('input[name="header"]');
        userEvent.click(detailHeaderBox);

        expect(detailHeaderBox).toBeChecked();

        const comCdDetail = getByRole('comCdDetail')
        await waitFor(() => {
            expect(comCdDetail).toHaveTextContent('SYS')
            expect(comCdDetail).toHaveTextContent('시스템')
        })

        const comCdDetailNm = Cd001_SYS.closest('tr').querySelector('input[name="detailCdNm"]');
        comCdDetailNm.value = 'Update시스템';
        expect(comCdDetailNm).toHaveValue('Update시스템');

        const saveComCdDetail = getByRole('saveComCdDetail')
        fireEvent.click(saveComCdDetail);

        const confirm = getByText('생성 / 수정 하시겠습니까?');
        await waitFor(() => {
            expect(confirm).toBeInTheDocument()
        });

        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);


        await waitFor(() => {
            expect(confirm).not.toBeInTheDocument()
            expect(getByText('공통코드상세 저장 완료')).toBeInTheDocument()
            expect(comCdDetail).toHaveTextContent('Update시스템')
        })
    })


})