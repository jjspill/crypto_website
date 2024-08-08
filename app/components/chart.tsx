import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Importing the date adapter
import { GraphItem } from '../utils/chart';
import hash from 'object-hash'; // Add a hashing library

// Register the chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

// Function to generate a color based on a string
function getColor(label: string): string {
  const hue = parseInt(hash(label), 16) % 360; // Get a hue value between 0 and 359
  return `hsl(${hue}, 70%, 50%)`; // Set saturation to 70% and lightness to 50%
}

const options = {
  responsive: true,
  scales: {
    x: {
      type: 'time' as const,
      time: {
        parser: 'yyyy-MM-dd HH:mm',
        unit: 'day' as const,
        tooltipFormat: 'MMM dd, yyyy HH:mm',
      },
      title: {
        display: true,
        text: 'Time (EST)',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: 'white',
      },
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Cryptocurrency Data Visualization',
      color: 'white',
    },
    tooltip: {
      titleColor: 'white',
      bodyColor: 'white',
      footerColor: 'white',
    },
  },
};

export const GraphDisplay: React.FC<{ graphData: GraphItem }> = ({
  graphData,
}) => {
  const { timestamp, ...potentialData } = graphData;
  const potentialLabels = Object.keys(potentialData).filter(
    (label) => !label.includes('time') && !label.includes('_id'),
  );
  const [selectedLabels, setSelectedLabels] = useState<string[]>([
    'com_btc_1d_weighted_avg_price',
    'com_btc_1hr_last_price',
  ]);

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedLabels((prev) => [...prev, value]);
    } else {
      setSelectedLabels((prev) => prev.filter((label) => label !== value));
    }
  };

  const data = useMemo(() => {
    const labels = timestamp;
    const datasets = selectedLabels.map((label) => ({
      label,
      data: potentialData[label],
      fill: false,
      borderColor: getColor(label),
      tension: 0.1,
    }));

    return {
      labels,
      datasets: datasets,
    };
  }, [selectedLabels, JSON.stringify(potentialData)]);

  return (
    <div className="hidden md:flex bg-black">
      <div className="absolute top-10 right-5 p-2 ">
        <div className="h-[800px] overflow-y-auto">
          {potentialLabels.sort().map((label) => (
            <div
              key={label}
              className="border border-gray-500 text-white"
              style={{
                backgroundColor: selectedLabels.includes(label)
                  ? getColor(label)
                  : 'black',
              }}
            >
              <input
                type="checkbox" // Keep the input type correct for accessibility
                id={label}
                style={{ display: 'none' }} // Hide checkbox visually
                checked={selectedLabels.includes(label)}
                onChange={handleLabelChange}
                value={label}
              />
              <label
                htmlFor={label}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  display: 'block',
                }}
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <Line options={options} data={data} />
    </div>
  );
};
