import React from 'react';
import { Button } from 'semantic-ui-react';

export default class Header extends React.Component {
  static propTypes = {
    lock: React.PropTypes.object
  }

  showLock = () => {
    this.props.lock.show();
  }

  render() {
    return (
      <div className="header">
        <span className="header-logo" />
      </div>
    );
  }
}
