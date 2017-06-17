import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SCWidget extends React.PureComponent {

  static propTypes = {
    url: PropTypes.string,
  };

  constructor (props, context) {
    super(props, context);

    this.state = {
      iframe: null,
      widget: null,
    }
  }

  componentDidMount () {
    axios.get(`https://soundcloud.com/oembed?format=json&maxwidth=234&maxheight=234&url=https://${this.props.url}`)
    .then(res => this.setState({iframe: res.data.html}) );
  }

  setWidgetRef = (el) => {
    this.widgetRef = el;
  }

  getEmbed = () => {
    return {__html: this.state.iframe};
  }

  render () {
    return (
      <div className="status-sc-widget-wrapper">
        {
          this.state.iframe ? (
            <div className="status-sc-widget" dangerouslySetInnerHTML={this.getEmbed()}/>
          ) : (
            <div className="status-sc-widget-loading" />
          )
        }
      </div>
    );
  }
}

export default SCWidget;
