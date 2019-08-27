import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Paginator extends React.PureComponent {
  static propTypes = {
    page: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    pages: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    dynamicSize: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    staticSize: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    to: PropTypes.string,

  }

  static defaultProps = {
    to: '',
    dynamicSize: 2,
    staticSize: 1,
  }

  updateProps() {
    this.page = parseInt(this.props.page, 10);
    this.pages = parseInt(this.props.pages, 10);
    this.dynamic_size = parseInt(this.props.dynamicSize, 10);
    this.static_size = parseInt(this.props.staticSize, 10);

    if (isNaN(this.page)) this.page = 1;
    if (isNaN(this.pages)) this.pages = 1;
    if (isNaN(this.dynamic_size)) this.dynamic_size = 2;
    if (isNaN(this.static_size)) this.static_size = 1;
  }

  makePageLink(page) {
    return this.props.to.replace('%page%', page);
  }

  makePaginatorPrev() {
    let Component = null;
    const props = {
      className: 'catalog-page-prev',
    };

    if (this.page > 1) {
      Component = Link;
      props.to = this.makePageLink(Math.max(this.page - 1, 1));
    } else {
      Component = 'a';
      props.className += ' catalog-page-prev-disabled';
    }

    return <Component {...props}>Previous Page</Component>;
  }

  makePaginatorNext() {
    let Component = null;
    const props = {
      className: 'catalog-page-next',
    };

    if (this.page < this.pages) {
      Component = Link;
      props.to = this.makePageLink(Math.min(this.page + 1, this.pages));
    } else {
      Component = 'a';
      props.className += ' catalog-page-next-disabled';
    }

    return <Component {...props}>Next Page</Component>;
  }

  makePaginatorPages() {
    // if total size of pages is less than static
    if (this.pages <= ((this.static_size * 2) + 1)) {
      // than we can go in a simple way
      return this.makePagesRange(1, this.pages);
    }

    let list = [];

    // left static pages
    list = list.concat(this.makePagesRange(1, this.static_size));

    const dynamic_left = Math.max(
      this.page - this.dynamic_size,
      this.static_size + 1
    );

    const dynamic_right = Math.min(
      this.page + this.dynamic_size,
      this.pages - this.static_size
    );

    // if needed - separator
    if ((this.static_size + 1) < dynamic_left) {
      list.push(<li key="buttons_left"><span>...</span></li>);
    }

    // dynamic middle pages
    list = list.concat(this.makePagesRange(
      dynamic_left,
      dynamic_right
    ));

    // if needed - separator
    if ((this.pages - this.static_size) > dynamic_right) {
      list.push(<li key="buttons_right"><span>...</span></li>);
    }

    // right static pages
    list = list.concat(this.makePagesRange(
      (this.pages - this.static_size) + 1,
      this.pages
    ));

    return list;
  }

  makePagesRange(page_from, page_to) {
    const range = [];

    for (let i = page_from; i <= page_to; ++i) {
      if (i !== this.page) {
        range.push(
          <li key={i} className="active">
            <Link to={this.makePageLink(i)}>{i}</Link>
          </li>
        );
      } else {
        range.push(<li key={i}><a>{i}</a></li>);
      }
    }

    return range;
  }

  render() {
    this.updateProps();

    return (
      <div className="catalog-pagination">
        {this.makePaginatorPrev()}

        <ul className="catalog-pages">
          {this.makePaginatorPages()}
        </ul>

        {this.makePaginatorNext()}
      </div>
    );
  }
}

export default Paginator;
