'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_FINISHED = exports.API_REQUEST_SENT = exports.NO_TOKEN_STORED = exports.API_REQUEST = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.setAPIHost = setAPIHost;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global API_HOST:false */


var HOST = API_HOST || '/api';

var API_REQUEST = exports.API_REQUEST = 'REDUX_MIDDLEWARE_FETCH/API_REQUEST';
var NO_TOKEN_STORED = exports.NO_TOKEN_STORED = 'REDUX_MIDDLEWARE_FETCH/NO_TOKEN_STORED';
var API_REQUEST_SENT = exports.API_REQUEST_SENT = 'REDUX_MIDDLEWARE_FETCH/API_REQUEST_SENT';
var API_FINISHED = exports.API_FINISHED = 'REDUX_MIDDLEWARE_FETCH/API_FINISHED';

function setAPIHost(API_HOST) {
  HOST = API_HOST;
}

exports.default = function () {
  return function (next) {
    return function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(action) {
        var requestOptions, entrypoint, types, auth, json, body, formData, method, onSuccess, onFailed, urlEncoded, fqdn, dispatchPayload, _types, successType, errorType, requestType, fetchOptions, token, response;

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
                entrypoint = requestOptions.entrypoint, types = requestOptions.types, auth = requestOptions.auth, json = requestOptions.json, body = requestOptions.body, formData = requestOptions.formData, method = requestOptions.method, onSuccess = requestOptions.onSuccess, onFailed = requestOptions.onFailed, urlEncoded = requestOptions.urlEncoded, fqdn = requestOptions.fqdn;
                dispatchPayload = _lodash2.default.omit(requestOptions.dispatchPayload || {}, 'type');
                _types = _slicedToArray(types, 3), successType = _types[0], errorType = _types[1], requestType = _types[2];

                // Fetch Endpoint

                fetchOptions = {
                  method: method || 'GET',
                  headers: {
                    Accept: 'application/json'
                  }
                };

                // Inject JWT Token

                if (!auth) {
                  _context.next = 14;
                  break;
                }

                token = localStorage.getItem('accessToken');

                if (!token) {
                  _context.next = 13;
                  break;
                }

                fetchOptions.headers.Authorization = token;
                _context.next = 14;
                break;

              case 13:
                return _context.abrupt('return', next({
                  type: NO_TOKEN_STORED
                }));

              case 14:

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
                _context.prev = 18;

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

                _context.next = 23;
                return fetch('' + (fqdn || HOST) + entrypoint, fetchOptions);

              case 23:
                response = _context.sent;


                // Request Animation End
                next({
                  type: API_FINISHED
                });

                if (!response.ok) {
                  _context.next = 32;
                  break;
                }

                if (!(response.status !== 204)) {
                  _context.next = 30;
                  break;
                }

                _context.next = 29;
                return response.json();

              case 29:
                response = _context.sent;

              case 30:
                _context.next = 38;
                break;

              case 32:
                _context.next = 34;
                return response.json();

              case 34:
                response = _context.sent;


                next(_extends({
                  type: errorType,
                  error: response.message
                }, response));

                if (onFailed) {
                  onFailed(response.message);
                }

                return _context.abrupt('return', true);

              case 38:
                _context.next = 48;
                break;

              case 40:
                _context.prev = 40;
                _context.t0 = _context['catch'](18);

                if (!errorType) {
                  _context.next = 46;
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

              case 46:

                if (onFailed) {
                  onFailed(_context.t0);
                }

                return _context.abrupt('return', console.error(_context.t0));

              case 48:
                if (!_lodash2.default.isArray(response)) {
                  _context.next = 52;
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

              case 52:

                if (onSuccess) {
                  onSuccess(response);
                }

                return _context.abrupt('return', next(_extends({}, dispatchPayload, response, {
                  _type: response.type,
                  type: successType
                })));

              case 54:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[18, 40]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  };
};