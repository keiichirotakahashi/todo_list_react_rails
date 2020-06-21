import React from 'react';

const Flash = (props) => {
  const flash = props.flashData;

  const isVisibleClass = (isVisible) => {
    if (isVisible) {
      return 'is-visible';
    } else {
      return '';
    }
  };

  return(
    <div className={`flash ${isVisibleClass(flash.isVisible)}`}>
      <div className={`flash__message--${flash.status}`}>
        {flash.message}
      </div>
    </div>
  );
};

export default Flash;
