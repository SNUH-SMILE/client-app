import React, {useEffect, useRef, useState, Fragment} from 'react';
import OTSessionPublisher from "./OTSessionPublisher";
import OTSessionSubcriber from "./OTSessionSubcriber";
import OTSessionText from "./OTSessionText";

import OpentokApi from "../Apis/OpentokApi";
import TeleHelthApi from "../Apis/TeleHelthApi";
import styled from "styled-components";
import {alertReducer} from "../Providers/AlertReducer";
import useAlert from "../Utils/UseAlert";
import OT from '@opentok/client';

const ButtonH34 = styled.button`
  height: 34px;
`
function VideoPopup() {
    const opentok = new OpentokApi();
    const teleHelthApi = new TeleHelthApi();

    const {alert,confirm} = useAlert();
    const [openScreenShare,setOpenScreenShare] = useState(false);//공유화면 열기위한
    const [screenValue,setScreenValue] = useState(""); //공유화면 오픈 시 사이즈 조절을 위한 변수
    const [openScreen, setOpenScreen] = useState(false); //공유화면 오픈시 조건을 달기위한 변수
    const [api, setApi] = useState(0); //opentok 데이터(sessionId, apiKey, token)들을 받기위한 변수
    const chatArea = useRef();
    const screenShare = useRef();
    const screenShareOn = useRef();
    const [chat,setChat] = useState(false); //채팅 open
    const [video, setVideo] = useState(true); // 화상 화면 open
    const [audio, setAudio] = useState(true); // 오디오 볼륨 open
    const [archiveId, setArchiveId] = useState(); //녹화 정보를 받기위한 변수

    useEffect(() => {
        connectTokApi()
    },[]);
    useEffect(() => {
        const handleTabClose = event => {
            event.preventDefault();
            confirm('beforeunload event triggered');
            handledSessionStop();
            return (event.returnValue = 'Are you sure you want to exit?');
        };
        window.addEventListener('beforeunload', handleTabClose);
        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    },[]);


    const connectTokApi = async ()=>{
        teleHelthApi.select(localStorage.getItem("admissionId"))
            .then(({data}) => {
                if (data.code === '00') {
                    setApi({
                        "officerToken":data.result.officerToken
                        ,"apiKey":data.result.apiKey.toString()
                        ,"sessionId":data.result.sessionId
                    });
                }else {
                    alert(data.message);
                }
            })
    }

    /*채팅 열기*/
    const openChat = ()=>{
        setChat(true);
        chatArea.current.classList.toggle('chat')
    }

    const handleScreenShare = ()=>{
        openScreen?  setOpenScreen(false) : setOpenScreen(true);

        screenValue ==="screen" ? setScreenValue(""):setScreenValue("screen")
        setOpenScreenShare(true);
        screenShare.current.classList.toggle('screenShare')
        screenShareOn.current.classList.toggle('screenShareOn')
    }

    const setChatVideo =() =>{
        video? setVideo(false) : setVideo(true);
    }
    const setChatAudio =() =>{
       audio? setAudio(false) : setAudio(true);
    }

    const handledArchive = () => {
        opentok.archive(api.sessionId, localStorage.getItem("admissionId")).then(({data}) => {
            if (data.code === '00') {
                alert(data.message)
                setArchiveId(data.result);
            } else {
                alert(data.message)
            }
        });
    }
    const handledSessionStop = () => {
        const session = OT.initSession(api.apiKey, api.sessionId);
        session.disconnect();

      //  window.addEventListener('unload');
        window.close();
        console.log(session)
    }

    const handledArchiveStop = () => {
        if(archiveId != null) {
            opentok.archiveStop(archiveId).then(({data}) => {
                if (data.code == '00') {
                    alert(data.message)
                    setArchiveId(null);
                } else {
                    alert(data.message)
                }
            })
        }else {
            alert("녹화가 시작하지 않았습니다")
        }
    }
    return(
        <div>
            <div className="modal-content" style={{height:"100vh"}}>
                <div style={{height:"100vh"}}>
                    <div style={{height:"98%"}}>
                        <main className="flex_layout_dashboard" style={{padding:"8px",background: "whitesmoke",height:"98%"}}>
                            <div className="row video" ref={chatArea}>
                                <div className="screen" ref={screenShareOn}>
                                    <div className="card indiv tab3" style={{width:"100%"}}>
                                        <div className="header d-flex" style={{width:"100%", height:"100%"}}>
                                            <div style={{width:"100%"}}>
                                                {/*화면공유*/}
                                            <Fragment>
                                                {api.officerToken && openScreenShare ?
                                                    <OTSessionPublisher
                                                        width="131vh"
                                                        height="88vh"
                                                        token={api.officerToken}
                                                        apiKey={api.apiKey}
                                                        sessionId={api.sessionId}
                                                        videoSource ={screenValue}
                                                        video={true}
                                                        audio={false}
                                                    ></OTSessionPublisher>
                                                    : <div></div>
                                                }
                                            </Fragment>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col" ref={screenShare}>
                                    <div className="card indiv tab3">
                                        <div className="body">
                                            <div className="tab-content" id="pills-tabContent">
                                                <div className="tab-pane fade show active" id="pills-cont1" role="tabpanel">
                                                    {/*의사화면*/}
                                                    <Fragment>
                                                        {api.officerToken ?
                                                            <OTSessionPublisher
                                                                video={video}
                                                                audio={audio}
                                                                token={api.officerToken}
                                                                apiKey={api.apiKey}
                                                                sessionId={api.sessionId}
                                                                videoSource =""
                                                                openScreen={openScreen}
                                                            ></OTSessionPublisher>
                                                            : <div></div>
                                                        }
                                                    </Fragment>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card indiv history">
                                        {/*환자화면*/}
                                        <div className="body">
                                            <Fragment>
                                                {api.officerToken ?
                                                    <OTSessionSubcriber
                                                        openScreen={openScreen}
                                                        token={api.officerToken}
                                                        apiKey={api.apiKey}
                                                        sessionId={api.sessionId}
                                                    ></OTSessionSubcriber>
                                                    : <div></div>
                                                }
                                            </Fragment>
                                        </div>
                                    </div>
                                    <div className="card indiv alarm">
                                        <div className="header d-flex">
                                            <h5 className="title">채팅</h5>
                                        </div>
                                        <div className="body">
                                            <Fragment>
                                                {api.officerToken && chat?
                                                    <OTSessionText
                                                        token={api.officerToken}
                                                        apiKey={api.apiKey}
                                                        sessionId={api.sessionId}
                                                    ></OTSessionText>
                                                    : <div></div>
                                                }
                                            </Fragment>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="floatLeftRightDiv">
                    <div className="left">
                            {video ?
                                <>
                                    <button className="videoCamera on" style={{backgroundSize: "90%"}} onClick={setChatVideo}/>
                                    <p>비디오 중지</p>
                                  </>
                                : <>
                                    <button className="videoCamera off" style={{backgroundSize: "90%"}} onClick={setChatVideo}/>
                                    <p>비디오 재생</p>
                                 </>
                            }
                    </div>
                    <div className="left">
                        {audio ?
                            <>
                                <button className="audio on" style={{backgroundSize: "90%"}} onClick={setChatAudio}/>
                                <p>오디오 중지</p>
                            </>
                            : <>
                                <button className="audio off" style={{backgroundSize: "90%"}} onClick={setChatAudio}/>
                                <p>오디오 재생</p>
                            </>
                        }
                    </div>
                    <div className="left">
                        {archiveId == null ?
                            <>
                                <button className="record on" style={{backgroundSize: "90%"}} onClick={handledArchive}/>
                                <p>녹화 시작</p>
                            </>
                            : <>
                                <button className="record off" style={{backgroundSize: "90%"}} onClick={handledArchiveStop}/>
                                <p>녹화 중지</p>
                            </>
                        }

                        {/*    <ButtonH34 type="button" className="videoCamera on" onClick={setChatVideo}></ButtonH34>*/}
                        {/*  <ButtonH34 type="button" className="btn btn-primary" onClick={setChatAudio}>음소거</ButtonH34>*/}
                        {/* <ButtonH34 type="button" className="btn btn-primary" onClick={openChat}>채팅</ButtonH34>*/}
                      {/*  <ButtonH34 type="button" className="btn btn-primary" onClick={handleScreenShare}>화면공유</ButtonH34>
                        <ButtonH34 type="button" className="btn btn-primary" onClick={handledArchive}>녹음 시작</ButtonH34>
                        <ButtonH34 type="button" className="btn btn-primary" onClick={handledArchiveStop} disabled={!archiveId}>녹음 중지</ButtonH34>*/}
                    </div>
                    <div className="left">
                        <button className="screenShareImg" style={{backgroundSize: "90%"}} onClick={handleScreenShare}/>
                        <p>화면 공유</p>
                    </div>
                    <div style={{marginLeft:'80%'}}>
                        <ButtonH34 type="button" className="btn btn-primary" onClick={handledSessionStop} >세션종료</ButtonH34>
                    </div>
                </div>
            </div>
        </div>


    )
}export default VideoPopup;



