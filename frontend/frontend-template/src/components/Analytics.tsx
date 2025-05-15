import Chart from "chart.js/auto";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useRef, useState } from "react";
import { HashLoader } from 'react-spinners';
import '../css/Analytics.css';
import backHH from '../assets/backHomee.jpg';
import {fetchPieChartData, fetchPieChartSummaryData} from "../features/analytics/AnalyticsAPIs";

export default function Analytics() {
  const [selectedDate, setSelectedDate] = useState<Date | any>(new Date());
  const [loading, setLoading] = useState(true);
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);
  const chartRef4 = useRef(null);
  const chartInstance1 = useRef(null);
  const chartInstance2 = useRef(null);
  const chartInstance3 = useRef(null);
  const chartInstance4 = useRef(null);

  const initializeChart = (chartRef, data) => {
    if (chartRef.current) {
      chartRef.current.getContext("2d").clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    }

    return new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Analytics',
            data: data.values,
            backgroundColor: data.colors,
            borderColor: data.borderColors,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: data.title,
            color: '#090808',
            font: {
              size: 25,
            },
          },
          legend: {
            labels: {
              font: {
                size: 18,
              },
              color: '#090808',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#090808',
              font: {
                size: 18,
              },
            },
            grid: {
              color: '#090808',
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#090808',
              font: {
                size: 18,
              },
            },
            grid: {
              color: '#090808',
            },
          },
        },
      },
    });

  };

  useEffect(() => {
    const fetchDataAndInitializeCharts = async () => {
      try {
        const arr1 = await fetchPieChartData(selectedDate, "Morning-Weekday-Normal");
        const arr11 = await fetchPieChartData(selectedDate, "Morning-Weekday-Holiday");
        const arr2 = await fetchPieChartData(selectedDate, "Mid-Weekday-Normal");
        const arr3 = await fetchPieChartData(selectedDate, "Night-Weekday-Normal");
        const arr31 = await fetchPieChartData(selectedDate, "Night-Weekday-Holiday");
        const arr4 = await fetchPieChartSummaryData(selectedDate);

        const data1 = {
          title: "Morning Shift",
          labels: ["Pending", "Not Applicable", "Completed", "Not Confirmed", "Confirmed"],
          values: arr1.length > 0 ? arr1 : arr11,
          colors: [
            "rgba(253,242,7,0.95)",
            "rgb(115,114,114)",
            "rgb(65,190,2)",
            "rgb(245,2,2)",
            "rgb(2,38,180)",
          ],
          borderColors: [
            "rgba(253,242,7,0.95)",
            "rgb(115,114,114)",
            "rgb(65,190,2)",
            "rgb(245,2,2)",
            "rgb(2,38,180)",
          ]
        };

        const data2 = {
          title: "Mid Shift",
          labels: ["Pending", "Not Applicable", "Completed", "Not Confirmed", "Confirmed"],
          values: arr2,
          colors: [
            "rgba(253,242,7,0.95)",
            "rgb(115,114,114)",
            "rgb(65,190,2)",
            "rgb(245,2,2)",
            "rgb(2,38,180)",
          ],
          borderColors: [
            "rgba(253,242,7,0.95)",
            "rgb(115,114,114)",
            "rgb(65,190,2)",
            "rgb(245,2,2)",
            "rgb(2,38,180)",
          ]
        };

        const data3 = {
          title: "Night Shift",
          labels: ["Pending", "Not Applicable", "Completed", "Not Confirmed", "Confirmed"],
          values: arr3.length > 0 ? arr3 : arr31,
          colors: [
            "rgba(253,242,7,0.95)",
            "rgb(115,114,114)",
            "rgb(65,190,2)",
            "rgb(245,2,2)",
            "rgb(2,38,180)",
          ],
          borderColors: [
            "rgba(253,242,7,0.95)",
            "rgb(115,114,114)",
            "rgb(65,190,2)",
            "rgb(245,2,2)",
            "rgb(2,38,180)",
          ]
        };

        const data4 = {
          title: "Daily Percentage Summary",
          labels: ["Pending(%)", "Not Applicable(%)", "Completed(%)", "Not Confirmed(%)", "Confirmed(%)"],
          values: arr4,
          colors: [
            "rgba(253,242,7,0.95)",
            "rgb(115,114,114)",
            "rgb(65,190,2)",
            "rgb(245,2,2)",
            "rgb(2,38,180)",
          ],
          borderColors: [
            "rgba(253,242,7,0.95)",
            "rgb(115,114,114)",
            "rgb(65,190,2)",
            "rgb(245,2,2)",
            "rgb(2,38,180)",
          ]
        };

        chartInstance1.current = initializeChart(chartRef1, data1);
        chartInstance2.current = initializeChart(chartRef2, data2);
        chartInstance3.current = initializeChart(chartRef3, data3);
        chartInstance4.current = initializeChart(chartRef4, data4);
      } catch (error) {
        console.error("Error fetching and initializing charts:", error);
      } finally {
         // Move this inside the finally block
      }
    };
    setLoading(true);
    fetchDataAndInitializeCharts().then(() => {
      console.log("Fetched and initialized Pie Chart Data");
      setLoading(false);
    });
    return () => {
      if (chartInstance1.current) {
        chartInstance1.current.destroy();
      }
      if (chartInstance2.current) {
        chartInstance2.current.destroy();
      }
      if (chartInstance3.current) {
        chartInstance3.current.destroy();
      }
      if (chartInstance4.current) {
        chartInstance4.current.destroy();
      }
    };
  }, [selectedDate]);

  const handleDatePickerChange = (date: Date | null) => {
    if (date) {
      const formattedDate = new Date(date);
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate('');
    }
  };

  return (
    <div className="container-Home" style={{ backgroundImage: `url(${backHH})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
      <div className="DateAnalytics">
        <div>
          <text className="select-date">Date: </text>
          <DatePicker
            className='dateee'
            selected={selectedDate}
            onChange={handleDatePickerChange}
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>
      <div className="containerr" >
        <canvas ref={chartRef4} />
        <canvas ref={chartRef1} />
        <canvas ref={chartRef2} />
        <canvas ref={chartRef3} />
      </div>
    </div>
  );
}
