import React from 'react';
import PropTypes from 'prop-types';
import './form-subtitle.scss';

class FormSubtitle extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {

  }

  render() {
    return (
      <div className="form__subtitle">
        {this.props.children}
      </div>
    );
  }
}

export default FormSubtitle;
