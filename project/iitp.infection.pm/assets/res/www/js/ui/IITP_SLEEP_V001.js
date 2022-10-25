/**
 * @file : IITP_SLEEP_V001.js 수면 (sleep)
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
        callback : "drawSleepChart",
        queryDataType : 'SLEEP'
    });
    MAPI.net.send(
        ServerPath.GET_RESULTS_SLEEP_TIME,
        {
            loginId : MAPI.data.storage("g","LOGIN_ID"),
            resultDate : Global.nowDate.format("YYYYMMDD")
        },
        function(receivedData){
            if(receivedData.code == '00'){
                drawSleepChart(receivedData)
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

function drawSleepChart(result){
    var row = makeDataArr("sleep",result.sleepTimeList);

    if(isEmpty(row)){
        $(".chart-inner").addClass("none");
        $(".data-box-cont").addClass("none");
        $(".chart-none").removeClass("none");
        $(".list-cont-box").addClass("none");
        $("#type0SumTime").html("");
        $("#type1SumTime").html("");
        $("#type2SumTime").html("");
        return;
    }else{
        $(".chart-inner").removeClass("none");
        $(".chart-none").addClass("none");
        var totalMin = row.labels[row.labels.length-1].diffSum;
        var totalHour = parseInt(totalMin / 60);
        totalMin = totalMin % 60;
        $(".data-box-cont").removeClass("none").html(totalHour+"시간&nbsp;"+totalMin+"분");

        var sumMin = row.option.diffSum0;
        var sumHour = parseInt(sumMin / 60);
        sumMin = sumMin % 60;
        if(sumHour == 0) timeStr = sumMin+"분";
        else timeStr = sumHour+"시간"+sumMin+"분";
        $("#type0SumTime").html(timeStr);

        sumMin = row.option.diffSum1;
        sumHour = parseInt(sumMin / 60);
        sumMin = sumMin % 60;
        if(sumHour == 0) timeStr = sumMin+"분";
        else timeStr = sumHour+"시간"+sumMin+"분";
        $("#type1SumTime").html(timeStr);

        sumMin = row.option.diffSum2;
        sumHour = parseInt(sumMin / 60);
        sumMin = sumMin % 60;
        var timeStr = "";
        if(sumHour == 0) timeStr = sumMin+"분";
        else timeStr = sumHour+"시간"+sumMin+"분";
        $("#type2SumTime").html(timeStr);

        $(".list-cont-box").removeClass("none");
        drawDetailTable(result.sleepTimeList);
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
}

function drawDetailTable(list){
    $("ol").empty();
    var strbuffer = "";
    for(var i = 0; i < list.length; i++){
        var row = list[i];
        strbuffer += '<li>';
        strbuffer += '    <div class="list-box list-cont">';
        strbuffer += '        <div class="list-inner1">';
        strbuffer += '            <p>'+OptionList.STYPE_NM[Number(row.sleepType)]+'</p>';
        strbuffer += '        </div>';
        strbuffer += '        <div class="list-inner3">';
        strbuffer += '            <p>'+moment(row.sleepStartTime,"HHmm").format("HH시 mm분")+'</p>';
        strbuffer += '        </div>';
        strbuffer += '        <div class="list-inner3">';
        strbuffer += '            <p>'+moment(row.sleepEndTime,"HHmm").format("HH시 mm분")+'</p>';
        strbuffer += '        </div>';
        strbuffer += '    </div>';
        strbuffer += '</li>';
    }
    $("ol").html(strbuffer);
}