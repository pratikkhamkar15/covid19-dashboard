import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './canvas.css';

const LineChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data) {
      const years = data.years; 
      const casesData = data.cases;
      const deathsData = data.deaths;
      const recoveriesData = data.recoveries;

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const chart = chartRef.current.getContext('2d');

      chartInstance.current = new Chart(chart, {
        type: 'line',
        data: {
          labels: years, 
          datasets: [
            {
              label: 'Cases',
              data: casesData,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
            },
            {
              label: 'Recoveries',
              data: recoveriesData,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
            {
              label: 'Deaths',
              data: deathsData,
              borderColor: 'rgb(54, 162, 235)',
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Number of patients',
              },
            },
          },
        },
      });
    }
  }, [data]);

  return <canvas ref={chartRef}  />;
};

export default LineChart;
