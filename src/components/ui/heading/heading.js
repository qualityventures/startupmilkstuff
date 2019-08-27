import React from 'react';
import PropTypes from 'prop-types';
import './heading.scss';

class Heading extends React.PureComponent {
  static propTypes = {
    textAlign: PropTypes.string,
    withMarginBottom: PropTypes.bool,
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
    withMarginBottom: true,
    textAlign: 'left',
  }

  render() {
    const { textAlign, children } = this.props;

    const props = {
      className: 'ui__heading',
      style: { textAlign },
    };

    if (this.props.withMarginBottom) {
      props.className += ' ui__heading--with-margin-bottom';
    }

    return (
      <div {...props}>
        {children}
      </div>
    );
  }
}

export default Heading;
