import {render, waitFor} from "@testing-library/react";
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import React from "react";
import Header from "./Header";
import HcAlert from "../component/HCAlert";
import AlertStore from "../Providers/AlertContext";
import userEvent from "@testing-library/user-event";
import Login from "../Pages/Login/Login";
import MockAdapter from "axios-mock-adapter";
import AuthorizationAxios from "../Utils/AuthorizationAxios";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const mockAxios = new MockAdapter(AuthorizationAxios, {delayResponse: 0})
    mockAxios.onGet(process.env.REACT_APP_BASE_URL + '/api/userLogout')
        .reply(200,{
            code:'00',message:'로그아웃 성공'
        })

});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe('Header', () => {
    // 로그아웃 버튼 누른후 취소를 눌렀을때
    test('Clicked Logout and Cancel', async () => {
        const {getByText, getByRole} = render(
            <AlertStore>
                <BrowserRouter>
                    <Header setHide={() => null} interval={0} wrapper={{}}/>
                </BrowserRouter>
                <HcAlert/>
            </AlertStore>
            , container)
        expect(getByText('로그아웃')).toBeInTheDocument();

        const logOutButton = getByText('로그아웃');
        userEvent.click(logOutButton);

        await waitFor(() => expect(getByText('로그아웃 하시겠습니까?')).toBeInTheDocument())

        const confirm = getByText('로그아웃 하시겠습니까?');
        const cancelButton = getByText('취소');
        userEvent.click(cancelButton)
        await waitFor(() => expect(confirm).not.toBeInTheDocument())
    })
    // 로그아웃 버튼 누른후 확인을 눌렀을때
    test('Clicked Logout and Ok',async ()=>{
        const {getByText} = render(
            <AlertStore>
                <BrowserRouter>
                    <Header setHide={()=>null} interval={0} wrapper={{}}/>
                    <Routes>
                        <Route exact path={'/'} element={<Login setTokenInterval={()=>null}/>}/>
                    </Routes>
                </BrowserRouter>
                <HcAlert/>
            </AlertStore>
            , container)
        expect(getByText('로그아웃')).toBeInTheDocument();

        const logOutButton = getByText('로그아웃');
        userEvent.click(logOutButton);

        await waitFor(()=>expect(getByText('로그아웃 하시겠습니까?')).toBeInTheDocument())

        const confirm = getByText('로그아웃 하시겠습니까?');
        const confirmButton = getByText('확인');
        userEvent.click(confirmButton);

        await waitFor(()=>expect(confirm).not.toBeInTheDocument())
        await waitFor(()=>expect(getByText('아이디')).toBeInTheDocument())
        await waitFor(()=>expect(getByText('비밀번호')).toBeInTheDocument())
        await waitFor(()=>expect(localStorage.getItem('Authorization')).toBe('null'))
        await waitFor(()=>expect(localStorage.getItem('admissionId')).toBe('null'))
    })


})