import React from "react"; // eslint-disable-line no-unused-vars
import hasRoles from "../helpers/hasRoles";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Security } from "common-reducers";
import { push } from "connected-react-router";

const { requestJWTRevoke } = Security;

const MenuItem = function MenuItem (props) {
  return props.isVisible ?
    <li className={props.path === props.currentPath ? "active" : ""}>
      <Link to={props.path}>{props.label}</Link>
    </li> : null;
};

const Menu = function Menu (props) {
  const jwt = props.security.JWT;
  const isVisibleUsuario = hasRoles(jwt.user.roles);
  const version = `v${props.version}${props.env !== constantes.PRODUCTION ? ` (${props.env})` : ""}`;
  const currentPath = props.routing.location.pathname;
  const menuItems = [
    <MenuItem key="1" currentPath={currentPath} path="/recibos" label="Carga" isVisible={isVisibleUsuario(constantes.PERMISOS.RECIBOS)}/>,
    <MenuItem key="2" currentPath={currentPath} path="/control_conformidad" label="Control de Conformidad" isVisible={isVisibleUsuario(constantes.PERMISOS.CONTROL_CONFORMIDAD)}/>
  ];
  const menuItemsConfiguracion = [
    <MenuItem key="3" currentPath={currentPath} path="/areas" label="Areas" isVisible={isVisibleUsuario(constantes.PERMISOS.CONFIGURACION)}/>
    
  ];
  const logout = () => props.requestJWTRevoke(jwt).then(() => props.redirect());
  const username = jwt !== null ? jwt.user.username : "-";

  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" onClick={props.resetAndGoHome}>
            <img alt="SIRH" src="/img/logo_sirh_inverse_24x24.png" />
            &ensp;<span className="brand">SIRH <small className="mini">{version}</small></span>
          </a>
        </div>
        <ul className="nav navbar-nav">
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">Recibos
              <span className="caret"></span></a>
            <ul className="dropdown-menu">
              {menuItems}
            </ul>
          </li>
        </ul>
        <ul className="nav navbar-nav">
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">Configuraci&oacute;n
              <span className="caret"></span></a>
            <ul className="dropdown-menu">
              {menuItemsConfiguracion}
            </ul>
          </li>
        </ul>
        <div className="navbar-righ">
        </div>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a href="#" onClick={logout}>
              Cerrar sesi&oacute;n de <strong>{username}</strong>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const mapStateToProps = function(store) {
  return {
    env: store.application.params.env,
    routing: store.router,
    version: store.application.params.version,
    security: store.security
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    requestJWTRevoke: (jwt) => requestJWTRevoke(jwt, fetch, dispatch),
    redirect: () => dispatch(push(constantes.PATHS.LOGIN)),
    resetAndGoHome: () => dispatch(push(constantes.PATHS.HOME))
  };
};

export { Menu, MenuItem };
export default connect(mapStateToProps, mapDispatchToProps)(Menu);
