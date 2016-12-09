import React, { Component } from 'react';
import { flow } from 'lodash';
import { withGoogleMap, GoogleMap, Marker, Polygon } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager';
import { Dimmer, Loader } from 'semantic-ui-react';
import Data from '../utils/Data';
import { colors } from '../utils/helpers';
import mapStyles from '../utils/map-styles';

const AsyncGoogleMap = flow(withGoogleMap, withScriptjs)((props) => {
  /* eslint-disable no-undef */
  return (
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={props.initialZoom}
      defaultCenter={props.center}
      options={{
        disableDoubleClickZoom: true,
        styles: mapStyles,
        minZoom: 14
      }}
      onRightClick={props.handleMapRightClick}
      // onZoomChanged={props.handleZoomChange}
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
      {props.turf.map((turf, i) => {
        const onClick = () => props.selectTurf(turf);
        const options = {
          clickable: turf.clickable,
          strokeWeight: turf.strokeWeight,
          strokeColor: turf.strokeColor,
          fillColor: turf.fillColor,
          editable: turf.editable
        };
        return (
          <Polygon
            key={i}
            index={i}
            id={turf._id}
            ref={props.handleTurfRefs}
            path={turf.path}
            options={options}
            onClick={onClick}
            onRightClick={e => props.handleTurfRightClick(e)}
          />
        );
      })}
      {props.addresses.map((address, i) => {
        let iconColor = '#111111';
        if (address.iconColor) iconColor = address.iconColor;
        const point = new google.maps.LatLng(address.latitude, address.longitude);
        const onClick = () => props.handleMarkerClick(address);
        const houseIcon = {
          url: `data:image/svg+xml;utf-8, \
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20" height="20" > \
            <style> \
              .st0{stroke:${iconColor};fill:${iconColor};stroke-miterlimit:8;} \
            </style> \
            <path class="st0" d="M23.74,8.45,12.37.12a.62.62,0,0,0-.74,0L.25,8.45a.62.62,0,0,0,.74,1L12,1.4,23,9.46a.62.62,0,0,0,.74-1Z"/> \
            <path class="st0" d="M20.73,9.6a.62.62,0,0,0-.62.62v9.93h-5V14.73a3.12,3.12,0,1,0-6.24,0v5.42h-5V10.22a.62.62,0,0,0-1.25,0V20.77a.62.62,0,0,0,.62.62H9.51a.62.62,0,0,0,.62-.58.47.47,0,0,0,0,0v-6a1.87,1.87,0,0,1,3.74,0v6a.46.46,0,0,0,0,0,.62.62,0,0,0,.62.58h6.24a.62.62,0,0,0,.62-.62V10.22A.62.62,0,0,0,20.73,9.6Z"/> \
          </svg>`,
          anchor: new google.maps.Point(8, 10)
        };
        return (
          <Marker
            key={i}
            index={i}
            turfId={address.turfId ? address.turfId : ''}
            position={point}
            icon={houseIcon}
            onClick={onClick}
            {...address}
          />
        );
      })}
    </GoogleMap>
  );
});

export default class Map extends Component {
  handleMapLoad = (map) => {
    this._mapComponent = map; // eslint-disable-line no-underscore-dangle
  }

  handleZoomChange = () => {
    // SOOO laggy, disabled for now
    const zoomLevel = this._mapComponent.getZoom();
    this.props.changeZoom(zoomLevel);
  }

  handleMapRightClick = (e) => {
    Data.post('geocode', undefined, e.latLng, (res) => {
      if (!res.error) {
        this.props.addAddress(res);
      } else { console.log(res.error); }
    });
  }

  handleTurfRightClick = (e) => {
    Data.post('geocode', undefined, e.latLng, (res) => {
      if (!res.error) {
        this.props.addAddress(res);
      } else { console.log(res.error); }
    });
  }

  handleTurfCreation = (polygon) => {
    let color;
    let lastColor = colors[colors.length - 1].key;
    if (localStorage.getItem('last-color')) {
      lastColor = localStorage.getItem('last-color');
    }
    colors.forEach((c, i) => {
      let newColor = i + 1;
      if (i === colors.length - 1) newColor = 0;
      if (c.key === lastColor) {
        color = colors[newColor];
        localStorage.setItem('last-color', colors[newColor].key);
      }
    });
    const options = {
      clickable: true,
      strokeWeight: 2.0,
      strokeColor: color.val,
      fillColor: color.val
    };

    polygon.setOptions(options);

    const polygonData = options;
    polygonData.path = polygon.getPath().getArray();

    // save parsed polygon data to db
    Data.post('turf', undefined, polygonData, (res) => {
      if (!res.error) {
        // update addresses if within turf
        this.props.assignAddressesToTurf(res._id, res.strokeColor, res.path, this.props.addresses);
        // call reducer to update state with saved data
        this.props.createTurf(res);
        // remove drawn polygon from map
        polygon.setMap(null);
        // save addresses to the server
        Data.post('addresses', undefined, this.props.addresses, (res) => {
          if (res.error) return console.log(res.error);
          return console.log('Addresses saved!');
        });
      } else { console.log(res.error); } // eslint-disable-line no-console
    });
  }

  handleTurfRefs = (turfRef) => {
    const listener = (path, type) => {
      google.maps.event.addListener(path, type, () => {
        // save turf to db
        Data.post('turf', `?id=${turfRef.props.id}`, {
          path: turfRef.getPath().getArray()
        }, (res) => {
          if (res.error) return console.log(res.error);
          // oddly enough, this feels much faster inside here.
          const pathArray = turfRef.getPath().getArray();
          const i = turfRef.props.index;
          const { turf, addresses } = this.props;
          // call actions to save turf and address state
          this.props.editTurf(pathArray, i);
          // except this is pretty slow
          this.props.assignAddressesToTurf(turf[i]._id, turf[i].strokeColor, pathArray, addresses);
          // add the listeners again
          turfRef.getPaths().forEach((newPath) => {
            listener(newPath, 'set_at');
            listener(newPath, 'insert_at');
            listener(newPath, 'remove_at');
          });
          // save addresses to db
          Data.post('addresses', undefined, this.props.addresses, (res) => {
            if (res.error) return console.log(res.error);
            return console.log('Turf and addresses saved!');
          });
        });
      });
    };

    turfRef.getPaths().forEach((path) => {
      listener(path, 'set_at');
      listener(path, 'insert_at');
      listener(path, 'remove_at');
    });
  }

  handleMarkerClick = (targetMarker) => {
    console.log(targetMarker);
  }

  render() {
    let loaded;
    // if map takes longer to load than turf and addresses, use a loader
    if (!this._mapComponent) {
      loaded = 'active';
    }
    return (
      <AsyncGoogleMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDWr-TXd0GmwW_Ykwp4tx1L-1gDxNmLiyc&libraries=drawing,geometry"
        loadingElement={
          <div className="map-loading-container">
            <Dimmer className={loaded}>
              <Loader size="medium">Loading Map...</Loader>
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
        center={this.props.center}
        initialZoom={this.props.zoom}
        handleZoomChange={this.handleZoomChange}
        turf={this.props.turf}
        handleTurfCreation={this.handleTurfCreation}
        selectTurf={this.props.selectTurf}
        handleTurfRefs={this.handleTurfRefs}
        addresses={this.props.addresses}
        handleMapRightClick={this.handleMapRightClick}
        handleTurfRightClick={this.handleTurfRightClick}
        handleMarkerClick={this.handleMarkerClick}
      />
    );
  }
}
