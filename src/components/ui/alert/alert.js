import React from 'react';
import PropTypes from 'prop-types';
import './alert.scss';

class Alert extends React.PureComponent {
  static propTypes = {
    type: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
    type: 'primary',
  }

  render() {
    const { type, children } = this.props;

    return (
      <div className={`alert alert--${type}`}>
        {children}
      </div>
    );
  }
}

export default Alert;
