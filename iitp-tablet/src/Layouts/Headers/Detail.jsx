import React, { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import VitalModal from "../../Pages/Stretcher/VitalModal";
import styled from "styled-components";
import PropTypes from "prop-types";
import IsolationExitModal from "../../component/IsolationExitModal";
import IsolationApi from "../../Apis/IsolationApi";
import useAlert from "../../Utils/UseAlert";
import AdmissionExitModal from "../../component/AdmissionExitModal";
import AdmissionApi from "../../Apis/AdmissionApi";
import TeleHelthApi from "../../Apis/TeleHelthApi";
import NotesModal from "../../Pages/Stretcher/NotesModal";

const HealthSignal = styled.span`
  display: inline-block;
  margin: 0 2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: ${(props) =>
    props.value === "Y" ? props.color : "#999"} !important;
`;

const ButtonH34 = styled.button`
  height: 34px;
`;

const RedSpan = styled.span`
  color: #ff2020 !important;
`;

const BlueSpan = styled.span`
  color: #2094ff !important;
`;

const MH83Li = styled.li`
  min-height: 83px;
`;

const Detail = ({ dashBoardData }) => {
  const [notesShow, setNotesShow] = useState(false);
  const [vitalShow, setVitalShow] = useState(false);

  const { alert, confirm } = useAlert();
  const searchPatientId = useRef("");
  const searchPatientNm = useRef("");
  /*  const [searchAdmissionCenter,setSearchAdmissionCenter] = useState();*/
  const searchAdmissionCenter = useRef(dashBoardData.centerId);
  const searchAdmissionState = useRef();
  const searchAdmissionId = useRef("");
  const searchAdmissionNm = useRef("");
  const searchPatientIsolation = useRef();
  const [paginationObj, setPaginationObj] = useState({
    currentPageNo: 1,
    pageSize: 10,
    recordCountPerPage: 15,
  });
  const [sortedOrder, setSortedOrder] = useState({ By: "", Dir: "" });
  const [activeStatus, setActiveStatus] = useState();
  //videoApi
  const teleHelthApi = new TeleHelthApi();
  const isolationApi = new IsolationApi(
    searchPatientId,
    searchPatientNm,
    activeStatus,
    searchPatientIsolation,
    paginationObj,
    sortedOrder
  );
  // 입소자관련 Api
  const admissionApi = new AdmissionApi(
    searchAdmissionCenter,
    searchPatientNm,
    searchAdmissionNm,
    searchAdmissionState,
    paginationObj,
    sortedOrder.By,
    sortedOrder.Dir
  );
  //재택격리자 격리해제 모달 닫기
  const handledCloseIsolationExitModal = useCallback(() => {
    setIsolationExitModalObj({ show: false, data: {} });
  }, []);
  //재택격리자 격리해제 모달 열기
  const handledIsolationExitModal = (admissionId) => {
    isolationApi.detail(admissionId).then(({ data }) => {
      setIsolationExitModalObj({ show: true, data: { ...data.result } });
    });
  };
  //재택격리자 격리해제 모달
  const [isolationExitModalObj, setIsolationExitModalObj] = useState({
    show: false,
    data: {},
  });

  const chatArea = useRef();
  const screenShare = useRef();
  const screenShareOn = useRef();
  const openChat = () => {
    chatArea.current.classList.toggle("chat");
  };
  const openScreenShare = () => {
    screenShare.current.classList.toggle("screenShare");
    screenShareOn.current.classList.toggle("screenShareOn");
  };
  useEffect(() => {
    /* searchAdmissionCenter.current.value = dashBoardData.centerId;*/
  }, [dashBoardData]); // (1) 첫 번째 useEffect

  //생활치료센터 퇴소 모달
  const [admissionExitModalObj, setAdmissionExitModalObj] = useState({
    show: false,
    data: {},
  });
  //생활치료센터 퇴소 모달 열기 (admissionId 로 api 요청 하려고 인자로 받음)
  /*    const handledAdmissionExitModal = (admissionId) =>{

        admissionApi.detail(admissionId).then(({data}) => setAdmissionExitModalObj({show: true, data: {...data.result}}))
    }*/
  const handledAdmissionExitModal = (admissionId) => {
    isolationApi.detail(admissionId).then(({ data }) => {
      /* searchAdmissionCenter.current.value = dashBoardData.centerId;*/
      setAdmissionExitModalObj({ show: true, data: { ...data.result } });
    });
  };
  //생활치료센터 퇴소 모달 닫기
  const handledCloseAdmissionExitModal = useCallback(() => {
    setAdmissionExitModalObj({ show: false, data: {} });
  }, []);

  /*생활치료센터 퇴소 API*/
  const discharge2 = useCallback(
    async (
      admissionId,
      dischargeDate,
      quantLocation,
      patientNm,
      centerId,
      del
    ) => {
      if (del) {
        if (dischargeDate === "") {
          alert("퇴소일이 공백입니다.");
        }
        if (quantLocation == null) {
          alert("퇴소시 위치를 입력해주세요");
          return;
        } else {
          const confirmState = await confirm(
            `${patientNm} 을 퇴소처리 하시겠습니까?`
          );
          if (confirmState) {
            admissionApi
              .discharge(admissionId, dischargeDate, quantLocation, centerId)
              .then(({ data }) => {
                if (data.code === "00") {
                  alert(data.message);
                  handledCloseAdmissionExitModal();
                } else {
                  alert(data.message);
                }
              });
          }
        }
      } else {
        const confirmState = await confirm(
          `${patientNm} 을 복귀처리 하시겠습니까?`
        );
        if (confirmState) {
          admissionApi
            .charge(admissionId, dischargeDate, quantLocation, centerId)
            .then(({ data }) => {
              if (data.code === "00") {
                alert(data.message);
                handledCloseAdmissionExitModal();
              } else {
                alert(data.message);
              }
            });
        }
      }
    },
    []
  );

  /*재택격리자 해제 API*/
  const discharge = useCallback(
    async (
      admissionId,
      dischargeDate,
      quantLocation,
      patientNm,
      del,
      patientState
    ) => {
      /*격리해제*/
      if (del) {
        if (dischargeDate === "") {
          alert("격리해제일이 공백입니다.");
        }
        if (quantLocation == null) {
          alert("퇴소시 위치를 입력해주세요");
          return;
        } else {
          const confirmState = await confirm(
            `${patientNm} 을 격리해제 하시겠습니까?`
          );
          if (confirmState) {
            isolationApi
              .discharge(
                admissionId,
                dischargeDate,
                quantLocation,
                patientState
              )
              .then(({ data }) => {
                if (data.code === "00") {
                  alert(data.message);
                } else {
                  alert(data.message);
                }
              });
          }
        }
      } else {
        //격리해제 취소
        const confirmState = await confirm(
          `${patientNm} 을 격리해제 취소하시겠습니까?`
        );
        if (confirmState) {
          isolationApi.charge(admissionId).then(({ data }) => {
            if (data.code === "00") {
              alert(data.message);
            } else {
              alert(data.message);
            }
          });
        }
      }
    },
    []
  );

  ////팝업
  const openPopup = () => {
    window.open(
      "/videoPopup",
      "_blank",
      "width=1700px,height=800px,scrollbars=yes rel=noopener noreferrer"
    );
  };
  const saveVideo = () => {
    teleHelthApi.saveVideo(dashBoardData.admissionId).then(({ data }) => {
      if (data.code === "00") {
        //alert(data.message);
        var link = data.result.uri;
        //console.log(link);
        var options =
          "top=10, left=10, width=200, height=50, status=no, menubar=no, toolbar=no, resizable=no";
        window.open(link, "_blank", options);
      } else {
        alert(data.message);
      }
    });
  };
  const { recentResultInfo } = dashBoardData;
  return (
    <>
      <div className="dashboard-info">
        <div className="row" style={{ cursor: "pointer" }}>
          <div className="col col-4 d-flex flex-column justify-content-start">
            <div className="current-top">
              <div className="current-btn" style={{ marginTop: "5px" }}>
                {dashBoardData.qantnDiv === "2" ? (
                  <ButtonH34 type="button" className="btn btn-primary">
                    <strong>{dashBoardData.dispLocationInfo}</strong>
                  </ButtonH34>
                ) : null}
                {dashBoardData.qantnDiv === "1" ? (
                  <ButtonH34
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "200px", cursor: "auto" }}
                  >
                    <strong>자택</strong>
                  </ButtonH34>
                ) : null}
              </div>
              <div className={"current-info"} style={{ marginTop: "5px" }}>
                <table>
                  <tbody>
                    <tr>
                      <th style={{ margin: "3px" }}>
                        <Badge
                          className={
                            "d-flex justify-content-center align-items-center"
                          }
                          bg="success"
                          style={{
                            width: "60px",
                            height: "24px",
                            fontSize: "14px",
                            fontWeight: "normal",
                          }}
                        >
                          {dashBoardData.dispDschgeInfo}
                        </Badge>
                      </th>
                      <td>{dashBoardData.dispAdmissionPeriodInfo}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="head">
                <div className="current-head">
                  <div
                    className="bts2 is-tooltip d-flex"
                    style={{ cursor: "pointer" }}
                  >
                    {/*<HealthSignal value={dashBoardData ?'N':dashBoardData.healthSignalVO.signal1Yn} color={'#3ed06f'}/>*/}
                    <HealthSignal
                      value={dashBoardData.healthSignalVO?.signal1Yn}
                      color={"#3ed06f"}
                    />
                    {/*<HealthSignal value={dashBoardData ?'N':dashBoardData.healthSignalVO.signal2Yn} color={'#d03e3e'}/>*/}
                    <HealthSignal
                      value={dashBoardData.healthSignalVO?.signal2Yn}
                      color={"#d03e3e"}
                    />
                  </div>
                  <h2 className="me-3">{dashBoardData.patientNm}</h2>
                </div>
                <div className="current-head-bottom">
                  <span>{dashBoardData.dispNameDetailInfo}</span>
                </div>
              </div>
              <div className="current-info" style={{ marginTop: "5px" }}>
                <table>
                  <tbody>
                    <tr>
                      <th>생년월일</th>
                      <td>{dashBoardData.dispBirthDateInfo}</td>
                    </tr>
                    <tr>
                      <th>환자번호</th>
                      <td>{dashBoardData.patientId}</td>
                    </tr>
                    <tr>
                      <th>연락처</th>
                      <td>{dashBoardData.dispCellPhoneInfo}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <ButtonH34
                type="button"
                className="btn btn-exit"
                onClick={() => setNotesShow(true)}
              >
                기록지
              </ButtonH34>
            </div>
          </div>
          <div className="col col-8">
            <div className="row">
              <div className="col col-lg-12 mt05">
                <div className="card indiv" onClick={() => setVitalShow(true)}>
                  <ul className="board_list">
                    <MH83Li className="bl_1">
                      <h2>혈압</h2>
                      <p>{recentResultInfo && recentResultInfo.bpResultDt}</p>
                      <div>
                        <span>
                          {recentResultInfo && recentResultInfo.sbpResult}
                        </span>
                        <span> / </span>
                        <span>
                          {recentResultInfo && recentResultInfo.dbpResult}
                        </span>
                        <em> {recentResultInfo && recentResultInfo.bpUnit}</em>
                      </div>
                    </MH83Li>
                    <MH83Li className="bl_2">
                      <h2>심박수</h2>
                      <p>{recentResultInfo && recentResultInfo.prResultDt}</p>
                      <div>
                        <span>
                          {recentResultInfo && recentResultInfo.prResult}
                        </span>
                        <em> {recentResultInfo && recentResultInfo.prUnit}</em>
                      </div>
                    </MH83Li>
                    <MH83Li className="bl_3">
                      <h2>호흡수</h2>
                      <p>{recentResultInfo && recentResultInfo.rrResultDt}</p>
                      <div>
                        {recentResultInfo &&
                        recentResultInfo.rrRiskGb === "H" ? (
                          <RedSpan>{recentResultInfo.rrResult}</RedSpan>
                        ) : recentResultInfo &&
                          recentResultInfo.rrRiskGb === "L" ? (
                          <BlueSpan>{recentResultInfo.rrResult}</BlueSpan>
                        ) : (
                          <span>
                            {recentResultInfo && recentResultInfo.rrResult}
                          </span>
                        )}
                        <em> {recentResultInfo && recentResultInfo.rrUnit}</em>
                      </div>
                    </MH83Li>
                    <MH83Li className="bl_4">
                      <h2>체온</h2>
                      <p>{recentResultInfo && recentResultInfo.btResultDt}</p>
                      <div>
                        {recentResultInfo &&
                        recentResultInfo.btRiskGb === "H" ? (
                          <RedSpan>
                            {recentResultInfo.btResult.length > 4
                              ? recentResultInfo.btResult.substring(0, 5)
                              : recentResultInfo.btResult}
                          </RedSpan>
                        ) : recentResultInfo &&
                          recentResultInfo.btRiskGb === "L" ? (
                          <BlueSpan>
                            {recentResultInfo.btResult.length > 4
                              ? recentResultInfo.btResult.substring(0, 5)
                              : recentResultInfo.btResult}
                          </BlueSpan>
                        ) : (
                          <span>
                            {recentResultInfo &&
                              (recentResultInfo.btResult != null &&
                              recentResultInfo.btResult.length > 4
                                ? recentResultInfo.btResult.substring(0, 5)
                                : recentResultInfo.btResult)}
                          </span>
                        )}
                        <em> {recentResultInfo && recentResultInfo.btUnit}</em>
                      </div>
                    </MH83Li>
                    <MH83Li className="bl_5">
                      <h2>산소포화도</h2>
                      <p>{recentResultInfo && recentResultInfo.spResultDt}</p>
                      <div>
                        {recentResultInfo &&
                        recentResultInfo.spRiskGb === "H" ? (
                          <RedSpan>{recentResultInfo.spResult}</RedSpan>
                        ) : recentResultInfo &&
                          recentResultInfo.spRiskGb === "L" ? (
                          <BlueSpan>{recentResultInfo.spResult}</BlueSpan>
                        ) : (
                          <span>
                            {recentResultInfo && recentResultInfo.spResult}
                          </span>
                        )}
                        <em> {recentResultInfo && recentResultInfo.spUnit}</em>
                      </div>
                    </MH83Li>
                  </ul>
                  <ul className="board_list">
                    <li className="bg-none" />
                    <MH83Li className="bl_6 bg-none">
                      <h2>걸음수</h2>
                      <p>{recentResultInfo && recentResultInfo.stResultDt}</p>
                      <div>
                        {recentResultInfo &&
                        recentResultInfo.st1RiskGb === "H" ? (
                          <RedSpan>{recentResultInfo.st1Result}</RedSpan>
                        ) : recentResultInfo &&
                          recentResultInfo.st1RiskGb === "L" ? (
                          <BlueSpan>{recentResultInfo.st1Result}</BlueSpan>
                        ) : (
                          <span>
                            {recentResultInfo && recentResultInfo.st1Result}
                          </span>
                        )}

                        <em> {recentResultInfo && recentResultInfo.stUnit}</em>
                      </div>
                    </MH83Li>
                    <MH83Li className="bl_7">
                      <h2>수면</h2>
                      <p>
                        {recentResultInfo && recentResultInfo.sleepResultDt}
                      </p>
                      <div>
                        {recentResultInfo &&
                        recentResultInfo.sleepRiskGb === "H" ? (
                          <RedSpan>{recentResultInfo.sleepResult}</RedSpan>
                        ) : recentResultInfo &&
                          recentResultInfo.sleepRiskGb === "L" ? (
                          <BlueSpan>{recentResultInfo.sleepResult}</BlueSpan>
                        ) : (
                          <span>
                            {recentResultInfo && recentResultInfo.sleepResult}
                          </span>
                        )}
                        <em>
                          {" "}
                          {recentResultInfo && recentResultInfo.sleepUnit}
                        </em>
                      </div>
                    </MH83Li>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip2">
                          본 알람은 실시간 데이터 수집에 따른 ai추론알고리즘기반
                          환자상태 예측 결과입니다 본 지표는 참고용일뿐 임상 전
                          판단 밑 처치는 의료진의 판단에 따라 이루어져야 합니다.
                        </Tooltip>
                      }
                    >
                      <MH83Li className="bl_8">
                        <h2>감염 악화</h2>

                        <p>
                          {recentResultInfo &&
                            recentResultInfo.riskScoreResultDt}
                        </p>
                        <div>
                          <span>
                            {recentResultInfo && recentResultInfo.riskScoreNm}
                          </span>
                          <span>
                            &nbsp; &nbsp;{" "}
                            {recentResultInfo &&
                              recentResultInfo.riskScoreResult}
                          </span>
                        </div>
                        <div>
                          <span>
                            {recentResultInfo && recentResultInfo.riskTemperNm}
                          </span>
                          <span>
                            &nbsp; &nbsp;{" "}
                            {recentResultInfo &&
                              recentResultInfo.riskTemperResult}
                          </span>
                        </div>
                      </MH83Li>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip2">
                          본 알람은 실시간 데이터 수집에 따른 ai추론
                          알고리즘기반 환자상태 예측 결과입니다 본 지표는
                          참고용일뿐 임상 전 판단 밑 처치는 의료진의 판단에 따라
                          이루어져야 합니다.
                        </Tooltip>
                      }
                    >
                      <MH83Li className="bl_9">
                        <h2>정신건강 악화</h2>
                        <p>
                          {recentResultInfo &&
                            recentResultInfo.mentalRiskResultDt}
                        </p>
                        <div>
                          <span>
                            {recentResultInfo && recentResultInfo.mentalRiskNm}
                          </span>
                          <span>
                            &nbsp; &nbsp;{" "}
                            {recentResultInfo &&
                              recentResultInfo.mentalRiskResult}
                          </span>
                        </div>
                      </MH83Li>
                    </OverlayTrigger>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <VidioModal video={video} handledClose={test2}/>*/}

      {/* <VitalsignModal show={show} handledClose={hideVitalsignModal} /> */}
      <VitalModal show={vitalShow} handledClose={() => setVitalShow(false)} />
      <NotesModal show={notesShow} handledClose={() => setNotesShow(false)} />

      {/*자택격리자 격리해제*/}
      <IsolationExitModal
        isolationExitModalObj={isolationExitModalObj}
        handledClose={handledCloseIsolationExitModal}
        discharge={discharge}
      />

      {/*생활치료센터 퇴소*/}
      <AdmissionExitModal
        admissionExitModalObj={admissionExitModalObj}
        handledClose={handledCloseAdmissionExitModal}
        discharge={discharge2}
      />
      {/*  <QuarantineModal show={open} handledClose={hideVitalsignModal2} data = {dashBoardData}/>*/}
    </>
  );
};

Detail.prototype = {
  dashBoardData: PropTypes.object,
};

export default Detail;
