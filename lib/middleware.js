'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_FINISHED = exports.API_REQUEST_SENT = exports.NO_TOKEN_STORED = exports.API_REQUEST = exports.SimpleStorage = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global API_HOST:false */


exports.setAPIHost = setAPIHost;
exports.setToken = setToken;
exports.setStorage = setStorage;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HOST = '/api';

var SimpleStorage = exports.SimpleStorage = function () {
  function SimpleStorage() {
    _classCallCheck(this, SimpleStorage);
  }

  _createClass(SimpleStorage, [{
    key: 'getItem',
    value: function getItem(key) {
      return this[key];
    }
  }, {
    key: 'setItem',
    value: function setItem(key, value) {
      this[key] = value;
    }
  }]);

  return SimpleStorage;
}();

var storage = void 0;

if (typeof localStorage !== 'undefined') {
  storage = localStorage;
} else {
  storage = new SimpleStorage();
}

if (typeof API_HOST !== 'undefined') {
  HOST = API_HOST;
}

var API_REQUEST = exports.API_REQUEST = 'REDUX_MIDDLEWARE_FETCH/API_REQUEST';
var NO_TOKEN_STORED = exports.NO_TOKEN_STORED = 'REDUX_MIDDLEWARE_FETCH/NO_TOKEN_STORED';
var API_REQUEST_SENT = exports.API_REQUEST_SENT = 'REDUX_MIDDLEWARE_FETCH/API_REQUEST_SENT';
var API_FINISHED = exports.API_FINISHED = 'REDUX_MIDDLEWARE_FETCH/API_FINISHED';

function setAPIHost(API_HOST) {
  HOST = API_HOST;
}

function setToken(token) {
  storage.setItem('accessToken', token);
}

function setStorage(customStorage) {
  storage = customStorage;
}

exports.default = function () {
  return function (next) {
    return function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(action) {
        var requestOptions, entrypoint, types, auth, json, body, formData, method, onSuccess, onFailed, urlEncoded, fqdn, headers, dispatchPayload, customHeaders, _types, successType, errorType, requestType, fetchOptions, token, response;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                requestOptions = action[API_REQUEST];

                if (!(typeof requestOptions === 'undefined')) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', next(action));

              case 3:
                entrypoint = requestOptions.entrypoint, types = requestOptions.types, auth = requestOptions.auth, json = requestOptions.json, body = requestOptions.body, formData = requestOptions.formData, method = requestOptions.method, onSuccess = requestOptions.onSuccess, onFailed = requestOptions.onFailed, urlEncoded = requestOptions.urlEncoded, fqdn = requestOptions.fqdn, headers = requestOptions.headers;
                dispatchPayload = _lodash2.default.omit(requestOptions.dispatchPayload || {}, 'type');
                customHeaders = headers || {};
                _types = _slicedToArray(types, 3), successType = _types[0], errorType = _types[1], requestType = _types[2];

                // Fetch Endpoint

                fetchOptions = {
                  method: method || 'GET',
                  headers: _extends({
                    Accept: 'application/json'
                  }, customHeaders)
                };

                // Inject JWT Token

                if (!auth) {
                  _context.next = 15;
                  break;
                }

                token = storage.getItem('accessToken');

                if (!token) {
                  _context.next = 14;
                  break;
                }

                fetchOptions.headers.Authorization = token;
                _context.next = 15;
                break;

              case 14:
                return _context.abrupt('return', next({
                  type: NO_TOKEN_STORED
                }));

              case 15:

                // ContentType
                if (json) {
                  fetchOptions.headers['Content-Type'] = 'application/json';
                  fetchOptions.body = JSON.stringify(body || {});
                }

                // x-www-form-urlencoded
                if (urlEncoded) {
                  fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                  fetchOptions.body = _qs2.default.stringify(body || {});
                }

                // FormData
                if (formData) {
                  fetchOptions.body = new FormData();
                  _lodash2.default.forEach(body, function (val, key) {
                    if (val) {
                      if (val instanceof FileList) {
                        [].forEach.call(val, function (file) {
                          return fetchOptions.body.append(key, file);
                        });
                      } else {
                        fetchOptions.body.append(key, val);
                      }
                    }
                  });
                }

                response = void 0;
                _context.prev = 19;

                // Before Request
                if (requestType) {
                  next({
                    type: requestType,
                    entrypoint: entrypoint,
                    fetchOptions: fetchOptions
                  });
                }

                // Request Animation Start
                next({
                  type: API_REQUEST_SENT
                });

                _context.next = 24;
                return fetch('' + (fqdn || HOST) + entrypoint, fetchOptions);

              case 24:
                response = _context.sent;


                // Request Animation End
                next({
                  type: API_FINISHED
                });

                if (!response.ok) {
                  _context.next = 33;
                  break;
                }

                if (!(response.status !== 204)) {
                  _context.next = 31;
                  break;
                }

                _context.next = 30;
                return response.json();

              case 30:
                response = _context.sent;

              case 31:
                _context.next = 39;
                break;

              case 33:
                _context.next = 35;
                return response.json();

              case 35:
                response = _context.sent;


                next(_extends({
                  type: errorType,
                  error: response.message
                }, response));

                if (onFailed) {
                  onFailed(response.message);
                }

                return _context.abrupt('return', true);

              case 39:
                _context.next = 49;
                break;

              case 41:
                _context.prev = 41;
                _context.t0 = _context['catch'](19);

                if (!errorType) {
                  _context.next = 47;
                  break;
                }

                next({
                  type: errorType,
                  error: _context.t0
                });

                if (onFailed) {
                  onFailed(_context.t0);
                }

                return _context.abrupt('return', true);

              case 47:

                if (onFailed) {
                  onFailed(_context.t0);
                }

                return _context.abrupt('return', console.error(_context.t0));

              case 49:
                if (!_lodash2.default.isArray(response)) {
                  _context.next = 53;
                  break;
                }

                next(_extends({
                  type: successType,
                  list: response
                }, dispatchPayload));

                if (onSuccess) {
                  onSuccess(response);
                }

                return _context.abrupt('return', true);

              case 53:

                if (onSuccess) {
                  onSuccess(response);
                }

                return _context.abrupt('return', next(_extends({}, dispatchPayload, response, {
                  _type: response.type,
                  type: successType
                })));

              case 55:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[19, 41]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  };
};