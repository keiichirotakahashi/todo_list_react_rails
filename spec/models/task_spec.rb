# == Schema Information
#
# Table name: tasks
#
#  id         :bigint           not null, primary key
#  due_on     :date             not null
#  name       :string           not null
#  status     :integer          default("todo"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe Task, type: :model do
  let(:name_attribute) { nil }
  let(:due_on_attribute) { nil }
  let(:task_attributes) { attributes_for(:task, name: name_attribute, due_on: due_on_attribute) }

  describe 'validations' do
    context 'when attributes are valid' do
      subject { Task.new(name: 'Reactを勉強する', due_on: (Time.zone.now + 3.days).to_date) }
      it { is_expected.to be_valid }
    end

    describe 'validates :name, length: { minimum: 1, maximum: 255 }' do
      subject do
        task = Task.new(task_attributes)
        task.valid?
        task.errors[:name]
      end

      context 'when a name does not exist' do
        let(:name_attribute) { nil }
        let(:due_on_attribute) { (Time.zone.now + 3.days) }

        it { is_expected.to include 'は1文字以上で入力してください。' }
      end

      context 'when a name has 256 characters' do
        let(:name_attribute) { 'a' * 256 }
        let(:due_on_attribute) { (Time.zone.now + 3.days) }

        it { is_expected.to include 'は255文字以内で入力してください。' }
      end
    end

    describe 'validates :due_on, presence: true' do
      subject do
        task = Task.new(task_attributes)
        task.valid?
        task.errors[:due_on]
      end

      context 'when a due_on does not exist' do
        let(:name_attribute) { 'Reactを勉強する' }
        let(:due_on_attribute) { nil }

        it { is_expected.to include 'を入力してください。' }
      end
    end
  end
end
