import React from 'react';
import PropTypes from 'prop-types';
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
} from 'react-stripe-elements';

const STRIPE_STYLE = {
  base: {
    fontSize: '14px',
    fontFamily: 'SuisseBPIntl',
    fontWeight: 'normal',
    '::placeholder': {
      color: '#828286',
    },
  },
};

class PaymentsForm extends React.PureComponent {
  static propTypes = {
    setStripeCreateToken: PropTypes.func.isRequired,
    stripe: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  componentDidMount() {
    this.props.setStripeCreateToken(this.props.stripe.createToken);
  }

  componentWillUnmount() {
    this.props.setStripeCreateToken(null);
  }

  render() {
    return (
      <div>
        <div className="cart-popup__card-icons">
          <div className="cart-popup__card-icon cart-popup__card-icon--mc" />
          <div className="cart-popup__card-icon cart-popup__card-icon--visa" />
          <div className="cart-popup__card-icon cart-popup__card-icon--amex" />
        </div>

        <div className="cart-popup__card-number">
          <div className="cart-popup__stripe_input">
            <CardNumberElement style={STRIPE_STYLE} />
          </div>
          <div className="cart-popup__card-lock" />
        </div>

        <div className="cart-popup__card-extra">
          <div className="cart-popup__card-exp">
            <div className="cart-popup__stripe_input">
              <CardExpiryElement style={STRIPE_STYLE} />
            </div>
          </div>
          <div className="cart-popup__card-cvc">
            <div className="cart-popup__stripe_input">
              <CardCVCElement style={STRIPE_STYLE} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectStripe(PaymentsForm);
