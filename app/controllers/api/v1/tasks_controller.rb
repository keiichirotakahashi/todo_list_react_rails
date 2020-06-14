class Api::V1::TasksController < Api::V1::BaseController
  before_action :set_task, only: %i[show update destroy]

  def index
    tasks = Task.order(created_at: :desc)
    render status: 200, json: { status: 200, data: tasks }
  end

  def show
    render status: 200, json: { status: 200, data: @task }
  end

  def create
    task = Task.new(task_params)
    if task.save
      render status: 200, json: { status: 200, message: "#{task.name}を作成しました。", data: task }
    else
      render status: 400, json: {
        status: 400, message: 'ToDoの作成に失敗しました。', data: task.errors.full_messages
      }
    end
  end

  def update
    if @task.update(task_params)
      render status: 200, json: { status: 200, message: "#{@task.name}を更新しました。", data: @task }
    else
      render status: 400, json: {
        status: 400,
        message: "#{@task.attribute_in_database(:name)}の更新に失敗しました。",
        data: @task.errors.full_messages
      }
    end
  end

  def destroy
    @task.destroy
    render status: 200, json: { status: 200, message: "#{@task.name}を削除しました。", data: @task }
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:name, :status, :due_on)
  end
end
