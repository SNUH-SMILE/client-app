import React, {useEffect, useRef, useState, Fragment} from 'react';
import { OTSubscriber } from "opentok-react";

import CheckBox from "./Checkbox";

export default function Publisher({openScreen}) {
    const [error, setError] = React.useState(null);
    const [audio, setAudio] = React.useState(true);
    const [video, setVideo] = React.useState(true);

    const setChatAudio = (audio) => {
        setAudio(audio);
    };

    const setChatVideo = (video) => {
        setVideo(video);
    };
    useEffect(() => {
        console.log(openScreen);
    });
    const onError = (err) => {
        setError(`Failed to publish: ${err.message}`);
    };

    return (
        <div className="subscriber">

            { openScreen ?
            <OTSubscriber
                properties={{
                    width: '50vh',
                    height: '40vh',
                }}
                onError={onError}
            />: <div></div>
            }
            { !openScreen ?
                <OTSubscriber
                    properties={{
                        width: '94vh',
                        height: '85vh'
                    }}
                    onError={onError}
                />: <div></div>
            }
        </div>
    );
}
