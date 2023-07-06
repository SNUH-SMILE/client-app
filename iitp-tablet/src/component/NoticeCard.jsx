import React, {useEffect} from 'react';

function NoticeCard({data}) {
    const { noticeSeq, notice, regNm, regDt } = data;
    useEffect(()=>{
        document.querySelector('#notice'+noticeSeq).focus()
    },[])
    return (
        <li tabIndex={-1} id={'notice'+noticeSeq}>
            <div className="msg">
                {notice}
            </div>
            <div className="from d-flex">
                <span>{regNm}</span>
                <span className="ms-auto">{regDt}</span>
            </div>
        </li>
    );
}

export default NoticeCard;