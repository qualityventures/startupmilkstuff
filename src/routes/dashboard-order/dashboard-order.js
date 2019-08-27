import React from 'react';
import PropTypes from 'prop-types';
import TitleUpdater from 'containers/title-updater';
import apiFetch from 'helpers/api-fetch';
import { Content, Alert, Loader, Heading, Catalog, CatalogItem } from 'components/ui';
import FORMATS_LIST from 'data/files';
import './dashboard-order.scss';

class RouteDashboardOrder extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loaded: false,
      order: {},
    };
  }

  componentDidMount() {
    this.loadOrder();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.order_id !== this.props.match.params.order_id) {
      this.loadOrder();
    }
  }

  loadOrder() {
    if (this.state.loading) {
      return;
    }

    this.setState({ error: false, loaded: false, loading: true });

    apiFetch(`api/orders/${this.props.match.params.order_id}`)
      .then((order) => {
        this.setState({ loaded: true, loading: false, order });
      })
      .catch((e) => {
        this.setState({ loaded: false, loading: false, error: e });
      });
  }

  makeError() {
    if (!this.state.error) {
      return null;
    }

    return <Alert type="danger">{this.state.error}</Alert>;
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return <Loader />;
  }

  makeOrder() {
    if (!this.state.loaded) {
      return null;
    }

    const { order } = this.state;
    const products = [];

    order.products.forEach((product) => {
      const downloads = [];

      product.downloads.forEach((download) => {
        const style = {};

        if (FORMATS_LIST[download.type]) {
          style.color = FORMATS_LIST[download.type].color;
        }
        downloads.push(
          <CatalogItem
            key={download.file_id}
            files={download.types}
            bigButton={
              <a href={`/api/download/${product.id}/${download.file_id}/${order.id}`} style={style} target="_blank" rel="noopener noreferrer">
                <img src={'/static/images/download.svg'} />
                <div className="black">{download.name}</div>
              </a>
            }
          />
        );
      });

      products.push(
        <div className="order-details__product" key={product.id}>
          <div>{product.name}</div>
          <Catalog>{downloads}</Catalog>
        </div>
      );
    });

    return (
      <div className="order-details__wrapper">
        <div className="order-details__title">Order #{order.numeric_id}</div>
        <div className="order-details__price">{order.price ? `$${order.price}` : 'Free!'}</div>
        {products}
      </div>
    );
  }

  render() {
    return (
      <Content>
        <TitleUpdater title="My orders" />
        <Heading>Order details</Heading>
        {this.makeError()}
        {this.makeLoader()}
        {this.makeOrder()}
      </Content>
    );
  }
}

export default RouteDashboardOrder;
