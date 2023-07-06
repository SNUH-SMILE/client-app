import React, {useCallback, useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import Chart from "react-apexcharts"
import ApexCharts from 'apexcharts';
import styled from "styled-components";
import AdmissionDetailApi from "../Apis/AdmissionDetailApi";


const VitalButton = styled.button`
  height: 35px;
  background: ${props => props.show ? '#005580' : 'gray'};
  color: white;
  margin-right: 5px;
`
const VitalSpan = styled.span`
  font-size: 12px;
`
const HealthSignal = styled.span`
  display: inline-block;
  margin: 0 2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: ${props => props.value === 'Y' ? props.color : '#999'} !important;
`
let ko = require("apexcharts/dist/locales/ko.json");


function VitalsignModal({show, handledClose}) {
    const [xAxis,setXAxis] = useState({min:0,max:0,searchDt:''});
    const [btResultList, setBtResultList] = useState([])
    const [sbpResultList, setSbpResultList] = useState([])
    const [dbpResultList, setDbpResultList] = useState([])
    const [rrResultList, setRrResultList] = useState([])
    const [spo2ResultList, setSpo2ResultList] = useState([])
    const [prResultList, setPrResultList] = useState([])
    const [header, setHeader] = useState({})
    const vitalChart = {
        /*데이터 */
        series: [
            {
                name: "수축기",
                type: "line",
                data: sbpResultList
            },
            {
                name: "이완기",
                type: "line",
                data: dbpResultList
            },
            {
                name: "심박수",
                type: "line",
                data: prResultList
            },
            {
                name: "호흡수",
                type: "line",
                data: rrResultList,
            },
            {
                name: "체온",
                type: "line",
                data: btResultList
            },
            {
                name: "산소포화도",
                type: "line",
                data: spo2ResultList
            },
        ],
        options: {
            chart: {
                id: 'vitalChart',
                height: 550,
                type: "line",
                toolbar: {
                    show: true,
                    tools:{
                        download:false

                    },
                },
                /*초기 또는 데이터 업데이트 중에 발생하는 모든 애니메이션을 활성화 또는 비활성화합니다.*/
                animations: {
                    enabled: false
                },
                locales: [ko],
                defaultLocale: 'ko'
            },
            export: {
                csv: {
                    filename: undefined,
                    columnDelimiter: ',',
                    headerCategory: 'category',
                    headerValue: 'value',
                    dateFormatter(timestamp) {
                        return new Date(timestamp).toDateString()
                    }
                },
            },
            colors: ["#9CBAE3", "#646464", "#E73323", "#F4C243", "#A1CE63", "#67359A",],
            /*포인트*/
            markers: {
                size: 5,
                hover: {
                    size: 3
                }
            },
            /*사용자가 차트 영역 위로 마우스를 가져가면 툴팁을 표시합니다.*/
            tooltip: {
                enabled: true,
                enabledOnSeries: undefined,
                shared: true,/*시리즈가 여러개인 툴팁 다 한꺼번에 표시*/
                followCursor: false,
                intersect: false,/*정확한 포인터에서만 툴팁을 표시*/
                inverseOrder: false,
                x: {/*툴팁 맨 위에 타이틀*/
                    show: true,
                    formatter: function (value) {
                        const xTitleDate = new Date(value);
                        const xTitleDateMonth = xTitleDate.getMonth() + 1 > 9 ? (xTitleDate.getMonth() + 1).toString() : '0' + (xTitleDate.getMonth() + 1).toString()
                        const xTitleDateDay = xTitleDate.getDate() > 9 ? xTitleDate.getDate().toString() : '0' + xTitleDate.getDate().toString()
                        const xTitleDateHour = xTitleDate.getHours() > 9 ? xTitleDate.getHours().toString() : '0' + xTitleDate.getHours().toString()
                        const xTitleDateMinute = xTitleDate.getMinutes() > 9 ? xTitleDate.getMinutes().toString() : '0' + xTitleDate.getMinutes().toString()
                        const xTitle = xTitleDateMonth + '/' + xTitleDateDay + ' ' + xTitleDateHour + ':' + xTitleDateMinute;
                        return (xTitle);
                    }
                },
                fillSeriesColor: false,
                theme: false,
                style: {
                    fontSize: '12px',
                    fontFamily: undefined,
                },
                background: {
                    enabled: true,
                    foreColor: '#fff'
                },
                onDatasetHover: {
                    highlightDataSeries: true,
                },
            },
            /*툴팁 위에 데이터 보여지는것*/
            dataLabels: {
                enabled: false,
                enabledOnSeries: [0, 1, 2, 3, 4],
                style: {
                    colors: ["#9CBAE3", "#646464", "#E73323", "#F4C243", "#A1CE63", "#67359A",],
                },
                background: {
                    enabled: true,
                    foreColor: '#fff',
                    borderRadius: 2,
                    padding: 4,
                    opacity: 0.9,
                    borderWidth: 1,
                    borderColor: '#fff'
                },
            },
            /*데이터 선*/
            stroke: {
                width: 3,
                curve: "straight",
            },
            title: {
                text: '',
                align: 'left'
            },
            /*막대형차트로 변경*/
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 10
                },
            },
            /*그래프 아래에 색상채우는것*/
            fill: {
                //opacity: [0.85, 0.25, 1],
                gradient: {
                    inverseColors: false,
                    shade: "light",
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100],
                },
            },
            xaxis: {
                title: {
                    text: xAxis.searchDt,
                },
                min: xAxis.min,
                max: xAxis.max,
                type: 'datetime',
                tooltip: {
                    enabled: false
                },
                labels: {
                    datetimeUTC: false
                }
            },
            yaxis: {
                title: {
                    text: "",
                },
                min: 0,
                max: 150,
                tickAmount: 5,
                tooltip: {
                    enabled: false
                }
            },
            /*차트 범례 */
            legend: {
                show: false,
                position: "bottom",
                offsetY: -10,
                offsetX: -5,
                markers: {
                    width: 20,
                    height: 0,
                },
                onItemHover: {
                    highlightDataSeries: false
                }
            }
        }
    }

    const [vitalAllButton, setVitalAllButton] = useState(true)
    const [vitalButton, setVitalButton] = useState({
        bp: true,  //혈압
        pr: true,  // 심박수
        rr: true,  // 호흡
        bt: true,  // 체온
        sp: true,  // 산소포화도
    });

    const admissionDetailApi=new AdmissionDetailApi(localStorage.getItem('admissionId'));
    const getChartHeader = ()=>{
        admissionDetailApi.getVitalChartHeader().then(({data}) => {
            setHeader(data.result)
            setVitalCheckDate(data.result.searchDtList[0])
        });
    }
    const showAllSeries = () =>{
        ApexCharts.exec('vitalChart', 'showSeries', '이완기')
        ApexCharts.exec('vitalChart', 'showSeries', '수축기')
        ApexCharts.exec('vitalChart', 'showSeries', '심박수')
        ApexCharts.exec('vitalChart', 'showSeries', '호흡수')
        ApexCharts.exec('vitalChart', 'showSeries', '산소포화도')
        ApexCharts.exec('vitalChart', 'showSeries', '체온')
    }
    useEffect(() => {
        if (show) {
            getChartHeader()
            if (vitalAllButton) {
                showAllSeries()
            }
        } else {
            setVitalAllButton(true);
            setVitalButton({
                bp: true,  //혈압
                pr: true,  // 심박수
                rr: true,  // 호흡
                bt: true,  // 체온
                sp: true,  // 산소포화도
            })
        }

    }, [show])
    useEffect(() => {
        if (Object.keys(vitalButton).every(value => vitalButton[value])) {
            setVitalAllButton(true);
        } else {
            setVitalAllButton(false);
        }
    }, [vitalButton])

    function allSeries() {
        setVitalAllButton((prevState) => {
            if (!prevState) {
                showAllSeries()
            } else {
                ApexCharts.exec('vitalChart', 'hideSeries', '이완기')
                ApexCharts.exec('vitalChart', 'hideSeries', '수축기')
                ApexCharts.exec('vitalChart', 'hideSeries', '심박수')
                ApexCharts.exec('vitalChart', 'hideSeries', '호흡수')
                ApexCharts.exec('vitalChart', 'hideSeries', '산소포화도')
                ApexCharts.exec('vitalChart', 'hideSeries', '체온')
            }
            return !prevState
        })
        setVitalButton(() => ({
            bp: !vitalAllButton,  //혈압
            pr: !vitalAllButton,  // 심박수
            rr: !vitalAllButton,  // 호흡
            bt: !vitalAllButton,  // 체온
            sp: !vitalAllButton,  // 산소포화도
        }))
    }

    function toggleSeries(e, seriesName) {
        const {name} = e.currentTarget
        setVitalButton((prevValue) => ({
            ...prevValue,
            [name]: !prevValue[name]
        }))
        if (seriesName === '혈압') {
            ApexCharts.exec('vitalChart', 'toggleSeries', '이완기')
            ApexCharts.exec('vitalChart', 'toggleSeries', '수축기')
        } else {
            ApexCharts.exec('vitalChart', 'toggleSeries', seriesName)
        }

    }
    const [rangeValue, setRangeValue] = useState();
    const handledRangeValue = useCallback(e=>{
        setRangeValue(e.target.value);
        setVitalCheckDate(header.searchDtList[e.target.value]);
    })
    const [vitalCheckDate,setVitalCheckDate] = useState('');
    const handledVitalCheckDate = (e)=>{
        setVitalCheckDate(e.target.value);
    }
    useEffect(()=>{
        vitalCheckDate&&admissionDetailApi.getVitalData(vitalCheckDate).then(({data}) => {
            setXAxis({
                min:data.result.min,
                max:data.result.max,
                searchDt:data.result.searchDt,
            })
            setBtResultList(data.result.btResultList);
            setSbpResultList(data.result.sbpResultList);
            setDbpResultList(data.result.dbpResultList);
            setRrResultList(data.result.rrResultList);
            setSpo2ResultList(data.result.spo2ResultList);
            setPrResultList(data.result.prResultList);
        });
        setVitalAllButton(true);
        setVitalButton({
            bp: true,  //혈압
            pr: true,  // 심박수
            rr: true,  // 호흡
            bt: true,  // 체온
            sp: true,  // 산소포화도
        })
    },[vitalCheckDate])

    return (
        <Modal show={show}
               onHide={handledClose}
               className={'VSdetailViewModal'}
               dialogClassName={'modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xlg'}
        >
            <Modal.Header closeButton>
                <div className="d-flex">
                    <div className="bts2 d-flex">
                        <HealthSignal value={header.healthSignalVO?.signal1Yn} color={'#3ed06f'}/>
                        <HealthSignal value={header.healthSignalVO?.signal2Yn} color={'#d03e3e'}/>
                    </div>
                    <h5 className="modal-title is-bar" id="VSdetailViewModal">{header.dispPatientNmInfo}</h5>
                </div>
                <div className="me-4 d-flex">
                    <span className="dtit">생년월일</span>
                    <strong className="dcon">{header.dispBirthDateInfo }</strong>
                </div>
                <div className="me-4 d-flex">
                    <span className="dtit">환자번호</span>
                    <strong className="dcon">{header.patientId }</strong>
                </div>
                <div className="me-4 d-flex">
                    <span className="dtit">연락처</span>
                    <strong className="dcon">{header.dispCellPhoneInfo}</strong>
                </div>
                <div className="me-4 d-flex" style={{marginLeft:'450px'}}>
                   {/* <span className="dtit">측정일</span>
                    <input type="range" min={0}
                           max={header.searchDtList&&header.searchDtList.length-1}
                           onMouseUp={(e)=>handledRangeValue(e)}
                           value ={header.searchDtList&&header.searchDtList.map[rangeValue]}/>*/}
                </div>
            </Modal.Header>
            <Modal.Body style={{paddingTop:'15px',overflow:'hidden'}}>
                <div className={'d-flex align-items-center mb-1'}>
                    <span className={'me-1 dtit'}>측정일</span>
                    <select className={'form-select'}
                            style={{maxWidth:'130px'}}
                            value={vitalCheckDate}
                            onChange={(e)=>handledVitalCheckDate(e)}
                    >
                        {
                            header.searchDtList&&header.searchDtList.map(value=>
                                <option key={value} value={value}>{value}</option>
                            )
                        }
                    </select>
                </div>
                <div className="card inchart">
                    <div className='d-flex justify-content-around'>
                        <VitalButton className='btn btn-sm p-1' name='all' show={vitalAllButton}
                                     onClick={allSeries}>
                            전체
                        </VitalButton>
                        <div className={'d-flex'}>
                            <VitalButton className='btn btn-sm p-1' name='bp' show={vitalButton.bp}
                                         onClick={(e) => toggleSeries(e, '혈압')}>
                                혈압
                            </VitalButton>
                            <div className={'d-flex flex-column'}>
                                <VitalSpan><span style={{color: "#9CBAE3"}}>■</span>수축기</VitalSpan>
                                <VitalSpan><span style={{color: "#646464"}}>■</span>이완기</VitalSpan>
                            </div>
                        </div>
                        <div>
                            <VitalButton className='btn btn-sm p-1' name='pr' show={vitalButton.pr}
                                         onClick={(e) => toggleSeries(e, '심박수')}>
                                심박수
                            </VitalButton>
                            <VitalSpan style={{color: "#E73323"}}>■</VitalSpan>
                        </div>
                        <div>
                            <VitalButton className='btn btn-sm p-1' name='rr' show={vitalButton.rr}
                                         onClick={(e) => toggleSeries(e, '호흡수')}>
                                호흡수
                            </VitalButton>
                            <VitalSpan style={{color: "#F4C243"}}>■</VitalSpan>
                        </div>
                        <div>
                            <VitalButton className='btn btn-sm p-1' name='bt' show={vitalButton.bt}
                                         onClick={(e) => toggleSeries(e, '체온')}>
                                체온
                            </VitalButton>
                            <VitalSpan style={{color: "#A1CE63"}}>■</VitalSpan>
                        </div>
                        <div>
                            <VitalButton className='btn btn-sm p-1' name='sp' show={vitalButton.sp}
                                         onClick={(e) => toggleSeries(e, '산소포화도')}>
                                산소포화도
                            </VitalButton>
                            <VitalSpan style={{color: "#67359A"}}>■</VitalSpan>
                        </div>
                    </div>
                    <Chart
                        id={'vitalChart'}
                        options={vitalChart.options}
                        series={vitalChart.series}
                        type="bar"
                        height="500"
                        // width="1600"
                        width="100%"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    );
}

export default VitalsignModal;