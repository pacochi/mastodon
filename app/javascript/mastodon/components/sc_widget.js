import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SCWidget extends React.PureComponent {

  static propTypes = {
    url: PropTypes.string,
  };

  constructor (props, context) {
    super(props, context);

    this.uniq_id = Math.random()+(Math.random()*Math.random());
  }

  render () {

    return (
      <div/>
    );
  }

}

export default SCWidget;
