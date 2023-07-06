import React from 'react';
import styled from "styled-components";

const Card = styled.div`
  &:hover {
    width: 100%;
    margin-top: 2px;
    border: ${props => '3px solid ' + props.color + '!important' || '#666'};
  }
`
const ColorHeader = styled.div`
  background: ${props => props.color || '#666'};
`
const HealthSignal = styled.span`
  display: inline-block;
  margin: 0 2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: ${props => props.value === 'Y' ? props.color : '#999'};
`

const RedSpan = styled.span`
  color: #ff2020 !important;
`
const BlueSpan = styled.span`
  color: #2094ff !important;
`
const BlackSpan = styled.span`
  color: #131313 !important;
`

function DashboardCard({data, color, lightDisplay, onClick}) {

    return (
        <div className="col-xl-1 col-md-2" style={{boxSizing: 'content-box'}} onClick={onClick}>
            <Card className="card icard" color={color}>
                <ColorHeader className="card-header d-flex" color={color}>
                    <span>{data.roomNm}</span>
                    <span className="age ms-auto">{data.sexNm}/{data.age}</span>
                </ColorHeader>
                <div className="pinfo d-flex">
                    <div className={lightDisplay === 'grid' ? "bts d-grid" : "bts d-flex"}>
                        <HealthSignal value={data.healthSignalVO.signal1Yn} color={'#3ed06f'}/>
                        <HealthSignal value={data.healthSignalVO.signal2Yn} color={'#d03e3e'}/>
                    </div>
                    <div className="name ms-auto">{data.patientNm}</div>
                </div>
                <ul className="m-0">
                    <li className="d-flex">
                        <span>혈압</span>
                        <strong className="ms-auto">
                            <BlackSpan>{data.sbpResult}</BlackSpan>
                            <BlackSpan>/</BlackSpan>
                            <BlackSpan>{data.dbpResult}</BlackSpan>
                        </strong>
                    </li>
                    <li className="d-flex">
                        <span>심박수</span>
                        <strong className="ms-auto">
                            {data.prRiskGb === 'H' && <RedSpan>{data.prResult}</RedSpan>}
                            {data.prRiskGb === '' && <BlackSpan>{data.prResult}</BlackSpan>}
                        </strong>
                    </li>
                    <li className="d-flex">
                        <span>호흡수</span>
                        <strong className="ms-auto">
                            {data.rrRiskGb === 'H' && <RedSpan>{data.rrResult}</RedSpan>}
                            {data.rrRiskGb === '' && <BlackSpan>{data.rrResult}</BlackSpan>}
                        </strong>
                    </li>
                    <li className="d-flex">
                        <span>체온</span>
                        <strong className="ms-auto">
                            {data.btRiskGb === 'H' && <RedSpan>{data.btResult}</RedSpan>}
                            {data.btRiskGb === '' && <BlackSpan>{data.btResult}</BlackSpan>}
                        </strong>
                    </li>
                    <li className="d-flex">
                        <span>산소포화도</span>
                        <strong className="ms-auto">
                            {data.spRiskGb === 'H' && <RedSpan>{data.spResult}</RedSpan>}
                            {data.spRiskGb === '' && <BlackSpan>{data.spResult}</BlackSpan>}
                        </strong>
                    </li>
                </ul>
            </Card>
        </div>
    );
}

export default React.memo(DashboardCard);