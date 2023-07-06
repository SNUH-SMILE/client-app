import MockAdapter from "axios-mock-adapter";
import App from "./App";
import {render, waitFor} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import HcAlert from "./component/HCAlert";
import AlertStore from "./Providers/AlertContext";
import Axios from "axios";
import TokenMethod from "./Apis/Token";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(Axios, {delayResponse: 0})
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/tokenStatus',{'token':'SUCCESS'})
        .reply(200,{
            rememberYn:"N",
            token:'SUCCESS',
            tokenStatus:"00"
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/tokenReissue',{'token':'SUCCESS'})
        .reply(200,{
            code:"00",
            result:'ReSUCCESS',
            message:"신규 토큰 발급 성공"
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/tokenStatus',{'token':'ExpireN'})
        .reply(200,{
            rememberYn:"N",
            token:'Expire',
            tokenStatus:"80"
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/tokenStatus',{'token':'ExpireY'})
        .reply(200,{
            rememberYn:"Y",
            token:'Expire',
            tokenStatus:"80"
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/tokenReissue',{'token':'ExpireY'})
        .reply(200,{
            code:"00",
            result:'ReSUCCESS',
            message:"신규 토큰 발급 성공"
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/tokenStatus',{'token':'IntervalSUCCESS'})
        .reply(200,{
            rememberYn:"N",
            token:'IntervalSUCCESS',
            tokenStatus:"00"
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/tokenReissue',{'token':'IntervalSUCCESS'})
        .reply(200,{
            code:"00",
            result:'IntervalSUCCESS',
            message:"신규 토큰 발급 성공"
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/tokenStatus',{'token':'Failed'})
        .reply(200,{
            rememberYn:"N",
            token:'Failed',
            tokenStatus:"999"
        })
    mockAxios.onPost(process.env.REACT_APP_BASE_URL + '/api/tokenStatus',{'token':'Error'})
        .reply(400)
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
    localStorage.removeItem('Authorization');

});


describe('App', () => {

    // 로컬스토리지에 토큰이 없을때
    test('AuthorizationToken is Null in LocalStorage', () => {
        localStorage.setItem('Authorization', 'null');
        const {getByText}=render(
            <AlertStore>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
                <HcAlert/>
            </AlertStore>)
        expect(getByText('아이디')).toBeInTheDocument();
    })

    // 로컬스토리지에 잘못된 토큰이 있을때
    test('FailedAuthorizationToken is in LocalStorage', async () => {
        localStorage.setItem('Authorization', 'Failed');
        const {getByText}=render(
            <AlertStore>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
                <HcAlert/>
            </AlertStore>)
        await waitFor(()=>expect(getByText('아이디')).toBeInTheDocument());
    })

    // 토큰 요청이 실패했을때
    test('ErrorAuthorizationToken is in LocalStorage', async () => {
        localStorage.setItem('Authorization', 'Error');
        const {getByText}=render(
            <AlertStore>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
                <HcAlert/>
            </AlertStore>)
        await waitFor(()=>expect(getByText('아이디')).toBeInTheDocument());
    })

    // 로컬스토리지에 정상적인 토큰이 있을때
    test('AuthorizationToken is in LocalStorage', async () => {
        localStorage.setItem('Authorization', 'SUCCESS');
        const {getByText}=render(
            <AlertStore>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
                <HcAlert/>
            </AlertStore>)
        await waitFor(()=> expect(getByText('생활치료센터 리스트')).toBeInTheDocument());
    })

    // 로컬스토리지에 만료된 토큰이 있고 리멤버미가 N 일때
    test('ExpireAuthorizationToken is in LocalStorage And RememberMe is N', async () => {
        localStorage.setItem('Authorization', 'ExpireN');
        const {getByText}=render(
            <AlertStore>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
                <HcAlert/>
            </AlertStore>)
        await waitFor(()=> expect(getByText('아이디')).toBeInTheDocument());
    })

    // 로컬스토리지에 만료된 토큰이 있고 리멤버미가 Y 일때
    test('ExpireAuthorizationToken is in LocalStorage And RememberMe is Y', async () => {
        localStorage.setItem('Authorization', 'ExpireY');
        const {getByText}=render(
            <AlertStore>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
                <HcAlert/>
            </AlertStore>)
        await waitFor(()=> expect(getByText('생활치료센터 리스트')).toBeInTheDocument());
    })

    // REACT_APP_AUTHORIZATION_REISSUE_TIME 시간 마다 토큰 재요청 하는지
    test('Token Reissue Interval',async ()=>{
        jest.useFakeTimers()

        localStorage.setItem('Authorization', 'IntervalSUCCESS');
        const {getByText}=render(
            <AlertStore>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
                <HcAlert/>
            </AlertStore>)
        await waitFor(()=> expect(getByText('생활치료센터 리스트')).toBeInTheDocument());
        const reissue =jest.spyOn(TokenMethod,'Reissue');

        jest.advanceTimersByTime(parseInt(process.env.REACT_APP_AUTHORIZATION_REISSUE_TIME))
        expect(reissue).toBeCalledTimes(1)

        jest.advanceTimersByTime(parseInt(process.env.REACT_APP_AUTHORIZATION_REISSUE_TIME))
        expect(reissue).toBeCalledTimes(2)

        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

})