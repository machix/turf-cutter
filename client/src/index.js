import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import './css/normalize.css';
import './css/styles.css';
import '../node_modules/semantic-ui-css/semantic.css';

import App from './components/App';
import NotFound from './components/NotFound';

const Root = () => (
  // // requires react-router 4.0+
  // <BrowserRouter >
  //   <div>
  //     <Match exactly pattern="/" component={LocationSelect} />
  //     <Match pattern="/venues/:location(/:distance)" component={App} />
  //     <Miss component={NotFound} />
  //   </div>
  // </BrowserRouter>
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

render(<Root />, document.querySelector('#root'));
