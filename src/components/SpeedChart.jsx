import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatTime } from '../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SpeedChart = ({ history }) => {
  const labels = history.map(p => formatTime(new Date(p.timestamp)));
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'ISS Speed (km/h)',
        data: history.map(p => p.velocity || 27600), // Using real velocity if available
        fill: false,
        borderColor: '#ef4444', // Red line like in the video
        backgroundColor: '#ef4444',
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top',
        align: 'center',
        labels: {
          usePointStyle: true,
          boxWidth: 20,
          font: { size: 10, weight: '600' }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        ticks: { maxRotation: 45, minRotation: 45, font: { size: 8 }, autoSkip: true, maxTicksLimit: 10 },
        grid: { display: false }
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { size: 10 } },
        suggestedMin: 24000,
        suggestedMax: 28000
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default SpeedChart;
