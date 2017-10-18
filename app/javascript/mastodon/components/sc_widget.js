import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';

class SCWidget extends React.PureComponent {

  static propTypes = {
    url: PropTypes.string,
    detail: PropTypes.bool,
  };

  constructor (props, context) {
    super(props, context);

    this.state = {
      iframe: null,
    };
  }

  componentDidMount () {
    const { url } = this.props;
    const size = this.getContentSize();

    const params = {
      format: 'json',
      maxwidth: size,
      maxheight: size,
      url,
    };

    axios.get(`https://soundcloud.com/oembed?${querystring.stringify(params)}`)
    .then(res => this.setState({ iframe: res.data.html }) );
  }

  getContentSize () {
    const { detail } = this.props;

    return detail ? '456' : '248';
  }

  getEmbed = () => {
    return { __html: this.state.iframe };
  }

  render () {
    const size = this.getContentSize();

    return (
      <div className='status-sc-widget-wrapper'>
        {
          this.state.iframe ? (
            <div className='status-sc-widget' dangerouslySetInnerHTML={this.getEmbed()} />
          ) : (
            <div style={{ width: `${size}px`, height: `${size}px` }} />
          )
        }
      </div>
    );
  }

}

export default SCWidget;
