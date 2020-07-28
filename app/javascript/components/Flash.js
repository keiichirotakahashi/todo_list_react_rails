import React, { useMemo } from 'react';

const Flash = props => {
  const { isVisible, status, message } = props.flashData;

  const isVisibleClassName = useMemo(() => {
    if (isVisible) return 'is-visible';
    return '';
  }, [isVisible]);

  return (
    <div className={`flash ${isVisibleClassName}`}>
      <div className={`flash__message--${status}`}>
        {message}
      </div>
    </div>
  );
};

export default Flash;
