import Data from '../utils/Data';

// action to change state to isFetching
export function requestTurf() {
  return {
    type: 'REQUEST_TURF'
    // TODO: add location qualifier
  };
}

// action to load turf to state
export function receiveTurf(turf) {
  return {
    type: 'RECEIVE_TURF',
    turf
  };
}

// use thunk to aync fetch turf and trigger both turf actions above
export function fetchTurf() {
  return (dispatch) => {
    dispatch(requestTurf());

    Data.get('turf', undefined, (res) => {
      // also convert turf into polygons for methods
      dispatch(receiveTurf(res));
    });
  };
}

export function createTurf(newTurf) {
  return {
    type: 'CREATE_TURF',
    newTurf
  };
}

export function selectTurf(selectedTurf) {
  return {
    type: 'SELECT_TURF',
    selectedTurf
  };
}

export function editTurf(newPath, index) {
  return {
    type: 'EDIT_TURF',
    newPath,
    index
  };
}

// action to change state to isFetching
export function requestAddresses() {
  return {
    type: 'REQUEST_ADDRESSES'
    // TODO: add location qualifier
  };
}

// action to load addresses to state
export function receiveAddresses(addresses) {
  return {
    type: 'RECEIVE_ADDRESSES',
    addresses
  };
}

// use thunk to aync fetch addresses and trigger both address actions above
export function fetchAddresses() {
  return (dispatch) => {
    dispatch(requestAddresses());

    Data.get('addresses', undefined, (res) => {
      dispatch(receiveAddresses(res));
    });
  };
}

export function assignAddressesToTurf(turfId, color, turfPath, addresses) {
  return {
    type: 'ASSIGN_ADDRESSES_TO_TURF',
    turfId,
    color,
    turfPath,
    addresses
  };
}

export function addAddress(newAddress) {
  return {
    type: 'ADD_ADDRESS',
    newAddress
  };
}

export function changeZoom(zoomLevel) {
  return {
    type: 'CHANGE_ZOOM',
    zoomLevel
  };
}

// export function removeComment(postId, index) {
//   return {
//     type: 'REMOVE_COMMENT',
//     postId,
//     index
//   };
// }
