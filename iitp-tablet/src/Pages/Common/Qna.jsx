import React, {useCallback, useEffect, useRef, useState} from 'react';
import QnaReplyInsertModal from "../../component/QnaReplyInsertModal";
import Pagination from "../../component/Pagination";
import {getLonginUserInfo} from "../../Apis/CommonCode";
import ReactTable from "../../component/ReactTable";
import QnaApi from "../../Apis/QnaApi";
import useAlert from "../../Utils/UseAlert";
import UseSetPageTitle from "../../Utils/UseSetPageTitle";

function Qna() {
    UseSetPageTitle('문의사항')
    const {alert,confirm} = useAlert();
    const [qnaTableData, setQnaTableData] = useState([])
    const [paginationObj, setPaginationObj] = useState({currentPageNo: 1, pageSize: 10, recordCountPerPage: 15})
    const [totalPageCount, setTotalPageCount] = useState(null);
    const [userTreatmentCenter,setUserTreatmentCenter] = useState([]);
    const centerId= useRef()
    const replyYn= useRef()
    const searchGb= useRef()
    const searchText= useRef()

    const qnaApi = new QnaApi(centerId,replyYn,searchGb,searchText,paginationObj);
    const handledSearchRequirement = (e) => {
        if (e.keyCode === 13 || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') {
            if (paginationObj.currentPageNo === 1) {
                selectQnaListByCenter();
            } else {
                setPaginationObj({currentPageNo: 1, pageSize: 10, recordCountPerPage: 15})
            }
        }
    }

    const setPaginationAndQnaTableData = (data) =>{
        setPaginationObj((prevState)=>({
            ...prevState,
            prevPaginationExists:data.result.paginationInfoVO.prevPaginationExists,
            nextPaginationExists:data.result.paginationInfoVO.nextPaginationExists,
            firstPageNoOnPageList:data.result.paginationInfoVO.firstPageNoOnPageList,
            lastPageNoOnPageList :data.result.paginationInfoVO.lastPageNoOnPageList,
        }))
        setTotalPageCount(data.result.paginationInfoVO.totalPageCount)
        setQnaTableData(data.result.qnaVOList )
    }

    const selectQnaListByCenter = () =>{
        getLonginUserInfo().then(({data})=> setUserTreatmentCenter(data.result.userTreatmentCenterVOList))
            .catch(()=>console.log('ERROR getLonginUserInfo In Qna'))
            .then(()=> {
                qnaApi.select().then(({data}) => setPaginationAndQnaTableData(data))
            });
    }

    useEffect(()=>{
        selectQnaListByCenter();
    },[paginationObj.currentPageNo]);

    // QNA React-Table Table Header
    const qnaTableColumn = [
        {Header: '등록일', accessor: 'regDt', styleClassName: 'dt'},
        {Header: '문의유형', accessor: 'questionTypeNm', styleClassName: 'type'},
        {Header: '문의내역', accessor: 'questionContent', styleClassName: 'content text-start'},
        {Header: '환자명', accessor: 'patientNm', styleClassName: 'pNm'},
        {Header: '답변자', accessor: 'replyNm', styleClassName: 'rNm'},
        {Header: '답변', accessor: 'replyYn', styleClassName: 'rYn'},
    ]

    // Qna 모달
    const [qnaModalObj,setQnaModalObj] = useState({show:false,data:{}});
    // Qna 모달 열기 (admissionId 로 api 요청 하려고 인자로 받음)
    const handledQnaModal = (rest,{questionSeq}) =>{
        qnaApi.detail(questionSeq).then(({data}) => {
            if(data.code==='00'){
                setQnaModalObj(()=>({show: true, data: {...data.result}}))
            }
            else{
                alert(data.message);
            }
        })
    }
    // Qna 모달 닫기
    const handledCloseQnaModal = useCallback(() =>{
        setQnaModalObj(()=>({show: false, data:{}}))
    },[])

    // Qna 답변 저장
    const saveQnaReplyContent = useCallback(async (questionSeq,replyContent) => {
        if(replyContent.replaceAll(' ','').length===0){
            alert('답변내용이 공백입니다.')
        }
        else {
            const confirmStatus= await confirm('답변을 저장하시겠습니까?');
            if(confirmStatus){
                qnaApi.save(questionSeq,replyContent)
                    .then(({data}) => {
                        if(data.code==='00'){
                            alert(data.message)
                            setPaginationAndQnaTableData(data)
                        }
                        else{
                            alert(data.message)
                        }
                    })
                    .finally(()=>handledCloseQnaModal());
            }
        }
    },[])
    // Qna 답변삭제
    const deleteQnaReplyContent = useCallback(async (questionSeq) => {
        const confirmStatus= await confirm('답변을 삭제하시겠습니까?');
        if(confirmStatus){
            qnaApi.delete(questionSeq)
                .then(({data}) => {
                    if(data.code==='00'){
                        alert(data.message)
                        setPaginationAndQnaTableData(data)
                    }
                    else{
                        alert(data.message)
                    }
                })
                .finally(()=>handledCloseQnaModal());
        }
    },[])



    return (
        <>
            <main className="flex_layout_1row">
                <div className="row">
                    <div className="col col-lg-12">
                        <div className="card indiv">
                            <div className="card-content">
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <form onSubmit={(e)=>e.preventDefault()}>
                                            <div className="d-flex">
                                                <div className="tbl_title">문의사항 리스트</div>
                                                <div className="me-3 d-flex">
                                                    <span className="stit">환자위치</span>
                                                    <select className="form-select" ref={centerId} defaultValue={''} onChange={(e)=>handledSearchRequirement(e)}>
                                                        <option value={''}>전체</option>
                                                        {userTreatmentCenter&&userTreatmentCenter.map(value =>
                                                            <option key={value.centerId} value={value.centerId}>
                                                                {value.centerNm }
                                                            </option>
                                                        )}
                                                        <option value={'9999'}>자택격리자</option>
                                                    </select>
                                                </div>
                                                <div className="me-3 d-flex">
                                                    <span className="stit">답변여부</span>
                                                    <select className="form-select" ref={replyYn} defaultValue={''} onChange={(e)=>handledSearchRequirement(e)}>
                                                        <option value={''}>전체</option>
                                                        <option value={'Y'}>답변완료</option>
                                                        <option value={'N'}>미답변</option>
                                                    </select>
                                                </div>
                                                <div className="me-3 d-flex" >
                                                    <select className="form-select" ref={searchGb} defaultValue={'patientId'} onChange={(e)=>handledSearchRequirement(e)}>
                                                        <option value={'patientId'}>환자ID</option>
                                                        <option value={'patientNm'}>환자명</option>
                                                        <option value={'questionContent'}>문의내역</option>
                                                    </select>
                                                </div>
                                                <div className="me-1 d-flex">
                                                    <input className="form-control w160" type="text"
                                                           role={'searchInput'}
                                                           ref={searchText}
                                                           defaultValue={''}
                                                           onKeyUp={(e)=>handledSearchRequirement(e)}/>
                                                </div>
                                                <div className="ms-auto">
                                                    <div className="btn_wrap d-flex">
                                                        <button type="button" className="btn btn-gray" onClick={(e)=>handledSearchRequirement(e)}>검색</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="table-body">
                                        <ReactTable tableHeader={qnaTableColumn} tableBody={qnaTableData} customTableStyle={'table table-striped table-hover text-expert table-Qna'} trOnclick={handledQnaModal}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*페이징 start*/}
                <Pagination paginationObj={paginationObj} totalPageCount={totalPageCount}
                            handledList={setPaginationObj}/>
                {/*페이징 end */}

            </main>
            <QnaReplyInsertModal qnaModalObj={qnaModalObj} handledClose={handledCloseQnaModal} onSave={saveQnaReplyContent} onDelete={deleteQnaReplyContent}/>
        </>
);
}

export default Qna;