import React, {useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import TreatmentCenterApi from "../Apis/TreatmentCenterApi";
import ReactTable from "./ReactTable";
function TreatmentCenterModal({treatmentCenterModalObject,handleClose}) {
    // 선택 값 초기화
    useEffect(() => {
        if (treatmentCenterModalObject.show) {
            setSelectedData([]);
        }
    }, [treatmentCenterModalObject.show]);

    const [selectedData, setSelectedData] = useState([]);
    const makeSelectedData = (data,mode) => {
        if (mode === 'add') {
            // CheckBox
            setSelectedData(
                [...selectedData, data]
            );
        } else if (mode === 'except') {
            console.log('except');
            // CheckBox
            setSelectedData(
                selectedData.filter(value => value.centerId !== data.centerId)
            );
        } else if (mode === 'select') {
            // Radio
            setSelectedData(
                [data]
            );
        }
    }
    const comCdDetailColumn = [
        {
            Header: '선택',
            accessor: 'header',
            editElement:treatmentCenterModalObject.headerElement,
            editEvent:makeSelectedData
        },
        {Header: '치료센터ID', accessor: 'centerId'  },
        {Header: '치료센터명', accessor: 'centerNm'   },
        {Header: '위치', accessor: 'centerLocation'},
        {Header: '병원명', accessor: 'hospitalNm'   }
    ]
    const treatmentCenterApi = new TreatmentCenterApi();
    const [treatmentCenterList, setTreatmentCenterList] = useState([]);
    useEffect(()=>{
        treatmentCenterApi.select().then(({data}) => setTreatmentCenterList(data.result));
    },[])

    return (
        <Modal show={treatmentCenterModalObject.show}
               onHide={() => handleClose('cancel')}
               className={'lifecenterModal'}
               dialogClassName={'modal-dialog-centered modal-dialog-scrollable'}
        >
            <Modal.Header closeButton>
                <Modal.Title>생활치료센터</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <ReactTable tableHeader={comCdDetailColumn} tableBody={treatmentCenterList} customTableStyle={'table table-striped table-hover'}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className="btn btn-pr4"
                    hidden={treatmentCenterModalObject.headerElement !== 'radio'}
                    onClick={ () => handleClose('init') }
                >초기화</button>
                <button
                    type="button"
                    className="btn btn-pr4"
                    role={'selectButton'}
                    onClick={ () => handleClose('confirm', selectedData) }
                >선택</button>
            </Modal.Footer>
        </Modal>
    );
}

export default TreatmentCenterModal;