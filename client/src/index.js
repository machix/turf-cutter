import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import * as actionCreators from './actions/actionCreator';
import store, { history } from './store';

import './css/normalize.css';
import './css/styles.css';
import '../node_modules/semantic-ui-css/semantic.css';

import App from './components/App';
import NotFound from './components/NotFound';


function mapStateToProps(state) {
  return {
    map: state.map,
    turf: state.turf,
    addresses: state.addresses
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const Root = connect(mapStateToProps, mapDispatchToProps)(App);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Root} />
      <Route path="*" component={NotFound} />
    </Router>
  </Provider>,
  document.querySelector('#root')
);
