import React, {useEffect, useState} from "react";
import {getLonginUserInfo} from "../../Apis/CommonCode";
import styled from "styled-components";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const BlackOption = styled.option`
  color: #333;
`

const Dashboard = ({mode, data, dashBoardFunc}) => {
    const [selectValue, setSelectValue] = useState('')
    const [centers, setCenters] = useState([]);
    useEffect(() => {
        if (mode === 'Center') {
            getLonginUserInfo().then(({data}) => {
                setCenters(data.result.userTreatmentCenterVOList)
            })
        }
    }, [])
    useEffect(() => {
        centers && centers.length > 0 && setSelectValue(centers[0].centerId)
    }, [centers])
    const handledSelect = (e) => {
        setSelectValue(e.target.value)
    }
    return (

        <div className="current">
            <div className="d-flex mb-2">
                <span className="today me-3" style={{minWidth: '90px'}}>{data.searchDateInfo}</span>
                {mode === 'Center' &&
                    <>
                        <span className="dash"/>
                        {centers && centers.length > 0 ?
                            <select className="form-select w-auto d-inline bg-none"
                                    style={{minWidth: '112px'}}
                                    value={selectValue}
                                    onChange={(e) => {
                                        handledSelect(e);
                                        dashBoardFunc(e);
                                    }}
                            >
                                <BlackOption value={''}>선택</BlackOption>
                                {centers.map(value => {
                                    return (<BlackOption key={value.centerId}
                                                         value={value.centerId}>{value.centerNm}</BlackOption>)
                                })}
                            </select>
                            : <select className="form-select w-auto d-inline bg-none"
                                      style={{minWidth: '112px'}}
                                      onChange={(e) => dashBoardFunc(e)}
                            >
                                <BlackOption value={''}>선택</BlackOption>
                            </select>
                        }
                    </>
                }
            </div>
            <div className="d-flex justify-content-between align-items-end">
                <div className="d-flex align-items-end">
                    <h2 className="me-4">{mode === 'Center' ? data.dashboardTitle : '자택격리자 대시보드'}</h2>
                    <div className="d-flex mb-1 inwon">
                        <div>
                            <span>전체</span> {data.totalCount} 명
                        </div>
                        <div><span>{mode === 'Center' ? '입소' : '격리'}</span> {data.todayAdmissionCount} 명</div>
                        <div><span>{mode === 'Center' ? '퇴소' : '해제'}</span> {data.todayDischargeCount} 명</div>
                    </div>
                    <div className="d-flex mb-1 bts">
                        <div><p>중증도 악화</p></div>
                        <span className="basic"><i/> 없음</span>
                        <span className="taste"><i/> 감염약화</span>
                        <OverlayTrigger placement="bottom"
                                        overlay={<Tooltip id="tooltip2">
                                            <text>본 알람은 실시간 데이터 수집에 따른 ai추론 알고리즘기반 환자상태 예측 결과입니다. <br/>'감염악화'는 병원입원기능성이 있거나 발열위험이 있는 경우를 의미합니다. <br/>
                                            '정신건강 악화'는 격리해제 이후 우울증 또는 불안장애로 진행할 위험이 있음을 의미합니다.본 지표는 참고용일 뿐, 임상적 판단 및 처치는 의료진의 판단에 따라 이루어져야 합니다.
                                            </text>
                                        </Tooltip>}>
                        <span className="smell"><i/> 정신건강 약화</span>
                        </OverlayTrigger>
                    </div>
                </div>
                <div className="dashboard_head-text">
                    <ul>
                        <li><strong>혈압</strong>mmHg</li>
                        <li><strong>심박수</strong>BPM</li>
                        <li><strong>호흡수</strong>회/RR</li>
                        <li><strong>체온</strong>℃</li>
                        <li><strong>산소포화도</strong>%</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;