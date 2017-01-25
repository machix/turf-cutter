import { createStore, compose, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import rootReducer from './reducers/index';

const defaultState = {
  map: {
    zoom: 15,
    center: { lat: 40.754204, lng: -73.601047 },
  },
  turf: {
    isFetching: false,
    data: [],
  },
  addresses: {
    isFetching: false,
    data: [],
  },
};

const enhancers = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
);

const store = createStore(rootReducer, defaultState, enhancers);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
