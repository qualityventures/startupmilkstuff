import React from 'react';
import PropTypes from 'prop-types';

class FormSearch extends React.PureComponent {
  static propTypes = {
    onSearch: PropTypes.func,
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
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    onSearch: null,
    setRef: null,
    disabled: null,
    name: null,
    placeholder: 'Type anything to search...',
    id: null,
    defaultValue: '',
  }

  constructor(props) {
    super(props);

    this.input_ref = false;
    this.do_search_timeout = false;

    this.setRef = this.setRef.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.input_ref.value = this.props.defaultValue || '';
    }
  }

  componentWillUnmount() {
    this.setRef(null);
    this.clearSearchTimeout();
  }

  onKeyDown(e) {
    if (e.keyCode !== 13) {
      this.clearSearchTimeout();
      this.do_search_timeout = setTimeout(this.doSearch, 1500);
      return;
    }

    e.preventDefault();
    this.doSearch();
  }

  setRef(ref) {
    this.input_ref = ref;
    const { name, setRef } = this.props;

    if (setRef) {
      setRef(ref, name || null);
    }
  }

  doSearch(e) {
    if (e) {
      e.preventDefault();
    }

    this.clearSearchTimeout();
    const { onSearch, name } = this.props;
    const value = this.input_ref.value;

    if (!onSearch) {
      return;
    }

    onSearch(value, name || null);
  }

  clearSearchTimeout() {
    if (!this.do_search_timeout) {
      return;
    }

    clearTimeout(this.do_search_timeout);
    this.do_search_timeout = false;
  }

  render() {
    const props = {
      className: 'search-input-text',
      type: 'text',
      disabled: this.props.disabled,
      placeholder: this.props.placeholder,
      onKeyDown: this.onKeyDown,
      defaultValue: this.props.defaultValue,
      ref: this.setRef,
    };

    if (this.props.name) {
      props.name = this.props.name;
    }

    if (this.props.id) {
      props.id = this.props.id;
    }

    return (
      <div className="search-row clearfix">
        <input {...props} />
        <input
          type="submit"
          className="search-input-button"
          value="Search"
          onClick={this.doSearch}
        />
      </div>
    );
  }
}

export default FormSearch;
