import _zip from 'lodash/zip';
import mark1 from '@/assets/img/chart-mark1.svg';
import mark2 from '@/assets/img/chart-mark2.svg';

const pointCircle = document.createElement('img');
const pointDoubleCircle = document.createElement('img');

pointCircle.setAttribute('alt', '최저혈압');
pointCircle.setAttribute('src', mark1);
pointDoubleCircle.setAttribute('alt', '최고혈압');
pointDoubleCircle.setAttribute('src', mark2);

export const INIT_BLOOD_DATASETS = (datas) => {
  const [lows, highs] = _zip(...datas);
  const low = {
    type: 'line',
    data: lows,
    fill: false,
    pointStyle: pointCircle,
    pointHoverStyle: pointCircle,
    showLine: false,
    pointBackgroundColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointBorderColor: '#608ae4',
    pointRadius: 5.7,
    pointHoverRadius: 5.7,
  };
  const high = {
    type: 'line',
    data: highs,
    fill: false,
    pointStyle: pointDoubleCircle,
    pointHoverStyle: pointDoubleCircle,
    showLine: false,
    pointBackgroundColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointBorderColor: '#e46060',
    pointRadius: 5.7,
    pointHoverRadius: 5.7,
  };
  const bar = {
    type: 'bar',
    // 최저, 최고 데이터 순으로 넣으시면 됩니다.
    data: datas,
    maxBarThickness: 1,
    backgroundColor: '#648ee5',
  };
  return [low, high, bar];
};

export const INIT_BLOOD_OPTIONS = () => ({
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
          // stepSize: 1,
          beginAtZero: true,
          padding: 8,
        },
      },
    ],
  },
});
