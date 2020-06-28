import React, { useState } from 'react';
import TaskFormModal from './TaskFormModal';

const Task = (props) => {
  const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false);
  const id = props.taskData.id;
  const name = props.taskData.name;
  const dueOn = new Date(props.taskData.due_on.replace(/-/g, '/'));
  const dueDate = `${dueOn.getFullYear()}年${dueOn.getMonth() + 1}月${dueOn.getDate()}日`;
  const createdAt = new Date(props.taskData.created_at);
  const createdDate = `${createdAt.getFullYear()}年${createdAt.getMonth() + 1}月${createdAt.getDate()}日`;
  const status = props.taskData.status;

  const translateStatus = (status) => {
    switch (status) {
      case 'todo':
        return '未完了';
      case 'done':
        return '完了';
    }
  }

  const handleClickEdit = (id) => {
    props.buildModalTaskForm(id);
    setIsTaskFormModalOpen(true);
  }

  const handleClickModalClose = () => {
    setIsTaskFormModalOpen(false);
    props.resetModalTaskForm();
    props.removeModalTaskFormErrors();
  }

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
              onClick={() => {props.toggleStatus(id, status)}}>
              {translateStatus(props.taskData.status)}
            </button>
          </div>
          <div className='task-body-buttons-bottom'>
            <button className='task-body-buttons-bottom__edit'
              onClick={() => {handleClickEdit(id)}}>
              編集
            </button>
            <button className='task-body-buttons-bottom__delete'
              onClick={() => {props.removeTask(id)}}>
              削除
            </button>
          </div>
        </div>
      </div>
      <TaskFormModal
        id={id}
        isTaskFormModalOpen={isTaskFormModalOpen}
        handleClickModalClose={handleClickModalClose}
        modalTaskFormData={props.modalTaskFormData}
        formErrorsData={props.formErrorsData}
        handleModalTaskFormChange={props.handleModalTaskFormChange}
        handleModalTaskFormSubmit={props.handleModalTaskFormSubmit} />
    </div>
  );
}

export default Task;
