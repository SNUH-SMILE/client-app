/**
 * @file : IITP_MAIN_V001.js 메인
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};
var _onRestore = function(){
	init.setView();
};

var init = {
	setView : function(){
        mainAllData();
        $('[data-research]').hide();

        getMainInfo();
	},
	setEvent : function(){
        $('[data-research]').on("click",function(){
            var url = $(this).find('button').data('url');
            MAPI.apps.browser(url);
        });

        $("[data-page-move]").on("click",function(){
            var pageUrl = $(this).data("page-move");
            MAPI.page.html(pageUrl,"","NEW_SCR");
        });

        $("#updateBtn").on("click",function(){
            var pageUrl = $(this).data("page-move");
            MAPI.page.html(pageUrl,"","NEW_SCR");
        });
	}
};

function getMainInfo(){
    MAPI.net.send(
        ServerPath.MAIN,
        {
            loginId : MAPI.data.storage("g","LOGIN_ID")
        },
        function(receivedData){
            if(receivedData.code == '00'){
                $("#patientNm").text(receivedData.patientNm);
                $("#personCharge").text(receivedData.personCharge);
                switch(getCheckListType(receivedData.admissionDate, receivedData.dischargeScheduledDate)){
                    case 1:
                    MAPI.pop.toast("초기 문진을 입력하세요.- 해당 문진은 한번만 입력하면 됩니다.");
                    $('#firstResearch').find("button").data("url",Type.FIRST_RESEARCH_URL);
                    $('#firstResearch').show();
                    break;
                    case 2:
                    $('#firstResearch').find("button").data("url",Type.FIRST_RESEARCH_URL);
                    $('#midResearch').find("button").data("url",Type.MID_RESEARCH_URL);
                    $('#firstResearch').show();
                    $('#midResearch').show();
                    break;
                    case 3:
                    MAPI.pop.toast("퇴소 문진을 입력하세요.- 해당 문진은 한번만 입력하면 됩니다.");
                    $('#finalResearch').find("button").data("url",Type.FINAL_RESEARCH_URL);
                    $('#finalResearch').show();
                    break;
                }

                //var loginTimeStr = MAPI.data.storage("g",MAPI.data.storage("g","LOGIN_ID")+"_LOGIN_TIME");
                var loginTime = moment(receivedData.admissionDate,"YYYYMMDD").format(Definition.YMDFORMAT7);
                var lastDay = moment(receivedData.dischargeScheduledDate,"YYYYMMDD").format(Definition.YMDFORMAT7);
                $("#period").text("격리 기간 : "+loginTime+" ~ "+lastDay);
                $("#updateTime>span").text(moment(Number(MAPI.data.param("g","updateTime"))).format(Definition.YMDFORMAT6)+" ");

                mainAllResult(receivedData);

                MAPI.location.current(function(result){
                    var lat = Number(result.latitude);
                    var lng = Number(result.longitude);
                    var addrLatLng = MAPI.data.global("g","LOGIN_USER_INFO");
                    var distance = getDistanceFromLatLon(lat,lng,addrLatLng.lat,addrLatLng.lng);
                    if(distance > 20){
                        $(".leaving-b").removeClass("none");
                        $(".normal-b").addClass("none");
                    }else{
                        $(".leaving-b").addClass("none");
                        $(".normal-b").removeClass("none");
                    }
                });
            }else{
                MAPI.pop.alert(receivedData.message);
            }
        },
        function(){
            MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
        }
    );
}

function mainAllData(){
	M.execute('exMainAllData',"mainAllResult");
}
function mainAllResult(result){
    Global.tuneData = makeAllDataArr(result);
    Global.totalSleepTime = result.todayTotalSleepTime;
    console.log(Global.tuneData);
    drawHrChart(Global.tuneData.hrList);
    drawStepChart(Global.tuneData.stepCountList);
    drawBpChart(Global.tuneData.bpList);
    drawBtChart(Global.tuneData.btList);
    drawSleepChart(Global.tuneData.sleepList);
    drawSpO2Chart(Global.tuneData.spList);
}

function drawHrChart(row){

if(isEmpty(row)){
    $("#hrChartCont").find(".chart-inner").addClass("none");
    $("#lastHR").addClass("none");
    $("#hrChartCont").find(".chart-none").removeClass("none");
    return;
}else{
    $("#hrChartCont").find(".chart-inner").removeClass("none");
    $("#hrChartCont").find(".chart-none").addClass("none");
    $("#lastHR").removeClass("none").html(row.data[row.data.length-1]+"회/분");
}

/*******************심박수 차트 시작***************/
var heartrateData = {
    type: 'line',
    label: 'Line Dataset',
    data: row.data, //[123, 114, 92, 128, 105, 73, 107, 85],
    lineTension: 0,
    fill: false,
    borderWidth: 1,
    borderColor: '#648ee5',
    order: 1,
    // radius: 1,
    pointRadius: 0,
    pointHoverRadius: 0,
}

// 체온 차트 시작
var Chart3 = new Chart(heartChart, {
    data: {
        datasets: [heartrateData],
        labels: row.labels,//['11:00', '12:00', '13:00', '14:00'],
    },
    options: {
        // responsive: false,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                // left: 23,
                // right: 20
            }
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        scales: {
            yAxes: [{
                weight: 10,
                offset: true,
                gridLines: {
                    // 가로선
                    drawOnChartArea: false,
                    drawBorder: true,
                    color: '#979797',
                    drawTicks: false,
                    // offset: false
                },
                ticks: {
                    // autoSkip: true,
                    min: 35,
                    // max: 38,
                    stepSize: 1,
                    beginAtZero: true,
                    padding: 3,
                    fontColor: '#979797',
                    fontSize: 12,
                    // tickMarkLength: 10
                }
            }],
            xAxes: [{
                offset: true,
                gridLines: {
                    offsetGridLines: true,
                    padding: 3,
                    drawOnChartArea: false,
                    drawTicks: false,
                    color: '#979797',
                },

                ticks: {
                    maxTicksLimit: 20,
                    fontColor: '#979797',
                    fontSize: 12,
                    stepSize: 1,
                    beginAtZero: false,
                    padding: 8
                }
            }]
        },
    }
});
/*******************심박수 차트 끝***************/
}

function drawStepChart(row){
if(isEmpty(row)){
    $("#stepChartCont").find(".chart-inner").addClass("none");
    $("#stepChartCont").find(".chart-none").removeClass("none");
    $("#totalStep").addClass("none");
    return;
}else{
    $("#stepChartCont").find(".chart-inner").removeClass("none");
    $("#stepChartCont").find(".chart-none").addClass("none");
    var totalStep = 0;
    for(var j = 0; j < row.data.length; j++){
        totalStep += Number(row.data[j]);
    }
    $("#totalStep").removeClass("none").html(totalStep);
}
/*************걸음수 차트 시작****************/
var Chart1 = new Chart(walkChart, {
    type: 'bar',
    data: {
        labels: row.labels, //['11:00', '12:00', '13:00', '14:00',],
        datasets: [
            {
                backgroundColor: "transparent",
                hoverBackgroundColor: 'transparent',
                borderColor: '#5782e1',
                borderWidth: 1,
                minBarThickness: 10,
                maxBarThickness: 15,
                categoryPercentage: .5,
                data: row.data
            }
        ]
    },
    options: {
        // responsive: false,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10
            }
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        scales: {
            yAxes: [{
                offset: true,
                gridLines: {
                    // 가로선
                    drawOnChartArea: false,
                    drawBorder: true,
                    color: '#979797',
                    drawTicks: false,
                    // offset: false
                },
                ticks: {
                    // // autoSkip: true,
                    // min: 50,
                    // // max: 38,
                    stepSize: 500,
                    beginAtZero: true,
                    padding: 3,
                    fontColor: '#979797',
                    fontSize: 12,
                    // // tickMarkLength: 10
                }
            }],
            xAxes: [{
                offset: true,
                gridLines: {
                    padding: 3,
                    drawOnChartArea: false,
                    drawTicks: false,
                    color: '#979797',
                },

                ticks: {
                    fontColor: '#979797',
                    fontSize: 12,
                    stepSize: 1,
                    beginAtZero: false,
                    padding: 8,

                    maxTicksLimit: 20,
                }
            }]
        },
    }
});
/*************걸음수 차트 끝****************/
}

function drawBpChart(row){
if(isEmpty(row)){
    $("#bpChartCont").find(".chart-inner").addClass("none");
    $("#bpChartCont").find(".chart-none").removeClass("none");
    $("#lastBP").addClass("none");
    return;
}else{
    $("#bpChartCont").find(".chart-inner").removeClass("none");
    $("#bpChartCont").find(".chart-none").addClass("none");
    $("#lastBP").removeClass("none").html(row.data.setData[row.data.setData.length-1][0]+"mmHg&nbsp;/&nbsp;"+row.data.setData[row.data.setData.length-1][1]+"mmHg");
}
/*******************혈압 차트 시작***************/
var pointRed = new Image();
pointRed.src = '../img/chart-mark4.svg';

var pointRedac = new Image();
pointRedac.src = '../img/chart-mark4-ac.svg';

var pointBlue = new Image();
pointBlue.src = '../img/chart-mark3.svg';

var pointBlueac = new Image();
pointBlueac.src = '../img/chart-mark3-ac.svg'

var ctx = document.getElementById('bloodChart').getContext("2d");
var gradientStroke = ctx.createLinearGradient(0, 40, 0, 105);
gradientStroke.addColorStop(0, '#e46060');
gradientStroke.addColorStop(1, '#638de5');

var bar = {
    type: 'bar',
    // 최저, 최고 데이터 순으로 넣으시면 됩니다.
    data: row.data.setData,//[[77, 100], [65, 80], [50, 60], [64, 120]],
    maxBarThickness: 1,
    backgroundColor: gradientStroke,
}
// 최저 데이터 따로
var lowPressure = {
    type: 'line',
    data: row.data.lowData,//[77, 65, 50, 64],
    fill: false,
    pointStyle: pointBlue,//[pointBlue, pointBlue, pointBlue, pointBlueac],
    pointHoverStyle: pointBlue,//[pointBlue, pointBlue, pointBlue, pointBlueac],
    showLine: false,
    pointBackgroundColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointBorderColor: '#608ae4',
    pointRadius: 10,
    pointHoverRadius: 10,
}

// 최고 데이터 따로
var highPressure = {
    type: 'line',
    data: row.data.highData,//[100, 80, 60, 120],
    fill: false,
    pointStyle: pointRed, //[pointRed, pointRed, pointRed, pointRedac],
    pointHoverStyle: pointRed, //[pointRed, pointRed, pointRed, pointRedac],
    showLine: false,
    pointBackgroundColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointBorderColor: '#e46060',
    pointRadius: 10,
    pointHoverRadius: 10,
}

// 혈압 차트 시작
var Chart5 = new Chart(bloodChart, {

    type: 'line',
    label: 'Line Dataset',
    data: {
        labels: row.labels,//['11:00', '12:00', '13:00', '14:00'],
        datasets: [lowPressure, highPressure, bar],
    },
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                // left: 16,
                // right: 21
            }
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        scales: {
            yAxes: [{
                offset: true,
                gridLines: {
                    borderDash: [2],
                    color: '#979797',
                    drawTicks: false,
                    offset: true,

                },
                ticks: {
                    min: 50,
                    stepSize: 50,
                    beginAtZero: true,
                    padding: 3,
                    fontColor: '#979797',
                    fontSize: 12,
                }
            }],
            xAxes: [{
                offset: true,
                gridLines: {
                    drawOnChartArea: false,
                    drawTicks: false,
                    color: '#979797',
                },
                ticks: {
                    fontColor: '#979797',
                    fontSize: 12,
                    stepSize: 1,
                    beginAtZero: true,
                    padding: 8
                }
            }]
        }
    }
});
/*******************혈압 차트 끝***************/
}

function drawBtChart(row){
if(isEmpty(row)){
    $("#btChartCont").find(".chart-inner").addClass("none");
    $("#btChartCont").find(".chart-none").removeClass("none");
    $("#lastBT").addClass("none");
    return;
}else{
    $("#btChartCont").find(".chart-inner").removeClass("none");
    $("#btChartCont").find(".chart-none").addClass("none");
    $("#lastBT").removeClass("none").html(row.data[row.data.length-1]+"&deg;C");
}
/******************* 체온차트 시작 ***************/
var mark2 = new Image();
mark2.src = '../img/chart-mark2.svg';

var mytempData = {
    type: 'line',
    label: 'Line Dataset',
    data: row.data,//[36.5, 36.4, 38, 38.6],
    lineTension: 0,
    fill: false,
    borderWidth: 1,
    borderColor: '#648ee5',
    order: 1,
    // radius: 1,
    pointRadius: 7,
    pointHoverRadius: 7,
    pointBackgroundColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    // 포인트 스타일
    pointStyle: mark2,//['circle', 'circle', 'circle', mark2],
    pointHoverStyle: mark2,//['circle', 'circle', 'circle', mark2],
}

// 체온 차트 시작
var Chart2 = new Chart(tempChart, {
    data: {
        datasets: [mytempData],
        labels: row.labels,//['11:00', '12:00', '13:00', '14:00'],
    },
    options: {
        maintainAspectRatio: false,
        // responsive: false,
        "horizontalLine": [{
            "y": 36.5,
            "style": "#648ee5",
        }],
        layout: {
            padding: {
                top: 10,
            }
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        scales: {
            yAxes: [{
                weight: 10,
                offset: true,
                gridLines: {
                    // 가로선
                    drawOnChartArea: false,
                    drawBorder: true,
                    color: '#979797',
                    drawTicks: false,
                    // offset: false
                },
                ticks: {
                    // autoSkip: true,
                    min: 35,
                    // max: 38,
                    stepSize: 1,
                    padding: 3,
                    beginAtZero: true,
                    fontColor: '#979797',
                    fontSize: 12,
                    // tickMarkLength: 10
                }
            }],
            xAxes: [{
                offset: true,
                gridLines: {
                    offsetGridLines: true,
                    padding: 3,
                    drawOnChartArea: false,
                    drawTicks: false,
                    color: '#979797',
                },

                ticks: {
                    maxTicksLimit: 20,
                    fontColor: '#979797',
                    fontSize: 12,
                    stepSize: 1,
                    beginAtZero: false,
                    padding: 8
                }
            }]
        },
    }
});
/******************* 체온차트 끝 ***************/
}

function drawSleepChart(row){
if(isEmpty(row.data)){
    $("#sleepChartCont").find(".chart-inner").parent().addClass("none");
    $("#sleepChartCont").find(".chart-none").removeClass("none");
    $("#totalSleepTime").addClass("none");
    return;
}else{
    $("#sleepChartCont").find(".chart-inner").parent().removeClass("none");
    $("#sleepChartCont").find(".chart-none").addClass("none");
    var totalMin = row.labels[row.labels.length-1].diffSum;
    var totalHour = parseInt(totalMin / 60);
    totalMin = totalMin % 60;
    $("#totalSleepTime").removeClass("none").html(totalHour+"시간&nbsp;"+totalMin+"분");
}
/****************수면 차트 시작**************/

var startDt = moment(row.labels[0].sleepStartTime,"YYYYMMDDHHmm");
var nextHourDt = startDt.add(1,"hours");
var nextHour = nextHourDt.format('HH')+":00";
nextHourDt = moment(nextHour,"HH:mm");
var endDt = moment(row.labels[row.labels.length - 1].sleepEndTime,"YYYYMMDDHHmm");
var finalHour = endDt.format('HH')+":00";
var finalHourDt = moment(finalHour,"HH:mm");
var nextDiff = moment.duration(nextHourDt.diff(startDt.add(-1,"hours"))).asMinutes();
var hourDiff = moment.duration(finalHourDt.diff(nextHourDt)).asHours();
var difArr = [];
for(var i = 0; i <= hourDiff; i++){
    difArr.push(nextDiff + (60 * i));
}
nextHourDt.add(-1,"hours");

console.log(difArr);

var Chart4 = new Chart(sleepChart, {
    type: 'horizontalBar',
    data: {
        labels: ["2021"],
        datasets: row.data,
    },
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                left: 20,
                // right: 20,
                bottom: 8
            }
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        scales: {
            xAxes: [{
                offset: true,
                // display: true,
                stacked: true,
                gridLines: {
                    padding: 3,
                    drawOnChartArea: false,
                    drawTicks: false,
                    color: '#979797',
                },
                ticks: {
                    autoSkip : false,
                    min: 0,
                    max: row.labels[row.labels.length - 1].diffSum,
                    stepSize: 1,
                    callback: function(label, index, labels) {
                        var returnData = "";
                        if(difArr.indexOf(label) > -1){
                            returnData = nextHourDt.add(1,'hours').format("HH:mm");
                            return returnData;
                        }else{
                            switch (label) {
                                case 0 :
                                    return moment(row.labels[0].sleepStartTime,"YYYYMMDDHHmm").format('HH:mm');
                                case row.labels[row.labels.length - 1].diffSum :
                                    return moment(row.labels[row.labels.length - 1].sleepEndTime,"YYYYMMDDHHmm").format('HH:mm');
                                default :
                                    return "";
                            }
                        }
                    }
                }
            }],
            yAxes: [{
                // display: true,
                stacked: true,
                gridLines: {
                    // 가로선
                    drawOnChartArea: false,
                    drawBorder: true,
                    color: '#979797',
                    drawTicks: false,
                    // offset: false
                },
                ticks: {
                    display: false
                    // crossAlign: bottom
                }
            }]
        }
    }
});

/****************수면 차트 끝**************/
}

function drawSpO2Chart(row){
if(isEmpty(row)){
    $("#spChartCont").find(".chart-inner").addClass("none");
    $("#spChartCont").find(".chart-none").removeClass("none");
    $("#lastSPO2").addClass("none");
    return;
}else{
    $("#spChartCont").find(".chart-inner").removeClass("none");
    $("#spChartCont").find(".chart-none").addClass("none");
    $("#lastSPO2").removeClass("none").html(row.data[row.data.length-1]+"%");
}
/****************산소포화도 차트 시작**************/
// line chart 산소 기준 데이터

var myoxygen = {
    type: 'line',
    label: 'Line Dataset',
    data: row.data,//[36.5, 36.4, 38, 38.6],
    lineTension: 0,
    fill: false,
    borderWidth: 1,
    borderColor: '#648ee5',
    order: 1,
    // radius: 1,
    pointRadius: 8,
    pointHoverRadius: 8,
    pointBackgroundColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    borderDash: [2],
    // pointStyle: myIcon
    // 포인트 스타일
    pointStyle: mark2,//['circle', 'circle', 'circle', mark2],
    pointHoverStyle: mark2//['circle', 'circle', 'circle', mark2],
}

// 산소 차트 시작
var Chart6 = new Chart(oxygenChart, {
    data: {
        datasets: [myoxygen],
        labels: row.labels//['11:00', '12:00', '13:00', '14:00'],
    },
    options: {
        // responsive: false,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                // left: 23,
                // right: 20
            }
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        scales: {
            yAxes: [{
                weight: 10,
                offset: true,
                gridLines: {
                    borderDash: [2],
                    color: '#979797',
                    drawTicks: false,
                    offset: true,
                },
                ticks: {
                    // autoSkip: true,
                    min: 80,
                    max: 100,
                    stepSize: 5,
                    beginAtZero: true,
                    padding: 3,
                    fontColor: '#979797',
                    fontSize: 12,
                    // tickMarkLength: 10
                }
            }],
            xAxes: [{
                offset: true,
                gridLines: {
                    offsetGridLines: true,
                    padding: 3,
                    drawOnChartArea: false,
                    drawTicks: false,
                    color: '#979797',
                },
                ticks: {
                    maxTicksLimit: 20,
                    fontColor: '#979797',
                    fontSize: 12,
                    stepSize: 1,
                    beginAtZero: false,
                    padding: 8
                }
            }]
        },
    }
});
/****************산소포화도 차트 끝**************/
}