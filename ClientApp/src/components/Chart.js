import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js'

Chart.defaults.global.elements.line.tension = 0

export default function LineGraph({ data }) {
  console.log(data)
  const chartRef = useRef(null)
  useEffect(() => {
    const chart = new Chart (chartRef.current.getContext("2d"), {
      type: "line",
      data: {
        //labels: ["Jan", "Feb", "March"],
        datasets: [
          {
            label: "СЧА",
            data: data,
            fill: false,
            borderColor: "#98B9AB",
            borderWidth: 1,
            //pointBorderColor :'red',
            showLine: true,
            pointRadius: 1
          }
        ]
      },
      options: {
        //responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 5, left: 15, right: 15, bottom: 15 }
        },
        legend: {
          display: false,
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'linear',
            time: {
              //unit: 'month',
              displayFormats: {
                day: 'DD.MM.YYYY',
                week: 'DD.MM.YYYY',
                month: 'DD.MM.YYYY',
                quarter: 'DD.MM.YYYY',
                year: 'DD.MM.YYYY'
              },
              tooltipFormat: 'DD.MM.YYYY'
            },
            ticks: { 
              display: true,
              major: {
                enabled: true
              }
            },
            gridLines: {
              display: true,
              drawBorder: true,
              offsetGridLines: true
            }
          }],
          yAxes: [{
            ticks: { display: true },
            gridLines: {
              display: true,
              drawBorder: true
            }
          }]
        },
        tooltips: {
          displayColors: false,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          callbacks: {
            title: function(tooltipItems, data) {
              return tooltipItems[0] ? tooltipItems[0].label : '';
            }
          }
        }
      }
    })
    return () => {
      chart.destroy()
    }
  }, [data])
  return (
    <div >
      <canvas id="myChart" ref={ chartRef } height={ 300 } width={ 100 } />
    </div>
  )
}
