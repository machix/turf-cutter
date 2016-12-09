import React, { Component } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import Auth0Lock from 'auth0-lock';
import Header from './Header';
import Map from './Map';
import Data from '../utils/Data';

export default class App extends Component {
  static propTypes = {
    params: React.PropTypes.object // eslint-disable-line
  }

  componentWillMount() {
    this.props.fetchTurf();
    this.props.fetchAddresses();
  }

  render() {
    let loading;
    const { turf, addresses, map } = this.props;
    turf.isFetching || addresses.isFetching ? loading = 'active' : loading = '';
    return (
      <div className="app">
        <Dimmer className={loading}>
          <Loader size="large">&nbsp;</Loader>
        </Dimmer>
        <Header />
        <Map
          center={map.center}
          zoom={map.zoom}
          changeZoom={this.props.changeZoom}
          turf={turf.data}
          createTurf={this.props.createTurf}
          selectTurf={this.props.selectTurf}
          editTurf={this.props.editTurf}
          addresses={addresses.data}
          assignAddressesToTurf={this.props.assignAddressesToTurf}
          addAddress={this.props.addAddress}
        />
      </div>
    );
  }
}
