import React from 'react';
import PropTypes from 'prop-types';
import {
  FormTitle,
  Form,
  FormLabel,
  FormInput,
  FormButton,
  Alert,
  Loader,
  Catalog,
  CatalogItem,
} from 'components/ui';
import { closeModal } from 'actions/modals';
import { connect } from 'react-redux';
import apiFetch from 'helpers/api-fetch';
import './products-select.scss';

class ProductsSelect extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    action: PropTypes.string,
    selected: PropTypes.array,
    onUpdate: PropTypes.func,
    exclude: PropTypes.array,
    closeModal: PropTypes.func.isRequired,
    modalId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    name: 'Select products',
    action: 'Process',
    selected: [],
    onUpdate: null,
    exclude: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      selected: [...props.selected],
      products: [],
      loading: false,
      loaded: false,
      error: false,
      search: '',
    };

    this.toggleProduct = this.toggleProduct.bind(this);
    this.handleUpdateSearch = this.handleUpdateSearch.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.setInputRef = this.setInputRef.bind(this);

    this.ref_input = false;
  }

  componentDidMount() {
    this.loadProducts();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.setState({ selected: [...nextProps.selected] });
    }
  }

  componentWillUnmount() {
    this.ref_input = false;
  }

  setInputRef(c) {
    this.ref_input = c;
  }

  loadProducts() {
    this.setState({ loading: true, loaded: false, error: false, products: [] });
    
    apiFetch('api/products/', {
      method: 'GET',
      query: {
        rpp: 999,
        sort: '-created',
        status: 'visible',
        page: 1,
        category: 'all',
      },
    }).then((response) => {
      this.setState({ loading: false, loaded: true, products: response.products });
    }).catch((e) => {
      this.setState({ loading: false, error: e || 'Something went wrong' });
    });
  }

  toggleProduct(id) {
    const selected = [...this.state.selected];
    const index = selected.indexOf(id);

    if (index === -1) {
      selected.push(id);
    } else {
      selected.splice(index, 1);
    }

    this.setState({ selected });
  }

  handleUpdateSearch() {
    const search = this.ref_input.value.trim();

    if (search === this.state.search) {
      return;
    }

    this.setState({ search });
  }

  handleConfirm() {
    const { onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(this.state.selected);
    }

    this.props.closeModal(this.props.modalId);
  }

  makeSearch() {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <FormLabel>
        <FormInput
          onKeyUp={this.handleUpdateSearch}
          onSubmit={this.handleUpdateSearch}
          defaultValue={this.state.search}
          placeholder="Search products"
          setRef={this.setInputRef}
        />
      </FormLabel>
    );
  }

  makeList() {
    if (!this.state.loaded) {
      return null;
    }

    const selected = {};
    const exclude = {};

    this.props.exclude.forEach((id) => {
      exclude[id] = true;
    });

    this.state.selected.forEach((id) => {
      selected[id] = true;
    });

    let { search, products } = this.state;

    if (search) {
      products = [];
      search = search.toLowerCase();

      this.state.products.forEach((product) => {
        if (product.name.toLowerCase().indexOf(search) === -1) {
          return;
        }

        products.push(product);
      });
    }

    if (!products.length) {
      return (
        <FormLabel>
          <Alert type="danger">Nothing was found</Alert>
        </FormLabel>
      );
    }

    const ret = [];

    products.forEach((product) => {
      if (exclude[product.id]) {
        return;
      }

      ret.push(
        <CatalogItem
          id={product.id}
          key={product.id}
          files={product.files}
          backgroundImage={product.image}
          hoverAnimation={product.animation}
          price={product.price}
          name={product.name}
          category={product.category}
          bigButton={
            <span className={`products-select__button products-select__button--${selected[product.id] ? 'remove' : 'add'}`}>
              {selected[product.id] ? 'Remove' : 'Add'}
            </span>
          }
          onBigButtonClick={this.toggleProduct}
        />
      );
    });

    return (
      <FormLabel>
        <Catalog>
          {ret}
        </Catalog>
      </FormLabel>
    );
  }

  makeButton() {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <FormLabel>
        <FormButton onClick={this.handleConfirm}>
          {this.props.action}
        </FormButton>
      </FormLabel>
    );
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return (
      <FormLabel><Loader /></FormLabel>
    );
  }

  makeError() {
    if (!this.state.error) {
      return null;
    }

    return (
      <FormLabel><Alert type="danger">{this.state.error}</Alert></FormLabel>
    );
  }

  render() {
    return (
      <Form>
        <FormLabel>
          <FormTitle>{this.props.name}</FormTitle>
        </FormLabel>

        {this.makeError()}
        {this.makeLoader()}
        {this.makeSearch()}
        {this.makeList()}
        {this.makeButton()}
      </Form>
    );
  }
}

export default connect(
  (state, props) => {
    return {

    };
  },
  (dispatch) => {
    return {
      closeModal: (id) => { return dispatch(closeModal(id)); },
    };
  }
)(ProductsSelect);
