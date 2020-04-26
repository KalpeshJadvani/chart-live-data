import React from 'react';
import Chart from 'chart.js';
import { isEmpty } from 'lodash';

export default class Charts extends React.Component {
  chartRef = React.createRef();
  constructor() {
    super();
    this.myChart = {};
  }

  componentDidMount() {
    this.createChart(this.props);
  }

  componentDidUpdate() {
    this.createChart(this.props);
  }

  createChart(props) {
    if (props.chartData && props.chartData.length !== undefined) {
      var dates = [];
      var confirmed = [];
      var deaths = [];

      props.chartData.forEach((element) => {
        dates.push(element.date);
        confirmed.push(element.confirmed);
        deaths.push(element.deaths);
      });

      let padding = 40;

      const myChartRef = this.chartRef.current.getContext('2d');
      if (!isEmpty(this.myChart)) {
        this.myChart.data.datasets[0].data = confirmed;
        this.myChart.data.datasets[1].data = deaths;
        this.myChart.options.title.text = props.selectedCountry;
        this.myChart.update();
      } else {
        this.myChart = new Chart(myChartRef, {
          type: 'bar',
          data: {
            labels: dates,
            datasets: [
              {
                label: 'Confirmed',
                data: confirmed,
                type: 'line',
                borderColor: '#EC932F',
                fill: false,
                // order: 2
              },
              {
                label: 'Deaths',
                data: deaths,
                type: 'bar',
                backgroundColor: '#A93439',
                backgroundColorHover: '#3e95cd',
                // order: 1
              },
            ],
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'easeInOutQuint',
            },
            layout: {
              padding: {
                left: padding,
                right: padding,
                top: padding,
                bottom: padding,
              },
            },
            legend: {
              labels: {
                boxWidth: 10,
                padding: 10,
              },
            },
            title: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    maxTicksLimit: 15,
                    maxRotation: 40,
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    maxTicksLimit: 15,
                    maxRotation: 40,
                  },
                },
              ],
            },
          },
        });
      }
    }
  }

  render() {
    return (
      <div>
        <canvas id="myChart" ref={this.chartRef} />
      </div>
    );
  }
}
