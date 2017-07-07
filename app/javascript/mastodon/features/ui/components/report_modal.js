import React from 'react';
import { connect } from 'react-redux';
import { changeReportComment, submitReport } from '../../../actions/reports';
import { refreshAccountTimeline } from '../../../actions/timelines';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { makeGetAccount } from '../../../selectors';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import StatusCheckBox from '../../report/containers/status_check_box_container';
import Immutable from 'immutable';
<<<<<<< HEAD:app/javascript/mastodon/features/report/index.js
import Toggle from 'react-toggle';
import ColumnBackButtonSlim from '../../components/column_back_button_slim';
=======
import ImmutablePureComponent from 'react-immutable-pure-component';
import Button from '../../../components/button';
>>>>>>> v1.4.7:app/javascript/mastodon/features/ui/components/report_modal.js

const messages = defineMessages({
  placeholder: { id: 'report.placeholder', defaultMessage: 'Additional comments' },
  submit: { id: 'report.submit', defaultMessage: 'Submit' },
  reportTitle: { id: 'report.select.title', defaultMessage: 'Please select the reason for reporting' },
  donotlike: { id: 'report.select.donotlike', defaultMessage: 'I do not like it' },
  incorrectage: { id: 'report.select.incorrectage', defaultMessage: 'Incorrect CW・NSFW setting' },
  spam: { id: 'report.select.spam', defaultMessage: 'Spam' },
  reproduction: { id: 'report.select.reproduction', defaultMessage: 'Unauthorized reproduction' },
  prohibited: { id: 'report.select.prohibited', defaultMessage: 'Prohibited act' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = state => {
    const accountId = state.getIn(['reports', 'new', 'account_id']);

    return {
      isSubmitting: state.getIn(['reports', 'new', 'isSubmitting']),
      account: getAccount(state, accountId),
      comment: state.getIn(['reports', 'new', 'comment']),
      statusIds: Immutable.OrderedSet(state.getIn(['timelines', `account:${accountId}`, 'items'])).union(state.getIn(['reports', 'new', 'status_ids'])),
    };
  };

  return mapStateToProps;
};

@connect(makeMapStateToProps)
@injectIntl
export default class ReportModal extends ImmutablePureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool,
    account: ImmutablePropTypes.map,
    statusIds: ImmutablePropTypes.orderedSet.isRequired,
    comment: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

<<<<<<< HEAD:app/javascript/mastodon/features/report/index.js
  state = { option: false };

  componentWillMount () {
    if (!this.props.account) {
      this.context.router.history.replace('/');
    }

    this.options = Immutable.fromJS([
      { id: 'donotlike', value: '好みではない' },
      { id: 'incorrectage', value: 'CW・NSFW設定の不足' },
      { id: 'spam', value: 'スパム・迷惑行為' },
      { id: 'reproduction', value: '無断転載' },
      { id: 'prohibited', value: '禁止行為に該当' },
    ]);
=======
  handleCommentChange = (e) => {
    this.props.dispatch(changeReportComment(e.target.value));
>>>>>>> v1.4.7:app/javascript/mastodon/features/ui/components/report_modal.js
  }

  handleSubmit = () => {
    this.props.dispatch(submitReport());
  }

  componentDidMount () {
    this.props.dispatch(refreshAccountTimeline(this.props.account.get('id')));
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.account !== nextProps.account && nextProps.account) {
      this.props.dispatch(refreshAccountTimeline(nextProps.account.get('id')));
    }
  }

<<<<<<< HEAD:app/javascript/mastodon/features/report/index.js
  handleCommentChange = (e) => {
    this.props.dispatch(changeReportComment(e.target.value));
  }

  handleSubmit = () => {
    this.props.dispatch(submitReport());
    this.context.router.history.replace('/');
  }

  handlePreSubmit = () => {
    this.setState({ option: true });
  }

  onToggle = (e) => {
    this.props.dispatch(changeReportComment('')); // FIXME: Re render self
    this.props.dispatch(changeReportComment(e.target.getAttribute('name')));
  }

=======
>>>>>>> v1.4.7:app/javascript/mastodon/features/ui/components/report_modal.js
  render () {
    const { account, comment, intl, statusIds, isSubmitting } = this.props;
    const filled = this.options.findIndex(option => option.get('value') === comment) > -1;

    if (!account) {
      return null;
    }

    return (
      <div className='modal-root__modal report-modal'>
        <div className='report-modal__target'>
          <FormattedMessage id='report.target' defaultMessage='Report {target}' values={{ target: <strong>{account.get('acct')}</strong> }} />
        </div>

        <div className='report-modal__container'>
          <div className='report-modal__statuses'>
            <div>
              {statusIds.map(statusId => <StatusCheckBox id={statusId} key={statusId} disabled={isSubmitting} />)}
            </div>
          </div>

<<<<<<< HEAD:app/javascript/mastodon/features/report/index.js
          <div className='report__textarea-wrapper' style={{ padding: '10px' }}>
            {this.state.option &&
              <div className='report__select'>
                <div>
                  <div className='report__select__title'>{intl.formatMessage(messages.reportTitle)}</div>
                  {this.options.map(option =>
                    <div key={option.get('id')} style={{ display: 'flex' }}>
                      <div style={{ flex: '1 1 auto', padding: '10px' }}>
                        {intl.formatMessage(messages[option.get('id')])}
                      </div>
                      <div style={{ flex: '0 0 auto', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Toggle name={option.get('value')} checked={this.props.comment === option.get('value')} onChange={this.onToggle} disabled={isSubmitting} />
                      </div>
                    </div>
                  )}
                  <textarea
                    className={`report__textarea ${filled ? 'filled' : ''}`}
                    placeholder={intl.formatMessage(messages.placeholder)}
                    value={filled ? '' : comment}
                    onChange={this.handleCommentChange}
                    disabled={isSubmitting}
                  />

                  <Button disabled={isSubmitting || comment.length === 0} text={intl.formatMessage(messages.submit)} onClick={this.handleSubmit} block />
                </div>
              </div>
            }
            <div className='report__submit'>
              <Button disabled={isSubmitting} text={intl.formatMessage(messages.submit)} onClick={this.handlePreSubmit} block />
            </div>
=======
          <div className='report-modal__comment'>
            <textarea
              className='setting-text light'
              placeholder={intl.formatMessage(messages.placeholder)}
              value={comment}
              onChange={this.handleCommentChange}
              disabled={isSubmitting}
            />
>>>>>>> v1.4.7:app/javascript/mastodon/features/ui/components/report_modal.js
          </div>
        </div>

        <div className='report-modal__action-bar'>
          <Button disabled={isSubmitting} text={intl.formatMessage(messages.submit)} onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }

}
