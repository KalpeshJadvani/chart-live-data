import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
// Common components for both List of country and dates
import SelectBox from './SelectBox';
const Header = (props) => {
  return (
    <React.Fragment>
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
          onChangeFunction={props.onChangeCountry}
          array={props.countryArr}
          selectedValue={props.selectedCountry}
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
          onChangeFunction={props.onChangeDate}
          array={props.dateArr}
          selectedValue={props.selectedDate}
        />
      </Row>

      <Row className="no-gutters">
        <Col className="large-x-small">{props.worldStats.confirmed}</Col>
        <Col className="large-x-small">{props.worldStats.deaths}</Col>
        <Col className="large-x-small">{props.worldStats.recovered}</Col>
      </Row>

      <Row className="no-gutters">
        <Col className="size-x-small">Confirmed</Col>
        <Col className="size-x-small">Deaths</Col>
        <Col className="size-x-small">Recovered</Col>
      </Row>
    </React.Fragment>
  );
};

export default Header;
