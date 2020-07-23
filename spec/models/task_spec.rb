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
#  project_id :bigint           not null
#
# Indexes
#
#  index_tasks_on_project_id  (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#
require 'rails_helper'

RSpec.describe Task, type: :model do
  let(:user) { create(:user) }
  let(:project) { create(:project, user: user) }
  let(:name_attribute) { nil }
  let(:due_on_attribute) { nil }
  let(:project_attribute) { nil }
  let(:task_attributes) do
    attributes_for(
      :task, name: name_attribute, due_on: due_on_attribute, project: project_attribute
    )
  end

  describe 'associations' do
    describe 'belongs_to' do
      it { is_expected.to belong_to(:project) }
    end
  end

  describe 'validations' do
    context 'when attributes are valid' do
      subject { Task.new(name: 'Reactを勉強する', due_on: (Time.zone.now + 3.days), project: project) }
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
        let(:project_attribute) { project }

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
        let(:project_attribute) { project }

        it { is_expected.to include 'を入力してください。' }
      end
    end

    describe 'belongs_to :project' do
      subject do
        task = Task.new(task_attributes)
        task.valid?
        task.errors[:project]
      end

      context 'when a project does not exist' do
        let(:name_attribute) { '個人開発プロジェクト' }
        let(:due_on_attribute) { (Time.zone.now + 3.days) }
        let(:project_attribute) { nil }

        it { is_expected.to include 'を入力してください。' }
      end
    end
  end
end
