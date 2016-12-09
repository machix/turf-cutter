function map(state = {
  zoom: 15,
  center: { lat: 40.754204, lng: -73.601047 }
}, action) {
  switch (action.type) {
    case 'CHANGE_ZOOM':
      return { ...state,
        zoom: action.zoomLevel
      };
    default:
      return state;
  }
}

export default map;
