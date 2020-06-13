import React from 'react';

class Footer extends React.Component {
  render() {
    return(
      <footer className='footer'>
        <div className='footer-navi'>
          <div className='footer-navi__logo'>
            ToDoリスト
          </div>
          <div className='footer-navi__copyright'>
            Copyright &copy;2020 Keiichiro Takahashi
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
