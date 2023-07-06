import React, {useEffect, useRef, useState} from 'react';
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import ReactTable from "../../component/ReactTable";
import CommonCodeApi from "../../Apis/CommonCodeApi";
import commonCode from "../../Apis/CommonCode";
import useAlert from "../../Utils/UseAlert";

function CommonCode() {

    const {alert, confirm} = useAlert();


    // 상세보기 선택한 ComCd 저장
    const selectComCd = useRef('');

    // 신규 로우 추가시 몇번째 인지 구분 할려고 선언
    const newRowNum = useRef(1);

    //공통코드 구분
    const [comCdList, setComCdList] = useState([]);

    // 업무구분
    const [comCdDiv, setComCdDivSelectData] = useState([]);

    //공통코드 상세 리스트
    const [comCdDetailList, setComCdDetailList] = useState([]);

    // 공통코드 구분 검색
    const comCdSearchCode = useRef();
    const comCdSearchName = useRef();
    const comCdSearchUseYn = useRef();
    // 공통코드 상세 사용여부
    const detailUseYn = useRef('')
    // 공통코드 APi
    const commonCodeApi =
        new CommonCodeApi(
            comCdSearchCode,
            comCdSearchName,
            comCdSearchUseYn,
            selectComCd,
            detailUseYn
        );
    useEffect(()=>{
        getComCdList(); // 초기 호출
    },[])
    /**
     * 공통 함수
     */
    /**
     * edit 모드에서 값 변경시 comCdList,comCdDetailList 중 해당값을 찾아서 업데이트 하는 함수
     * @param e 타겟
     * @param targetKey 변경된 데이터의 키 값
     * @param comCdCode 공통코드 또는 세부코드 값
     * @param primaryKey 공통코드 구분 인지 세부공통코드 인지 판별 하기 위해 (comCd || detailCd)
     * @param crudHeader 세부공통코드의 경우 신규 생성시 세부코드가 '' 으로 설정이 되어있어서 1건이상을 생성하고
     *                   값을 입력시 세부코드를 설정하지 않은 n건에 대해 세부코드가 동일하게 변경됨 따라서 신규일 경우 headerCode로 데이터 수정
     */
    const handledOnChange = (e,targetKey,comCdCode,primaryKey,crudHeader=null) => {
        if(primaryKey === 'comCd'){
            setComCdList(comCdList.map(value => {
                if (value.comCd === comCdCode) {
                    if(targetKey === 'useYn'){
                        return {...value,  [targetKey] : e.target.checked ? 'Y' : 'N'}
                    }
                    else{
                        return {...value,  [targetKey] : e.target.value}
                    }
                }
                return value;
            }));
        }
        else if(primaryKey === 'detailCd'){
            setComCdDetailList(comCdDetailList.map(value => {
                // 신규 세부 공통코드일 경우 세부코드가 입력 가능해서
                // 1건 이상일 경우 모든 신규건에 대해서 업데이트함
                // 따라서 header 값을 기준으로 state 값 업데이트
                if(crudHeader !== null){
                    if (value.header === crudHeader) {
                        if(targetKey === 'useYn'){
                            return {...value,  [targetKey] : e.target.checked ? 'Y' : 'N'}
                        }
                        else{
                            return {...value,  [targetKey] : e.target.value}
                        }
                    }
                }
                else if (value.detailCd === comCdCode) {
                    if(targetKey === 'useYn'){
                        return {...value,  [targetKey] : e.target.checked ? 'Y' : 'N'}
                    }
                    else{
                        return {...value,  [targetKey] : e.target.value}
                    }
                }
                return value;
            }));
        }
    }

    // 체크박스 클릭시 에디트 모드 전환
    const toggleEditMode = (e,comCdCode,primaryKey) => {
        e.stopPropagation()
        const closestTr = e.target.closest("tr");
        if(e.target.checked){
            if(primaryKey === 'comCd'){
                setComCdList(comCdList.map(value => {
                    if(value.comCd === comCdCode){
                        setPrevData([value,...prevData])
                        return {...value, active: true}
                    }
                    return value;
                }));
            }
            else if(primaryKey === 'detailCd'){
                setComCdDetailList(comCdDetailList.map(value => {
                    if(value.detailCd === comCdCode){
                        setPrevData([value,...prevData])
                        return {...value, active: true}
                    }
                    return value;
                }));
            }
            closestTr.classList.add("checked-active")
            Array.from(closestTr.querySelectorAll('select')).map(value => value.removeAttribute('disabled'));
            Array.from(closestTr.querySelectorAll('.use-check')).map(value => value.removeAttribute('disabled'));
        }
        else{
            if(primaryKey === 'comCd') {
                setComCdList(comCdList.map(value => {
                    if (value.comCd === comCdCode) {
                        const currentTargetPrevData = {...prevData.filter(prevValue => !Object.keys(prevValue).includes('detailCd')&&prevValue.comCd === comCdCode)};
                        Array.from(closestTr.querySelectorAll('input[type="text"]')).map(input => {
                            return input.value = Object(currentTargetPrevData[0])[input.getAttribute('name')]
                        })
                        closestTr.querySelector('input[name="useYn"]').checked = Object(currentTargetPrevData[0])['useYn'] === 'Y';
                        closestTr.querySelector('select').value = Object(currentTargetPrevData[0])['comCdDiv']
                        return {...currentTargetPrevData[0]}
                    } else {
                        return value;
                    }
                }));
                setPrevData(prevData.filter(value1 => Object.keys(value1).includes('detailCd') || value1.comCd !== comCdCode))
            }
            else if(primaryKey === 'detailCd'){
                setComCdDetailList(comCdDetailList.map(value => {
                    if (value.detailCd === comCdCode) {
                        const currentTargetPrevData = {...prevData.filter(prevValue => prevValue.detailCd === comCdCode)};
                        Array.from(closestTr.querySelectorAll('input[type="text"]')).map(input => {
                            return input.value = Object(currentTargetPrevData[0])[input.getAttribute('name')]
                        })
                        closestTr.querySelector('input[name="useYn"]').checked = Object(currentTargetPrevData[0])['useYn'] === 'Y';
                        return {...currentTargetPrevData[0]}
                    } else {
                        return value;
                    }
                }));
                setPrevData(prevData.filter(value1 => value1.detailCd !== comCdCode))
            }
            closestTr.classList.remove("checked-active")
            Array.from(closestTr.querySelectorAll('select')).map(value => value.setAttribute('disabled',true));
            Array.from(closestTr.querySelectorAll('.use-check')).map(value => value.setAttribute('disabled',true));
        }
    }

    // 신규 로우 삭제
    const deleteRow = (exceptValue,primaryKey) => {
        if(primaryKey === 'comCd'){
            setComCdList(comCdList.filter(value => value.header !== exceptValue))
        }
        else if(primaryKey === 'detailCd'){
            setComCdDetailList(comCdDetailList.filter(value => value.header !== exceptValue))
        }
    }
    // 검색 Input Enter 이벤트 && Select Change 이벤트
    const handledOnSearch = (e,primaryKey) => {
        if(primaryKey==='detailCd' && !selectComCd.current){
            alert('상위 공통코드를 선택해주세요.');
        }
        else if(e.target.tagName === 'INPUT'){
            if (e.keyCode === 13) {
                primaryKey === 'comCd' && getComCdList();
                primaryKey === 'detailCd' && getComCdDetail(selectComCd.current);

            }
        }
        else if(e.target.tagName === 'SELECT'){
            primaryKey === 'comCd' && getComCdList();
            primaryKey === 'detailCd' && getComCdDetail(selectComCd.current);
        }
    }

    /**
     *공통코드 구분 함수
     */
    // 공통코드 구분 조회 및 업무구분 조회
    const getComCdList = () =>{
        setPrevData(prevData.filter(value => Object.keys(value).includes('detailCd')));
        commonCodeApi.select().then(({data}) => {
            data.code === '00' && setComCdList(data.result)
            selectComCd.current='';
        });
        commonCode('CD001').then(({data}) => data.code === '00' && setComCdDivSelectData(data.result));
        setComCdDetailList([]);

    }

    // edit 모드전환시 이전 데이터 보관 하기 위해 선언
    const [prevData,setPrevData] = useState([]);

    // 헤더에 페이지 타이틀 설정
    UseSetPageTitle('공통코드 관리');

    // React-Table 공통코드 구분 Table Header
    const comCdTableColumn = [
        {Header: '선택', accessor: 'header', styleClassName: 'cd1', editElement:'checkBox',clickFunc:toggleEditMode},
        {Header: '공통코드', accessor: 'comCd', styleClassName: 'cd2', styleClassNameForBody:'text-center'},
        {Header: '공통코드명', accessor: 'comCdNm', styleClassName: 'cd3', styleClassNameForBody:'text-center', editElement:'text', changeFunc:handledOnChange},
        {Header: '업무구분', accessor: 'comCdDiv', styleClassName: 'cd4', editElement:'select', changeFunc:handledOnChange},
        {Header: '사용', accessor: 'useYn', styleClassName: 'cd5', styleClassNameForBody:'use-check', editElement:'checkBox',changeFunc:handledOnChange},
        {Header: '리마크', accessor: 'remark', styleClassName: 'cd6', styleClassNameForBody:'text-start', editElement:'text', changeFunc:handledOnChange},
    ]

    // 공통코드 구분 신규 로우 추가
    const newRow = () =>{
        setComCdList([...comCdList,{header: 'C'+newRowNum.current, comCd:'Create'+newRowNum.current,comCdNm:'',comCdDiv:'',useYn:'Y',remark:'',cudFlag:'C', active:true}])
        newRowNum.current +=1 ;
        setComCdDetailList([]);
    }
    const comCdReactTable = useRef();

    const save = async () => {

        const data =comCdList.filter(value => value.active === true).map(value => {
            return {...value, cudFlag : value.cudFlag || 'U', comCd : value.cudFlag === 'C' ? '' : value.comCd};
        });
        if(data.length <= 0){
            alert('신규 또는 수정건이 없습니다.');
            return;
        }
        let state = data.every(value => {
            if(!value.comCdNm){
                const comCdNmArr= document.querySelectorAll('tr.checked-active input[name="comCdNm"]')
                for (const comCdNm of comCdNmArr) {
                    if(comCdNm.value===''){
                        comCdNm.focus();
                        break;
                    }
                }
                alert(`${value.comCd ?'['+ value.comCd +']':'[신규 '+ value.header.split('C')[1] +'번]' }의 공통코드명이 누락되었습니다.`)
                return false;
            }
            else if(!value.comCdDiv){
                const comCdDivArr= document.querySelectorAll('tr.checked-active select[name="comCdDiv"]')
                for (const comCdDiv of comCdDivArr) {
                    if(comCdDiv.value===''){
                        comCdDiv.focus();
                        break;
                    }
                }
                alert(`${value.comCd ?'['+ value.comCd +']':'[신규 '+ value.header.split('C')[1] +'번]' }의 업무구분을 선택하세요.`)
                return false;
            }
            return true;
        })
        if(state){
            let confirmState = await confirm('생성 / 수정 하시겠습니까?')
            confirmState && commonCodeApi.save(data).then(({data}) => {
                if(data.code === '00'){
                    alert(data.message);
                    setPrevData(prevData.filter(value => Object.keys(value).includes('detailCd')))
                    setComCdList([]);
                    setComCdList(data.result);
                    commonCode('CD001').then(response => setComCdDivSelectData(response.data.result));
                }
                else{
                    alert(data.message);
                }
            })
            let comCdReactTableBody = comCdReactTable.current.querySelector('tbody')
            if(comCdReactTableBody.scrollHeight>comCdReactTableBody.clientHeight){
                comCdReactTableBody.scrollTo(0,0)
            }
            setComCdDetailList([]);
        }
    }

    /**
     *공통코드 상세 함수
     */
    // React-Table 공통코드 상세 Table Header
    const comCdDetailColumn = [
        {Header: '선택', accessor: 'header', styleClassName: 'cd1', editElement:'checkBox',clickFunc:toggleEditMode},
        {Header: '세부코드', accessor: 'detailCd', styleClassName: 'cd2', styleClassNameForBody:'text-center',changeFunc:handledOnChange},
        {Header: '세부코드명', accessor: 'detailCdNm', styleClassName: 'cd3', styleClassNameForBody:'text-center', editElement:'text', changeFunc:handledOnChange},
        {Header: '사용', accessor: 'useYn', styleClassName: 'cd4', styleClassNameForBody:'use-check', editElement:'checkBox', changeFunc:handledOnChange},
        {Header: '속성1', accessor: 'property1', styleClassName: 'cd5', editElement:'text', changeFunc:handledOnChange},
        {Header: '속성2', accessor: 'property2', styleClassName: 'cd6', editElement:'text', changeFunc:handledOnChange},
        {Header: '속성3', accessor: 'property3', styleClassName: 'cd7', editElement:'text', changeFunc:handledOnChange},
        {Header: '속성4', accessor: 'property4', styleClassName: 'cd8', editElement:'text', changeFunc:handledOnChange},
        {Header: '속성5', accessor: 'property5', styleClassName: 'cd9', editElement:'text', changeFunc:handledOnChange},
        {Header: '리마크', accessor: 'remark', styleClassName: 'cd10', styleClassNameForBody:'text-start', editElement:'text',changeFunc:handledOnChange},
    ]



    //공통코드 상세 리스트 조회
    const getComCdDetail = (comCd) =>{
        if(comCd === ''){
            alert('상위코드를 선택해주세요');
        }
        else{
            selectComCd.current= comCd;
            setPrevData(prevData.filter(value => !Object.keys(value).includes('detailCd')))
            commonCodeApi.selectDetail(comCd).then(({data}) => {
                if(data.code === '00'){
                    setComCdDetailList([])
                    setComCdDetailList(data.result)
                }
            });
        }
        // selectComCd.current= comCd;
        // setPrevData(prevData.filter(value => !Object.keys(value).includes('detailCd')))
        // commonCodeApi.selectDetail(comCd).then(({data}) => {
        //     if(data.code === '00'){
        //         setComCdDetailList([])
        //         setComCdDetailList(data.result)
        //     }
        // });
    }
    // 공통코드 상세 신규 로우 추가
    const newDetailRow = () =>{
        if(!selectComCd.current){
            alert('상위 공통코드를 선택해주세요.');
        }
        else{
            setComCdDetailList([...comCdDetailList,
                {
                    header: 'C'+newRowNum.current,
                    cudFlag: 'C',
                    comCd: selectComCd.current,
                    detailCd:'',
                    detailCdNm: '',
                    sortSeq: '',
                    useYn: 'Y',
                    property1 : '',
                    property2 : '',
                    property3 : '',
                    property4 : '',
                    property5: '',
                    remark: '',
                    active:true,
                }
            ])
            newRowNum.current +=1 ;
        }

    }
    //공통코드 상세 저장
    const saveDetail = async () => {
        if(comCdDetailList.length<1){
            alert('신규 또는 수정건이 없습니다.')
        }
        else if(comCdDetailList.filter(value => value.active === true).length === 0){
            alert('신규 또는 수정건이 없습니다.')
        }
        else{
            const data =comCdDetailList.filter(value => value.active === true).map(value => {
                return {...value, cudFlag : value.cudFlag || 'U'};
            });

            let state = data.every(value => {
                if(!value.detailCd){
                    const detailCdArr= document.querySelectorAll('tr.checked-active input[name="detailCd"]')
                    for (const detailCd of detailCdArr) {
                        if(detailCd.value===''){
                            detailCd.focus();
                            break;
                        }
                    }
                    alert(`${value.detailCd ?'['+ value.detailCd +']':'[신규 '+ value.header.split('C')[1] +'번]' }의 세부코드가 누락되었습니다.`)
                    return false;
                }
                else{
                    const detailCdArr= document.querySelectorAll('tr.checked-active input[name="detailCd"]')
                    for (const detailCd of detailCdArr) {
                        if(comCdDetailList.filter(value1 => value1.detailCd === detailCd.value).length > 1){
                            alert(`중복된 세부코드가 존재합니다.-${value.detailCd ?'['+ value.detailCd +']':'[신규 '+ value.header.split('C')[1] +'번]' }`) ;
                            detailCd.focus();
                            return false;
                        }
                    }
                }

                if(!value.detailCdNm){
                    const detailCdNmArr= document.querySelectorAll('tr.checked-active input[name="detailCdNm"]')
                    for (const detailCdNm of detailCdNmArr) {
                        if(detailCdNm.value===''){
                            detailCdNm.focus();
                            break;
                        }
                    }
                    alert(`${value.detailCd ?'['+ value.detailCd +']':'[신규 '+ value.header.split('C')[1] +'번]' }의 세부코드명이 누락되었습니다.`)
                    return false;
                }
                return true;
            })

            if(state){
                let confirmState = await confirm('생성 / 수정 하시겠습니까?')
                confirmState && commonCodeApi.saveDetail(data).then(({data}) => {
                    if(data.code === '00'){
                        alert(data.message);
                        setPrevData(prevData.filter(value => !Object.keys(value).includes('detailCd')))
                        setComCdDetailList([]);
                        setComCdDetailList(data.result);
                        commonCode('CD001').then(response => setComCdDivSelectData(response.data.result));
                    }
                    else{
                        alert(data.message);
                    }
                })
            }
        }
    }

    return (
        <main className="flex_layout_2row">
            <div className="row row1" role={'comCd'}>
                <div className="col-lg-12">
                    <div className="card indiv">
                        <div className="card-content">
                            <div className="table-responsive">
                                <div className="table-header">
                                    <form>
                                        <div className="d-flex">
                                            <div className="tbl_title">공통코드 구분</div>
                                            <div className="me-3 d-flex">
                                                <span className="stit">코드</span>
                                                <input className="form-control w160"
                                                       type="text"
                                                       defaultValue={''}
                                                       maxLength="5"
                                                       onKeyUp={(e)=>handledOnSearch(e,'comCd')}
                                                       ref={comCdSearchCode}
                                                />
                                            </div>
                                            <div className="me-3 d-flex">
                                                <span className="stit">명칭</span>
                                                <input className="form-control w160"
                                                       type="text"
                                                       defaultValue={''}
                                                       maxLength="50"
                                                       onKeyUp={(e)=>handledOnSearch(e,'comCd')}
                                                       ref={comCdSearchName}
                                                />
                                            </div>
                                            <div className="me-1 d-flex">
                                                <span className="stit">사용여부</span>
                                                <select className="form-select"
                                                        ref={comCdSearchUseYn}
                                                        onChange={(e)=>handledOnSearch(e,'comCd')}>
                                                    <option value={''}>전체</option>
                                                    <option value={'Y'}>사용</option>
                                                    <option value={'N'}>미사용</option>
                                                </select>
                                            </div>
                                            <div className="ms-auto">
                                                <div className="btn_wrap d-flex">
                                                    <button type="button" className="btn btn-gray" onClick={getComCdList} >검색</button>
                                                    <button type="button" className="btn btn-white btn-new" onClick={newRow} role={'newComCd'}>신규</button>
                                                    <button type="button" className="btn btn-ccolor" onClick={save} role={'saveComCd'}>저장</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="table-body height100" ref={comCdReactTable}>

                                    <ReactTable
                                        key={'comCd'}
                                        customTableStyle={"data-table table table-striped table-hover table-new table-fixed text-expert"}
                                        tableHeader={comCdTableColumn}
                                        tableBody={comCdList}
                                        edited
                                        deleteRow ={deleteRow}
                                        targetSelectData ={comCdDiv}
                                        trOnclick={getComCdDetail}
                                        primaryKey = 'comCd'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row row2 mt-4" role={'comCdDetail'}>
                <div className="col col-lg-12">
                    <div className="card indiv">
                        <div className="card-content">
                            <div className="table-responsive">
                                <div className="table-header">
                                    <form>
                                        <div className="d-flex">
                                            <div className="tbl_title">세부코드</div>
                                            <div className="me-1 d-flex">
                                                <span className="stit">사용여부</span>
                                                <select className="form-select"
                                                        ref={detailUseYn}
                                                        onChange={(e)=>handledOnSearch(e,'detailCd')}>
                                                    <option value={''}>전체</option>
                                                    <option value={'Y'}>사용</option>
                                                    <option value={'N'}>미사용</option>
                                                </select>
                                            </div>
                                            <div className="ms-auto">
                                                <div className="btn_wrap d-flex">
                                                    <button type="button" className="btn btn-gray" onClick={()=>getComCdDetail(selectComCd.current)}>검색</button>
                                                    <button type="button" className="btn btn-white btn-new2" onClick={newDetailRow} role={'newComCdDetail'}>신규</button>
                                                    <button type="button" className="btn btn-ccolor" onClick={saveDetail} role={'saveComCdDetail'}>저장</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="table-body height100">
                                    <ReactTable
                                        key={'comCdDetail'}
                                        customTableStyle={"data-table table table-striped table-hover table-new2 table-fixed "}
                                        tableHeader={comCdDetailColumn}
                                        tableBody={comCdDetailList}
                                        edited
                                        primaryKey={'detailCd'}
                                        deleteRow={deleteRow}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default CommonCode;