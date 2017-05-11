import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

class TrendTags extends React.PureComponent {

  render () {
    return (
      <div className="trend-tags">
        <div className="trend-tags__header">
          <i className="fa fa-line-chart trend-tags__header__icon" aria-hidden="true" />
          <div className="trend-tags__header__name">
            トレンド(実験中)
            <div className="trend-tags__header__description">
              今Pawooで人気のタグを見てみよう
            </div>
          </div>
        </div>
        <div className="trend-tags__body">
          <ul>
            {this.props.trendTags.map(trendTag => (
              <li key={trendTag.get('name')}>
                <Link className="trend-tags__name" to={`/timelines/tag/${trendTag.get('name')}`}>
                  #{trendTag.get('name')}
                </Link>
                <div className={`trend-tags__description ${trendTag.get('type') === 'suggestion' ? 'suggestion' : ''}`}>{trendTag.get('description')}</div>
              </li>
            ))}
          </ul>
          <div className="trend-tags__note">
            トレンドタグは直近20分間のトゥートをもとに作成しています。
          </div>
        </div>
      </div>
    );
  }
};

TrendTags.propTypes = {
  trendTags: ImmutablePropTypes.list.isRequired
};

export default TrendTags;
