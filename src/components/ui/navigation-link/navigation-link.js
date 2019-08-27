import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class NavigationLink extends React.PureComponent {
  static propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
    content: PropTypes.node,
    selected: PropTypes.bool,
  }

  static defaultProps = {
    to: null,
    href: null,
    onClick: null,
    content: null,
    children: null,
    selected: false,
  }

  render() {
    const { to, href, children, content, selected, onClick } = this.props;

    let Component = 'a';
    const componentProps = {};
    const liProps = {};

    if (onClick) componentProps.onClick = onClick;
    if (selected) liProps.className = 'current-menu-item';

    if (to) {
      componentProps.to = to;
      Component = Link;
    } else if (href) {
      componentProps.href = href;
    }

    return (
      <li {...liProps}>
        <Component {...componentProps}>{content || children}</Component>
      </li>
    );
  }
}

export default NavigationLink;
