'use strict';

var assign = require('object-assign');
var invariant = require('tux/src/TuxInvariant');
var update = require('tux/React/update');

var hasAllOuterKeysMatching = function (props, currentState) {
  for (var key in props) {
    if (!currentState[key]) {
      return false;
    }
  }
  return true;
};

//refactor callback to take 3 args
var findDeepKeysAndApply = function (props, currentState, callback) {
  var traverseProps = function (inputProps, keys) {
    keys = keys ? keys : [];
    var keyChain;

    for (var key in inputProps) {
      var currentKey;

      var keyChain = currentState;
      var newState = props;
      if (keys.length) {
        for (var i = 0; i < keys.length; i++) {
          keyChain =  keyChain[keys[i]];
          newState = newState[keys[i]];
        }
      }

      invariant(keyChain.hasOwnProperty(key), 'The "%s" property is not defined in the current state.', key);
      currentKey = keyChain[key];

      if (Object.prototype.toString.call(inputProps[key]) === "[object Object]") {
        keys.push(key);
        traverseProps(inputProps[key], keys);
        keys.pop();
      } else {
        keyChain[key] = callback(newState[key], keyChain[key]);
      }
    }
  };
  traverseProps(props);
  return currentState;
};

var hasAnyOuterKeysMatching = function (props, currentState) {
  for (var key in props) {
    if (currentState[key]) {
      return true;
    }
  }
  return false;
};

var obj1 = {
  'a':{
    'b':{
      'turtles':true
    }
  }
};

var obj2 = {
  'a':{}

};

console.log(obj1);

obj1 = assign({}, obj1, obj2);
console.log(obj1)


var stateConvenienceMethods = {
  state: {
    'Pat': {
      'cat': {
        'name':'Mr. Bigglesworth',
        'age':10
      },
      'dog':{
        'age':10
      },
      'squirrel':true,
      'pigeon':{
        'fat':true
      }
    },
    'Dmitri': {
      'cat':{
        'age': 12,
        'name':'Spencer'
      }
    },
    'Gunnari': {
      'turtles':['Pat', 'Spencer']
    }
  },

  setState: function(newState) {
    this.state = assign({}, this.state, newState);
  },

  addState: function (propsToAdd) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToAdd, state, function(newProps, originalProps) {
      return originalProps + newProps;
    }));
  },

  subtractState: function(propsToSubtract) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToSubtract, state, function(newProps, originalProps) {
      return originalProps - newProps;
    }));
  },

  multiplyState: function (propsToMultiply) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToMultiply, state, function(newProps, originalProps) {
      return originalProps * newProps;
    }));
  },

  divideState: function (propsToDivide) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToDivide, state, function(newProps, originalProps) {
      return originalProps / newProps;
    }));
  },

  omitState: function (propsToDelete) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToDelete, state, function(newProps, originalProps) {

    }));
    // this.setState(removePassedInKeys(propsToDelete, state));
  },

  extendState: function (newProps) {
    var newState = assign({}, this.state);
    if (hasAnyOuterKeysMatching(newProps, this.state)) {
      this.setState(assign(this.state, newProps));
    } else {
      invariant(newProps, "Passed in keys don't match any keys in the current state");
    }
  },

  pushState: function (propsToPush) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToPush, state, function(newProps, originalProps) {
      originalProps.push(newProps);
      return originalProps;
    }));
  },

  popState: function (propsToPop) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToPop, state, function(newProps, originalProps) {
      originalProps.pop();
      return originalProps;
    }));
  },

  unshiftState: function(propsToUnshift) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToUnshift, state, function(newProps, originalProps) {
      originalProps.unshift(newProps);
      return originalProps;
    }));
  },

  shiftState: function(propsToShift) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToShift, state, function(newProps, originalProps) {
      originalProps.shift();
      return originalProps;
    }));
  },

  spliceState: function(propsToSplice) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToSplice, state, function(newProps, originalProps) {
      //some splice logic here
      return originalProps;
    }));
  },

  concatToEndOfState: function(propsToConcat) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToConcat, state, function(newProps, originalProps) {
      originalProps = originalProps.concat(newProps);
      return originalProps;
    }));
  },

  concatToFrontOfState: function(propsToConcat) {
    var state = assign({}, this.state);
    console.log(findDeepKeysAndApply(propsToConcat, state, function(newProps, originalProps) {
      originalProps = newProps.concat(originalProps);
      return originalProps;
    }));
  },


  resetState : function () {
    var newState = assign({}, this.state);
    this.setState(newState);
  },

};

//CONCAT TO FRONT
// var propsToConcat = {
//   'Gunnari': {
//     'turtles':['Wilbert', 'Jane', 'Mufasa']
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.concatToFrontOfState(propsToConcat);

//CONCAT TO END
// var propsToConcat = {
//   'Gunnari': {
//     'turtles':['Wilbert', 'Jane', 'Mufasa']
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.concatToEndOfState(propsToConcat);

//SPLICE ... how are args passed in?
// var propsToSplice = {
//   'Gunnari': {
//     'turtles':true
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.shiftState(propsToShift);

//SHIFT
// var propsToShift = {
//   'Gunnari': {
//     'turtles':true
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.shiftState(propsToShift);

//UNSHIFT
// var propsToUnshift = {
//   'Gunnari': {
//     'turtles':'Dmitri'
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.unshiftState(propsToUnshift);


//POP
// var propsToPop = {
//   'Gunnari': {
//     'turtles':true
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.popState(propsToPop);

//PUSH ...
// var propsToPush = {
//   'Gunnari': {
//     'turtles':'Dmitri'
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.pushState(propsToPush);

//DIVIDE
// var propsToDivide = {
//   'Pat':{
//     'cat':{
//       'age':2
//     },
//     'dog':{
//       'age':30
//     }
//   },
//   'Dmitri':{
//     'cat': {
//       'age':2
//     }
//   }
// };


// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.divideState(propsToDivide);

//MULTIPLY
// var propsToMultiply = {
//   'Pat':{
//     'cat':{
//       'age':2
//     },
//     'dog':{
//       'age':3
//     }
//   },
//   'Dmitri':{
//     'cat': {
//       'age':2
//     }
//   }
// };


// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.multiplyState(propsToMultiply);

//SUBTRACT
// var propsToSubtract = {
//   'Pat':{
//     'cat':{
//       'age':1
//     },
//     'dog':{
//       'age':3
//     }
//   },
//   'Dmitri':{
//     'cat': {
//       'age':2
//     }
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.subtractState(propsToSubtract);

//ADD
// var propsToAdd = {
//   'Pat':{
//     'cat':{
//       'age':3
//     }
//   },
//   'Dmitri':{
//     'cat': {
//       'name':'-Gunnari'
//     }
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.addState(propsToAdd);


// OMIT
// var deleteProps = {
//   'Pat':{
//     'pigeon':{
//       'pigeon1':{
//         'fat':true
//       }
//     },
//     'cat':true,
//     'dog':{
//       'Dog1':true
//     }
//   },
//   'Dmitri':true
// };
// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.omitState(deleteProps);
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





