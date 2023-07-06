import React, {useEffect, useRef, useState} from 'react';
import {Modal} from "react-bootstrap";

function AdmissionExitModal({admissionExitModalObj, handledClose, discharge}) {
    const todayInput = useRef()
    const [quantLocation, setQuantLocation] = useState();
    useEffect(()=>{
        setQuantLocation('1');
        if(admissionExitModalObj.show){

            const today = new Date()
            const year = today.getFullYear()
            const month = (today.getMonth()+1) < 10 ? '0'+(today.getMonth()+1):(today.getMonth()+1)
            const day = today.getDate() < 10 ?'0'+today.getDate():today.getDate()
            todayInput.current.value= year + '-' + month + '-' + day;
        }
    },[admissionExitModalObj.show])
    return (
        <Modal show={admissionExitModalObj.show}
               onHide={() => handledClose()}
               className={'lifecenterExitModal'}
               dialogClassName={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}
        >
            <Modal.Header closeButton>
                <Modal.Title>생활치료센터 입소자 퇴소</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <table className="table table-borderless mt-3">
                        <tbody>
                        <tr>
                            <th>입소내역ID</th>
                            <td>
                                <input className="form-control w-100"
                                       type="text"
                                       defaultValue={admissionExitModalObj.data.admissionId}
                                       readOnly/>
                            </td>
                        </tr>
                        <tr>
                            <th>환자ID</th>
                            <td>
                                <input className="form-control w-100"
                                       type="text"
                                       defaultValue={admissionExitModalObj.data.patientId}
                                       readOnly/>
                            </td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>
                                <input className="form-control w-100"
                                       type="text"
                                       defaultValue={admissionExitModalObj.data.patientNm}
                                       readOnly/>
                            </td>
                        </tr>
                        <tr>
                            <th>퇴소일자</th>
                            <td>
                                {/*오늘날짜 기본*/}
                                <input className="form-control w-100 date" type="date" ref={todayInput} defaultValue={todayInput} required />
                            </td>
                        </tr>
                        <tr>
                            <th>퇴소시 위치</th>
                            <td>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input"
                                           name="location"
                                           id="location1"
                                           type="radio"
                                           defaultChecked={quantLocation === '1'}
                                           onClick={()=> setQuantLocation('1')}/>

                                    <label className="form-check-label" htmlFor="location1">자택</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input"
                                           name="location"
                                           id="location2"
                                           defaultChecked={quantLocation === '2'}
                                           onClick={()=> setQuantLocation('2')}
                                           type="radio"
                                    />
                                    <label className="form-check-label" htmlFor="location2">병원</label>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {admissionExitModalObj.data.dschgeDate == null ?
                <button type="button" className="btn btn-pr4"
                        role={'modalDischargeButton'}
                        onClick={()=>discharge(admissionExitModalObj.data.admissionId,todayInput.current.value,quantLocation,admissionExitModalObj.data.patientNm,admissionExitModalObj.data.centerId, true)}>퇴소</button>
                    :
                    <button type="button" className="btn btn-pr4"
                            role={'modalDischargeButton'}
                            onClick={()=>discharge(admissionExitModalObj.data.admissionId,todayInput.current.value,quantLocation,admissionExitModalObj.data.patientNm,admissionExitModalObj.data.centerId, false)}>복귀</button>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default React.memo(AdmissionExitModal);