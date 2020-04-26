import React, { Component } from 'react';
import { Container, Spinner, Card } from 'react-bootstrap';
import ContainerBody from './ContainerBody';
import Header from './Header';
class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      countryArr: [],
      dateArr: [],
      data: {},
      worldStats: {},
      selectedCountry: '',
      selectedDate: '',
    };
    this.getData = this.getData.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
  }

  componentDidMount() {
    this.getData();
  }
  getWorldStats(countryArr, data) {
    const worldStats = { confirmed: 0, recovered: 0, deaths: 0 };
    countryArr.forEach((country) => {
      let countryData = data[country];
      // pick last object for today data
      countryData = countryData[countryData.length - 1];
      worldStats.confirmed += countryData.confirmed;
      worldStats.recovered += countryData.recovered;
      worldStats.deaths += countryData.deaths;
    });
    return worldStats;
  }

  getData() {
    fetch('https://pomber.github.io/covid19/timeseries.json')
      .then((response) => response.json())
      .then((data) => {
        const countryArr = Object.keys(data).map((i) => i);
        const worldStats = this.getWorldStats(countryArr, data);
        // world data
        const worldChart = [];
        const dateArr = [];
        countryArr.forEach((country) => {
          let countryData = data[country];
          countryData.forEach((dailyData, index) => {
            if (worldChart[index] === undefined) {
              const worldStats = {
                date: dailyData.date,
                confirmed: dailyData.confirmed,
                recovered: dailyData.recovered,
                deaths: dailyData.deaths,
              };
              worldChart.push(worldStats);
              dateArr.push(dailyData.date);
            } else {
              worldChart[index].confirmed += dailyData.confirmed;
              worldChart[index].recovered += dailyData.recovered;
              worldChart[index].deaths += dailyData.deaths;
            }
          });
        });
        this.setState({
          loading: false,
          countryArr: countryArr,
          dateArr: dateArr,
          data: data,
          worldStats: worldStats,
          worldChart: worldChart,
        });
      });
  }

  onChangeCountry(event) {
    const country = event.target.value !== 'select' ? event.target.value : '';
    const { selectedDate } = this.state;
    this.showDataOnDashboard(selectedDate, country);
  }
  onChangeDate(event) {
    const date = event.target.value !== 'select' ? event.target.value : '';
    const { selectedCountry } = this.state;
    this.showDataOnDashboard(date, selectedCountry);
  }

  getFilterData(date, selectedCountry) {
    const { data, countryArr } = this.state;
    const worldStats = { confirmed: 0, recovered: 0, deaths: 0 };
    // return array of countries
    const filteredCountries = selectedCountry ? [selectedCountry] : countryArr;
    filteredCountries.forEach((country) => {
      // Which country seleted that's conoutry data we will get
      let countryData = data[country];
      countryData.forEach((dailyData) => {
        if (date === '') {
          worldStats.confirmed += dailyData.confirmed;
          worldStats.recovered += dailyData.recovered;
          worldStats.deaths += dailyData.deaths;
        } else if (dailyData.date === date) {
          worldStats.confirmed += dailyData.confirmed;
          worldStats.recovered += dailyData.recovered;
          worldStats.deaths += dailyData.deaths;
        }
      });
    });

    return worldStats;
  }

  // This is common function for filter data by country name and date
  showDataOnDashboard(date, selectedCountry) {
    const worldStats = this.getFilterData(date, selectedCountry);
    this.setState({
      selectedDate: date,
      selectedCountry: selectedCountry,
      worldStats: worldStats,
    });
  }
  render() {
    const {
      loading,
      worldStats,
      selectedCountry,
      data,
      worldChart,
    } = this.state;

    if (loading)
      return <Spinner className="spinner-style" animation="border"></Spinner>;
    const countryStats = data[selectedCountry];
    //const lastUpdated = worldChart!==undefined ? worldChart[worldChart.length-1].date : "" ;
    return (
      <Container fluid style={{ padding: '0' }} className="App">
        <Card style={{ backgroundColor: '#f8f8ff', margin: '20px' }}>
          {/*Header starts here */}
          <Header
            {...this.state}
            worldStats={worldStats}
            onChangeDate={this.onChangeDate}
            onChangeCountry={this.onChangeCountry}
          />
          {/*Header ends here */}

          <Container fluid>
            {selectedCountry ? (
              <ContainerBody
                stats={countryStats}
                selectedCountry={selectedCountry}
              />
            ) : (
              <ContainerBody
                stats={worldChart}
                selectedCountry={'Global Data'}
              />
            )}
          </Container>
        </Card>
      </Container>
    );
  }
}

export default Dashboard;
