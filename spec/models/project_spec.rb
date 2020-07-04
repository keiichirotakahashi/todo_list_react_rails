# == Schema Information
#
# Table name: projects
#
#  id         :bigint           not null, primary key
#  name       :string           default(""), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_projects_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Project, type: :model do
  let(:user) { create(:user) }
  let(:name_attribute) { nil }
  let(:user_attribute) { nil }
  let(:project_attributes) { attributes_for(:project, name: name_attribute, user: user_attribute) }
  
  describe 'associations' do
    describe 'belongs_to' do
      it { is_expected.to belong_to(:user) }
    end
  
    describe 'has_many' do
      it { is_expected.to have_many(:tasks).dependent(:destroy) }
    end
  end

  describe 'validations' do
    context 'when attributes are valid' do
      subject { Project.new(name: '個人開発プロジェクト', user: user) }
      it { is_expected.to be_valid }
    end

    describe 'validates :name, length: { minimum: 1, maximum: 255 }' do
      subject do
        project = Project.new(project_attributes)
        project.valid?
        project.errors[:name]
      end

      context 'when a name does not exist' do
        let(:name_attribute) { nil }
        let(:user_attribute) { user }

        it { is_expected.to include 'は1文字以上で入力してください。' }
      end

      context 'when a name has 256 characters' do
        let(:name_attribute) { 'a' * 256 }
        let(:user_attribute) { user }

        it { is_expected.to include 'は255文字以内で入力してください。' }
      end
    end

    describe 'belongs_to :user' do
      subject do
        project = Project.new(project_attributes)
        project.valid?
        project.errors[:user]
      end

      context 'when a user does not exist' do
        let(:name_attribute) { '個人開発プロジェクト' }
        let(:user_attribute) { nil }

        it { is_expected.to include 'を入力してください。' }
      end
    end
  end
end
