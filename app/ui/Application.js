import React from "react"; // eslint-disable-line no-unused-vars
import Menu from "./Menu"; // eslint-disable-line no-unused-vars
import Login from "./Login";

import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

const NotAllowed = function NotAllowed () {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-auto">
          <div className="alert alert-warning" role="alert">
            <strong>Warning</strong> - Not authorized
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthRoute = function AuthRoute ({component: Component, authorized, ...rest}) {
  return (
    <Route {...rest} render={p => authorized ? <Component {...p} /> : <NotAllowed />} />
  );
};

const Application = function(props) {
  const isAuthenticated = props.security.JWT !== null;
  const isValidated = props.security.validatedJWT;
  const soloRoles = hasRoles(props.roles);
  const paths = constantes.PATHS;
  const permisos = constantes.PERMISOS;
  const shouldRedirectToLogin = props.location.pathname !== paths.LOGIN;

  return (
    <div className="container-fluid">
      {isValidated ? (
        isAuthenticated ? (
          <span>
            <Menu />
            <div className="row">
              <Switch>
                {/* <AuthRoute path={paths.RECIBOS} component={Paycheck} authorized={soloRoles(permisos.RECIBOS)} /> */}
                <Redirect from="/" to={paths.HOME} />
              </Switch>
            </div>
          </span>
        ) : (shouldRedirectToLogin ? <Redirect to={paths.LOGIN} /> : null)
      ) : "Wait please..."}
      <Route path={paths.LOGIN} render={() => <Login authenticate={props.authenticate} />} />
    </div>
  );
};

const mapStateToProps = function(store) {
  const jwt = store.security.JWT;

  return {
    location: store.router.location, 
    messages: store.messages,
    roles: jwt && jwt.user && jwt.user.roles || [],
    security: store.security,
    version: store.application.params.version
  };
};

export default connect(mapStateToProps)(Application);
