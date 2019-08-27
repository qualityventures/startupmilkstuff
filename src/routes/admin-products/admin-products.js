import React from 'react';
import PropTypes from 'prop-types';
import {
  Content,
  Loader,
  Alert,
  FormTitle,
  FormSearch,
  FormSelect,
  Form,
  FormButton,
  Catalog,
  CatalogItem,
  Paginator,
} from 'components/ui';
import areEqual from 'helpers/are-equal';
import { makeArgs, getArgs } from 'helpers/args';
import { withRouter } from 'react-router-dom';
import CATEGORIES_LIST from 'data/categories';
import './admin-products.scss';

const DEFAULT_SEARCH = {
  page: 1,
  category: 'all',
  status: 'active',
  search: '',
  sort: '-created',
};

class RouteAdminProducts extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loaded: false,
      data: {},
      error: false,
      search: false,
      selectValues: Object.keys(CATEGORIES_LIST).map((key) => {
        return { value: key, title: CATEGORIES_LIST[key].text };
      }),
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    this.loadProducts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.loadProducts();
    }
  }

  loadProducts() {
    const args = getArgs(this.props.location.search);
    const search = {
      page: parseInt(args.page || 1, 10) || DEFAULT_SEARCH.page,
      category: args.category || DEFAULT_SEARCH.category,
      status: args.status || DEFAULT_SEARCH.status,
      search: args.search || DEFAULT_SEARCH.search,
      sort: args.sort || DEFAULT_SEARCH.sort,
    };

    if (areEqual(search, this.state.search)) {
      return;
    }

    this.setState({
      loading: true,
      loaded: false,
      error: false,
      search: { ...search },
      data: {},
    });

    fetch(`/api/products/?${makeArgs(search)}`, {
      credentials: 'include',
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (json.error) return Promise.reject(json.error);
        if (response.status !== 200) return Promise.reject('invalid server response');
        return json;
      })
      .then((data) => {
        this.setState({ loading: false, loaded: true, data });
      })
      .catch((err) => {
        const error = err && err.toString ? err.toString() : 'Bad response from server';
        this.setState({ error, loading: false });
      });
  }

  handleStatusChange(value) {
    value = value || DEFAULT_SEARCH.status;

    const { search } = this.state;

    if (value === search.status) {
      return;
    }

    const url = `/admin/products/?${makeArgs({ ...search, page: 1, search: '', status: value })}`;
    this.props.history.push(url);
  }

  handleCategoryChange(value) {
    value = value || '';

    const { search } = this.state;

    if (value === search.category) {
      return;
    }

    const url = `/admin/products/?${makeArgs({ ...search, page: 1, search: '', category: value })}`;
    this.props.history.push(url);
  }

  handleSearchChange(value) {
    const { search } = this.state;

    if (value === search.search) {
      return;
    }

    const url = `/admin/products/?${makeArgs({ ...search, page: 1, search: value })}`;
    this.props.history.push(url);
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return <Loader />;
  }

  makeError() {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    return <Alert type="danger">{error}</Alert>;
  }

  makeProducts() {
    const { data, search } = this.state;

    if (!data.products || !search) {
      return null;
    }

    const ret = data.products.map((product) => {
      return (
        <CatalogItem
          id={product.id}
          key={product.id}
          to={`/admin/product/${product.id}`}
          files={product.files}
          backgroundImage={product.image}
          hoverAnimation={product.animation}
          price={product.price}
          name={product.name}
          category={product.category}
        />
      );
    });

    if (!ret.length) {
      return <Alert>Nothing was found</Alert>;
    }

    return (
      <Catalog
        total={data.total}
        sortValue={search.sort}
        sortLink={`/admin/products/?${makeArgs({ ...search, page: 1, sort: { value: '%sort%', escape: false } })}`}
      >
        {ret}
      </Catalog>
    );
  }

  makePaginator() {
    const { data, loading, search } = this.state;

    if (loading || !search) {
      return null;
    }

    const { page, pages } = data;

    return (
      <Paginator
        page={page || 1}
        pages={pages || 1}
        to={`/admin/products/?${makeArgs({ ...search, page: { value: '%page%', escape: false } })}`}
      />
    );
  }

  makeSearch() {
    const { search, loading } = this.state;

    if (!search) {
      return null;
    }

    return (
      <Form>
        <FormSearch
          disabled={loading}
          defaultValue={search.search}
          onSearch={this.handleSearchChange}
        />

        <br />

        <div className="admin-products__selectes">
          <div className="admin-products__category">
            <FormSelect
              name="category"
              placeholder="Any category..."
              disabled={loading}
              onChange={this.handleCategoryChange}
              values={this.state.selectValues}
              defaultValue={search.category}
            />
          </div>
          <div className="admin-products__status">
            <FormSelect
              name="status"
              placeholder="Status..."
              disabled={loading}
              onChange={this.handleStatusChange}
              values={[
                { value: 'active', title: 'Active products' },
                { value: 'deleted', title: 'Deleted products' },
              ]}
              defaultValue={search.status}
            />
          </div>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <Content>
        <FormTitle>
          Products list
          <div className="admin-products__create">
            <FormButton to="/admin/product/create">Add new product</FormButton>
          </div>
        </FormTitle>

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

export default withRouter(RouteAdminProducts);
