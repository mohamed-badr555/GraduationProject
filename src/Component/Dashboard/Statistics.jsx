import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Statistics() {
  const { isDarkMode } = useTheme();
  
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Success Rate',
        data: [96, 97, 98.5, 98.2, 99, 98.8, 98.2],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10B981',
        pointBorderColor: isDarkMode ? '#374151' : '#ffffff',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#374151',
        bodyColor: isDarkMode ? '#ffffff' : '#374151',
        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? '#374151' : '#F3F4F6',
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
        }
      },
      y: {
        min: 90,
        max: 100,
        grid: {
          color: isDarkMode ? '#374151' : '#F3F4F6',
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Performance</h2>
      <Line data={data} options={options} />
    </div>
  );
}