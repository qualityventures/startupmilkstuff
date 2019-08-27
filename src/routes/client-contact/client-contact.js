import React from 'react';
import TitleUpdater from 'containers/title-updater';
import { Content, Heading, FormLabel } from 'components/ui';

class RouteClientContact extends React.PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  render() {
    return (
      <Content>
        <TitleUpdater title="Contacts" />
        <Heading>Contacts</Heading>
        <FormLabel>
          <a href="mailto:support@startupmilk.com">support@startupmilk.com</a>
        </FormLabel>
      </Content>
    );
  }
}

export default RouteClientContact;
