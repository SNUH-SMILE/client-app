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

var mark2 = new Image();
mark2.src = '../img/chart-mark2.svg';

var mytempData = {
    type: 'line',
    label: 'Line Dataset',
    data: [36.5, 36.4, 38, 38.6],
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
    pointStyle: ['circle', 'circle', 'circle', mark2],
    pointHoverStyle: ['circle', 'circle', 'circle', mark2],
}

// 체온 차트 시작
var Chart2 = new Chart(tempChart, {
    data: {
        datasets: [mytempData],
        labels: ['11:00', '12:00', '13:00', '14:00'],
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
    data: [[77, 100], [65, 80], [50, 60], [64, 120]],
    maxBarThickness: 1,
    backgroundColor: gradientStroke,
}

// 최저 데이터 따로
var lowPressure = {
    type: 'line',
    data: [77, 65, 50, 64],
    fill: false,
    pointStyle: [pointBlue, pointBlue, pointBlue, pointBlueac],
    pointHoverStyle: [pointBlue, pointBlue, pointBlue, pointBlueac],
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
    data: [100, 80, 60, 120],
    fill: false,
    pointStyle: [pointRed, pointRed, pointRed, pointRedac],
    pointHoverStyle: [pointRed, pointRed, pointRed, pointRedac],
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
        labels: ['11:00', '12:00', '13:00', '14:00'],
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


/*******************심박수 차트 시작***************/

var heartrateData = {
    type: 'line',
    label: 'Line Dataset',
    data: [123, 114, 92, 128, 105, 73, 107, 85],
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



/*************걸음수 차트 시작****************/
var Chart1 = new Chart(walkChart, {
    type: 'bar',
    data: {
        labels: ['11:00', '12:00', '13:00', '14:00',],
        datasets: [
            {
                backgroundColor: "transparent",
                hoverBackgroundColor: 'transparent',
                borderColor: '#5782e1',
                borderWidth: 1,
                minBarThickness: 10,
                maxBarThickness: 15,
                categoryPercentage: .5,
                data: [300, 700, 800, null]

            },
            {
                backgroundColor: "transparent",
                hoverBackgroundColor: 'transparent',
                borderColor: '#5782e1',
                borderWidth: 1,
                minBarThickness: 10,
                maxBarThickness: 15,
                categoryPercentage: .5,
                data: [400, 900, null, null]
            },
            {
                backgroundColor: "transparent",
                hoverBackgroundColor: 'transparent',
                borderColor: '#5782e1',
                borderWidth: 1,
                minBarThickness: 10,
                maxBarThickness: 15,
                categoryPercentage: .5,
                data: [700, 233, null, null]
            },
            {
                backgroundColor: "#5782e1",
                hoverBackgroundColor: '#5782e1',
                borderColor: '#5782e1',
                minBarThickness: 10,
                maxBarThickness: 15,
                categoryPercentage: .5,
                data: [null, null, null, 520]
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
                    // stepSize: 5000,
                    // beginAtZero: true,
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


/****************수면 차트 시작**************/

var Chart4 = new Chart(sleepChart, {
    type: 'horizontalBar',
    data: {
        labels: ["2021"],
        datasets: [
            // {
            //     data: [200],
            //     barThickness: 60,
            //     backgroundColor: "transparent",
            //     hoverBackgroundColor: "transparent",
            // },
            {

                data: [361],
                barThickness: 60,
                backgroundColor: "#333c5c",
                hoverBackgroundColor: "#333c5c"
            }, {
                data: [120],
                barThickness: 60,
                backgroundColor: "#e6a524",
                hoverBackgroundColor: "#e6a524"
            }, {
                data: [138],
                barThickness: 60,
                backgroundColor: "#333c5c",
                hoverBackgroundColor: "#333c5c"
            },
            {
                data: [358],
                barThickness: 60,
                backgroundColor: "#5b74c8",
                hoverBackgroundColor: "#5b74c8"
            },
            {
                data: [280],
                barThickness: 60,
                backgroundColor: "#e6a524",
                hoverBackgroundColor: "#e6a524"

            }
        ]
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
                    display: false
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
