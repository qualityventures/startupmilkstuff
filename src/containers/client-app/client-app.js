import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ClientContainer from 'containers/client-container';

class ClientApp extends React.PureComponent {
  render() {
    return (
      <Provider store={window.REDUX_STORE}>
        <BrowserRouter>
          <ClientContainer />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default ClientApp;
