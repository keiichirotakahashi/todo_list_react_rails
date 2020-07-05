require 'rails_helper'

RSpec.describe 'Api::V1::Projects', type: :request do
  let(:user) { create(:user) }
  let(:another_user) { create(:user) }
  let(:default_project) { create(:project, name: 'テストプロジェクト', user: user) }
  let(:name_attribute) { nil }
  let(:user_id_attribute) { nil }
  let(:project_attributes) do
    attributes_for(:project, name: name_attribute, user_id: user_id_attribute)
  end

  describe 'GET /api/v1/projects' do
    before { 2.times { |i| Project.create(name: "プロジェクト#{i}", user: user) } }

    context 'as an authenticated user' do
      before { sign_in user }

      it 'loads two projects' do
        get '/api/v1/projects'
        expect(response).to have_http_status 200
        json = JSON.parse(response.body)
        expect(json.length).to eq 2
      end
    end

    context 'as a guest' do
      subject do
        get '/api/v1/projects'
        response
      end

      it { is_expected.to have_http_status 401 }
    end
  end

  describe 'GET /api/v1/projects/:id' do
    context 'as an authenticated user' do
      before { sign_in user }

      it 'loads a project' do
        get "/api/v1/projects/#{default_project.id}"
        expect(response).to have_http_status 200
        json = JSON.parse(response.body)
        expect(json['name']).to eq 'テストプロジェクト'
      end
    end

    context 'as an authenticated but not authorized user' do
      before { sign_in another_user }

      subject do
        get "/api/v1/projects/#{default_project.id}"
        response
      end

      it { is_expected.to have_http_status 403 }
    end

    context 'as a guest' do
      subject do
        get "/api/v1/projects/#{default_project.id}"
        response
      end

      it { is_expected.to have_http_status 401 }
    end
  end

  describe 'POST /api/v1/projects' do
    context 'as an authenticated user' do
      before { sign_in user }

      context 'when attributes are valid' do
        let(:name_attribute) { 'テストプロジェクト' }
        let(:user_id_attribute) { user.id }

        it 'creates a project' do
          expect do
            post '/api/v1/projects', params: { project: project_attributes }
          end.to change(Project, :count).by 1
          expect(response).to have_http_status 200
          expect(Project.last.name).to eq 'テストプロジェクト'
        end
      end

      context 'when attributes are not valid' do
        let(:name_attribute) { nil }
        let(:user_id_attribute) { nil }

        it 'does not create a project' do
          expect do
            post '/api/v1/projects', params: { project: project_attributes }
          end.to change(Project, :count).by 0
          expect(response).to have_http_status 400
        end
      end
    end

    context 'as a guest' do
      subject do
        post '/api/v1/projects', params: { project: project_attributes }
        response
      end

      let(:name_attribute) { 'テストプロジェクト' }
      let(:user_id_attribute) { user.id }

      it { is_expected.to have_http_status 401 }
    end
  end

  describe 'Patch /api/v1/projects/:id' do
    context 'as an authenticated user' do
      before { sign_in user }

      context 'when attributes are valid' do
        let(:name_attribute) { '新しいテストプロジェクト' }
        let(:user_id_attribute) { user.id }

        it 'updates a project' do
          patch "/api/v1/projects/#{default_project.id}", params: { project: project_attributes }
          expect(response).to have_http_status 200
          default_project.reload
          expect(default_project.name).to eq '新しいテストプロジェクト'
        end
      end

      context 'when attributes are not valid' do
        subject do
          patch "/api/v1/projects/#{default_project.id}", params: { project: project_attributes }
          response
        end
        
        let(:name_attribute) { nil }
        let(:user_id_attribute) { nil }

        it { is_expected.to have_http_status 400 }
      end
    end

    context 'as an authenticated but not authorized user' do
      before { sign_in another_user }

      subject do
        patch "/api/v1/projects/#{default_project.id}", params: { project: project_attributes }
        response
      end

      let(:name_attribute) { '新しいテストプロジェクト' }
      let(:user_id_attribute) { user.id }

      it { is_expected.to have_http_status 403 }
    end

    context 'as a guest' do
      subject do
        patch "/api/v1/projects/#{default_project.id}", params: { project: project_attributes }
        response
      end

      let(:name_attribute) { '新しいテストプロジェクト' }
      let(:user_id_attribute) { user.id }

      it { is_expected.to have_http_status 401 }
    end
  end

  describe 'DELETE /api/v1/projects/:id' do
    context 'as an authenticated user' do
      before do
        default_project
        sign_in user
      end

      it 'deletes a project' do
        expect { delete "/api/v1/projects/#{default_project.id}" }.to change(Project, :count).by -1
        expect(response).to have_http_status 200
      end
    end

    context 'as an authenticated but not authorized user' do
      before do
        default_project
        sign_in another_user
      end

      it 'does not delete a project' do
        expect { delete "/api/v1/projects/#{default_project.id}" }.to change(Project, :count).by 0
        expect(response).to have_http_status 403
      end
    end

    context 'as a guest' do
       before { default_project }

      it 'does not delete a project' do
        expect { delete "/api/v1/projects/#{default_project.id}" }.to change(Project, :count).by 0
        expect(response).to have_http_status 401
      end
    end
  end
end
