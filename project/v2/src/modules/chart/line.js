export const INIT_LINE_DATA = () => ({
  lineTension: 0,
  fill: false,
  borderWidth: 1,
  borderColor: '#638de5',
  order: 1,
  pointRadius: 5.7,
  pointHoverRadius: 5.7,
  pointBackgroundColor: '#fff',
  pointHoverBackgroundColor: '#fff',
  pointStyle: 'circle',
});

export const INIT_LINE_OPTIONS = () => ({
  // responsive: false,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 15,
    },
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
  },
  scales: {
    weight: 10,
    yAxes: [
      {
        weight: 100,
        offset: true,
        gridLines: {
          // 가로선
          drawOnChartArea: true,
          drawBorder: true,
          color: '#ddd',
          drawTicks: false,
          // offset: false,
          borderDash: [2],
        },
        ticks: {
          // labelOffset:-13, //위치 조정 : 잘림
          // autoSkip: true,
          // min: 36,
          // max: 38,
          // stepSize: 1,
          beginAtZero: true,
          padding: 3,
          fontColor: '#999',
          fontSize: 12,
          // tickMarkLength: 10
        },
      },
    ],
    xAxes: [
      {
        offset: true,
        gridLines: {
          offsetGridLines: true,
          padding: 3,
          drawOnChartArea: false,
          drawTicks: false,
          color: '#ddd',
          borderDash: [0],
        },

        ticks: {
          maxTicksLimit: 20,
          fontColor: '#999',
          fontSize: 12,
          // stepSize: 1,
          beginAtZero: false,
          padding: 8,
        },
      },
    ],
  },
});
