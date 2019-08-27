import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import AdminContainer from 'containers/admin-container';

class AdminApp extends React.PureComponent {
  render() {
    return (
      <Provider store={window.REDUX_STORE}>
        <BrowserRouter>
          <AdminContainer />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default AdminApp;
