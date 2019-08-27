import React from 'react';
import PropTypes from 'prop-types';
import TitleUpdater from 'containers/title-updater';
import { connect } from 'react-redux';
import areEqual from 'helpers/are-equal';
import { makeArgs, getArgs } from 'helpers/args';
import { loadProducts } from 'actions/products';
import {
  Content,
  Loader,
  Alert,
  Form,
  FormSearch,
  Catalog,
  CatalogItem,
  Paginator,
} from 'components/ui';

const DEFAULT_SEARCH = {
  page: 1,
  category: 'all',
  search: '',
  sort: '-created',
};

function fetchClientProducts(location, store, match) {
  const state = store.getState().products;
  const args = getArgs(location.search);
  const query = {
    page: parseInt(args.page || 1, 10) || DEFAULT_SEARCH.page,
    category: match.params.category || DEFAULT_SEARCH.category,
    search: args.search || DEFAULT_SEARCH.search,
    sort: args.sort || DEFAULT_SEARCH.sort,
    status: 'visible',
  };

  if (state.loading || areEqual(query, state.query)) {
    return [];
  }

  return [store.dispatch(loadProducts(query))];
}

class RouteClientProducts extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]).isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    const { location, match } = this.props;

    fetchClientProducts(location, window.REDUX_STORE, match);
  }

  componentWillReceiveProps(nextProps) {
    const { location, match } = nextProps;

    fetchClientProducts(location, window.REDUX_STORE, match);
  }

  handleSearchChange(value) {
    const { query } = this.props;

    if (value === query.search) {
      return;
    }

    const url = `${this.makeLink()}?${makeArgs({ sort: query.sort, search: value })}`;
    this.props.history.push(url);
  }

  makeLink() {
    const { category } = this.props.query;

    if (category) {
      return `/products/${category}/`;
    }

    return '/products/';
  }

  makeLoader() {
    if (!this.props.loading) {
      return null;
    }

    return <Loader />;
  }

  makeError() {
    const { error } = this.props;

    if (!error) {
      return null;
    }

    return <Alert type="danger">{error}</Alert>;
  }

  makeProducts() {
    const { data, query } = this.props;

    if (!data.products || !query) {
      return null;
    }

    const ret = data.products.map((product) => {
      return (
        <CatalogItem
          id={product.id}
          key={product.id}
          to={`/product/${product.url}`}
          files={product.files}
          backgroundImage={product.image}
          hoverAnimation={product.animation}
          price={product.price}
          name={product.name}
          category={product.category}
          showAddToCart
        />
      );
    });

    if (!ret.length) {
      return <Alert>Nothing was found</Alert>;
    }

    return (
      <Catalog
        total={data.total}
        sortValue={query.sort}
        sortLink={`${this.makeLink()}?sort=%sort%`}
      >
        {ret}
      </Catalog>
    );
  }

  makePaginator() {
    const { data, loading, query } = this.props;

    if (loading || !query) {
      return null;
    }

    const { page, pages } = data;

    const args = makeArgs({
      sort: query.sort,
      search: query.search,
      page: { value: '%page%', escape: false },
    });

    return (
      <Paginator
        page={page || 1}
        pages={pages || 1}
        to={`${this.makeLink()}?${args}`}
      />
    );
  }

  makeSearch() {
    const { query, loading } = this.props;

    if (!query) {
      return null;
    }

    return (
      <Form>
        <FormSearch
          disabled={loading}
          defaultValue={query.search}
          onSearch={this.handleSearchChange}
        />
      </Form>
    );
  }

  render() {
    return (
      <Content>
        <TitleUpdater title="" />
        <div className="title">
          <h1>Premium design resources to speed up your creative workflow</h1>
        </div>

        {this.makeSearch()}

        <br />
        {this.makeError()}
        {this.makeProducts()}
        {this.makeLoader()}
        {this.makePaginator()}
      </Content>
    );
  }
}

const WrapperClientProducts = connect(
  (state, props) => {
    const products = state.products;

    return {
      data: products.data,
      error: products.error,
      loading: products.loading,
      query: products.query,
    };
  },
  (dispatch) => {
    return {

    };
  }
)(RouteClientProducts);

export { WrapperClientProducts as RouteClientProducts, fetchClientProducts };
