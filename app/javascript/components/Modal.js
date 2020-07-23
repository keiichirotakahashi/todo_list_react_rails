import React from 'react';

const Modal = (props) => {
  return(
    <div className='modal'>
      <div className='modal-close'>
        <span className='modal-close__button'
          onClick={() => { props.handleClickModalClose() }}>
          ×
          </span>
      </div>
      <div className='modal-body'>
        {props.modalBody}
      </div>
    </div>
  );
};

export default Modal;
