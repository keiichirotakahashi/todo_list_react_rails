# == Schema Information
#
# Table name: users
#
#  id                  :bigint           not null, primary key
#  current_sign_in_at  :datetime
#  current_sign_in_ip  :inet
#  encrypted_password  :string           default(""), not null
#  last_sign_in_at     :datetime
#  last_sign_in_ip     :inet
#  remember_created_at :datetime
#  sign_in_count       :integer          default(0), not null
#  username            :string           default(""), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_users_on_username  (username) UNIQUE
#
require 'rails_helper'

RSpec.describe User, type: :model do
  let(:username_attribute) { nil }
  let(:password_attribute) { nil }
  let(:user_attributes) { attributes_for(:user, username: username_attribute, password: password_attribute) }

  describe 'associations' do
    describe 'has_many' do
      it { is_expected.to have_many(:projects).dependent(:destroy) }
    end
  end

  describe 'validations' do
    context 'when attributes are valid' do
      subject { User.new(username: 'testuser', password: 'hogehoge') }
      it { is_expected.to be_valid }
    end

    describe 'validates :username, length: { minimum: 1, maximum: 60 }, uniqueness: { case_sensitive: false }, format: { with: /\A[a-z0-9]+\z/i }' do
      subject do
        user = User.new(user_attributes)
        user.valid?
        user.errors[:username]
      end

      context 'when a username does not exist' do
        let(:username_attribute) { nil }
        let(:password_attribute) { 'hogehoge' }

        it { is_expected.to include 'は1文字以上で入力してください。' }
      end

      context 'when a username has 61 characters' do
        let(:username_attribute) { 'a' * 61 }
        let(:password_attribute) { 'hogehoge' }

        it { is_expected.to include 'は60文字以内で入力してください。' }
      end

      context 'when a username is already taken' do
        before { User.create(username: 'testuser', password: 'hogehoge') }

        let(:username_attribute) { 'testuser' }
        let(:password_attribute) { 'hogehoge' }

        it { is_expected.to include 'はすでに存在します。' }
      end

      context 'when a username has an invalid character' do
        let(:username_attribute) { 'テストユーザー' }
        let(:password_attribute) { 'hogehoge' }

        it { is_expected.to include 'は不正な値です。' }
      end
    end

    describe ':password' do
      subject do
        user = User.new(user_attributes)
        user.valid?
        user.errors[:password]
      end

      context 'when a password does not exist' do
        let(:username_attribute) { 'testuser' }
        let(:password_attribute) { nil }

        it { is_expected.to include 'を入力してください。' }
      end

      context 'when a password has 5 characters' do
        let(:username_attribute) { 'testuser' }
        let(:password_attribute) { 'a' * 5 }

        it { is_expected.to include 'は6文字以上で入力してください。' }
      end

      context 'when a password has 129 characters' do
        let(:username_attribute) { 'testuser' }
        let(:password_attribute) { 'a' * 129 }

        it { is_expected.to include 'は128文字以内で入力してください。' }
      end
    end
  end
end
