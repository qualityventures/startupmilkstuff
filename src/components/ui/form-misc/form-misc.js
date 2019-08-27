import React from 'react';
import PropTypes from 'prop-types';
import './form-misc.scss';

class FormMisc extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {

  }

  render() {
    return (
      <div className="form__misc">
        {this.props.children}
      </div>
    );
  }
}

export default FormMisc;
