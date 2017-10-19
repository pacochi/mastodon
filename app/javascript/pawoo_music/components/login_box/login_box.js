import React, { PureComponent } from 'react';
import Button from '../button';

// TODO: 多言語

export default class LoginBox extends PureComponent {

  render () {
    return (
      <div className='login-box'>
        <Button className='red fit-width' href='/auth/sign_up'>新規登録</Button>
        <div>または</div>
        <Button className='red fit-width' href='/auth/sign_in'>ログイン</Button>
      </div>
    );
  }

};
