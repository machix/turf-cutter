import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import Auth0Lock from 'auth0-lock';
import Header from './Header';
import Map from './Map';
import Data from '../utils/Data';

export default class App extends React.Component {
  static propTypes = {
    params: React.PropTypes.object // eslint-disable-line
  };

  state = {
    turf: [],
    zoom: 15,
    center: { lat: 40.754204, lng: -73.601047 }
  }

  componentWillMount() {
    Data.get('turf', undefined, (res) => {
      this.setState({
        turf: res
      });
    });
  }

  render() {
    let loaded;
    if (!this.state.turf) loaded = 'active';
    return (
      <div className="app">
        <Dimmer className={loaded}>
          <Loader size="large">Loading...</Loader>
        </Dimmer>
        <Header lock={this.lock} />
        <Map
          addresses={this.state.addresses}
          turf={this.state.turf}
          center={this.state.center}
          zoom={this.state.zoom}
        />
      </div>
    );
  }
}
