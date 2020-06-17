import React from 'react';
import TaskFormModal from './TaskFormModal';

class Task extends React.Component {
  state = {
    isTaskFormModalOpen: false
  }

  translateStatus = (status) => {
    switch (status) {
      case 'todo':
        return '未完了';
      case 'done':
        return '完了';
    }
  }

  handleClickEdit = (id) => {
    this.props.setModalTaskForm(id);
    this.setState({isTaskFormModalOpen: true});
  }

  handleClickModalClose = () => {
    this.setState({isTaskFormModalOpen: false});
    this.props.resetModalTaskForm();
  }

  render() {
    const id = this.props.taskData.id;
    const name = this.props.taskData.name;
    const dueOn = new Date(this.props.taskData.due_on.replace(/-/g, '/'));
    const dueDate = `${dueOn.getFullYear()}年${dueOn.getMonth() + 1}月${dueOn.getDate()}日`;
    const createdAt = new Date(this.props.taskData.created_at);
    const createdDate = `${createdAt.getFullYear()}年${createdAt.getMonth() + 1}月${createdAt.getDate()}日`;
    const status = this.props.taskData.status;
    const translatedStatus = this.translateStatus(this.props.taskData.status);
    const isTaskFormModalOpen = this.state.isTaskFormModalOpen;

    return(
      <div className='task'>
        <h2 className='task__name'>
          {name}
        </h2>
        <div className='task-body'>
          <div className='task-body-info'>
            <div className='task-body-info-due-date'>
              <div className='task-body-info-due-date__label'>
                期限：
              </div>
              <div className='task-body-info-due-date__value'>
                {dueDate}
              </div>
            </div>
            <div className='task-body-info-created-date'>
              <div className='task-body-info-created-date__label'>
                作成日：
              </div>
              <div className='task-body-info-created-date__value'>
                {createdDate}
              </div>
            </div>
          </div>
          <div className='task-body-buttons'>
            <div className='task-body-buttons-top'>
              <button className={`task-body-buttons-top__status--${status}`}
                onClick={() => {this.props.toggleStatus(id, status)}}>
                {translatedStatus}
              </button>
            </div>
            <div className='task-body-buttons-bottom'>
              <button className='task-body-buttons-bottom__edit'
                onClick={() => {this.handleClickEdit(id)}}>
                編集
              </button>
              <button className='task-body-buttons-bottom__delete'
                onClick={() => {this.props.removeTask(id)}}>
                削除
              </button>
            </div>
          </div>
        </div>
        <TaskFormModal
          id={id}
          isTaskFormModalOpen={isTaskFormModalOpen}
          handleClickModalClose={this.handleClickModalClose}
          modalTaskFormData={this.props.modalTaskFormData}
          handleModalTaskFormChange={this.props.handleModalTaskFormChange}
          handleModalTaskFormSubmit={this.props.handleModalTaskFormSubmit} />
      </div>
    );
  }
}

export default Task;
