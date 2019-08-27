import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addToCart } from 'actions/cart';
import { Loader } from 'components/ui';
import './styles.scss';

class CartButton extends React.PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    in_cart: PropTypes.bool.isRequired,
    addToCart: PropTypes.func.isRequired,
    color: PropTypes.oneOf(['black', 'white']),
  }

  static defaultProps = {
    color: 'black',
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.addToCart = this.addToCart.bind(this);
  }

  addToCart() {
    if (this.state.loading || this.props.in_cart) {
      return;
    }

    this.setState({ loading: true });

    this.props.addToCart(this.props.productId)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return (
      <div className="button-add__loader">
        <Loader size="small" />
      </div>
    );
  }

  render() {
    let className = 'button-add';

    if (this.props.color === 'black') {
      className += ' button-dark';
    }

    return (
      <a className={className} onClick={this.addToCart}>
        {this.props.in_cart ? 'In cart' : 'Add to cart'}
        <span>
          {this.makeLoader()}
          {this.props.price ? `$${this.props.price}` : 'Free!'}
        </span>
      </a>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      in_cart: !!state.cart.products_list[props.productId],
    };
  },
  (dispatch) => {
    return {
      addToCart: (productId) => { return dispatch(addToCart(productId)); },
    };
  }
)(CartButton);
