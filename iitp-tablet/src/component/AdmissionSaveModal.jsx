import React, {useEffect, useRef, useState} from 'react';
import {Modal} from "react-bootstrap";
import commonCode from "../Apis/CommonCode";
import {convertDate} from "../Utils/common";

// function convertDate(date) {
//
//     return date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
// }

function AdmissionSaveModal({admissionSaveModalObj,handledClose, centerList}) {

    const admissionId = useRef();
    const searsAccount = useRef();
    const patientId = useRef();
    const patientNm = useRef();
    const birthDate = useRef();
    const [sex,setSex] = useState();
    const cellPhone = useRef();
    const admissionDate = useRef();
    const dschgeSchdldDate = useRef();
    const personCharge = useRef();
    const centerId = useRef();
    const room = useRef();
    const [a,setA] = useState('')
    const saveData = {
         admissionId :admissionId,
         patientId :patientId,
         patientNm :patientNm,
         birthDate :birthDate,
         sex :sex,
         cellPhone :cellPhone,
         admissionDate :admissionDate,
         dschgeSchdldDate :dschgeSchdldDate,
         personCharge :personCharge,
         centerId :centerId,
         room :room,
         searsAccount: searsAccount
    }

    const [cellPhoneValue, setCellPhoneValue] = useState('')
    const handledCellphoneValue = (e)=>{
        const pattern=/^[0-9]+$/;
        if(pattern.test(e.target.value)){
            setCellPhoneValue(e.target.value);
        }
    }


    const [rooms, setRooms] = useState([])
    function getRoom(centerId) {
        commonCode('CD005').then(({data}) => {
            setRooms(data.result.filter(value => value.property1 === centerId))
        }).finally(setA(admissionSaveModalObj.data.room))
    }

    const onChangeA = (e) =>{
        setA(e.target.value)
    }

    useEffect(()=>{
        if(centerList&&centerList.length> 0){
            getRoom(centerList[0].centerId)
        }
        setSex(admissionSaveModalObj.data.sex);
        setCellPhoneValue(admissionSaveModalObj.data.cellPhone);
    },[admissionSaveModalObj])
    return (
        <Modal show={admissionSaveModalObj.show}
               onHide={() => handledClose()}
               className={'lifecenterInsertModal'}
               dialogClassName={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}
        >
            <Modal.Header closeButton>
                <Modal.Title>{Object.keys(admissionSaveModalObj.data).length ==0 ? '생활치료센터 신규 입소자 등록' : '생활치료센터 입소자 수정'}</Modal.Title>
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
                                               defaultValue={admissionSaveModalObj.data.admissionId}
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
                                               defaultValue={admissionSaveModalObj.data.patientId}
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
                                               defaultValue={admissionSaveModalObj.data.patientNm}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>생년월일</th>
                                    <td>
                                        <input className="form-control w-100 date" type="date"
                                               ref={birthDate}
                                               role={'birthDate'}
                                               defaultValue={admissionSaveModalObj.data.birthDate && convertDate(admissionSaveModalObj.data.birthDate)}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>성별</th>
                                    <td>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="gender1"
                                                   role={'sexM'}
                                                   defaultChecked={admissionSaveModalObj.data.sex === 'M'}
                                                   onClick={()=>setSex('M')}

                                            />
                                                <label className="form-check-label" htmlFor="gender1">남자</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="gender2"
                                                   role={'sexF'}
                                                   onClick={()=>setSex('F')}
                                                   defaultChecked={admissionSaveModalObj.data.sex === 'F'}/>
                                                <label className="form-check-label" htmlFor="gender2">여자</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>연락처</th>
                                    <td>
                                        <input className="form-control w-100" type="text" ref={cellPhone}
                                               role={'cellPhone'}
                                               // defaultValue={admissionSaveModalObj.data.cellPhone}
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
                                               defaultValue={admissionSaveModalObj.data.personCharge} required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>시작일</th>
                                    <td>
                                        <input className="form-control w-100 date" type="date" ref={admissionDate}
                                               role={'admissionDate'}
                                               defaultValue={admissionSaveModalObj.data.admissionDate  && convertDate(admissionSaveModalObj.data.admissionDate)}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>종료예정일</th>
                                    <td>
                                        <input className="form-control w-100 date" type="date" ref={dschgeSchdldDate}
                                               role={'dschgeSchdldDate'}
                                               defaultValue={
                                                   admissionSaveModalObj.data.dschgeSchdldDate &&
                                                   convertDate(admissionSaveModalObj.data.dschgeSchdldDate)}
                                               required/>
                                    </td>
                                </tr>
                                <tr>
                                    <th>센터</th>
                                    <td>
                                        <select className={'form-select'}
                                                ref={centerId}
                                                role={'centerId'}
                                                onChange={(e)=>getRoom(e.target.value)}
                                                defaultValue={centerList&&centerList.length>0&&centerList[0].centerId}
                                        >
                                            <option value={''}>선택</option>
                                            {

                                                centerList&&centerList.map(value =>
                                                    <option key={value.centerId} value={value.centerId}>
                                                        {value.centerNm}
                                                    </option>
                                                )
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>위치</th>
                                    <td>
                                        <select className={'form-select'} ref={room}
                                                value={a}
                                                role={'room'}
                                                onChange={(e)=>onChangeA(e)}
                                        >
                                            <option value={''}>선택</option>
                                            {
                                                rooms.map(value =>
                                                    <option key={value.detailCd} value={value.detailCd} >
                                                        {value.detailCdNm}
                                                    </option>
                                                 )
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>씨어스계정</th>
                                    <td>
                                        <input className="form-control w-100"
                                               type="text"
                                               ref={searsAccount}
                                               role={'searsAccount'}
                                               defaultValue={admissionSaveModalObj.data.searsAccount}
                                               />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-pr4" onClick={()=>admissionSaveModalObj.confirmFunc(saveData)}>등록</button>
            </Modal.Footer>
        </Modal>
    );
}

export default React.memo(AdmissionSaveModal);