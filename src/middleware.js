/* global API_HOST:false */
import _ from 'lodash';

export const API_REQUEST = Symbol('API_REQUEST');
export const NO_TOKEN_STORED = Symbol('NO_TOKEN_STORED');
export const API_REQUEST_SENT = Symbol('API_REQUEST_SENT');
export const API_FINISHED = Symbol('API_FINISHED');

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
  } = requestOptions;

  const dispatchPayload = _.omit((requestOptions.dispatchPayload || {}), 'type');

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
    },
  };

  // Inject JWT Token
  if (auth) {
    const token = localStorage.getItem('accessToken');

    if (token) {
      fetchOptions.headers.Authorization = token;
    } else {
      return next({
        type: NO_TOKEN_STORED,
      });
    }
  }

  // ContentType
  if (json) {
    fetchOptions.headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(body || {});
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

    response = await fetch(`${API_HOST}${entrypoint}`, fetchOptions);

    // Request Animation End
    next({
      type: API_FINISHED,
    });

    if (response.ok) {
      if (response.status !== 204) {
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
