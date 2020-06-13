import React from 'react';

class Flash extends React.Component {
  render() {
    const flash = this.props.flashData;

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
  }
}

export default Flash;
