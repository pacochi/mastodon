import React from 'react';
import Compose from '../../../mastodon/features/compose';
import UI from '../../../mastodon/features/ui';

export default class Intent extends React.PureComponent {

  render () {
    return (
      <UI className='compose-form__intent' intent>
        <Compose intent />
      </UI>
    );
  }

}
