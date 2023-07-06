import React, { useEffect, useRef, useState } from "react";
import ReactTable from "../../component/ReactTable";
import Pagination from "../../component/Pagination";
import AdmissionApi from "../../Apis/AdmissionApi";
import { getLonginUserInfo } from "../../Apis/CommonCode";
import { useLocation, useNavigate } from "react-router-dom";

function AdmissionList({
  searchAdmissionId,
  searchAdmissionNm,
  type,
  setType,
}) {
  // UseSetPageTitle("생활치료센터 리스트");
  const location = useLocation();
  const navigate = useNavigate();
  // 검색
  const searchAdmissionCenter = useRef();
  const searchAdmissionState = useRef();
  const [activeStatus, setActiveStatus] = useState();

  // 정렬
  // By: 정렬 컬럼명
  // Div: 정렬 방식 ('' || asc || desc)
  const [sortedOrder, setSortedOrder] = useState({ By: "", Dir: "" });
  // 페이지 처음 로딩시 입소자 리스트 요청 및 paginationObj의 currentPageNo 가 변경되면 실행 및 정렬옵션이 변경될때 마다 재조회
  // 페이지네이션
  const [paginationObj, setPaginationObj] = useState({
    currentPageNo: 1,
    pageSize: 10,
    recordCountPerPage: 10,
  });
  useEffect(() => {
    mountSelectAdmissionListByCenter();
  }, [sortedOrder, paginationObj.currentPageNo]);

  useEffect(() => {
    const search = location.search.substring(1);
    if (search) {
      const jsonStr =
        '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}';
      const params = JSON.parse(jsonStr);
      // console.log(search);
      // console.log(jsonStr);
      const {
        centerId,
        patientId,
        patientNm,
        qantnStatus,
        activeStatus,
        currentPageNo,
        recordCountPerPage,
        pageSize,
        orderBy,
        orderDir,
      } = params;
      if (centerId) searchAdmissionCenter.current.value = centerId;
      if (patientId) searchAdmissionId.current.value = patientId;
      if (patientNm) searchAdmissionNm.current.value = patientNm;
      if (qantnStatus) searchAdmissionState.current.value = qantnStatus;
      if (activeStatus) setActiveStatus(activeStatus || "1");
      if (orderBy && orderDir) setSortedOrder({ By: orderBy, Dir: orderDir });
      if (currentPageNo && pageSize && recordCountPerPage) {
        setPaginationObj({
          currentPageNo: parseInt(currentPageNo) ? parseInt(currentPageNo) : 1,
          pageSize: parseInt(pageSize) ? parseInt(pageSize) : 10,
          recordCountPerPage: parseInt(recordCountPerPage)
            ? parseInt(recordCountPerPage)
            : 10,
        });
      }
    } else {
      setActiveStatus("1");
    }
  }, []);
  // 입소자관련 Api
  const admissionApi = new AdmissionApi(
    searchAdmissionCenter,
    searchAdmissionId,
    searchAdmissionNm,
    activeStatus,
    searchAdmissionState,
    paginationObj,
    sortedOrder.By,
    sortedOrder.Dir
  );
  // 입소자 리스트
  const [admissionTableData, setAdmissionTableData] = useState([]);

  //총페이지의 갯수
  const [totalPageCount, setTotalPageCount] = useState(null);

  // 현재 로그인한 유저의 생활치료센터 리스트
  const [loginUserTreatmentCenterList, setLoginUserTreatmentCenterList] =
    useState([]);
  const [treatmentCenterList, setTreatmentCenterList] = useState([]);

  const setPaginationAndAdmissionTableDat = (data) => {
    setPaginationObj((prevState) => ({
      ...prevState,
      prevPaginationExists: data.result.paginationInfoVO.prevPaginationExists,
      nextPaginationExists: data.result.paginationInfoVO.nextPaginationExists,
      firstPageNoOnPageList: data.result.paginationInfoVO.firstPageNoOnPageList,
      lastPageNoOnPageList: data.result.paginationInfoVO.lastPageNoOnPageList,
    }));
    setTotalPageCount(data.result.paginationInfoVO.totalPageCount);
    setAdmissionTableData(data.result.admissionByCenterVOList);
  };

  // 센터 정보 및 입소자 리스트 요청 및 총 몇페이지인지 저장
  const mountSelectAdmissionListByCenter = () => {
    getLonginUserInfo()
      .then(({ data }) => {
        setLoginUserTreatmentCenterList(data.result.userTreatmentCenterVOList);
        setTreatmentCenterList(data.result.treatmentCenterVOList);

        console.log(data);
      })
      .catch(() => console.log("ERROR getLonginUserInfo"))
      .then(() => {
        if (searchAdmissionCenter.current.value) {
          const searchParam = {
            type,
            centerId: searchAdmissionCenter.current.value,
            patientId: searchAdmissionId.current.value,
            patientNm: searchAdmissionNm.current.value,
            qantnStatus: searchAdmissionState.current.value,
            activeStatus: admissionApi.activeStatus,
            currentPageNo: admissionApi.currentPageNo,
            recordCountPerPage: admissionApi.recordCountPerPage,
            pageSize: admissionApi.pageSize,
            orderBy: admissionApi.sortedOrderBy,
            orderDir: admissionApi.sortedOrderDir,
          };
          navigate(`?${new URLSearchParams(searchParam).toString()}`, {
            replace: true,
          });
          admissionApi.select().then(({ data }) => {
            setPaginationAndAdmissionTableDat(data);
            selectedAdmissionId.current = "";
          });
        }
      });
  };
  const selectAdmissionListByCenter = () => {
    const searchParam = {
      type,
      centerId: searchAdmissionCenter.current.value,
      patientId: searchAdmissionId.current.value,
      patientNm: searchAdmissionNm.current.value,
      qantnStatus: searchAdmissionState.current.value,
      activeStatus: admissionApi.activeStatus,
      currentPageNo: admissionApi.currentPageNo,
      recordCountPerPage: admissionApi.recordCountPerPage,
      pageSize: admissionApi.pageSize,
      orderBy: admissionApi.sortedOrderBy,
      orderDir: admissionApi.sortedOrderDir,
    };
    navigate(`?${new URLSearchParams(searchParam).toString()}`, {
      replace: true,
    });
    if (searchAdmissionCenter.current.value) {
      admissionApi.select().then(({ data }) => {
        selectedAdmissionId.current = "";
        setPaginationAndAdmissionTableDat(data);
      });
    } else {
      setAdmissionTableData([]);
      setTotalPageCount(0);
      setPaginationObj({
        currentPageNo: 1,
        pageSize: 10,
        recordCountPerPage: 10,
      });
    }
  };
  const [selectValue, setSelectValue] = useState("");
  useEffect(() => {
    if (
      loginUserTreatmentCenterList &&
      loginUserTreatmentCenterList.length > 0
    ) {
      setSelectValue(loginUserTreatmentCenterList[0].centerId);
    }
  }, [loginUserTreatmentCenterList]);

  const handledSelect = (e) => {
    setSelectValue(e.target.value);
  };

  // 정렬 검색 이벤트
  const handledSearchWithSort = (orderBy, orderDir) => {
    setSortedOrder(() => ({ By: orderBy, Dir: orderDir }));
  };

  // 검색 Input Enter 이벤트
  const handledOnSearch = (e) => {
    if (
      e.keyCode === 13 ||
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "SELECT" ||
      e.target.tagName === "INPUT"
    ) {
      if (paginationObj.currentPageNo === 1) {
        selectAdmissionListByCenter();
      } else {
        setPaginationObj({
          currentPageNo: 1,
          pageSize: 10,
          recordCountPerPage: 10,
        });
      }
    }
  };

  const selectedAdmissionId = useRef("");

  const getSelectedAdmissionId = (patientId, { admissionId }) => {
    selectedAdmissionId.current = admissionId;
  };

  // React-Table Table Header
  const admissionTableColumn = [
    {
      Header: "환자ID",
      accessor: "patientId",
      sortedYn: true,
      orderBy: sortedOrder.By,
      orderDiv: sortedOrder.Dir,
      sortedEvent: handledSearchWithSort,
    },
    {
      Header: "환자명",
      accessor: "patientNm",
      sortedYn: true,
      orderBy: sortedOrder.By,
      orderDiv: sortedOrder.Dir,
      sortedEvent: handledSearchWithSort,
    },
    {
      Header: "입소일",
      accessor: "admissionDate",
      sortedYn: true,
      orderBy: sortedOrder.By,
      orderDiv: sortedOrder.Dir,
      sortedEvent: handledSearchWithSort,
    },
    // {
    //   Header: "위치",
    //   accessor: "roomNm",
    //   sortedYn: true,
    //   orderBy: sortedOrder.By,
    //   orderDiv: sortedOrder.Dir,
    //   sortedEvent: handledSearchWithSort,
    // },
    {
      Header: "격리일수",
      accessor: "qantnDay",
      sortedYn: true,
      orderBy: sortedOrder.By,
      orderDiv: sortedOrder.Dir,
      sortedEvent: handledSearchWithSort,
    },
    { Header: "혈압", accessor: "bp", vital: true },
    { Header: "심박수", accessor: "prResult", vital: true },
    { Header: "호흡수", accessor: "rrResult", vital: true },
    { Header: "체온", accessor: "btResult", vital: true },
    { Header: "산소포화도", accessor: "spResult", vital: true },
    {
      Header: "재원상태",
      accessor: "qantnStatus",
      editElement: "AdmissionButton",
    },
  ];
  return (
    <>
      <main className="flex_layout_1row">
        <div className="row">
          <div className="col col-lg-12">
            <div className="card indiv">
              <div className="card-content">
                <div className="table-responsive">
                  <div className="table-header">
                    <form>
                      <div className="d-flex">
                        {/* <div className="tbl_title"></div> */}
                        <div className="me-3 d-flex">
                          {/* <span className="stit">목록타입</span> */}
                          <div style={{ alignSelf: "center" }}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="type"
                              id="isolation-type"
                              defaultChecked={type === "isolation"}
                              value="isolation"
                              onClick={(e) => setType(e.target.value)}
                            />
                            <label
                              className="form-check-label px-1"
                              htmlFor="isolation-type"
                            >
                              자가격리자
                            </label>
                            <br />
                            <input
                              className="form-check-input"
                              type="radio"
                              name="type"
                              id="adimission-type"
                              defaultChecked={type === "admission"}
                              value="admission"
                              onClick={(e) => setType(e.target.value)}
                            />
                            <label
                              className="form-check-label ps-1"
                              htmlFor="adimission-type"
                            >
                              생활치료센터
                            </label>
                          </div>
                        </div>
                        <div className="me-3 d-flex">
                          <span className="stit">센터</span>
                          <select
                            className="form-select"
                            ref={searchAdmissionCenter}
                            value={selectValue}
                            onChange={(e) => {
                              selectAdmissionListByCenter();
                              handledSelect(e);
                            }}
                          >
                            <option value={""}>선택</option>
                            {treatmentCenterList &&
                              treatmentCenterList.map((value) => (
                                <option
                                  key={value.centerId}
                                  value={value.centerId}
                                >
                                  {value.centerNm}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="me-3 d-flex">
                          <span className="stit">환자ID</span>
                          <input
                            className="form-control w160"
                            type="text"
                            defaultValue=""
                            ref={searchAdmissionId}
                            onKeyUp={handledOnSearch}
                          />
                        </div>
                        <div className="me-3 d-flex">
                          <span className="stit">환자명</span>
                          <input
                            className="form-control w160"
                            type="text"
                            defaultValue=""
                            ref={searchAdmissionNm}
                            onKeyUp={handledOnSearch}
                          />
                        </div>
                        <div className="me-3 d-flex">
                          <span className="stit">재원상태</span>
                          <select
                            className="form-select"
                            // defaultValue={""}
                            ref={searchAdmissionState}
                            onChange={(e) => handledOnSearch(e)}
                          >
                            <option value={""}>전체</option>
                            <option value={"1"}>재원중</option>
                            <option value={"2"}>퇴소</option>
                          </select>
                        </div>

                        <div className="ms-auto">
                          <div className="btn_wrap d-flex">
                            <button
                              type="button"
                              className="btn btn-gray"
                              onClick={(e) => handledOnSearch(e)}
                            >
                              검색
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="table-body">
                    <ReactTable
                      tableHeader={admissionTableColumn}
                      tableBody={admissionTableData}
                      sorted={true}
                      customTableStyle={
                        "table table-striped table-hover text-expert"
                      }
                      trOnclick={getSelectedAdmissionId}
                      trDbOnclicke={getSelectedAdmissionId}
                    />
                  </div>
                </div>
              </div>
            </div>
            <br />
            {/*페이징 start*/}
            <Pagination
              paginationObj={paginationObj}
              totalPageCount={totalPageCount}
              handledList={setPaginationObj}
            />
            {/*페이징 end*/}
          </div>
        </div>
      </main>
    </>
  );
}

export default React.memo(AdmissionList);
