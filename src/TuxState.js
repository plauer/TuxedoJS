'use strict';

var assign = require('object-assign');
var invariant = require('./TuxInvariant');
var update = require('../React/update');

// var assign = function(obj, extendObj){
//   for (var key in extendObj) {
//     if (extendObj.hasOwnProperty(key)) {
//       obj[key] = extendObj[key];
//     }
//   }
//   return obj;
// }

/*
callback = function(newSt, key, stAtKey, valAtKey) {
  newSt[key] = valAtKey * stAtKey
  delete newSt[key];
};
*/

var buildNewState = function (currentState, newProps, callback) {
  var newState = assign({}, currentState);
  var keyChain = [];
  var recurseKeys = function (currentSt, newSt, newPr) {
    for (var key in newPr) {
      if (newPr.hasOwnProperty(key)) {
        var valAtKey = newPr[key];
        //error check valAtKey
        var stAtKey = currentSt[key];
        if (valAtKey !== null && typeof valAtKey === 'object' && !Array.isArray(valAtKey) && stAtKey !== null && typeof stAtKey === 'object' && !Array.isArray(stAtKey)) {
          newSt[key] = assign({}, stAtKey);
          recurseKeys(stAtKey, newSt[key], valAtKey);
        } else {
          callback(newSt, key, stAtKey, valAtKey);

        }
      }
    }
  };
  recurseKeys(currentState, newState, newProps);
  return newState;
};


////////////////////////




//only assign on the key that is being operated on ...
//wherever you modify keys, make sure you assign
var findDeepKeysAndApply = function (currentState, newProps, callback) {
  var newState = assign({}, currentState);
  // var newObject = JSON.stringify(currentState);
  // var newObject = JSON.parse(newObject);
  console.log(currentState)
  var traverseProps = function (inputProps, keys) {
    keys = keys ? keys : [];
    var keyChain;

    for (var key in inputProps) {

      var keyChain = currentState;
      var newState = newProps;

      //KEEPS TRACK OF NESTED KEYS IN THE NEW PROPS ... KEYS IS AN ARRAY HOLDING EACH NESTED KEY THAT GETS YOU TO THE CURRENT PATH
      if (keys.length) {
        for (var i = 0; i < keys.length; i++) {
          // keyChain = keyChain[keys[i]];
          // newState = newState[keys[i]];
          keyChain = assign({}, keyChain[keys[i]]);
          newState = assign({}, newState[keys[i]]);
        }
      }

      //IF ANY OF HTE KEYS IN NEW PROPS DONT MATCH UP WITH CURRENT PROPS, ERROR
      invariant(keyChain.hasOwnProperty(key), 'The "%s" property is not defined in the current state.', key);

      //IF THERE IS A NESTED OBJECT, RECURSE BACK WITH THAT OBJECT
      if (Object.prototype.toString.call(inputProps[key]) === "[object Object]") {
        //PUSH THE CURRENT KEY TO THE KEYS ARRAY TO MAINTAIN THE PATH
        keys.push(key);
        traverseProps(inputProps[key], keys);
        keys.pop();
      } else {
        // IF THERE ARE NO MORE NESTED KEYS IN NEW PROPS, WE'VE FOUND THE DEEPEST KEY, SO RUN CALLBACK ON IT

        keyChain = callback(newState, keyChain, key);
        console.log(keyChain)
      }
    }
  };

  traverseProps(newProps);



  return currentState;
};

var hasAnyOuterKeysMatching = function (currentState, newProps) {
  for (var key in newProps) {
    if (currentState[key]) {
      return true;
    }
  }
  invariant(!newProps, "No keys match any keys in the current state.");
};

var invariantNumberCheck = function (input) {
  if (typeof(input) !== "number") {
    invariant(!input, 'Cannot perform operation on "%s" because it is not of type number.', input);
  };
};



var invariantArrayCheck = function (input, message) {
  if (!Array.isArray(input)) {
    invariant(!input, 'Cannot perform operation on "%s" because it is not an array.', input);
  };
};



var invariantValueCheck = function (input) {
  if (typeof(input) === "object") {
    invariant(!input, 'Cannot perform operation on "%s" because it must be a single value.', input);
  }
}

var invariantNumberOrStringCheck = function (input) {
  if (typeof(input) !== "number" && typeof(input) !== "string") {
    // console.log(typeof(input))
    invariant(!input, 'Cannot perform operation on "%s" because it is not of type number or of type string.', input);
  };
};

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

  addState: function (propsToAdd, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToAdd, function(newState, key, currentStateAtKey, newPropsAtKey) {
      invariantNumberOrStringCheck(newPropsAtKey);
      newState[key] = currentStateAtKey + newPropsAtKey;
    });
    this.setState(newState, callback);
  },

  subtractState: function(propsToSubtract, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToSubtract, function(newState, key, currentStateAtKey, newPropsAtKey) {
      invariantNumberCheck(newPropsAtKey);
      newState[key] = currentStateAtKey - newPropsAtKey;
    });
    this.setState(newState, callback);
  },

  multiplyState: function (propsToMultiply, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToMultiply, function(newState, key, currentStateAtKey, newPropsAtKey) {
      invariantNumberCheck(newPropsAtKey);
      newState[key] = currentStateAtKey * newPropsAtKey;
    });
    this.setState(newState, callback);
  },

  divideState: function (propsToDivide, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToDivide, function(newState, key, currentStateAtKey, newPropsAtKey) {
      invariantNumberCheck(newPropsAtKey);
      newState[key] = currentStateAtKey / newPropsAtKey;
    });
    this.setState(newState, callback);
  },

  omitState: function (propsToOmit, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToOmit, function(newState, key, currentStateAtKey, newPropsAtKey) {
      delete newState[key];
    });
    this.replaceState(newState, callback);
  },

  extendState: function (propsToExtend, callback) {
    var currentState = assign({}, this.state);
    if (hasAnyOuterKeysMatching(currentState, propsToExtend)) {
      var newState = assign(currentState, propsToExtend);
      this.setState(newState, callback);
    }
  },

  pushState: function (propsToPush, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToPush, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //check that current state at this key is an array
      invariantArrayCheck(currentStateAtKey);
      //check that there is only one value being pushed in
      invariantValueCheck(newPropsAtKey);
      currentStateAtKey.push(newPropsAtKey);
      newState[key] = currentStateAtKey;
    });
    //do we really need to call this since we're mutating the current state already?
    this.setState(newState, callback);
  },

  popState: function (propsToPop, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToPop, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //check that current state at this key is an array
      invariantArrayCheck(currentStateAtKey);

      currentStateAtKey.pop();
      newState[key] = currentStateAtKey;
    });
    //do we really need to call this since we're mutating the array?
    this.setState(newState);
  },

  unshiftState: function(propsToUnshift, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToUnshift, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //check that current state at this key is an array
      invariantArrayCheck(currentStateAtKey);
      //check that there is only one value being pushed in
      invariantValueCheck(newPropsAtKey);
      currentStateAtKey.unshift(newPropsAtKey);
      newState[key] = currentStateAtKey;
    });
    //do we really need to call this since we're mutating the array?
    this.setState(newState, callback);
  },

  shiftState: function(propsToShift, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToShift, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //check that current state at this key is an array
      invariantArrayCheck(currentStateAtKey);
      currentStateAtKey.shift();
      newState[key] = currentStateAtKey;
    });
    //do we really need to call this since we're mutating the array?
    this.setState(newState, callback);
  },

  spliceState: function(propsToSplice, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToSplice, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //check that current state at this key is an array
      invariantArrayCheck(currentStateAtKey);

      //Should probably check that first 2 indexes of newPropsAtKey are integers? or should we let native javasciprt error handle that?
      Array.prototype.splice.apply(currentStateAtKey, newPropsAtKey);
      newState[key] = currentStateAtKey;
    });
    //do we really need to call this since we're mutating the array?
    this.setState(newState, callback);
  },

  concatToEndOfState: function(propsToConcat, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToConcat, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //check that currentStateAtKey is an array
      invariantArrayCheck(currentStateAtKey);
      //check that newProps at this key is an array
      invariantArrayCheck(newPropsAtKey);
      //set the newState at this key to be the concatted result
      newState[key] = currentStateAtKey.concat(newPropsAtKey);
    });
    this.setState(newState, callback);
  },

  concatToFrontOfState: function(propsToConcat, callback) {
    var currentState = assign({}, this.state);
    var newState = buildNewState(currentState, propsToConcat, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //check that currentStateAtKey is an array
      invariantArrayCheck(currentStateAtKey);
      //check that newProps at this key is an array
      invariantArrayCheck(newPropsAtKey);
      //set the newState at this key to be the concatted result
      newState[key] = newPropsAtKey.concat(currentStateAtKey);
    });
    this.setState(newState, callback);
  },

  resetState : function (callback) {
    var newState = assign({}, this.getIntialState);
    this.replaceState(newState, callback);
  }
};


//ADD
// var propsToAdd = {
//   'Pat':{
//     'cat':{
//       'age':9
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
// console.log(stateConvenienceMethods.state);





//SUBTRACT
// var propsToSubtract = {
//   'Pat':{
//     'cat':{
//       'age':1
//     },
//     'dog':{
//       'age':1
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
// console.log(stateConvenienceMethods.state);






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
// console.log(stateConvenienceMethods.state);





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
// console.log(stateConvenienceMethods.state);

// OMIT
// var deleteProps = {
//   'Pat':{
//     'pigeon':true,
//     'cat':true,
//     'dog':{
//       'age':true
//     }
//   },
//   'Dmitri':true
// };
// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.omitState(deleteProps);

// // EXTEND
// var extendProps = {
//   'Dmitri':{
//     'birds':true
//   },
//   'Spencer':true
// };


// console.log(stateConvenienceMethods.state);
// console.log('');
// stateConvenienceMethods.extendState(extendProps);
// console.log(stateConvenienceMethods.state);




//PUSH ...
// var propsToPush = {
//   'Gunnari': {
//     'turtles':'Snuggles'
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.pushState(propsToPush);
// console.log(stateConvenienceMethods.state);



//POP
// var propsToPop = {
//   'Gunnari': {
//     'turtles':true
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.popState(propsToPop);
// console.log(stateConvenienceMethods.state);

//UNSHIFT
// var propsToUnshift = {
//   'Gunnari': {
//     'turtles':'Snuggles'
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.unshiftState(propsToUnshift);
// console.log(stateConvenienceMethods.state);


//SHIFT
// var propsToShift = {
//   'Gunnari': {
//     'turtles':true
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.shiftState(propsToShift);
// console.log(stateConvenienceMethods.state);






//SPLICE
// var propsToSplice = {
//   'Gunnari': {
//     'turtles':[1, 1, 'Wilbert', 'Jane', 'Mufasa']
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.spliceState(propsToSplice);
// console.log('');
// console.log(stateConvenienceMethods.state);

//CONCAT TO END
// var propsToConcat = {
//   'Gunnari': {
//     'turtles':['Wilbert', 'Jane', 'Mufasa']
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.concatToEndOfState(propsToConcat);
// console.log(stateConvenienceMethods.state);


//CONCAT TO FRONT
var propsToConcat = {
  'Gunnari': {
    'turtles':['Wilbert', 'Jane', 'Mufasa']
  }
};

console.log(stateConvenienceMethods.state);
stateConvenienceMethods.concatToFrontOfState(propsToConcat);
console.log(stateConvenienceMethods.state);








//SPLICE ... how are args passed in?
// var propsToSplice = {
//   'Gunnari': {
//     'turtles':true
//   }
// };

// console.log(stateConvenienceMethods.state);
// stateConvenienceMethods.shiftState(propsToShift);












