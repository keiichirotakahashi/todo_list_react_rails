import React, { useState } from 'react';
import Flash from './Flash';
import Task from './Task';

const Main = () => {
  const [flash, setFlash] = useState({
    isVisible: false,
    status: 'hidden',
    message: ''
  });
  let timer = null;

  const showNoticeFlash = (message) => {
    setFlash({
      isVisible: true,
      status: 'notice',
      message: message
    });
    removeFlashLater();
  }

  const showErrorFlash = (message) => {
    setFlash({
      isVisible: true,
      status: 'error',
      message: message ? message : 'エラーが発生しました。'
    });
    removeFlashLater();
  }

  const removeFlash = () => {
    setFlash({
      isVisible: false,
      status: 'hidden',
      message: ''
    });
  }

  const removeFlashNow = () => {
    clearTimeout(timer);
    removeFlash();
  }

  const removeFlashLater = () => {
    timer = setTimeout(() => { removeFlash() }, 3000);
  }

  return (
    <main className='main'>
      <Flash flashData={flash} />
      <div className='main-box'>
        <Task
          showNoticeFlash={showNoticeFlash}
          showErrorFlash={showErrorFlash}
          removeFlashNow={removeFlashNow} />
      </div>
    </main>
  );
}

export default Main;
