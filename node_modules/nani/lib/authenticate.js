'use strict';

const url = require('./utils').url;
const fetch = require('isomorphic-fetch');

let authenticate = function (id, secret) {
  if (!id || !secret) {
    return Promise.reject(new Error('No client ID or secret given'));
  }

  let formData = {
    grant_type: 'client_credentials',
    client_id: id,
    client_secret: secret
  };

  return fetch(`${url}auth/access_token`, {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formData)
  })
    .then(result => result.json())
    .then(result => {
      return {
        token: result.access_token,
        expires: result.expires
      };
    });
};

module.exports = authenticate;
