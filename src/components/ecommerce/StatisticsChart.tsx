// import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const, // Legend position
    },
    title: {
      display: true,
      text: 'Sample Drop Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      tension: 0.4, // smooth curves
      fill: true,
    },
    {
      label: 'Dataset 2',
      data: [28, 48, 40, 19, 86, 27, 90],
      borderColor: 'rgba(153,102,255,1)',
      backgroundColor: 'rgba(153,102,255,0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const barData = {
  labels,
  datasets: [
    {
      label: 'Bar Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(75,192,192,0.6)',
    },
  ],
};

export default function StatisticsChart() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ background: '#fff', padding: 16, borderRadius: 8, flex: 1 }}>
        <Line options={options} data={data} />
      </div>
      <div style={{ background: '#fff', padding: 16, borderRadius: 8, flex: 1 }}>
        <Bar options={options} data={barData} />
      </div>
    </div>
  );
}
