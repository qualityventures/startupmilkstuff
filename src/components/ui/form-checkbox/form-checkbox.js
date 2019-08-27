import React from 'react';
import PropTypes from 'prop-types';
import './form-checkbox.scss';

class FormInput extends React.PureComponent {
  static propTypes = {
    setRef: PropTypes.func,
    title: PropTypes.string,
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
  }

  static defaultProps = {
    title: null,
    setRef: null,
    name: null,
    id: null,
    disabled: null,
    checked: false,
  }

  constructor(props) {
    super(props);

    this.input_ref = false;
    this.setRef = this.setRef.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checked !== this.props.checked) {
      this.input_ref.checked = !!this.props.checked;
    }
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  setRef(ref) {
    this.input_ref = ref;
    const { name, setRef } = this.props;

    if (setRef) {
      setRef(ref, name || null);
    }
  }

  render() {
    const props = {
      type: 'checkbox',
      className: 'form__checkbox-element',
      disabled: this.props.disabled,
      defaultChecked: this.props.checked,
      ref: this.setRef,
    };

    if (this.props.name) {
      props.name = this.props.name;
    }

    if (this.props.id) {
      props.id = this.props.id;
    }

    return (
      <label className="form__checkbox-container">
        <input {...props} />
        {this.props.title}
      </label>
    );
  }
}

export default FormInput;
