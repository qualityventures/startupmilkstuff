import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Catalog, CatalogItem } from 'components/ui';
import './orders-list.scss';

class ModalWrapper extends React.PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    link: PropTypes.string.isRequired,
  }

  static defaultProps = {

  }

  render() {
    const { link } = this.props;

    const orders = this.props.list.map((order) => {
      const to = link.replace(/:order_id/gi, order.id);
      const products = order.products.map((product) => {
        return (
          <CatalogItem
            id={product.id}
            key={product.id}
            to={to}
            files={product.files}
            backgroundImage={product.image}
            name={product.name}
          />
        );
      });

      return (
        <div key={order.id} className="orders-list-order__wrapper">
          <Link to={to} className="orders-list-order__title">
            Order #{order.numeric_id}
          </Link>
          <div className="orders-list-order__price">
            {order.price ? `$${order.price}` : 'Free!'}
          </div>
          <Catalog>
            {products}
          </Catalog>
        </div>
      );
    });

    return (
      <div>
        {orders}
      </div>
    );
  }
}

export default ModalWrapper;
