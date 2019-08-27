import React from 'react';
import PropTypes from 'prop-types';

class Content extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    background: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    boxShadow: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    withPadding: PropTypes.bool,
  }

  static defaultProps = {
    background: '#ffffff',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
    withPadding: true,
  }

  render() {
    const { background, boxShadow, withPadding } = this.props;
    const props = {
      style: {
        background: 'rgba(255, 255, 255, 0)',
      },
      className: 'content',
    };

    if (background) {
      props.style.backgroundColor = background;
    }

    if (boxShadow) {
      props.style.boxShadow = boxShadow;
    }

    if (!withPadding) {
      props.style.padding = '0px';
      props.style.paddingTop = '0px';
      props.style.paddingBottom = '0px';
      props.style.paddingRight = '0px';
      props.style.paddingLeft = '0px';
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div {...props}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Content;
