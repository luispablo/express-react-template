/* eslint-disable react/no-string-refs */

import React from "react";
import { connect } from "react-redux";
import { isFetching } from "common-reducers";
import ProgressBar from "bootstrap-progress-bar";
import PanelMessages from "bootstrap-feedback-panel";

class Login extends React.Component {
  componentDidMount () {
    const username = this.refs.username; 
    username.focus();
    username.select();
  }

  render () {
    const version = `v${this.props.version}${this.props.env !== constantes.PRODUCTION ? ` (${this.props.env})` : ""}`;

    return (
      <div className="container-fluid pull-down">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <PanelMessages messages={this.props.messages.items} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="panel panel-default">
              <div className="panel-body">
                <form onSubmit={e => this.props.authenticate(e, this.refs.username.value, this.refs.password.value)} id="login_form">
                  <legend>
                    App Name&nbsp;<small>{version}</small>
                  </legend>
                  <div className="form-group">
                    {this.props.isRequestNewJWTFetching ? <ProgressBar /> : null}
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Username" ref="username" />
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control" placeholder="Password" ref="password" />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                      <span className="glyphicon glyphicon glyphicon-log-in" aria-hidden="true"></span>&nbsp;
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    application: store.application,
    env: store.application.params.env,
    isRequestNewJWTFetching: isFetching(store.application, "requestNewJWT"),
    messages: store.messages,
    security: store.security,
    version: store.application.params.version
  };
};

export { Login };
export default connect(mapStateToProps)(Login);

