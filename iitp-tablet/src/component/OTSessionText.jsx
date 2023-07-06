import ConnectionStatus from "../Utils/VedioChat/ConnectionStatus";
import Publisher from "../Utils/VedioChat/Publisher";
import Subscriber from "../Utils/VedioChat/Subscriber";
import React, {useRef, useState,useEffect} from "react";
import { OTStreams,OTSubscriber, OTPublisher, preloadScript, OTSession } from "opentok-react";
import OT from '@opentok/client';
function OTSessionText({token,sessionId,apiKey,videoSource,video,audio,width,height}) {
    const state = useState({
        error: null,
        connected: false
    });

    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);


    const sessionEvents = {

        sessionConnected: () => {
            setConnected({ connection: 'Connected' });
        },
        sessionDisconnected: () => {
            setConnected({ connection: 'Disconnected' });
        },
        sessionReconnected: () => {
            setConnected({ connection: 'Reconnected' });
        },
        sessionReconnecting: () => {
            setConnected({ connection: 'Reconnecting' });
        }
    };
    const sessionRef = useRef();
    useEffect(() => {

        sendSignal()
    });


    const msg = useRef();
    const session = OT.initSession(apiKey, sessionId);
    const [test,setTest] = useState();
    const sendSignal = () => {

      /*  session.current.signal({
            type: 'msg',
            data: msg.current.value,
        },function (signalCallback) {
            if (error) {
                console.error('Error sending signal:', error.name, error.message);
            } else {
                setTest(true)
                console.log(msg.current.value);
            }
        })*/
/*        sessionRef.current.sessionHelper.session.signal(
            {
                type: 'msg',
                data: msg.current.value,
            },function (signalCallback) {
                if (error) {
                    console.error('Error sending signal:', error.name, error.message);
                } else {
                    setTest(true)
                    console.log(msg.current.value);
                }
            }
        );*/
        console.log(session)
        session.signal({
            type: 'msg',
            data: msg.current.value
        },function (e) {
            console.log(e)
        })
/*        session.on('signal:chat', function signalCallback(event) {
            console.log(event)
            }
        )*/

    };
   const onSignalReceive = (signal) => {
       console.log("tetetetete")
        console.log('onSignalReceive => ', JSON.parse(signal.data));
        // based on signal data type you can do use switch or conditional statements
    }

    const onError = (err) => {
            setError(`Failed to connect to ${err.message}`);
    };
    return(

        <div>
                <OTSession
                    ref={session}
                    apiKey={apiKey}
                    sessionId={sessionId}
                    onConnect={onSignalReceive}
                    token={token}
                    eventHandlers={sessionEvents}
                    onError={onError}
                >

                    <div className="footer">
                        <form>
                            <textarea className="form-control w-100" placeholder="메세지를 입력해 주세요"  ref={msg} role="noticeText">11</textarea>
                            <div className="btn_wrap d-flex">
                                <span className="byte"><strong>2</strong> / 500</span>
                                <button type="button" className="ms-auto btn btn-pr3" onClick={sendSignal}>전송</button>
                            </div>
                        </form>
                    </div>
                </OTSession>

        </div>
    )
}export default preloadScript(OTSessionText);