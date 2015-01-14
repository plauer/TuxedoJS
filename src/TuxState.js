'use strict';

var assign = require('object-assign');
var invariant = require('./TuxInvariant');

var hasAllOuterKeysMatching = function (props, currentState) {
  for (var key in props) {
    if (!currentState[key]) {
      return false;
    }
  }
  return true;
};

var removePassedInKeys = function (props, currentState) {
  var traverseProps = function (inputProps, keys) {
    keys = keys ? keys : [];
    var keyChain;

    for (var key in inputProps) {
      var currentKey;

      var keyChain = currentState;
      if (keys.length) {
        for (var i = 0; i < keys.length; i++) {
          keyChain = keyChain[keys[i]];
        }
      }

      invariant(keyChain.hasOwnProperty(key), 'The "%s" property is not defined in the current state.', key);
      currentKey = keyChain[key];

      if (Object.prototype.toString.call(inputProps[key]) === "[object Object]") {
        keys.push(key);
        traverseProps(inputProps[key], keys);
        keys.pop();
      } else {
        delete keyChain[key];
      }
    }
  };
  traverseProps(props);
  return currentState;
};

// var addToKeys = function (props, currentState) {
//   var traverseProps = function (inputProps, keys) {
//     keys = keys ? keys : [];
//     var keyChain;

//     for (var key in inputProps) {
//       var currentKey;

//       var keyChain = currentState;
//       if (keys.length) {
//         for (var i = 0; i < keys.length; i++) {
//           keyChain = keyChain[keys[i]];
//         }
//       }

//       invariant(keyChain.hasOwnProperty(key), 'The "%s" property is not defined in the current state.', key);
//       currentKey = keyChain[key];

//       if (Object.prototype.toString.call(inputProps[key]) === "[object Object]") {
//         keys.push(key);
//         traverseProps(inputProps[key], keys);
//         keys.pop();
//       } else {

//       }
//     }
// }

var hasAnyOuterKeysMatching = function (props, currentState) {
  for (var key in props) {
    if (currentState[key]) {
      return true;
    }
  }
  return false;
};

var stateConvenienceMethods = {
  state: {
    'Pat': {
      'cat':false,
      'dog':{
        'Dog1':true
      },
      'squirrel':true,
      'pigeon':{
        'pigeon1':{
          'fat':true
        }
      }
    },
    'Dmitri': {
      'cat':{
        'Cat1': true,
        'Cat2':true
      }
    }
  },

  setState: function(newState) {
    this.state = assign(this.state, newState);
  },

  //keep overwirting keys with asigned versions of those keys + whatever keys you're modifying
  // currentState: {this.state},

  resetState : function () {
    var newState = assign({}, this.state);
    this.setState(newState);
    // this.currentState = this.getInitialState;
  },

  addState: function (newProps) {
    var state = assign({}, this.state);
    var addToKeys = function (object, keyToAddTo) {
      return
    }
  },

  omitState: function (propsToDelete) {
    var state = assign({}, this.state);

    console.log(removePassedInKeys(propsToDelete, state));
    // this.setState(removePassedInKeys(propsToDelete, state));
  },

  //deepSearch ... in mutableRenderMixin
    //iterate through each key
    //if any key is an object, recurse through again

  extendState: function (newProps) {
    var newState = assign({}, this.state);
    if (hasAnyOuterKeysMatching(newProps, this.state)) {
      this.setState(assign(this.state, newProps));
    } else {
      throw "Passed in keys don't match any keys in the current state"
    }
  }

};

var currentProps = {
  'Pat': {
    'cat':false,
    'dog':{
      'Dog1':true
    },
    'squirrel':true,
    'pigeon':{
      'pigeon1':{
        'fat':true
      }
    }
  },
  'Dmitri': {
    'cat':{
      'Cat1': true,
      'Cat2':true
    }
  }
};

// OMIT
var deleteProps = {
  'Pat':{
    'pigeon':{
      'pigeon1':{
        'fat':true
      }
    },
    'cat':true,
    'dog':{
      'Dog1':true
    }
  },
  'Dmitri':true
};
console.log(stateConvenienceMethods.state);
stateConvenienceMethods.omitState(deleteProps);
// console.log(stateConvenienceMethods.state);

// // EXTEND
// var newObj = {
//   characteristics: {
//     id: 2,
//     username: 'Guns',
//     newChar: {
//       newProp: true
//     }
//   },
//   somePropThatsNotInState: true
// };


// console.log(stateConvenienceMethods.state);

// // stateConvenienceMethods.extendState(newObj);
// stateConvenienceMethods.extendState({somePropThatsNotInState: true});

// console.log(stateConvenienceMethods.state);





