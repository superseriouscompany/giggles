'use strict';

const baseUrl = 'https://superserious.ngrok.io';

let cache = {
  submissions: {},
  captions: {},
};

module.exports = {
  submissions: {
    all: function() {
      return fetch(`${baseUrl}/submissions`).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return response.json()
      }).then((body) => {
        return body.submissions;
      })
    },

    current: function() {
      return fetch(`${baseUrl}/submissions`).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return response.json()
      }).then((body) => {
        return body.submissions[0];
      })
    },

    get: function(id) {
      return fetch(`${baseUrl}/submissions`).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return response.json()
      }).then((body) => {
        return body.submissions.find(function(s) { return s.id == id });
      })
    },

    jumpQueue: function(id, base64EncodedReceipt) {
      return fetch(`${baseUrl}/submissions/${id}/jumpQueue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({receipt: base64EncodedReceipt}),
      }).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return true;
      })
    }
  },

  captions: {
    current: function() {
      return fetch(`${baseUrl}/captions`).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return response.json()
      }).then((body) => {
        return body.captions;
      })
    },

    forSubmission: function(id) {
      return fetch(`${baseUrl}/submissions/${id}/captions`).then(function(response) {
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
  },

  killSwitch: function() {
    return fetch(`${baseUrl}/kill`).then(function(response) {
      if( !response.ok ) { throw new Error(response.status); }
      return response.json();
    }).then(body => {
      return !!body.kill;
    })
  }
}
