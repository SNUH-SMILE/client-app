/**
 * @file : IITP_HEART_V001.js 심박수 (hr)
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
        callback : "drawHrChart",
        queryDataType : 'RATE'
    });
    MAPI.net.send(
        ServerPath.GET_RESULTS_HR,
        {
            loginId : MAPI.data.storage("g","LOGIN_ID"),
            resultDate : Global.nowDate.format("YYYYMMDD")
        },
        function(receivedData){
            if(receivedData.code == '00'){
                drawHrChart(receivedData)
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

function drawHrChart(result){
    var row = makeDataArr("hr",result.hrList);

    if(isEmpty(row)){
        $(".chart-inner").addClass("none");
        $(".data-box-cont").addClass("none");
        $(".chart-none").removeClass("none");
        $(".list-cont-box").addClass("none");
        return;
    }else{
        $(".chart-inner").removeClass("none");
        $(".chart-none").addClass("none");
        $(".data-box-cont").removeClass("none").html(row.data[row.data.length-1]+"회/분");
        $(".list-cont-box").removeClass("none");
        drawDetailTable(result.hrList);
    }

    var heartrateData = {
        type: 'line',
        label: 'Line Dataset',
        data: row.data, //[50, 114, 92, 128, 105, 73, 107, 85],
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
                    left: 23,
                    right: 20
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
                    // weight: 10,
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
                        min: 50,
                        // max: 38,
                        stepSize: 50,
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
        strbuffer += '        <div class="list-inner2">';
        strbuffer += '            <p>'+row.hr+'회&nbsp;/&nbsp;분</p>';
        strbuffer += '        </div>';
        strbuffer += '    </div>';
        strbuffer += '</li>';
    }
    $("ol").html(strbuffer);
}