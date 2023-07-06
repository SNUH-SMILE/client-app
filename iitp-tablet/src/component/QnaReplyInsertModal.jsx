import React, {useEffect, useRef} from 'react';
import {Modal} from "react-bootstrap";

function QnaReplyInsertModal({qnaModalObj,handledClose,onSave,onDelete}) {
    const replyContent = useRef();
    return (
        <Modal show={qnaModalObj.show}
               onHide={() => handledClose()}
               className={'QnaReplyInsertModal'}
               dialogClassName={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}
        >
            <Modal.Header closeButton>
                <h5 className="modal-title is-bar">문의사항</h5>
                <div className="me-4 d-flex">
                    <span className="dtit">환자명</span>
                    <strong className="dcon">{qnaModalObj.data.patientNm}({qnaModalObj.data.patientId})</strong>
                </div>
                <div className="me-4 d-flex">
                    <span className="dtit">등록일시</span>
                    <strong className="dcon">{qnaModalObj.data.regDt}</strong>
                </div>
                {qnaModalObj.data.replyYn === 'Y' ?
                    <div className="me-4 d-flex">
                        <span className="dtit">답변일시</span>
                        <strong className="dcon">2022-03-01 08:10:00</strong>
                    </div>
                    : null
                }
            </Modal.Header>
            <Modal.Body>
                <div className="modal-body">
                    <div className="table-responsive">
                        <table className="table table-borderless mt-3">
                            <colgroup>
                                <col style={{width: "120px"}}/>
                                <col/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>문의제목</th>
                                <td>
                                    <textarea className="form-control"
                                              defaultValue={qnaModalObj.data.questionTitle&&qnaModalObj.data.questionTitle}
                                              readOnly/>

                                </td>
                            </tr>
                            <tr>
                                <th>문의내용</th>
                                <td>
                                    <textarea className="form-control h140 "
                                              defaultValue={qnaModalObj.data.questionContent&&qnaModalObj.data.questionContent}
                                              readOnly/>

                                </td>
                            </tr>
                            <tr>
                                <th>답변내용</th>
                                <td>
                                    <textarea className="form-control h140" ref={replyContent}
                                              defaultValue={qnaModalObj.data.replyContent&&qnaModalObj.data.replyContent}
                                              role={'replyContent'}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {qnaModalObj.data.replyYn === 'Y' ?
                    <button type="button" className="btn btn-gr666" onClick={()=>onDelete(qnaModalObj.data.questionSeq)}>삭제</button>
                    : null
                }
                <button type="button" className="btn btn-pr4" onClick={()=>onSave(qnaModalObj.data.questionSeq,replyContent.current.value)}>{qnaModalObj.data.replyYn === 'Y' ?'수정' : '등록'}</button>
            </Modal.Footer>
        </Modal>
    );
}

export default React.memo(QnaReplyInsertModal);