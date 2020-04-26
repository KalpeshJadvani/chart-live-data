import React from 'react';
import Charts from './Charts';
import { Container } from 'react-bootstrap';

function ContainerBody(props) {
  const chartData = props.stats;
  const selectedCountry = props.selectedCountry;
  return (
    <Container fluid>
      {/* <Row>
        <Col md={12} style={{ fontSize: 40, fontWeight: 'bold', padding: 20 }}>
          {selectedCountry}
        </Col>
      </Row> */}
      <div style={{ display: !selectedCountry && 'none' }}>
        <Charts chartData={chartData} selectedCountry={selectedCountry} />
      </div>
    </Container>
  );
}

export default ContainerBody;
