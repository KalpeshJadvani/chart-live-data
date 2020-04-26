import React, { Component } from 'react';
import { Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import SelectBox from './SelectBox';
import CountryData from './CountryData';
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

  getData() {
    fetch('https://pomber.github.io/covid19/timeseries.json')
      .then((response) => response.json())
      .then((data) => {
        const worldStats = { confirmed: 0, recovered: 0, deaths: 0 };
        const countryArr = Object.keys(data).map((i) => i);
        countryArr.forEach((country) => {
          let countryData = data[country];
          // pick last object for today data
          countryData = countryData[countryData.length - 1];
          worldStats.confirmed += countryData.confirmed;
          worldStats.recovered += countryData.recovered;
          worldStats.deaths += countryData.deaths;
        });
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

  // This is common function for filter data by country name and date
  showDataOnDashboard(date, selectedCountry) {
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
      selectedDate,
      countryArr,
      dateArr,
    } = this.state;

    if (loading)
      return <Spinner className="spinner-style" animation="border"></Spinner>;
    const countryStats = data[selectedCountry];
    //const lastUpdated = worldChart!==undefined ? worldChart[worldChart.length-1].date : "" ;
    return (
      <Container fluid style={{ padding: '0' }} className="App">
        <Card style={{ backgroundColor: '#f8f8ff', margin: '20px' }}>
          {/*Header starts here */}
          <Card.Title
            style={{
              textAlign: 'left',
              paddingLeft: '20px',
              paddingTop: '20px',
            }}
          >
            Summary (Refreshed daily) - See JHU CSSE live dashboard below for
            today's latest data
          </Card.Title>

          <Row className="no-gutters">
            {/*Select Box for country search ends here */}
            <Col
              md={{ span: 0, offset: 0 }}
              style={{ marginLeft: '18px', marginRight: '5px' }}
            >
              <span className="list-label">Country : </span>
            </Col>
            <SelectBox
              mdSet={{ span: 3, offset: 0 }}
              preSelcted={'All'}
              onChangeFunction={this.onChangeCountry}
              array={countryArr}
              selectedValue={selectedCountry}
            />

            <Col
              md={{ span: 0, offset: 0 }}
              style={{ marginLeft: '18px', marginRight: '5px' }}
            >
              <span className="list-label">As of date : </span>
            </Col>
            <SelectBox
              mdSet={{ span: 2, offset: 0 }}
              preSelcted={'Latest'}
              onChangeFunction={this.onChangeDate}
              array={dateArr}
              selectedValue={selectedDate}
            />
          </Row>

          <Row className="no-gutters">
            <Col className="large-x-small">{worldStats.confirmed}</Col>
            <Col className="large-x-small">{worldStats.deaths}</Col>
            <Col className="large-x-small">{worldStats.recovered}</Col>
          </Row>

          <Row className="no-gutters">
            <Col className="size-x-small">Confirmed</Col>
            <Col className="size-x-small">Deaths</Col>
            <Col className="size-x-small">Recovered</Col>
          </Row>

          {/*Header ends here */}

          <Container fluid>
            {selectedCountry ? (
              <CountryData
                stats={countryStats}
                selectedCountry={selectedCountry}
              />
            ) : (
              <CountryData stats={worldChart} selectedCountry={'Global Data'} />
            )}
          </Container>
        </Card>
      </Container>
    );
  }
}

export default Dashboard;
