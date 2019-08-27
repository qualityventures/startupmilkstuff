import React from 'react';
import PropTypes from 'prop-types';
import './form-select.scss';

class FormSelect extends React.PureComponent {
  static propTypes = {
    setRef: PropTypes.func,
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    disabled: PropTypes.bool,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    setRef: null,
    onChange: null,
    disabled: null,
    name: null,
    placeholder: 'Select...',
    id: null,
    defaultValue: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      niceValue: this.getSelectValue(),
    };

    this.ref_value = false;
    this.ref_select = false;

    this.setRefSelect = this.setRefSelect.bind(this);
    this.setRefValue = this.setRefValue.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({ niceValue: this.getSelectValue() });
    }
  }

  componentWillUnmount() {
    this.setRefSelect(null);
    this.ref_value = null;
  }

  setRefValue(ref) {
    this.ref_value = ref;
  }

  setRefSelect(ref) {
    this.ref_select = ref;
    const { name, setRef } = this.props;

    if (setRef) {
      setRef(ref, name || null);
    }
  }

  getSelectValue() {
    const { values, defaultValue } = this.props;

    if (defaultValue) {
      for (let i = 0; i < values.length; ++i) {
        if (defaultValue !== values[i].value) {
          continue;
        }

        return values[i].title;
      }
    }

    return this.props.placeholder;
  }

  makeOptions() {
    const ret = [
      <option key="__placholder" value="">
        {this.props.placeholder}
      </option>,
    ];

    this.props.values.forEach((e) => {
      ret.push(
        <option key={e.value} value={e.value}>
          {e.title}
        </option>
      );
    });

    return ret;
  }

  updateValue() {
    const { values, onChange, name } = this.props;
    const value = this.ref_select.options[this.ref_select.selectedIndex].value || false;
    let title = this.props.placeholder;

    for (let i = 0; i < values.length; ++i) {
      if (value !== values[i].value) {
        continue;
      }

      title = values[i].title;
      break;
    }

    if (onChange) {
      onChange(value, name || null);
    }

    this.setState({
      niceValue: title,
    });
  }

  render() {
    const selectProps = {
      ref: this.setRefSelect,
      name: this.props.name,
      id: this.props.id,
      onChange: this.updateValue,
      defaultValue: this.props.defaultValue || false,
    };

    return (
      <div className="form__select-wrapper">
        <div className="form__select-value" ref={this.setRefValue}>
          {this.state.niceValue}
        </div>

        <select {...selectProps}>
          {this.makeOptions()}
        </select>
      </div>
    );
  }
}

export default FormSelect;
