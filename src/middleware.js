/* global API_HOST:false */
import _ from 'lodash';
import qs from 'qs';

let HOST = '/api';

export class SimpleStorage {
  getItem(key) {
    return this[key];
  }

  setItem(key, value) {
    this[key] = value;
  }
}

let storage;

if (typeof localStorage !== 'undefined') {
  storage = localStorage;
} else {
  storage = new SimpleStorage();
}

if (typeof API_HOST !== 'undefined') {
  HOST = API_HOST;
}

export const API_REQUEST = 'REDUX_MIDDLEWARE_FETCH/API_REQUEST';
export const NO_TOKEN_STORED = 'REDUX_MIDDLEWARE_FETCH/NO_TOKEN_STORED';
export const API_REQUEST_SENT = 'REDUX_MIDDLEWARE_FETCH/API_REQUEST_SENT';
export const API_FINISHED = 'REDUX_MIDDLEWARE_FETCH/API_FINISHED';

export function setAPIHost(API_HOST) {
  HOST = API_HOST;
}

export function setToken(token) {
  storage.setItem('accessToken', token);
}

export function setStorage(customStorage) {
  storage = customStorage;
}

export default () => next => async action => {
  const requestOptions = action[API_REQUEST];

  if (typeof requestOptions === 'undefined') {
    return next(action);
  }

  const {
    entrypoint,
    types,
    auth,
    json,
    body,
    formData,
    method,
    onSuccess,
    onFailed,
    urlEncoded,
    fqdn,
    headers,
  } = requestOptions;

  const dispatchPayload = _.omit((requestOptions.dispatchPayload || {}), 'type');
  const customHeaders = headers || {};

  const [
    successType,
    errorType,
    requestType,
  ] = types;

  // Fetch Endpoint
  const fetchOptions = {
    method: method || 'GET',
    headers: {
      Accept: 'application/json',
      ...customHeaders,
    },
  };

  // Inject JWT Token
  if (auth) {
    const token = storage.getItem('accessToken');

    if (token) {
      fetchOptions.headers.Authorization = token;
    }
  }

  // ContentType
  if (json) {
    fetchOptions.headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(body || {});
  }

  // x-www-form-urlencoded
  if (urlEncoded) {
    fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    fetchOptions.body = qs.stringify(body || {});
  }

  // FormData
  if (formData) {
    fetchOptions.body = new FormData();
    _.forEach(body, (val, key) => {
      if (val) {
        if (val instanceof FileList) {
          [].forEach.call(val, (file) => fetchOptions.body.append(key, file));
        } else {
          fetchOptions.body.append(key, val);
        }
      }
    });
  }

  let response;

  try {
    // Before Request
    if (requestType) {
      next({
        type: requestType,
        entrypoint,
        fetchOptions,
      });
    }

    // Request Animation Start
    next({
      type: API_REQUEST_SENT,
    });

    response = await fetch(`${(fqdn || HOST)}${entrypoint}`, fetchOptions);

    // Request Animation End
    next({
      type: API_FINISHED,
    });

    if (response.ok) {
      if (response.status === 204) {
        response = {};
      } else {
        response = await response.json();
      }
    } else {
      response = await response.json();

      next({
        type: errorType,
        error: response.message,
        ...response,
      });

      if (onFailed) {
        onFailed(response.message);
      }

      return true;
    }
  } catch (error) {
    if (errorType) {
      next({
        type: errorType,
        error,
      });

      if (onFailed) {
        onFailed(error);
      }

      return true;
    }

    if (onFailed) {
      onFailed(error);
    }

    return console.error(error);
  }

  if (_.isArray(response)) {
    next({
      type: successType,
      list: response,
      ...dispatchPayload,
    });

    if (onSuccess) {
      onSuccess(response);
    }

    return true;
  }

  if (onSuccess) {
    onSuccess(response);
  }

  return next({
    ...dispatchPayload,
    ...response,
    _type: response.type,
    type: successType,
  });
};
