require 'rails_helper'

describe Form::StatusBatch do
  let(:form) { Form::StatusBatch.new(action: action, status_ids: status_ids) }
  let(:status) { Fabricate(:status) }

  describe 'with nsfw action' do
    let(:status_with_shown_media) { Fabricate(:status, sensitive: false) }
    let(:status_with_hidden_media) { Fabricate(:status, sensitive: true) }
    let!(:shown_media_attachment) { Fabricate(:media_attachment, status: status_with_shown_media) }
    let!(:hidden_media_attachment) { Fabricate(:media_attachment, status: status_with_hidden_media) }
    let(:status_ids) { [status.id, status_with_shown_media.id, status_with_hidden_media.id] }

    context 'nsfw_on' do
      let(:action) { 'nsfw_on' }

      it { expect(form.save).to be true }
      it { expect { form.save }.to change { Status.find(status_with_shown_media.id).sensitive }.from(false).to(true) }
      it { expect { form.save }.not_to change { Status.find(status_with_hidden_media.id).sensitive } }
      it { expect { form.save }.not_to change { Status.find(status.id).sensitive } }
    end

    context 'nsfw_off' do
      let(:action) { 'nsfw_off' }

      it { expect(form.save).to be true }
      it { expect { form.save }.to change { Status.find(status_with_hidden_media.id).sensitive }.from(true).to(false) }
      it { expect { form.save }.not_to change { Status.find(status_with_shown_media.id).sensitive } }
      it { expect { form.save }.not_to change { Status.find(status.id).sensitive } }
    end
  end

  describe 'with delete action' do
    let!(:another_status) { Fabricate(:status) }
    let(:status_ids) { [status.id] }
    let(:action) { 'delete' }

    before do
      allow(RemovalWorker).to receive(:perform_async)
    end

    it 'call RemovalWorker' do
      form.save
      expect(RemovalWorker).to have_received(:perform_async).with(status.id)
    end

    it 'do not call RemovalWorker' do
      form.save
      expect(RemovalWorker).not_to have_received(:perform_async).with(another_status.id)
    end
  end
end
