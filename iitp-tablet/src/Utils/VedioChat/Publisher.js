import React, {useEffect, useRef, useState, Fragment} from 'react';
import { OTPublisher ,OTPublisherRef} from "opentok-react";

import Checkbox from "./Checkbox";

export default function Publisher({videoSource,video,audio,width,height,openScreen}) {
    const [error, setError] = React.useState(null);
    const [height1, setHeight1] =useState();
    const [width1, setWidth1] =useState();

    useEffect(() => {
        setHeight1(height)
        setWidth1(width)
        return()=> {
        };
    });
    const onError = (err) => {
        setError(`Failed to publish: ${err.message}`);
    };



    return (
        <div>
            { width1 && videoSource=="screen" ?
                <OTPublisher
                    properties={{
                        width: width1,
                        height: height1,
                        publishAudio: audio,
                        publishVideo: video,
                        videoSource: videoSource === "screen" ? "screen" : undefined
                    }}
                    onError={onError}
                /> : <div></div>
            }
            { !openScreen && videoSource!="screen"?
                <OTPublisher
                    properties={{
                        width: '94vh',
                        height: '85vh',
                        publishAudio: audio,
                        publishVideo: video,
                        videoSource: videoSource === "screen" ? "screen" : undefined,
                        videoFilter:{type:"backgroundBlur",blurStrength:'high'},
                       /* insertMode: 'replace'*/
                    }}
                    onError={onError}
                /> : <div></div>
            }
            { openScreen && videoSource !=="screen"?
                <OTPublisher
                    properties={{
                        width: '50vh',
                        height: '40vh',
                        publishAudio: audio,
                        publishVideo: video,
                        videoSource: videoSource === "screen" ? "screen" : undefined,
                        videoFilter:{type:"backgroundBlur",blurStrength:'high'},
                    }}
                    onError={onError}
                /> : <div></div>
            }

        </div>
    );
}
