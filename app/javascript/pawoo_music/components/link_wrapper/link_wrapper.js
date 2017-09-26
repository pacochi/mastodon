import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class LinkWrapper extends React.PureComponent {

  static propTypes = {
    replace: PropTypes.bool,
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    innerRef: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
  }

  static contextTypes = {
    disableReactRouterLnik: PropTypes.bool,
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  }

  render () {
    if (this.context.disableReactRouterLnik) {
      const { replace, to, innerRef, ...props } = this.props; // eslint-disable-line no-unused-vars
      const href = this.context.router.history.createHref(
        typeof to === 'string' ? { pathname: to } : to
      );

      return <a {...props} href={href} ref={innerRef} />;
    } else {
      return (
        <Link {...this.props} />
      );
    }
  }

};
