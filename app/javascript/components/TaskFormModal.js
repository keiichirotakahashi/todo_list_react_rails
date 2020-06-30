import React from 'react';
import FormErrors from './FormErrors';

const TaskFormModal = (props) => {
  const id = props.id;
  const { name, due_on } = props.modalTaskFormData;
  const formErrors = props.formErrorsData;
  let taskFormModal;

  if (props.isTaskFormModalOpen) {
    taskFormModal = (
      <div className='task-form-modal'>
        <div className='task-form-modal-close'>
          <span className='task-form-modal-close__button'
            onClick={() => {props.handleClickModalClose()}}>
            ×
          </span>
        </div>
        <div className='task-form-modal-form'>
          <h2 className='task-form-modal-form__name'>
            ToDoを編集する
          </h2>
          <form className='task-form-modal-form-body'
            onSubmit={() => {props.handleModalTaskFormSubmit(event, id)}}>
            <div className='task-form-modal-form-body-fields'>
              <FormErrors formErrorsData={formErrors} />
              <div className='task-form-modal-form-body-fields-name'>
                <div className='task-form-modal-form-body-fields-name__label'>
                  ToDo名
              </div>
                <div className='task-form-modal-form-body-fields-name__value'>
                  <input type='text'
                    name='name'
                    value={name}
                    onChange={() => {props.handleModalTaskFormChange(event)}} />
                </div>
              </div>
              <div className='task-form-modal-form-body-fields-due-date'>
                <div className='task-form-modal-form-body-fields-due-date__label'>
                  期限
              </div>
                <div className='task-form-modal-form-body-fields-due-date__value'>
                  <input type='date'
                    name='due_on'
                    value={due_on}
                    onChange={() => {props.handleModalTaskFormChange(event)}} />
                </div>
              </div>
            </div>
            <div className='task-form-modal-form-body-buttons'>
              <button className='task-form-modal-form-body-buttons__submit'
                type='submit'>
                保存
            </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return(
    <React.Fragment>{taskFormModal}</React.Fragment>
  );
}

export default TaskFormModal;
