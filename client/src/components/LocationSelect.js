import React from 'react';
import { browserHistory } from 'react-router';
import { Segment, Divider, Dropdown, Form, Input, Button } from 'semantic-ui-react';
import { formattedStates } from '../utils/helpers';
import Data from '../utils/Data';

export default class LocationSelect extends React.Component {
  static propTypes = {
    venueCount: React.PropTypes.string
  }

  static contextTypes = {
    router: React.PropTypes.object
  };

  state = {
    states: formattedStates()
  }

  componentWillMount = () => {
    Data.get('states', undefined, (res) => {
      this.setState({
        states: formattedStates(res)
      });
    });
  }

  goToState = (event, { value }) => {
    browserHistory.push(`/venues?state=${value}`);
  }

  goToZip = (event, serializedForm) => {
    event.preventDefault();
    const zip = serializedForm.zipValue;
    const distance = serializedForm.zipDistance;
    browserHistory.push(`/venues?zip=${zip}&distance=${distance}`);
  }

  render() {
    /* eslint-disable jsx-a11y/label-has-for */
    return (
      <Segment padded className="location-select">
        <Dropdown
          className="state-select-dropdown"
          placeholder="Select State" fluid search selection
          options={this.state.states}
          onChange={this.goToState}
        />
        <Divider horizontal>Or</Divider>
        <Form onSubmit={this.goToZip}>
          <Form.Group widths="equal">
            <Form.Field inline>
              <label>Within</label>
              <Input
                className="zip-distance-input"
                name="zipDistance"
                placeholder="# miles"
              />
            </Form.Field>
            <Form.Field inline>
              <label>of</label>
              <Input
                className="zip-select-input"
                name="zipValue"
                placeholder="zipcode"
              />
            </Form.Field>
            <Button primary>Go</Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }
}
