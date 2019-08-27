import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setTitle } from 'actions/app';
import { TITLE_BASE, TITLE_SEPARATOR } from 'data/config.public';

class TitleUpdater extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    currentTitle: PropTypes.string.isRequired,
    setTitle: PropTypes.func.isRequired,
  }

  static defaultProps = {
    title: '',
  }

  componentWillMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentTitle !== this.props.title) {
      this.updateTitle();
    }
  }

  updateTitle() {
    const { title } = this.props;
    this.props.setTitle(title);

    if (typeof document !== 'undefined') {
      if (title) {
        document.title = `${title} ${TITLE_SEPARATOR} ${TITLE_BASE}`;
      } else {
        document.title = TITLE_BASE;
      }
    }
  }

  render() {
    return null;
  }
}

export default connect(
  (state) => {
    return {
      currentTitle: state.app.title,
    };
  },
  (dispatch) => {
    return {
      setTitle: (title) => { dispatch(setTitle(title)); },
    };
  }
)(TitleUpdater);
