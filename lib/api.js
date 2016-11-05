'use strict';

const baseUrl = __DEV__ ?
  'https://superserious.ngrok.io' :
  'https://giggles.superserious.co';

let cache = {};

module.exports = {
  submissions: {
    all: function() {
      let promise;
      if( cache['submissions'] ) {
        promise = new Promise((resolve, reject) => {
          return resolve(cache['submissions']);
        })
      }

      const uncachedPromise = fetch(`${baseUrl}/submissions`).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        return response.json()
      }).then((body) => {
        cache['submissions'] = body.submissions;
        return body.submissions;
      })

      return promise || uncachedPromise;
    },

    current: function() {
      return module.exports.submissions.all().then(function(submissions) {
        return submissions[0];
      })
    },

    get: function(id) {
      return module.exports.submissions.all().then(function(submissions) {
        return submissions.find(function(s) { return s.id == id });
      })
    },

    jumpQueue: function(id, base64EncodedReceipt) {
      return fetch(`${baseUrl}/submissions/${id}/jumpQueue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({receipt: base64EncodedReceipt}),
      }).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        cache['submissions'] = null;
        return true;
      })
    },

    jumpQueueAndroid: function(id, purchaseToken) {
      return fetch(`${baseUrl}/submissions/${id}/jumpQueueAndroid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({purchaseToken: purchaseToken}),
      }).then(function(response) {
        if( !response.ok ) { throw new Error(response.status); }
        cache['submissions'] = null;
        return true;
      })
    },

    report: function(id) {
      return fetch(`${baseUrl}/submissions/${id}/report`, {
        method: 'POST',
      }).then(function(response) {
        if( !response.ok ) {throw new Error(response.status); }
        return true;
      })
    },

    create: function(imageUri) {
      return new Promise((resolve, reject) => {
        var body = new FormData();
        body.append('photo', {uri: imageUri, name: 'photo.jpg', type: 'image/jpeg'});

        var xhr = new XMLHttpRequest;
        xhr.onreadystatechange = (e) => {
          if( xhr.readyState !== 4 ) { return; }

          if( xhr.status < 299 ) {
            const json = JSON.parse(xhr.responseText);
            return resolve(json)
          } else {
            reject(xhr.status + ': ' + xhr.responseText);
          }
        }
        xhr.open('POST', `${baseUrl}/submissions`);
        xhr.send(body);
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
    },

    create: function(submissionId, audioPath) {
      return new Promise((resolve, reject) => {
        let body = new FormData();
        body.append('audio', {uri: 'file://'+audioPath, name: 'test.aac', type: 'audio/aac'});

        var xhr = new XMLHttpRequest;
        xhr.onreadystatechange = (e) => {
          if( xhr.readyState !== 4 ) { return; }
          if( xhr.status < 299 ) { return resolve(); }

          reject(xhr.status + ': ' + xhr.responseText);
        }
        xhr.open('POST', `${baseUrl}/submissions/${submissionId}/captions`);
        xhr.send(body);
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
