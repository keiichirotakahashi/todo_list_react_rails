import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {
  render() {
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
}

export default Header;
