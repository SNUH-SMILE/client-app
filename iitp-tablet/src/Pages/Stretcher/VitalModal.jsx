import { useContext, useEffect, useRef, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { TitleContext } from "../../Providers/TitleContext";
import AdmissionDetailApi from "../../Apis/AdmissionDetailApi";

const dateToString = (time) => {
  const date = new Date();
  date.setTime(time);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const H = date.getHours();
  const M = date.getMinutes();

  return {
    searchDate: `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`,
    searchTime: `${H}:${M < 10 ? "0" + M : M}`,
  };
};

function BpTable({ list }) {
  const Content = list.map(({ searchDt, bpList }, p_i) =>
    bpList.map(({ sbp, dbp, searchTime, searchDate }, index) => {
      const key = `bp-row-${p_i}-${index}`;
      if (index === 0) {
        return (
          <tr key={key}>
            <td rowSpan={bpList.length}>{searchDate}</td>
            <td>{searchTime}</td>
            <td>{sbp || "-"}</td>
            <td>{dbp || "-"}</td>
          </tr>
        );
      }
      return (
        <tr key={key}>
          <td>{searchTime}</td>
          <td>{sbp || "-"}</td>
          <td>{dbp || "-"}</td>
        </tr>
      );
    })
  );
  return (
    <Table striped>
      <colgroup>
        <col style={{ width: "25%" }} />
        <col style={{ width: "25%" }} />
        <col style={{ width: "25%" }} />
        <col style={{ width: "25%" }} />
      </colgroup>
      <thead>
        <tr>
          <th>측정일</th>
          <th>측정시간</th>
          <th>수축기 혈압{"(mmHg)"}</th>
          <th>이완기 혈압{"(mmHg)"}</th>
        </tr>
      </thead>
      <tbody>
        {Content}
        {list.length === 0 && (
          <tr>
            <td className="p-3 text-center" colSpan={4}>
              조회된 데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

function PrTable({ list }) {
  const Content = list.map(({ searchDt, prList }, p_i) => {
    return prList.map(({ value, searchTime, searchDate }, index) => {
      const key = `pr-row-${p_i}-${index}`;
      if (index === 0) {
        return (
          <tr key={key}>
            <td rowSpan={prList.length}>{searchDate}</td>
            <td>{searchTime}</td>
            <td>{value || "-"}</td>
          </tr>
        );
      }
      return (
        <tr key={key}>
          <td>{searchTime}</td>
          <td>{value || "-"}</td>
        </tr>
      );
    });
  });
  return (
    <Table striped>
      <colgroup>
        <col style={{ width: "33%" }} />
        <col style={{ width: "33%" }} />
        <col style={{ width: "33%" }} />
      </colgroup>
      <thead>
        <tr>
          <th>측정일</th>
          <th>측정시간</th>
          <th>심박수(회/분)</th>
        </tr>
      </thead>
      <tbody>
        {Content}
        {list.length === 0 && (
          <tr>
            <td className="p-3 text-center" colSpan={3}>
              조회된 데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

function RrTable({ list }) {
  const Content = list.map(({ searchDt, rrList }, p_i) => {
    return rrList.map(({ value, searchTime, searchDate }, index) => {
      const key = `rr-row-${p_i}-${index}`;
      if (index === 0) {
        return (
          <tr key={key}>
            <td rowSpan={rrList.length}>{searchDate}</td>
            <td>{searchTime}</td>
            <td>{value || "-"}</td>
          </tr>
        );
      }
      return (
        <tr key={key}>
          <td>{searchTime}</td>
          <td>{value || "-"}</td>
        </tr>
      );
    });
  });
  return (
    <Table striped>
      <colgroup>
        <col style={{ width: "33%" }} />
        <col style={{ width: "33%" }} />
        <col style={{ width: "33%" }} />
      </colgroup>
      <thead>
        <tr>
          <th>측정일</th>
          <th>측정시간</th>
          <th>호흡수(회/분)</th>
        </tr>
      </thead>
      <tbody>
        {Content}
        {list.length === 0 && (
          <tr>
            <td className="p-3 text-center" colSpan={3}>
              조회된 데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

function BtTable({ list }) {
  const Content = list.map(({ searchDt, btList }, p_i) => {
    return btList.map(({ value, searchTime, searchDate }, index) => {
      const key = `bt-row-${p_i}-${index}`;
      if (index === 0) {
        return (
          <tr key={key}>
            <td rowSpan={btList.length}>{searchDate}</td>
            <td>{searchTime}</td>
            <td>{value || "-"}</td>
          </tr>
        );
      }
      return (
        <tr key={key}>
          <td>{searchTime}</td>
          <td>{value || "-"}</td>
        </tr>
      );
    });
  });
  return (
    <Table striped>
      <colgroup>
        <col style={{ width: "33%" }} />
        <col style={{ width: "33%" }} />
        <col style={{ width: "33%" }} />
      </colgroup>
      <thead>
        <tr>
          <th>측정일</th>
          <th>측정시간</th>
          <th>체온(℃)</th>
        </tr>
      </thead>
      <tbody>
        {Content}
        {list.length === 0 && (
          <tr>
            <td className="p-3 text-center" colSpan={3}>
              조회된 데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

function SpoTable({ list }) {
  const Content = list.map(({ searchDt, spo2List }, p_i) => {
    return spo2List.map(({ value, searchTime, searchDate }, index) => {
      const key = `spo-row-${p_i}-${index}`;
      if (index === 0) {
        return (
          <tr key={key}>
            <td rowSpan={spo2List.length}>{searchDate}</td>
            <td>{searchTime}</td>
            <td>{value || "-"}</td>
          </tr>
        );
      }
      return (
        <tr key={key}>
          <td>{searchTime}</td>
          <td>{value || "-"}</td>
        </tr>
      );
    });
  });
  return (
    <Table striped>
      <colgroup>
        <col style={{ width: "33%" }} />
        <col style={{ width: "33%" }} />
        <col style={{ width: "33%" }} />
      </colgroup>
      <thead>
        <tr>
          <th>측정일</th>
          <th>측정시간</th>
          <th>산소포화도(%)</th>
        </tr>
      </thead>
      <tbody>
        {Content}
        {list.length === 0 && (
          <tr>
            <td className="p-3 text-center" colSpan={3}>
              조회된 데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

function TabButton(props) {
  const { children, active, ...others } = props;

  return (
    <div
      {...others}
      className={`${
        active && "bg-primary fw-bold active"
      } tabbutton d-flex justify-content-center  border-bottom align-items-center h-20`}
    >
      {children}
    </div>
  );
}

export default function NotesModal({ show, handledClose }) {
  const [tabIndex, setTabIndex] = useState(0);
  const context = useContext(TitleContext);
  const { dashBoardData } = context;

  const admissionDetailApi = new AdmissionDetailApi(
    localStorage.getItem("admissionId")
  );

  const contentEl = useRef(null);
  const [vitalList, setVitalList] = useState({
    btList: [],
    bpList: [],
    prList: [],
    rrList: [],
    spo2List: [],
  });

  useEffect(() => {
    // if (tabIndex === 0) {
    // } else if (tabIndex === 3) {
    // } else {
    // }
    if (contentEl.current) {
      contentEl.current.scrollTo(0, 0);
    }
  }, [tabIndex]);

  const fetchDatas = async () => {
    const { data } = await admissionDetailApi.getVitalChartHeader();
    const { searchDtList } = data.result;
    const promises = searchDtList.map((dateStr) =>
      admissionDetailApi.getVitalData(dateStr)
    );
    const results = await Promise.all(promises);
    const vitalDatas = results.map(({ data }) => {
      const {
        searchDt,
        btResultList,
        dbpResultList,
        prResultList,
        rrResultList,
        sbpResultList,
        spo2ResultList,
      } = data.result;
      const [btList, dbpList, sbpList, prList, rrList, spo2List] = [
        btResultList,
        dbpResultList,
        sbpResultList,
        prResultList,
        rrResultList,
        spo2ResultList,
      ].map((list) => {
        return list
          .filter(({ y }) => y !== null)
          .map(({ x, y }) => {
            const { searchDate, searchTime } = dateToString(x);
            return {
              time: x,
              searchDate,
              searchTime,
              value: y,
            };
          });
      });
      // spb 수축기 , dpb 이완기
      const bpList = dbpList.map(({ time, searchDate, searchTime, value }) => {
        return {
          searchDate,
          searchTime,
          time,
          dbp: value,
          sbp: null,
        };
      });
      sbpList.forEach(({ time, searchDate, searchTime, value }) => {
        const exist = bpList.find(({ time: _time }) => _time === time);
        if (exist) {
          exist.sbp = value;
        } else {
          bpList.push({
            time,
            searchDate,
            searchTime,
            sbp: value,
            dbp: null,
          });
        }
      });

      return {
        searchDt,
        btList,
        bpList,
        sbpList,
        dbpList,
        prList,
        rrList,
        spo2List,
      };
    });
    const sortByTime = (a, b) => {
      return b.time - a.time;
    };
    const btList = vitalDatas
      .filter(({ btList }) => btList.length > 0)
      .map(({ btList, searchDt }) => {
        return { btList: btList.sort(sortByTime), searchDt };
      });

    const bpList = vitalDatas
      .filter(({ bpList }) => bpList.length > 0)
      .map(({ bpList, searchDt }) => {
        return { bpList: bpList.sort(sortByTime), searchDt };
      });

    const prList = vitalDatas
      .filter(({ prList }) => prList.length > 0)
      .map(({ prList, searchDt }) => {
        return { prList: prList.sort(sortByTime), searchDt };
      });

    const rrList = vitalDatas
      .filter(({ rrList }) => rrList.length > 0)
      .map(({ rrList, searchDt }) => {
        return { rrList: rrList.sort(sortByTime), searchDt };
      });
    const spo2List = vitalDatas
      .filter(({ spo2List }) => spo2List.length > 0)
      .map(({ spo2List, searchDt }) => {
        return { spo2List: spo2List.sort(sortByTime), searchDt };
      });

    const filteredVidatlDatas = {
      btList,
      bpList,
      prList,
      rrList,
      spo2List,
    };
    setVitalList(filteredVidatlDatas);
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  const recentBp =
    vitalList.bpList.length > 0 ? vitalList.bpList[0].bpList[0] : {};
  const recentPr =
    vitalList.prList.length > 0 ? vitalList.prList[0].prList[0] : {};
  const recentRr =
    vitalList.rrList.length > 0 ? vitalList.rrList[0].rrList[0] : {};
  const recentBt =
    vitalList.btList.length > 0 ? vitalList.btList[0].btList[0] : {};
  const recentSpo2 =
    vitalList.spo2List.length > 0 ? vitalList.spo2List[0].spo2List[0] : {};
  return (
    <Modal show={show} onHide={handledClose} size="xl">
      <Modal.Header closeButton>
        <div className="container">
          <div className="row">
            <div className="d-flex col align-content-center">
              <h5 className="mb-0 me-2">활력 징후</h5>
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
                <div className="text-center">
                  <div className="fs-5">혈압</div>
                  <div>
                    {recentBp.dbp}/{recentBp.sbp} mmHg
                  </div>
                </div>
              </TabButton>
              <TabButton active={tabIndex === 1} onClick={() => setTabIndex(1)}>
                <div className="text-center">
                  <div className="fs-5">심박수</div>
                  <div>{recentPr.value} 회/분</div>
                </div>
              </TabButton>
              <TabButton active={tabIndex === 2} onClick={() => setTabIndex(2)}>
                <div className="text-center">
                  <div className="fs-5">호흡수</div>
                  <div>{recentRr.value} 회/분</div>
                </div>
              </TabButton>
              <TabButton active={tabIndex === 3} onClick={() => setTabIndex(3)}>
                <div className="text-center">
                  <div className="fs-5">체온</div>
                  <div>{recentBt.value} ℃</div>
                </div>
              </TabButton>
              <TabButton active={tabIndex === 4} onClick={() => setTabIndex(4)}>
                <div className="text-center">
                  <div className="fs-5">산소포화도</div>
                  <div>{recentSpo2.value} %</div>
                </div>
              </TabButton>
            </div>
            <div
              className="col-10 p-3"
              ref={contentEl}
              style={{ maxHeight: "100%", overflowY: "auto" }}
            >
              {tabIndex === 0 && <BpTable list={vitalList.bpList} />}
              {tabIndex === 1 && <PrTable list={vitalList.prList} />}
              {tabIndex === 2 && <RrTable list={vitalList.rrList} />}
              {tabIndex === 3 && <BtTable list={vitalList.btList} />}
              {tabIndex === 4 && <SpoTable list={vitalList.spo2List} />}
            </div>
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer></Modal.Footer> */}
    </Modal>
  );
}
