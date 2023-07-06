import React, { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "../../component/Pagination";
import ReactTable from "../../component/ReactTable";
import IsolationApi from "../../Apis/IsolationApi";
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import IsolationList from "./IsolationList";
import AddmissionList from "./AdmissionList";
import { useLocation } from "react-router-dom";

function StretcherList() {
  UseSetPageTitle("격리자 리스트");
  const location = useLocation();
  const searchPatientId = useRef("");
  const searchPatientNm = useRef("");

  const [type, setType] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("type")) {
      setType(params.get("type"));
    } else {
      setType("isolation");
    }
  }, []);
  return (
    <>
      {type === "isolation" && (
        <IsolationList
          searchPatientId={searchPatientId}
          searchPatientNm={searchPatientNm}
          type={type}
          setType={setType}
        />
      )}

      {type === "admission" && (
        <AddmissionList
          searchAdmissionId={searchPatientId}
          searchAdmissionNm={searchPatientNm}
          type={type}
          setType={setType}
        />
      )}
    </>
  );
}

export default StretcherList;
