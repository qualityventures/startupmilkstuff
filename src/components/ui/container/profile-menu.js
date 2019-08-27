import React from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import { Link } from 'react-router-dom';
import { truncate } from 'voca';

class ProfileMenu extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    userSignOut: PropTypes.func.isRequired,
    tokenClean: PropTypes.func.isRequired,
    handleClickOutside: PropTypes.func.isRequired,
    isOpened: PropTypes.bool.isRequired,
  };
  handleClickOutside() {
    const { isOpened, handleClickOutside } = this.props;
    if (isOpened) {
      handleClickOutside();
    }
  }

  render() {
    const { user, userSignOut, tokenClean, isOpened } = this.props;
    return (<div
      className={`clickContainer ${isOpened ? 'active' : ''}`}
    >
      <div className={'profile-root'}>
        {user.logged_in ? (
          <div className="profile-block">
            <div className="flex p1 pl2 items-center profile-container">
              <img className="profile" src={'/static/images/profile_black.png'} />
              <div className="ml2">{truncate(user.data.email, 14)}</div>
            </div>
            <div className="listitem">
              <Link to={'/dashboard'} href={'/dashboard'}>
                <div className="p1 px2">My Purchases</div>
              </Link>
            </div>
            <div
              className="p1 px2 listitem"
              onClick={() => {
                userSignOut();
                tokenClean();
              }}
            >
              Sign Out
            </div>
          </div>
        ) : (
          <div className="profile-block">
            <div className="flex p1 pl2 items-center profile-container">
              <img className="profile" src={'/static/images/profile_white.png'} />
              <div className="ml2">Guest</div>
            </div>
            <div className="listitem">
              <Link to={'/login'} href={'/login'}>
                <div className="p1 px2">Sign In / Sign Up</div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
    );
  }
}

export default enhanceWithClickOutside(ProfileMenu);
