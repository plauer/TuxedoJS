'use strict';

var assign = require('object-assign');
var invariant = require('tux/src/TuxInvariant');

//buildNewState FUNCTION:
//@param currentState OBJECT: required object argument with deepest keys being numbers or strings to add to the current state
//@param newProps FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
//@param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
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
    invariant(!input, 'Cannot perform operation on "%s" because it must not be an array or object.', input);
  }
}

var invariantNumberOrStringCheck = function (input) {
  if (typeof(input) !== "number" && typeof(input) !== "string") {
    invariant(!input, 'Cannot perform operation on "%s" because it is not of type number or of type string.', input);
  };
};

var invariantArgCheck = function (input) {
  if (!input) {
    invariant(input, 'This function requires an object as an argument.');
  } else if (Object.prototype.toString.call(input) !== '[object Object]') {
    invariant(!input, 'This function requires an object as an argument.');
  }
};

//mixin to that adds convenient methods for updating the state of a component
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

  replaceState: function(newState) {
    this.state = assign({}, newState);
  },

  //addState FUNCTION: adds the values of the deepest keys in the passed in object to the corresponding deepest keys in the current state, or throws an error if keys don't match
  //@param propsToAdd OBJECT: required object argument with deepest keys being numbers or strings to add to the current state
  //@param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  addState: function (propsToAdd, callback) {
    //throw error if propsToAdd is undefined or not an object
    invariantArgCheck(propsToAdd);
    //make a shallow copy of the current state
    var currentState = assign({}, this.state);
    //build new state object
    var newState = buildNewState(currentState, propsToAdd, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //throw error if newPropsAtKey is not a number or string
      invariantNumberOrStringCheck(newPropsAtKey);
      //perform addition on the corresponding deep keys
      newState[key] = currentStateAtKey + newPropsAtKey;
    });
    //set state with the updated values and a callback (if provided)
    this.setState(newState, callback);
  },


  //subtractState FUNCTION: subtracts the value of the deepest keys in the passed in object to the corresponding deepest keys in the current state, or throws an error if keys don't match
  //@param propsToAdd OBJECT: required object argument with deepest keys being numbers to subtract the current state from
  //@param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  subtractState: function(propsToSubtract, callback) {
    //throw error if propsToSubtract is undefined or not an object
    invariantArgCheck(propsToSubtract);
    //make a shallow copy of the current state
    var currentState = assign({}, this.state);
    //build new state object
    var newState = buildNewState(currentState, propsToSubtract, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //throw error if newPropsAtKey is not a number
      invariantNumberCheck(newPropsAtKey);
      //perform subtraction on the corresponding deep keys
      newState[key] = currentStateAtKey - newPropsAtKey;
    });
    //set state with the updated values and a callback (if provided)
    this.setState(newState, callback);
  },

  //multiplyState FUNCTION: multiply the value of the deepest keys in the passed in object to the corresponding deepest keys in the current state, or throws an error if keys don't match
  //@param propsToMultiply OBJECT: required object argument with deepest keys being numbers to multiply the current state by
  //@param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  multiplyState: function (propsToMultiply, callback) {
    //throw error if propsToMultiply is undefined or not an object
    invariantArgCheck(propsToMultiply);
    //make a shallow copy of the current state
    var currentState = assign({}, this.state);
    //build new state object
    var newState = buildNewState(currentState, propsToMultiply, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //throw error if newPropsAtKey is not a number
      invariantNumberCheck(newPropsAtKey);
      //perform multiplication on the corresponding deep keys
      newState[key] = currentStateAtKey * newPropsAtKey;
    });
    //set state with the updated values and a callback (if provided)
    this.setState(newState, callback);
  },

  //divideState FUNCTION: divide the value of the deepest keys in the passed in object by the corresponding deepest keys in the current state, or throws an error if keys don't match
  //@param propsToDivide OBJECT: required object argument with deepest keys being numbers to divide the current state by
  //@param callback FUNCTION: optional callback argument that will be executed once setState is completed and the component is re-rendered
  divideState: function (propsToDivide, callback) {
    //throw error if propsToDivide is undefined or not an object
    invariantArgCheck(propsToDivide);
    //make a shallow copy of the current state
    var currentState = assign({}, this.state);
    //build new state object
    var newState = buildNewState(currentState, propsToDivide, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //throw error if newPropsAtKey is not a number
      invariantNumberCheck(newPropsAtKey);
      //perform division on the corresponding deep keys
      newState[key] = currentStateAtKey / newPropsAtKey;
    });
    //set state with the updated values and a callback (if provided)
    this.setState(newState, callback);
  },

  //omitState FUNCTION: removes the deepest keys in the passed in object from the corresponding deepest keys in the current state, or throws an error if keys don't match
  //@param propsToOmit OBJECT: required object argument with deepest keys being booleans
  //@param callback FUNCTION: optional callback that will be executed once setState is completed and the component is re-rendered
  omitState: function (propsToOmit, callback) {
    //throw error if propsToOmit is undefined or not an object
    invariantArgCheck(propsToOmit);
    //make a shallow copy of the current state
    var currentState = assign({}, this.state);
    //build new state object
    var newState = buildNewState(currentState, propsToOmit, function(newState, key, currentStateAtKey, newPropsAtKey) {
      //remove the deepest key
      delete newState[key];
    });
    //set state with the updated values and a callback (if provided)
    this.replaceState(newState, callback);
  },

  //extendState FUNCTION: adds new keys from the passed in object to the current state and overrides pre-existing keys, throws error if no outer keys in passed in object match outer keys in current state
  //@param propsToExtend OBJECT: required object argument with at least one outer key matching an outer key in the current state, and any additional keys being keys to add to the current state
  //@param callback FUNCTION: optional callback that will be executed once setState is completed and the component is re-rendered
  extendState: function (propsToExtend, callback) {
    //throw error if propsToExtend is undefined or not an object
    invariantArgCheck(propsToExtend);
    //make a shallow copy of the current state
    var currentState = assign({}, this.state);
    var matchedKey = false;
    //check that at least one outer key in the passed in object matches an outer key in the current state
    for (var key in propsToExtend) {
      if (currentState[key]) {
        //if we find any key that maches a key in the current state, set matchedKey to true
        matchedKey = true;
      }
    }
    //throw error if no keys match any keys in the current state
    invariant(matchedKey, "At least one outer key must match an outer key in the current state. Use setState if you only wish to add new keys and not change existing keys.");
    //build new object with all keys in the current state plus any additional keys in propsToExtend, overwriting any matching keys with those in propsToExtend
    var newState = assign({}, currentState, propsToExtend);
    //set state with the updated values and a callback (if provided)
    this.setState(newState, callback);
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
    this.setState(newState, callback);
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
    var newState = assign({}, this.getInitialState());
    this.replaceState(newState, callback);
  }
};

module.exports = stateConvenienceMethods;

// console.log(stateConvenienceMethods.addState({}));
