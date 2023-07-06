import React, {useEffect, useRef} from 'react';

function RecordCard({data, idx, record, recordSelect}) {
    const { medicalSeq, medicalRecord ,medicalRecorder, medicalDate ,updateDate, updateRecorder} = data;
    const recordResize = useRef();

    const onRecordResize =() =>{
        record = recordResize.current.children[0].value;
        if(recordResize.current.style.height == '240px'){
            recordResize.current.style.height = '130px'
        }else{

            recordResize.current.style.height = '240px'
        }
        recordSelect(recordResize.current.children[0].value, idx, recordResize.current.children[1].children[1].innerHTML,recordResize.current.id.substr(6))
    }

    useEffect(()=>{
      /*  document.querySelector('#record'+medicalSeq).focus()*/
    },[])
    return (
        <div className="record" ref={recordResize} tabIndex={-1} id={'record'+medicalSeq} onClick={onRecordResize}>
            <textarea className="msg" value={medicalRecord} readOnly>
                {medicalRecord}
            </textarea>
            <div className="from d-flex">

                {updateRecorder ?
                    <span>{updateRecorder}</span>
                    :
                    <span>{medicalRecorder}</span>
                }
                <span className="ms-auto">{medicalDate}</span>
            </div>
        </div>
    );
}

export default RecordCard;