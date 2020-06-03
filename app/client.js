import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";
import Application from "./ui/Application";

import { createBrowserHistory } from "history";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { Provider } from "react-redux";
import { AuthFetch } from "tokenauth";
import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import { application, messages, Security } from "common-reducers";

const { addErrorMessage, clearMessages } = messages;
const { requestNewJWT, restoreValidatedLocalJWT } = Security;
const { setParam } = application;

const VERSION = "__VERSION__";

const history = createBrowserHistory();

const reducers = combineReducers({
  application, messages, security: Security(window.localStorage)
});

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(reducers), reduxDevTools, 
  composeEnhancer(applyMiddleware(routerMiddleware(history)))
);

store.dispatch(setParam({version: VERSION}));
store.dispatch(setParam({pagingLimit: 50}));

const preloadData = function preloadData (jwt, dispatch) {
  const fetcher = AuthFetch(jwt);
  // Any data you want loaded when booting
};

const authenticate = function (event, username, password) {
  event.preventDefault();
  store.dispatch(clearMessages());

  requestNewJWT(username, password, fetch, store.dispatch).then(jwt => {
    preloadData(jwt, store.dispatch);
    history.push(constantes.PATHS.HOME);
  }).catch(err => {
    let message = err.message;
    if (err.code === 401) message = "Invalid username or password";
    else if (err.code === 403) message = "Not authorized";
    store.dispatch(addErrorMessage(message));
    console.log(err); // eslint-disable-line no-console
  });
};

restoreValidatedLocalJWT(fetch, store.dispatch).then(function (JWT) {
  const isAuthenticated = JWT !== null;  
  const divMain = document.getElementById("main");

  if (isAuthenticated) preloadData(JWT, store.dispatch);
  window.store = store;
  const app = (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Application location={history.location} authenticate={authenticate} />
      </ConnectedRouter>
    </Provider>
  );

  ReactDOM.render(app, divMain);
});
