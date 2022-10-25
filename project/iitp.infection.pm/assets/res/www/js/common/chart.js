/******************* 체온차트 시작***************/

var horizonalLinePlugin = {
    beforeDraw: function (chartInstance) {
        var yScale = chartInstance.scales["y-axis-0"];
        var canvas = chartInstance.chart;
        var ctx = canvas.ctx;
        var index;
        var line;
        var style;

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

// var mark = new Image();
// mark.src = '../img/chart-mark1.svg';



/****************산소포화도 차트 시작**************/
// line chart 산소 기준 데이터

var myoxygen = {
    type: 'line',
    label: 'Line Dataset',
    data: [36.5, 36.4, 38, 38.6],
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
    pointStyle: ['circle', 'circle', 'circle', mark2],
    pointHoverStyle: ['circle', 'circle', 'circle', mark2],

}

// 산소 차트 시작
var Chart6 = new Chart(oxygenChart, {
    data: {
        datasets: [myoxygen],
        labels: ['11:00', '12:00', '13:00', '14:00'],
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

/****************산소포화도 차트 끝**************/





