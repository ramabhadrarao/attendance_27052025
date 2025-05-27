import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface Props {
  data: ChartData;
  type: 'bar' | 'line';
}

const AttendanceChart: React.FC<Props> = ({ data, type }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.max(0, Math.min(...data.datasets.flatMap(ds => ds.data)) - 10),
        max: 100,
      },
    },
  };

  return (
    <div className="h-64">
      {type === 'bar' ? (
        <Bar options={options} data={data} />
      ) : (
        <Line options={options} data={data} />
      )}
    </div>
  );
};

export default AttendanceChart;