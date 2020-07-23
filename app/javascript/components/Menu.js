import React from 'react';

const Menu = props => {
  const id = props.id;

  return (
    <div className='menu'>
      <div className='menu__item'
        onClick={() => {props.handleClickEdit()}}>
        編集
      </div>
      <div className='menu__item'
        onClick={() => {props.removeProject(id)}}>
        削除
      </div>
    </div>
  );
};

export default Menu;
