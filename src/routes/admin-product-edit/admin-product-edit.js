import React from 'react';
import PropTypes from 'prop-types';
import {
  Content,
  Form,
  Alert,
  FormInput,
  FormMisc,
  FormSelect,
  FormTitle,
  FormButton,
  FormLabel,
  Loader, 
  Catalog,
  CatalogItem,
} from 'components/ui';
import {
  validateProductUrl,
  validateProductName,
  validateProductCategory,
  validateProductPrice,
  validateProductDesc,
  validateProductDisplay,
  validateProductYoutube,
} from 'helpers/validators';
import { openModal } from 'actions/modals';
import ImagesManager from 'components/images-manager';
import FilesManager from 'components/files-manager';
import CATEGORIES_LIST from 'data/categories';
import DISPLAY_LIST from 'data/products-display';
import { connect } from 'react-redux';
import apiFetch from 'helpers/api-fetch';

class RouteAdminProductEdit extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      success: false,
      loading: false,
      loaded: false,
      data: {},
      error: false,
      categoriesValues: Object.keys(CATEGORIES_LIST).map((key) => {
        return { value: key, title: CATEGORIES_LIST[key].text };
      }),
      displayValues: Object.keys(DISPLAY_LIST).map((key) => {
        return { value: key, title: DISPLAY_LIST[key] };
      }),
    };

    this.inputRefs = {};

    this.toggleDeleted = this.toggleDeleted.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.updateRelatedProducts = this.updateRelatedProducts.bind(this);
    this.selectRelatedProducts = this.selectRelatedProducts.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
  }

  componentDidMount() {
    this.loadProductInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadProductInfo();
    }
  }

  componentWillUnmount() {
    this.inputRefs = {};
  }

  setInputRef(e, name) {
    this.inputRefs[name] = e;
  }

  loadProductInfo() {
    const id = this.props.match.params.id;

    this.setState({
      loading: false,
      loaded: false,
      error: false,
      success: false,
    });

    if (!id) {
      this.setState({ error: 'Invalid product id' });
      return;
    }

    fetch(`/api/products/getById/${id}`, {
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

  toggleDeleted() {
    const id = this.props.match.params.id;
    const data = { ...this.state.data, deleted: !this.state.data.deleted };

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: false, error: false });

    apiFetch(`api/products/${id}`, {
      method: 'PATCH',
      payload: data,
    }).then((product) => {
      const newData = { ...this.state.data };

      newData.url = product.url;
      newData.name = product.name;
      newData.price = product.price;
      newData.desc_raw = product.desc_raw;
      newData.desc_html = product.desc_html;
      newData.category = product.category;
      newData.deleted = product.deleted;

      this.setState({ loading: false, data: newData });
    }).catch((e) => {
      this.setState({ loading: false, error: e || 'Something went wrong' });
    });
  }

  updateRelatedProducts(list) {
    const id = this.props.match.params.id;

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: false, error: false });

    apiFetch(`api/products/${id}/related`, {
      method: 'POST',
      payload: { related: list },
    }).then((product) => {
      const newData = { ...this.state.data };

      newData.related = [...product.related];

      this.setState({ loading: false, data: newData });
    }).catch((e) => {
      this.setState({ loading: false, error: e || 'Something went wrong' });
    });
  }

  selectRelatedProducts() {
    const selected = [];

    this.state.data.related.forEach((product) => {
      selected.push(String(product._id));
    });

    this.props.openModal({
      type: 'PRODUCTS_SELECT',
      props: {
        name: `${this.state.data.name} Related`,
        selected,
        exclude: [this.props.match.params.id],
        action: 'Update related',
        onUpdate: this.updateRelatedProducts,
      },
    });
  }

  updateProduct() {
    const id = this.props.match.params.id;
    const data = {};
    let success = true;
    const fields = {
      desc: validateProductDesc,
      price: validateProductPrice,
      category: validateProductCategory,
      url: validateProductUrl,
      name: validateProductName,
      display: validateProductDisplay,
      youtube: validateProductYoutube,
    };

    this.setState({ loading: false, error: false, success: false });

    Object.keys(fields).forEach((field) => {
      const ref = this.inputRefs[field];
      let value = false;

      if (!ref) {
        this.setState({ error: 'Something went wrong' });
        success = false;
        return;
      }

      if (field === 'category') {
        value = ref.options[ref.selectedIndex].value;
      } else {
        value = ref.value;
      }
      const validation = fields[field](value);

      if (validation !== true) {
        ref.focus();
        this.setState({ error: validation });
        success = false;
        return;
      }

      data[field] = value;
    });

    if (!success) {
      return;
    }

    this.setState({ loading: true });

    fetch(`/api/products/${id}`, {
      credentials: 'include',
      mode: 'cors',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (json.error) return Promise.reject(json.error);
        if (response.status !== 200) return Promise.reject('invalid server response');
        return json;
      })
      .then((product) => {
        const newData = { ...this.state.data };

        newData.url = product.url;
        newData.name = product.name;
        newData.price = product.price;
        newData.desc_raw = product.desc_raw;
        newData.desc_html = product.desc_html;
        newData.category = product.category;
        newData.deleted = product.deleted;

        this.setState({ loading: false, success: true, data: newData });
      })
      .catch((err) => {
        const error = err && err.toString ? err.toString() : 'Bad response from server';
        this.setState({ error, loading: false });
      });
  }

  makeSuccess() {
    if (!this.state.success) {
      return null;
    }

    return <Alert>Product have successfully been updated</Alert>;
  }

  makeError() {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    return <Alert type="danger">{error}</Alert>;
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return <Loader />;
  }

  makeDeleteButton() {
    const { deleted } = this.state.data;

    if (this.state.loading) {
      return null;
    }

    return (
      <FormLabel>
        <FormButton onClick={this.toggleDeleted} type={deleted ? 'submit' : 'danger'}>
          {deleted ? 'Restore' : 'Delete'} product
        </FormButton>
      </FormLabel>
    );
  }

  makeSaveButton() {
    if (this.state.loading) {
      return null;
    }

    return (
      <FormLabel>
        <FormButton onClick={this.updateProduct}>Update</FormButton>
      </FormLabel>
    );
  }

  makeRelatedList() {
    const { related } = this.state.data;

    if (!related.length) {
      return null;
    }

    const ret = [];

    related.forEach((product) => {
      const files = {};
      let image = null;
      let animation = null;

      product.files.forEach((file) => {
        if (!file.types) {
          return;
        }

        file.types.forEach((type) => {
          files[type] = true;
        });
      });

      if (product.images.length) {
        image = product.images[0].preview;

        if (product.images[0].animated) {
          animation = product.images[0].full;
        }
      }

      ret.push(
        <CatalogItem
          id={product._id}
          key={product._id}
          files={Object.keys(files)}
          backgroundImage={image}
          hoverAnimation={animation}
          price={product.price}
          name={product.name}
          category={product.category}
          to={`/admin/product/${product._id}`}
        />
      );
    });

    return ret;
  }

  render() {
    const { loading, loaded, error, data } = this.state;

    if (!loaded) {
      if (error) {
        return (
          <Content>
            <Form>
              <FormTitle>Edit product</FormTitle>
              <Alert type="danger">{error}</Alert>
            </Form>
          </Content>
        );
      }

      return (
        <Content>
          <Form>
            <FormTitle>Edit product</FormTitle>
            <Loader />
          </Form>
        </Content>
      );
    }

    return (
      <Content>
        <Form>
          <FormTitle>Edit: {data.name}</FormTitle>
          {this.makeSuccess()}
          {this.makeError()}

          <FormLabel>
            <FormMisc>
              Basic details
            </FormMisc>
          </FormLabel>

          <FormLabel>
            <FormInput
              setRef={this.setInputRef}
              onSubmit={this.updateProduct}
              name="name"
              placeholder="Product name"
              defaultValue={data.name}
              disabled={loading}
            />
          </FormLabel>

          <FormLabel>
            <FormInput
              setRef={this.setInputRef}
              onSubmit={this.updateProduct}
              name="url"
              placeholder="Product url"
              defaultValue={data.url}
              disabled={loading}
            />
          </FormLabel>

          <FormLabel>
            <FormInput
              setRef={this.setInputRef}
              onSubmit={this.updateProduct}
              name="price"
              placeholder="Product price"
              defaultValue={data.price}
              disabled={loading}
            />
          </FormLabel>

          <FormLabel>
            <FormSelect
              setRef={this.setInputRef}
              name="display"
              placeholder="Display as..."
              disabled={loading}
              values={this.state.displayValues}
              defaultValue={data.display}
            />
          </FormLabel>

          <FormLabel>
            <FormInput
              setRef={this.setInputRef}
              name="youtube"
              placeholder="Youtube link"
              defaultValue={data.youtube}
              disabled={loading}
            />
          </FormLabel>

          <FormLabel>
            <FormSelect
              setRef={this.setInputRef}
              name="category"
              placeholder="Select category..."
              disabled={loading}
              values={this.state.categoriesValues}
              defaultValue={data.category}
            />
          </FormLabel>

          <FormLabel>
            <FormInput
              setRef={this.setInputRef}
              name="desc"
              placeholder="Product desc"
              defaultValue={data.desc_raw}
              disabled={loading}
              multiline
            />
          </FormLabel>

          {this.makeLoader()}
          {this.makeSaveButton()}
          {this.makeDeleteButton()}

          <FormLabel>
            <FormMisc>
              Display
            </FormMisc>
          </FormLabel>

          <FormLabel>
            <FormMisc>
              Images
            </FormMisc>
          </FormLabel>

          <FormLabel>
            <ImagesManager
              productId={this.props.match.params.id}
              images={data.images}
            />
          </FormLabel>

          <FormLabel>
            <FormMisc>
              Files
            </FormMisc>
          </FormLabel>

          <FormLabel>
            <FilesManager
              productId={this.props.match.params.id}
              files={data.files}
            />
          </FormLabel>

          <FormLabel>
            <FormMisc>
              Related items
            </FormMisc>
          </FormLabel>

          <FormLabel>
            <Catalog>
              {this.makeRelatedList()}
              <CatalogItem
                bigButton={this.state.loading ? <Loader /> : <span>Select related</span>}
                onBigButtonClick={this.selectRelatedProducts}
              />
            </Catalog>
          </FormLabel>
        </Form>
      </Content>
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
      openModal: (data) => { return dispatch(openModal(data)); },
    };
  }
)(RouteAdminProductEdit);
