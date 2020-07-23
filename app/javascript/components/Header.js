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
        <div className='header-navi__logout'>
          <a rel='nofollow' data-method='delete' href='/logout'>
            ログアウト
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
