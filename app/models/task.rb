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
class Task < ApplicationRecord
  validates :name, length: { minimum: 1, maximum: 255 }
  validates :due_on, presence: true

  enum status: {
    todo: 1, done: 2
  }
end
