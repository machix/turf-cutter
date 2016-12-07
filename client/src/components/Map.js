import React from 'react';
import { flow } from 'lodash';
import { withGoogleMap, GoogleMap, Marker, Polygon } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager';
import { Dimmer, Loader } from 'semantic-ui-react';
import Data from '../utils/Data';
import { colorGenerator } from '../utils/helpers';
import mapStyles from '../utils/map-styles';

const AsyncGoogleMap = flow(withGoogleMap, withScriptjs)((props) => {
  /* eslint-disable no-undef */

  return (
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={props.zoom}
      defaultCenter={props.center}
      options={{
        disableDoubleClickZoom: true,
        styles: mapStyles,
        minZoom: 14
      }}
      onRightClick={props.handleMapRightClick}
      onZoomChanged={props.handleZoomChange}
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
        // const onMouseUp = () => props.handleTurfMouseUp(turf);
        const options = {
          clickable: turf.clickable,
          strokeWeight: turf.strokeWeight,
          strokeColor: turf.strokeColor,
          fillColor: turf.fillColor,
          editable: turf.editable
        };
        return (
          <Polygon
            id={turf._id}
            ref={props.handleTurfRefs}
            key={`turf-${turf._id}`}
            path={turf.path}
            options={options}
            onClick={onClick}
            onRightClick={e => props.handleTurfRightClick(e)}
          />
        );
      })}
      {props.markers.map((marker) => {
        let iconColor = '#111111';
        const point = new google.maps.LatLng(marker.latitude, marker.longitude);
        props.turfPolygons.forEach((polygon) => {
          if (google.maps.geometry.poly.containsLocation(point, polygon)) {
            iconColor = polygon.strokeColor;
          }
        });
        const onClick = () => props.handleMarkerClick(marker);
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
            key={`address-${marker._id}`}
            position={point}
            icon={houseIcon}
            // onClick={onClick}
            {...marker}
          />
        );
      })}
    </GoogleMap>
  );
});

export default class Map extends React.Component {
  static propTypes = {
    turf: React.PropTypes.object,
    center: React.PropTypes.object
  }

  state = {
    turf: [],
    turfPolygons: [],
    addresses: []
  }

  handleMapLoad = (map) => {
    this._mapComponent = map; // eslint-disable-line no-underscore-dangle
    const polygons = [];
    for (let i = 0; i < this.props.turf.length; i++) { // eslint-disable-line
      const polygon = new google.maps.Polygon({
        id: this.props.turf[i]._id,
        path: this.props.turf[i].path,
        strokeColor: this.props.turf[i].strokeColor
      });
      polygons.push(polygon);
    }
    this.setState({
      turf: this.props.turf,
      turfPolygons: polygons,
    });
  }

  handleZoomChange = () => {
    const zoom = this._mapComponent.getZoom();
    if (zoom === 16) {
      this.setState({
        addresses: []
      });
    } else if (zoom === 17) {
      this.setState({
        addresses: this.props.addresses
      });
    }
  }

  handleMapRightClick = (e) => {
    Data.post('geocode', undefined, e.latLng, (res) => {
      if (!res.error) {
        const addresses = this.state.addresses;
        addresses.push(res);
        this.setState({
          addresses
        });
      } else { console.log(res.error); }
    });
  }

  handleTurfRightClick = (e) => {
    Data.post('geocode', undefined, e.latLng, (res) => {
      if (!res.error) {
        const addresses = this.state.addresses;
        addresses.push(res);
        this.setState({
          addresses
        });
      } else { console.log(res.error); }
    });
  }

  handleTurfCreation = (polygon) => {
    let lastColor;
    if (localStorage.getItem('last-color')) {
      lastColor = localStorage.getItem('last-color');
    }
    colorGenerator(lastColor, (color) => {
      const options = {
        clickable: true,
        strokeWeight: 2.0,
        strokeColor: color.val,
        fillColor: color.val
      };

      polygon.setOptions(options);

      const polygonData = options;
      polygonData.path = polygon.getPath().getArray();

      polygon.setMap(null);

      Data.post('turf', undefined, polygonData, (res) => {
        if (!res.error) {
          const turf = this.state.turf;
          const turfPolygons = this.state.turfPolygons;
          const newPolygon = new google.maps.Polygon({
            id: res._id,
            path: res.path,
            strokeColor: res.strokeColor
          });
          turfPolygons.push(newPolygon);
          turf.push(res);
          this.setState({
            turf,
            turfPolygons
          });
        } else { console.log(res.error); }
      });
    });
  }

  handleTurfClick = (targetTurf) => {
    if (!targetTurf.editable) {
      this.setState({
        turf: this.state.turf.map((turf) => {
          if (turf === targetTurf) {
            return {
              ...turf,
              editable: true,
              strokeWeight: 3
            };
          }
          return {
            ...turf,
            editable: false,
            strokeWeight: 2
          };
        })
      });
    } else {
      this.setState({
        turf: this.state.turf.map((turf) => {
          return {
            ...turf,
            editable: false,
            strokeWeight: 2
          };
        })
      });
    }
  }

  handleTurfRefs = (turfRef) => {
    turfRef.getPaths().forEach((path) => {
      google.maps.event.addListener(path, 'insert_at', () => {
        Data.post('turf', `?id=${turfRef.props.id}`, {
          path: turfRef.getPath().getArray()
        }, (res) => {
          if (!res.error) {
            const turf = this.state.turf.map((t) => {
              if (t._id === res._id) return res;
              return t;
            });
            const turfPolygons = this.state.turfPolygons.map((p) => {
              if (p.id === res._id) {
                const newP = new google.maps.Polygon({
                  id: res._id,
                  path: res.path,
                  strokeColor: res.strokeColor
                });
                console.log(newP);
                return newP;
              }
              return p;
            });
            this.setState({
              turf,
              turfPolygons
            });
          } else { console.log(res.error); }
        });
      });

      google.maps.event.addListener(path, 'remove_at', () => {
        Data.post('turf', `?id=${turfRef.props.id}`, {
          path: turfRef.getPath().getArray()
        }, (res) => {
          if (!res.error) {
            const turf = this.state.turf.map((t) => {
              if (t._id === res._id) return res;
              return t;
            });
            const turfPolygons = this.state.turfPolygons.map((p) => {
              if (p.id === res._id) {
                const newP = new google.maps.Polygon({
                  id: res._id,
                  path: res.path,
                  strokeColor: res.strokeColor
                });
                return newP;
              }
              return p;
            });
            this.setState({
              turf,
              turfPolygons
            });
          } else { console.log(res.error); }
        });
      });

      google.maps.event.addListener(path, 'set_at', () => {
        Data.post('turf', `?id=${turfRef.props.id}`, {
          path: turfRef.getPath().getArray()
        }, (res) => {
          if (!res.error) {
            const turf = this.state.turf.map((t) => {
              if (t._id === res._id) return res;
              return t;
            });
            const turfPolygons = this.state.turfPolygons.map((p) => {
              if (p.id === res._id) {
                const newP = new google.maps.Polygon({
                  id: res._id,
                  path: res.path,
                  strokeColor: res.strokeColor
                });
                console.log(newP);
                return newP;
              }
              return p;
            });
            this.setState({
              turf,
              turfPolygons
            });
          } else { console.log(res.error); }
        });
      });
    });

    // google.maps.event.addListener(turf, 'mouseup', () => {
    //   console.log('mouseup!');
    //   turf.getPaths().forEach((path, index) => {
    //     google.maps.event.clearListeners(path, 'insert_at');
    //     google.maps.event.clearListeners(path, 'remove_at');
    //     google.maps.event.clearListeners(path, 'set_at');
    //   });
    // });
  }

  handleMarkerClick = (targetMarker) => {
    console.log(targetMarker);
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
        markers={this.state.addresses}
        turf={this.state.turf}
        turfPolygons={this.state.turfPolygons}
        handleMapRightClick={this.handleMapRightClick}
        handleZoomChange={this.handleZoomChange}
        handleTurfCreation={this.handleTurfCreation}
        handleTurfClick={this.handleTurfClick}
        handleTurfRightClick={this.handleTurfRightClick}
        handleTurfRefs={this.handleTurfRefs}
        handleMarkerClick={this.handleMarkerClick}
        center={this.props.center}
        zoom={this.props.zoom}
      />
    );
  }
}
