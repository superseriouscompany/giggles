'use strict';

const baseUrl = 'https://superserious.ngrok.io';

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
        console.log("got back body", body);
        return body.submissions[0];
      })
    }
  }
}
