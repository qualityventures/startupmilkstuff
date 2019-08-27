import React from 'react';
import PropTypes from 'prop-types';
import './form.scss';

class Form extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  render() {
    return (
      <div className={`${this.props.className} form__wrapper`}>
        {this.props.children}
      </div>
    );
  }
}

export default Form;
