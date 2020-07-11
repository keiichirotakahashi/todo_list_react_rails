import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return(
    <header className='header'>
      <div className='header-navi'>
        <h1 className='header-navi__logo'>
          <Link to='/' replace>
            ToDoリスト
          </Link>
        </h1>
      </div>
    </header>
  );
}

export default Header;
