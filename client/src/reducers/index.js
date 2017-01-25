import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import map from './map';
import turf from './turf';
import addresses from './addresses';

const rootReducer = combineReducers({
  map, turf, addresses, routing: routerReducer,
});

export default rootReducer;
