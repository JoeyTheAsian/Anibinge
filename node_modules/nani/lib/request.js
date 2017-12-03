'use strict';

const url = require('./utils').url;
const hasParam = require('./utils').hasParam;
const isExpired = require('./utils').isExpired;
const fetch = require('isomorphic-fetch');

let request = function (authInfo, query) {
  let token = authInfo.token;
  let expires = authInfo.expires;

  if (!token || isExpired(expires)) {
    return Promise.reject(new Error('Token does not exist or has expired'));
  }

  let fullQuery = `${url + query}`;
  fullQuery = hasParam(fullQuery)
    ? `${fullQuery}&access_token=${token}`
    : `${fullQuery}?access_token=${token}`;

  return fetch(fullQuery)
    .then(response => {
      if (response.status === 404 || response.status === 500) {
        throw new Error('Bad query');
      }

      if (response.status === 401) {
        throw new Error('Token does not exist or has expired');
      }

      return response.json();
    });
};

module.exports = request;
