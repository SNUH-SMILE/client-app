import React, {useContext, useEffect, useState} from 'react';
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import DashboardCard from "../../component/DashboardCard";
import CenterDashboardApi from "../../Apis/CenterDashboardApi";
import {TitleContext} from "../../Providers/TitleContext";
import useAdmissionDetail from "../../Utils/useAdmissionDetail";

function QuarantinePatientDashboard() {

    UseSetPageTitle('자택격리자 대시보드', 'Quarantine')
    const {onMove} = useAdmissionDetail()
    const [patientList, setPatientList] = useState([]);
    const centerDashboardApi = new CenterDashboardApi();

    const {setDashBoardData, setDashBoardFunc} = useContext(TitleContext);
    const selectPatientList = () => {
        centerDashboardApi.select('1', '')
            .then(({data}) => {
                setPatientList(data.result.patientList)
                setDashBoardData(data.result.header)

            });
    }
    useEffect(() => {
        selectPatientList();
        setDashBoardFunc(() => selectPatientList)
    }, [])
    return (
        <main className="dashboard">
            <div className="row">
                {
                    patientList === [] || patientList.map((value, idx) => {
                        return (
                            <DashboardCard key={idx + value.patientNm + value.room}
                                           mode={'Center'}
                                           data={value}
                                           lightDisplay={'flex'}
                                           onClick={()=>onMove(value.admissionId)}
                            />
                        )
                    })
                }

            </div>
        </main>
    );
}

export default React.memo(QuarantinePatientDashboard);