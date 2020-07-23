import React from 'react';
import FormErrors from './FormErrors';

const TaskForm = props => {
  const formName = props.formName;
  const buttonText = props.buttonText;
  const id = props.id ? props.id : null;
  const { name, due_on } = props.taskFormData;
  const formErrors = props.formErrorsData;

  return(
    <div className='task-form'>
      <h2 className='task-form__name'>
        {formName}
      </h2>
      <form className='task-form-body'
        onSubmit={() => {props.handleTaskFormSubmit(event, id)}}>
        <div className='task-form-body-fields'>
          <FormErrors formErrorsData={formErrors} />
          <div className='task-form-body-fields-name'>
            <div className='task-form-body-fields-name__label'>
              ToDo名
            </div>
            <div className='task-form-body-fields-name__value'>
              <input type='text'
                name='name'
                value={name}
                onChange={() => {props.handleTaskFormChange(event)}} />
            </div>
          </div>
          <div className='task-form-body-fields-due-date'>
            <div className='task-form-body-fields-due-date__label'>
              期限
            </div>
            <div className='task-form-body-fields-due-date__value'>
              <input type='date'
                name='due_on'
                value={due_on}
                onChange={() => {props.handleTaskFormChange(event)}} />
            </div>
          </div>
        </div>
        <div className='task-form-body-buttons'>
          <button className='task-form-body-buttons__submit'
            type='submit'>
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
