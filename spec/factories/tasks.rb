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
FactoryBot.define do
  factory :task do
    name { 'タスク' }
    status {  'todo' }
    due_on { (Time.zone.now + 3.days).to_date }
  end
end
