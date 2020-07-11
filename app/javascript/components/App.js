import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';

const App = () => {
  return(
    <React.Fragment>
      <Router>
        <Route path='/'>
          <Header />
          <Main />
          <Footer />
        </Route>
      </Router>
    </React.Fragment>
  );
}

export default App;
