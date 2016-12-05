import React from 'react';
import { flow } from 'lodash';
import { withGoogleMap, GoogleMap, Marker, Polygon } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager';
import { Dimmer, Loader } from 'semantic-ui-react';
import Data from '../utils/Data';
import mapStyles from '../utils/map-styles';

const AsyncGoogleMap = flow(withGoogleMap, withScriptjs)((props) => {
  /* eslint-disable no-undef */
  return (
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={props.zoom}
      defaultCenter={props.center}
      options={{ disableDoubleClickZoom: true, styles: mapStyles }}
      onRightClick={props.handleMapRightClick}
    >
      <DrawingManager
        // defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
        defaultOptions={{
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.POLYGON
            ],
          }
        }}
        onPolygonComplete={props.handleTurfCreation}
      />
      {props.turf.map((turf) => {
        const onClick = () => props.handleTurfClick(turf);
        const options = {
          clickable: turf.clickable,
          strokeWeight: turf.strokeWeight,
          strokeColor: turf.strokeColor,
          fillColor: turf.fillColor,
          editable: turf.editable
        };
        return (
          <Polygon
            key={`turf-${turf._id}`}
            path={turf.path}
            options={options}
            onClick={onClick}
            onRightClick={e => props.handleTurfRightClick(e)}
          />
        );
      })}

      {/* {Object.keys(props.markers).map((key) => {
        const marker = props.markers[key];
        return (
          <Marker
            key={`venue-marker-${key}`}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            {...marker}
          />
        );
      })} */}
    </GoogleMap>
  );
});

export default class Map extends React.Component {
  static propTypes = {
    turf: React.PropTypes.object,
    center: React.PropTypes.object
  }

  state = {
    turf: []
  }

  handleMapLoad = (map) => {
    this._mapComponent = map; // eslint-disable-line no-underscore-dangle
    this.setState({
      turf: this.props.turf
    });
  }

  handleMapRightClick = (e) => {
    Data.post('geocode', e.latLng, (res) => {
      console.log(res);
    });

    // geocoder.reverse({ lat: e.latLng.lat, lon: e.latLng.lng }, (err, res) => {
    //   console.log(res);
    // });
  }

  handleTurfCreation = (polygon) => {
    const getRandomColor = () => {
      return `#${((1 << 24) * Math.random() | 0).toString(16)}`; // eslint-disable-line
    };
    const color = getRandomColor();
    const options = {
      clickable: true,
      strokeWeight: 2.0,
      strokeColor: color,
      fillColor: color
    };

    polygon.setOptions(options);

    google.maps.event.addListener(polygon, 'click', () => {
      if (!polygon.editable) {
        polygon.setOptions({
          editable: true
        });
      } else {
        polygon.setOptions({
          editable: false
        });
      }
    });

    const polygonData = options;
    polygonData.path = polygon.getPath().getArray();

    Data.post('turf', polygonData, (res) => {
      console.log(res.message || res.error);
    });
  }

  handleTurfClick = (targetTurf) => {
    if (!targetTurf.editable) {
      this.setState({
        turf: this.state.turf.map((turf) => {
          if (turf === targetTurf) {
            return {
              ...turf,
              editable: true
            };
          }
          return turf;
        })
      });
    } else {
      this.setState({
        turf: this.state.turf.map((turf) => {
          if (turf === targetTurf) {
            return {
              ...turf,
              editable: false
            };
          }
          return turf;
        })
      });
    }
  }

  handleTurfRightClick = (e) => {
    Data.post('geocode', e.latLng, (res) => {
      console.log(res);
    });
  }

  render() {
    let loaded;
    // if map takes longer to load than turf, use a loader
    if (this.props.turf.length > 0 && !this._mapComponent) {
      loaded = 'active';
    }
    return (
      <AsyncGoogleMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDWr-TXd0GmwW_Ykwp4tx1L-1gDxNmLiyc&libraries=drawing,geometry"
        loadingElement={
          <div style={{ height: '100%' }}>
            <Dimmer className={loaded}>
              <Loader size="small" />
            </Dimmer>
          </div>
        }
        containerElement={
          <div className="map-container" />
        }
        mapElement={
          <div className="map" />
        }
        onMapLoad={this.handleMapLoad}
        markers={this.props.constituents}
        turf={this.state.turf}
        handleTurfClick={this.handleTurfClick}
        handleTurfRightClick={this.handleTurfRightClick}
        handleTurfCreation={this.handleTurfCreation}
        handleMapRightClick={this.handleMapRightClick}
        center={this.props.center}
        zoom={this.props.zoom}
      />
    );
  }
}
