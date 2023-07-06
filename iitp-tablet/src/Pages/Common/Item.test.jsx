import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../../Utils/AuthorizationAxios";
import {fireEvent, render, waitFor} from "@testing-library/react";
import AlertStore from "../../Providers/AlertContext";
import TitleStore from "../../Providers/TitleContext";
import {BrowserRouter} from "react-router-dom";
import HcAlert from "../../component/HCAlert";
import Item from "./Item";
import userEvent from "@testing-library/user-event";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})

    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/item/list',{
        'itemId': '',
        'itemNm': '',
    })
        .reply(200,{
            code:'00', message:'조회성공',
            result:[
                {
                    "regId": "test",
                    "regNm": null,
                    "regDt": "2021-11-30 09:37:16",
                    "updId": "admin",
                    "updNm": null,
                    "updDt": "2022-06-14 13:40:02",
                    "itemId": "I0001",
                    "itemNm": "체온",
                    "unit": "℃",
                    "refFrom": 35,
                    "refTo": 38,
                    "delYn": "N"
                }
            ]
        }, {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/item/list',{
        'itemId': 'I0002',
        'itemNm': '',
    })
        .reply(200,{
            code:'00', message:'조회성공',
            result:[
                {
                    "regId": "test",
                    "regNm": null,
                    "regDt": "2021-11-30 09:37:16",
                    "updId": "admin",
                    "updNm": null,
                    "updDt": "2022-06-14 13:41:44",
                    "itemId": "I0002",
                    "itemNm": "심박수",
                    "unit": "BPM",
                    "refFrom": 40,
                    "refTo": 110,
                    "delYn": "N"
                }
            ]
        }, {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})

    // 측정항목 상세조회
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/item/info',{
        'itemId': 'I0001',
    })
        .reply(200,{
            code:'00', message:'조회성공',
            result:
                {
                    "regId": "test",
                    "regNm": null,
                    "regDt": "2021-11-30 09:37:16",
                    "updId": "admin",
                    "updNm": null,
                    "updDt": "2022-06-14 13:40:02",
                    "itemId": "I0001",
                    "itemNm": "체온",
                    "unit": "℃",
                    "refFrom": 35,
                    "refTo": 38,
                    "delYn": "N"
                }

        }, {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})

        mockAxios.onPut(process.env.REACT_APP_BASE_URL + '/api/item/save')
            .reply(200,{
                code:'00', message:'조회성공',
                result:{
                    data:{
                        "regId": "test",
                        "regNm": null,
                        "regDt": "2021-11-30 09:37:16",
                        "updId": "admin",
                        "updNm": null,
                        "updDt": "2022-06-14 13:42:27",
                        "itemId": "I0003",
                        "itemNm": "산소포화도",
                        "unit": "%",
                        "refFrom": 94,
                        "refTo": 94,
                        "delYn": "N"
                    },
                    list:[
                        {
                            "regId": "test",
                            "regNm": null,
                            "regDt": "2021-11-30 09:37:16",
                            "updId": "admin",
                            "updNm": null,
                            "updDt": "2022-06-14 13:40:02",
                            "itemId": "I0001",
                            "itemNm": "체온",
                            "unit": "℃",
                            "refFrom": 35,
                            "refTo": 38,
                            "delYn": "N"
                        },
                        {
                            "regId": "test",
                            "regNm": null,
                            "regDt": "2021-11-30 09:37:16",
                            "updId": "admin",
                            "updNm": null,
                            "updDt": "2022-06-14 13:42:27",
                            "itemId": "I0003",
                            "itemNm": "산소포화도",
                            "unit": "%",
                            "refFrom": 94,
                            "refTo": 94,
                            "delYn": "N"
                        }
                    ]
                }
            }, {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})

    mockAxios.onPatch(process.env.REACT_APP_BASE_URL + '/api/item/save')
        .reply(200,{
            code:'00', message:'조회성공',
            result:{
                data:{
                    "regId": "test",
                    "regNm": null,
                    "regDt": "2021-11-30 09:37:16",
                    "updId": "admin",
                    "updNm": null,
                    "updDt": "2022-06-14 13:40:02",
                    "itemId": "I0001",
                    "itemNm": "체온",
                    "unit": "℃",
                    "refFrom": 40,
                    "refTo": 50,
                    "delYn": "N"
                },
                list:[
                    {
                        "regId": "test",
                        "regNm": null,
                        "regDt": "2021-11-30 09:37:16",
                        "updId": "admin",
                        "updNm": null,
                        "updDt": "2022-06-14 13:40:02",
                        "itemId": "I0001",
                        "itemNm": "체온",
                        "unit": "℃",
                        "refFrom": 40,
                        "refTo": 50,
                        "delYn": "N"
                    }
                ]
            }
        }, {'Content-Type': 'application/json', 'Authorization': `Bearer asdadasd`})
    mockAxios.onDelete(process.env.REACT_APP_BASE_URL + '/api/item/save')
            .reply(200,{
                "code": "00",
                "message": "삭제성공",
                "result": []
            })

});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

describe('Item page', ()=>{

    // 측정항목 페이지 Mount 및 useEffect[] 테스트
    test('Mount ItemPage And Effect is Succeed',async ()=>{
        const {getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })
    })

    // 측정항목 리스트 Enter && ESC 이벤트 테스트
    test('Select ItemList With keyEvent',async ()=>{
        const {getByRole,getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })

        const searchItemId = getByRole('searchItemId');
        searchItemId.focus();
        searchItemId.value='I0002';
        expect(searchItemId).toHaveValue('I0002');

        fireEvent.keyUp(searchItemId, {keyCode: 13})

        await waitFor(() => {
            expect(getByText("I0002")).toBeInTheDocument();
            expect(getByText("심박수")).toBeInTheDocument();
            expect(getByText("BPM")).toBeInTheDocument();
            expect(getByText("40")).toBeInTheDocument();
            expect(getByText("110")).toBeInTheDocument();
        })

        fireEvent.keyUp(searchItemId, {keyCode: 27})
        expect(searchItemId).toHaveValue('');
    })

    // 측정항목 상세 조회 테스트
    test('Get Item Detail',async ()=>{
        const { getByRole,getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })

        const testRow = getByText("I0001");

        fireEvent.click(testRow);

        const detailItemID = getByRole('detailItemID')
        const detailItemNM = getByRole('detailItemNM')
        const detailItemUnit = getByRole('detailItemUnit')
        const detailItemRF = getByRole('detailItemRF')
        const detailItemRT = getByRole('detailItemRT')

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('I0001')
            expect(detailItemNM).toHaveValue("체온")
            expect(detailItemUnit).toHaveValue("℃")
            expect(detailItemRF).toHaveValue("35")
            expect(detailItemRT).toHaveValue("38")
        })
    })

    // 측정항목 신규 버튼 테스트
    test('Item page Clear Button',async ()=>{
        const { getByRole,getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })

        const testRow = getByText("I0001");
        fireEvent.click(testRow);

        const detailItemID = getByRole('detailItemID')
        const detailItemNM = getByRole('detailItemNM')
        const detailItemUnit = getByRole('detailItemUnit')
        const detailItemRF = getByRole('detailItemRF')
        const detailItemRT = getByRole('detailItemRT')

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('I0001')
            expect(detailItemNM).toHaveValue("체온")
            expect(detailItemUnit).toHaveValue("℃")
            expect(detailItemRF).toHaveValue("35")
            expect(detailItemRT).toHaveValue("38")
        })

        const clearButton = getByText('신규');
        fireEvent.click(clearButton);

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('')
            expect(detailItemNM).toHaveValue("")
            expect(detailItemUnit).toHaveValue("")
            expect(detailItemRF).toHaveValue("")
            expect(detailItemRT).toHaveValue("")
        })
    })

    // 신규 측정항목 생성시 측정항목 명칭이 없을 경우
    test('Create Item with Null ItemNm',async ()=>{
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })
        const detailItemID = getByRole('detailItemID')
        const detailItemNM = getByRole('detailItemNM')

        detailItemID.value = ''
        detailItemNM.value = ""

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('')
            expect(detailItemNM).toHaveValue("")
        })

        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const alert = getByText('측정항목 명칭이 누락되었습니다.')
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);
        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument();
            expect(detailItemNM).toHaveFocus();
        })
    })

    // 신규 측정항목 생성시 측정항목 단위가 없을 경우
    test('Create Item with Null ItemUnit',async ()=>{
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })
        const detailItemID = getByRole('detailItemID');
        const detailItemNM = getByRole('detailItemNM');
        const detailItemUnit = getByRole('detailItemUnit');

        detailItemID.value = '';
        detailItemNM.value = "산소포화도";
        detailItemUnit.value = "";

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('')
            expect(detailItemNM).toHaveValue("산소포화도")
            expect(detailItemUnit).toHaveValue("")
        })

        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const alert = getByText('측정항목 단위가 누락되었습니다.')
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);
        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument();
            expect(detailItemUnit).toHaveFocus();
        })
    })

    // 신규 측정항목 생성시 측정항목 참고치 From 없을 경우
    test('Create Item with Null ItemRefFrom',async ()=>{
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })
        const detailItemID = getByRole('detailItemID');
        const detailItemNM = getByRole('detailItemNM');
        const detailItemUnit = getByRole('detailItemUnit');
        const detailItemRF = getByRole('detailItemRF');

        detailItemID.value = '';
        detailItemNM.value = "산소포화도";
        detailItemUnit.value = "%";

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('')
            expect(detailItemNM).toHaveValue("산소포화도")
            expect(detailItemUnit).toHaveValue("%")
            expect(detailItemRF).toHaveValue("")
        })

        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const alert = getByText('참고치가 누락되었습니다.')
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);
        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument();
            expect(detailItemRF).toHaveFocus();
        })
    })

    // 신규 측정항목 생성시 측정항목 참고치 To 없을 경우
    test('Create Item with Null ItemRefTo',async ()=>{
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })
        const detailItemID = getByRole('detailItemID');
        const detailItemNM = getByRole('detailItemNM');
        const detailItemUnit = getByRole('detailItemUnit');
        const detailItemRF = getByRole('detailItemRF');
        const detailItemRT = getByRole('detailItemRT');

        detailItemID.value = '';
        detailItemNM.value = "산소포화도";
        detailItemUnit.value = "%";
        detailItemRF.value = "55";

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('')
            expect(detailItemNM).toHaveValue("산소포화도")
            expect(detailItemUnit).toHaveValue("%")
            expect(detailItemRF).toHaveValue("55")
            expect(detailItemRT).toHaveValue("")
        })

        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const alert = getByText('참고치가 누락되었습니다.')
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);
        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument();
            expect(detailItemRT).toHaveFocus();
        })
    })

    // 신규 측정항목 생성
    test('Create Item',async ()=>{
        const {getByRole, getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })
        const detailItemID = getByRole('detailItemID')
        const detailItemNM = getByRole('detailItemNM')
        const detailItemUnit = getByRole('detailItemUnit')
        const detailItemRF = getByRole('detailItemRF')
        const detailItemRT = getByRole('detailItemRT')

        detailItemID.value = ''
        detailItemNM.value = "산소포화도"
        detailItemUnit.value = "%"
        detailItemRF.value = '94'
        detailItemRT.value = '94'

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('')
            expect(detailItemNM).toHaveValue("산소포화도")
            expect(detailItemUnit).toHaveValue("%")
            expect(detailItemRF).toHaveValue("94")
            expect(detailItemRT).toHaveValue("94")
        })

        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const createConfirm = getByText('[산소포화도]-신규 측정항목을 추가하시겠습니까?')
        expect(createConfirm).toBeInTheDocument();

        const createConfirmButton = getByText('확인');
        fireEvent.click(createConfirmButton);

        await waitFor(()=>{
            expect(createConfirm).not.toBeInTheDocument();
        })

        const alert = getByText('저장 되었습니다.')
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);
        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument();
            expect(detailItemID).toHaveValue('I0003')
        })

    })

    // 측정항목 수정
    test('Update Item ',async ()=>{
        const { getByRole,getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })

        const testRow = getByText("I0001");

        fireEvent.click(testRow);

        const detailItemID = getByRole('detailItemID')
        const detailItemNM = getByRole('detailItemNM')
        const detailItemUnit = getByRole('detailItemUnit')
        const detailItemRF = getByRole('detailItemRF')
        const detailItemRT = getByRole('detailItemRT')

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('I0001')
            expect(detailItemNM).toHaveValue("체온")
            expect(detailItemUnit).toHaveValue("℃")
            expect(detailItemRF).toHaveValue("35")
            expect(detailItemRT).toHaveValue("38")
        })

        detailItemRF.value=40
        detailItemRT.value=50

        expect(detailItemRF).toHaveValue("40")
        expect(detailItemRT).toHaveValue("50")

        const saveButton = getByText('저장');
        fireEvent.click(saveButton);

        const createConfirm = getByText('[체온]-해당 측정항목을 수정하시겠습니까?')
        expect(createConfirm).toBeInTheDocument();

        const createConfirmButton = getByText('확인');
        fireEvent.click(createConfirmButton);

        await waitFor(()=>{
            expect(createConfirm).not.toBeInTheDocument();
        })

        const alert = getByText('수정 되었습니다.')
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);
        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument();
        })

        const clearButton = getByText('신규');
        fireEvent.click(clearButton);

        await waitFor(()=>{
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("40")).toBeInTheDocument();
            expect(getByText("50")).toBeInTheDocument();
        })
    })

    // 측정항목 삭제
    test('Delete Item',async ()=>{
        const { getByRole,getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })
        const deleteButton = getByText('삭제')
        fireEvent.click(deleteButton)

        const isNotSelectedRowAlert = getByText('선택된 측정항목이 없습니다.');
        await waitFor(()=>{
            expect(isNotSelectedRowAlert).toBeInTheDocument()
        })
        const isNotSelectedRowAlertButton = getByText('확인');
        fireEvent.click(isNotSelectedRowAlertButton);

        await waitFor(()=>{
            expect(isNotSelectedRowAlert).not.toBeInTheDocument()
        })

        const testRow = getByText("I0001");
        fireEvent.click(testRow);

        const detailItemID = getByRole('detailItemID')
        const detailItemNM = getByRole('detailItemNM')
        const detailItemUnit = getByRole('detailItemUnit')
        const detailItemRF = getByRole('detailItemRF')
        const detailItemRT = getByRole('detailItemRT')

        await waitFor(()=>{
            expect(detailItemID).toHaveValue('I0001')
            expect(detailItemNM).toHaveValue("체온")
            expect(detailItemUnit).toHaveValue("℃")
            expect(detailItemRF).toHaveValue("35")
            expect(detailItemRT).toHaveValue("38")
        })
        fireEvent.click(deleteButton)

        const confirm = getByText('[체온]-선택한 측정항목을 삭제하시겠습니까?')
        await waitFor(()=>{
            expect(confirm).toBeInTheDocument();
        })

        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);
        await waitFor(()=>{
            expect(confirm).not.toBeInTheDocument();
        })
        const alert = getByText('삭제 되었습니다.')
        expect(alert).toBeInTheDocument();

        const alertButton = getByText('확인');
        fireEvent.click(alertButton);

        await waitFor(()=>{
            expect(alert).not.toBeInTheDocument();
            expect(()=>getByText("I0001")).toThrow();
            expect(()=>getByText("체온")).toThrow();
            expect(()=>getByText("℃")).toThrow();
            expect(()=>getByText("35")).toThrow();
            expect(()=>getByText("38")).toThrow();
        })
    })

    // 참고치From 최대 최소값 Validation
    test('Item RefFrom Validation',async ()=>{
        const {getByRole,getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })

        const detailItemRF = getByRole('detailItemRF');

        userEvent.type(detailItemRF,'32800')
        expect(detailItemRF.value).toBe('3280')

        detailItemRF.value = ''
        expect(detailItemRF.value).toBe('')

        userEvent.type(detailItemRF,'-32800')
        expect(detailItemRF.value).toBe('-3280')

        detailItemRF.value = ''
        expect(detailItemRF.value).toBe('')

        userEvent.type(detailItemRF,'-32767')
        expect(detailItemRF.value).toBe('-32767')

        detailItemRF.value = ''
        expect(detailItemRF.value).toBe('')

        userEvent.type(detailItemRF,'32766')
        expect(detailItemRF.value).toBe('32766')
    })

    // 참고치To 최대 최소값 Validation
    test('Item RefTo Validation',async ()=>{
        const {getByRole,getByText} = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Item/>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert/>
            </AlertStore>
            , container)

        await waitFor(() => {
            expect(getByText("I0001")).toBeInTheDocument();
            expect(getByText("체온")).toBeInTheDocument();
            expect(getByText("℃")).toBeInTheDocument();
            expect(getByText("35")).toBeInTheDocument();
            expect(getByText("38")).toBeInTheDocument();
        })

        const detailItemRT = getByRole('detailItemRT');

        userEvent.type(detailItemRT,'32800')
        expect(detailItemRT.value).toBe('3280')

        detailItemRT.value = ''
        expect(detailItemRT.value).toBe('')

        userEvent.type(detailItemRT,'-32800')
        expect(detailItemRT.value).toBe('-3280')

        detailItemRT.value = ''
        expect(detailItemRT.value).toBe('')

        userEvent.type(detailItemRT,'-32767')
        expect(detailItemRT.value).toBe('-32767')

        detailItemRT.value = ''
        expect(detailItemRT.value).toBe('')

        userEvent.type(detailItemRT,'32766')
        expect(detailItemRT.value).toBe('32766')
    })

})