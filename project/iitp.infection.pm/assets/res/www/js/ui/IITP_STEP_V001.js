/**
 * @file : IITP_STEP_V001.js 걸음수 (step)
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
        callback : "drawStepChart",
        queryDataType : 'STEP'
    });
    MAPI.net.send(
        ServerPath.GET_RESULTS_STEP_COUNT,
        {
            loginId : MAPI.data.storage("g","LOGIN_ID"),
            resultDate : Global.nowDate.format("YYYYMMDD")
        },
        function(receivedData){
            if(receivedData.code == '00'){
                drawStepChart(receivedData)
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

function drawStepChart(result){
    var row = makeDataArr("step",result.stepCountList);

    if(isEmpty(row)){
        $(".chart-inner").addClass("none");
        $(".data-box-cont").addClass("none");
        $(".chart-none").removeClass("none");
        $(".list-cont-box").addClass("none");
        return;
    }else{
        $(".chart-inner").removeClass("none");
        $(".chart-none").addClass("none");
        var totalStep = 0;
        for(var j = 0; j < row.data.length; j++){
            totalStep += Number(row.data[j]);
        }
        $(".data-box-cont").removeClass("none").html(totalStep+"걸음");
        $(".list-cont-box").removeClass("none");
        drawDetailTable(result.stepCountList);
    }
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
        strbuffer += '            <p>'+row.stepCount+'</p>';
        strbuffer += '        </div>';
        strbuffer += '        <div class="list-inner3">';
        strbuffer += '            <p>'+row.distance+'km</p>';
        strbuffer += '        </div>';
        strbuffer += '    </div>';
        strbuffer += '</li>';
    }
    $("ol").html(strbuffer);
}