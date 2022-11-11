export const DEFAULT_CHART_OPTIONS = () => ({
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
    yAxes: [
      {
        offset: true,
        gridLines: {
          borderDash: [2],
          color: '#ddd',
          drawTicks: false,
          offset: true,
        },
        ticks: {
          // min: 50,
          stepSize: 50,
          beginAtZero: true,
          padding: 3,
          fontColor: '#999',
          fontSize: 12,
        },
      },
    ],
    xAxes: [
      {
        offset: true,
        gridLines: {
          drawOnChartArea: false,
          drawTicks: false,
          color: '#ddd',
        },
        ticks: {
          fontColor: '#999',
          fontSize: 12,
          stepSize: 1,
          beginAtZero: true,
          padding: 8,
        },
      },
    ],
  },
});

export const BAR_CHART_OPTIONS = (totaltime) => ({
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10,
      left: 20,
      // right: 20,
      bottom: 8,
    },
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
  },
  scales: {
    xAxes: [
      {
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
          autoSkip: false,
          min: 0,
          max: totaltime,
          stepSize: 1,
          callback: (label, index, labels) => {
            return '';
          },
        },
      },
    ],
    yAxes: [
      {
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
          display: false,
          // crossAlign: bottom
        },
      },
    ],
  },
});
