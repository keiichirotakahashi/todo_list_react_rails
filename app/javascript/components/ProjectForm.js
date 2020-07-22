import React from 'react';
import FormErrors from './FormErrors';

const ProjectForm = props => {
  const formName = props.formName;
  const buttonText = props.buttonText;
  const id = props.id ? props.id : null;
  const { name } = props.projectFormData;
  const formErrors = props.formErrorsData;

  return (
    <div className='project-form'>
      <h2 className='project-form__name'>
        {formName}
      </h2>
      <FormErrors formErrorsData={formErrors} />
      <form className='project-form-body'
        onSubmit={() => {props.handleProjectFormSubmit(event, id)}}>
        <div className='project-form-body-fields'>
          <div className='project-form-body-fields-name'>
            <div className='project-form-body-fields-name__label'>
              プロジェクト名
              </div>
            <div className='project-form-body-fields-name__value'>
              <input type='text'
                name='name'
                value={name}
                onChange={() => {props.handleProjectFormChange(event)}} />
            </div>
          </div>
        </div>
        <div className='project-form-body-buttons'>
          <button className='project-form-body-buttons__submit'
            type='submit'>
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
