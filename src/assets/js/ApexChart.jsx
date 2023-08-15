import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [{ data: [] }],
      options: {
        chart: {
          id: 'realtime',
          height: 350,
          type: 'line',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000,
            },
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        title: {
          text: '',
          align: 'left',
        },
        markers: {
          size: 0,
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          max: 100,
        },
        legend: {
          show: false,
        },
      },
    };
  }

  getRandomDataPoint() {
    const now = new Date();
    const randomValue = Math.floor(Math.random() * 100);
    const newDataPoint = { x: now.getTime(), y: randomValue };
    return newDataPoint;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      try {
        const newDataPoint = this.getRandomDataPoint();
        this.setState((prevState) => ({
          series: [{ data: [...prevState.series[0].data, newDataPoint] }],
        }));
      } catch (error) {
        console.error('Error updating series data:', error);
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div id="chart" style={{ width: '100%', height: '100%' }}>
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="line"
        height="100%"
        width="100%"
      />
    </div>
    );
  }
}

export default ApexChart;
