import React from 'react';
import IconMore from 'images/icon_more.png';

const More = props => {
  return (
    <div className='more'>
      <img src={IconMore}
        className='more__icon'
        onClick={() => {props.handleClickMore()}} />
    </div>
  );
};

export default More;
