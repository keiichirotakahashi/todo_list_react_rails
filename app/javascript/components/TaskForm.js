import React from 'react';

class TaskForm extends React.Component {
  render() {
    const { name, due_on } = this.props.taskFormData;

    return(
      <div className='task-form'>
        <h2 className='task-form__name'>
          新しいToDoを作成する
        </h2>
        <form className='task-form-body'
          onSubmit={() => {this.props.handleTaskFormSubmit(event)}}>
          <div className='task-form-body-fields'>
            <div className='task-form-body-fields-name'>
              <div className='task-form-body-fields-name__label'>
                ToDo名
              </div>
              <div className='task-form-body-fields-name__value'>
                <input type='text'
                  name='name'
                  value={name}
                  onChange={() => {this.props.handleTaskFormChange(event)}} />
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
                  onChange={() => {this.props.handleTaskFormChange(event)}} />
              </div>
            </div>
          </div>
          <div className='task-form-body-buttons'>
            <button className='task-form-body-buttons__submit'
              type='submit'>
              作成
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default TaskForm;
