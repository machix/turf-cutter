function addresses(state = {
  isFetching: false,
  data: []
}, action) {
  switch (action.type) {
    case 'REQUEST_ADDRESSES':
      return { ...state,
        isFetching: true
      };
    case 'RECEIVE_ADDRESSES':
      return { ...state,
        isFetching: false,
        data: action.addresses
      };
    case 'ASSIGN_ADDRESSES_TO_TURF': {
      /* eslint-disable no-undef */
      const polygon = new google.maps.Polygon({ paths: action.turfPath });
      return { ...state,
        data: action.addresses.map((a) => {
          const point = new google.maps.LatLng(a.latitude, a.longitude);

          if (google.maps.geometry.poly.containsLocation(point, polygon)) {
            return { ...a,
              turfId: action.turfId,
              iconColor: action.color
            };
          } else if (a.turfId === action.turfId &&
          !google.maps.geometry.poly.containsLocation(point, polygon)) {
            return { ...a,
              turfId: null,
              iconColor: '#111111'
            };
          }
          return a;
        })
        /* eslint-enable no-undef */
      };
    }
    case 'ADD_ADDRESS':
      return { ...state,
        data: [...state.data,
          { ...action.newAddress }
        ]
      };
    default:
      return state;
  }
}

export default addresses;
