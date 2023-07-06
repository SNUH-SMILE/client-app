import React, { useContext, useEffect, useRef, useState,createRef} from 'react';
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import AdmissionDetailApi from "../../Apis/AdmissionDetailApi";
import {TitleContext} from "../../Providers/TitleContext";
import NoticeCard from "../../component/NoticeCard";
import RecordCard from "../../component/RecordCard";
import useAlert from "../../Utils/UseAlert";
import {Nav} from "react-bootstrap";
import InterviewList from "../../component/InterviewList";
import {element} from "prop-types";
import getToday from "../../Utils/common";

function AdmissionDetail() {
    UseSetPageTitle('환자상세','Detail')

    const{alert,confirm} = useAlert();
    const {setDashBoardData} = useContext(TitleContext);
    const val =['val01','val02','val03','val04','val05','val06','val07','val08','val09','val10','val11','val12',];
    const admissionDetailApi=new AdmissionDetailApi(localStorage.getItem('admissionId'));
    const [noticeList,setNoticeList] = useState([])
    const [recordList,setRecordList] = useState([])
    const [isRecord, setIsRecord] = useState();
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth();
    const day = today.getDate();
    const date = useState();
    const [medicalSeq,setMedicalSeq] = useState();
    const todayInput =useRef();
    useEffect(()=>{
        todayInput.current.value = getToday();
        collapseNoticeArea();
        getDrugList();
        document.getElementById('scrollbar').scrollTo(0,0);
        getInterviewList();
        setTabCode(0);
        admissionDetailApi.select().then(({data}) => {
            setDashBoardData(data.result.headerVO);
            setNoticeList(data.result.noticeVOList);
            setRecordList(data.result.recordVOList);
          //  console.log(data);
        });
    },[])





    const [interviews, setInterviews] = useState();
    const [noticeText,setNoticeText] = useState('');

    const maxLen = value => value.length <= 500;
    const maxLength = (e,validator,type)=>{
        const {value} = e.target;
        let willUpdate = true;
        if (typeof validator === "function") {
            willUpdate = validator(value);
        }
        if (willUpdate) {
            if(type =='record'){
                setRecord(value);
            }else{
                setNoticeText(value);
            }
        }
    };

    const getInterviewList = async () =>{
        admissionDetailApi.getInterviewList().then(({data}) => {
            data.result.forEach(function (data){
                data.countBoolen = false
                data.interviewContents.forEach(function (test){
                    if(test.interCategori.substring(0,1) == '2'){
                        data.countBoolen = true;
                    }
                })
            })
            setInterviews(data.result);
        })
    }
    const [drugList, setDrugList] = useState();
    const getDrugList = async () =>{
        admissionDetailApi.drugSelect().then(({data}) => {
            setDrugList(data.result);
            //console.log(data.result)

        });
    }
    const addNotice = async () => {
        if(!noticeText){
            alert('알림 내용이 공백입니다.')
        }else{
            const confirmStatus = await confirm('알림을 생성하시겠습니까?');
            if(confirmStatus){
                admissionDetailApi.addNotice(noticeText,date).then(({data}) => {
                    if(data.code==='00'){
                        alert(data.message);
                        setNoticeList(data.result);
                        setNoticeText('');
                    }
                    else {
                        alert(data.message);
                    }
                });
            }
        }
    }

    const [record, setRecord] = useState('');
    const recordSave = async () => {
        let date = year + '-' + (("00"+month.toString()).slice(-2)) + '-' +(("00"+day.toString()).slice(-2));

        if (!record) {
            alert('작성 내용이 공백입니다.')
        } else if (isRecord){
            const confirmStatus = await confirm('기록을 수정하시겠습니까?');
            if (confirmStatus) {

                admissionDetailApi.recordUpdate(medicalSeq,record,todayInput.current.value).then(({data}) => {
                    if (data.code === '00') {
                        alert(data.message);
                        setRecordList(data.result);
                        setRecord('');
                    } else {
                        alert(data.message);
                    }
                });
            }
        }
        else if(!isRecord && record) {
            const confirmStatus = await confirm('기록을 생성하시겠습니까?');
            if (confirmStatus) {

                admissionDetailApi.addRecord(record,todayInput.current.value ).then(({data}) => {
                    if (data.code === '00') {
                        alert(data.message);
                        setRecordList(data.result);
                        setRecord('');
                    } else {
                        alert(data.message);
                    }
                });
            }
        }

    }
    const recordReset = () =>{
        todayInput.current.value = getToday();
        setRecord('');
        setIsRecord(false);
    }
    const recordSelect =(data, idx, date, recordIdx) =>{
        setMedicalSeq(recordIdx);
        todayInput.current.value=date;
        setRecord(data)
        setIsRecord(true)
    }
    const noticeArea = useRef();
    const collapseNoticeArea = ()=>{
        noticeArea.current.classList.toggle('toggled')
    }
    const [tabCode, setTabCode] = useState();
    const nextLevel=(eventKey) =>{
        setTabCode(eventKey);

    }

    return (
        <main className="flex_layout_dashboard" style={{padding:"8px"}}>
            <div className="row history-alarm" ref={noticeArea}>
                <div className="col">
                    <div className="card indiv tab3">
                        <div className="header d-flex">
                            <Nav className="" variant="pills" defaultActiveKey="0">
                                <Nav.Item style={{marginLeft:"10px"}}>
                                    <Nav.Link eventKey="0" onClick={()=>nextLevel(0)}>
                                        자가보고 증상
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item style={{marginLeft:"10px"}}>
                                    <Nav.Link eventKey="1" onClick={()=>nextLevel(1)}>
                                        정신건강 설문
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item style={{marginLeft:"10px"}}>
                                    <Nav.Link eventKey="2" onClick={()=>nextLevel(2)}>
                                        투약내역
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                        <div className="body">
                            <div className="tab-content" id="pills-tabContent">
                                <div className="scrollbar" id="scrollbar" role={'recordList'} style={{overflow:"auto",height:"54vh"}}>
                                    {tabCode == 0 ?
                                        <div>
                                            {interviews && interviews.map((it,idx)=>(
                                                <InterviewList key={it.interviewSeq+'1'} interviewData={it} idx={idx} type='1'>
                                                </InterviewList>
                                            ))}
                                            </div>
                                        : null
                                    }
                                    {tabCode == 1 ?
                                        <div>
                                            {interviews && interviews.filter(id => id.countBoolen).map((it,idx)=>
                                                {
                                                    return(
                                                        <InterviewList key={it.interviewSeq + '2'} interviewData={it}
                                                                       idx={idx} type='2'>
                                                        </InterviewList>
                                                    )
                                                }
                                            )}
                                        </div>
                                        : null
                                    }
                                    {tabCode == 2 ?
                                        <>
                                        {drugList && drugList.filter(
                                            (drug, index, callback) =>
                                                index ===  callback.findIndex((find) => find.drugDoseVO.length > 0)
                                        ).map((drug1) => (
                                            <div className="interview">
                                                <div className="interviewHeader"> <h3>{drug1.admissionDate && drug1.admissionDate.substring(0,4)}년{drug1.admissionDate && drug1.admissionDate.substring(4,6)}월{drug1.admissionDate && drug1.admissionDate.substring(6,8)}일</h3></div>
                                                <table style={{ width: '100%' }}>
                                                    <colgroup>
                                                        <col style={{ width: '30%' }} />
                                                        <col style={{ width: '30%' }} />
                                                        <col style={{ width: 'auto' }} />
                                                    </colgroup>
                                                    <tbody>
                                                    {drug1.drugDoseVO && drug1.drugDoseVO.map((drug2)=> (
                                                    <tr>
                                                        <td> {drug2.noticeName}</td>
                                                        <td>{drug2.noticeTime && drug2.noticeTime.substring(0,2)}: {drug2.noticeTime && drug2.noticeTime.substring(2,4)}</td>
                                                        {drug2.drugDoseSeq > 0 ?<td>복용완료</td> : <td>복용 미완료</td>}

                                                    </tr>
                                                    ))
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                        </>

                                            /*<>
                                            {drugList && drugList.filter(
                                                (drug, index, callback) =>
                                                    index ===  callback.findIndex((find) => find.noticeDd == null ?find.noticeStartDate === drug.noticeStartDate :find.noticeDd === drug.noticeDd )
                                               )
                                                .map((drug1) => (
                                                    <>
                                                    <div className="interview">
                                                        <div className="interviewHeader"> <h3>{drug1.noticeStartDate && drug1.noticeStartDate.substring(0,4)}년{drug1.noticeStartDate && drug1.noticeStartDate.substring(4,6)}월{drug1.noticeStartDate && drug1.noticeStartDate.substring(6,8)}일</h3></div>
                                                      <table style={{ width: '100%' }}>
                                                          <colgroup>
                                                              <col style={{ width: '30%' }} />
                                                              <col style={{ width: '30%' }} />
                                                              <col style={{ width: 'auto' }} />
                                                          </colgroup>
                                                          <tbody>
                                                            {drugList.filter(
                                                                ( drug2, idx, callback) =>
                                                                 drug1.noticeStartDate == drug2.noticeStartDate
                                                                ).map((drug3)=>(
                                                                    <tr>
                                                                        <td>{drug3.noticeName}</td>
                                                                        <td>{drug1.noticeTime && drug3.noticeTime.substring(0,2)}: {drug1.noticeTime && drug3.noticeTime.substring(2,4)}</td>
                                                                        {drug3.drugDoseSeq != null ?<td>복용완료</td> : <td>복용 미완료</td>}
                                                                    </tr>
                                                               ))}
                                                          </tbody>
                                                      </table>
                                                    </div>
                                                    </>
                                            ))}
                                           </>*/
                                        : null
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="card indiv history">
                        <div className="header d-flex">
                            <h5 className="title">기록</h5>
                        </div>
                        <ul className="scrollbar" role={'recordList'}>
                            {recordList && recordList.map((value,idx) => {
                                return(
                                    <RecordCard data={value} key={idx} idx={idx} record={record} recordSelect={recordSelect}/>
                                )
                            })}
                        </ul>
                        <div className="footer">
                            <form>
                                <textarea className="form-control w-100"
                                          placeholder="텍스트를 입력해 주세요"
                                          value={record}
                                          role={'noticeText'}
                                          onChange={(e)=>maxLength(e,maxLen,'record')}

                                />
                                <div className="btn_wrap d-flex">
                                    <span className="byte"><strong>{noticeText.length}</strong> / 500</span>
                                    <input type="date" className="form-control w200 ms-auto" ref={todayInput}/>
                                    <button type="button" className="btn btn-pr3" onClick={recordReset}>신규</button>
                                    <button type="button" className="btn btn-pr3" onClick={recordSave}>저장</button>
                                </div>
                            </form>
                        </div>
                      {/*  <div className="body">
                            <ul className="scrollbar" role={'recordList'}>
                                {recordList && recordList.map((value,idx) => {
                                    return(
                                        <RecordCard data={value} key={idx} idx={idx} record={record} recordSelect={recordSelect}/>
                                    )
                                })}
                            </ul>
                            <div className="footer">
                                <form>
                                <textarea className="form-control w-100"
                                          placeholder="텍스트를 입력해 주세요"
                                          value={record}
                                          onChange={(e)=>maxLength(e,maxLen,'record')}
                                />
                                    <div className="btn_wrap d-flex">
                                        <span className="byte"><strong>{record.length}</strong> / 500</span>
                                    </div>
                                </form>
                            </div>
                            <div className="btn-wrap">
                                <input type="date" className="form-control w200 ms-auto" ref={todayInput}/>
                                <button type="button" className="btn btn-pr3" onClick={recordReset}>신규</button>
                                <button type="button" className="btn btn-pr3" onClick={recordSave}>저장</button>
                            </div>
                        </div>*/}
                    </div>
                    <div className="card indiv alarm">
                        <div className="header d-flex">
                            <h5 className="title">알림 <span>발송</span></h5>
                            <button type="button" className="ms-auto btn-close" onClick={collapseNoticeArea}/>
                        </div>
                        <ul className="scrollbar" role={'noticeList'}>
                            {noticeList && noticeList.map(value => {
                                return(
                                    <NoticeCard data={value} key={value.noticeSeq}/>
                                )
                            })}
                        </ul>
                        <div className="footer">
                            <form>
                                <textarea className="form-control w-100"
                                          placeholder="텍스트를 입력해 주세요"
                                          value={noticeText}
                                          role={'noticeText'}
                                          onChange={(e)=>maxLength(e,maxLen,'notice')}
                                />
                                <div className="btn_wrap d-flex">
                                    <span className="byte"><strong>{noticeText.length}</strong> / 500</span>
                                    <button type="button" className="ms-auto btn btn-pr3" onClick={addNotice}>알림 전송</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AdmissionDetail;