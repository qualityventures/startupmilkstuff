import React from 'react';
import PropTypes from 'prop-types';
import TitleUpdater from 'containers/title-updater';
import { connect } from 'react-redux';
import { Content, Alert } from 'components/ui';
import { withRouter } from 'react-router';
import FormSignIn from 'containers/form-signin';
import FormSignUp from 'containers/form-signup';
import './client-login.scss';

class RouteClientLogin extends React.PureComponent {
  static propTypes = {
    logged_in: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.logged_in && !this.props.logged_in) {
      this.props.history.push('/dashboard');
    }
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
      </Content>
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
)(RouteClientLogin));
