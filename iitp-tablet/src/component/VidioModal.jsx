import React, {useEffect, useRef, useState} from 'react';
import {Modal} from "react-bootstrap";
import RecordCard from "./RecordCard";
import NoticeCard from "./NoticeCard";

import { OTSession, OTPublisher, OTStreams, OTSubscriber } from "opentok-react";
import ConnectionStatus from "../Utils/VedioChat/ConnectionStatus";
import Publisher from "../Utils/VedioChat/Publisher";
import Subscriber from "../Utils/VedioChat/Subscriber";
import Test2 from "./VideoPopup"


function VidioModal({video,handledClose}){
    const chatArea = useRef();
    const screenShare = useRef();
    const screenShareOn = useRef();
    const openChat = ()=>{
        chatArea.current.classList.toggle('chat')
    }

    const openScreenShare = ()=>{
        screenShare.current.classList.toggle('screenShare')
        screenShareOn.current.classList.toggle('screenShareOn')
    }



    //////////
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    const sessionEvents = {
        sessionConnected: () => {
            setConnected(true);
        },

        sessionDisconnected: () => {
            setConnected(false);
        }
    };

    const onError = (err) => {
        setError(`Failed to connect to ${err.message}`);
    };


    return (
        <Modal show={video.show}
               onHide={() => handledClose()}
               className={'videoModal'}
               dialogClassName={'modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xlg'}
        >
            <div className="modal-content" style={{height:"1000px"}}>
            <Modal.Header closeButton>
                비디오
               {/* <button type="button" className="ms-auto btn-close" />*/}
            </Modal.Header>
            <Modal.Body>
                <div style={{height:"98%"}}>
                    <main className="flex_layout_dashboard" style={{padding:"8px",background: "whitesmoke",height:"98%"}}>
                        <div className="row video" ref={chatArea}>
                            <div className="screen" ref={screenShareOn}>
                                <div className="card indiv tab3" style={{width:"100%"}}>
                                <div className="header d-flex">
                                    <h5 className="title">화면공유</h5>
                                </div>
                                </div>
                            </div>
                            <div className="col" ref={screenShare}>
                                <div className="card indiv tab3">
                                    <div className="header d-flex">
                                        <h5 className="title">의사화면</h5>

                                    </div>
                                    <div className="body">
                                        <div className="tab-content" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-cont1" role="tabpanel">
                                                <Test2></Test2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card indiv history">
                                <div className="header d-flex">
                                    <h5 className="title">환자화면</h5>
                                </div>
                                <div className="body">
                                    <ul className="scrollbar" role={'noticeList'}>
                                    </ul>
                                </div>
                            </div>
                                <div className="card indiv alarm">
                                <div className="header d-flex">
                                    <h5 className="title">채팅</h5>
                                </div>
                            </div>
                        </div>
                        </div>

                    </main>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={openChat}>채팅</button>
                <button onClick={openScreenShare}>화면공유</button>

            </Modal.Footer>
            </div>
        </Modal>
    )
}
export default React.memo(VidioModal);