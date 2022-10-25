/**
 * @file : IITP_BLOOD_V001.js 혈압 (bp)
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};

var init = {
	setView : function(){
	    Global.nowDate = moment();
	    getData();
	},
	setEvent : function(){
        $(".btn-prev").on("click",function(){
            Global.nowDate.add(-1,"days");
            getData();
        });
        $(".btn-next").on("click",function(){
            Global.nowDate.add(1,"days");
            getData();
        });
	}
};

function getData(){
    $("#nowDate").text(Global.nowDate.format(Definition.YMDFORMAT7));
    detailBodyData({
        schDate : Global.nowDate.format("YYYYMMDD"),
        callback : "drawBpChart",
        queryDataType : 'BLOOD'
    });
    MAPI.net.send(
        ServerPath.GET_RESULTS_BP,
        {
            loginId : MAPI.data.storage("g","LOGIN_ID"),
            resultDate : Global.nowDate.format("YYYYMMDD")
        },
        function(receivedData){
            if(receivedData.code == '00'){
                drawBpChart(receivedData)
            }else if(receivedData.code < '99'){
                MAPI.pop.alert(receivedData.message);
            }else{
                MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
            }
        },
        function(){
            MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
        }
    );
}

function drawBpChart(result){
    var row = makeDataArr("bp",result.bpList);

    if(isEmpty(row)){
        $(".chart-inner").addClass("none");
        $(".data-box-cont").addClass("none");
        $(".chart-none").removeClass("none");
        $(".list-cont-box").addClass("none");
        return;
    }else{
        $(".chart-inner").removeClass("none");
        $(".chart-none").addClass("none");
        $(".data-box-cont").removeClass("none").html(row.data.setData[row.data.setData.length-1][0]+"mmHg&nbsp;/&nbsp;"+row.data.setData[row.data.setData.length-1][1]+"mmHg");
        $(".list-cont-box").removeClass("none");
        drawDetailTable(result.bpList);
    }
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
}

function drawDetailTable(list){
    $("ol").empty();
    var strbuffer = "";
    for(var i = 0; i < list.length; i++){
        var row = list[i];
        strbuffer += '<li>';
        strbuffer += '    <div class="list-box list-cont">';
        strbuffer += '        <div class="list-inner1">';
        strbuffer += '            <p>'+moment(row.resultDate+row.resultTime,"YYYYMMDDHHmmss").format(Definition.YMDFORMAT6)+'</p>';
        strbuffer += '        </div>';
        strbuffer += '        <div class="list-inner3">';
        strbuffer += '            <p>'+row.dbp+'mmHg</p>';
        strbuffer += '        </div>';
        strbuffer += '        <div class="list-inner3">';
        strbuffer += '            <p>'+row.sbp+'mmHg</p>';
        strbuffer += '        </div>';
        strbuffer += '    </div>';
        strbuffer += '</li>';
    }
    $("ol").html(strbuffer);
}