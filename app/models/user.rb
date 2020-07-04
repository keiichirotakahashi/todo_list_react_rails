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
class User < ApplicationRecord
  has_many :projects, dependent: :destroy

  validates :username, length: { minimum: 1, maximum: 60 }, uniqueness: { case_sensitive: false },
    format: { with: /\A[a-z0-9]+\z/i }

  devise :database_authenticatable, :registerable, :rememberable, :validatable, :trackable,
    :authentication_keys => [:username]

  # override devise
  def will_save_change_to_email?
    false
  end

  def email_required?
    false
  end

  def email_changed?
    false
  end
end
