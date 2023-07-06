import React, { useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import TreatmentCenterModal from "../../component/TreatmentCenterModal";
import UserApi from "../../Apis/UserApi";
import ReactTable from "../../component/ReactTable";
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import useAlert from "../../Utils/UseAlert";

const CardInDivH40 = styled.div`
  height: 40% !important;
  margin-bottom: 20px;
`

const CardInDivH60 = styled.div`
  height: calc(60% - 20px) !important;
`

const TreatmentCenterHeaderCheckBox = styled.input`
    vertical-align: middle;
`
function User() {

    const {confirm, alert} = useAlert();

    UseSetPageTitle('사용자 관리');
    /**
     * 생활치료센터 모달
     */
    const [treatmentCenterModalObject, setTreatmentCenterModalObject] = useState({
        show: false,
        headerElement: 'radio',
        confirmEvent: null
    });

    const handleTreatmentCenterModalClose = (closeType, data) => {
        if (closeType !== 'cancel') {
            if (treatmentCenterModalObject.headerElement === 'radio') {
                if (closeType === 'init') {
                    setSearchCenter({
                        'centerId':'',
                        'centerNm':''
                    });
                } else {
                    if (!data || data.length === 0) {
                        alert('생활치료센터를 선택하세요.');
                        return;
                    }

                    setSearchCenter({
                        'centerId': data[0].centerId,
                        'centerNm': data[0].centerNm
                    })
                }
            } else if (treatmentCenterModalObject.headerElement === 'checkbox') {
                if (!data || data.length === 0) {
                    alert('생활치료센터를 선택하세요.');
                    return;
                }

                data.forEach((val) => {

                    if (userTreatmentCenterList.filter(x => x.centerId === val.centerId).length === 0) {
                        setUserTreatmentCenterList((userTreatmentCenterList) => [
                            ...userTreatmentCenterList,
                            {
                                centerId: val.centerId,
                                centerNm: val.centerNm,
                                mainYn:'N'
                            }
                        ]);
                    }
                });
            }
        }

        // 모달 닫기
        setTreatmentCenterModalObject({
            ...treatmentCenterModalObject,
            show: false
        });
    };

    const handleTreatmentCenterModalOpen = (mode) => {
        setTreatmentCenterModalObject({
            show: true,
            headerElement: mode,
            confirmEvent: null
        })
    };


    /**
     * 사용자 페이지
     */

    /**
     * 검색 정보
     */
    const userSearchId = useRef();
    const userSearchNm = useRef();
    /**
     * 상세 정보
     */
    const userId = useRef();
    const userPw = useRef();
    const userNm = useRef();
    const remark = useRef();
    const lvl = useRef();

    // 사용자 리스트 테이블 헤더
    const userTableColumn = [
        {Header: '사용자ID', accessor: 'userId', styleClassName:'uid'},
        {Header: '사용자명', accessor: 'userNm', styleClassName:'uname'},
        {Header: '생활치료센터', accessor: 'mainCenterNm', styleClassName:'cname'},
        {Header: '권한', accessor: 'lvl', styleClassName:'uname'},
        {Header: '리마크', accessor: 'remark', styleClassName:'umark text-start'},
    ]
    // 사용자 리스트
    const [ userList, setUserList ] = useState([])
    const [ userOpen, setUserOpen ] = useState(false);

    // 선택 사용자 생활치료센터 리스트
    const [ userTreatmentCenterList, setUserTreatmentCenterList ] = useState([])

    // 생활치료센터 검색조건
    const [searchCenter, setSearchCenter] = useState({'centerId':'', 'centerNm':''});

    const [crud, setCrud] = useState('')
    useEffect(()=>{
        selectUserList();
    },[searchCenter])
    const treatmentCenterHeaderCB = useRef();

    // 선택 사용자 생활치료센터 메인여부 변경시 State 값 업데이트
    const changeMainYn = (centerId) => {
        setUserTreatmentCenterList(
            userTreatmentCenterList.map(value => value.centerId === centerId
                ? {...value, mainYn: 'Y'}
                : {...value, mainYn: 'N'}
            )
        )
    }

    useEffect(()=>{

        if(userTreatmentCenterList.length === 0){
            treatmentCenterHeaderCB.current.checked = false;
        }
        else if(userTreatmentCenterList.length === userTreatmentCenterList.filter(value => value.delYn).length){
            treatmentCenterHeaderCB.current.checked = true;
        }
        else{
            treatmentCenterHeaderCB.current.checked = false;
        }
    },[userTreatmentCenterList])
    // 선택 사용자 생활치료센터 선택 체크박스 체크 또는 체크해제시 State 값 업데이트
    const changeDelYn = (centerId) => {
        setUserTreatmentCenterList(
            userTreatmentCenterList.map((value) => {
                if(value.centerId === centerId){
                    return {...value, delYn: !value.delYn}
                }
                else{
                    return value;
                }
            })
        )
    }


    // 선택 사용자 생활치료센터 메인여부 변경시 State 값 업데이트
    const deleteTreatmentCenter = () => {
        if(userTreatmentCenterList.filter(value => value.delYn).length < 1){
            alert('선택된 생활치료 센터가 없습니다.');
        }
        else{
            setUserTreatmentCenterList(
                userTreatmentCenterList.filter(value => !value.delYn)
            )
            treatmentCenterHeaderCB.current.checked = false;
        }
    }

    // 선택 사용자 생활치료센터 리스트 전체선택
    const allCheck = () => {
        setUserTreatmentCenterList(userTreatmentCenterList.map(value => {
            return {...value, delYn : treatmentCenterHeaderCB.current.checked}
        }))
    }


    // 선택 사용자 생활치료센터 테이블 헤더
    const userTreatmentCenterTableColumn = [
        {Header: <TreatmentCenterHeaderCheckBox role="allCheck" ref={treatmentCenterHeaderCB} className="form-check-input" type="checkbox" onClick={allCheck}/>, accessor: 'delYn', styleClassName:'cid ', editElement:'checkbox', editEvent:changeDelYn},
        {Header: '센터ID', accessor: 'centerId',styleClassName:'cname'},
        {Header: '센터명', accessor: 'centerNm'},
        {Header: '메인여부', accessor: 'mainYn', styleClassName:'cname',editElement:'radio',editEvent:changeMainYn},
    ]


    const userApi = new UserApi(
        userId,
        userPw,
        userNm,
        remark,
        userTreatmentCenterList,
        userSearchId,
        userSearchNm,
        searchCenter,
        lvl
    );


    // 사용자 리스트 요청
    const selectUserList = () => {
        userApi.select().then(({data}) =>{
            data.result.forEach((i) =>{
                if(i.lvl=="0"){
                    i.lvl = "전체";
                }else if(i.lvl == "1"){
                    i.lvl="운영자"
                }else{
                    i.lvl="진료진"
                }
            })
            setUserList(data.result)
        });
        clear();
    }

    // 사용자 상세 정보 요청
    const selectUserInfo = (selectUserId) => {
        userApi.detail(selectUserId).then(({data}) => {
            if(data.code === '00') {
                setUserTreatmentCenterList([]);
                const {userTreatmentCenterVOList } = data.result;
                userTreatmentCenterVOList && setUserTreatmentCenterList(
                    userTreatmentCenterVOList.map(value => {return {...value, delYn:false}})
                );
                userId.current.value = data.result.userId
                userPw.current.value = data.result.password
                userNm.current.value = data.result.userNm
                remark.current.value = data.result.remark
                lvl.current.value = data.result.lvl
            }
        });
        setUserOpen(false);
    }

    const save = async () => {
        if(!userPw.current.value){
            userPw.current.focus()
            alert('패스워드가 공백입니다.')
        }
        else if(!userNm.current.value){
            userNm.current.focus()
            alert('사용자명이 공백입니다.')
        }
        else if(!lvl.current.value){
            userNm.current.focus()
            alert('권한이 공백입니다.')
        }
        else if(userTreatmentCenterList.length <= 0){
            alert('생활치료센터를 선택해주세요')
        }
        else if(userTreatmentCenterList.filter(value => value.mainYn === 'Y').length <= 0){
            alert('생활치료센터 메인여부를 선택해주세요')
        }
        else {
            const confirmSate = await confirm(userId.current.value
                ? '['+ userId.current.value + '] 를 수정하시겠습니까?'
                :'['+ userNm.current.value + '] 를 생성하시겠습니까?')
            if(confirmSate){
                userId.current.value && setCrud('U');
                userApi.save().then(({data}) => {
                if(data.code==='00'){
                    setUserList(data.result.userVOList);
                    userId.current.value = data.result.userVO.userId;
                    userPw.current.value = data.result.userVO.password;
                    userNm.current.value = data.result.userVO.userNm;
                    remark.current.value = data.result.userVO.remark;
                    setUserTreatmentCenterList(data.result.userVO.userTreatmentCenterVOList);
                    alert(data.message);
                }
                else{
                    alert(data.message);
                }
            });
            }
        }
    }

    const deleteUser = async () =>{
       const confirmSate = await confirm('['+ userId.current.value + '] 를 삭제하시겠습니까?')
        confirmSate && userApi.delete().then(({data})=>{
            if(data.code==='00'){
                alert(data.message)
                setUserList(data.result);
                clear();
            }
            else{
                alert(data.message)
            }
        })
    }
    const clear = () =>{
        userId.current.value = '';
        userPw.current.value = '';
        userNm.current.value = '';
        remark.current.value = '';
        setUserTreatmentCenterList([]);
        crud==='S' ? setCrud('C') : setCrud('S')
        setUserOpen(true);
    }

    const handledSearch = (e) =>{
        if (e.keyCode === 13) {
            selectUserList();
        }
    }

    return (
        <>
            <main className="flex_layout_2col">
                <div className="row">
                    <div className="col col-lg-8">
                        <div className="card indiv">
                            <div className="card-content">
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <form>
                                            <div className="d-flex clear">
                                                <div className="tbl_title">사용자 리스트</div>
                                                <div className="me-3 d-flex">
                                                    <span className="stit">사용자ID</span>
                                                    <input className="form-control w80" type="text"
                                                           ref={userSearchId} defaultValue="" onKeyUp={handledSearch}/>
                                                </div>
                                                <div className="me-3 d-flex">
                                                    <span className="stit">사용자명</span>
                                                    <input className="form-control w120" type="text"
                                                           ref={userSearchNm} defaultValue="" onKeyUp={handledSearch}/>
                                                </div>
                                                <div className="me-1 d-flex">
                                                    <span className="stit">생활치료센터</span>
                                                    <input className="form-control search w200" type="text"
                                                           role={'selectTreatmentCenter'}
                                                           value={searchCenter.centerNm}
                                                           onClick={()=> handleTreatmentCenterModalOpen('radio')}
                                                           onChange={()=>selectUserList()}
                                                           readOnly/>
                                                </div>
                                                <div className="ms-auto btn_wrap">
                                                    <button type="button" className="btn btn-gray" onClick={selectUserList}>검색</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="table-body height100">
                                        <ReactTable tableHeader={userTableColumn} tableBody={userList} trOnclick={selectUserInfo} crud={crud}/>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col col-lg-4 wd100-mt20">
                        <CardInDivH40 className="card indiv">
                            <form>
                                <div className="card-content">
                                    <div className="table-responsive">
                                        <div className="table-header">
                                            <div className="d-flex">
                                                <div className="tbl_title nobar">상세정보</div>
                                                <div className="ms-auto">
                                                    <div className="btn_wrap d-flex">
                                                        <button type="button" className="btn btn-wgray" role={'deleteUserButton'} onClick={deleteUser}>삭제</button>
                                                        <button type="button" className="btn btn-white btn-new" onClick={clear}>신규</button>
                                                        <button type="button" className="btn btn-ccolor" onClick={save}>저장</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-body">
                                            <table className="table table-borderless mt-3 text-import">
                                                <tbody>
                                                <tr>
                                                    <th>사용자ID</th>
                                                    <td className="uid">
                                                        <input className="form-control w-100" type="text" role={'detailUserID'}
                                                               ref={userId} defaultValue={''}
                                                               readOnly/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>비밀번호</th>
                                                    <td>
                                                        <input className="form-control w-100" type="password" role={'detailUserPW'}
                                                               maxLength="20" ref={userPw}
                                                               defaultValue={''}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>사용자명</th>
                                                    <td className="uname">
                                                        <input className="form-control w-100" type="text" role={'detailUserNM'}
                                                               maxLength="500" ref={userNm}
                                                               defaultValue={''}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>권한</th>
                                                    <td className="lvl">
                                                        <select className="form-select"  ref={lvl} defaultValue={''}>
                                                            <option value=""></option>
                                                            <option value="0">전체</option>
                                                            <option value="1">운영자</option>
                                                            <option value="2">진료진</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>리마크</th>
                                                    <td className="umark">
                                                        <textarea className="form-control h100" ref={remark} role={'detailUserRM'}
                                                                  defaultValue={''} maxLength="100"/>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardInDivH40>
                        <CardInDivH60 className="card indiv">
                            <form>
                                <div className="card-content">
                                    <div className="table-responsive">
                                        <div className="table-header">
                                            <div className="d-flex">
                                                <div className="tbl_title nobar">생활치료센터 리스트</div>
                                                <div className="ms-auto">
                                                    <div className="btn_wrap d-flex" >
                                                        <button type="button" className="btn btn-wgray" role={'deleteTreatmentCenter'} onClick={deleteTreatmentCenter}>삭제</button>
                                                        <button type="button"
                                                                className="btn btn-ccolor"
                                                                onClick={()=> handleTreatmentCenterModalOpen('checkbox')}
                                                        >
                                                            추가
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-body h400 p-0" role={'userCenterList'}>
                                            <ReactTable tableHeader={userTreatmentCenterTableColumn} tableBody={userTreatmentCenterList} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardInDivH60>
                    </div>
                </div>
            </main>
            <TreatmentCenterModal treatmentCenterModalObject={treatmentCenterModalObject} handleClose={handleTreatmentCenterModalClose}/>
        </>
    );
}

export default User;