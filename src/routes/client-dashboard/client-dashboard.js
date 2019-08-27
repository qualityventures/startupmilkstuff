import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TitleUpdater from 'containers/title-updater';
import { withRouter, Route, Switch } from 'react-router';
import { Content, Alert } from 'components/ui';
import FormSignIn from 'containers/form-signin';
import FormSignUp from 'containers/form-signup';
import routes from 'routes/dashboard';

class RouteDashboard extends React.PureComponent {
  static propTypes = {
    logged_in: PropTypes.bool.isRequired,
  }

  static defaultProps = {

  }

  makeSignUp() {
    if (!this.props.logged_in) {
      return <FormSignUp />;
    }

    return <Alert>You have successfully logged in</Alert>;
  }

  makeSignIn() {
    if (!this.props.logged_in) {
      return <FormSignIn />;
    }

    return <Alert>You have successfully logged in</Alert>;
  }


  render() {
    if (!this.props.logged_in) {
      return (
        <Content>
          <TitleUpdater title="Sign In / Sign Up" />
          <div className="clearfix">
            <div className="md-col-6 sm-col sm-col-12 signin-container">
              {this.makeSignIn()}
            </div>
            <div className="md-col-6 sm-col sm-col-12 signup-container">
              {this.makeSignUp()}
            </div>
          </div>
        </Content>);
    }

    return (
      <Switch>
        {routes.map(route => (
          <Route {...route} />
        ))}
      </Switch>
    );
  }
}

export default withRouter(connect(
  (state, props) => {
    return {
      logged_in: state.user.logged_in,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(RouteDashboard));
