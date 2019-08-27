import React from 'react';
import TitleUpdater from 'containers/title-updater';
import apiFetch from 'helpers/api-fetch';
import { Alert, Loader, Content, Heading } from 'components/ui';
import OrdersList from 'components/orders-list';

class RouteDashboardOrders extends React.PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loaded: false,
      orders: [],
    };
  }

  componentDidMount() {
    this.loadOrders();
  }

  loadOrders() {
    if (this.state.loading) {
      return;
    }

    this.setState({ error: false, loaded: false, loading: true });

    apiFetch('api/orders/my')
      .then((orders) => {
        this.setState({ loaded: true, loading: false, orders });
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

  makeOrders() {
    if (!this.state.loaded) {
      return null;
    }

    if (!this.state.orders.length) {
      return <Alert>There is no orders yet</Alert>;
    }

    return (
      <OrdersList
        list={this.state.orders}
        link="/dashboard/order/:order_id"
      />
    );
  }

  render() {
    return (
      <Content>
        <TitleUpdater title="My orders" />
        <Heading>My orders</Heading>
        {this.makeError()}
        {this.makeLoader()}
        {this.makeOrders()}
      </Content>
    );
  }
}

export default RouteDashboardOrders;
