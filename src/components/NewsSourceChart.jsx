import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const NewsSourceChart = ({ articles }) => {
  // Count sources
  const counts = (articles || []).reduce((acc, article) => {
    const name = article.source?.name || 'Unknown';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(counts);
  if (labels.length === 0) {
    return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No data available</div>;
  }

  const data = {
    labels: labels,
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
          '#06b6d4',
        ],
        borderColor: 'transparent',
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#64748b',
          font: { size: 10 },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    cutout: '75%',
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default NewsSourceChart;
