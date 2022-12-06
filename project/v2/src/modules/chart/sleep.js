/**
 * 기상 상태에 대한 데이터 생성 함수
 * @param {number} data
 * @returns
 */
export const INIT_WAKE_DATA = (data) => ({
  data: [data],
  barThickness: 50,
  backgroundColor: '#ff615e',
  hoverBackgroundColor: '#ff615e',
});

export const INIT_RAM_DATA = (data) => ({
  data: [data],
  barThickness: 50,
  backgroundColor: '#ffbc49',
  hoverBackgroundColor: '#ffbc49',
});

export const INIT_SHALLOW_DATA = (data) => ({
  data: [data],
  barThickness: 50,
  backgroundColor: '#3cb9f4',
  hoverBackgroundColor: '#3cb9f4',
});

export const INIT_DEEP_DATA = (data) => ({
  data: [data],
  barThickness: 50,
  backgroundColor: '#3d61ee',
  hoverBackgroundColor: '#3d61ee',
});

export const INIT_SLEEP_DATASETS = () => {
  return [
    {
      data: [30],
      barThickness: 50,
      backgroundColor: '#ff615e',
      hoverBackgroundColor: '#ff615e',
    },
    {
      data: [70],
      barThickness: 50,
      backgroundColor: '#3cb9f4',
      hoverBackgroundColor: '#3cb9f4',
    },
    {
      data: [180],
      barThickness: 50,
      backgroundColor: '#3d61ee',
      hoverBackgroundColor: '#3d61ee',
    },
    {
      data: [240],
      barThickness: 50,
      backgroundColor: '#ffbc49',
      hoverBackgroundColor: '#ffbc49',
    },
    {
      data: [20],
      barThickness: 50,
      backgroundColor: '#ff615e',
      hoverBackgroundColor: '#ff615e',
    },
  ];
};

export const INIT_SLEEP_OPTIONS = () => ({
  // responsive: false,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 15,
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
          drawOnChartArea: false,
          drawTicks: false,
          color: '#ddd',
          borderDash: [2],
        },
        ticks: {
          display: false,
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
          // drawBorder: true,
          color: '#ddd',
          drawTicks: false,
          offset: false,
        },
        ticks: {
          display: false,
        },
      },
    ],
  },
});
