import React from 'react';

const Header = () => {
  return(
    <header className='header'>
      <div className='header-navi'>
        <h1 className='header-navi__logo'>
          <a href='/'>
            ToDoリスト
          </a>
        </h1>
      </div>
    </header>
  );
}

export default Header;
