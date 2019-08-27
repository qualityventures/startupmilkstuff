import React from 'react';
import PropTypes from 'prop-types';
import './form-title.scss';

class FormTitle extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {

  }

  render() {
    return (
      <h2 className="form__title">
        {this.props.children}
      </h2>
    );
  }
}

export default FormTitle;
