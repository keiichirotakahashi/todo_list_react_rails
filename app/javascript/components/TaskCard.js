import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import TaskForm from './TaskForm';

const TaskCard = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const id = props.taskData.id;
  const name = props.taskData.name;
  const dueOn = props.taskData.due_on;
  const dueDateString = useMemo(() => {
    const dueDate = new Date(dueOn.replace(/-/g, '/'));
    return `${dueDate.getFullYear()}年${dueDate.getMonth() + 1}月${dueDate.getDate()}日`;
  }, [dueOn]);
  const createdAt = props.taskData.created_at;
  const createdDateString = useMemo(() => {
    const createdDate = new Date(createdAt);
    return `${createdDate.getFullYear()}年${createdDate.getMonth() + 1}月${createdDate.getDate()}日`;
  }, [createdAt]);
  const status = props.taskData.status;
  const translatedStatus = useMemo(() => {
    switch (status) {
      case 'todo':
        return '未完了';
      case 'done':
        return '完了';
    }
  }, [status]); 
  const modalTaskForm = props.modalTaskFormData;
  const modalTaskFormErrors = props.modalTaskFormErrorsData;

  const handleClickEdit = id => {
    props.buildModalTaskForm(id);
    setIsModalOpen(true);
  };

  const handleClickModalClose = () => {
    setIsModalOpen(false);
    props.resetModalTaskForm();
    props.removeModalTaskFormErrors();
  };

  let modal;
  if (isModalOpen) {
    modal = (
      <Modal
        modalBody={
          <TaskForm
            formName={'ToDoを更新する'}
            buttonText={'保存'}
            id={id}
            taskFormData={modalTaskForm}
            formErrorsData={modalTaskFormErrors}
            handleTaskFormChange={props.handleModalTaskFormChange}
            handleTaskFormSubmit={props.handleModalTaskFormSubmit} />
        }
        handleClickModalClose={handleClickModalClose} />
    );
  }

  return(
    <div className='task-card'>
      <h2 className='task-card__name'>
        {name}
      </h2>
      <div className='task-card-body'>
        <div className='task-card-body-info'>
          <div className='task-card-body-info-due-date'>
            <div className='task-card-body-info-due-date__label'>
              期限：
            </div>
            <div className='task-card-body-info-due-date__value'>
              {dueDateString}
            </div>
          </div>
          <div className='task-card-body-info-created-date'>
            <div className='task-card-body-info-created-date__label'>
              作成日：
            </div>
            <div className='task-card-body-info-created-date__value'>
              {createdDateString}
            </div>
          </div>
        </div>
        <div className='task-card-body-buttons'>
          <div className='task-card-body-buttons-top'>
            <button className={`task-card-body-buttons-top__status--${status}`}
              onClick={() => {props.toggleStatus(id, status)}}>
              {translatedStatus}
            </button>
          </div>
          <div className='task-card-body-buttons-bottom'>
            <button className='task-card-body-buttons-bottom__edit'
              onClick={() => {handleClickEdit(id)}}>
              編集
            </button>
            <button className='task-card-body-buttons-bottom__delete'
              onClick={() => {props.removeTask(id)}}>
              削除
            </button>
          </div>
        </div>
      </div>
      {modal}
    </div>
  );
};

export default TaskCard;
