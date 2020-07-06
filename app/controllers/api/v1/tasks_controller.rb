class Api::V1::TasksController < Api::V1::BaseController
  before_action :set_project
  before_action :set_task, only: %i[show update destroy]

  def index
    tasks = Task.where(project_id: @project.id).order(created_at: :desc)
    render json: tasks, status: :ok
  end

  def show
    render json: @task, status: :ok
  end

  def create
    task = @project.tasks.build(task_params)
    if task.save
      render json: task, status: :ok
    else
      render json: task.errors.full_messages, status: :bad_request
    end
  end

  def update
    if @task.update(task_params)
      render json: @task, status: :ok
    else
      render json: @task.errors.full_messages, status: :bad_request
    end
  end

  def destroy
    @task.destroy
    render json: @task, status: :ok
  end

  private

  def set_project
    @project = Project.find(params[:project_id])
    return @project if @project.user_id == current_user.id
    render json: 'Forbidden request', status: :forbidden and return
  end

  def set_task
    @task = Task.where(project_id: @project.id).find(params[:id])
  end

  def task_params
    params.require(:task).permit(:name, :status, :due_on)
  end
end
