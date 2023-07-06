import Login from "./Login";
import AlertStore from "../../Providers/AlertContext";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {renderHook} from "@testing-library/react-hooks";
import HcAlert from "../../component/HCAlert";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import TreatmentCenter from "../Common/TreatmentCenter";
import TitleStore from "../../Providers/TitleContext";
import Layouts from "../../Layouts/Layouts";
import UseSetPageTitle from "../../Utils/UseSetPageTitle";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe("Login Page",()=>{

    // 아이디가 공백일때
    test('Id Input is Null',  () => {
        const{ getByPlaceholderText, getByText } = render(
            <AlertStore>
                <BrowserRouter>
                    <Login setTokenInterval={()=> null}/>
                </BrowserRouter>
                <HcAlert />
            </AlertStore>
            ,container)

        // 아이디 Input의 Value 가 '' 인지 체크
        const id = getByPlaceholderText('ID');
        expect(id.value).toBe('');

        // 로그인 버튼클릭
        const loginButton = getByText('로그인');
        fireEvent.click(loginButton);

        // "아이디가 공백입니다." 문구가 화면에 출력되었는지 체크
        const alert = getByText('아이디가 공백입니다.');
        expect(alert).toBeInTheDocument();

        // Alert 확인 버튼 클릭 후 "아이디가 공백입니다." 문구가 화면에서 사라졌는지 체크
        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);
        expect(alert).not.toBeInTheDocument();
    })

    // 패스워드가 공백일때
    test('Password Input is Null',  () => {

        const{ getByPlaceholderText, getByText } = render(
            <AlertStore>
                <BrowserRouter>
                    <Login setTokenInterval={()=> null}/>
                </BrowserRouter>
                <HcAlert />
            </AlertStore>
            ,container)

        // 아이디가 공백인지 먼저 체크하기 때문에 아이디 Value 에 test 삽입
        const id = getByPlaceholderText('ID');
        id.value = 'test'

        // 패스워드 Input의 Value 가 '' 인지 체크
        const password = getByPlaceholderText('Password');
        expect(password.value).toBe('');

        // 로그인 버튼 클릭
        const loginButton = getByText('로그인');
        fireEvent.click(loginButton);

        // "비밀번호가 공백입니다." 문구가 화면에 출력되었는지 체크
        const alert = getByText('비밀번호가 공백입니다.');
        expect(alert).toBeInTheDocument();

        // Alert 확인 버튼 클릭 후 "비밀번호가 공백입니다." 문구가 화면에서 사라졌는지 체크
        const confirmButton = getByText('확인');
        fireEvent.click(confirmButton);
        expect(alert).not.toBeInTheDocument();
    })

    // 유효하지 않은 아이디로 로그인 요청을 했을 때
    test('Login request is failed with invalid Id',  async () => {
        const{ getByPlaceholderText, getByText } = render(
            <AlertStore>
                <BrowserRouter>
                    <Login setTokenInterval={()=> null}/>
                </BrowserRouter>
                <HcAlert />
            </AlertStore>
            ,container)


        // 아이디 Value 를 'Invalid Id' 로 변경
        const id = getByPlaceholderText('ID');
        id.value = 'Invalid Id'

        // 패스워드 Value 를 'Password'  로 변경
        const password = getByPlaceholderText('Password');
        password.value = 'Password'

        // Axios-mock-adaptor 사용 및 response 데이터 정의
        const mockAxios = new MockAdapter(axios, {delayResponse: 1000})
        mockAxios.onPost(process.env.REACT_APP_BASE_URL+'/api/userLogin')
            .reply(200,
                {code:'15',message:'사용자 정보가 존재하지 않습니다', result: null}
                ,{'Content-Type': 'application/json'})

        // 로그인 버튼 클릭
        const loginButton = getByText('로그인');
        fireEvent.click(loginButton);

        // Api 호출이 완료될때 까지 기다려야 해서 WaitFor 작성
        // WaitFor 의 경우 기본 Timeout 값이 1000ms 따라서 MockAdapter 의 delayResponse 값을 1000 이상으로 설정시 Test 가 실패함
        await waitFor(() =>{
            // "사용자 정보가 존재하지 않습니다" 문구가 화면에 출력되었는지 체크
            const alert = getByText('사용자 정보가 존재하지 않습니다');
            expect(alert).toBeInTheDocument();

            // Alert 확인 버튼 클릭 후 "사용자 정보가 존재하지 않습니다" 문구가 화면에서 사라졌는지 체크
            const confirmButton = getByText('확인');
            fireEvent.click(confirmButton);
            expect(alert).not.toBeInTheDocument();
        })
    })

    // 유효하지 않은 패스워드로 로그인 요청을 했을 때
    test('Login request is failed with invalid Password',  async () => {
        const{ getByPlaceholderText, getByText } = render(
            <AlertStore>
                <BrowserRouter>
                    <Login setTokenInterval={()=> null}/>
                </BrowserRouter>
                <HcAlert />
            </AlertStore>
            ,container)


        // 아이디 Value 에 'ID' 삽입
        const id = getByPlaceholderText('ID');
        id.value = 'ID'

        // 패스워드 Value 에 'Invalid Password' 삽입
        const password = getByPlaceholderText('Password');
        password.value = 'Invalid Password'

        // Axios-mock-adaptor 사용 및 response 데이터 정의
        const mockAxios = new MockAdapter(axios, {delayResponse: 1000})
        mockAxios.onPost(process.env.REACT_APP_BASE_URL+'/api/userLogin')
            .reply(200,
                {code:'10',message:'비밀번호가 일치하지 않습니다', result: null}
                ,{'Content-Type': 'application/json'})


        // 로그인 버튼 클릭
        const loginButton = getByText('로그인');
        fireEvent.click(loginButton);

        // Api 호출이 완료될때 까지 기다려야 해서 WaitFor 작성
        // WaitFor 의 경우 기본 Timeout 값이 1000ms 따라서 MockAdapter 의 delayResponse 값을 1000 이상으로 설정시 Test 가 실패함
        await waitFor(() =>{
            // "비밀번호가 일치하지 않습니다" 문구가 화면에 출력되었는지 체크
            const alert = getByText('비밀번호가 일치하지 않습니다');
            expect(alert).toBeInTheDocument();

            // Alert 확인 버튼 클릭 후 "비밀번호가 일치하지 않습니다" 문구가 화면에서 사라졌는지 체크
            const confirmButton = getByText('확인');
            fireEvent.click(confirmButton);
            expect(alert).not.toBeInTheDocument();
        })

    })
    test('Login Success',async ()=>{



        const{ getByPlaceholderText, getByText } = render(
            <AlertStore>
                <TitleStore>
                    <BrowserRouter>
                        <Routes>
                            <Route exact path={'/'} element={<Login setTokenInterval={()=> null}/>}/>
                            <Route element={<Layouts interval={0} setHide={()=> null}/>}>
                                <Route exact path={'/treatmentCenter'} element={<TreatmentCenter/>}/>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </TitleStore>
                <HcAlert />
            </AlertStore>
            ,container)
        // 아이디 Value 를 'Invalid Id' 로 변경
        const id = getByPlaceholderText('ID');
        id.value = 'Invalid Id'

        // 패스워드 Value 를 'Password'  로 변경
        const password = getByPlaceholderText('Password');
        password.value = 'Password'

        // Axios-mock-adaptor 사용 및 response 데이터 정의
        const mockAxios = new MockAdapter(axios, {delayResponse: 1000})
        mockAxios.onPost(process.env.REACT_APP_BASE_URL+'/api/userLogin')
            .reply(200,
                {code:'00',message:'로그인 성공', result: null}
                ,{'Content-Type': 'application/json'})

        // 로그인 버튼 클릭
        const loginButton = getByText('로그인');
        fireEvent.click(loginButton);
        renderHook(() => UseSetPageTitle())
        // /treatmentCenter(생활치료센터)로 이동하였는지 체크
        await waitFor(()=>{
            expect(screen.getByRole('link',{current:'page'})).toHaveTextContent('생활치료센터') // 사이드메뉴에 생활치료센터 메뉴가 active 표시가 되었는지 체크
            expect(screen.getByRole('pageTitle')).toHaveTextContent('생활치료센터 관리'); //헤더에 생황치료센터 관리 글자가 표시되었는지 체크
            expect(screen.getByText('생활치료센터 리스트')).toBeInTheDocument(); // 화면에 생황치료센터 리스트 글자가 표시되었는지 체크
        })
    })
})
