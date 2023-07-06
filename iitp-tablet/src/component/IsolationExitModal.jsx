import React, {useEffect, useRef, useState} from 'react';
import {Modal} from "react-bootstrap";
import getToday from "../Utils/common";

function IsolationExitModal({isolationExitModalObj, handledClose, discharge}) {
    const todayInput = useRef()
    const [quantLocation, setQuantLocation] = useState();
    useEffect(()=>{
        setQuantLocation('1')
        if(isolationExitModalObj.show){
            todayInput.current.value= getToday();
        }
    },[isolationExitModalObj.show])

    return (
        <Modal show={isolationExitModalObj.show}
            onHide={() => handledClose()}
               className={'selfIsolationExitModal'}
               dialogClassName={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}
        >
            <Modal.Header closeButton>
                <h5 className="modal-title" id="selfIsolationExitModal">자택격리자 격리 해제 관리</h5>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <table className="table table-borderless mt-3">
                        <tbody>
                        <tr>
                            <th>격리내역ID</th>
                            <td>
                                <input className="form-control w-100" type="text"
                                       defaultValue={isolationExitModalObj.data.admissionId} readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>환자ID</th>
                            <td>
                                <input className="form-control w-100" type="text"
                                       defaultValue={isolationExitModalObj.data.patientId} readOnly/>
                            </td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>
                                <input className="form-control w-100" type="text"
                                       defaultValue={isolationExitModalObj.data.patientNm} readOnly/>
                            </td>
                        </tr>
                        <tr>
                            <th>격리해제 일자</th>
                            <td>
                                {/*오늘날짜 기본 셋팅*/}
                                <input className="form-control w-100 date" type="date"
                                        role={'dischargeInput'}
                                       defaultValue="" ref={todayInput} required/>
                            </td>
                        </tr>
                        <tr>
                            <th>격리해제시 위치</th>
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
                {isolationExitModalObj.data.dschgeDate == null ?
                    <button type="button" className="btn btn-pr4"
                            role={'modalDischargeButton'}
                            onClick={() => discharge(isolationExitModalObj.data.admissionId, todayInput.current.value, quantLocation, isolationExitModalObj.data.patientNm, true)}>
                        격리해제
                    </button>
                    :
                    <button type="button" className="btn btn-pr4"
                            role={'modalDischargeButton'}
                            onClick={() => discharge(isolationExitModalObj.data.admissionId, todayInput.current.value, quantLocation, isolationExitModalObj.data.patientNm, false)}>
                        격리해제 취소
                    </button>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default React.memo(IsolationExitModal);