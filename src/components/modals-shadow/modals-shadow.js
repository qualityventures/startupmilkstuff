import React from 'react';
import PropTypes from 'prop-types';
import './modals-shadow.scss';

class ModalsShadow extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    zIndex: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.bool,
    ]),
  }

  static defaultProps = {
    onClick: null,
    zIndex: false,
  }

  render() {
    const props = {
      style: {},
      className: 'modals-shadow-container',
      onClick: this.props.onClick,
    };

    if (this.props.zIndex) {
      props.style.zIndex = this.props.zIndex;
    }

    return (
      <div {...props} />
    );
  }
}

export default ModalsShadow;
