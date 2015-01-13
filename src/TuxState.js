'use strict';

var assign = require('object-assign');

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
      if (keys.length) {
        var keyChain = "currentState";
        for (var i = 0; i < keys.length; i++) {
          keyChain += "['" + keys[i] + "']";
        }
        currentKey = eval(keyChain + "['" + key + "']");
      } else {
        currentKey = currentState[key];
      }

      if (currentKey === undefined) {
        throw "Key " + key + " doesn't match any keys in the current state.";
      } else {
        if (Object.prototype.toString.call(inputProps[key]) === "[object Object]") {
          keys.push(key);
          traverseProps(inputProps[key], keys);
          keys.pop();
        } else {
          // keys = [];
          console.log('**************')
          console.log('DEEPEST KEY IS ' + key);
          console.log(keyChain)

        }
      }
    }

  };
  traverseProps(props);
};

// var removePassedInKeys = function (props, currentState) {

//   var traverse = function (inputProps, keyChain) {
//     for (var key in inputProps) {
//       // console.log("Key is " + key);
//       // console.log(keyChain);
//       if (currentState[key] === undefined) {
//         throw "Key " + key + " was not found in current state";
//       }
//       else if (Object.prototype.toString.call(props[key]) === "[object Object]") {
//         keyChain.push(key);
//         traverse(inputProps[key], keyChain);
//         keyChain.pop();
//       } else {
//         console.log("DEEPEST KEY IS " + key);
//         keyChain.pop();
//       }
//     }
//   };

//   traverse(props, []);
// };

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

console.log(removePassedInKeys(deleteProps, currentProps));

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
    characteristics: {
      'meow':true,
      id: 1,
      username: 'Pat'
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

  },

  omitState: function (propsToDelete) {
    removePassedInKeys(propsToDelete);
    //iterate tthrough each key recursively,
      //if any keys dont match, throw an error
      //else if key matches
        //if there are child Objects in each key, find that key and remove it from this.state


    // if (hasAllOuterKeysMatching(propsToDelete, this.state)) {

    // } else {
    //   throw "There are keys passed in that don't match the current state";
    // }

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


// OMIT
// var newObj = {
//   characteristics: {
//     id: true,
//     username: true
//   }
// };
// stateConvenienceMethods.omitState(newObj);
// console.log(stateConvenienceMethods.currentState);

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




