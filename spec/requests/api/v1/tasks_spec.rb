require 'rails_helper'

RSpec.describe 'Api::V1::Tasks', type: :request do
  let(:user) { create(:user) }
  let(:another_user) { create(:user) }
  let(:project) { create(:project, name: 'テストプロジェクト', user: user) }
  let(:default_task) do
    create(
      :task,
      name: 'テストタスク',
      due_on: (Time.zone.now + 3.days).to_date,
      project: project
    )
  end
  let(:name_attribute) { nil }
  let(:status_attribute) { nil }
  let(:due_on_attribute) { nil }
  let(:project_id_attribute) { nil }
  let(:task_attributes) do
    attributes_for(
      :task,
      name: name_attribute,
      status: status_attribute,
      due_on: due_on_attribute,
      project_id: project_id_attribute
    )
  end

  describe 'GET /api/v1/projects/:project_id/tasks' do
    before do
      2.times do |i|
        Task.create(name: "タスク#{i}", due_on: (Time.zone.now + 3.days).to_date, project: project)
      end
    end

    context 'as an authenticated user' do
      before { sign_in user }

      it 'loads two tasks' do
        get "/api/v1/projects/#{project.id}/tasks"
        expect(response).to have_http_status 200
        json = JSON.parse(response.body)
        expect(json.length).to eq 2
      end
    end

    context 'as a guest' do
      subject do
        get "/api/v1/projects/#{project.id}/tasks"
        response
      end

      it { is_expected.to have_http_status 401 }
    end
  end

  describe 'GET /api/v1/projects/:project_id/tasks/:id' do
    context 'as an authenticated user' do
      before { sign_in user }

      it 'loads a task' do
        get "/api/v1/projects/#{project.id}/tasks/#{default_task.id}"
        expect(response).to have_http_status 200
        json = JSON.parse(response.body)
        expect(json['name']).to eq 'テストタスク'
      end
    end

    context 'as an authenticated but not authorized user' do
      before { sign_in another_user }

      subject do
        get "/api/v1/projects/#{project.id}/tasks/#{default_task.id}"
        response
      end

      it { is_expected.to have_http_status 403 }
    end

    context 'as a guest' do
      subject do
        get "/api/v1/projects/#{project.id}/tasks/#{default_task.id}"
        response
      end

      it { is_expected.to have_http_status 401 }
    end
  end

  describe 'POST /api/v1/projects/#{project.id}/tasks' do
    context 'as an authenticated user' do
      before { sign_in user }

      context 'when attributes are valid' do
        let(:name_attribute) { 'テストプロジェクト' }
        let(:status_attribute) { Task.statuses.key(1) }
        let(:due_on_attribute) { (Time.zone.now + 3.days).to_date }
        let(:project_id_attribute) { project.id }

        it 'creates a task' do
          expect do
            post "/api/v1/projects/#{project.id}/tasks", params: { task: task_attributes }
          end.to change(Task, :count).by 1
          expect(response).to have_http_status 200
          expect(Task.last.name).to eq 'テストプロジェクト'
        end
      end

      context 'when attributes are not valid' do
        let(:name_attribute) { nil }
        let(:status_attribute) { nil }
        let(:due_on_attribute) { nil }
        let(:project_id_attribute) { nil }

        it 'does not create a task' do
          expect do
            post "/api/v1/projects/#{project.id}/tasks", params: { task: task_attributes }
          end.to change(Task, :count).by 0
          expect(response).to have_http_status 400
        end
      end
    end

    context 'as a guest' do
      subject do
        post "/api/v1/projects/#{project.id}/tasks", params: { task: task_attributes }
        response
      end

      let(:name_attribute) { 'テストプロジェクト' }
      let(:status_attribute) { Task.statuses.key(1) }
      let(:due_on_attribute) { (Time.zone.now + 3.days).to_date }
      let(:project_id_attribute) { project.id }

      it { is_expected.to have_http_status 401 }
    end
  end

  describe 'Patch /api/v1/projects/#{project.id}/tasks/:id' do
    context 'as an authenticated user' do
      before { sign_in user }

      context 'when attributes are valid' do
        let(:name_attribute) { '新しいテストタスク' }
        let(:status_attribute) { Task.statuses.key(2) }
        let(:due_on_attribute) { (Time.zone.now + 5.days).to_date }
        let(:project_id_attribute) { project.id }

        it 'updates a task' do
          patch "/api/v1/projects/#{project.id}/tasks/#{default_task.id}", params: { task: task_attributes }
          expect(response).to have_http_status 200
          default_task.reload
          expect(default_task.name).to eq '新しいテストタスク'
          expect(default_task.status).to eq Task.statuses.key(2)
          expect(default_task.due_on).to eq (Time.zone.now + 5.days).to_date
        end
      end

      context 'when attributes are not valid' do
        subject do
          patch "/api/v1/projects/#{project.id}/tasks/#{default_task.id}", params: { task: task_attributes }
          response
        end
        
        let(:name_attribute) { nil }
        let(:status_attribute) { nil }
        let(:due_on_attribute) { nil }
        let(:project_id_attribute) { nil }

        it { is_expected.to have_http_status 400 }
      end
    end

    context 'as an authenticated but not authorized user' do
      before { sign_in another_user }

      subject do
        patch "/api/v1/projects/#{project.id}/tasks/#{default_task.id}", params: { task: task_attributes }
        response
      end

      let(:name_attribute) { '新しいテストタスク' }
      let(:status_attribute) { Task.statuses.key(2) }
      let(:due_on_attribute) { (Time.zone.now + 5.days).to_date }
      let(:project_id_attribute) { project.id }

      it { is_expected.to have_http_status 403 }
    end

    context 'as a guest' do
      subject do
        patch "/api/v1/projects/#{project.id}/tasks/#{default_task.id}", params: { task: task_attributes }
        response
      end

      let(:name_attribute) { '新しいテストタスク' }
      let(:status_attribute) { Task.statuses.key(2) }
      let(:due_on_attribute) { (Time.zone.now + 5.days).to_date }
      let(:project_id_attribute) { project.id }

      it { is_expected.to have_http_status 401 }
    end
  end

  describe 'DELETE /api/v1/projects/#{project.id}/tasks/:id' do
    context 'as an authenticated user' do
      before do
        default_task
        sign_in user
      end

      it 'deletes a task' do
        expect { delete "/api/v1/projects/#{project.id}/tasks/#{default_task.id}" }.to change(Task, :count).by -1
        expect(response).to have_http_status 200
      end
    end

    context 'as an authenticated but not authorized user' do
      before do
        default_task
        sign_in another_user
      end

      it 'does not delete a task' do
        expect { delete "/api/v1/projects/#{project.id}/tasks/#{default_task.id}" }.to change(Task, :count).by 0
        expect(response).to have_http_status 403
      end
    end

    context 'as a guest' do
       before { default_task }

      it 'does not delete a task' do
        expect { delete "/api/v1/projects/#{project.id}/tasks/#{default_task.id}" }.to change(Task, :count).by 0
        expect(response).to have_http_status 401
      end
    end
  end
end
