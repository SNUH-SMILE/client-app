import React, {useCallback, useEffect, useRef, useState} from 'react';
import Pagination from "../../component/Pagination";
import IsolationExitModal from "../../component/IsolationExitModal";
import IsolationSaveModal from "../../component/IsolationSaveModal";
import InferenceErrorModal from "../../component/InferenceErrorModal";
import ReactTable from "../../component/ReactTable";
import IsolationApi from "../../Apis/IsolationApi";
import useAlert from "../../Utils/UseAlert";
import UseSetPageTitle from "../../Utils/UseSetPageTitle";

function Isolation() {

    UseSetPageTitle('자택격리자 리스트')

    const {alert,confirm} = useAlert();
    const searchPatientId = useRef('')
    const searchPatientNm = useRef('')
    const searchPatientIsolation = useRef()
    const [paginationObj, setPaginationObj] = useState({currentPageNo: 1, pageSize: 10, recordCountPerPage: 15})
    const [totalPageCount, setTotalPageCount] = useState(null);
    const [isolationTableData,setIsolationTableData] = useState([]);
    const [activeStatus, setActiveStatus] = useState();

    // 정렬
    // By: 정렬 컬럼명
    // Div: 정렬 방식 ('' || asc || desc)
    const [sortedOrder,setSortedOrder] = useState({By:'',Dir:''})

    const isolationApi = new IsolationApi(searchPatientId,searchPatientNm, activeStatus, searchPatientIsolation,paginationObj,sortedOrder);

    useEffect(()=>{

        getIsolationList();
    },[sortedOrder,paginationObj.currentPageNo])

    useEffect(()=>{
        setActiveStatus('1');
    },[])

    const setPaginationAndAdmissionTableData = (data) =>{
        setPaginationObj((prevState)=>({...prevState,
            prevPaginationExists:data.result.paginationInfoVO.prevPaginationExists,
            nextPaginationExists:data.result.paginationInfoVO.nextPaginationExists,
            firstPageNoOnPageList:data.result.paginationInfoVO.firstPageNoOnPageList,
            lastPageNoOnPageList :data.result.paginationInfoVO.lastPageNoOnPageList,
        }))
        setTotalPageCount(data.result.paginationInfoVO.totalPageCount)
        setIsolationTableData(data.result.admissionByQuarantineVOList)
    }
    //라디오버튼
    const handledActiveStatus = (e) => {
        setActiveStatus(e.target.value);
        handledOnSearch(e);
    }

    // 자가격리자 리스트 조회
    const getIsolationList = (activeStatus) =>{

        isolationApi.select(activeStatus).then(({data}) => {
            selectedIsolationId.current='';
            setPaginationAndAdmissionTableData(data);
        });
    }

    // 정렬 검색 이벤트
    const handledSearchWithSort = (orderBy, orderDir) =>{
        setSortedOrder(()=>({By:orderBy,Dir: orderDir}));
    }

    // 저장 모달
    const [isolationSaveModalObj,setIsolationSaveModalObj] = useState({show:false,data:{},confirmFunc:Function});
    const selectedIsolationId = useRef('');
    const getSelectedIsolationId = (patientId, {admissionId}) =>{
        selectedIsolationId.current = admissionId;
    }

    const validationModalData = async (nullList,saveData)=>{
        if(nullList.length > 1 && nullList.length > 0){
            nullList[0] === 'patientNm' && alert('이름이 공백입니다.')
            nullList[0] === 'birthDate' && alert('생일이 공백입니다.')
            nullList[0] === 'sex' && alert('성별을 선택해주세요.')
            nullList[0] === 'cellPhone' && alert('연락처가 공백입니다.')
            nullList[0] === 'admissionDate' && alert('연구 시작일이 공백입니다.')
            nullList[0] === 'dschgeSchdldDate' && alert('격리해제 예정일이 공백입니다.')
            nullList[0] === 'personCharge' && alert('담당자 공백입니다.')
            saveData[nullList[0]].current.focus();
            return false;
        }
        if(saveData.cellPhone.current.value.length < 11){
            alert('연락처 길이가 맞지 않습니다 ')
            saveData[nullList[0]].current.focus();
            return false
        }
        else if(saveData['admissionDate'].current.value >= saveData['dschgeSchdldDate'].current.value){
            alert('격리해제  예정일은 시작일 이후이어야 합니다.')
            saveData['dschgeSchdldDate'].current.focus();
            return false;
        }
        return true;
    }

    // 신규생성
    const create = async (saveData) => {
        let nullList = Object.keys(saveData)
            .filter(value => value!=='admissionId' && value !== 'patientId' &&  value !== 'patientState' && value !== 'memo')
            .filter(value=>value === 'sex' ? saveData[value] === '' :saveData[value].current.value==='');
        const validation = await validationModalData(nullList,saveData)
        if(validation){
            let confirmStatus = await confirm(`${saveData['patientNm'].current.value}를 생성하시겠습니까?`)
            if(confirmStatus){
                isolationApi.create(saveData).then(({data}) => {
                    if(data.code === '00'){
                        alert(data.message)
                        handledCloseIsolationSaveModal();
                        setPaginationObj((prevState)=>({...prevState,
                            prevPaginationExists:data.result.admissionListResponseByQuarantineVO.paginationInfoVO.prevPaginationExists,
                            nextPaginationExists:data.result.admissionListResponseByQuarantineVO.paginationInfoVO.nextPaginationExists,
                            firstPageNoOnPageList:data.result.admissionListResponseByQuarantineVO.paginationInfoVO.firstPageNoOnPageList,
                            lastPageNoOnPageList :data.result.admissionListResponseByQuarantineVO.paginationInfoVO.lastPageNoOnPageList,}));

                        setTotalPageCount(data.result.admissionListResponseByQuarantineVO.paginationInfoVO.totalPageCount);
                        setIsolationTableData(data.result.admissionListResponseByQuarantineVO.admissionByQuarantineVOList);
                    }
                    else{
                        alert(data.message);
                    }
                });
            }}}

    // 수정
    const update = async (saveData) => {
        let nullList = Object.keys(saveData)
            .filter(value => value!=='patientState' && value !== 'memo')
            .filter(value=>value === 'sex' ? saveData[value] === '' :saveData[value].current.value==='');
        const validation = await validationModalData(nullList,saveData)

        if(validation){
            let confirmStatus = await confirm(`${saveData['patientNm'].current.value}를 수정하시겠습니까?`)
            if(confirmStatus){
                isolationApi.update(saveData).then(({data}) => {
                    if(data.code === '00'){
                        alert(data.message)
                        handledCloseIsolationSaveModal();
                        setTotalPageCount(data.result.admissionListResponseByQuarantineVO .paginationInfoVO.totalPageCount);
                        setIsolationTableData(data.result.admissionListResponseByQuarantineVO .admissionByQuarantineVOList);
                        /** 수정 후 전체 조회 되는 것을 막고자  재조회를 함**/
                        getIsolationList();
                    }
                    else{
                        alert(data.message);
                    }
                });
            }
        }
    }

    // 저장 모달 열기 (admissionId 로 api 요청 하려고 인자로 받음)
    const handledIsolationSaveModal = (admissionId,flag) =>{
        if(flag === 'U' && admissionId ===''){
            alert('자택격리자를 선택해주세요.');
        } else if(admissionId === ''){
            setIsolationSaveModalObj({show: true, data:{},confirmFunc: create})
        } else {
            isolationApi.detail(admissionId).then(({data}) => {
                setIsolationSaveModalObj({show: true, data: {...data.result}, confirmFunc: update})
            });
        }
    }

    // 저장 모달 닫기
    const handledCloseIsolationSaveModal = useCallback(() =>{
        setIsolationSaveModalObj({show: false, data:{},confirmFunc:null});
    },[]);

    // 격리해제 모달 ;
    const [isolationExitModalObj,setIsolationExitModalObj] = useState({show:false,data: {}});
    // 격리해제 모달 열기 (admissionId 로 api 요청 하려고 인자로 받음)
    const handledIsolationExitModal = (admissionId) =>{
        isolationApi.detail(admissionId).then(({data}) => setIsolationExitModalObj({show: true, data: {...data.result}}))
    };
    /*추론오류 모달*/
    const [inferenceModal, setInferenceModal] = useState({show:false, data:{}});
    /*추론 오류 팝업 닫기 */
    const handledCloseInterfaceExitModal = () =>{
        setInferenceModal({show: false, data:{}});
    }
    /*추론 오류 팝업 열기*/
    const handledInferenceModal = (admissionId) =>{
        isolationApi.logDetail(admissionId).then(({data}) => {
            setInferenceModal({show: true, data: data.result})
        })
    }
    //추론 오류 모달
    const [isolationLogModalObj,setIsolationLogModalObj] = useState({show:false,data: {}});
    //추론 오류 모달
    const handledIsolationLogModal = (admissionId) =>{
        isolationApi.logDetail(admissionId).then(({data}) => setIsolationLogModalObj({show: true, data: {...data.result}}))
    };

    const discharge = useCallback(async (admissionId, dischargeDate,quantLocation,patientNm) => {
        if(dischargeDate===''){
            alert('격리해제일이 공백입니다.');
        }
        else{
            const confirmState = await confirm(`${patientNm} 을 격리해제 처리 하시겠습니까?`);
            if(confirmState) {
                isolationApi.discharge(admissionId, dischargeDate, quantLocation).then(({data}) => {
                    if(data.code==='00'){
                        alert(data.message);
                        handledCloseIsolationExitModal();
                        setPaginationAndAdmissionTableData(data);
                    }
                    else{
                        alert(data.message);
                    }
                });
            }
        }
    },[])
    // 격리해제 모달 닫기
    const handledCloseIsolationExitModal = useCallback(() =>{
        setIsolationExitModalObj({show: false, data: {}})
    },[])

    const isolationTableColumn = [
       /* {Header: 'test', accessor: 'admissionId', sortedYn:true, orderBy:sortedOrder.By, orderDiv:sortedOrder.Dir, sortedEvent:handledSearchWithSort},*/
        {Header: '환자ID', accessor: 'patientId', sortedYn:true, orderBy:sortedOrder.By, orderDiv:sortedOrder.Dir, sortedEvent:handledSearchWithSort},
        {Header: '환자명', accessor: 'patientNm', sortedYn:true, orderBy:sortedOrder.By, orderDiv:sortedOrder.Dir, sortedEvent:handledSearchWithSort},
        {Header: '격리시작일', accessor: 'admissionDate', sortedYn:true, orderBy:sortedOrder.By, orderDiv:sortedOrder.Dir, sortedEvent:handledSearchWithSort},
        {Header: '격리일수', accessor: 'qantnDay', sortedYn:true, orderBy:sortedOrder.By, orderDiv:sortedOrder.Dir, sortedEvent:handledSearchWithSort},
        {Header: '혈압', accessor: 'bp', vital:true,},
        {Header: '심박수', accessor: 'prResult', vital:true,},
        {Header: '호흡수', accessor: 'rrResult', vital:true},
        {Header: '체온', accessor: 'btResult', vital:true},
        {Header: '산소포화도', accessor: 'spResult', vital:true},
        {Header: '격리상태', accessor: 'qantnStatus', editElement:'AdmissionButton', editElementType:'Isolation',editEvent:handledIsolationExitModal},
        {Header: '영상다운', accessor: 'videoDown', sortedYn:true, orderBy:sortedOrder.By, orderDiv:sortedOrder.Dir, sortedEvent:handledSearchWithSort},
        {Header: '추론', accessor: 'aiExe', editElement:'aiExeButton', editElementType:'Isolation',editEvent:handledInferenceModal},
        {Header: '수정', accessor: 'update', editElement:'updateButton', editElementType:'Isolation',editEvent:handledIsolationSaveModal},

    ]
    // 검색 Input Enter 이벤트
    const handledOnSearch = (e) => {
        if (e.keyCode === 13 || e.target.tagName === 'BUTTON'|| e.target.tagName === 'SELECT') {
            if(paginationObj.currentPageNo === 1){
                getIsolationList();
            }
            else{
                setPaginationObj({currentPageNo:1,pageSize:10,recordCountPerPage:15})
            }
        }
        if(e.target.tagName === 'INPUT'){
            if(paginationObj.currentPageNo === 1){
                getIsolationList(e.target.value);
            }
            else{
                setPaginationObj({currentPageNo:1,pageSize:10,recordCountPerPage:15})
            }
        }
    }
    return (
        <>
            <main className="flex_layout_1row">
                <div className="row">
                    <div className="col col-lg-12">
                        <div className="card indiv">
                            <div className="card-content">
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <form>
                                            <div className="d-flex">
                                                <div className="tbl_title">자택격리 환자 리스트</div>
                                                <div className="me-3 d-flex">
                                                    <span className="stit">환자ID</span>
                                                    <input className="form-control w160" type="text" defaultValue=""
                                                           onKeyUp={handledOnSearch} ref={searchPatientId}/>
                                                </div>
                                                <div className="me-3 d-flex">
                                                    <span className="stit">환자명</span>
                                                    <input className="form-control w160" type="text" defaultValue=""
                                                           onKeyUp={handledOnSearch} ref={searchPatientNm}/>
                                                </div>
                                                <div className="me-3 d-flex">
                                                    <span className="stit">격리상태</span>
                                                    <select className="form-select"  defaultValue={'1'} ref={searchPatientIsolation} onChange={(e)=>handledOnSearch(e)}>
                                                        <option value={''}>전체</option>
                                                        <option value={'1'}>격리중</option>
                                                        <option value={'2'}>격리해제</option>
                                                        <option value={'3'}>격리해제 30일 이하</option>
                                                        <option value={'4'}>격리해제 30일 이상</option>
                                                    </select>
                                                </div>
                                                <div className="me-3 d-flex">
                                                    <span className="stit">환자상태</span>
                                                    <div style={{alignSelf: 'center'}}>
                                                        <input className="form-check-input" type="radio" name="active" id="active"
                                                               defaultChecked={activeStatus && activeStatus === '1'}
                                                               value='1'
                                                               onClick={(e)=>handledActiveStatus(e)}/>
                                                        <label className="form-check-label" htmlFor="active">ACTIVE</label>

                                                        <input className="form-check-input" type="radio" name="active" id="inActive"
                                                               defaultChecked={activeStatus && activeStatus === '2'}
                                                               value='2'
                                                               onClick={(e)=>handledActiveStatus(e)}/>
                                                        <label className="form-check-label" htmlFor="inActive">INACTIVE</label>
                                                    </div>
                                                </div>
                                                <div className="ms-auto">
                                                    <div className="btn_wrap d-flex">
                                                        <button type="button" className="btn btn-gray" onClick={handledOnSearch}>검색</button>
                                                        <button type="button" className="btn btn-white"
                                                                onClick={()=>handledIsolationSaveModal('','C')}>등록
                                                        </button>
{/*                                                        <button type="button" className="btn btn-ccolor"
                                                                onClick={()=>handledIsolationSaveModal(selectedIsolationId.current,'U')}>수정
                                                        </button>*/}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="table-body">
                                        <ReactTable tableHeader={isolationTableColumn} tableBody={isolationTableData}
                                                    sorted={true} customTableStyle={'table table-striped table-hover text-expert'} trOnclick={getSelectedIsolationId} trDbOnclicke={getSelectedIsolationId}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*페이징 start*/}
                <Pagination paginationObj={paginationObj} totalPageCount={totalPageCount}
                            handledList={setPaginationObj}/>
                {/*페이징 end*/}
            </main>
            <>
                {/* 신규 수정 모달*/}
                <IsolationSaveModal isolationSaveModalObj={isolationSaveModalObj} handledClose={handledCloseIsolationSaveModal}/>
            </>
            <>
                {/* 퇴소 모달*/}
                <IsolationExitModal isolationExitModalObj={isolationExitModalObj} handledClose={handledCloseIsolationExitModal} discharge={discharge}/>
            </>
            <>
                {/* 추론오류 모달 */}
                <InferenceErrorModal inferenceModal={inferenceModal} handledClose={handledCloseInterfaceExitModal}/>
            </>
        </>
    );
}

export default Isolation;