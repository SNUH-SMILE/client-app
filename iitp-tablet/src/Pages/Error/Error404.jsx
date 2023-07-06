import React from 'react';

function Error404(props)
{
    const moveMainPage = () =>{
        window.location='/';
    }
    return (
        <>
            <h1>404</h1>
            <button onClick={moveMainPage}>메인페이지로 돌아가기</button>
        </>
    );
}

export default Error404;