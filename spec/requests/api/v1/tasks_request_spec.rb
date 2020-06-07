require 'rails_helper'

RSpec.describe 'Api::V1::Tasks', type: :request do
  let(:name) { nil }
  let(:status) { nil }
  let(:due_on) { nil }
  let(:task) { create(:task, name: name, status: status, due_on: due_on) }
  let(:another_name) { nil }
  let(:another_status) { nil }
  let(:another_due_on) { nil }
  let(:params) do
    attributes_for(:task, name: another_name, status: another_status, due_on: another_due_on)
  end

  describe 'GET /api/v1/tasks' do
    it 'loads two tasks' do
      2.times { |i| Task.create(name: "タスク#{i}", due_on: (Time.zone.now + 3.days).to_date) }
      get '/api/v1/tasks'
      expect(response).to have_http_status(200)
      json = JSON.parse(response.body)
      expect(json['data'].length).to eq 2
    end
  end

  describe 'GET /api/v1/tasks/:id' do
    let(:name) { 'タスク' }
    let(:status) { 'todo' }
    let(:due_on) { (Time.zone.now + 3.days).to_date }

    it 'loads a task' do
      get "/api/v1/tasks/#{task.id}"
      expect(response).to have_http_status(200)
      json = JSON.parse(response.body)
      expect(json['data']['name']).to eq('タスク')
    end
  end

  describe 'POST /api/v1/tasks' do
    let(:another_name) { 'タスク' }
    let(:another_status) { 'todo' }
    let(:another_due_on) { (Time.zone.now + 3.days).to_date }

    it 'creates a task' do
      expect { post '/api/v1/tasks', params: { task: params } }.to change(Task, :count).by(1)
      expect(response).to have_http_status(200)
      expect(Task.last.name).to eq('タスク')
    end
  end

  describe 'PATCH /api/v1/tasks/:id' do
    let(:name) { 'タスク' }
    let(:status) { 'todo' }
    let(:due_on) { (Time.zone.now + 3.days).to_date }
    let(:another_name) { 'タスクかも？' }
    let(:another_status) { 'done' }
    let(:another_due_on) { (Time.zone.now + 5.days).to_date }

    before { task }

    it 'updates a task' do
      patch "/api/v1/tasks/#{task.id}", params: { task: params }
      expect(response).to have_http_status(200)
      task.reload
      expect(task.name).to eq('タスクかも？')
      expect(task.status).to eq('done')
      expect(task.due_on).to eq((Time.zone.now + 5.days).to_date)
    end
  end

  describe 'DELETE /api/v1/tasks/:id' do
    let(:name) { 'タスク' }
    let(:status) { 'todo' }
    let(:due_on) { (Time.zone.now + 3.days).to_date }

    before { task }

    it 'deletes a task' do
      expect { delete "/api/v1/tasks/#{task.id}" }.to change(Task, :count).by(-1)
      expect(response).to have_http_status(200)
    end
  end
end
