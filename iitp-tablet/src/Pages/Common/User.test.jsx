import {fireEvent, render, waitFor} from "@testing-library/react";
import AlertStore from "../../Providers/AlertContext";
import TitleStore from "../../Providers/TitleContext";
import {BrowserRouter} from "react-router-dom";
import HcAlert from "../../component/HCAlert";
import User from "./User";
import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../../Utils/AuthorizationAxios";
import userEvent from "@testing-library/user-event";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})
    // 사용자 검색
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/user/list', {
        'userId': '',
        'userNm': '',
        'centerId': ''
    }).reply(200,
        {
            "code": "00",
            "message": "사용자 리스트 검색 완료",
            "result": [
                {
                    "regId": "test",
                    "regNm": null,
                    "regDt": "2022-06-11 15:25:27",
                    "updId": "test",
                    "updNm": null,
                    "updDt": "2022-06-11 17:33:15",
                    "userId": "U00001",
                    "password": "test",
                    "userNm": "UserName1",
                    "delYn": "N",
                    "mainCenterId": "C001",
                    "mainCenterNm": "테스트 생활치료센터",
                    "remark": "User1Remark",
                    "rememberYn": "N",
                    "userTreatmentCenterVOList": null
                }
            ]
        }, {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/user/list', {
        'userId': '',
        'userNm': '',
        'centerId': 'C000'
    }).reply(200,
        {
            "code": "00",
            "message": "사용자 리스트 검색 완료",
            "result": [
                {
                    "regId": "test",
                    "regNm": null,
                    "regDt": "2022-06-11 15:25:27",
                    "updId": "test",
                    "updNm": null,
                    "updDt": "2022-06-11 17:33:15",
                    "userId": "U00002",
                    "password": "test",
                    "userNm": "UserName2",
                    "delYn": "N",
                    "mainCenterId": "C000",
                    "mainCenterNm": "test센터0",
                    "remark": "User2Remark",
                    "rememberYn": "N",
                    "userTreatmentCenterVOList": null
                }
            ]
        }, {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})

    //사용자 상세정보
    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/user/info', {
        userId: 'U00001',
    })
        .reply(200,
            {
                "code": "00",
                "message": "사용자 정보 조회 완료",
                "result": {
                    "regId": "test",
                    "regNm": null,
                    "regDt": "2022-06-11 15:25:27",
                    "updId": "test",
                    "updNm": null,
                    "updDt": "2022-06-11 17:33:15",
                    "userId": "U00001",
                    "password": "test",
                    "userNm": "UserName1",
                    "delYn": "N",
                    "mainCenterId": "C001",
                    "mainCenterNm": "테스트 생활치료센터",
                    "remark": "User1Remark",
                    "rememberYn": "N",
                    "userTreatmentCenterVOList": [
                        {
                            "regId": "test",
                            "regNm": "테스터",
                            "regDt": null,
                            "updId": null,
                            "updNm": null,
                            "updDt": null,
                            "userId": "U00001",
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
                            "userId": "U00001",
                            "centerId": "C002",
                            "centerNm": "테스트 생활치료센터1",
                            "mainYn": "N"
                        }
                    ]
                }
            })
    // 사용자 생성
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/user/save', {
        "userSearchVO": {"userId": "", "userNm": "", "centerId": ""},
        'userVO': {
            'userId': "",
            'password': "NewPW",
            'userNm': 'NewNM',
            'mainCenterId': "C000",
            'mainCenterNm': "test센터0",
            'remark': "NewRM",
            'userTreatmentCenterVOList': [
                {
                    "centerId": "C000",
                    "centerNm": "test센터0",
                    "mainYn": "Y",
                }
            ]
        }
    })
        .reply(200
            , {
                code: "00",
                "message": "사용자 저장 완료",
                "result": {
                    "userVO": {
                        "regId": "test",
                        "regNm": null,
                        "regDt": "2022-06-23 13:42:51",
                        "updId": "test",
                        "updNm": null,
                        "updDt": "2022-06-23 13:42:51",
                        "userId": "U00010",
                        "password": "NewPw",
                        "userNm": "NewNm",
                        "delYn": "N",
                        "mainCenterId": "C000",
                        "mainCenterNm": "test센터0",
                        "remark": "999999",
                        "rememberYn": "N",
                        "userTreatmentCenterVOList": [
                            {
                                "regId": "test",
                                "regNm": "테스터",
                                "regDt": null,
                                "updId": null,
                                "updNm": null,
                                "updDt": null,
                                "userId": "U00010",
                                "centerId": "C000",
                                "centerNm": "test센터0",
                                "mainYn": "Y"
                            }
                        ]
                    },
                    "userVOList": [
                        {
                            "regId": "test",
                            "regNm": null,
                            "regDt": "2022-06-23 13:42:51",
                            "updId": "test",
                            "updNm": null,
                            "updDt": "2022-06-23 13:42:51",
                            "userId": "U00010",
                            "password": "NewPw",
                            "userNm": "NewNm",
                            "delYn": "N",
                            "mainCenterId": "C000",
                            "mainCenterNm": "test센터0",
                            "remark": "9999999",
                            "rememberYn": "N",
                            "userTreatmentCenterVOList": null
                        }
                    ]
                }
            }
            , {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})

    // 사용자 수정
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/user/save',
        {
            "userSearchVO": {"userId": "", "userNm": "", "centerId": ""},
            "userVO": {
                "userId": "U00001",
                "password": "test",
                "userNm": "UpdateUserNM",
                "remark": "User1Remark",
                "mainCenterId": "C001",
                "mainCenterNm": "테스트 생활치료센터",
                "userTreatmentCenterVOList": [{
                    "regId": "test",
                    "regNm": "테스터",
                    "regDt": null,
                    "updId": null,
                    "updNm": null,
                    "updDt": null,
                    "userId": "U00001",
                    "centerId": "C001",
                    "centerNm": "테스트 생활치료센터",
                    "mainYn": "Y",
                    "delYn": false
                }, {
                    "regId": "test",
                    "regNm": "테스터",
                    "regDt": null,
                    "updId": null,
                    "updNm": null,
                    "updDt": null,
                    "userId": "U00001",
                    "centerId": "C002",
                    "centerNm": "테스트 생활치료센터1",
                    "mainYn": "N",
                    "delYn": false
                }]
            }
        })
        .reply(200
            , {
                "code": "00",
                "message": "사용자 저장 완료",
                "result": {
                    "userVO": {
                        "regId": "test",
                        "regNm": null,
                        "regDt": "2022-06-23 13:42:51",
                        "updId": "test",
                        "updNm": null,
                        "updDt": "2022-06-23 13:42:51",
                        "userId": "U00001",
                        "password": "NewPw",
                        "userNm": "UpdateUserNM",
                        "delYn": "N",
                        "mainCenterId": "C002",
                        "mainCenterNm": "테스트 생활치료센터1",
                        "remark": "User1Remark",
                        "rememberYn": "N",
                        "userTreatmentCenterVOList": [
                            {
                                "regId": "test",
                                "regNm": "테스터",
                                "regDt": null,
                                "updId": null,
                                "updNm": null,
                                "updDt": null,
                                "userId": "U00001",
                                "centerId": "C002",
                                "centerNm": "테스트 생활치료센터1",
                                "mainYn": "Y"
                            }
                        ]
                    },
                    "userVOList": [
                        {
                            "regId": "test",
                            "regNm": null,
                            "regDt": "2022-06-23 13:42:51",
                            "updId": "test",
                            "updNm": null,
                            "updDt": "2022-06-23 13:42:51",
                            "userId": "U00001",
                            "password": "NewPw",
                            "userNm": "UpdateUserNM",
                            "delYn": "N",
                            "mainCenterId": "C000",
                            "mainCenterNm": "test센터0",
                            "remark": "999",
                            "rememberYn": "N",
                            "userTreatmentCenterVOList": null
                        }
                    ]
                }
            }
            , {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})

// 사용자 삭제
    mockAxios.onDelete(process.env.REACT_APP_BASE_URL + '/api/user/save',
        {
            userSearchVO: {
                userId: '',
                userNm: '',
                centerId: '',
            },
            userVO: {userId: 'U00001'},
        }
    )
        .reply(200
            , {
                "code": "00",
                "message": "사용자 삭제 성공",
                "result": [
                    {
                        "regId": "test",
                        "regNm": null,
                        "regDt": "2022-06-11 15:25:27",
                        "updId": "test",
                        "updNm": null,
                        "updDt": "2022-06-11 17:33:15",
                        "userId": "U00002",
                        "password": "test",
                        "userNm": "UserName2",
                        "delYn": "N",
                        "mainCenterId": "C001",
                        "mainCenterNm": "테스트 생활치료센터",
                        "remark": "User2Remark",
                        "rememberYn": "N",
                        "userTreatmentCenterVOList": null
                    }
                ]
            }
            , {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})
// 생활치료센터리스트 모달에서 사용
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/treatmentCenter/list', {
        centerId: '',
        centerNm: '',
        hospitalNm: ''
    })
        .reply(200,
            {
                code: '00', message: '조회 성공',
                result: [
                    {
                        "regId": "test",
                        "regNm": null,
                        "regDt": "2022-06-03 12:47:01",
                        "updId": "test",
                        "updNm": null,
                        "updDt": "2022-06-03 12:47:18",
                        "centerId": "C000",
                        "centerNm": "test센터0",
                        "centerLocation": "test센터0Location",
                        "hospitalCd": "testHC0",
                        "hospitalNm": "test병원0"
                    },
                ]
            }
            , {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`}
        )
})
;

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

describe('User Page', () => {

    // 사용자 페이지 Mount 및 useEffect[] 테스트
    test("Mount UserPage And Effect is Succeed", async () => {

        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)


        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })
    })

    // 검색 생활치료센터 모달에서 테이블 선택이 라디오 버튼으로 표현되는지
    test('Search UserList TreatmentCenter Modal Have Radio', async ()=>{
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)


        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })
        const selectTreatmentCenter = getByRole('selectTreatmentCenter');
        userEvent.click(selectTreatmentCenter);

        const modal = getByRole('dialog')

        await waitFor(() => {
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('생활치료센터');
            expect(modal).toContainHTML('name="lcenter"');
        })
    })

    // 검색 생활치료센터 모달에서 생활치료센터를 선택하지 않고 선택버튼을 눌렀을때
    test('Search UserList By TreatmentCenter Then Dont Selected TreatmentCenter', async ()=>{
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)


        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })
        const selectTreatmentCenter = getByRole('selectTreatmentCenter');
        userEvent.click(selectTreatmentCenter);

        const modal = getByRole('dialog')

        await waitFor(() => {
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('생활치료센터');
        })

        const modalSelectButton = getByRole('selectButton');
        userEvent.click(modalSelectButton)

        await waitFor(()=>expect(getByText('생활치료센터를 선택하세요.')).toBeInTheDocument())
    })

    // 검색 생활치료센터 모달에서 생활치료센터를 선택하고 선택버튼을 눌렀을때
    test('Search UserList By TreatmentCenter Then Selected TreatmentCenter', async ()=>{
        const {getByText,getByRole} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)


        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })
        const selectTreatmentCenter = getByRole('selectTreatmentCenter');
        userEvent.click(selectTreatmentCenter);

        const modal = getByRole('dialog')

        await waitFor(() => {
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('생활치료센터');
        })
        const radio = document.querySelector('input[type="radio"]')
        userEvent.click(radio);
        expect(radio).toBeChecked();

        // debug()
        const modalSelectButton = getByRole('selectButton');
        userEvent.click(modalSelectButton);

        await waitFor(()=>expect(selectTreatmentCenter).toHaveDisplayValue('test센터0'));
        await waitFor(()=>expect(getByText('UserName2')).toBeInTheDocument());

    })

    // 사용자 상세정보 조회
    test("Get User Detail Data is Succeed", async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const testRow = getByText("U00001");

        fireEvent.click(testRow);

        await waitFor(() => {
            const detailUserID = getByRole('detailUserID');
            const detailUserPW = getByRole('detailUserPW');
            const detailUserNM = getByRole('detailUserNM');
            const detailUserRM = getByRole('detailUserRM');
            expect(detailUserID).toHaveValue('U00001');
            expect(detailUserPW).toHaveValue('test');
            expect(detailUserNM).toHaveValue('UserName1');
            expect(detailUserRM).toHaveValue('User1Remark');
        })
    })

    // 생활치료센터 리스트 삭제
    test("delete TreatmentCenter for User", async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const testRow = getByText("U00001");

        fireEvent.click(testRow);

        const detailUserID = getByRole('detailUserID');
        const detailUserPW = getByRole('detailUserPW');
        const detailUserNM = getByRole('detailUserNM');
        const detailUserRM = getByRole('detailUserRM');
        const userCenterList = getByRole('userCenterList')
        await waitFor(() => {
            expect(detailUserID).toHaveValue('U00001');
            expect(detailUserPW).toHaveValue('test');
            expect(detailUserNM).toHaveValue('UserName1');
            expect(detailUserRM).toHaveValue('User1Remark');
            expect(userCenterList).toHaveTextContent('테스트 생활치료센터');
            expect(userCenterList).toHaveTextContent('테스트 생활치료센터1');
        })

        const allCheckBox = getByRole('allCheck');
        fireEvent.click(allCheckBox);

        const deleteTreatmentCenterButton = getByRole('deleteTreatmentCenter');
        fireEvent.click(deleteTreatmentCenterButton);

        await waitFor(()=>{
            expect(userCenterList).not.toHaveTextContent('테스트 생활치료센터');
            expect(userCenterList).not.toHaveTextContent('테스트 생활치료센터1');
        })

    })

    // 생활치료센터 리스트 추가
    test('add TreatmentCenter for User', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })
        const modalOpenButton = getByText('추가');
        fireEvent.click(modalOpenButton);

        const modal = getByRole('dialog')

        await waitFor(() => {
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('생활치료센터');
        })

        fireEvent.click(modal.querySelector('input[type="checkbox"]'))

        const modalSelectButton = getByRole('selectButton')
        fireEvent.click(modalSelectButton);

        await waitFor(() => {
            expect(modal).not.toBeInTheDocument();
            expect(getByText('test센터0')).toBeInTheDocument();
            const radio = document.querySelector('input[type="radio"]');
            radio.checked = true
        })
    })

    // 사용자 생성시 비밀번호가 공백일때
    test('Create User With Null Password is Failed', async () => {
        const { getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const detailUserPW = getByRole('detailUserPW');

        detailUserPW.value = '';
        expect(detailUserPW).toHaveValue('')


        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const passwordNullAlert = getByText('패스워드가 공백입니다.');
        await waitFor(()=>{
            expect(passwordNullAlert).toBeInTheDocument();
        })
        const passwordNullAlertButton = getByText('확인');
        fireEvent.click(passwordNullAlertButton);

        await waitFor(()=>{
            expect(passwordNullAlert).not.toBeInTheDocument();
        })
    })

    // 사용자 생성시 사용자명이 공백일때
    test('Create User With Null UserName is Failed', async () => {
        const { getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const detailUserPW = getByRole('detailUserPW');
        const detailUserNM = getByRole('detailUserNM');

        detailUserPW.value = 'pass';
        expect(detailUserPW).toHaveValue('pass')
        expect(detailUserNM).toHaveValue('')


        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const userNameNullAlert = getByText('사용자명이 공백입니다.');
        await waitFor(()=>{
            expect(userNameNullAlert).toBeInTheDocument();
        })
        const userNameNullAlertButton = getByText('확인');
        fireEvent.click(userNameNullAlertButton);

        await waitFor(()=>{
            expect(userNameNullAlert).not.toBeInTheDocument();
        })
    })

    // 사용자 생성시 선택된 생활치료센터가 없을때
    test('Create User With Null TreatmentCenter is Failed', async () => {
        const { getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const detailUserPW = getByRole('detailUserPW');
        const detailUserNM = getByRole('detailUserNM');

        detailUserPW.value = 'pass';
        detailUserNM.value = 'name';


        expect(detailUserPW).toHaveValue('pass')
        expect(detailUserNM).toHaveValue('name')


        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const treatmentCenterNullAlert = getByText('생활치료센터를 선택해주세요');
        await waitFor(()=>{
            expect(treatmentCenterNullAlert).toBeInTheDocument();
        })
        const treatmentCenterNullAlertButton = getByText('확인');
        fireEvent.click(treatmentCenterNullAlertButton);

        await waitFor(()=>{
            expect(treatmentCenterNullAlert).not.toBeInTheDocument();
        })

    })

    // 사용자 생성시 선택된 생활치료센터가 존재하지만 메인센터가 선택이되어 있지 않을 경우
    test('Create User With not Selected Main TreatmentCenter is Succeed', async () => {
        const { getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const detailUserPW = getByRole('detailUserPW');
        const detailUserNM = getByRole('detailUserNM');

        detailUserPW.value = 'pass';
        detailUserNM.value = 'name';


        expect(detailUserPW).toHaveValue('pass')
        expect(detailUserNM).toHaveValue('name')

        const modalOpenButton = getByText('추가');
        fireEvent.click(modalOpenButton);

        const modal = getByRole('dialog')

        await waitFor(() => {
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('생활치료센터');
        })

        fireEvent.click(modal.querySelector('input[type="checkbox"]'))

        const modalSelectButton = getByRole('selectButton')
        fireEvent.click(modalSelectButton);

        await waitFor(() => {
            expect(modal).not.toBeInTheDocument();
            expect(getByText('test센터0')).toBeInTheDocument();
        })

        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const mainTreatmentCenterNullAlert = getByText('생활치료센터 메인여부를 선택해주세요');
        await waitFor(()=>{
            expect(mainTreatmentCenterNullAlert).toBeInTheDocument();
        })
        const mainTreatmentCenterNullAlertButton = getByText('확인');
        fireEvent.click(mainTreatmentCenterNullAlertButton);

        await waitFor(()=>{
            expect(mainTreatmentCenterNullAlert).not.toBeInTheDocument();
        })

    })

    // 사용자 생성
    test('Create User is Succeed', async () => {
        const { getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const detailUserID = getByRole('detailUserID');
        const detailUserPW = getByRole('detailUserPW');
        const detailUserNM = getByRole('detailUserNM');
        const detailUserRM = getByRole('detailUserRM');

        detailUserID.value = '';
        detailUserPW.value = 'NewPW';
        detailUserNM.value = 'NewNM';
        detailUserRM.value = 'NewRM';


        expect(detailUserPW).toHaveValue('NewPW')
        expect(detailUserNM).toHaveValue('NewNM')
        expect(detailUserRM).toHaveValue('NewRM')

        const modalOpenButton = getByText('추가');
        fireEvent.click(modalOpenButton);

        const modal = getByRole('dialog')

        await waitFor(() => {
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent('생활치료센터');
        })

        fireEvent.click(modal.querySelector('input[type="checkbox"]'))

        const modalSelectButton = getByRole('selectButton')
        fireEvent.click(modalSelectButton);

        await waitFor(() => {
            expect(modal).not.toBeInTheDocument();
            expect(getByText('test센터0')).toBeInTheDocument();
        })
        const radio = document.querySelector('input[type="radio"]');
        fireEvent.click(radio);
        await waitFor(() => {
            expect(radio).toBeChecked()
        })

        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const confirm = getByText('[NewNM] 를 생성하시겠습니까?')
        expect(confirm).toBeInTheDocument();


        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton)

        await waitFor(() => {
            expect(confirm).not.toBeInTheDocument();
        })

        const alert = getByText('사용자 저장 완료');
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(detailUserID).toHaveValue('U00010');
        })

    })


    // 사용자 수정
    test('Update User is Succeed', async () => {
        const { getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const testRow = getByText("U00001");

        fireEvent.click(testRow);

        const detailUserID = getByRole('detailUserID');
        const detailUserPW = getByRole('detailUserPW');
        const detailUserNM = getByRole('detailUserNM');
        const detailUserRM = getByRole('detailUserRM');

        await waitFor(() => {
            expect(detailUserID).toHaveValue('U00001');
            expect(detailUserPW).toHaveValue('test');
            expect(detailUserNM).toHaveValue('UserName1');
            expect(detailUserRM).toHaveValue('User1Remark');
        })

        detailUserNM.value = 'UpdateUserNM';

        expect(detailUserNM).toHaveValue('UpdateUserNM')


        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const confirm = getByText('[U00001] 를 수정하시겠습니까?')
        await waitFor(() => {
            expect(confirm).toBeInTheDocument();
        })


        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton)

        await waitFor(() => {
            expect(confirm).not.toBeInTheDocument();
        })
        const alert = getByText('사용자 저장 완료');
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(getByText('UpdateUserNM')).toBeInTheDocument();

        })
    })


    // 사용자 삭제
    test("Delete User is Succeed", async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const testRow = getByText("U00001");

        fireEvent.click(testRow);

        const detailUserID = getByRole('detailUserID');
        const detailUserPW = getByRole('detailUserPW');
        const detailUserNM = getByRole('detailUserNM');
        const detailUserRM = getByRole('detailUserRM');

        await waitFor(() => {
            expect(detailUserID).toHaveValue('U00001');
            expect(detailUserPW).toHaveValue('test');
            expect(detailUserNM).toHaveValue('UserName1');
            expect(detailUserRM).toHaveValue('User1Remark');
        })

        const deleteButton = getByRole('deleteUserButton');
        fireEvent.click(deleteButton);

        const confirm = getByText('[U00001] 를 삭제하시겠습니까?')
        expect(confirm).toBeInTheDocument();

        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton)

        await waitFor(() => {
            expect(confirm).not.toBeInTheDocument();
        })

        const alert = getByText('사용자 삭제 성공')
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
            expect(detailUserID).toHaveValue('');
            expect(detailUserPW).toHaveValue('');
            expect(detailUserNM).toHaveValue('');
            expect(detailUserRM).toHaveValue('');
            expect(getByText('U00002')).toBeInTheDocument();
        })
    })

    // 사용자 상세정보 초기화
    test('User DetailData Clear', async () => {
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <User/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("U00001")).toBeInTheDocument();
            expect(getByText("UserName1")).toBeInTheDocument();
        })

        const testRow = getByText("U00001");

        fireEvent.click(testRow);

        const detailUserID = getByRole('detailUserID');
        const detailUserPW = getByRole('detailUserPW');
        const detailUserNM = getByRole('detailUserNM');
        const detailUserRM = getByRole('detailUserRM');

        await waitFor(() => {
            expect(detailUserID).toHaveValue('U00001');
            expect(detailUserPW).toHaveValue('test');
            expect(detailUserNM).toHaveValue('UserName1');
            expect(detailUserRM).toHaveValue('User1Remark');
        })

        const clearButton = getByText('신규');
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(detailUserID).toHaveValue('');
            expect(detailUserPW).toHaveValue('');
            expect(detailUserNM).toHaveValue('');
            expect(detailUserRM).toHaveValue('');
        })
    })


})