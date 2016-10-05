require 'rails_helper'

RSpec.describe Graffiti::ImageProcessorJob, type: :job do
  include ActiveJob::TestHelper

  subject(:job) do
    described_class.perform_later(123) 
  end

  it 'queues the job' do
    expect { job }
      .to change(ActiveJob::Base.queue_adapter.enqueued_jobs, :size).by(1)
  end

  it 'is in graffiti_images queue' do
    expect(Graffiti::ImageProcessorJob.new.queue_name).to eq('graffiti_images')
  end

  # all spec jobs will fail bc record does not exist
  it 'handles no results error' do

    perform_enqueued_jobs do
      expect_any_instance_of(Graffiti::ImageProcessorJob)
        .to receive(:retry_job).with(wait: 1.minutes, queue: :default)

      job
    end
  end

  after do
    clear_enqueued_jobs
    clear_performed_jobs
  end
end