# redux-middleware-fetch
Redux Whatwg Fetch Middleware

## Usage

### Bind Middleware

```javascript
// ...
import thunk from 'redux-thunk';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import fetchMiddleware from 'redux-middleware-fetch';

const store = createStore(reducer, defaultState, applyMiddleware(
  thunk,
  fetchMiddleware,
));

// ...
```

### Call on action

```javascript
import { API_REQUEST } from 'redux-middleware-fetch';
import { replace } from 'react-router-redux';

export const PRODUCT_FETCHED = Symbol('PRODUCT_FETCHED');
export const PRODUCT_CREATED = Symbol('PRODUCT_CREATED');
export const PRODUCT_CREATE_FAILED = Symbol('PRODUCT_CREATE_FAILED');
export const PRODUCT_CREATING = Symbol('PRODUCT_CREATING');

export const fetchProducts = () => ({
  [API_REQUEST]: {
    types: [
      PRODUCT_FETCHED,
    ],
    entrypoint: '/products',
    auth: true,
    method: 'GET',
  },
});

// Thunkify Action
export const createProducts = (product) => ({
  dispatch => dispatch({
    [API_REQUEST]: {
      types: [
        PRODUCT_CREATED,
        PRODUCT_CREATE_FAILED,
        PRODUCT_CREATING,
      ],
      entrypoint: '/products',
      auth: true,
      json: true,
      body: product
      method: 'POST',
      onSuccess: () => dispatch(replace('/products')),
    },
  });
});
```

## Options

- **types[Array]**: Array of dispatch action, support every types (eg. String, Symbol), action will be called on [REQUEST_SUCCESS, (REQUEST_FAILED), (REQUEST_SENT)].
- **entrypoint[String]**: API resource url, fetch will add host declared in global ```API_HOST``` constant automatically.
- **auth[Boolean]**: If true, JWT Token will add to fetch request in headers ```Authorization``` value. Token should be storage in ```localStorage.accessToken```.
- **json[Boolean]**: If true, body will be JSON stringified text. (Don't use json and formData both)
- **formData[Boolean]**: If true, body will append to FormData by assigned keys. (Don't use json and formData both)
- **body[Object]**: Key-value paired post data.
- **method[String]**: HTTP Method, default: GET.
- **onSuccess[Function]**: Success callback function, you can do something without store dispatch (eg. dispatch redirect react-router-redux action).
- **onFailed[Function]**: Failed callback function.

## To-Do

- [ ] Mocks Service / API Simulator
