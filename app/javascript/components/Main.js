import React, { useState } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Flash from './Flash';
import ProjectTop from './ProjectTop';
import Project from './Project';

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
        <Router>
          <Route exact path='/'
            render={() => (
              <ProjectTop showErrorFlash={showErrorFlash} />
            )} />
          <Route exact path='/projects/:id'
            render={(routeProps) => (
              <Project
                match={routeProps.match}
                showNoticeFlash={showNoticeFlash}
                showErrorFlash={showErrorFlash}
                removeFlashNow={removeFlashNow} />
            )} />
        </Router>
      </div>
    </main>
  );
}

export default Main;
