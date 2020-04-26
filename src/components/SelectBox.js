import React from 'react';
import { Col, Form } from 'react-bootstrap';

function SelectBox(props) {
  return (
    <Col md={props.mdSet}>
      <Form>
        <Form.Group className="country-select">
          <Form.Control
            as="select"
            custom
            onChange={props.onChangeFunction}
            value={props.selectedValue}
            defaultValue={'select'}
          >
            <option value="select"> {props.preSelcted} </option>
            {props.array.map((country) => (
              <option value={country} key={country}>
                {' '}
                {country}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
    </Col>
  );
}

export default SelectBox;
