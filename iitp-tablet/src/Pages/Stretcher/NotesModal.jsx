import { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import InterviewList from "../../component/InterviewList";
import AdmissionDetailApi from "../../Apis/AdmissionDetailApi";
import { TitleContext } from "../../Providers/TitleContext";

function TabButton(props) {
  const { children, active, ...others } = props;

  return (
    <div
      {...others}
      className={`${
        active && "bg-primary fw-bold active"
      } tabbutton d-flex justify-content-center  border-bottom align-items-center h-25`}
    >
      {children}
    </div>
  );
}

function RecordCard({ data }) {
  const {
    medicalSeq,
    medicalRecord,
    medicalRecorder,
    medicalDate,
    updateDate,
    updateRecorder,
  } = data;
  return (
    <div className="record" tabIndex={-1}>
      <pre className="bg-white rounded-1 p-2 text-black">{medicalRecord}</pre>
      <div className="from d-flex">
        {updateRecorder ? (
          <span>{updateRecorder}</span>
        ) : (
          <span>{medicalRecorder}</span>
        )}
        <span className="ms-auto">{medicalDate}</span>
      </div>
    </div>
  );
}

export default function NotesModal({ show, handledClose }) {
  const [tabIndex, setTabIndex] = useState(0);
  const context = useContext(TitleContext);
  const { title, mode, dashBoardData, dashBoardFunc } = context;
  const admissionDetailApi = new AdmissionDetailApi(
    localStorage.getItem("admissionId")
  );
  const [interviews, setInterviews] = useState([]);
  const [recordList, setRecordList] = useState([]);
  const [drugList, setDrugList] = useState([]);
  const contentEl = useRef(null);

  async function getInterviewList() {
    admissionDetailApi.getInterviewList().then(({ data }) => {
      data.result.forEach(function (data) {
        data.countBoolen = false;
        data.interviewContents.forEach(function (test) {
          if (test.interCategori.substring(0, 1) == "2") {
            data.countBoolen = true;
          }
        });
      });
      setInterviews(data.result);
    });
  }
  const getDrugList = async () => {
    admissionDetailApi.drugSelect().then(({ data }) => {
      setDrugList(data.result);
      //console.log(data.result)
    });
  };

  useEffect(() => {
    if (tabIndex === 0) {
      admissionDetailApi.select().then(({ data }) => {
        // setDashBoardData(data.result.headerVO);
        // setNoticeList(data.result.noticeVOList);
        setRecordList(data.result.recordVOList);
        //  console.log(data);
      });
    } else if (tabIndex === 3) {
      getDrugList();
    } else {
      getInterviewList();
    }
    if (contentEl.current) {
      contentEl.current.scrollTo(0, 0);
    }
  }, [tabIndex]);

  return (
    <Modal show={show} onHide={handledClose} size="xl">
      <Modal.Header closeButton>
        <div className="container">
          <div className="row">
            <div className="d-flex col align-content-center">
              <h5 className="mb-0 me-2">환자 상세 기록지</h5>
              <div>
                {dashBoardData.patientNm}({dashBoardData.dispNameDetailInfo})
              </div>
            </div>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div
          className="container p-0  position-relative"
          style={{ height: "70vh" }}
        >
          <div className="row h-100 m-0">
            <div className="col-2 border-end m-0 flex-column h-100 justify-content-between p-0">
              <TabButton active={tabIndex === 0} onClick={() => setTabIndex(0)}>
                <div className="fs-5">기록</div>
              </TabButton>
              <TabButton active={tabIndex === 1} onClick={() => setTabIndex(1)}>
                <div className="fs-5">자가보고 증상</div>
              </TabButton>
              <TabButton active={tabIndex === 2} onClick={() => setTabIndex(2)}>
                <div className="fs-5">정신건강 설문</div>
              </TabButton>
              <TabButton active={tabIndex === 3} onClick={() => setTabIndex(3)}>
                <div className="fs-5">투약내역</div>
              </TabButton>
            </div>
            <div
              className="col-10 p-3"
              ref={contentEl}
              style={{ maxHeight: "100%", overflowY: "auto" }}
            >
              {tabIndex === 0 && (
                <div className="history-alarm">
                  <div className="alarm">
                    <div className="history">
                      {recordList.map((value, idx) => {
                        return (
                          <RecordCard
                            data={value}
                            key={`record-${idx}`}
                            idx={idx}
                          />
                        );
                      })}
                      {tabIndex === 0 && recordList.length === 0 && (
                        <div className="p-3 text-center">
                          조회된 데이터가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {tabIndex === 1 &&
                interviews.map((it, idx) => (
                  <InterviewList
                    key={it.interviewSeq + "1-interview-" + idx}
                    interviewData={it}
                    type="1"
                  ></InterviewList>
                ))}
              {tabIndex === 1 && interviews.length === 0 && (
                <div className="p-3 text-center">조회된 데이터가 없습니다.</div>
              )}
              {tabIndex === 2 &&
                interviews
                  .filter((id) => id.countBoolen)
                  .map((it, idx) => {
                    return (
                      <InterviewList
                        key={it.interviewSeq + "2-interview" + idx}
                        interviewData={it}
                        idx={idx}
                        type="2"
                      ></InterviewList>
                    );
                  })}
              {tabIndex === 2 &&
                interviews.filter((id) => id.countBoolen).length === 0 && (
                  <div className="p-3 text-center">
                    조회된 데이터가 없습니다.
                  </div>
                )}

              {tabIndex === 3 &&
                drugList
                  .filter(
                    (drug, index, callback) =>
                      index ===
                      callback.findIndex((find) => find.drugDoseVO.length > 0)
                  )
                  .map((drug1, idx) => (
                    <div key={`drug-item-${idx}`} className="interview">
                      <div className="interviewHeader">
                        {" "}
                        <h3>
                          {drug1.admissionDate &&
                            drug1.admissionDate.substring(0, 4)}
                          년
                          {drug1.admissionDate &&
                            drug1.admissionDate.substring(4, 6)}
                          월
                          {drug1.admissionDate &&
                            drug1.admissionDate.substring(6, 8)}
                          일
                        </h3>
                      </div>
                      <table style={{ width: "100%" }}>
                        <colgroup>
                          <col style={{ width: "30%" }} />
                          <col style={{ width: "30%" }} />
                          <col style={{ width: "auto" }} />
                        </colgroup>
                        <tbody>
                          {drug1.drugDoseVO &&
                            drug1.drugDoseVO.map((drug2) => (
                              <tr>
                                <td> {drug2.noticeName}</td>
                                <td>
                                  {drug2.noticeTime &&
                                    drug2.noticeTime.substring(0, 2)}
                                  :{" "}
                                  {drug2.noticeTime &&
                                    drug2.noticeTime.substring(2, 4)}
                                </td>
                                {drug2.drugDoseSeq > 0 ? (
                                  <td>복용완료</td>
                                ) : (
                                  <td>복용 미완료</td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
              {tabIndex === 3 &&
                drugList.filter(
                  (drug, index, callback) =>
                    index ===
                    callback.findIndex((find) => find.drugDoseVO.length > 0)
                ).length === 0 && (
                  <div className="p-3 text-center">
                    조회된 데이터가 없습니다.
                  </div>
                )}
            </div>
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer></Modal.Footer> */}
    </Modal>
  );
}
