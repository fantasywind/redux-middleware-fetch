"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAPIHost = setAPIHost;
exports.setToken = setToken;
exports.setStorage = setStorage;
exports.default = exports.requestListener = exports.EVENT_REQUEST_FAILED = exports.EVENT_REQUEST_SUCCESSED = exports.EVENT_REQUESTED = exports.API_FINISHED = exports.API_REQUEST_SENT = exports.NO_TOKEN_STORED = exports.API_REQUEST = exports.SimpleStorage = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = _interopRequireDefault(require("lodash"));

var _qs = _interopRequireDefault(require("qs"));

var _events = require("events");

/* global API_HOST:false */
var HOST = '/api';

var SimpleStorage =
/*#__PURE__*/
function () {
  function SimpleStorage() {
    (0, _classCallCheck2.default)(this, SimpleStorage);
  }

  (0, _createClass2.default)(SimpleStorage, [{
    key: "getItem",
    value: function getItem(key) {
      return this[key];
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      this[key] = value;
    }
  }]);
  return SimpleStorage;
}();

exports.SimpleStorage = SimpleStorage;
var storage;

if (typeof localStorage !== 'undefined') {
  storage = localStorage;
} else {
  storage = new SimpleStorage();
}

if (typeof API_HOST !== 'undefined') {
  HOST = API_HOST;
}

var API_REQUEST = 'REDUX_MIDDLEWARE_FETCH/API_REQUEST';
exports.API_REQUEST = API_REQUEST;
var NO_TOKEN_STORED = 'REDUX_MIDDLEWARE_FETCH/NO_TOKEN_STORED';
exports.NO_TOKEN_STORED = NO_TOKEN_STORED;
var API_REQUEST_SENT = 'REDUX_MIDDLEWARE_FETCH/API_REQUEST_SENT';
exports.API_REQUEST_SENT = API_REQUEST_SENT;
var API_FINISHED = 'REDUX_MIDDLEWARE_FETCH/API_FINISHED';
exports.API_FINISHED = API_FINISHED;

function setAPIHost(API_HOST) {
  HOST = API_HOST;
}

function setToken(token) {
  storage.setItem('accessToken', token);
}

function setStorage(customStorage) {
  storage = customStorage;
}

var EVENT_REQUESTED = 'EVENT/REQUESTED';
exports.EVENT_REQUESTED = EVENT_REQUESTED;
var EVENT_REQUEST_SUCCESSED = 'EVENT/REQUEST_SUCCESSED';
exports.EVENT_REQUEST_SUCCESSED = EVENT_REQUEST_SUCCESSED;
var EVENT_REQUEST_FAILED = 'EVENT/REQUEST_FAILED';
exports.EVENT_REQUEST_FAILED = EVENT_REQUEST_FAILED;
var requestListener = new _events.EventEmitter();
exports.requestListener = requestListener;

var _default = function _default() {
  return function (next) {
    return (
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(action) {
          var requestOptions, entrypoint, types, auth, json, body, formData, method, onSuccess, onFailed, urlEncoded, fqdn, headers, dispatchPayload, customHeaders, _types, successType, errorType, requestType, fetchOptions, token, response;

          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  requestOptions = action[API_REQUEST];

                  if (!(typeof requestOptions === 'undefined')) {
                    _context.next = 3;
                    break;
                  }

                  return _context.abrupt("return", next(action));

                case 3:
                  entrypoint = requestOptions.entrypoint, types = requestOptions.types, auth = requestOptions.auth, json = requestOptions.json, body = requestOptions.body, formData = requestOptions.formData, method = requestOptions.method, onSuccess = requestOptions.onSuccess, onFailed = requestOptions.onFailed, urlEncoded = requestOptions.urlEncoded, fqdn = requestOptions.fqdn, headers = requestOptions.headers;
                  dispatchPayload = _lodash.default.omit(requestOptions.dispatchPayload || {}, 'type');
                  customHeaders = headers || {};
                  _types = (0, _slicedToArray2.default)(types, 3), successType = _types[0], errorType = _types[1], requestType = _types[2]; // Fetch Endpoint

                  fetchOptions = {
                    method: method || 'GET',
                    headers: (0, _objectSpread2.default)({
                      Accept: 'application/json'
                    }, customHeaders)
                  }; // Inject JWT Token

                  if (auth) {
                    token = storage.getItem('accessToken');

                    if (token) {
                      fetchOptions.headers.Authorization = token;
                    }
                  } // ContentType


                  if (json) {
                    fetchOptions.headers['Content-Type'] = 'application/json';
                    fetchOptions.body = JSON.stringify(body || {});
                  } // x-www-form-urlencoded


                  if (urlEncoded) {
                    fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    fetchOptions.body = _qs.default.stringify(body || {});
                  } // FormData


                  if (formData) {
                    fetchOptions.body = new FormData();

                    _lodash.default.forEach(body, function (val, key) {
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

                  _context.prev = 12;

                  // Before Request
                  if (requestType) {
                    next({
                      type: requestType,
                      entrypoint: entrypoint,
                      fetchOptions: fetchOptions
                    });
                  } // Request Animation Start


                  next({
                    type: API_REQUEST_SENT
                  });
                  requestListener.emit(EVENT_REQUESTED, requestOptions);
                  _context.next = 18;
                  return fetch("".concat(fqdn || HOST).concat(entrypoint), fetchOptions);

                case 18:
                  response = _context.sent;
                  // Request Animation End
                  next({
                    type: API_FINISHED
                  });

                  if (!response.ok) {
                    _context.next = 31;
                    break;
                  }

                  requestListener.emit(EVENT_REQUEST_SUCCESSED, response);

                  if (!(response.status === 204)) {
                    _context.next = 26;
                    break;
                  }

                  response = {};
                  _context.next = 29;
                  break;

                case 26:
                  _context.next = 28;
                  return response.json();

                case 28:
                  response = _context.sent;

                case 29:
                  _context.next = 38;
                  break;

                case 31:
                  requestListener.emit(EVENT_REQUEST_FAILED, response);
                  _context.next = 34;
                  return response.json();

                case 34:
                  response = _context.sent;

                  if (errorType) {
                    next((0, _objectSpread2.default)({
                      type: errorType,
                      error: response.message
                    }, response));
                  }

                  if (onFailed) {
                    onFailed(response.message);
                  }

                  return _context.abrupt("return", true);

                case 38:
                  _context.next = 48;
                  break;

                case 40:
                  _context.prev = 40;
                  _context.t0 = _context["catch"](12);

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

                  return _context.abrupt("return", true);

                case 46:
                  if (onFailed) {
                    onFailed(_context.t0);
                  }

                  return _context.abrupt("return", console.error(_context.t0));

                case 48:
                  if (!_lodash.default.isArray(response)) {
                    _context.next = 52;
                    break;
                  }

                  next((0, _objectSpread2.default)({
                    type: successType,
                    list: response
                  }, dispatchPayload));

                  if (onSuccess) {
                    onSuccess(response);
                  }

                  return _context.abrupt("return", true);

                case 52:
                  if (onSuccess) {
                    onSuccess(response);
                  }

                  return _context.abrupt("return", next((0, _objectSpread2.default)({}, dispatchPayload, response, {
                    _type: response.type,
                    type: successType
                  })));

                case 54:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[12, 40]]);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()
    );
  };
};

exports.default = _default;
