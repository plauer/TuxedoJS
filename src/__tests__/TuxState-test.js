'use strict';

var moduleToTest = 'tux/src/TuxState';
var invariant = require('tux/src/TuxInvariant');

jest.dontMock(moduleToTest);

describe('TuxState', function () {
  var stateMixin, callback;

  beforeEach(function () {
    stateMixin = require(moduleToTest);
    stateMixin.state = {
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
    };
    stateMixin.getInitialState = function () {
      return {
        'Pat':true,
        'Dmitri':true,
        'Gunnari':true,
        'Spencer':true
      };
    };
    stateMixin.setState = jest.genMockFunction();
    stateMixin.replaceState = jest.genMockFunction();
    callback = function () {
      return;
    };

  });

  describe('addState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToAdd = {
        'Pat':{
          'cat':{
            'age':9
          }
        },
        'Dmitri':{
          'cat': {
            'name':'-Gunnari'
          }
        }
      };
      stateMixin.addState(propsToAdd, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth', 'age': 19
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
           'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12, 'name': 'Spencer-Gunnari'
          }
        },
        'Gunnari': {
         'turtles': [ 'Pat', 'Spencer' ]
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('subtractState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToSubtract = {
        'Pat':{
          'cat':{
            'age':1
          },
          'dog':{
            'age':7
          }
        },
        'Dmitri':{
          'cat': {
            'age':2
          }
        }
      };
      stateMixin.subtractState(propsToSubtract, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth', 'age': 9
          },
          'dog': {
            'age': 3
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 10, 'name': 'Spencer' } },
        'Gunnari': {
          'turtles': [ 'Pat', 'Spencer' ]
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('multiplyState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToMultiply = {
        'Pat':{
          'cat':{
            'age':2
          },
          'dog':{
            'age':3
          }
        },
        'Dmitri':{
          'cat': {
            'age':2
          }
        }
      };
      stateMixin.multiplyState(propsToMultiply, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth', 'age': 20
          },
          'dog': {
            'age': 30
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 24,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': [ 'Pat', 'Spencer' ]
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('divideState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToDivide = {
        'Pat':{
          'cat':{
            'age':2
          },
          'dog':{
            'age':30
          }
        },
        'Dmitri':{
          'cat': {
            'age':2
          }
        }
      };
      stateMixin.divideState(propsToDivide, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth', 'age': 5
          },
          'dog': {
            'age': 0.3333333333333333
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 6,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': [ 'Pat', 'Spencer' ]
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('omitState', function () {
    it('should call replaceState with the proper inputs', function () {
      var propsToOmit = {
        'Pat':{
          'pigeon':true,
          'cat':true,
          'dog':{
            'age':true
          }
        },
        'Dmitri':true
      };
      stateMixin.omitState(propsToOmit, callback);
      var expectedProps = {
        'Pat': {
          'dog': {},
          'squirrel': true,
        },
        'Gunnari': {
          'turtles': [ 'Pat', 'Spencer' ]
        }
      };
      expect(stateMixin.replaceState).toBeCalled();
      expect(stateMixin.replaceState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('extendState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToExtend = {
        'Dmitri':{
          'birds':true
        },
        'Spencer':true
      };

      stateMixin.extendState(propsToExtend, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth', 'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'birds': true
        },
        'Gunnari': {
          'turtles': [ 'Pat', 'Spencer' ]
        },
        'Spencer':true
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('pushState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToPush = {
        'Gunnari': {
          'turtles':'Snuggles'
        }
      };

      stateMixin.pushState(propsToPush, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat', 'Spencer', 'Snuggles']
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('popState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToPop = {
        'Gunnari': {
          'turtles':true
        }
      };

      stateMixin.popState(propsToPop, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat']
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('unshiftState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToUnshift = {
        'Gunnari': {
          'turtles':'Snuggles'
        }
      };

      stateMixin.unshiftState(propsToUnshift, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Snuggles', 'Pat', 'Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('shiftState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToShift = {
        'Gunnari': {
          'turtles':true
        }
      };

      stateMixin.shiftState(propsToShift, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });

    it('should throw an error if the deepest key is not a single value', function () {

    });

    it('should throw an error if the corresponding key in the current state is not an array', function () {

    });
  });

  describe('spliceState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToSplice = {
        'Gunnari': {
          'turtles':[1, 1, 'Wilbert', 'Jane', 'Mufasa']
        }
      };

      stateMixin.spliceState(propsToSplice, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat', 'Wilbert', 'Jane', 'Mufasa']
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });

    it('should throw an error if any of the deepest keys in the passed in object is not an array of arguments', function () {

    });

    it('should throw an error if the corresponding key in the current state is not an array', function () {

    });
  });

  describe('concatToEndOfState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToConcat = {
        'Gunnari': {
          'turtles':['Wilbert', 'Jane', 'Mufasa']
        }
      };

      stateMixin.concatToEndOfState(propsToConcat, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Pat', 'Spencer', 'Wilbert', 'Jane', 'Mufasa']
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('concatToFrontOfState', function () {
    it('should call setState with the proper inputs', function () {
      var propsToConcat = {
        'Gunnari': {
          'turtles':['Wilbert', 'Jane', 'Mufasa']
        }
      };

      stateMixin.concatToFrontOfState(propsToConcat, callback);
      var expectedProps = {
        'Pat': {
          'cat': {
            'name': 'Mr. Bigglesworth',
            'age': 10
          },
          'dog': {
            'age': 10
          },
          'squirrel': true,
          'pigeon': {
            'fat': true
          }
        },
        'Dmitri': {
          'cat': {
            'age': 12,
            'name': 'Spencer'
          }
        },
        'Gunnari': {
          'turtles': ['Wilbert', 'Jane', 'Mufasa', 'Pat', 'Spencer']
        }
      };
      expect(stateMixin.setState).toBeCalled();
      expect(stateMixin.setState).toBeCalledWith(expectedProps, callback);
    });
  });

  describe('resetState', function () {
    it('should call replaceState with the proper inputs', function () {

      stateMixin.resetState(callback);
      var expectedProps = {
        'Pat':true,
        'Dmitri':true,
        'Gunnari':true,
        'Spencer':true
      };
      expect(stateMixin.replaceState).toBeCalled();
      expect(stateMixin.replaceState).toBeCalledWith(expectedProps, callback);
    });
  });
});
