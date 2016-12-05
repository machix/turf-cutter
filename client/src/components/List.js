import React from 'react';

export default class VenueList extends React.Component {
  static propTypes = {
    venues: React.PropTypes.object // eslint-disable-line
  }

  renderVenues = (key) => {
    const venue = this.props.venues[key];
    return (
      <li key={`venue-${key}`} className="list-item">
        {/* TODO: apply selected style */}
        <h3>{venue.title}</h3>
        <div className="venue-address">{venue.address.street}</div>
        <div className="venue-address">
          {venue.address.city} {venue.address.state}, {venue.address.zip}
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className="list-stuff">
        <ul className="list">
          {Object.keys(this.props.venues).map(this.renderVenues)}
        </ul>
      </div>
    );
  }
}
