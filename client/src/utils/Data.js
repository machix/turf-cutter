import fetch from 'isomorphic-fetch';

import config from '../utils/config';

/* eslint-disable class-methods-use-this */

const Data = {
  get(dataType, query, cb) {
    let path;
    !query ? path = `/api/${dataType}` : path = `/api/${dataType}${query}`;
    return fetch(path, {
      method: 'get',
      accept: 'application/json',
      headers: new Headers({
        'Content-Type': 'text/plain',
        'x-access-token': config.clientApiToken
      })
    }).then(this.checkStatus)
      .then(this.parseJSON)
      .then(cb);
  },

  post(dataType, query, data, cb) {
    let path;
    !query ? path = `/api/${dataType}` : path = `/api/${dataType}${query}`;
    return fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(this.checkStatus)
      .then(this.parseJSON)
      .then(cb);
  },

  checkToken(cb) {
    // TODO: auth0 token verification
    cb();
  },

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  },

  parseJSON(response) {
    return response.json();
  }
};

export default Data;
