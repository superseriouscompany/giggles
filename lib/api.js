'use strict';

const baseUrl = 'https://superserious.ngrok.io';

let cache = {
  submissions: {},
  captions: {},
};

module.exports = {
  submissions: {
    all: function(options = {}) {
      if( !cache.submissions.all || options.bustCache ) {
        cache.submissions.all = fetch(`${baseUrl}/submissions`).then(function(response) {
          if( !response.ok ) { throw new Error(response.status); }
          return response.json()
        }).then((body) => {
          return body.submissions;
        })
      }

      return cache.submissions.all;
    },

    current: function(options = {}) {
      if( !cache.submissions.current || options.bustCache ) {
        cache.submissions.current = fetch(`${baseUrl}/submissions`).then(function(response) {
          if( !response.ok ) { throw new Error(response.status); }
          return response.json()
        }).then((body) => {
          console.log("got back body", body);
          return body.submissions[0];
        })
      }

      return cache.submissions.current;
    }
  },

  captions: {
    all: function(options = {}) {
      if( !cache.captions.all || options.bustCache ) {
        cache.captions.all = fetch(`${baseUrl}/submissions/${options.submission_id}/captions`).then(function(response) {
          if( !response.ok ) { throw new Error(response.status); }
          return response.json()
        }).then((body) => {
          return body.captions;
        })
      }
      return cache.captions.all;
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
