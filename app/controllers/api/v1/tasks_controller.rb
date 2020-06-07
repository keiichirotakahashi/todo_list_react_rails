class Api::V1::TasksController < Api::V1::BaseController
  before_action :set_task, only: %i[show update destroy]

  def index
    tasks = Task.order(created_at: :desc)
    render json: { data: tasks }
  end

  def show
    render json: { data: @task }
  end

  def create
    task = Task.new(task_params)
    if task.save
      render json: { message: "#{task.name}を作成しました。", data: task }
    else
      render json: { message: "#{task.name}の作成に失敗しました。", data: task.errors.full_messages }
    end
  end

  def update
    if @task.update(task_params)
      render json: { message: "#{@task.name}を更新しました。", data: @task }
    else
      render json: { message: "#{@task.name}の更新に失敗しました。", data: @task.errors.full_messages }
    end
  end

  def destroy
    @task.destroy
    render json: { message: "#{@task.name}を削除しました。", data: @task }
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:name, :status, :due_on)
  end
end
