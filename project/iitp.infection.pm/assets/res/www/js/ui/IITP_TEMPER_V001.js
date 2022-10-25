/**
 * @file : IITP_TEMPER_V001.js 체온 (bt)
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
        callback : "drawBtChart",
        queryDataType : 'TEMP'
    });
    MAPI.net.send(
        ServerPath.POST_RESULTS_BT,
        {
            loginId : MAPI.data.storage("g","LOGIN_ID"),
            resultDate : Global.nowDate.format("YYYYMMDD")
        },
        function(receivedData){
            if(receivedData.code == '00'){
                drawBtChart(receivedData)
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

function drawBtChart(result){
    var row = makeDataArr("bt",result.btList);

    if(isEmpty(row)){
        $(".chart-inner").addClass("none");
        $(".data-box-cont").addClass("none");
        $(".chart-none").removeClass("none");
        $(".list-cont-box").addClass("none");
        return;
    }else{
        $(".chart-inner").removeClass("none");
        $(".chart-none").addClass("none");
        $(".data-box-cont").removeClass("none").html(row.data[row.data.length-1]+"&deg;C");
        $(".list-cont-box").removeClass("none");
        drawDetailTable(result.btList);
    }

    var mark2 = document.getElementById('mark2');

    var horizonalLinePlugin = {
        beforeDraw: function (chartInstance) {
            var yScale = chartInstance.scales["y-axis-0"];
            var canvas = chartInstance.chart;
            var ctx = canvas.ctx;
            var index;
            var line;
            var style;
            var setLineDash;

            if (chartInstance.options.horizontalLine) {
                for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
                    line = chartInstance.options.horizontalLine[index];

                    if (!line.style) {
                        style = "rgba(169,169,169, .6)";
                    } else {
                        style = line.style;
                    }

                    if (line.y) {
                        yValue = yScale.getPixelForValue(line.y);
                    } else {
                        yValue = 0;
                    }

                    ctx.lineWidth = 1;

                    if (yValue) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(22, yValue);
                        ctx.lineTo(canvas.width, yValue);
                        ctx.strokeStyle = style;
                        ctx.setLineDash([2]);
                        ctx.stroke();
                        ctx.restore();
                    }

                    if (line.text) {
                        ctx.fillStyle = style;
                        ctx.fillText(line.text, 0, yValue + ctx.lineWidth);
                    }
                }
                return;
            };
        }
    };
    Chart.pluginService.register(horizonalLinePlugin);

    const mytempData = {
        type: 'line',
        label: 'Line Dataset',
        data: row.data,//[36.5, 36.4, 38, 38.6],
        lineTension: 0,
        fill: false,
        borderWidth: 1,
        borderColor: '#648ee5',
        order: 1,
        pointRadius: 8,
        pointHoverRadius: 8,
        pointBackgroundColor: '#fff',
        pointHoverBackgroundColor: '#fff',

        pointStyle: mark2,//['circle', 'circle', 'circle', mark2],
        pointHoverStyle: mark2//['circle', 'circle', 'circle', mark2],
    }

    // line chart - 체온 차트 시작
    var Chart2 = new Chart(tempChart, {
        data: {
            datasets: [mytempData],
            labels: row.labels,//['11:00', '12:00', '13:00', '14:00'],
        },
        options: {
            // responsive: false,
            maintainAspectRatio: false,
            horizontalLine: [{
                "y": 36.5,
                "style": "#648ee5"
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
                weight: 10,
                yAxes: [{
                    weight: 100,
                    offset: true,
                    gridLines: {
                        // 가로선
                        drawOnChartArea: false,
                        drawBorder: true,
                        color: '#979797',
                        drawTicks: false,
                        // offset: false
                        borderDash: [0]
                    },
                    ticks: {
                        // labelOffset:-13, //위치 조정 : 잘림
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
                        borderDash: [0]
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
        },
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
        strbuffer += '            <p>'+row.bt+'&deg;C</p>';
        strbuffer += '        </div>';
        strbuffer += '    </div>';
        strbuffer += '</li>';
    }
    $("ol").html(strbuffer);
}