class Api::V1::TasksController < Api::V1::BaseController
  before_action :set_task, only: %i[show update destroy]

  def index
    tasks = Task.order(created_at: :desc)
    render json: tasks, status: :ok
  end

  def show
    render json: @task, status: :ok
  end

  def create
    task = Task.new(task_params)
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

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:name, :status, :due_on)
  end
end
