import {
  AsyncStorage
} from 'react-native';

let likes = [];
let hates = [];

const self = {
  myId: function() {
    return AsyncStorage.getItem('@steffigraffiti:myId').then((id) => {
      if( id ) { return id; }
      const myId = String(Math.random());
      return AsyncStorage.setItem('@steffigraffiti:myId', myId).then(() => {
        return myId
      })
    })
  },

  hasAcceptedTerms: function() {
    return AsyncStorage.getItem('@steffigraffiti:acceptedTerms');
  },

  acceptTerms: function() {
    return AsyncStorage.setItem('@steffigraffiti:acceptedTerms', 'yes');
  },

  likes: function() {
    return AsyncStorage.getItem('@steffigraffiti:likes').then((likes) => {
      return likes ? JSON.parse(likes) : [];
    })
  },

  hates: function() {
    return AsyncStorage.getItem('@steffigraffiti:hates').then((hates) => {
      return hates ? JSON.parse(hates) : [];
    })
  },

  addLike: function(id) {
    return self.likes().then((likes) => {
      likes.push(id);
      return AsyncStorage.setItem('@steffigraffiti:likes', JSON.stringify(likes));
    })
  },

  addHate: function(id) {
    return self.hates().then((hates) => {
      hates.push(id);
      return AsyncStorage.setItem('@steffigraffiti:hates', JSON.stringify(hates));
    })
  },
}

module.exports = self;
