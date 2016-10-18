'use strict';

const baseUrl = 'https://superserious.ngrok.io';

let cache = {
  submissions: {},
  captions: {},
};

module.exports = {
  submissions: {
    all: function(options = {}) {
      return fetch(`${baseUrl}/submissions`).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return response.json()
      }).then((body) => {
        return body.submissions;
      })
    },

    current: function(options = {}) {
      return fetch(`${baseUrl}/submissions`).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return response.json()
      }).then((body) => {
        console.log("got back body", body);
        return body.submissions[0];
      })
    }
  },

  captions: {
    all: function(options = {}) {
      return fetch(`${baseUrl}/captions`).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return response.json()
      }).then((body) => {
        return body.captions;
      })
    },

    like: function(id) {
      return fetch(`${baseUrl}/captions/${id}/like`, {
        method: 'POST'
      }).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return true;
      })
    },

    hate: function(id) {
      return fetch(`${baseUrl}/captions/${id}/hate`, {
        method: 'POST'
      }).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return true;
      })
    }
  }
}
