import React, { useContext, useEffect, useRef, useState } from 'react';
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import DashboardCard from "../../component/DashboardCard";
import {getLonginUserInfo} from "../../Apis/CommonCode";
import CenterDashboardApi from "../../Apis/CenterDashboardApi";
import {TitleContext} from "../../Providers/TitleContext";
import useAdmissionDetail from "../../Utils/useAdmissionDetail";

function CenterAdmissionBoard() {

    UseSetPageTitle('생활치료센터 대시보드', 'Center')

    const {onMove} = useAdmissionDetail()
    const palette = ['#228be6', '#90d094', '#228be6', '#90d094', '#228be6', '#90d094', '#228be6', '#90d094', '#228be6', '#90d094'];
    const paletteNum = useRef(0);
    const [patientList, setPatientList] = useState([]);
    const centerDashboardApi = new CenterDashboardApi();

    const {setDashBoardData,setDashBoardFunc} = useContext(TitleContext);
    const selectPatientList = (centerId) => {
        getLonginUserInfo().then(({data}) => {

            centerDashboardApi.select('2', centerId ? centerId.target.value : data.result.userTreatmentCenterVOList[0].centerId)
                .then(({data}) => {
                    console.log(data)
                    setDashBoardData(()=>({...data.result.header}));
                    setPatientList(()=>data.result.patientList);
                })
        })
    }

    useEffect(() => {
        selectPatientList();
        setDashBoardFunc(()=>selectPatientList)
    }, [])


    return (
        <main className="dashboard">
            <div className="row">
                {
                    patientList === [] || patientList.map((value, idx) => {
                        if (idx <= 0) {
                            paletteNum.current = 0;
                        } else if (paletteNum.current >= palette.length - 1 && value.room !== patientList[idx - 1].room) {
                            paletteNum.current = 0;
                        } else if (idx >= 1 && value.room !== patientList[idx - 1].room) {
                            paletteNum.current++;
                        }
                        return (
                            <DashboardCard key={idx + value.patientNm + value.room}
                                           mode={'Center'}
                                           data={value}
                                           color={palette[paletteNum.current]}
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

export default React.memo(CenterAdmissionBoard);