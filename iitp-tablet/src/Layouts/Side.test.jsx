import {fireEvent, render, waitFor} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import Side from "./Side";
import userEvent from "@testing-library/user-event";
import {renderHook} from "@testing-library/react-hooks";

let container;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe('SideMenu',()=>{

    // 상위메뉴 Collapse 열기
    test('menu Collapse Open',async ()=>{
        const {getByText,getByRole} = render(
            <BrowserRouter>
                <Side/>
            </BrowserRouter>
            , container)
        expect(getByText('공통관리')).toBeInTheDocument();

        const collapse0 = getByRole('collapse0');
        expect(collapse0).toHaveClass('collapse')

        const parentMenu = getByText('공통관리').closest('a');
        expect(parentMenu).toHaveAttribute('aria-expanded','false')
        fireEvent.click(parentMenu)

        await waitFor(()=>expect(parentMenu).toHaveAttribute('aria-expanded','true'))
        await waitFor(()=>expect(collapse0).toHaveClass('collapse show'))
    })

    // 상위메뉴 Collapse 닫기
    test('menu Collapse Close',async ()=>{
        const {getByText,getByRole} = render(
            <BrowserRouter>
                <Side/>
            </BrowserRouter>
            , container)
        expect(getByText('공통관리')).toBeInTheDocument();

        const collapse0 = getByRole('collapse0');
        expect(collapse0).toHaveClass('collapse')

        const parentMenu = getByText('공통관리').closest('a');
        expect(parentMenu).toHaveAttribute('aria-expanded','false')
        fireEvent.click(parentMenu)

        await waitFor(()=>expect(parentMenu).toHaveAttribute('aria-expanded','true'))
        await waitFor(()=>expect(collapse0).toHaveClass('collapse show'))

        fireEvent.click(parentMenu)

        await waitFor(()=>expect(parentMenu).toHaveAttribute('aria-expanded','false'))
        await waitFor(()=>expect(collapse0).toHaveClass('collapse'))
    })
})


