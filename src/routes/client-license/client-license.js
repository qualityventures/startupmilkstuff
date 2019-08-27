import React from 'react';
import TitleUpdater from 'containers/title-updater';
import { Content, FormLabel, Heading } from 'components/ui';

class RouteClientLicense extends React.PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  render() {
    return (
      <Content>
        <TitleUpdater title="License" />
        <Heading>License</Heading>
        <FormLabel>
          Here’s a breakdown of what you get when you purchase design resources from Matte.
        </FormLabel>
        <FormLabel><Heading withMarginBottom={false}>What’s cool</Heading></FormLabel>
        <FormLabel>
          <ul>
            <li>- You can use the assets to create designs for fun or for money</li>
            <li>- You can edit the assets and mix them with other assets to make something bad ass</li>
            <li>- You can use the assets on as many projects as you’d like</li>
          </ul>
        </FormLabel>
        <FormLabel><Heading withMarginBottom={false}>What’s Not Cool</Heading></FormLabel>
        <FormLabel>
          <ul>
            <li>
              - You can not redistribute asset’s source files, regardless of how much you change them. We
              work hard on making the kits for you, and don’t want to see them resold or giveaway elsewhere.
            </li>
          </ul>
        </FormLabel>
        <FormLabel><Heading withMarginBottom={false}>Third-Part Licenses</Heading></FormLabel>
        <FormLabel>
          <ul>
            <li>- There are items where components such as, but not limited to, fonts, photographs, and illustrations are sourced by their creator from a third-party in which different license terms may apply.</li>
          </ul>
        </FormLabel>
      </Content>
    );
  }
}

export default RouteClientLicense;
