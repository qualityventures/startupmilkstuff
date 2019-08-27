import React from 'react';
import PropTypes from 'prop-types';
import './form-input.scss';

class FormInput extends React.PureComponent {
  static propTypes = {
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onSubmit: PropTypes.func,
    setRef: PropTypes.func,
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    label: PropTypes.string,
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    disabled: PropTypes.bool,
    multiline: PropTypes.bool,
    type: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
  }

  static defaultProps = {
    onKeyUp: null,
    onKeyDown: null,
    onSubmit: null,
    setRef: null,
    disabled: null,
    type: 'text',
    name: null,
    placeholder: null,
    id: null,
    lable: null,
    multiline: false,
    defaultValue: null,
  }

  constructor(props) {
    super(props);

    this.input_ref = false;
    this.setRef = this.setRef.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.label) {
      if (prevProps.defaultValue !== this.props.defaultValue) {
        this.input_ref.value = this.props.defaultValue !== null ? this.props.defaultValue : '';
      }
    }
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  onKeyDown(e) {
    const { onKeyDown, onSubmit } = this.props;

    if (onKeyDown && this.props.onKeyDown(e) === false) {
      return;
    }

    if (onSubmit && e.keyCode === 13) {
      onSubmit();
    }
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
      type: this.props.type,
      disabled: this.props.disabled,
      placeholder: this.props.placeholder,
      onKeyDown: this.onKeyDown,
      onKeyUp: this.props.onKeyUp,
      ref: this.setRef,
    };

    if (this.props.label) {
      props.defaultChecked = true;
      props.className = 'form_checkbox';
      props.id = this.props.name;
      return (
        <div className="flex">
          <input {...props} />
          <label htmlFor={this.props.name}>
            {this.props.label}
          </label>
        </div>
      );
    }

    if (this.props.defaultValue !== null) {
      props.defaultValue = this.props.defaultValue;
    }

    if (this.props.name) {
      props.name = this.props.name;
    }

    if (this.props.id) {
      props.id = this.props.id;
    }

    if (this.props.multiline) {
      props.className = 'form__textarea';
      return <textarea {...props} />;
    }

    props.className = 'form__input';
    return (
      <input {...props} />
    );
  }
}

export default FormInput;
