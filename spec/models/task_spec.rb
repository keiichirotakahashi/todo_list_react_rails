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
  it 'is valid with a name and due_on' do
    task = Task.new(
      name: 'Reactを勉強する',
      due_on: (Time.zone.now + 3.days).to_date
    )
    expect(task).to be_valid
  end

  it 'is invalid without a name' do
    task = build(:task, name: nil)
    task.valid?
    expect(task.errors[:name]).to include('は1文字以上で入力してください')
  end

  it 'is invalid with a name which has more than 255 characters' do
    task = build(:task, name: 'あ' * 256)
    task.valid?
    expect(task.errors[:name]).to include('は255文字以内で入力してください')
  end

  it 'is invalid without a due_on' do
    task = build(:task, due_on: nil)
    task.valid?
    expect(task.errors[:due_on]).to include('を入力してください')
  end
end
