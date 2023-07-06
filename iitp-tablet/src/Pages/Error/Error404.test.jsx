import {wait} from "@testing-library/user-event/dist/utils";
import {render} from "@testing-library/react";
import Error404 from "./Error404";
import userEvent from "@testing-library/user-event";

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe('Error',()=>{
    test('Move to Login page',async ()=>{
        const{getByText} = render(<Error404/>,container)

        const move = getByText('메인페이지로 돌아가기');
        userEvent.click(move);

        await wait(()=>expect(getByText('아이디')).toBeInTheDocument());
    })
})