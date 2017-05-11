import Immutable from 'immutable';
import { connect }   from 'react-redux';
import TrendTags from '../components/trend_tags';

const mapStateToProps = (state, props) => ({
  // TODO: APIから引く
  trendTags: Immutable.fromJS([
    {
      "name":"pixiv",
      "description":"ああああ",
      "type":"suggestion",
      "url":"http://localhost:3000/timelines/tag/pixiv"
    },
    {
      "name":"test",
      "description":"運営タグテストだよ",
      "type":"suggestion",
      "url":"http://localhost:3000/tags/test"
    },
    {
      "name":"エロマンガ先生",
      "description":"2500件のトゥート",
      "type":"trend",
      "url":"http://localhost:3000/tags/%E3%82%A8%E3%83%AD%E3%83%9E%E3%83%B3%E3%82%AC%E5%85%88%E7%94%9F"
    },
    {
      "name":"Photo",
      "description":"2500件のトゥート",
      "type":"trend",
      "url":"http://localhost:3000/tags/Photo"
    },
    {
      "name":"FGO",
      "description":"2500件のトゥート",
      "type":"trend",
      "url":"http://localhost:3000/tags/FGO"
    }
  ])
});

export default connect(mapStateToProps)(TrendTags);
