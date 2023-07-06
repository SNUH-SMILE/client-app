import React, {useEffect, useRef, useState} from 'react';
import {Modal} from "react-bootstrap";
import {convertDate} from "../Utils/common";

function IsolationSaveModal({isolationSaveModalObj, handledClose}) {
    const admissionId = useRef();
    const patientId = useRef();
    const patientNm = useRef();
    const birthDate = useRef();
    const searsAccount = useRef();
    const [sex, setSex] = useState(isolationSaveModalObj.data.sex);
    const cellPhone = useRef();
    const admissionDate = useRef();
    const dschgeSchdldDate = useRef();
    const personCharge = useRef();
    const [patientState, setPatientState] = useState();
    const [memo, setMemo] = useState();
    const memoResize = useRef();

    const [cellPhoneValue, setCellPhoneValue] = useState('')
    const saveData = {
        admissionId: admissionId,
        patientId: patientId,
        patientNm: patientNm,
        birthDate: birthDate,
        sex: sex,
        cellPhone: cellPhone,
        admissionDate: admissionDate,
        dschgeSchdldDate: dschgeSchdldDate,
        personCharge: personCharge,
        searsAccount: searsAccount,
        patientState: patientState,
        memo: memo
    }

    const resize =() =>{
        console.log(memoResize.current.style.height);
        if(memoResize.current.style.height == '30px'){
            memoResize.current.style.height = '150px'
        }else {
            memoResize.current.style.height = '30px'
        }
    }
    const maxLength =(e)=>{
        const len = e.target.value.length;
        if(len <=300){
            setMemo(e.target.value);
        }else {
        }
    }

    const handledCellphoneValue = (e)=>{
        const pattern=/^[0-9]+$/;
        if(pattern.test(e.target.value)){
            setCellPhoneValue(e.target.value);
        }
    }

    useEffect(()=>{
        setMemo(isolationSaveModalObj.data.memo)
        setPatientState(isolationSaveModalObj.data.activeStatus)
        setSex(isolationSaveModalObj.data.sex);
        setCellPhoneValue(isolationSaveModalObj.data.cellPhone);
    },[isolationSaveModalObj])
    return (
        <Modal show={isolationSaveModalObj.show}
               onHide={() => handledClose()}
               className={'selfIsolationInsertModal'}
               dialogClassName={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}
        >
            <Modal.Header closeButton>
                <h5 className="modal-title"
                    id="selfIsolationInsertModal">{isolationSaveModalObj.data.admissionId ? '자택격리자 수정' : '자택격리자 신규 등록'}</h5>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col col-lg-6">
                        <div className="table-responsive">
                            <table className="table table-borderless mt-3">
                                <tbody>
                                <tr>
                                    <th>입소내역ID</th>
                                    <td>
                                        <input className="form-control w-100"
                                               type="text"
                                               ref={admissionId}
                                               role={'admissionId'}
                                               defaultValue={isolationSaveModalObj.data.admissionId}
                                               readOnly/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>환자ID</th>
                                    <td>
                                        <input className="form-control w-100"
                                               type="text"
                                               ref={patientId}
                                               role={'patientId'}
                                               defaultValue={isolationSaveModalObj.data.patientId}
                                               readOnly/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>이름</th>
                                    <td>
                                        <input className="form-control w-100"
                                               type="text"
                                               ref={patientNm}
                                               role={'patientNm'}
                                               defaultValue={isolationSaveModalObj.data.patientNm}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>생년월일</th>
                                    <td>
                                        <input className="form-control w-100 date" type="date"
                                               ref={birthDate}
                                               role={'birthDate'}
                                               defaultValue={isolationSaveModalObj.data.birthDate && convertDate(isolationSaveModalObj.data.birthDate)}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>성별</th>
                                    <td>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="gender1"
                                                   role={'sexM'}
                                                   defaultChecked={isolationSaveModalObj.data.sex === 'M'}
                                                   onClick={() => setSex('M')}

                                            />
                                            <label className="form-check-label" htmlFor="gender1">남자</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="gender2"
                                                   role={'sexF'}
                                                   onClick={() => setSex('F')}
                                                   defaultChecked={isolationSaveModalObj.data.sex === 'F'}/>
                                            <label className="form-check-label" htmlFor="gender2">여자</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>연락처</th>
                                    <td>
                                        <input className="form-control w-100" type="text" ref={cellPhone}
                                               role={'cellPhone'}
                                               value={cellPhoneValue||''}
                                               onChange={(e)=>handledCellphoneValue(e)}
                                               required/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col col-lg-6">
                        <div className="table-responsive">
                            <table className="table table-borderless mt-3">
                                <tbody>
                                <tr>
                                    <th>담당자</th>
                                    <td>
                                        <input className="form-control w-100" type="text" ref={personCharge}
                                               role={'personCharge'}
                                               defaultValue={isolationSaveModalObj.data.personCharge} required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>연구 시작일</th>
                                    <td>
                                        <input className="form-control w-100 date" type="date" ref={admissionDate}
                                               role={'admissionDate'}
                                               defaultValue={isolationSaveModalObj.data.admissionDate && convertDate(isolationSaveModalObj.data.admissionDate)}
                                               readOnly={isolationSaveModalObj.data.admissionId ? true: false}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>격리 해제 예정일</th>
                                    <td>
                                        <input className="form-control w-100 date" type="date" ref={dschgeSchdldDate}
                                               role={'dschgeSchdldDate'}
                                               defaultValue={
                                                   isolationSaveModalObj.data.dschgeSchdldDate &&
                                                   convertDate(isolationSaveModalObj.data.dschgeSchdldDate)}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>씨어스계정</th>
                                    <td>
                                        <input className="form-control w-100"
                                               type="text"
                                               ref={searsAccount}
                                               role={'searsAccount'}
                                               defaultValue={isolationSaveModalObj.data.searsAccount}
                                        />
                                    </td>
                                </tr>
                                {isolationSaveModalObj.data.admissionId &&
                                    <>
                                        <tr>
                                            <th>환자상태</th>
                                            <td>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input"
                                                           name="location"
                                                           id="location1"
                                                           type="radio"
                                                           defaultChecked={isolationSaveModalObj.data.activeStatus =='1'}
                                                           onClick={()=> setPatientState('1')}/>

                                                    <label className="form-check-label" htmlFor="location1">ACTIVE</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input"
                                                           name="location"
                                                           id="location2"
                                                           defaultChecked={isolationSaveModalObj.data.activeStatus == '2'}
                                                           onClick={()=> setPatientState('2')}
                                                           type="radio"
                                                    />
                                                    <label className="form-check-label" htmlFor="location2">INACTIVE</label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>환자메모</th>
                                            <td>
                                                <textarea className="form-control w-100" type="text"
                                                       role={'memo'}
                                                       style={{height:'30px'}}
                                                       ref={memoResize}
                                                       defaultValue={isolationSaveModalObj.data.memo}
                                                       onChange={(e)=>maxLength(e)}
                                                       onClick={()=>resize()}
                                                       required/>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"> <span className="byteLength"><strong>{memo && memo.length}</strong> / 300</span></td>
                                        </tr>
                                    </>
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-pr4" onClick={()=>isolationSaveModalObj.confirmFunc(saveData)}>등록</button>
            </Modal.Footer>
        </Modal>
    );
}

export default React.memo(IsolationSaveModal);