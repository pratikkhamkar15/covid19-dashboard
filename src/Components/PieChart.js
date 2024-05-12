import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './canvas.css';

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data) {
      const totalCases = data.cases.reduce((acc, val) => acc + val, 0);
      const totalDeaths = data.deaths.reduce((acc, val) => acc + val, 0);
      const totalRecoveries = data.recoveries.reduce((acc, val) => acc + val, 0);
  
      requestAnimationFrame(() => {
        if (chartInstance.current) {
          chartInstance.current.destroy(); 
        }
  
        const chart = chartRef.current.getContext('2d');
  
        chartInstance.current = new Chart(chart, {
          type: 'pie',
          data: {
            labels: ['Cases', 'Deaths', 'Recoveries'],
            datasets: [{
              data: [totalCases, totalDeaths, totalRecoveries],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)'
              ],
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Covid19 Cases Distribution',
              },
            },
          },
        });
      });
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default PieChart;
