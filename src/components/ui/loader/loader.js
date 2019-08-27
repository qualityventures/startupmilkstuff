import React from 'react';
import PropTypes from 'prop-types';
import './loader.scss';

class Loader extends React.PureComponent {
  static propTypes = {
    size: PropTypes.oneOf(['big', 'small']),
    color: PropTypes.oneOf(['grey', 'white']),
  }

  static defaultProps = {
    size: 'big',
    color: 'grey',
  }

  render() {
    return (
      <div className={`loader loader--${this.props.size} loader--${this.props.color}`}>
        <div className="dot dot--1" />
        <div className="dot dot--2" />
        <div className="dot dot--3" />
      </div>
    );
  }
}

export default Loader;
