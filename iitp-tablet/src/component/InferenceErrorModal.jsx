import React, {useEffect, useRef, useState} from 'react';
import {Modal} from "react-bootstrap";
import InterviewList from "./InterviewList";

function InferenceErrorModal({inferenceModal, handledClose}) {
    const test =
        [{
        'admissionId' : "0000000079",
        'cdata': null,
        'infDiv' :null,
        'infDivNm' : "체온상승",
        'message': "체온상승 예측 알고리름 id=0000000079 & 일자=2023-01-10 & 생체데이터=  호흡   데이터가 없습니다."
          }
        ]
    const [inference , setInference] = useState([]);
    useEffect(() =>{
        setInference(inferenceModal.data);

    })
    return(
        <Modal show={inferenceModal.show}
               onHide={() => handledClose()}
               className={'inferenceModal'}
               dialogClassName={'modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xlg'}
        >
            <Modal.Header closeButton>
                <Modal.Title>추론 결과 리스트</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive" style={{height:'600px',overflow :"scroll"}}>
                    <table className="table table-borderless mt-3">
                        <tbody>
                        <tr>
                            <th>일자</th>
                            <th>추론</th>
                            <th>메세지</th>
                        </tr>
                      {inference.length >0 && inference.map((value,idx)=>(
                        <tr>
                            <td>{value.cdate}</td>
                            <td>{value.infDivNm}</td>
                            <td>{value.message.substring(value.message.lastIndexOf('=')+1)}</td>

                        </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>

        </Modal>
    )
}
export default React.memo(InferenceErrorModal);