import React from 'react';

const FormErrors = (props) => {
  const formErrors = props.formErrorsData;
  let formErrorsMessage;

  const formattedFormErrors = formErrors.map((error, index) =>
    <div key={index} className='form-errors__message'>
      {error}
    </div>
  );

  if (formErrors.length) {
    formErrorsMessage = (
      <div className='form-errors'>
        {formattedFormErrors}
      </div>
    )
  }

  return (
    <React.Fragment>
      {formErrorsMessage}
    </React.Fragment>
  );
}

export default FormErrors;
