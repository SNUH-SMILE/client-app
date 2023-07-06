import React, {useEffect, useRef} from 'react';
import {Alert, Modal} from "react-bootstrap";
import styled from "styled-components";
import useAlert from "../Utils/UseAlert";

const AlertHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  background: #3b8fd5;
  font-size: 1.35rem;
  color: white;
  padding: 1rem;
`

const AlertBody = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  font-size: 1rem;
  color: black;
  padding: 1rem;
`

const AlertCancelBtn = styled.button`
  background: #fff;
  color: #666;
  border: solid 1px #666;
`
const AlertConfirmBtn = styled.button`
  background: var(--primary-color4);
  color: #fff;
  border: solid 1px var(--primary-color4);

  &:hover {
    color: #fff;
  }
`

function HcAlert() {
    const confirmBtn = useRef();

    const {onConfirm, onCancel, close, alertState} = useAlert();
    useEffect(()=>{
        alertState.show && confirmBtn.current.focus();
    },[alertState.show])

    const component = alertState.show ? (
        <Modal className={'border-0'} show={true}>
            <Alert className={'m-0 p-0 border-0'} onClose={onCancel} dismissible>
                <AlertHeader>{alertState.title ? alertState.title : '알림'}</AlertHeader>
                <AlertBody>
                    <p>
                        {alertState?.text && alertState.text}
                    </p>

                            <hr/>
                            <div className="d-flex justify-content-end" >
                                {alertState.mode === 'confirm' ?
                                    <>
                                        <AlertConfirmBtn className={"me-2 btn"} onClick={onConfirm} ref={confirmBtn}> 확인 </AlertConfirmBtn>
                                        <AlertCancelBtn className={'btn'} onClick={onCancel}> 취소 </AlertCancelBtn>
                                    </>
                                        :<AlertConfirmBtn className={"me-2 btn"} onClick={close} ref={confirmBtn}> 확인 </AlertConfirmBtn>
                                    }
                            </div>
                </AlertBody>
            </Alert>
        </Modal>
    ): null;
    return component;
}

export default HcAlert;