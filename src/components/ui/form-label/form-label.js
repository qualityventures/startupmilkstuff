import React from 'react';
import PropTypes from 'prop-types';
import './form-label.scss';

class FormLabel extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    onClick: null,
    className: '',
  }

  render() {
    return (
      <div className={`${this.props.className} form__label`} onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}

export default FormLabel;
