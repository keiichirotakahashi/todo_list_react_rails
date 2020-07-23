import React from 'react';

const FormErrors = props => {
  const formErrors = props.formErrorsData;

  const formattedFormErrors = formErrors.map((error, index) =>
    <div key={index} className='form-errors__message'>
      {error}
    </div>
  );

  return (
    <React.Fragment>
      {
        formErrors.length === 0 ? '' : (
          <div className='form-errors'>
            {formattedFormErrors}
          </div>
        )
      }
    </React.Fragment>
  );
};

export default FormErrors;
